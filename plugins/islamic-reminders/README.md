# Islamic Reminders for Claude Code

Display Islamic reminders and dhikr during your Claude Code sessions.

## Features

- **Session Start**: Shows "In the name of Allah, the Most Gracious, the Most Merciful" when you start Claude Code
- **After Responses**: Shows random dhikr/remembrances after each Claude response

## Reminders Included

- SubhanAllah - Glory be to Allah
- Alhamdulillah - All praise is due to Allah
- Allahu Akbar - Allah is the Greatest
- La ilaha illallah - There is no god but Allah
- Astaghfirullah - I seek forgiveness from Allah
- And more...

## Installation

### From Marketplace

```bash
# Add the marketplace (if not already added)
/plugin marketplace add yusufsaber/claude-plugins

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
            "command": "echo '{\"continue\": true, \"systemMessage\": \"In the name of Allah, the Most Gracious, the Most Merciful\"}'"
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
