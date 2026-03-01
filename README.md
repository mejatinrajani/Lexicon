# Lexicon – Advanced Text Analysis Tool

Lexicon is a powerful, browser-based **Text Analysis Tool** built using **HTML, CSS, and JavaScript**. It provides real-time insights into your writing with detailed statistics, readability scoring, sentiment detection, frequency analysis, highlighting tools, goal tracking, and much more — all without requiring any backend or external libraries.

---

## Features

### 1. Real-Time Text Statistics

* Word count
* Character count (with & without spaces)
* Sentence count
* Paragraph count
* Line count
* Punctuation & symbol count
* Digit count
* Emoji count

All statistics update instantly as you type.

---

### 2. Advanced Linguistic Insights

* Unique word & character count
* Vocabulary density (%)
* Average word length
* Average sentence length
* Longest word detection
* Uppercase word detection
* Estimated syllable count

---

### 3. Readability Analysis

* **Flesch Reading Ease Score**
* Estimated reading time (238 WPM)
* Estimated speaking time (130 WPM)

This helps writers evaluate clarity and accessibility of their content.

---

### 4. Basic Sentiment Analysis

Detects whether text is:

* ↑ Positive
* ↓ Negative
* ○ Neutral

Based on a predefined positive/negative word dictionary.

---

### 5. Smart Search

* Live keyword search
* Case-sensitive toggle
* Real-time match counter
* Safe regex handling

---

### 6. Word Frequency Analysis

* Displays top 8 most frequent words
* Optional stopword exclusion
* Visual progress bars for comparison

---

### 7. Density Breakdown Chart

Visual representation of:

* Letters
* Spaces
* Digits
* Punctuation
* Symbols
* Emojis

---

### 8. Writing Goal Tracker

Set goals based on:

* Words
* Characters
* Sentences

Includes:

* Progress bar
* Remaining count
* Completion indicator

---

### 9. Highlighting Modes

Toggle between:

* Word highlighting
* Sentence highlighting
* Punctuation highlighting

Helps visually analyze structure and flow.

---

### 10. Copy Analysis Report

Export a clean, formatted summary of all statistics directly to your clipboard.

---

## Tech Stack

* **HTML** – Structure
* **CSS** – Styling & UI animations
* **JavaScript (Vanilla)** – Logic, analysis, DOM updates

No frameworks. No backend. Fully client-side.

---

## How It Works

### Text Processing

* Uses regex-based tokenization
* Cleans words for accurate vocabulary analysis
* Uses Sets for unique counting
* Custom syllable estimation logic
* Safe regex search handling

### Performance

* Efficient real-time updates
* DOM updates optimized with change detection
* Lightweight and fast

---

## Project Structure (Example)

```
/project-folder
│── index.html
│── style.css
│── script.js
│── README.md
```

---

## Use Cases

* Writers & bloggers
* Students
* Researchers
* Content marketers
* Developers building writing tools
* Anyone who wants better writing insights

---

## Future Improvements (Optional Ideas)

* Advanced NLP sentiment scoring
* Export to PDF
* Dark/Light theme toggle
* Keyword density percentage view
* AI-based suggestions

---

## Installation

1. Clone the repository:

   ```
   git clone <your-repo-link>
   ```
2. Open `index.html` in your browser.
3. Start typing and analyzing.

No dependencies required.

---

## Why Lexicon?

✔ Instant feedback
✔ Clean UI
✔ Deep analysis
✔ Goal tracking
✔ Lightweight
✔ Fully offline

Lexicon is designed to make writing measurable, insightful, and smarter.

---