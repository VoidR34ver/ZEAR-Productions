#!/bin/sh
# One House Away From Home - fetch the newest Linux playtest build and run it.
#   curl -sL https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/OHAfH/play.sh | sh
# Installs into ~/OneHouseAway (or $OHAFH_DIR). Run the same line again to update.
set -e
DIR="${OHAFH_DIR:-$HOME/OneHouseAway}"
URL="https://github.com/VoidR34ver/ZEAR-Productions/releases/download/ohafh-latest/OneHouseAway-linux.zip"
mkdir -p "$DIR"
cd "$DIR"
echo "Downloading the newest build into $DIR ..."
curl -L --fail --progress-bar -o build.zip "$URL"
unzip -o -q build.zip
rm build.zip
chmod +x OneHouseAway.x86_64
echo "Starting. (Later, run $DIR/OneHouseAway.x86_64 directly to play without updating.)"
exec ./OneHouseAway.x86_64 "$@"
