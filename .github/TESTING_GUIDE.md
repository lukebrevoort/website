# GitHub Actions Testing Documentation

This repository now includes comprehensive GitHub Actions workflows to ensure code quality and protect the main branch. These workflows automatically run when pull requests are created or updated.

## Workflow Overview

### 1. Quick Lint Check (`quick-lint.yml`)
**Trigger:** Pull requests to main
**Purpose:** Fast feedback on basic code quality

- ESLint validation
- TypeScript type checking
- Fails fast if basic issues are found

### 2. Pull Request Tests (`pr-tests.yml`)
**Trigger:** Pull requests and pushes to main
**Purpose:** Comprehensive testing suite

**Jobs:**
- **Lint & Type Check:** ESLint and TypeScript validation
- **Build:** Full application build verification
- **Security:** npm audit and dependency vulnerability scanning
- **Code Quality:** TODO/FIXME detection and bundle size analysis
- **API Tests:** API route compilation verification

### 3. Feature Tests (`feature-tests.yml`)
**Trigger:** Pull requests to main
**Purpose:** Test specific application features

**Features Tested:**
- **API Routes:** Structure and export validation
- **GitHub Integration:** API integration and error handling
- **Notion Webhook:** Webhook handling and verification
- **Blog Generation:** Script and data file validation
- **Project Pages:** Project data and page structure

### 4. Code Quality & Security (`code-quality.yml`)
**Trigger:** Pull requests + weekly schedule
**Purpose:** Deep security and quality analysis

- Dependency review for license compliance
- Security vulnerability scanning
- Bundle size analysis
- Sensitive data leak detection
- Performance anti-pattern detection

### 5. Unit Tests (`unit-tests.yml`)
**Trigger:** Pull requests and pushes to main
**Purpose:** Test execution (future-ready)

- Checks for existing test configuration
- Runs tests if available
- Provides setup guidance for adding tests
- Validates API routes and components as substitute

## Branch Protection Strategy

To set up these workflows as required checks for your main branch:

1. Go to **Settings** → **Branches** in your GitHub repository
2. Add a rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select these required checks:
   - `Quick Lint & Type Check`
   - `Lint and Type Check` (from PR Tests)
   - `Build Application`
   - `Test Key Features`
   - `Security Audit`

## Recommended Branch Protection Settings

```yaml
# Recommended .github/branch-protection.yml
protection_rules:
  main:
    required_status_checks:
      strict: true
      contexts:
        - "Quick Lint & Type Check"
        - "Lint and Type Check"
        - "Build Application"
        - "Test Key Features"
        - "Security Audit"
    enforce_admins: false
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
    restrictions: null
```

## Local Development

### Before Creating a PR

1. **Run linting locally:**
   ```bash
   npm run lint
   ```

2. **Check TypeScript types:**
   ```bash
   npx tsc --noEmit
   ```

3. **Build the application:**
   ```bash
   npm run build
   ```

4. **Check for security issues:**
   ```bash
   npm audit
   ```

### Fixing Common Issues

**ESLint Errors:**
```bash
# Auto-fix many issues
npm run lint -- --fix
```

**TypeScript Errors:**
```bash
# Check specific files
npx tsc --noEmit src/path/to/file.ts
```

**Security Vulnerabilities:**
```bash
# Auto-fix vulnerabilities
npm audit fix

# For breaking changes (use with caution)
npm audit fix --force
```

## Adding Tests

Currently, this project doesn't have unit tests. To add them:

### 1. Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### 2. Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 3. Create Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### 4. Example Test Structure

```
__tests__/
├── api/
│   ├── github-test.test.ts
│   └── notion-webhook.test.ts
├── components/
│   ├── ProjectCard.test.tsx
│   └── MobileNavbar.test.tsx
└── utils/
    └── projects.test.ts
```

## Workflow Environment Variables

Some workflows may need environment variables for full functionality:

- `GITHUB_PAT`: GitHub Personal Access Token (for API tests)
- `NOTION_TOKEN`: Notion API token (for webhook tests)
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage token

These should be added as repository secrets in GitHub Settings → Secrets and variables → Actions.

## Monitoring and Maintenance

### Weekly Tasks
- Review security audit results (runs automatically)
- Check for dependency updates
- Monitor build performance

### Monthly Tasks
- Review workflow efficiency
- Update Node.js versions if needed
- Check for new security best practices

## Troubleshooting

### Build Failures
- Check for Google Fonts connectivity issues in CI
- Verify all environment variables are set
- Look for TypeScript/ESLint errors

### Performance Issues
- Monitor bundle size growth
- Check for new large dependencies
- Review build times

### Security Alerts
- Address high/critical vulnerabilities immediately
- Review dependency changes
- Check for hardcoded secrets

## Contributing

When contributing to this repository:

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all local checks pass
4. Create a pull request
5. Wait for all GitHub Actions to pass
6. Request review from maintainers

The automated testing will ensure code quality and security standards are met before any code reaches the main branch.