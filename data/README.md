# Card data (CSV)

The bot uses CSVs under `data/` for card lookups, spirit/adversary/aspect panels, progression, extra panels, reminders, and player aids. If a CSV exists and has data, the command uses it (including fuzzy match and Chinese); otherwise it falls back to built-in JS data where applicable.

---

## CSV reference

### cards.csv

Card lookups: power, major, minor, unique, event, fear, blight.

| Column | Description |
|--------|-------------|
| **name** | English slug (matching and URL). |
| **url** | Full image URL. |
| **type** | `unique` \| `minor` \| `major` \| `event` \| `fear` \| `blight`. |
| **aliases** | Semicolon-separated extra English search terms. |
| **name_zh_tw** / **name_zh_cn** | Traditional / Simplified Chinese (optional). |
| **aliases_zh_tw** / **aliases_zh_cn** | Semicolon-separated Chinese alias phrases (optional). |

### Name CSVs (panels and aids)

Shared column idea: `key`, `name`, `image_urls` (semicolon-separated, e.g. front;back), `name_zh_tw`, `name_zh_cn`.

| File | Purpose |
|------|--------|
| **spirits.csv** | Spirit panel(s); two URLs = front;back. |
| **adversaries.csv** | Adversary panel. |
| **aspects.csv** | Aspect card(s); `spirit` + `aspect_name`, multiple URLs per aspect. |
| **scenarios.csv** | Scenario front;back. |
| **incarna.csv** | Incarna image(s). |
| **player_aids.csv** | Player aid cards; keywords base, je, ni. |

### Single-URL / reminder CSVs

| File | Columns | Purpose |
|------|---------|--------|
| **power_progression.csv** | key, name, url, name_zh_tw, name_zh_cn | One image per spirit (power progression). |
| **extra.csv** | key, name, url, name_zh_tw, name_zh_cn | One extra panel image per spirit. |
| **reminder.csv** | key, name, image_urls, name_zh_tw, name_zh_cn | Reminders; image_urls = one URL or front;back. |

---

## Generate CSVs (from source / ImageNames)

Run from **project root**. These create or overwrite CSVs; you can then fill Chinese columns and/or update from card_db.

| Script | Output | Note |
|--------|--------|------|
| **exportCardsCsv.js** | `data/cards.csv` | All cards from ImageNames; `name_zh_tw` / `name_zh_cn` left empty. |
| **exportNamesCsv.js** | `data/spirits.csv`, `adversaries.csv`, `aspects.csv`, `scenarios.csv`, `incarna.csv` | From command source files; fill Chinese as needed. |

```bash
node exportCardsCsv.js
node exportNamesCsv.js
```

---

## Update from card_db.csv

Run from **project root**. These update existing CSVs using `data/card_db.csv` (url, name_zh_tw, name_zh_cn, and sometimes aliases or image_urls).

### cards.csv (by type)

| Script | Type | Updates |
|--------|------|--------|
| updateCardsEventsFromCardDb.js | Events | url, name_zh_tw/cn, aliases, aliases_zh_tw/cn |
| updateCardsBlightFromCardDb.js | Blight | url, name_zh_tw, name_zh_cn |
| updateCardsFearFromCardDb.js | Fear | url, name_zh_tw, name_zh_cn |
| updateCardsMajorFromCardDb.js | Major | url, name_zh_tw, name_zh_cn |
| updateCardsMinorFromCardDb.js | Minor | url, name_zh_tw, name_zh_cn |
| updateCardsUniqueFromCardDb.js | Unique | url, name_zh_tw, name_zh_cn |

### Name CSVs (panels: front;back or multiple URLs)

| Script | Target | Rule |
|--------|--------|------|
| updateAdversariesFromCardDb.js | adversaries.csv | Adversary rows; one image per row |
| updateSpiritsFromCardDb.js | spirits.csv | Two rows per spirit: first = front, second = back → image_urls = front;back |
| updateAspectsFromCardDb.js | aspects.csv | Aspect rows grouped by spirit + aspect; URLs joined as image_urls |
| updateScenariosFromCardDb.js | scenarios.csv | Two rows per scenario: first = front, second = back → image_urls = front;back |

### Progression, extra, reminder

| Script | Target | Rule |
|--------|--------|------|
| updatePowerProgressionFromCardDb.js | power_progression.csv | Progression rows; one url per spirit name |
| updateExtraFromCardDb.js | extra.csv | Extra rows; builds file from Type=Extra |
| updateReminderFromCardDb.js | reminder.csv | Reminder rows; same name = one card, first = front, second = back → image_urls = front;back |

**Example (run any one):**

```bash
node scripts/updateCardsMinorFromCardDb.js
node scripts/updateSpiritsFromCardDb.js
node scripts/updateReminderFromCardDb.js
```

---

## Commands that use these CSVs

| Command | CSV | Purpose |
|--------|-----|--------|
| -power, -minor, -major, -unique, -blight, -event, -fear, -search | cards.csv | Card image URL; Chinese via name_zh_tw, name_zh_cn |
| -spirit (front/back) [keywords] | spirits.csv | Spirit panel image(s) |
| -adversary [name] | adversaries.csv | Adversary panel |
| -aspect [spirit or aspect] [number] | aspects.csv | Aspect card image(s) |
| -scenario (front/back) [keywords] | scenarios.csv | Scenario front/back |
| -incarna [keyword] (front/back) | incarna.csv | Incarna image |
| -aid [base \| je \| ni] | player_aids.csv | Player aid card images |
| -progression (spirit) | power_progression.csv | Power progression image by spirit name |
| -extra (spirit) | extra.csv | Extra panel image by spirit name |
| -reminder (name) | reminder.csv | Reminder image(s); front;back when two-sided |
