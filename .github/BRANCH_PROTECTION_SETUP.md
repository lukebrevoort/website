# Branch Protection Setup Guide

## Step 1: Navigate to Branch Protection Settings

1. Go to your GitHub repository: `https://github.com/lukebrevoort/website`
2. Click **Settings** (top menu bar)
3. Click **Branches** (left sidebar)
4. Click **Add rule** button

## Step 2: Configure Branch Protection Rule

### Basic Settings
- **Branch name pattern:** `main`
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals:** 1
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners** (if you have CODEOWNERS file)

### Status Checks (Required)
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Select these status checks:**
- ✅ `Continuous Integration` (from ci.yml)
- ✅ `Quick Lint & Type Check` (from quick-lint.yml)  
- ✅ `Test Key Features` (from feature-tests.yml)

### Additional Protection (Recommended)
- ✅ **Restrict pushes that create files larger than 100 MB**
- ❌ **Allow force pushes** (keep disabled)
- ❌ **Allow deletions** (keep disabled)

### Admin Settings
- ❌ **Do not allow bypassing the above settings** (recommended for teams)
- ✅ **Include administrators** (enforce rules for all users)

## Step 3: Verify Setup

After saving the rule:

1. Create a test branch: `git checkout -b test-branch-protection`
2. Make a small change and push
3. Create a pull request to `main`
4. Verify that the required status checks appear
5. Confirm you cannot merge until all checks pass

## Alternative: Using GitHub CLI

```bash
# Install GitHub CLI if not already installed
# Then configure branch protection via command line

gh api repos/lukebrevoort/website/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Continuous Integration","Quick Lint & Type Check","Test Key Features"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

## Monitoring and Maintenance

### Weekly Tasks
- Review failed builds and common issues
- Monitor workflow performance and optimization opportunities
- Check security audit results

### Monthly Tasks  
- Update Node.js version in workflows if needed
- Review and update required status checks
- Analyze workflow usage and costs

## Troubleshooting Common Issues

### "Required status check not found"
- Ensure the workflow has run at least once
- Check that the job names match exactly
- Verify workflows are on the main branch

### Workflows not triggering
- Check that files are in `.github/workflows/` directory
- Verify YAML syntax is valid
- Ensure proper permissions are set

### Build failures
- Check for environment variable requirements
- Verify Node.js version compatibility
- Review dependency installation issues

## Status Check Hierarchy

### Tier 1 (Critical - Block Merge)
- `Continuous Integration` - Core CI pipeline
- `Quick Lint & Type Check` - Basic code quality

### Tier 2 (Important - Recommend)
- `Test Key Features` - Application functionality
- `Security Audit` - Vulnerability scanning

### Tier 3 (Optional - Monitor)
- `Build Application` - Deployment readiness
- `Code Analysis` - Quality metrics
- `Performance Checks` - Optimization insights

## Success Criteria

After setup, every pull request will:
1. ✅ Pass linting and type checking
2. ✅ Build successfully 
3. ✅ Pass feature validation tests
4. ✅ Have no critical security vulnerabilities
5. ✅ Require human review and approval
6. ✅ Maintain main branch stability

This ensures high code quality and prevents broken code from reaching production! 🚀