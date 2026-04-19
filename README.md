# ecommerce-playwright-ts

![Tests](https://github.com/szymonpirecki/ecommerce-playwright-ts/actions/workflows/test.yml/badge.svg)

Test suite for [Fashionhub](https://pocketaces2.github.io/fashionhub/), a demo e-commerce app, built as a QA Engineer portfolio project.

**Architecture**
- Page Object Model with `private readonly` locators initialised in constructors
- Custom Playwright fixture handles credential resolution and page object injection — no `beforeEach`, no `new Page()` in tests
- Role-based credential system loads users from a JSON file kept outside version control

**Test execution**
- Runs across Chromium, Firefox, and WebKit in fully parallel mode
- CI-aware config: retries, worker count, and JUnit reporter enabled only in CI (`process.env.CI`)
- Traces, screenshots, and videos captured automatically on failure

**Reporting**
- Playwright HTML report generated after every run
- Allure report generated after every run

**Environments**
- Four environments built in: `local`, `docker`, `staging`, `production`
- Target URL resolved automatically based on the active environment

**Deployment**
- App and test runner run as separate Docker Compose services — the app must pass a health check before tests start
- GitHub Actions pipeline (push/PR to main) runs the same Docker Compose flow, with `users.json` injected from a repository secret

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18 LTS or later |
| Java *(optional)* | 11 or later (required only for Allure reports) |
| Docker + Docker Compose | v2 (for containerised runs) |

---

## Setup

```bash
git clone https://github.com/szymonpirecki/ecommerce-playwright-ts.git
cd ecommerce-playwright-ts
npm ci
npx playwright install --with-deps
cp .env.example .env
cp src/test-data/users.example.json src/test-data/users.json
```

`users.json` is the only source of test credentials — fill in real values:

```json
[
  { "username": "your_username", "password": "your_password", "role": "standard" }
]
```

---

## Running tests

### Running on production (no local setup required)

```bash
TEST_ENV=production npx playwright test
```

### Running on local environment

The local environment requires the Fashionhub app container to be running on `localhost:4000`.
Start it once before running tests, leave it up for the whole session:

```bash
docker compose up fashionhub -d
```

Then run tests as usual — they will target `http://localhost:4000/fashionhub/` by default:

```bash
npx playwright test
```

Stop the container when done:

```bash
docker compose down
```

### Other options

**Single browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Single spec file:**
```bash
npx playwright test tests/auth/login.spec.ts
```

**By tag:**
```bash
npx playwright test --grep @smoke
```

---

## Running with Docker

Starts the app container and the test runner together. Tests run against the app over the internal Docker network (`http://fashionhub:4000/fashionhub/`).

Make sure `src/test-data/users.json` exists and is filled in before building.

```bash
docker compose up --build --exit-code-from tests
```

`allure-results/` is mounted as a volume — results are written to `allure-results/` in the project root on exit, including on failure.

`playwright-report/` is not mounted and is not persisted when the container is removed.

---

## Reports

**Playwright HTML report** (generated after every run):
```bash
npx playwright show-report
```

**Allure report** (requires Java):
```bash
npm run report
```
Generates `allure-report/` and opens it in the browser.

---

## Environment configuration

| Name | URL | How to activate |
|---|---|---|
| `local` | `http://localhost:4000/fashionhub/` | Default, used when `TEST_ENV` is not set |
| `docker` | `http://fashionhub:4000/fashionhub/` | Default when running via Docker Compose |
| `staging` | `https://staging-env/fashionhub/` | `TEST_ENV=staging` |
| `production` | `https://pocketaces2.github.io/fashionhub/` | `TEST_ENV=production` |

**Priority (highest → lowest):**
1. `TEST_ENV` set in the shell: `TEST_ENV=staging npx playwright test`
2. `TEST_ENV` in `.env` (dotenv does not override a variable already in the shell)
3. `defaultEnvironment` in `config/env.config.json` (currently `"local"`)

---

## Project structure

```
.
├── .github/
│   └── workflows/
│       └── test.yml             # GitHub Actions: builds Docker image, runs tests on push/PR to main
├── config/
│   └── env.config.json          # Environment name → base URL mapping
├── src/
│   ├── fixtures/
│   │   └── index.ts             # Custom test fixture — resolves credentials, injects page objects
│   ├── pages/
│   │   ├── BasePage.ts          # Shared navigation helpers; all page objects extend this
│   │   ├── LoginPage.ts         # Login page interactions
│   │   └── AccountPage.ts       # Account/profile page interactions
│   ├── test-data/
│   │   ├── auth.data.ts         # getUserByRole() — loads credentials from users.json by role
│   │   ├── users.json           # Real credentials — gitignored, never commit
│   │   └── users.example.json   # Format reference — copy to users.json and fill in values
│   ├── types/
│   │   └── auth.types.ts        # UserCredentials and TestUser interfaces
│   └── utils/
│       ├── envResolver.ts       # Single point of URL resolution from TEST_ENV
│       └── Logger.ts            # Structured logger (INFO/WARN/ERROR) used across src/
├── tests/
│   └── auth/
│       └── login.spec.ts        # Login flow tests (@smoke, @auth)
├── .dockerignore                # Excludes node_modules, .env, and report dirs from build context
├── .env.example                 # Committed env template — copy to .env and fill in
├── .gitignore
├── docker-compose.yml           # App + test runner services for containerised runs
├── Dockerfile                   # Test runner image (mcr.microsoft.com/playwright base)
├── entrypoint.sh                # Container entrypoint — production pre-flight check + test run
├── package.json
├── playwright.config.ts         # Playwright config: browsers, reporters, timeouts, base URL
└── tsconfig.json
```
