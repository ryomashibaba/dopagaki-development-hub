$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2.0
$repo = 'ryomashibaba/dopagaki-development-hub'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $root
Write-Host 'DOPAGAKI P63 - PRIVATE repository setup' -ForegroundColor Cyan

foreach ($exe in @('git', 'gh')) {
  if (-not (Get-Command $exe -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $exe. Install Git for Windows and GitHub CLI."
  }
}

& gh auth status
if ($LASTEXITCODE -ne 0) {
  throw 'GitHub CLI is not logged in. Run: gh auth login'
}

# GitHub CLI can exit with 1 when the new repository does not yet exist.
# Do not let a redirected native stderr break Windows PowerShell 5.1.
$ErrorActionPreference = 'Continue'
try {
  $viewLines = @(& gh repo view $repo --json isPrivate --jq '.isPrivate' 2>&1)
  $viewExit = $LASTEXITCODE
} finally {
  $ErrorActionPreference = 'Stop'
}
if ($viewExit -eq 0) {
  $privacy = ($viewLines | Out-String).Trim()
  if ($privacy -ne 'true') {
    throw 'STOP: target repository exists but is not PRIVATE.'
  }
  Write-Host 'Existing PRIVATE repository confirmed.' -ForegroundColor Green
} else {
  Write-Host "Creating PRIVATE repository $repo ..."
  & gh repo create $repo --private --description 'Private DOPAGAKI stage development and QA hub'
  if ($LASTEXITCODE -ne 0) {
    throw 'Repository creation failed. Inspect the GitHub CLI message above.'
  }
}

$privacy = (& gh repo view $repo --json isPrivate --jq '.isPrivate' | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $privacy -ne 'true') {
  throw 'STOP: repository privacy could not be confirmed. No push will run.'
}

if (-not (Test-Path -LiteralPath (Join-Path $root '.git'))) {
  & git init -b main
  if ($LASTEXITCODE -ne 0) {
    throw 'git init failed.'
  }
}
$branch = (& git symbolic-ref --quiet --short HEAD | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne 'main') {
  throw "STOP: expected local branch main, got '$branch'."
}

$remoteNames = @(& git remote)
if ($LASTEXITCODE -ne 0) { throw 'git remote listing failed.' }
$https = "https://github.com/$repo.git"
$ssh = "git@github.com:$repo.git"
if ($remoteNames -contains 'origin') {
  $origin = (& git remote get-url origin | Out-String).Trim()
  if ($LASTEXITCODE -ne 0 -or ($origin -ne $https -and $origin -ne $ssh)) {
    throw "STOP: origin points somewhere unexpected: $origin"
  }
} else {
  & git remote add origin $https
  if ($LASTEXITCODE -ne 0) { throw 'git remote add failed.' }
}

# Make the first commit work even when Git has no user identity configured.
# These settings affect ONLY this newly initialized repository.
$name = (& git config user.name | Out-String).Trim()
$email = (& git config user.email | Out-String).Trim()
if (-not $name -or -not $email) {
  $login = (& gh api user --jq '.login' | Out-String).Trim()
  $accountId = (& gh api user --jq '.id' | Out-String).Trim()
  if ($LASTEXITCODE -ne 0 -or -not $login -or $accountId -notmatch '^\d+$') {
    throw 'Cannot determine the GitHub account identity. Set Git user.name and user.email.'
  }
  if (-not $name) { & git config --local user.name $login }
  if (-not $email) { & git config --local user.email "$accountId+$login@users.noreply.github.com" }
  Write-Host 'Configured local commit identity from the authenticated GitHub account.'
}

& git add -A
if ($LASTEXITCODE -ne 0) { throw 'git add failed.' }
& git diff --cached --quiet
$diffExit = $LASTEXITCODE
if ($diffExit -eq 1) {
  & git commit -m 'P63: private stage hub with QA-gated Cloudflare preview'
  if ($LASTEXITCODE -ne 0) { throw 'git commit failed.' }
} elseif ($diffExit -ne 0) {
  throw 'git diff failed.'
} else {
  Write-Host 'No new staged changes; push the existing main branch.'
}

& git push -u origin main
if ($LASTEXITCODE -ne 0) {
  throw 'git push failed. Check GitHub authentication, permissions and branch.'
}
Write-Host "PRIVATE REPOSITORY READY: https://github.com/$repo" -ForegroundColor Green
Write-Host 'Cloudflare deployment remains disabled until access protection is set.' -ForegroundColor Yellow
