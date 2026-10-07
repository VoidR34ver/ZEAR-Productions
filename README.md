# Odin — builds

A web browser that runs inside a terminal, with Mimir, a local AI, living in it.
Paste one line into a terminal: it downloads the newest build and adds an `odin` command.
Run the same line again to update.

**macOS** (Apple silicon) and **Linux** (x86_64; needs `curl` and `tar`) — installs into `~/Odin/app`:

```sh
curl -sL https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/odin/install.sh | sh
```

**Windows 10/11** (64-bit; paste into PowerShell) — installs into `%USERPROFILE%\Odin\app`:

```powershell
irm https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/odin/install.ps1 | iex
```

Then open a new terminal and type `odin`.

The first `/mimir` message downloads Mimir's model, about 7 to 8 GB; `odin --setup` fetches it ahead of time.

On Windows and Linux the installer first tries the build that runs the model on the graphics card
(through Vulkan: NVIDIA, AMD or Intel, with current drivers). If that build can't start, it installs
the processor-only one instead, where replies are slow. The last line it prints says which you got.
Everything Odin keeps (the model, saved files, the browser profile) lives in `~/Odin`.

The builds themselves are the `odin-latest` release of this repository.
