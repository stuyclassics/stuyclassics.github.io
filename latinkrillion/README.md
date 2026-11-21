# Unum in Trillione

*A Certamen-themed, rare-answer trivia game. Seven questions, seven subjects, 25 seconds per question.*

**Status:** working static-site MVP for GitHub Pages. **This is an original, independently written project**, inspired only by the general concept of rare-answer trivia. It is not affiliated with Krillion, NJCL, or any other organization.

**Name note:** *Unum in Trillione* is a playful modernized-Latin name meaning approximately “one in a trillion.” The Romans did not use a distinct Classical Latin word for “trillion.” This is branding, not a claim that *trillione* is classical usage.

## 1. The entire repository: three files, zero folders

```text
unum-in-trillione/
├── index.html       # Browser page: layout + all CSS + gameplay JavaScript
├── questions.js     # ONLY file to edit when adding questions or answers
└── README.md        # These specifications and maintenance instructions
```

No package.json, React, Vite, Node server, dependencies, assets directory, build process, cloud database, paid APIs, custom fonts, or GitHub Actions required.

If you know only one thing: **open `questions.js` in GitHub, click Edit, change the question list, and commit**. GitHub Pages republishes the file as a normal static website. Do not edit the source code in `index.html` just to add trivia.

## 2. The seven-question format

Every game has **exactly one question from each of these seven categories, in this order**:

1. `MYTHOLOGY`: Greek and Roman myths, gods, heroes, characters.
2. `ROMAN HISTORY`: Emperors, battles, magistracies, Roman historical topics.
3. `LATIN LANGUAGE`: Grammar, forms, words, constructions.
4. `LATIN LITERATURE`: Authors, works, literary characters, literary devices.
5. `ROMAN CULTURE`: Religion, festivals, priesthoods, army and daily life.
6. `ANCIENT GEOGRAPHY`: Provinces, roads, cities, and sites.
7. `DERIVATIVES`: English words derived from specified Latin roots.

These subjects represent a **Certamen-themed rarity game**. They are not intended to mirror the exact proportions or wording of an official quiz-bowl match.

The question bank currently contains **22 complete question sets with 516 canonical answers** (some answers also accept alternate spellings). A question is a *broad prompt that allows many correct answers*, not a single-answer fact question. For example, “Name a Roman emperor” works; “Who was the first Roman emperor?” does not work for this game, since only one answer can be accepted.

The number of active questions in each category can be different. The picker chooses one from each category, so increasing the number of mythology questions does not accidentally remove the history question.

### Game modes

| Mode | Selection | Save behavior |
| --- | --- | --- |
| Daily | Identical category selections for everyone with the same website version and UTC date. | Auto-saved locally on the device. Only one finished daily run is shown that day. Resume after a refresh. |
| Practice | New random choice of one prompt per category. | Not saved or counted as the daily game. Unlimited replays. |

The daily game resets at **00:00 UTC**, not each player's local midnight. The fixed selection is based on the current UTC date and an ordinary deterministic pseudorandom function. It is not secret or cheat-proof.

### Scoring

Each accepted response has an **editor-assigned** rarity score: `10`, `25`, `40`, `60`, `80`, or `100`. A pass or time-out without a valid typed response earns `0`. The maximum is `700` points.

**These numbers are estimates, not actual global answer frequencies.** If you want an actual statistically uncommon answer score, you will eventually need player-answer submissions and an external datastore. GitHub Pages alone cannot securely collect responses from everyone.

### Answer checking

- The browser compares typed answers to the current question's accepted names and aliases.
- Case is ignored; `æ` and `œ` are expanded; macrons and other diacritics are ignored; basic punctuation/extra spaces are ignored.
- Example: `Iuppiter` may match `Jupiter` **only if you list that alternate form**. Arbitrary `i`/`j` alternations, inflections, spelling mistakes, and synonyms are not automatically understood.
- Incorrect/unrecognized submissions show a warning and **can be retried until the timer expires**.
- The 25-second deadline uses an absolute browser timestamp, so refreshing does not grant extra time.
- The result screen can optionally reveal all accepted answers for those seven prompts (spoilers).
- Shared results include the score and rarity symbols, **never the seven written answers**.

## 3. `questions.js`: the editable database

### What this file does

1. Defines the seven exact category names in `CATEGORIES`.
2. Defines two small helpers, `A()` for an accepted answer and `Q()` for a question.
3. Exposes the entire editable `QUESTION_BANK` to the main page.
4. Holds all accepted spellings and curated scores; no other file needs to be edited to add content.

This is a **JavaScript data file**, not a live server database. Everyone's browser downloads the same public file. GitHub edits become visible when the static site refreshes. Players cannot change the shared database by typing into the game.

### How an answer is written

```js
A('Jupiter', 10, ['Iuppiter', 'Jove']),
```

- `Jupiter`: **canonical name** displayed in feedback and saved results.
- `10`: points earned for choosing this accepted answer.
- `['Iuppiter', 'Jove']`: optional exact alternate names. These all score the same `10` points.
- If no alternates exist, simplify to `A('Diana', 25),`.
- Every `A(...)` entry is separated by a comma.
- Scores must be one of `10`, `25`, `40`, `60`, `80`, `100`.
- Answer and alias text must not duplicate another answer or alias **within that same question**.

**Easiest change in the entire project: add one answer.** In `questions.js`, find the prompt, then add a line inside its `[...]` answers:

```js
A('A new accepted answer', 60),
```

You can add an alternate accepted spelling to an existing entry by adding the third argument:

```js
A('Vergil', 10, ['Virgil', 'Publius Vergilius Maro']),
```

### How a question is written

```js
Q('mythology-heroes', 'MYTHOLOGY',
  'Name a hero from Greek mythology.',
  'Give the name of a mortal hero or heroine.', [
    A('Achilles', 10),
    A('Atalanta', 60),
    A('Amphiaraus', 100)
  ]),
```

Arguments, in order:

| Position | Example | Purpose |
| --- | --- | --- |
| 1. `id` | `'mythology-heroes'` | Permanent **unique** machine identifier. Never reuse another ID. Use lowercase hyphenated words. |
| 2. `category` | `'MYTHOLOGY'` | Must match a string in `CATEGORIES` *exactly*, including spelling and spaces. |
| 3. `prompt` | `'Name a hero ...'` | User-visible question. Should have many valid answers; avoid ambiguous restrictions. |
| 4. `hint` | `'Give the name ...'` | User-visible qualifying note, e.g. Roman not Greek names, spelling accepted, case requirements. |
| 5. `answers` | `[A(...), A(...)]` | The finite list of accepted answers. Aim for 15 to 30 varied entries. |

**To add a new question without touching code:**

1. Open `questions.js` and scroll almost to the bottom.
2. Find the comment `ADD NEW QUESTIONS JUST ABOVE THIS COMMENT`.
3. Paste a copied `Q(...)` record **above** the comment, separated by a comma.
4. Give the question an `id` you have never used before.
5. Choose one of the seven existing category strings; don't invent a new category unless you also intend to redesign the seven-round system.
6. Write a broad prompt and unambiguous hint.
7. Add at least a few valid `A(...)` entries with appropriate scores and optional alternate spellings.
8. Commit the file in GitHub. The next loaded version of the site reads it automatically.
9. Open the site and play practice to confirm the addition eventually appears. There is no build or manual database migration.

**Editing question selection mid-day:** The chosen question **IDs** are saved with a started daily game, so adding a new question doesn't replace that player's in-progress daily prompts upon refresh. A newly visiting player might see a different lineup after a same-day release, so ideally **publish new questions close to the UTC reset** or plan question-bank releases ahead of time. Editing an existing answer/score becomes effective on page reload, but already-earned points remain saved.

### How to review answers before publishing

- Check each answer satisfies the precise prompt and historical/literary date range.
- Add both common English and Latin names as aliases when appropriate.
- If a person has a shared name, disambiguate it in the answer itself.
- Avoid one-letter aliases, ambiguous alternate forms, or two canonical entries with identical normalized spellings.
- Do not assume everything historically correct is automatically recognized. This is a **finite curated bank**, not AI or a Latin dictionary.
- Check score estimates periodically. A score represents your editorial assumption of obscurity, not a fact.
- For derivatives, verify the actual Latin root etymology and decide whether English inflected derivatives should count.
- If the user submits an answer you missed, the simplest fix is adding an `A(...)` entry or an alias to the right question.

## 4. `index.html`: the entire game engine and design

You rarely need to edit this file. It is responsible for all player-visible UI, timers, question selection, answer matching, scoring, daily persistence, and result sharing.

### The four sections in the file

**Section A. `<head>`**

- Responsive viewport and encoding metadata.
- Browser title, page description, theme-color metadata.
- One `<style>` block containing the complete visual design. There are no CSS requests or font files.

**Section B. Page shell**

- Responsive header with site name and **How to Play** button.
- `<main id="app">` is where the current screen is drawn.
- Short About paragraph and transparency footer.
- Native `<dialog id="how-dialog">` modal explaining all rules and the finite answer bank.

**Section C. Two scripts, in order**

1. `<script src="./questions.js"></script>` loads the public question content from the same directory. **Order matters.**
2. The following inline `<script>` contains game logic. Because `questions.js` loads first, the engine can read `CATEGORIES` and `QUESTION_BANK` immediately.

**Section D. Runtime screens and functions**

The engine renders one of four views into the same `#app` element:

```text
                         HOME
                    Daily / Practice
                           |
                           v
                     LIVE QUESTION
              category + prompt + timer
                     /           \
              valid answer     pass/timeout
                     \           /
                           v
                        FEEDBACK
                     answer + points
                           |
                    Next (until #7)
                           |
                           v
                        RESULTS
                7 scores + answer reveal
                 /               \
             Copy score       New practice
```

### CSS styling inventory

| CSS component(s) | Exact responsibility |
| --- | --- |
| `:root` | Central charcoal, ivory, gold, muted, danger, and border color variables; global corner radius. |
| `body`, `body::before` | Roman-inspired charcoal background, warm highlights, faint engraved grid overlay. |
| `.shell`, `.header`, `.brand-*` | Max-width page, coin emblem, game name, edition label, compact header on phones. |
| `.hero`, `.hero-coin`, `.gold-line`, `.lede` | Large welcoming title, inline SVG laurel coin, tagline, decorative line. |
| `.mode-card`, `.mode-tabs`, `.mode-tab` | Switch between Daily and Practice; visible selected mode and context-sensitive start/resume button. |
| `.metrics` | Shows VII questions, XXV seconds, DCC possible points. |
| `.play-wrap`, `.game-status`, `.round-dots` | Gameplay card positioning, date, running score, seven-round progress. |
| `.question-meta`, `.question-category` | Display current round and Certamen category. |
| `.timer-ring`, `.timer-inner`, `.urgent` | Circular countdown. Warning color when six or fewer seconds remain. |
| `.question-title`, `.question-hint`, `.answer-*` | Prompt, clarification text, text entry, and error feedback. |
| `.game-actions`, `.primary-button`, `.skip-button` | Submit, pass, Next, Results and other actionable controls. |
| `.reveal`, `.award-coin`, `.result-tier` | Feedback after every round with scored gold coin and tier title. |
| `.score-head`, `.result-list`, `.result-row` | Final 0–700 score and all seven answers/points. |
| `.results-actions`, `.toast` | Copy result and launch new practice, with copy status. |
| `details`, `.answer-bank` | Optional spoiler-gated accepted answer lists. |
| `dialog`, `.notice` | Rules modal and important limitations. |
| `@media (max-width: 640px)` | Responsive phone header, input, buttons, padding, score cards. |
| `prefers-reduced-motion` | Avoids decorative animations for reduced-motion accessibility preference. |

### Every JavaScript constant and function

| Name | Responsibility |
| --- | --- |
| `SECONDS_PER_ROUND = 25` | Countdown duration. Changing this requires updating public rules copy. |
| `ROUNDS_PER_GAME = 7` | There are seven fixed category slots; should equal `CATEGORIES.length`. |
| `STORAGE_KEY` | Unique browser-save key for this release. Change the version for breaking save changes. |
| `TIERS` | Seven rarity rank labels, minimum score thresholds, and share symbols. |
| `app`, `howDialog` | References to the app screen container and rules modal. |
| `chosenMode`, `state`, `cachedDaily`, `tickId` | Selected tab, current session, saved daily record, active interval handle. |
| `utcDay()` | Returns today as a UTC `YYYY-MM-DD` string. |
| `escapeHTML(text)` | HTML-escapes user-visible content before insertion into template strings. |
| `normalize(text)` | Case-folds, removes macrons/diacritics and punctuation, standardizes whitespace and ligatures. |
| `tierFor(points)` | Converts a point value into its title and share symbol. |
| `seedFromString(value)` | Stable deterministic date/category seed hash. |
| `seededRandom(seed)` | Repeatable pseudorandom sequence, not a security boundary. |
| `pickQuestions(date, mode)` | Chooses exactly **one** question from each of the seven categories. Daily uses a date seed; practice uses random. Questions are sorted by unique ID before choice. |
| `loadDaily()` | Parses and validates the locally saved record, rejects expired/corrupt formats and old dates. |
| `saveDaily()` | Saves the current daily session to `localStorage`, including seven chosen question IDs. Gracefully handles blocked storage. |
| `stopTimer()` | Clears the active countdown interval before changing screens. |
| `totalScore()` | Sums earned points across completed questions. |
| `currentQuestion()` | Returns the current prompt from `state.questions`. |
| `coinSVG()` | Draws the original gold laurel coin as markup, eliminating a separate image file. |
| `showHome()` | Renders landing page, selector, Daily/Practice explanation, and resume/completed state. |
| `startGame(mode)` | Resumes a valid daily save using stored question IDs, or starts a new seven-category session. |
| `progressHTML()` | Renders seven dots and the running score/status line. |
| `render()` | Dispatches to question, feedback, results, or home screen. |
| `renderQuestion()` | Builds prompt, category, timer and form; installs input and pass listeners. |
| `findAnswer(question, rawText)` | Looks for a normalized text match against the current question's canonical names and aliases. |
| `submitAnswer()` | Accepts a matching response before deadline; otherwise shows a retryable warning. |
| `updateTimer()` | Updates remaining seconds and circular indicator from the absolute deadline. |
| `finishRoundFromTimeout()` | On expiration, scores a valid response still present in the input, or passes. |
| `finishRound(answer)` | Scores exactly one response, appends a round result, transitions to feedback, saves daily state. |
| `renderFeedback()` | Shows points, accepted answer, tier, and Next/Results button. |
| `advanceRound()` | Starts next question or completes the seven-question game. |
| `shareText()` | Generates spoiler-free game/date/score/seven-symbol summary; includes site URL when hosted. |
| `copyResult()` | Uses Clipboard API or fallback, shows result. |
| `renderResults()` | Displays all seven answers/points, high-score count, share, practice, and optional accepted-answer reveal. |
| `validateQuestionBank()` | Checks category coverage, unique question IDs, valid scores, nonempty prompts, and no repeated normalized names/aliases within a question. Displays an actionable error instead of silently allowing malformed data. |

### Browser storage schema

This is illustrative, not an actual user's data:

```json
{
  "date": "2026-11-21",
  "phase": "feedback",
  "round": 1,
  "entries": [
    { "questionId": "gods", "answer": "Janus", "points": 40 },
    { "questionId": "emperors", "answer": "Nerva", "points": 60 }
  ],
  "deadline": null,
  "questionIds": [
    "gods", "emperors", "prepositions", "aeneid", "festivals", "roads", "derivatives-scribo"
  ]
}
```

- `date`: puzzle UTC calendar day.
- `phase`: `playing`, `feedback`, or `finished`.
- `round`: zero-indexed question position. At finished, equals `7`.
- `entries`: completed responses. Each stores question ID, canonical answer (or null), and awarded points.
- `deadline`: absolute millisecond epoch timestamp while playing; otherwise null.
- `questionIds`: the exact seven questions chosen, so a same-day content addition does not retroactively swap a resumed player's prompts.

**Note:** the exact illustrative example above is only a shape reference; it does not guarantee that those seven sample IDs are an actual generated day's lineup.

`localStorage` is browser-and-device specific. Clearing browser site data deletes progress. Private mode or restricted storage may prevent saves. There is no account, cloud sync, global leaderboards, or way to tell when someone has edited their local data.

## 5. GitHub Pages deployment

1. Create a new GitHub repository, e.g. `unum-in-trillione`.
2. Unzip the project and upload exactly `index.html`, `questions.js`, and `README.md` into the **repository root**. Do not upload the enclosing folder as an extra nesting level.
3. Commit to the default branch (normally `main`).
4. Open the repository **Settings → Pages**.
5. Choose **Deploy from a branch**, branch **main**, directory **/ (root)**, and click Save.
6. After publishing completes, visit `https://YOUR-USERNAME.github.io/unum-in-trillione/`.
7. Check Daily, Practice, the timer, answer submission, all seven categories, spoilers, sharing and the mobile layout.

GitHub Pages supports this site because it is ordinary static HTML and JavaScript using a relative URL (`./questions.js`), so it works on a repository page as well as a user/organization domain. There is **no build or server-side code** to run. If the page is blank, check that filenames are case-exact, `questions.js` is beside `index.html`, and your data syntax is valid. Also check browser developer-console errors.

### Updating questions using the GitHub website

1. Open the repository's `questions.js`.
2. Click the pencil **Edit** icon.
3. Add or correct `A(...)` lines or a whole `Q(...)` block.
4. Click **Commit changes**. GitHub Pages serves the edited file after deployment.
5. Hard-refresh the published page if it continues showing a cached copy.

Only the account with repository write access can update the shared question bank. Ordinary visitors cannot modify GitHub's source through the quiz UI.

## 6. GitHub Pages limitations

| Desired feature | Works now? | Why / upgrade route |
| --- | --- | --- |
| Responsive site, images, CSS, JS, timers, forms | **Yes** | Browser features only. |
| One shared daily set of seven categories | **Yes** | Date-seeded client-side selection. |
| Unlimited practice | **Yes** | Client-side random category selection. |
| Curated rarity scores | **Yes** | Fixed numbers in `questions.js`. |
| Save / resume on one browser | **Yes** | `localStorage`, not cloud storage. |
| Add hundreds of questions without changing game logic | **Yes** | Edit `questions.js`. |
| Real community rarity based on what other players answer | **No** | Needs an API/database collecting answers. |
| Secure global leaderboard, accounts, cross-device results | **No** | Needs authentication and a backend. |
| Admin UI that writes changes directly from the public site | **No** | Needs auth + GitHub API/backend, or use GitHub's own Edit UI. |
| Guaranteed one attempt per person, anti-cheat | **No** | Public client-side code and browser saves can be inspected/cleared. |
| Timed question fairness while device clock changes | **Limited** | Local browser time can be modified. |
| Exact correction of every historically valid answer | **No** | Only explicitly listed answers/aliases are recognized. |

For a later V2, retain GitHub Pages as the visual host but use a hosted service such as Supabase or Firebase for an answer submission API, real rarity statistics, user accounts, and moderation. Configure authentication and database security rules; never expose secret service keys in client-side GitHub Pages code.

## 7. Safe test checklist before publishing

- [ ] `index.html` and `questions.js` are in the same directory.
- [ ] The site name reads *Unum in Trillione* throughout the UI and copied score.
- [ ] A Daily game has seven questions, one per named category in the intended order.
- [ ] Practice restarts give one fresh randomly selected question per category.
- [ ] A known answer, alias, and macron-containing spelling each work.
- [ ] An unrecognized answer shows feedback but does not end the round.
- [ ] A pass scores zero, and the countdown reaches zero automatically.
- [ ] Refreshing a daily question does not reset the original 25-second deadline.
- [ ] Refreshing feedback returns to the same already-scored answer.
- [ ] Completing seven rounds shows a score out of 700.
- [ ] Copy score contains no typed answers.
- [ ] Optional accepted-answer list is hidden until clicked.
- [ ] Adding an `A(...)` entry to `questions.js` makes it eligible without an HTML edit.
- [ ] Adding a `Q(...)` to one category preserves one-question-per-category gameplay.
- [ ] A deliberate duplicate alias or bad score produces a visible question-data error.
- [ ] Works on both a phone-width screen and a normal desktop browser.

To test locally without GitHub, open `index.html` directly in your browser. For a closer simulation of GitHub hosting, run `python -m http.server 8000` from the repository directory and open `http://localhost:8000/`.

## 8. Recommended next version, without adding clutter prematurely

Keep exactly three source files for this MVP. Only add services/folders when the feature requires them.

1. **Better answer editorial review:** add more alternate spellings, ambiguity notes, and higher-depth Certamen prompts within `questions.js`.
2. **Difficulty tiers:** novice/intermediate/advanced would require a `difficulty` value for each question and corresponding selection logic.
3. **True rarity:** collect answer counts in an external backend, then calculate a percentile or log-scaled score. Clearly distinguish live data from the original curated scores.
4. **Moderation / dispute form:** allow suggestions for missing correct answers, ideally without putting private user data in a public repository.
5. **Questions by publication date:** version daily slates or assign fixed date-to-question IDs if strict worldwide same-day stability becomes important when editors update the bank.

The most important design principle remains: **questions go in `questions.js`; everything else stays untouched.**
