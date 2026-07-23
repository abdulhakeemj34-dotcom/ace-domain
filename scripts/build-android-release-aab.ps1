Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$requiredEnv = @(
    'ACE_DOMAIN_ANDROID_KEYSTORE_PATH',
    'ACE_DOMAIN_ANDROID_KEYSTORE_PASSWORD',
    'ACE_DOMAIN_ANDROID_KEY_ALIAS',
    'ACE_DOMAIN_ANDROID_KEY_PASSWORD'
)

$missing = $requiredEnv | Where-Object { -not [Environment]::GetEnvironmentVariable($_) }
if ($missing.Count -gt 0) {
    Write-Error ("Missing Android release signing environment variables: {0}. Do not commit signing secrets. Set them only in your local shell or CI secret store." -f ($missing -join ', '))
}

$keystorePath = [Environment]::GetEnvironmentVariable('ACE_DOMAIN_ANDROID_KEYSTORE_PATH')
if (-not (Test-Path -LiteralPath $keystorePath)) {
    Write-Error "ACE_DOMAIN_ANDROID_KEYSTORE_PATH does not point to an existing keystore file."
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Push-Location $repoRoot
try {
    npm run build
    npm run cap:sync
    Push-Location (Join-Path $repoRoot 'android')
    try {
        .\gradlew.bat bundleRelease
    }
    finally {
        Pop-Location
    }
}
finally {
    Pop-Location
}
