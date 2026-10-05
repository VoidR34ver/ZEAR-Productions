# One House Away From Home - fetch the newest low-spec Windows playtest build and run it.
#   irm https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/OHAfH/play.ps1 | iex
# Installs into %USERPROFILE%\OneHouseAway. Run the same line again to update.
$ErrorActionPreference = 'Stop'
$dir = Join-Path $HOME 'OneHouseAway'
$url = 'https://github.com/VoidR34ver/ZEAR-Productions/releases/download/ohafh-latest/OneHouseAway-windows-lowspec.zip'
$zip = Join-Path $dir 'build.zip'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Write-Host "Downloading the newest build into $dir ..."
curl.exe -L --fail -o $zip $url
if ($LASTEXITCODE -ne 0) { throw 'Download failed.' }
Expand-Archive -Path $zip -DestinationPath $dir -Force
Remove-Item $zip
$exe = Join-Path $dir 'OneHouseAway-lowspec.exe'
Unblock-File $exe
Write-Host "Starting. (Later, run $exe directly to play without updating.)"
Start-Process -FilePath $exe -WorkingDirectory $dir
