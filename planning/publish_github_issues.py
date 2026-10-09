#!/usr/bin/env python3
"""Publish the approved backlog with gh; default mode validates local files only.

python planning/publish_github_issues.py --check-access
python planning/publish_github_issues.py --publish
python planning/publish_github_issues.py --link-dependencies

Uses existing gh authentication. Never provide credentials in this file.
Reconciles remote markers before writes and records progress after each issue.
"""

import argparse
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / 'GITHUB_ISSUES.json'
STATE = ROOT / 'PUBLICATION_STATE.json'
REPO = 'Haadiyah-Zafar/InSyncc'
PREFIX = f'repos/{REPO}'
MARKER = re.compile(r'<!-- insync-plan-id: (P[0-7]-\d{2});')
PLAN_ID = re.compile(r'\bP[0-7]-\d{2}\b')


def save(path, data):
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(data, indent=2) + '\n')
    temp.replace(path)


def api(endpoint, method='GET', payload=None, paginate=False):
    command = ['gh', 'api', '--hostname', 'github.com', '--method', method,
               '-H', 'Accept: application/vnd.github+json', endpoint]
    if paginate:
        command += ['--paginate']
    if payload is not None:
        command += ['--input', '-']
    result = subprocess.run(command, input=json.dumps(payload) if payload is not None else None,
                            text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(f'{method} {endpoint} failed: {result.stderr.strip()}')
    # Serialize writes; never automatically retry an ambiguous creation result.
    if method != 'GET':
        time.sleep(1)
    if paginate:
        decoder = json.JSONDecoder()
        remaining = result.stdout.lstrip()
        items = []
        while remaining:
            page, end = decoder.raw_decode(remaining)
            if not isinstance(page, list):
                raise ValueError(f'Expected an array page from {endpoint}')
            items.extend(page)
            remaining = remaining[end:].lstrip()
        return items
    return json.loads(result.stdout) if result.stdout.strip() else None


def validate(data):
    if data.get('repository') != REPO or data.get('approval_status') != 'approved':
        raise ValueError('Expected the approved InSyncc backlog.')
    issues = data['issues']
    if len(issues) != 60 or data.get('version') != '0.2':
        raise ValueError('Expected approved plan v0.2 with 60 issues.')
    by_id = {i['id']: i for i in issues}
    if len(by_id) != len(issues):
        raise ValueError('Duplicate planning IDs.')
    ordered, visiting, visited = [], set(), set()

    def visit(key):
        if key in visiting:
            raise ValueError(f'Dependency cycle at {key}')
        if key in visited:
            return
        if key not in by_id:
            raise ValueError(f'Unknown dependency {key}')
        visiting.add(key)
        issue = by_id[key]
        for dependency in issue['start_after'] + issue['close_after']:
            visit(dependency)
        if not MARKER.search(issue['body']) or MARKER.search(issue['body']).group(1) != key:
            raise ValueError(f'Missing/mismatched stable marker for {key}')
        visiting.remove(key)
        visited.add(key)
        ordered.append(issue)

    for key in by_id:
        visit(key)
    return ordered


def body_with_links(issue, mapping):
    lines = []
    for line in issue['body'].splitlines():
        if not line.startswith('<!--'):
            line = PLAN_ID.sub(lambda m: f'[{m[0]} (#{mapping[m[0]]["number"]})]'
                              f'({mapping[m[0]]["html_url"]})' if m[0] in mapping else m[0], line)
        lines.append(line)
    lines += ['', '**Planning status**', '',
              'Plan v0.2 and issue publication were approved on 9 October 2026. '
              'The specific design decisions in P0 still require their own approval.',
              'Claim one Ready issue at a time. Workstreams A/B/C are suggestions, not GitHub assignees.']
    return '\n'.join(lines)


def inventory():
    repo = api(PREFIX)
    if not repo.get('has_issues'):
        raise ValueError('Repository issues are disabled; no settings were changed.')
    issues = api(f'{PREFIX}/issues?state=all&per_page=100', paginate=True)
    labels = api(f'{PREFIX}/labels?per_page=100', paginate=True)
    milestones = api(f'{PREFIX}/milestones?state=all&per_page=100', paginate=True)
    return issues, labels, milestones


def remote_mapping(remote, planned):
    mapping = {}
    by_title = {i['title']: i['id'] for i in planned}
    for item in remote:
        if 'pull_request' in item:
            continue
        match = MARKER.search(item.get('body') or '')
        key = match.group(1) if match else None
        if key:
            if key in mapping:
                raise ValueError(f'Multiple remote issues use marker {key}; reconcile before publishing.')
            mapping[key] = item
        elif item['title'] in by_title:
            raise ValueError(f'Existing #{item["number"]} has a planned title without its marker; '
                             'review it before creating a possible duplicate.')
    return mapping


def publish(data, ordered, remote, remote_labels, remote_milestones):
    mapping = remote_mapping(remote, ordered)
    state = json.loads(STATE.read_text()) if STATE.exists() else {'repository': REPO, 'issues': {}}
    if state.get('repository') != REPO:
        raise ValueError('Publication state belongs to another repository.')
    # If prior writes cannot be found remotely, stop instead of duplicating them.
    for key, previous in state.get('issues', {}).items():
        if key not in mapping or mapping[key]['number'] != previous['number']:
            raise ValueError(f'Previously recorded {key} is absent or changed remotely; inspect before retry.')

    labels = {item['name'].lower(): item for item in remote_labels}
    required = {label for issue in ordered for label in issue['labels']}
    required |= {'status:ready', 'status:blocked'}
    for name in sorted(required):
        if name.lower() not in labels:
            color = '0e8a16' if name == 'status:ready' else 'd93f0b' if name == 'status:blocked' else '1d76db'
            item = api(f'{PREFIX}/labels', 'POST',
                       {'name': name, 'color': color, 'description': 'InSync approved implementation backlog'})
            labels[name.lower()] = item
            print(f'Created label {name}', flush=True)

    milestones = {}
    for item in remote_milestones:
        if item['title'] in milestones:
            raise ValueError(f'Duplicate milestone title: {item["title"]}')
        milestones[item['title']] = item
    for title in dict.fromkeys(i['milestone_title'] for i in ordered):
        if title not in milestones:
            milestones[title] = api(f'{PREFIX}/milestones', 'POST',
                                    {'title': title, 'description': 'Approved InSync plan v0.2. '
                                     'Completion requires the issue acceptance checks and phase demonstration.'})
            print(f'Created milestone {title}', flush=True)

    data['publication_status'] = 'publishing'
    save(MANIFEST, data)
    for issue in ordered:
        key = issue['id']
        if key not in mapping:
            status = 'status:ready' if not issue['start_after'] else 'status:blocked'
            mapping[key] = api(f'{PREFIX}/issues', 'POST', {
                'title': issue['title'], 'body': body_with_links(issue, mapping),
                'milestone': milestones[issue['milestone_title']]['number'],
                'labels': issue['labels'] + [status]})
            print(f'Created {key}: {mapping[key]["html_url"]}', flush=True)
        item = mapping[key]
        issue['github_number'] = item['number']
        issue['github_url'] = item['html_url']
        state['issues'][key] = {'number': item['number'], 'url': item['html_url']}
        state['status'] = 'publishing'
        save(STATE, state)
        save(MANIFEST, data)

    for issue in ordered:
        item = mapping[issue['id']]
        expected = body_with_links(issue, mapping)
        # Preserve manually edited bodies: only update a known local draft or
        # the exact body this publisher previously wrote.
        previous_body = state['issues'][issue['id']].get('published_body')
        allowed_bodies = {issue['body'], expected, previous_body}
        # A first-pass body can have only already-created dependency links.
        stripped_remote = re.sub(r'\[(P[0-7]-\d{2}) \(#\d+\)\]\(https://github.com/[^)]+\)',
                                 r'\1', item.get('body') or '')
        plain_expected = body_with_links(issue, {})
        if item.get('body') not in allowed_bodies and stripped_remote != plain_expected:
            raise ValueError(f'#{item["number"]} has manual body changes; stopped to preserve them.')
        if item.get('body') != expected:
            api(f'{PREFIX}/issues/{item["number"]}', 'PATCH', {'body': expected})
        state['issues'][issue['id']]['published_body'] = expected
        save(STATE, state)

    verified = remote_mapping(api(f'{PREFIX}/issues?state=all&per_page=100', paginate=True), ordered)
    for issue in ordered:
        item = verified[issue['id']]
        expected_labels = set(issue['labels'])
        if (item['title'] != issue['title'] or item.get('body') != body_with_links(issue, mapping)
                or (item.get('milestone') or {}).get('title') != issue['milestone_title']
                or not expected_labels <= {v['name'] for v in item['labels']}):
            raise ValueError(f'Published issue {issue["id"]} did not match its expected fields.')
    state['status'] = data['publication_status'] = 'published_verified'
    save(STATE, state)
    save(MANIFEST, data)
    print(f'Verified {len(ordered)} issues, eight milestones, and linked dependency lists.')


def link_dependencies(data, ordered, remote):
    mapping = remote_mapping(remote, ordered)
    if not all(issue['id'] in mapping for issue in ordered):
        raise ValueError('Publish all issues before linking native dependencies.')
    state = json.loads(STATE.read_text())
    state['dependencies_status'] = 'linking'
    save(STATE, state)
    count = 0
    for issue in ordered:
        item = mapping[issue['id']]
        endpoint = f'{PREFIX}/issues/{item["number"]}/dependencies/blocked_by'
        dependencies = list(dict.fromkeys(issue['start_after'] + issue['close_after']))
        existing = api(endpoint + '?per_page=100', paginate=True)
        ids = {entry['id'] for entry in existing}
        for key in dependencies:
            blocker = mapping[key]
            if blocker['id'] not in ids:
                api(endpoint, 'POST', {'issue_id': blocker['id']})
                ids.add(blocker['id'])
        actual = api(endpoint + '?per_page=100', paginate=True) if dependencies else existing
        actual_ids = {entry['id'] for entry in actual}
        if not {mapping[key]['id'] for key in dependencies} <= actual_ids:
            raise ValueError(f'Dependency verification failed for {issue["id"]}')
        state['issues'][issue['id']]['native_dependency_numbers'] = [mapping[key]['number'] for key in dependencies]
        save(STATE, state)
        count += len(dependencies)
        print(f'Verified dependencies for {issue["id"]}: {len(dependencies)}', flush=True)
    state['dependencies_status'] = data['native_dependencies_status'] = 'published_verified'
    state['dependency_count'] = data['native_dependency_count'] = count
    save(STATE, state)
    save(MANIFEST, data)
    print(f'Verified {count} native dependency links across {len(ordered)} issues.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--check-access', action='store_true', help='Read GitHub inventory without writes')
    group.add_argument('--publish', action='store_true', help='Publish the already-approved backlog')
    group.add_argument('--link-dependencies', action='store_true', help='Link and verify native GitHub blockers')
    args = parser.parse_args()
    data = json.loads(MANIFEST.read_text())
    ordered = validate(data)
    print(f'Validated approved plan v0.2: {len(ordered)} issues; dependency graph is acyclic.', flush=True)
    if not (args.check_access or args.publish or args.link_dependencies):
        print('Local validation only. Use --check-access or --publish for GitHub operations.')
        return
    remote, labels, milestones = inventory()
    mapping = remote_mapping(remote, ordered)
    print(f'Read repository inventory; found {len(mapping)} planning markers.', flush=True)
    if args.publish:
        publish(data, ordered, remote, labels, milestones)
    elif args.link_dependencies:
        link_dependencies(data, ordered, remote)


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, ValueError, KeyError, OSError) as error:
        print(f'Stopped: {error}', file=sys.stderr)
        print('No automatic retry. Re-run after resolving the cause; remote markers prevent duplicate creation.',
              file=sys.stderr)
        sys.exit(1)
