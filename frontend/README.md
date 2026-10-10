# Frontend workspace

React/TypeScript application files belong here. Issue #13 introduces the shell,
build, types, and tests after repository tooling is reviewed.

Install from the repository root with `npm ci`. Add frontend dependencies from the
root using `npm install --workspace @insync/frontend --save-exact package@version`.
The root `package-lock.json` is authoritative; there is no nested lock or dev server yet.
