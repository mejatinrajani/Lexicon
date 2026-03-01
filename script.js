  const editor = document.getElementById('editor');
  let hlMode = 'none';
  let caseSensitive = false;
  let excludeStopwords = false;

  const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','as','is','was','are','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','not','no','nor','so','yet','both','either','neither','each','few','more','most','other','some','such','than','that','this','these','those','it','its','they','them','their','there','when','where','who','which','what','how','i','you','he','she','we','my','your','his','her','our','its','up','out','if','then','just','about','into','over','after']);

  function getStats(text) {
    const words = text.trim() === '' ? [] : text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);
    const sentences = text.trim() === '' ? 0 : (text.match(/[^.!?]*[.!?]+/g) || []).filter(s => s.trim()).length || (text.trim() ? 1 : 0);
    const punct = (text.match(/[.,;:!?'"()\[\]{}\-–—]/g) || []).length;
    const symbols = (text.match(/[^a-zA-Z0-9\s.,;:!?'"()\[\]{}\-–—\u{1F300}-\u{1FFFF}]/gu) || []).length;

    const cleanWords = words.map(w => w.replace(/[^a-zA-Z']/g, '').toLowerCase()).filter(w => w.length > 0);
    const uniqueWords = new Set(cleanWords);
    const uniqueChars = new Set(text.toLowerCase().replace(/\s/g, ''));

    const avgWordLen = cleanWords.length > 0 ? (cleanWords.reduce((s, w) => s + w.length, 0) / cleanWords.length).toFixed(1) : 0;
    const avgSentLen = sentences > 0 ? (wordCount / sentences).toFixed(1) : 0;
    const longestWord = cleanWords.sort((a, b) => b.length - a.length)[0] || '—';
    const vocabDensity = wordCount > 0 ? ((uniqueWords.size / wordCount) * 100).toFixed(1) : 0;
    const digits = (text.match(/\d/g) || []).length;
    const uppercaseWords = words.filter(w => /^[A-Z]{2,}$/.test(w)).length;
    const syllables = estimateSyllables(cleanWords);
    const emojis = (text.match(/\p{Emoji_Presentation}/gu) || []).length;

    const flesch = sentences > 0 && wordCount > 0
      ? Math.round(206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount))
      : null;

    const lettersCount = (text.match(/[a-zA-Z]/g) || []).length;
    const spacesCount = (text.match(/\s/g) || []).length;

    const freq = {};
    const wordsForFreq = excludeStopwords ? cleanWords.filter(w => !STOP_WORDS.has(w)) : cleanWords;
    wordsForFreq.forEach(w => { if (w) freq[w] = (freq[w] || 0) + 1; });
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const positiveWords = new Set(['good','great','excellent','wonderful','amazing','love','happy','joy','best','perfect','fantastic','beautiful','awesome','brilliant','superb','positive','success','win','glad','nice']);
    const negativeWords = new Set(['bad','terrible','awful','hate','worst','horrible','ugly','fail','sad','angry','wrong','poor','negative','problem','issue','error','broken','difficult','hard','struggle']);
    let posCount = 0, negCount = 0;
    cleanWords.forEach(w => {
      if (positiveWords.has(w)) posCount++;
      if (negativeWords.has(w)) negCount++;
    });
    const sentiment = posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';

    const readTime = wordCount > 0 ? wordCount / 238 : 0; 
    const speakTime = wordCount > 0 ? wordCount / 130 : 0;

    return {
      wordCount, chars, charsNoSpace, lines, paragraphs, sentences, punct, symbols,
      uniqueWords: uniqueWords.size, uniqueChars: uniqueChars.size,
      avgWordLen, avgSentLen, longestWord, vocabDensity, digits, uppercaseWords, syllables, emojis,
      flesch, topWords, sentiment, readTime, speakTime,
      breakdown: { letters: lettersCount, spaces: spacesCount, digits, punct, symbols, emojis }
    };
  }

  function estimateSyllables(words) {
    return words.reduce((total, word) => {
      word = word.toLowerCase().replace(/[^a-z]/g, '');
      if (!word) return total;
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
      const count = (word.match(/[aeiouy]{1,2}/g) || []).length;
      return total + Math.max(1, count);
    }, 0);
  }

  function formatTime(minutes) {
    if (minutes < 1) {
      const sec = Math.round(minutes * 60);
      return sec <= 0 ? '0 sec' : `${sec} sec`;
    }
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return s > 0 ? `${m}m ${s}s` : `${m} min`;
  }

  function updateStats() {
    const text = editor.value;
    const s = getStats(text);

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && el.textContent !== String(val)) {
        el.textContent = val;
        el.classList.remove('updating');
        void el.offsetWidth;
        el.classList.add('updating');
      }
    };

    set('s-words', s.wordCount.toLocaleString());
    set('s-chars', s.chars.toLocaleString());
    set('s-chars-no-space', s.charsNoSpace.toLocaleString());
    set('s-sentences', s.sentences.toLocaleString());
    set('s-paragraphs', s.paragraphs.toLocaleString());
    set('s-lines', s.lines.toLocaleString());
    set('s-punct', s.punct.toLocaleString());
    set('s-symbols', s.symbols.toLocaleString());

    set('a-unique-words', s.uniqueWords.toLocaleString());
    set('a-unique-chars', s.uniqueChars.toLocaleString());
    set('a-avg-word', s.avgWordLen);
    set('a-avg-sent', `${s.avgSentLen} words`);
    set('a-longest-word', s.longestWord);
    set('a-vocab-density', `${s.vocabDensity}%`);
    set('a-digits', s.digits.toLocaleString());
    set('a-uppercase', s.uppercaseWords.toLocaleString());
    set('a-syllables', s.syllables.toLocaleString());
    set('a-emojis', s.emojis.toLocaleString());

    document.getElementById('read-time').textContent = formatTime(s.readTime);
    document.getElementById('speak-time').textContent = formatTime(s.speakTime);
    document.getElementById('flesch-score').textContent = s.flesch !== null ? s.flesch : '—';

    const badge = document.getElementById('sentiment-badge');
    badge.className = `sentiment-badge ${s.sentiment}`;
    badge.textContent = s.sentiment === 'positive' ? '↑ Positive' : s.sentiment === 'negative' ? '↓ Negative' : '○ Neutral';

    updateTopWords(s.topWords);

    updateDensityChart(s.breakdown);

    updateGoal(s);

    updateSearch();

    if (hlMode !== 'none') renderHighlight(text);
  }

  function updateTopWords(topWords) {
    const list = document.getElementById('top-words-list');
    if (topWords.length === 0) {
      list.innerHTML = '<div class="empty-state">Begin typing to see frequency…</div>';
      return;
    }
    const maxCount = topWords[0][1];
    list.innerHTML = topWords.map(([word, count], i) => `
      <div class="top-word-item">
        <span class="tw-rank">${i + 1}</span>
        <span class="tw-word">${word}</span>
        <div class="tw-bar-wrap"><div class="tw-bar" style="width:${(count/maxCount*100).toFixed(0)}%"></div></div>
        <span class="tw-count">${count}</span>
      </div>
    `).join('');
  }

  function updateDensityChart(breakdown) {
    const data = [
      { val: breakdown.letters, color: 'var(--accent2)' },
      { val: breakdown.spaces, color: 'var(--text-dimmer)' },
      { val: breakdown.digits, color: 'var(--accent5)' },
      { val: breakdown.punct, color: 'var(--accent)' },
      { val: breakdown.symbols, color: 'var(--accent4)' },
      { val: breakdown.emojis, color: '#f9a8d4' },
    ];
    const max = Math.max(...data.map(d => d.val), 1);
    document.getElementById('density-bars').innerHTML = data.map(d =>
      `<div class="density-bar" style="background:${d.color};height:${Math.max(2, (d.val/max*100)).toFixed(0)}%" title="${d.val}"></div>`
    ).join('');
  }

  function updateGoal(s) {
    const goalVal = parseInt(document.getElementById('goal-val').value);
    const goalType = document.getElementById('goal-type').value;
    const fill = document.getElementById('progress-fill');
    const status = document.getElementById('goal-status');

    if (!goalVal || goalVal <= 0) {
      fill.style.width = '0%';
      status.innerHTML = 'Set a goal to track progress';
      return;
    }

    let current = goalType === 'words' ? s.wordCount : goalType === 'chars' ? s.chars : s.sentences;
    const pct = Math.min(100, (current / goalVal * 100)).toFixed(1);
    fill.style.width = pct + '%';
    fill.classList.toggle('complete', parseFloat(pct) >= 100);

    const remaining = Math.max(0, goalVal - current);
    if (remaining === 0) {
      status.innerHTML = `<span class="done">✓ Goal reached!</span> ${current.toLocaleString()} / ${goalVal.toLocaleString()} ${goalType}`;
    } else {
      status.textContent = `${current.toLocaleString()} / ${goalVal.toLocaleString()} ${goalType} — ${remaining.toLocaleString()} remaining`;
    }
  }

  function setHighlight(mode) {
    hlMode = mode;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');

    const display = document.getElementById('highlighted-display');
    const legend = document.getElementById('hl-legend');

    if (mode === 'none') {
      editor.style.display = '';
      display.style.display = 'none';
      legend.classList.remove('visible');
    } else {
      renderHighlight(editor.value);
      legend.classList.add('visible');
    }
  }

  function renderHighlight(text) {
    const display = document.getElementById('highlighted-display');
    editor.style.display = 'none';
    display.style.display = 'block';

    let html = escapeHtml(text);

    if (hlMode === 'words') {
      html = html.replace(/\b([a-zA-Z']+)\b/g, '<mark class="hl-word">$1</mark>');
    } else if (hlMode === 'sentences') {
      html = html.replace(/([^.!?]+[.!?]+)/g, '<mark class="hl-sentence">$1</mark>');
    } else if (hlMode === 'punct') {
      html = html.replace(/([.,;:!?'"()\[\]{}\-–—])/g, '<mark class="hl-punct">$1</mark>');
    }

    display.innerHTML = html || '<span style="color:var(--text-dimmer);font-style:italic">Start typing to see highlights…</span>';
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function updateSearch() {
    const query = document.getElementById('search-input').value;
    const countEl = document.getElementById('search-count');
    if (!query) { countEl.textContent = ''; return; }
    const text = editor.value;
    const flags = caseSensitive ? 'g' : 'gi';
    try {
      const matches = text.match(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags));
      const count = matches ? matches.length : 0;
      countEl.textContent = count > 0 ? `${count} match${count !== 1 ? 'es' : ''}` : 'No matches';
    } catch { countEl.textContent = ''; }
  }

  function toggleCase() {
    caseSensitive = !caseSensitive;
    document.getElementById('case-toggle').classList.toggle('on', caseSensitive);
    updateSearch();
  }

  function toggleStopwords() {
    excludeStopwords = !excludeStopwords;
    document.getElementById('stopword-toggle').classList.toggle('on', excludeStopwords);
    updateStats();
  }

  function clearAll() {
    editor.value = '';
    document.getElementById('search-input').value = '';
    updateStats();
    editor.focus();
  }

  function loadSample() {
    editor.value = `The art of writing is the art of discovering what you believe. Every sentence is a tiny act of creation — a bridge between thought and expression.

    Language shapes reality in profound ways. When we choose our words carefully, we invite precision into our minds. Short sentences punch. Longer sentences, however, allow ideas to breathe, expand, and unfurl like a sail catching wind.

    Consider this: the best writers revise obsessively. They cut ruthlessly. They know that clarity is not the enemy of beauty — it is beauty's most faithful companion.

    Writing demands vulnerability. To write is to think out loud, to lay bare the architecture of one's reasoning, and to risk being misunderstood. Yet it is also one of humanity's greatest gifts.

    So write. Revise. Write again.`;
    updateStats();
  }

  function copyStats() {
    const text = editor.value;
    if (!text.trim()) { alert('No text to analyze.'); return; }
    const s = getStats(text);
    const statsText = `Lexicon Text Analysis
====================
Words: ${s.wordCount}
Characters: ${s.chars}
Characters (no spaces): ${s.charsNoSpace}
Sentences: ${s.sentences}
Paragraphs: ${s.paragraphs}
Lines: ${s.lines}
Punctuation: ${s.punct}
Symbols: ${s.symbols}
Unique Words: ${s.uniqueWords}
Unique Characters: ${s.uniqueChars}
Avg Word Length: ${s.avgWordLen}
Avg Sentence Length: ${s.avgSentLen} words
Longest Word: ${s.longestWord}
Vocabulary Density: ${s.vocabDensity}%
Syllables: ${s.syllables}
Digits: ${s.digits}
Reading Time: ${formatTime(s.readTime)}
Speaking Time: ${formatTime(s.speakTime)}
Flesch Readability: ${s.flesch ?? '—'}
Sentiment: ${s.sentiment}`;

    navigator.clipboard.writeText(statsText).then(() => {
      const btn = document.querySelector('.btn:nth-child(2)');
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = orig, 1500);
    });
  }

  editor.addEventListener('input', updateStats);
  document.getElementById('goal-val').addEventListener('input', updateStats);
  document.getElementById('goal-type').addEventListener('change', updateStats);
  document.getElementById('search-input').addEventListener('input', updateSearch);

  setHighlight('none');
  updateStats();