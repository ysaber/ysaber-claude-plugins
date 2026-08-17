# Islamic Reminders for Claude Code

Display Islamic reminders and dhikr during your Claude Code sessions.

## Features

- **Session Start**: Shows بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — In the name of Allah, the Most Gracious, the Most Merciful — when you start Claude Code
- **After Responses**: Shows random dhikr/remembrances after each Claude response

Reminders are shown in Arabic script with the English meaning alongside.

## Reminders Included

- سُبْحَانَ اللَّهِ — Glory be to Allah
- الْحَمْدُ لِلَّهِ — All praise is due to Allah
- اللَّهُ أَكْبَرُ — Allah is the Greatest
- لَا إِلَٰهَ إِلَّا اللَّهُ — There is no god but Allah
- أَسْتَغْفِرُ اللَّهَ — I seek forgiveness from Allah
- And more...

## Installation

### From Marketplace

```bash
# Add the marketplace (if not already added)
/plugin marketplace add ysaber/claude-plugins

# Install the plugin
/plugin install islamic-reminders@claude-plugins
```

### Manual Installation

1. Clone this repository
2. Add the hooks to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"continue\": true, \"systemMessage\": \"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — In the name of Allah, the Most Gracious, the Most Merciful\"}'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "bash /path/to/hooks/show-prayer.sh"
          }
        ]
      }
    ]
  }
}
```

## License

MIT
