# Card data (CSV)

The bot uses `cards.csv` for card lookups (power, major, minor, event, fear, blight, unique).

**Columns:** `name`, `url`, `type`, `aliases`, `name_zh_tw`, `name_zh_cn`, `aliases_zh_tw`, `aliases_zh_cn`

- **name** — English slug (used for matching and URL).
- **url** — Full image URL.
- **type** — `unique` | `minor` | `major` | `event` | `fear` | `blight`.
- **aliases** — Semicolon-separated extra English search terms (event search supports this).
- **name_zh_tw** — Traditional Chinese name (optional); users can search in 繁體中文.
- **name_zh_cn** — Simplified Chinese name (optional); users can search in 简体中文.
- **aliases_zh_tw** — Semicolon-separated Traditional Chinese alias phrases (optional); event search supports Chinese alias.
- **aliases_zh_cn** — Semicolon-separated Simplified Chinese alias phrases (optional).

**To generate the full CSV from current ImageNames data**, run from project root:

```bash
node exportCardsCsv.js
```

This overwrites `cards.csv` with all cards and event aliases; `name_zh_tw` and `name_zh_cn` are left empty for you to fill.

**To update event rows from card_db.csv** (url, name_zh_tw/cn, aliases, aliases_zh_tw/cn; card_db uses comma to separate name and alias in English/Traditional columns):

```bash
node scripts/updateCardsEventsFromCardDb.js
```

**To update blight rows from card_db.csv** (url, name_zh_tw, name_zh_cn):

```bash
node scripts/updateCardsBlightFromCardDb.js
```

**To update fear rows from card_db.csv** (url, name_zh_tw, name_zh_cn):

```bash
node scripts/updateCardsFearFromCardDb.js
```

**To update major rows from card_db.csv** (url, name_zh_tw, name_zh_cn):

```bash
node scripts/updateCardsMajorFromCardDb.js
```

**To update minor rows from card_db.csv** (url, name_zh_tw, name_zh_cn):

```bash
node scripts/updateCardsMinorFromCardDb.js
```

---

## Name CSVs (spirits, adversaries, aspects, scenarios, incarna)

These CSVs add **Chinese keyword support** and **image URLs** for the corresponding bot commands. If a CSV exists and has data, the command uses it first (including fuzzy match and Chinese); otherwise it falls back to the built-in JS data.

**Columns (common):** `key` (or `spirit`+`aspect_name` for aspects), `name`, `image_urls`, `name_zh_tw`, `name_zh_cn`

- **key** — Internal id (e.g. spirit title, adversary key, scenario key).
- **name** — English display name.
- **image_urls** — Semicolon-separated image URLs (e.g. front;back).
- **name_zh_tw** / **name_zh_cn** — Traditional / Simplified Chinese; users can search in 繁體中文 or 简体中文.

**To generate the name CSVs** from the command source files, run from project root:

```bash
node exportNamesCsv.js
```

This writes `data/spirits.csv`, `data/adversaries.csv`, `data/aspects.csv`, `data/scenarios.csv`, and `data/incarna.csv`. Fill `name_zh_tw` and `name_zh_cn` as needed.

**To update scenarios.csv from card_db.csv** (each scenario has two rows in card_db: first = front URL, second = back URL; sets `image_urls` = front;back, `name_zh_tw`, `name_zh_cn`):

```bash
node scripts/updateScenariosFromCardDb.js
```

**Commands that use these CSVs:**

| Command | CSV | Purpose |
|--------|-----|--------|
| `-spirit (front/back) [keywords]` | spirits.csv | Spirit panel image(s); Chinese + URL from CSV |
| `-adversary [name]` | adversaries.csv | Adversary panel image; Chinese + URL from CSV |
| `-aspect [spirit or aspect] [number]` | aspects.csv | Aspect card image(s); Chinese + URL from CSV |
| `-scenario (front/back) [keywords]` | scenarios.csv | Scenario front/back image; Chinese + URL from CSV |
| `-incarna [keyword] (front/back)` | incarna.csv | Incarna image; Chinese + URL from CSV |
| `-aid [base, je, ni]` | player_aids.csv | Player aid card images; keywords: base, je, ni |

**Cards (power, minor, major, unique, blight, event, fear)** use `cards.csv` only (see above); they already support Chinese via `name_zh_tw` and `name_zh_cn` and return the single `url` from that CSV.
