# Odin - fetch the newest Windows build and add an `odin` command.
#   irm https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/odin/install.ps1 | iex
# Installs into %USERPROFILE%\Odin\app. Run the same line again to update.
# The build that uses the graphics card (through Vulkan) is tried first; if it
# can't start here, the processor-only build replaces it.
# Set $env:ODIN_BUILD = 'windows-x64' first to skip straight to that one.
$ErrorActionPreference = 'Stop'
$dir = Join-Path $HOME 'Odin\app'
$app = Join-Path $dir 'odin'
$exe = Join-Path $app 'odin.exe'
$zip = Join-Path $dir 'build.zip'
$builds = if ($env:ODIN_BUILD) { @($env:ODIN_BUILD) } else { @('windows-x64-vulkan', 'windows-x64') }
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$starts = $false
foreach ($build in $builds) {
    Write-Host "Downloading the newest build ($build) into $dir ..."
    curl.exe -L --fail -o $zip "https://github.com/VoidR34ver/ZEAR-Productions/releases/download/odin-latest/odin-$build.zip"
    if ($LASTEXITCODE -ne 0) { throw 'Download failed.' }
    if (Test-Path $app) { Remove-Item -Recurse -Force $app }
    Expand-Archive -Path $zip -DestinationPath $dir -Force
    Remove-Item $zip
    Get-ChildItem -Recurse $app | Unblock-File
    & $exe --check
    if ($LASTEXITCODE -eq 0) { $starts = $true; break }
    Write-Host "That build can't start on this machine."
}
if (-not $starts) { throw "No Odin build starts here; the lines above say which part is missing." }
Write-Host 'Fetching the browser that the live engine drives ...'
& $exe --install-engine
# Put the folder on your PATH, so `odin` works in any new terminal.
$path = [Environment]::GetEnvironmentVariable('Path', 'User')
if (($path -split ';') -notcontains $app) {
    [Environment]::SetEnvironmentVariable('Path', ($path.TrimEnd(';') + ';' + $app), 'User')
}
Write-Host "Done ($build). Open a new terminal and start it with: odin"
