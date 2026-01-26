#!/usr/bin/env node

const prayers = [
  "SubhanAllah - Glory be to Allah",
  "Alhamdulillah - All praise is due to Allah",
  "Allahu Akbar - Allah is the Greatest",
  "La ilaha illallah - There is no god but Allah",
  "Astaghfirullah - I seek forgiveness from Allah",
  "SubhanAllahi wa bihamdihi - Glory be to Allah and praise Him",
  "SubhanAllahil Azeem - Glory be to Allah, the Magnificent",
  "La hawla wa la quwwata illa billah - No power or strength except with Allah",
  "Tawakkaltu 'ala Allah - I put my trust in Allah",
  "Masha'Allah - What Allah wills"
];

const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];

console.log(JSON.stringify({
  continue: true,
  systemMessage: randomPrayer
}));
