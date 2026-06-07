# Updates DIRECT_DATABASE_URL port after `npm run db:dev` / `npm run db:restart`.
# Reads the TCP port from `prisma dev --detach` or `prisma dev ls` output.
$env:NO_COLOR = "1"
$env:FORCE_COLOR = "0"

$out = (npx prisma dev ls 2>&1 | ForEach-Object { "$_" }) -join "`n"
$out = $out -replace '\x1B\[[0-9;]*[A-Za-z]', '' -replace '\x1B\]8;[^\x07]*\x07', ''

$envPath = Join-Path (Join-Path $PSScriptRoot "..") ".env"
$content = Get-Content $envPath -Raw

# Match full postgres TCP port (not truncated display links)
if ($out -match 'postgres://postgres:postgres@localhost:(\d+)/template1') {
  $port = $Matches[1]
  $tcpUrl = "postgresql://postgres:postgres@127.0.0.1:$port/template1?sslmode=disable&connection_limit=10"
  if ($content -match 'DIRECT_DATABASE_URL="[^"]*"') {
    $content = $content -replace 'DIRECT_DATABASE_URL="[^"]*"', "DIRECT_DATABASE_URL=`"$tcpUrl`""
    Set-Content -Path $envPath -Value $content -NoNewline
    Write-Host "Updated DIRECT_DATABASE_URL to port $port"
  } else {
    Write-Host "DIRECT_DATABASE_URL not found in .env"
  }
} else {
  Write-Host "Prisma dev not running. Start it with: npm run db:dev"
}
