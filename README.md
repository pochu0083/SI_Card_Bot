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
- -fearDeck (leadingAdversary leadingAdversaryLevel supportingAdversary supportingAdversaryLevel)

### Data and Chinese support

- **Cards** (`data/cards.csv`) — Power, minor, major, unique, blight, event, fear. Supports search by English and by **Traditional (繁體)** / **Simplified (简体)** Chinese when `name_zh_tw` and `name_zh_cn` are filled.
- **Name CSVs** (`data/spirits.csv`, `adversaries.csv`, `aspects.csv`, `scenarios.csv`, `incarna.csv`, `player_aids.csv`) — Provide Chinese keywords and image URLs for -spirit, -adversary, -aspect, -scenario, -incarna, and -aid.

To **generate** CSVs from built-in data: `node exportNamesCsv.js` (name CSVs), `node exportCardsCsv.js` (cards).  
To **update** rows from a `card_db.csv` (URLs + Chinese names), use the scripts in `scripts/` — see **data/README.md** for the full list (events, blight, fear, major, minor, scenarios) and usage.
