#!/usr/bin/env node
/**
 * Fetches Polish public holidays from Nager.Date API and writes src/data/polish-holidays.json.
 * Run: node scripts/update-polish-holidays.mjs
 * Optional: START_YEAR=2022 END_YEAR=2030 node scripts/update-polish-holidays.mjs
 */

const START_YEAR = parseInt(process.env.START_YEAR || '2024', 10);
const END_YEAR = parseInt(process.env.END_YEAR || '2028', 10);
const API = 'https://date.nager.at/api/v3/PublicHolidays';

const { writeFileSync } = await import('fs');
const { join } = await import('path');
const outPath = join(process.cwd(), 'src', 'data', 'polish-holidays.json');

const dates = new Set();
for (let year = START_YEAR; year <= END_YEAR; year++) {
  const res = await fetch(`${API}/${year}/PL`);
  if (!res.ok) throw new Error(`Failed to fetch ${year}: ${res.status}`);
  const list = await res.json();
  for (const { date } of list) dates.add(date);
}

const sorted = [...dates].sort();
writeFileSync(outPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
console.log(`Wrote ${sorted.length} Polish holidays to ${outPath} (${START_YEAR}-${END_YEAR})`);
