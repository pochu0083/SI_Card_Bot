# SI_Card_Bot

Discord App for Spirit Island

**Invite code**: https://discord.com/oauth2/authorize?client_id=1307237759076794410&permissions=83968&integration_type=0&scope=bot

### How to run the bot

- Clone this repo
- Copy `.env.template` into `.env` and fill in the variables
- `npm install` to install all pre-requisites
- `npm start` to run the bot

### Bot Commands

- -search [search words]
- -draw [card type] [amount (<=10)]
- -dtnw [player count]
- -power [card name]
- -minor [card name]
- -major [card name]
- -unique [card name]
- -uniques [spirit name]
- -blight [card name]
- -board [board letter/name]
- -event [event name]
- -fear [fear name]
- -faqs (search words)
- -random spirit (max complexity (low/moderate/high/vhc))
- -random adversary (min difficulty) (max difficulty)
- -random double (min difficulty) (max difficulty)
- -random scenario
- -random board (all/thematic (defaults to regular))
- -spirit (front/back) [keywords]
- -adversary [name]
- -aspect (spirit or aspect) [aspect keywords] [number of card (i.e. Locus part 1/2)]
- -healing [keyword]
- -incarna [keyword] (front/back)
- -scenario (front/back) [keywords]
- -aid [base | je | ni] — Player aid card images (base = Base game, je = Jagged Earth, ni = Nature Incarnate)
- -invaderdeck (leadingAdversary leadingAdversaryLevel supportingAdversary supportingAdversaryLevel)
- -progression (spirit)
- -extra (spirit) — Extra panel image for a spirit
- -reminder (name) — Reminder image by name (data/reminder.csv)
- -fearDeck (leadingAdversary leadingAdversaryLevel supportingAdversary supportingAdversaryLevel)

### Data and Chinese support

- **Cards** (`data/cards.csv`) — Power, minor, major, unique, blight, event, fear. Search by English and by **Traditional (繁體)** / **Simplified (简体)** Chinese when `name_zh_tw` and `name_zh_cn` are filled.
- **Name CSVs** (`data/spirits.csv`, `adversaries.csv`, `aspects.csv`, `scenarios.csv`, `incarna.csv`, `player_aids.csv`) — Chinese keywords and image URLs for -spirit, -adversary, -aspect, -scenario, -incarna, and -aid.
- **Other CSVs** — `power_progression.csv`, `extra.csv`, `reminder.csv` drive -progression, -extra, and -reminder. All CSVs can be filled from a single source: **`data/card_db.csv`** (Type, English name, Traditional Chinese name, key, url). The scripts in `scripts/` push that data into each target CSV.

**Workflow:** Generate CSVs from built-in data → optionally fill Chinese → update from `card_db.csv` → run tests.

| Step | Command |
|------|--------|
| Generate | `node exportNamesCsv.js`, `node exportCardsCsv.js` (project root) |
| Update from card_db | `node scripts/update*FromCardDb.js` (e.g. `updateCardsMinorFromCardDb.js`, `updateReminderFromCardDb.js`) |
| Test | `node scripts/run*CsvTests.js` (e.g. `runReminderCsvTests.js`, `runMinorCsvTests.js`) |

Full list of update scripts, CSV columns, and test scripts: **data/README.md**.
