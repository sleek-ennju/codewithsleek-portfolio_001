$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $workspace ".env.local"

if (-not (Test-Path -LiteralPath $envFile)) {
  throw ".env.local was not found. Pull or create the local environment file first."
}

$secureKey = Read-Host "Paste the Google PageSpeed API key" -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
  $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
  if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw "The API key cannot be empty."
  }

  $lines = @(Get-Content -LiteralPath $envFile)
  $lines = @($lines | Where-Object { $_ -notmatch '^GOOGLE_PAGESPEED_API_KEY=' })
  $escapedKey = $apiKey.Replace('"', '\"')
  $lines += "GOOGLE_PAGESPEED_API_KEY=`"$escapedKey`""
  Set-Content -LiteralPath $envFile -Value $lines -Encoding utf8
} finally {
  if ($keyPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
  }
  $apiKey = $null
  $secureKey = $null
}

Write-Host "Google PageSpeed API key configured locally. Restart the development server."
