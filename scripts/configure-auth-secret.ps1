$ErrorActionPreference = "Stop"
$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $workspace ".env.local"

if (-not (Test-Path -LiteralPath $envFile)) {
  throw ".env.local was not found."
}

$secretBytes = New-Object byte[] 32
$randomNumberGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$randomNumberGenerator.GetBytes($secretBytes)
$randomNumberGenerator.Dispose()
$authSecret = [Convert]::ToBase64String($secretBytes)

$lines = @(Get-Content -LiteralPath $envFile)
$lines = @($lines | Where-Object { $_ -notmatch '^AUTH_SECRET=' })
$lines += "AUTH_SECRET=`"$authSecret`""
Set-Content -LiteralPath $envFile -Value $lines -Encoding utf8

$authSecret = $null
[Array]::Clear($secretBytes, 0, $secretBytes.Length)
Write-Host "Auth.js secret configured."
