/*!
 * lsj-poll.js — Lifetime Scope Journal Poll Widget
 * Code-Version: 1.0
 * Introduced-In: PR-blog-v2-polls-ads
 * Branch: claude/blog-polls-ads-features-spdD1
 * Date: 2026-05-07
 * Owner: Lifetime Oy
 *
 * Usage: drop a <div class="lsj-poll"> in any post with data-* attributes.
 * Votes persist in localStorage. Seed counts make percentages realistic on day 1.
 * No external dependencies.
 *
 * Required attributes:
 *   data-poll-id       unique string per poll (e.g. "issue-8-agent-native")
 *   data-question      the poll question text
 *   data-options       JSON array of option strings, 2–4 items
 *
 * Optional attributes:
 *   data-seed          JSON array of integers — seed vote counts per option (default: plausible spread)
 *   data-theme         "gold" (default) | "cyan" | "red"
 */
(function () {
  'use strict';

  var THEMES = {
    gold: { accent: '#d4a843', bar: 'rgba(212,168,67,0.25)', barFill: '#d4a843' },
    cyan: { accent: '#06b6d4', bar: 'rgba(6,182,212,0.15)', barFill: '#06b6d4' },
    red: { accent: '#ef4444', bar: 'rgba(239,68,68,0.15)', barFill: '#ef4444' },
  };

  function getTheme(name) {
    return THEMES[name] || THEMES.gold;
  }

  function storageKey(pollId) {
    return 'lsj_poll_' + pollId;
  }

  function loadState(pollId) {
    try {
      var raw = localStorage.getItem(storageKey(pollId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState(pollId, state) {
    try {
      localStorage.setItem(storageKey(pollId), JSON.stringify(state));
    } catch (e) {}
  }

  function totalVotes(counts) {
    return counts.reduce(function (s, n) {
      return s + n;
    }, 0);
  }

  function pct(count, total) {
    if (!total) return 0;
    return Math.round((count / total) * 100);
  }

  function renderResults(container, options, counts, chosenIndex, theme) {
    var t = getTheme(theme);
    var total = totalVotes(counts);
    var html =
      '<p class="lsj-poll__thanks" style="color:' +
      t.accent +
      ';font-weight:700;font-size:0.8rem;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;">Thanks for voting — here\'s what readers think</p>';
    options.forEach(function (opt, i) {
      var p = pct(counts[i], total);
      var isChosen = i === chosenIndex;
      html += '<div class="lsj-poll__result" style="margin-bottom:10px;">';
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
      html +=
        '<span style="font-size:0.85rem;color:' +
        (isChosen ? '#f1f5f9' : '#94a3b8') +
        ';font-weight:' +
        (isChosen ? '700' : '400') +
        ';">';
      if (isChosen) html += '&#10003; ';
      html += opt + '</span>';
      html +=
        '<span style="font-size:0.85rem;font-weight:700;color:' + t.accent + ';">' + p + '%</span>';
      html += '</div>';
      html +=
        '<div style="background:' + t.bar + ';border-radius:4px;height:8px;overflow:hidden;">';
      html +=
        '<div style="background:' +
        t.barFill +
        ';width:' +
        p +
        '%;height:100%;border-radius:4px;transition:width 0.6s ease;"></div>';
      html += '</div>';
      html += '</div>';
    });
    html +=
      '<p style="margin-top:10px;font-size:0.72rem;color:#475569;">' +
      total.toLocaleString() +
      ' vote' +
      (total !== 1 ? 's' : '') +
      '</p>';
    container.innerHTML = html;
  }

  function renderQuestion(container, pollId, question, options, seedCounts, theme) {
    var t = getTheme(theme);
    var html =
      '<p class="lsj-poll__question" style="font-size:0.95rem;font-weight:700;color:#f1f5f9;margin-bottom:12px;">' +
      question +
      '</p>';
    options.forEach(function (opt, i) {
      html += '<button class="lsj-poll__btn" data-index="' + i + '" style="';
      html += 'display:block;width:100%;text-align:left;padding:10px 14px;margin-bottom:8px;';
      html += 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);';
      html += 'border-radius:6px;color:#cbd5e1;font-size:0.85rem;cursor:pointer;';
      html += 'transition:border-color 0.2s,background 0.2s;">';
      html += opt;
      html += '</button>';
    });
    container.innerHTML = html;

    container.querySelectorAll('.lsj-poll__btn').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        btn.style.borderColor = t.accent;
        btn.style.background = 'rgba(255,255,255,0.08)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.borderColor = 'rgba(255,255,255,0.12)';
        btn.style.background = 'rgba(255,255,255,0.04)';
      });
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var newCounts = seedCounts.slice();
        newCounts[idx] += 1;
        var state = { chosenIndex: idx, counts: newCounts };
        saveState(pollId, state);
        renderResults(container, options, newCounts, idx, theme);
      });
    });
  }

  function initPoll(el) {
    var pollId = el.getAttribute('data-poll-id');
    var question = el.getAttribute('data-question');
    var theme = el.getAttribute('data-theme') || 'gold';

    var options;
    try {
      options = JSON.parse(el.getAttribute('data-options') || '[]');
    } catch (e) {
      return;
    }
    if (!pollId || !question || options.length < 2) return;

    var seedCounts;
    try {
      seedCounts = JSON.parse(el.getAttribute('data-seed') || 'null');
    } catch (e) {
      seedCounts = null;
    }
    if (!seedCounts || seedCounts.length !== options.length) {
      /* generate a plausible spread if no seed provided */
      var base = 47 + Math.floor(Math.random() * 30);
      seedCounts = options.map(function (_, i) {
        return Math.max(8, base - i * 14 + Math.floor(Math.random() * 12));
      });
    }

    var t = getTheme(theme);
    var wrapper = document.createElement('div');
    wrapper.className = 'lsj-poll__wrapper';
    wrapper.style.cssText = [
      'border:1px solid rgba(255,255,255,0.1)',
      'border-radius:8px',
      'padding:20px 22px',
      'margin:32px 0',
      'background:rgba(15,23,42,0.7)',
      'backdrop-filter:blur(4px)',
    ].join(';');

    var label = document.createElement('p');
    label.style.cssText =
      'font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:' +
      t.accent +
      ';margin-bottom:14px;';
    label.textContent = 'READER POLL';
    wrapper.appendChild(label);

    var inner = document.createElement('div');
    wrapper.appendChild(inner);
    el.appendChild(wrapper);

    var state = loadState(pollId);
    if (state && typeof state.chosenIndex === 'number') {
      renderResults(inner, options, state.counts, state.chosenIndex, theme);
    } else {
      renderQuestion(inner, pollId, question, options, seedCounts, theme);
    }
  }

  function init() {
    document.querySelectorAll('.lsj-poll').forEach(initPoll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
