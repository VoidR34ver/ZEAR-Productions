#!/bin/sh
# Odin - fetch the newest macOS or Linux build and add an `odin` command.
#   curl -sL https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/odin/install.sh | sh
# Installs into ~/Odin/app (or $ODIN_APP). Run the same line again to update.
# On Linux the build that uses the graphics card (through Vulkan) is tried
# first; if it can't start here, the processor-only build replaces it.
# ODIN_BUILD=linux-x64 skips straight to the processor-only one.
set -e
case "$(uname -s)-$(uname -m)" in
    Darwin-arm64) BUILDS="macos-arm64" ;;
    Linux-x86_64) BUILDS="linux-x64-vulkan linux-x64" ;;
    *) echo "There is no Odin build for $(uname -s) on $(uname -m)." >&2; exit 1 ;;
esac
BUILDS="${ODIN_BUILD:-$BUILDS}"
DIR="${ODIN_APP:-$HOME/Odin/app}"
mkdir -p "$DIR"
cd "$DIR"
for BUILD in $BUILDS; do
    echo "Downloading the newest build ($BUILD) into $DIR ..."
    curl -L --fail --progress-bar -o build.tar.gz \
        "https://github.com/VoidR34ver/ZEAR-Productions/releases/download/odin-latest/odin-$BUILD.tar.gz"
    rm -rf odin
    tar xzf build.tar.gz
    rm build.tar.gz
    if ./odin/odin --check; then
        STARTS=yes
        break
    fi
    echo "That build can't start on this machine."
done
if [ -z "$STARTS" ]; then
    echo "No Odin build starts here; the lines above say which part is missing." >&2
    exit 1
fi
echo "Fetching the browser that the live engine drives ..."
./odin/odin --install-engine
mkdir -p "$HOME/.local/bin"
ln -sf "$DIR/odin/odin" "$HOME/.local/bin/odin"
case ":$PATH:" in
    *":$HOME/.local/bin:"*) echo "Done ($BUILD). Start it with: odin" ;;
    *) echo "Done ($BUILD). Start it with: $HOME/.local/bin/odin"
       echo "(Add $HOME/.local/bin to your PATH to type just: odin)" ;;
esac
