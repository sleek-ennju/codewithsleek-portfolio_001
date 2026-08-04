param(
  [string]$AdminEmail = "codewithsleek@gmail.com"
)

$ErrorActionPreference = "Stop"
$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $workspace ".env.local"
$nodeDirectory = "C:\Users\ihena\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$nodeExecutable = Join-Path $nodeDirectory "node.exe"

if (-not (Test-Path -LiteralPath $envFile)) {
  throw ".env.local was not found."
}

if (-not (Test-Path -LiteralPath $nodeExecutable)) {
  throw "The bundled Node.js runtime was not found."
}

$securePassword = Read-Host "Choose the administrator password" -AsSecureString
$confirmation = Read-Host "Confirm the administrator password" -AsSecureString
$password = [System.Net.NetworkCredential]::new("", $securePassword).Password
$confirmedPassword = [System.Net.NetworkCredential]::new("", $confirmation).Password

try {
  if ($password.Length -lt 12) {
    throw "Use a password containing at least 12 characters."
  }

  if ($password -cne $confirmedPassword) {
    throw "The passwords do not match."
  }

  $env:ADMIN_PASSWORD_INPUT = $password
  $passwordHash = & $nodeExecutable -e "require('bcryptjs').hash(process.env.ADMIN_PASSWORD_INPUT, 12).then(console.log)"

  if ($LASTEXITCODE -ne 0 -or -not $passwordHash) {
    throw "The administrator password could not be hashed."
  }

  $lines = @(Get-Content -LiteralPath $envFile)
  $lines = @($lines | Where-Object {
    $_ -notmatch '^ADMIN_EMAIL=' -and $_ -notmatch '^ADMIN_PASSWORD_HASH='
  })
  $lines += "ADMIN_EMAIL=`"$($AdminEmail.Trim().ToLowerInvariant())`""
  $lines += "ADMIN_PASSWORD_HASH=`"$passwordHash`""
  Set-Content -LiteralPath $envFile -Value $lines -Encoding utf8

  Write-Host "Administrator credentials configured. Tell Codex to continue with the seed."
}
finally {
  Remove-Item Env:ADMIN_PASSWORD_INPUT -ErrorAction SilentlyContinue
  $password = $null
  $confirmedPassword = $null
}
