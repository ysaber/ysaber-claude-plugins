# Auto-Update Plugin for Claude Code

Automatically updates Claude Code when a new version is available via your package manager.

## Installation

```
/plugin marketplace add ysaber/ysaber-claude-plugins
/plugin install auto-update@ysaber-claude-plugins
```

That's it! On first run, the plugin will:
1. Configure your shell to hide the built-in "Update available!" message
2. Start checking for updates on every session

Restart your terminal after the first run to apply the shell configuration.

## Supported Package Managers

| Platform | Package Manager |
|----------|-----------------|
| macOS    | Homebrew        |
| Windows  | winget          |
| Linux    | apk (Alpine)    |
| All      | npm (fallback)  |

## How It Works

1. On session start, checks if your package manager has a newer version
2. If available, automatically runs the upgrade
3. Restart Claude Code to use the new version

## FAQ

**Will this slow down startup?**
No, the check is fast (< 1 second).

**Why am I one version behind?**
Package managers may take up to 24 hours to publish new releases. This is normal.

## License

MIT
