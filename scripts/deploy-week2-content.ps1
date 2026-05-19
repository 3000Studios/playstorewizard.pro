# deploy-week2-content.ps1
# One-shot: clear stale git lock, commit Week 2 docs, push to origin, redeploy to Cloudflare Workers.
# Run from: C:\Workspaces\playstorewizard.pro
# Usage: powershell -ExecutionPolicy Bypass -File scripts\deploy-week2-content.ps1

$ErrorActionPreference = "Stop"
$repoRoot = "C:\Workspaces\playstorewizard.pro"

Set-Location $repoRoot
Write-Host "==> Repo: $repoRoot" -ForegroundColor Cyan

# --- 1. Clear stale git lock (created May 16, sandbox couldn't unlink) ---
$lock = Join-Path $repoRoot ".git\index.lock"
if (Test-Path $lock) {
    Write-Host "==> Removing stale .git\index.lock" -ForegroundColor Yellow
    Remove-Item -Force $lock
} else {
    Write-Host "==> No stale lock present"
}

# --- 2. Verify git identity ---
git config user.email | Out-Null
if ($LASTEXITCODE -ne 0) {
    git config user.email "mr.jwswain@gmail.com"
    git config user.name  "Mr. J. Swain"
    Write-Host "==> Set local git identity"
}

# --- 3. Stage ONLY the new docs (not the 20+ modified files in working tree) ---
Write-Host "==> Staging docs/ additions" -ForegroundColor Cyan
git add `
    docs/CONTENT-KIT-WEEK-1.md `
    docs/CONTENT-KIT-WEEK-2.md `
    docs/METRICS-WEEKLY.md `
    docs/WEEKLY-BRIEFING-2026-05-16.md `
    docs/WEEKLY-BRIEFING-2026-05-17.md `
    docs/CHECKOUT-VERIFICATION.md `
    docs/LAUNCH-READINESS.md

$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "==> Nothing new to commit. Skipping commit step."
} else {
    Write-Host "==> Staged:" -ForegroundColor Green
    $staged | ForEach-Object { Write-Host "    $_" }

    git commit -m "docs: Week 2 content kit, weekly metrics tracker, briefings"
    if ($LASTEXITCODE -ne 0) { throw "git commit failed" }

    Write-Host "==> Pushing to origin/main" -ForegroundColor Cyan
    git push origin main
    if ($LASTEXITCODE -ne 0) { throw "git push failed — check credentials / network" }
}

# --- 4. Redeploy to Cloudflare Workers ---
# Uses npm run deploy => opennextjs-cloudflare build && opennextjs-cloudflare deploy
# Requires wrangler login already done (a previous deploy worked, so this should be fine).
Write-Host "==> Building + deploying to Cloudflare Workers (free tier)" -ForegroundColor Cyan
Write-Host "    Running: npm run deploy"
npm run deploy
if ($LASTEXITCODE -ne 0) {
    throw "Deploy failed. Check wrangler auth: 'npx wrangler whoami' — and confirm @cloudflare/workerd-windows-64 installed."
}

Write-Host ""
Write-Host "==> DONE." -ForegroundColor Green
Write-Host "    Docs committed + pushed."
Write-Host "    Worker redeployed."
Write-Host ""
Write-Host "Verify:" -ForegroundColor Yellow
Write-Host "  curl -I https://playstorewizard.pro/guides/target-api-level-android-15"
Write-Host "  Check Cloudflare dashboard → Workers → playstorewizard-pro for latest deploy ID"
