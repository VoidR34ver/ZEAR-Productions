#!/bin/sh
# Odin - fetch the newest macOS or Linux build and add an `odin` command.
#   curl -sL https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/odin/install.sh | sh
# Installs into ~/Odin/app (or $ODIN_APP). Run the same line again to update.
set -e
case "$(uname -s)-$(uname -m)" in
    Darwin-arm64) BUILD=macos-arm64 ;;
    Linux-x86_64) BUILD=linux-x64 ;;
    *) echo "There is no Odin build for $(uname -s) on $(uname -m)." >&2; exit 1 ;;
esac
DIR="${ODIN_APP:-$HOME/Odin/app}"
URL="https://github.com/VoidR34ver/ZEAR-Productions/releases/download/odin-latest/odin-$BUILD.tar.gz"
mkdir -p "$DIR"
cd "$DIR"
echo "Downloading the newest build into $DIR ..."
curl -L --fail --progress-bar -o build.tar.gz "$URL"
rm -rf odin
tar xzf build.tar.gz
rm build.tar.gz
echo "Fetching the browser that the live engine drives ..."
./odin/odin --install-engine
mkdir -p "$HOME/.local/bin"
ln -sf "$DIR/odin/odin" "$HOME/.local/bin/odin"
case ":$PATH:" in
    *":$HOME/.local/bin:"*) echo "Done. Start it with: odin" ;;
    *) echo "Done. Start it with: $HOME/.local/bin/odin"
       echo "(Add $HOME/.local/bin to your PATH to type just: odin)" ;;
esac
