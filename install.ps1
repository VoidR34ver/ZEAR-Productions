# Odin - fetch the newest Windows build and add an `odin` command.
#   irm https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/odin/install.ps1 | iex
# Installs into %USERPROFILE%\Odin\app. Run the same line again to update.
$ErrorActionPreference = 'Stop'
$dir = Join-Path $HOME 'Odin\app'
$url = 'https://github.com/VoidR34ver/ZEAR-Productions/releases/download/odin-latest/odin-windows-x64.zip'
$zip = Join-Path $dir 'build.zip'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Write-Host "Downloading the newest build into $dir ..."
curl.exe -L --fail -o $zip $url
if ($LASTEXITCODE -ne 0) { throw 'Download failed.' }
$app = Join-Path $dir 'odin'
if (Test-Path $app) { Remove-Item -Recurse -Force $app }
Expand-Archive -Path $zip -DestinationPath $dir -Force
Remove-Item $zip
Get-ChildItem -Recurse $app | Unblock-File
Write-Host 'Fetching the browser that the live engine drives ...'
& (Join-Path $app 'odin.exe') --install-engine
# Put the folder on your PATH, so `odin` works in any new terminal.
$path = [Environment]::GetEnvironmentVariable('Path', 'User')
if (($path -split ';') -notcontains $app) {
    [Environment]::SetEnvironmentVariable('Path', ($path.TrimEnd(';') + ';' + $app), 'User')
}
Write-Host 'Done. Open a new terminal and start it with: odin'
