# GitHub Actions Workflows

This directory contains the optimized GitHub Actions CI/CD pipelines for the ChaiPe project.

## Workflows

| Workflow | File | Purpose | Trigger |
|----------|------|---------|---------|
| PR Check | [`pr-check.yml`](workflows/pr-check.yml) | Run essential checks on PRs | Pull request to main/dev |
| Nightly Build | [`nightly.yml`](workflows/nightly.yml) | Run long-running tests and scans | Scheduled (daily at midnight) |
| E2E Tests | [`e2e.yml`](workflows/e2e.yml) | End-to-end browser tests | On-demand |
| Release | [`release.yml`](workflows/release.yml) | Create releases and deploy | Version tags |
| Reusable Build | [`reusable-build.yml`](workflows/reusable-build.yml) | Reusable build workflow | Called by other workflows |

## Documentation

- **[`CI-CD-IMPLEMENTATION-SUMMARY.md`](CI-CD-IMPLEMENTATION-SUMMARY.md)** - A summary of the CI/CD refactoring.

## Key Features

✅ **Faster PR Feedback** - Essential checks complete in a fraction of the time.
✅ **Improved Maintainability** - Reusable workflows reduce code duplication.
✅ **On-Demand E2E Tests** - Run E2E tests when you need them.
✅ **Enhanced Security** - Security scans are part of the release process.

## Required Secrets (Optional)

| Secret | Purpose | Workflow |
|--------|---------|----------|
| `NPM_TOKEN` | Publish to npm | release.yml |
| `SNYK_TOKEN` | Security scanning | release.yml |
| `CODECOV_TOKEN` | Upload coverage | pr-check.yml |
