#!/bin/bash

# Array of Islamic prayers (Arabic + English meaning)
declare -a prayers=(
    "سُبْحَانَ اللَّهِ — Glory be to Allah"
    "الْحَمْدُ لِلَّهِ — All praise is due to Allah"
    "اللَّهُ أَكْبَرُ — Allah is the Greatest"
    "لَا إِلَٰهَ إِلَّا اللَّهُ — There is no god but Allah"
    "أَسْتَغْفِرُ اللَّهَ — I seek forgiveness from Allah"
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ — Glory be to Allah and praise Him"
    "سُبْحَانَ اللَّهِ الْعَظِيمِ — Glory be to Allah, the Magnificent"
    "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ — No power or strength except with Allah"
    "تَوَكَّلْتُ عَلَى اللَّهِ — I put my trust in Allah"
    "مَا شَاءَ اللَّهُ — What Allah wills"
)

# Get random prayer
RANDOM_INDEX=$((RANDOM % ${#prayers[@]}))
PRAYER="${prayers[$RANDOM_INDEX]}"

# Output JSON with systemMessage (displays inline in the Claude Code app)
cat <<PRAYER_EOF
{
  "continue": true,
  "systemMessage": "$PRAYER"
}
PRAYER_EOF
