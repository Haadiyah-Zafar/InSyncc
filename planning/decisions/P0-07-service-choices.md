# P0-07: Service choices, background execution, operations

**Issue:** [#8](https://github.com/Haadiyah-Zafar/InSyncc/issues/8) · **Prepared:** 3 Nov 2026 · **Start after:** none
**Status:** Approved by Anum on 3 Nov 2026 (see §1). Not yet built. Pool size (S2) still needs 10 working models before the demo.

---

## At a glance

| | |
|---|---|
| **Budget** | **Zero.** Everything must be free, including live model use and backups. |
| **Pilot size** | 1 teacher, up to 12 learners (later split into groups). |
| **Tutor reply time** | 95% under **20 s**. 45 s is the hard limit. |
| **Uptime** | 99.9% per month. |
| **Answer quality** | 95% minimum, scored against the uploaded material. |
| **Class dissolved** | Everything tied to the class is deleted. The teacher's account stays. |
| **Backups** | Encrypted, **weekly**, kept 7 days, stored privately, free. |
| **Embedding** | 2048 dimensions, no index for the pilot (approved). |
| **Still open** | Daily request cap on free OpenRouter models (50/day), pool size (8 of 10 needed), sleeping backend vs reply time |

---

## 1. Decisions

| ID | Topic | Recommendation | Status |
|---|---|---|---|
| S1 | Text gateway | OpenRouter free models only, behind an adapter | **Anum: approved (3 Nov 2026).** |
| S2 | Fallback pool (10–15 models) | Free models only. 8 working now, 3 busy, 2 removed (§4). Below the 10-model minimum until the busy ones recover. Free cap of 50 requests a day kept. | **Anum: approved (3 Nov 2026).** Free models only; 50-a-day cap accepted. The 10-model minimum still applies: the pool must reach 10 working models before the demo. |
| S3 | Embedding model | `nvidia/nemotron-3-embed-1b:free`. **Dimension 2048** (live check). **No index for the pilot** (§7, option B). | **Anum: model and option B confirmed** |
| S4 | File storage | Supabase Storage, free tier | **Anum: approved (3 Nov 2026).** |
| S5 | Upload formats and size | PDF, DOCX, Markdown, TXT; 10 MB max | **Anum: approved (3 Nov 2026).** |
| S6 | Chunking and retrieval | About 500 tokens, 50 overlap, top 3 chunks | **Anum: approved (3 Nov 2026).** |
| S7 | Background work | Postgres job table + worker inside the backend | **Anum: approved (3 Nov 2026).** |
| S8 | Timeouts and retries | 20 s per attempt, 2 retries, max 3 models per operation | **Anum: approved (3 Nov 2026).** |
| S8a | Deadlines | **45 s** interactive, **5 min** background | **Anum: confirmed** |
| S9 | Validation regeneration | 1 retry, inside the same cap as S8 | **Anum: approved (3 Nov 2026).** |
| S10 | Cancel and recovery | Job lease with expiry, idempotency key | **Anum: approved (3 Nov 2026).** |
| S11 | Dev and test setup | Docker Compose locally, separate free Supabase project | **Anum: approved (3 Nov 2026).** |
| S12 | Hosting | Free stack (§5). Render wake-up of 30 s to 2 min accepted. | **Anum: free stack and Render wake-up accepted (3 Nov 2026)** |
| S13 | Monitoring | Per-operation logs; count requests and tokens, not money | **Anum: approved (3 Nov 2026).** |
| S14 | Content reports | Student report → teacher review; no automatic removal | **Anum: approved (3 Nov 2026).** |
| S15 | Class dissolved | Delete everything tied to the class; teacher account stays (§2) | **Anum: confirmed. Scope approved as proposed.** |
| S16 | Backups | Encrypted **weekly** dump, private storage, **7-day** retention (§6) | **Anum: weekly and 7 days confirmed.** Method approved. |
| S17 | Secret names | §7 | **Anum: approved (3 Nov 2026).** |
| S18 | Budget | **$0** | **Anum: confirmed** |
| S19 | Pilot size | 1 teacher, up to 12 learners | **Anum: confirmed** |
| S20 | Reply time | 95% of tutor replies under **20 s** | **Anum: confirmed** |
| S21 | Uptime | 99.9% per calendar month | **Anum: confirmed** |
| S22 | Failure messages | Friendly wait-and-retry messages (§8) | **Anum: approved (3 Nov 2026), wording as listed in §8.** |
| S23 | Answer quality | 95% pass rate, rubric scoring against uploaded material (§2) | **Anum: 95% and method confirmed as proposed** |

---

## 2. Approved scope and open points

**Class dissolved (S15), approved as proposed.** When the teacher dissolves a class, delete:
- The class, its enrolments, and its groups.
- Learner records linked to the class: answers, progress, chats, hints.
- Uploaded material, its text chunks, and its embeddings.
- Agent memory and session state for the class (LangGraph checkpoints, Redis keys).
- Logs and reports that name learners from the class.

The teacher's own account stays. Backups age out within 7 days (S16).

**Quality scoring (S23), approved as proposed.**
- Before the pilot, write a test set of questions and expected answers from the uploaded material.
- Each answer is scored against a rubric: correct, and supported by a cited passage from the material.
- Pass rate = answers meeting the rubric ÷ answers evaluated. Target: 95%.
- The teacher checks a sample of scores by hand.

**Reply time (S20) and the retry rule.** A 20-second per-attempt timeout (S8) means any reply that needs a retry will already be past the 20 s target. In practice, 95% under 20 s needs most replies to succeed on the first attempt. This is a consequence to accept or change, not a conflict to resolve now.

**Still open:**
1. **Data-loss window: approved by Anum (3 Nov 2026).** With a weekly backup, up to 7 days of work could be lost if the database fails.
2. **Vector index:** approved as option B (no index for the pilot). Nothing open.

**Done since last update:**
- OpenRouter key is set as a User variable and is visible to new sessions.
- Live embedding check ran on `nvidia/nemotron-3-embed-1b:free`. The call succeeded, one vector returned, dimension 2048. The key was not printed.

---

## 3. OpenRouter key: where to do it and where not to

**Do:**
1. Go to [openrouter.ai](https://openrouter.ai) and sign up with your own account.
2. Open the **Keys** page and create a key named `insync-pilot`.
3. Leave the spending limit empty or set it to zero. Do not add credits.
4. Set the key on your Windows machine (User scope, so it stays out of the project):
   - Open **Start → Edit the system environment variables → Environment Variables**.
   - Under **User variables**, click **New**.
   - Name: `OPENROUTER_API_KEY`. Value: the key.
   - Click OK, then restart VS Code or the terminal.
5. Check it is set without printing it. In PowerShell, run `$env:OPENROUTER_API_KEY -ne $null`. It should print `True`.

**Do not:**
- Paste the key into chat, an issue, a commit, a PR, or a document.
- Put it in any project file, including `backend/.env.example`, `CLAUDE.md`, or planning files.
- Use a key belonging to someone else.
- Add paid credits. The budget is zero.

**Note:** OpenRouter limits how many requests free models accept each day. Check the limit in your account. If it is too low for the live checks, tell me, and we will decide then. Do not buy credits to raise it.

---

## 4. Free fallback pool (S2)

**Test date:** 3 Nov 2026. Each model got one small request asking for a JSON reply. Results are from a single test per model, not a quality review.

### 4.1 Working models (8)

| # | Model | Reply time | JSON correct | Note |
|---|---|---|---|---|
| 1 | `nvidia/nemotron-3.5-super-vl:free` | 1.1 s | Yes | Vision model; text use checked |
| 2 | `liquid/lfm-2.5-2.6b:free` | 1.1 s | Yes | Small model; quality still to check |
| 3 | `cohere/north-mini-code:free` | 1.2 s | Yes | Code-focused; fit to check |
| 4 | `nvidia/nemotron-3-ultra-550b-a55b:free` | 1.2 s | Yes | |
| 5 | `dots-studio/dots-3-note-preview:free` | 3.9 s | Yes | Passed on second try |
| 6 | `xingchen-agi/xing4.0-29b-a4b:free` | 6.2 s | Yes | Passed with a larger output limit |
| 7 | `nvidia/nemotron-3.5-lightning:free` | 20.5 s | Yes | Empty reply on first try; passed on second |
| 8 | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 4.0 s | Yes | Reasoning model; passed |

### 4.2 Not working right now (3)

| Model | Result | Meaning |
|---|---|---|
| `recursive/flint-v1.0:free` | Error 503, "no upstreams available" | Provider has no capacity right now. May recover. |
| `google/gemma-4-31b-it:free` | Error 429, rate-limited upstream | Provider is busy. May recover. |
| `google/gemma-4-26b-a4b-it:free` | Error 429, rate-limited upstream | Provider is busy. May recover. |

### 4.3 Removed (2)

| Model | Result | Meaning |
|---|---|---|
| `thinkingmachines/inkling:free` | Error 403, "only available on agentic harnesses" | Not usable through the API. Removed. |
| `thinkingmachines/inkling-small:free` | Error 403, same message | Removed. |

### 4.4 Excluded on purpose

- `nvidia/nemotron-3.5-content-safety:free`: a classifier, not a text generator.

### 4.5 Pool size: a problem

- **Working now: 8.** The requirement is 10 to 15 distinct models.
- **If the 3 busy models recover: 11.** That meets the requirement.
- **No other free text models exist** in the catalogue to add.

**Decision needed (see §2):** accept the pool as it stands until the busy models recover, or change the requirement.

---

## 5. Free hosting and the 99.9% uptime target (S12, S21)

### 5.1 Free-tier facts (checked 3 Nov 2026, from search results)

| Service | What the free tier does | Why it matters |
|---|---|---|
| **OpenRouter** (free models) | 20 requests per minute. Account-wide cap of **50 requests per day** unless you have bought at least $10 of credits, which raises it to 1,000 per day. | 50 per day is far too low for 12 learners. Raising it needs a $10 purchase, which is paid. |
| **Supabase Free** | Pauses after 7 days of low activity. Restore window is 90 days (sources conflict). Automatic backups on free plan are unclear; third-party sources say none. | A paused project makes the app unavailable until someone restores it. |
| **Render Free** (backend) | Spins down after 15 minutes with no traffic. Waking takes about 1 minute, reports range 30 s to 2 min. Files on disk are lost on restart. | A wake-up can take longer than the 20-second reply target and breaks 99.9% uptime. |
| **Upstash Redis Free** | About 500,000 commands per month, 256 MB data, 10 GB bandwidth. Sources differ slightly. | Enough for a 12-learner pilot. Check the pricing page. |
| **UptimeRobot Free** | 50 monitors, checks every 5 minutes. Sources disagree on commercial use. | Enough to keep services awake and record downtime. Check the terms. |

### 5.2 The conflicts

1. **Daily request cap (OpenRouter).** 50 requests a day covers only a few tutor replies. The zero budget and the reply targets cannot both be met on the free cap. Options:
   - **A.** Keep the free cap and accept that the pilot cannot serve all 12 learners.
   - **B.** Buy $10 of credits once. This is paid, so it needs your explicit decision.
2. **Sleeping backend (Render).** A 30-second to 2-minute wake-up breaks the 20-second reply target and the 99.9% uptime target. An uptime pinger reduces this but does not guarantee it.
3. **Pausing database (Supabase).** A paused project needs a manual restore. A pinger can prevent the pause but is not an official feature.

**Recommendation:** keep the free stack for development. Before the pilot, decide between option A and option B above, and decide whether a sleeping backend is acceptable.

### 5.3 Uptime and monitoring

- Uptime target stays 99.9% per month (approved).
- Measure real uptime over a trial month before the pilot. Do not claim 99.9% until measured.

---

## 6. Backups (S16), free only, weekly, 7-day retention

**Constraint:** the repo is **public**. A backup stored as a GitHub Actions artifact or in the repo would be downloadable by anyone, even if encrypted. Real learner data never goes there. The repo holds synthetic data only.

**Method:**
1. A scheduled job on your Windows machine (Task Scheduler, free) runs `pg_dump` against the Supabase database **once a week**.
2. The dump is encrypted with a passphrase you choose (7-Zip AES-256 or `gpg`, both free).
3. The encrypted file goes to a **private** folder on your machine or a private free cloud folder you control.
4. Dumps older than **7 days** are deleted automatically, so deleted class data does not stay in backups. With one dump a week, the newest dump may be up to 7 days old when a restore is needed.
5. Before the pilot, do one **restore rehearsal** into a local test database.

---

## 7. Embeddings and secret names

**Embedding model (S3).** `nvidia/nemotron-3-embed-1b:free` returned **2048-dimension** vectors in a live check on 3 Nov 2026. The catalogue did not publish this number.

**Vector index options (open):**

| Option | How | Trade-off |
|---|---|---|
| A. `halfvec(2048)` with an HNSW index | Store vectors at half precision | Indexed and fast. Small loss of precision. Needs pgvector support on Supabase; verify. |
| B. `vector(2048)` with no index | Exact search over all chunks | No index limit. At pilot size (one teacher, one class, a few hundred chunks) exact search is fast enough. |
| C. Reduce dimension | Ask the model for fewer dimensions, if supported | Only if the model supports it; not checked. |

**Decision: option B, approved by Anum (3 Nov 2026).** Store `vector(2048)` with no index for the pilot. Revisit if the corpus grows.

Other free options:
- `nvidia/nemotron-3.5-embed-1b:free`: multilingual, also handles document images. Needs a dimension check.
- `liquid/lfm-2.5-embedding-350m:free`: 1,024 dimensions, but only 512 tokens of context. Too short for 500-token chunks.

**Secret names (S17).** Values never go in files, issues, or chat.

| Name | Purpose | Secret |
|---|---|---|
| `INSYNC_ENVIRONMENT` | Exists today | No |
| `OPENROUTER_API_KEY` | Free model access | Yes |
| `DATABASE_URL` | Supabase Postgres | Yes |
| `SUPABASE_URL` | Supabase project URL | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend-only storage access | Yes |
| `REDIS_URL` | Upstash Redis | Yes |
| `EMBEDDING_MODEL` | Embedding model ID | No |
| `BACKUP_PASSPHRASE` | Encrypts backups; kept on your machine only | Yes |

`OPENROUTER_API_KEY` is set on the Windows User scope. It is not in the project.

---

## 8. Failure messages (S22)

Approved by Anum on 3 Nov 2026. Use these messages as written.

| Situation | Message to the learner |
|---|---|
| Tutor is slow (over 20 s) | "The tutor is taking longer than usual. Please wait a moment." |
| Tutor is temporarily unavailable | "The tutor is not active right now. Please wait a few minutes and try again." |
| Material still processing | "Your material is still being processed. It will appear here when ready." |
| Answer could not be verified against the material | "The tutor could not give a verified answer. Please try again or ask your teacher." |
| Service fully down | "InSync is temporarily down. Your saved work is safe. Please try again shortly." |

Saved work (answers, notes, chat) is never lost during a failure.

---

## 9. Downstream impact

| Area | Affected work |
|---|---|
| Free pool and embeddings (S1–S3) | Provider adapter, fallback (#18), vector size (#9, #16), re-indexing if the model changes |
| Storage, uploads, chunking (S4–S6) | Upload checks and permissions (#27), retrieval, test fixtures |
| Background, timeouts, recovery (S7–S10) | Job table and worker (#19), job states in the API (#10), checkpoints (#3), failure tests (#15) |
| Setup and hosting (S11–S12) | Compose file and CI (#14, #15), free-tier deployment, uptime monitoring |
| Deletion, backups, reports (S14–S16) | Class-dissolve deletion job, backup runbook, logging schema (#9) |
| Quality and failure UX (S22–S23) | Evaluation test set (#2 targets), failure messages in the UI (#22, #25) |

Any schema change (job table, vector size) goes through #9 before a migration. Nothing here authorises a migration.
