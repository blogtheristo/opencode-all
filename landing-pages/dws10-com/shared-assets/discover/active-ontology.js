/* Active Ontology UX v2 — DISCOVER layer for dws10.com.
 * Not chat-first: decision question → recognise yourself → industry → yes/no diagnostics
 * that say what they rule out → uncertainty made visible → path → solutions last.
 * Every step writes an anonymised observation (Chapter 14 CAPTURE) via /api/observations.
 * Spec: docs/specs/active-ontology-ux-v2.md · LD-2026-09-003/004/005 (HIC APPLY 24.09.2026) */
(function () {
  'use strict';
  var mount = document.getElementById('dws-discover');
  if (!mount || window.__dwsDiscoverLoaded) return;
  window.__dwsDiscoverLoaded = true;
  var lang = (mount.getAttribute('data-lang') || document.documentElement.lang || 'en').slice(0, 2);
  if (lang !== 'fi') lang = 'en';
  var page = location.pathname;
  var cfg = null,
    T = null,
    state = {
      id: null,
      query: '',
      topics: [],
      industry: null,
      recognise: null,
      answers: {},
      ruledOut: {},
      success: '',
      pathKey: null,
      ownership: { known: null, map: {} },
    };
  var params = new URLSearchParams(location.search);
  try {
    state.industry = params.get('industry') || localStorage.getItem('dws.industry') || null;
  } catch (e) {
    /* storage may be blocked */
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c) n.appendChild(c);
    });
    return n;
  }
  function t(k) {
    return (T && T[k]) || k;
  }
  function L(o) {
    return (o && (o[lang] || o.en || o.fi)) || '';
  }

  function classify(text) {
    var q = (text || '').toLowerCase(),
      hits = [];
    Object.keys(cfg.topics).forEach(function (id) {
      var kws = cfg.topics[id].keywords || [];
      var n = kws.filter(function (k) {
        return q.indexOf(k) >= 0;
      }).length;
      if (n) hits.push({ id: id, n: n });
    });
    hits.sort(function (a, b) {
      return b.n - a.n;
    });
    var ind = null;
    cfg.industries.forEach(function (i) {
      if (
        !ind &&
        (i.keywords || []).some(function (k) {
          return q.indexOf(k) >= 0;
        })
      )
        ind = i.id;
    });
    return {
      topics: hits
        .map(function (h) {
          return h.id;
        })
        .slice(0, 3),
      industry: ind,
      confidence: hits.length ? Math.min(0.95, 0.5 + hits[0].n * 0.15) : 0.2,
    };
  }

  function anonymise(s) {
    return (s || '')
      .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
      .replace(/\+?\d[\d\s().-]{6,}\d/g, '[phone]')
      .slice(0, 400);
  }

  function send(evt, extra) {
    var body = Object.assign(
      {
        id: state.id,
        event: evt,
        page: page,
        lang: lang,
        query: anonymise(state.query),
        industry: state.industry,
        topics: state.topics,
        recognise: state.recognise,
        path: state.pathKey,
        answers: state.answers,
        success: anonymise(state.success),
        ownership: state.ownership,
      },
      extra || {},
    );
    try {
      fetch('/api/observations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      })
        .then(function (r) {
          return r.ok ? r.json() : null;
        })
        .then(function (j) {
          if (j && j.id && !state.id) state.id = j.id;
        })
        .catch(function () {
          /* offline: observation kept client-side only */
        });
    } catch (e) {
      /* ignore */
    }
  }

  function pathFor() {
    var topic =
      state.topics[0] ||
      (state.recognise &&
        (
          cfg.recognise.find(function (r) {
            return r.id === state.recognise;
          }) || {}
        ).topics[0]) ||
      'strategy';
    var keys = Object.keys(cfg.paths);
    var exact = state.industry
      ? keys.find(function (k) {
          return k === state.industry + ':' + topic;
        })
      : null;
    var cross = keys.find(function (k) {
      return k === '*:' + topic;
    });
    var byTopic = keys.find(function (k) {
      return k.split(':')[1] === topic;
    });
    return exact || cross || byTopic || '*:strategy';
  }

  function posteriors(p) {
    var w = {};
    p.causes.forEach(function (c) {
      w[c.id] = state.ruledOut[c.id] ? 0 : c.prior;
    });
    Object.keys(state.answers).forEach(function (qid) {
      var q = p.questions.find(function (x) {
        return x.id === qid;
      });
      if (!q) return;
      if (state.answers[qid] === 'no')
        (q.noBoosts || []).forEach(function (id) {
          if (w[id]) w[id] *= 2;
        });
    });
    var sum =
      Object.keys(w).reduce(function (s, k) {
        return s + w[k];
      }, 0) || 1;
    return p.causes
      .map(function (c) {
        return { c: c, p: w[c.id] / sum };
      })
      .sort(function (a, b) {
        return b.p - a.p;
      });
  }

  function render(step) {
    mount.innerHTML = '';
    var root = el('section', { class: 'ao', 'aria-label': t('question') });
    mount.appendChild(root);
    if (step === 'ask') {
      root.appendChild(el('h2', { class: 'ao-q', text: t('question') }));
      var input = el('input', {
        class: 'ao-input',
        type: 'text',
        maxlength: '400',
        placeholder: t('placeholder'),
        'aria-label': t('question'),
      });
      var go = function () {
        state.query = input.value.trim();
        if (!state.query) return;
        var c = classify(state.query);
        state.topics = c.topics;
        if (!state.industry && c.industry) state.industry = c.industry;
        send('query', { ontology_guess: c });
        render('confirm');
      };
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') go();
      });
      root.appendChild(
        el('div', { class: 'ao-row' }, [
          input,
          el('button', { class: 'ao-btn', text: t('submit'), onclick: go }),
        ]),
      );
      root.appendChild(el('p', { class: 'ao-sub', text: t('recognise') }));
      root.appendChild(
        el(
          'div',
          { class: 'ao-cards' },
          cfg.recognise.map(function (r) {
            return el('button', {
              class: 'ao-card',
              text: L(r),
              onclick: function () {
                state.recognise = r.id;
                state.topics = r.topics.slice();
                state.query = L(r);
                send('recognise');
                render('confirm');
              },
            });
          }),
        ),
      );
      return;
    }
    if (step === 'confirm') {
      root.appendChild(el('h2', { class: 'ao-q', text: t('confirmQ') }));
      root.appendChild(
        el(
          'div',
          { class: 'ao-chips' },
          (state.topics.length ? state.topics : ['strategy']).map(function (id) {
            return el('span', {
              class: 'ao-chip',
              'aria-pressed': 'true',
              text: '✓ ' + L(cfg.topics[id]),
            });
          }),
        ),
      );
      var st = el('div', { class: 'ao-step' }, [el('h3', { text: t('industryQ') })]);
      var featured = cfg.industries.filter(function (i) {
          return i.featured;
        }),
        rest = cfg.industries.filter(function (i) {
          return !i.featured;
        });
      var chips = el('div', { class: 'ao-chips' });
      function chip(i) {
        return el('button', {
          class: 'ao-chip',
          'aria-pressed': String(state.industry === i.id),
          text: L(i),
          onclick: function () {
            state.industry = i.id;
            try {
              localStorage.setItem('dws.industry', i.id);
            } catch (e) {
              /* ignore */
            }
            send('industry');
            render('diagnose');
          },
        });
      }
      featured.forEach(function (i) {
        chips.appendChild(chip(i));
      });
      var more = el('button', {
        class: 'ao-chip',
        text: '…',
        onclick: function () {
          rest.forEach(function (i) {
            chips.insertBefore(chip(i), more);
          });
          more.remove();
        },
      });
      chips.appendChild(more);
      chips.appendChild(
        el('button', {
          class: 'ao-chip',
          text: t('otherIndustry'),
          onclick: function () {
            state.industry = 'other';
            send('industry');
            render('diagnose');
          },
        }),
      );
      st.appendChild(chips);
      root.appendChild(st);
      return;
    }
    if (step === 'diagnose') {
      state.pathKey = pathFor();
      var p = cfg.paths[state.pathKey];
      root.appendChild(el('h2', { class: 'ao-q', text: L(p.situation) }));
      var post = posteriors(p);
      var box = el('div', { class: 'ao-step' }, [el('h3', { text: t('whyLabel') })]);
      post.slice(0, 4).forEach(function (r) {
        box.appendChild(
          el('div', { class: 'ao-bar' }, [
            el('b', { text: Math.round(r.p * 100) + ' %' }),
            el('div', {}, [
              el('span', { style: 'width:' + Math.max(4, Math.round(r.p * 100)) + '%' }),
              el('small', { text: L(r.c) }),
            ]),
          ]),
        );
      });
      root.appendChild(box);
      var qs = el('div', { class: 'ao-step' }, [el('h3', { text: t('whichBest') })]);
      p.questions.forEach(function (q) {
        var rules = (q.yesRulesOut || [])
          .map(function (id) {
            var c = p.causes.find(function (x) {
              return x.id === id;
            });
            return c ? L(c) : id;
          })
          .join(', ');
        var row = el('div', { class: 'ao-yn' }, [
          el('div', {}, [
            document.createTextNode(L(q)),
            el('small', { text: rules ? t('rulesOut') + ': ' + rules : '' }),
          ]),
          el(
            'div',
            { class: 'ao-chips' },
            ['yes', 'no'].map(function (v) {
              return el('button', {
                class: 'ao-chip',
                'aria-pressed': String(state.answers[q.id] === v),
                text: v === 'yes' ? (lang === 'fi' ? 'Kyllä' : 'Yes') : lang === 'fi' ? 'Ei' : 'No',
                onclick: function () {
                  state.answers[q.id] = v;
                  if (v === 'yes')
                    (q.yesRulesOut || []).forEach(function (id) {
                      state.ruledOut[id] = true;
                    });
                  send('answer', { question: q.id, answer: v });
                  render('diagnose');
                },
              });
            }),
          ),
        ]);
        qs.appendChild(row);
      });
      qs.appendChild(
        el('div', { class: 'ao-row', style: 'margin-top:14px' }, [
          el('button', {
            class: 'ao-btn',
            text: lang === 'fi' ? 'Näytä suositeltu eteneminen' : 'Show the recommended path',
            onclick: function () {
              render('ownership');
            },
          }),
        ]),
      );
      root.appendChild(qs);
      return;
    }
    // Ownership Verdict (LD-2026-09-007, HIC round 3): four distinct things — problem ownership,
    // decision rights, action responsibility, consequence accountability. Action can be
    // outsourced; accountability cannot. Sometimes the most valuable answer is "not yours to
    // solve — yours to transfer to the right owner".
    function verdict() {
      var o = state.ownership,
        m = o.map;
      if (o.known === 'no') return 'discovery';
      if (m.action === 'external' && m.accountability && m.accountability !== 'unknown')
        return 'outsourced_accountability';
      if (!m.owner || !m.decision) return null;
      if (m.owner !== 'unknown' && (m.decision !== m.owner || (m.data && m.data !== m.owner)))
        return 'transfer';
      if (m.decision === m.owner && (!m.action || m.action === m.owner)) return 'aligned';
      return null;
    }
    if (step === 'ownership') {
      // Ownership is an ontological stage (LD-2026-09-007): Observation → Meaning → Ownership →
      // Decision → Action → Outcome. Roles only, never names.
      var own = cfg.ownership || { dimensions: [], roles: [] };
      root.appendChild(el('h2', { class: 'ao-q', text: t('ownershipQ') }));
      root.appendChild(el('p', { class: 'ao-hint', text: t('ownershipHint') }));
      var kn = el('div', { class: 'ao-step' }, [
        el(
          'div',
          { class: 'ao-chips' },
          [
            ['yes', 'ownYes'],
            ['partly', 'ownPartly'],
            ['no', 'ownNo'],
          ].map(function (o) {
            return el('button', {
              class: 'ao-chip',
              'aria-pressed': String(state.ownership.known === o[0]),
              text: t(o[1]),
              onclick: function () {
                state.ownership.known = o[0];
                render('ownership');
              },
            });
          }),
        ),
      ]);
      root.appendChild(kn);
      if (state.ownership.known === 'no') {
        root.appendChild(
          el('div', { class: 'ao-step ao-discovery' }, [
            el('h3', { text: t('discoveryLabel') }),
            el('p', { text: t('discoveryText') }),
          ]),
        );
      } else if (state.ownership.known) {
        var mp = el('div', { class: 'ao-step' }, [el('h3', { text: t('mappingLabel') })]);
        own.dimensions.forEach(function (d) {
          mp.appendChild(
            el('div', { class: 'ao-yn' }, [
              el('div', {}, [document.createTextNode(L(d))]),
              el(
                'div',
                { class: 'ao-chips' },
                own.roles
                  .filter(function (r) {
                    if (r.externalOnly && !d.allowExternal) return false;
                    if (d.internalOnly && r.externalOnly) return false;
                    return true;
                  })
                  .map(function (r) {
                    return el('button', {
                      class: 'ao-chip ao-chip-sm',
                      'aria-pressed': String(state.ownership.map[d.id] === r.id),
                      text: L(r),
                      onclick: function () {
                        state.ownership.map[d.id] = r.id;
                        render('ownership');
                      },
                    });
                  }),
              ),
            ]),
          );
        });
        var v = verdict();
        if (v)
          mp.appendChild(
            el('div', { class: 'ao-verdict' }, [
              el('h4', { text: t('verdictLabel') }),
              el('p', { text: L((own.verdicts || {})[v]) }),
            ]),
          );
        else mp.appendChild(el('p', { class: 'ao-hint', text: t('mappingFirst') }));
        root.appendChild(mp);
      }
      if (state.ownership.known) {
        root.appendChild(
          el('div', { class: 'ao-row', style: 'margin-top:14px' }, [
            el('button', {
              class: 'ao-btn',
              text: t('continueOwn'),
              onclick: function () {
                state.ownership.verdict = verdict();
                send('ownership');
                send('path_shown');
                render('path');
              },
            }),
          ]),
        );
      }
      return;
    }
    if (step === 'path') {
      var p2 = cfg.paths[state.pathKey],
        top = posteriors(p2)[0];
      root.appendChild(el('h2', { class: 'ao-q', text: L(p2.goal) }));
      root.appendChild(
        el('div', { class: 'ao-summary' }, [
          el('div', {}, [
            el('small', { text: lang === 'fi' ? 'Todennäköisin syy' : 'Most likely cause' }),
            document.createTextNode(L(top.c) + ' (' + Math.round(top.p * 100) + ' %)'),
          ]),
          el('div', {}, [
            el('small', { text: lang === 'fi' ? 'Arvioitu toteutusaika' : 'Estimated time' }),
            document.createTextNode(p2.weeks + (lang === 'fi' ? ' viikkoa' : ' weeks')),
          ]),
          el('div', {}, [
            el('small', { text: lang === 'fi' ? 'Suositeltu aloitus' : 'Recommended start' }),
            document.createTextNode(
              (
                p2.solutions.find(function (s) {
                  return s.start;
                }) || p2.solutions[0]
              ).name,
            ),
          ]),
        ]),
      );
      var pathBox = el('div', { class: 'ao-step' }, [
        el('h3', { text: t('pathLabel') }),
        el(
          'ol',
          { class: 'ao-path' },
          L(p2.path).map(function (s) {
            return el('li', { text: s });
          }),
        ),
      ]);
      root.appendChild(pathBox);
      var succ = el('div', { class: 'ao-step' }, [el('h3', { text: t('successQ') })]);
      var sIn = el('input', {
        class: 'ao-input',
        type: 'text',
        maxlength: '300',
        placeholder: t('successPh'),
      });
      succ.appendChild(
        el('div', { class: 'ao-row' }, [
          sIn,
          el('button', {
            class: 'ao-btn alt',
            text: t('submit'),
            onclick: function () {
              state.success = sIn.value.trim();
              send('success');
              render('solutions');
            },
          }),
          el('button', {
            class: 'ao-chip',
            text: t('skip'),
            onclick: function () {
              render('solutions');
            },
          }),
        ]),
      );
      root.appendChild(succ);
      return;
    }
    if (step === 'solutions') {
      var p3 = cfg.paths[state.pathKey];
      root.appendChild(el('h2', { class: 'ao-q', text: t('solutionsLabel') }));
      root.appendChild(
        el(
          'div',
          { class: 'ao-sol' },
          p3.solutions.map(function (s) {
            return el('div', {}, [
              el('span', {
                class: 'tag',
                text: s.start ? (lang === 'fi' ? 'Suositeltu aloitus' : 'Recommended start') : '',
              }),
              el('h4', { text: s.name }),
              el('p', { text: t('whyRec') + ': ' + L(s.why) }),
              el('a', {
                href: '/buy/#' + encodeURIComponent(s.sku),
                style: 'display:inline-block;margin-top:8px;color:#fbbf24',
                text: lang === 'fi' ? 'Katso ja hanki →' : 'See and acquire →',
                onclick: function () {
                  send('selected', {
                    selected_sku: s.sku,
                    recommended_sku: (
                      p3.solutions.find(function (x) {
                        return x.start;
                      }) || p3.solutions[0]
                    ).sku,
                  });
                },
              }),
            ]);
          }),
        ),
      );
      root.appendChild(
        el('div', { class: 'ao-row', style: 'margin-top:18px' }, [
          el('a', {
            class: 'ao-btn',
            href: 'https://calendar.app.google/5Kh3k9uhJtt6F3Mu9',
            text: t('cta1'),
            onclick: function () {
              send('result', { result: 'workshop_clicked' });
            },
          }),
          el('a', {
            class: 'ao-btn alt',
            href: '/free-audit/',
            text: t('cta2'),
            onclick: function () {
              send('result', { result: 'assessment_clicked' });
            },
          }),
        ]),
      );
      root.appendChild(el('p', { class: 'ao-thanks', text: t('thanks') }));
      return;
    }
  }

  fetch('/config/active-ontology.json')
    .then(function (r) {
      return r.json();
    })
    .then(function (c) {
      cfg = c;
      T = c.prompt[lang];
      render('ask');
    })
    .catch(function () {
      mount.innerHTML = '';
    });
})();
