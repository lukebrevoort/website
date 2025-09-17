# GitHub Actions Workflows Overview

This repository includes multiple GitHub Actions workflows to ensure code quality and protect the main branch.

## Workflows Summary

| Workflow | File | Purpose | Trigger |
|----------|------|---------|---------|
| **CI** | `ci.yml` | Main CI pipeline - single status check | PR, Push to main |
| **Quick Lint** | `quick-lint.yml` | Fast linting feedback | PR |
| **PR Tests** | `pr-tests.yml` | Comprehensive testing suite | PR, Push to main |
| **Feature Tests** | `feature-tests.yml` | Application-specific feature validation | PR |
| **Code Quality** | `code-quality.yml` | Security and quality analysis | PR, Weekly |
| **Unit Tests** | `unit-tests.yml` | Test execution and validation | PR, Push to main |

## Recommended Branch Protection

For maximum protection, require these status checks:
- ✅ **Continuous Integration** (from `ci.yml`)
- ✅ **Quick Lint & Type Check** (from `quick-lint.yml`)
- ✅ **Test Key Features** (from `feature-tests.yml`)

## Quick Start

1. Push these workflows to your main branch
2. Go to Settings → Branches → Add rule for `main`
3. Enable "Require status checks to pass before merging"
4. Select the recommended checks above
5. Enable "Require pull request reviews before merging"

## Features Tested

### API Routes
- GitHub integration API (`/api/github-test`)
- Notion webhook API (`/api/notion-webhook`)

### Core Features
- Blog post generation system
- Project showcase pages
- GitHub workflow triggering
- Error handling and validation

### Security & Quality
- Dependency vulnerability scanning
- Bundle size monitoring
- Sensitive data leak detection
- Performance anti-pattern detection

## Local Development

Before creating a PR, run:
```bash
npm run lint      # Check for linting errors
npx tsc --noEmit  # Check TypeScript types
npm run build     # Verify build works
npm audit         # Check for security issues
```

See `.github/TESTING_GUIDE.md` for complete documentation.