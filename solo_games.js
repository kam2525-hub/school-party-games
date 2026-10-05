// solo_games.js - 暇つぶし特選・1人用・カモフラージュ・学校ネタゲーム実装

// ==============================================================================
// 1. 文房具スイカパズル (stationery_merge)
// ==============================================================================
let mergeCanvas, mergeCtx;
let mergeItems = [];
let mergeNextType = 0;
let mergeScore = 0;
let mergeIsRunning = false;
let mergeDropX = 0;
let mergeCanDrop = true;

const STATIONERY_TYPES = [
  { name: 'クリップ', icon: '📌', radius: 18, color: '#f87171', score: 2 },
  { name: 'えんぴつ', icon: '✏️', radius: 24, color: '#fb923c', score: 4 },
  { name: 'けしごむ', icon: '🧼', radius: 32, color: '#facc15', score: 8 },
  { name: '定規', icon: '📏', radius: 40, color: '#4ade80', score: 16 },
  { name: 'ハサミ', icon: '✂️', radius: 50, color: '#2dd4bf', score: 32 },
  { name: 'ボールペン', icon: '🖊️', radius: 60, color: '#38bdf8', score: 64 },
  { name: '三角定規', icon: '📐', radius: 72, color: '#818cf8', score: 128 },
  { name: 'ノート', icon: '📓', radius: 84, color: '#c084fc', score: 256 },
  { name: '教科書', icon: '📚', radius: 98, color: '#f472b6', score: 512 },
  { name: 'ランドセル', icon: '🎒', radius: 114, color: '#ef4444', score: 1024 },
  { name: 'トロフィー', icon: '🏆', radius: 130, color: '#eab308', score: 2048 }
];

function initStationeryMergeGame() {
  mergeCanvas = document.getElementById('merge-canvas');
  if (!mergeCanvas) return;
  mergeCtx = mergeCanvas.getContext('2d');
  
  mergeCanvas.width = mergeCanvas.parentElement.clientWidth || 360;
  mergeCanvas.height = mergeCanvas.parentElement.clientHeight || 560;

  mergeItems = [];
  mergeScore = 0;
  mergeNextType = Math.floor(Math.random() * 3);
  mergeIsRunning = true;
  mergeCanDrop = true;
  mergeDropX = mergeCanvas.width / 2;

  updateMergeNextPreview();
  const scoreEl = document.getElementById('merge-score');
  if (scoreEl) scoreEl.textContent = '0';

  // タッチ / マウスイベント
  mergeCanvas.onpointerdown = (e) => {
    const rect = mergeCanvas.getBoundingClientRect();
    mergeDropX = Math.max(30, Math.min(mergeCanvas.width - 30, (e.clientX - rect.left) * (mergeCanvas.width / rect.width)));
  };

  mergeCanvas.onpointermove = (e) => {
    const rect = mergeCanvas.getBoundingClientRect();
    mergeDropX = Math.max(30, Math.min(mergeCanvas.width - 30, (e.clientX - rect.left) * (mergeCanvas.width / rect.width)));
  };

  mergeCanvas.onpointerup = () => {
    if (!mergeCanDrop || !mergeIsRunning) return;
    dropStationeryItem();
  };

  requestAnimationFrame(mergeLoop);
}

function updateMergeNextPreview() {
  const iconEl = document.getElementById('merge-next-icon');
  if (iconEl) {
    iconEl.textContent = STATIONERY_TYPES[mergeNextType].icon;
  }
}

function dropStationeryItem() {
  mergeCanDrop = false;
  const itemType = STATIONERY_TYPES[mergeNextType];
  mergeItems.push({
    x: mergeDropX,
    y: 40,
    vx: (Math.random() - 0.5) * 0.5,
    vy: 1,
    typeIndex: mergeNextType,
    radius: itemType.radius
  });

  if (window.sounds) window.sounds.playTap();

  mergeNextType = Math.floor(Math.random() * 3);
  updateMergeNextPreview();

  setTimeout(() => {
    mergeCanDrop = true;
  }, 450);
}

function mergeLoop() {
  if (currentScreen !== 'screen-stationery_merge' || !mergeIsRunning) return;

  const w = mergeCanvas.width;
  const h = mergeCanvas.height;
  const ctx = mergeCtx;

  // 物理更新
  const gravity = 0.35;
  const bounce = 0.25;
  const friction = 0.98;

  for (let i = 0; i < mergeItems.length; i++) {
    const it = mergeItems[i];
    it.vy += gravity;
    it.vx *= friction;
    it.x += it.vx;
    it.y += it.vy;

    // 壁との衝突
    if (it.x - it.radius < 0) {
      it.x = it.radius;
      it.vx = -it.vx * bounce;
    } else if (it.x + it.radius > w) {
      it.x = w - it.radius;
      it.vx = -it.vx * bounce;
    }

    // 床との衝突
    if (it.y + it.radius > h) {
      it.y = h - it.radius;
      it.vy = -it.vy * bounce;
      if (Math.abs(it.vy) < 0.5) it.vy = 0;
    }
  }

  // アイテム同士の衝突 & マージ
  for (let i = 0; i < mergeItems.length; i++) {
    for (let j = i + 1; j < mergeItems.length; j++) {
      const a = mergeItems[i];
      const b = mergeItems[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = a.radius + b.radius;

      if (dist < minDist && dist > 0.001) {
        // 同じ種類ならマージ！
        if (a.typeIndex === b.typeIndex && a.typeIndex < STATIONERY_TYPES.length - 1) {
          const nextIdx = a.typeIndex + 1;
          const nextData = STATIONERY_TYPES[nextIdx];
          mergeScore += nextData.score;
          const scoreEl = document.getElementById('merge-score');
          if (scoreEl) scoreEl.textContent = mergeScore;

          if (window.sounds) window.sounds.playSuccess();

          // 合体位置
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;

          mergeItems.splice(j, 1);
          mergeItems.splice(i, 1);
          mergeItems.push({
            x: midX,
            y: midY,
            vx: 0,
            vy: -1.5,
            typeIndex: nextIdx,
            radius: nextData.radius
          });
          return requestAnimationFrame(mergeLoop);
        }

        // 通常反発
        const overlap = (minDist - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        const dvx = b.vx - a.vx;
        const dvy = b.vy - a.vy;
        const p = 2 * (nx * dvx + ny * dvy) / 2;
        a.vx += p * nx * 0.5;
        a.vy += p * ny * 0.5;
        b.vx -= p * nx * 0.5;
        b.vy -= p * ny * 0.5;
      }
    }
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 上部ゲームオーバー危険ライン
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 75);
  ctx.lineTo(w, 75);
  ctx.stroke();
  ctx.setLineDash([]);

  // ドロップガイドライン & 待機アイテム
  if (mergeCanDrop) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(mergeDropX, 40);
    ctx.lineTo(mergeDropX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    const curData = STATIONERY_TYPES[mergeNextType];
    ctx.fillStyle = curData.color;
    ctx.beginPath();
    ctx.arc(mergeDropX, 40, curData.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(curData.icon, mergeDropX, 40);
  }

  // アイテム描画
  let overflowCount = 0;
  for (const it of mergeItems) {
    const data = STATIONERY_TYPES[it.typeIndex];

    // 円の背景
    ctx.beginPath();
    ctx.arc(it.x, it.y, it.radius, 0, Math.PI * 2);
    ctx.fillStyle = data.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();

    // 絵文字
    ctx.font = `${Math.floor(it.radius * 1.05)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.icon, it.x, it.y);

    if (it.y - it.radius < 75 && Math.abs(it.vy) < 0.1) {
      overflowCount++;
    }
  }

  // ゲームオーバー判定
  if (overflowCount > 1 && mergeItems.length > 5) {
    mergeIsRunning = false;
    if (window.sounds) window.sounds.playExplosion();
    showModal('💥 ゲームオーバー！', `文房具が溢れました！\n最終スコア: ${mergeScore} 点`, () => {
      initStationeryMergeGame();
    });
    return;
  }

  requestAnimationFrame(mergeLoop);
}

// ==============================================================================
// 2. カモフラージュ・スプレッドシート (camo_sheet)
// ==============================================================================
let isBossMode = false;
let sheetSnake = [];
let sheetDir = { r: 0, c: 1 };
let sheetFood = { r: 5, c: 5 };
let sheetScore = 0;
let sheetTimer = null;
const SHEET_ROWS = 12;
const SHEET_COLS = 8;

function initCamoSheetGame() {
  isBossMode = false;
  sheetScore = 0;
  sheetDir = { r: 0, c: 1 };
  sheetSnake = [{ r: 4, c: 2 }, { r: 4, c: 1 }];
  spawnSheetFood();

  renderCamoSheet();

  if (sheetTimer) clearInterval(sheetTimer);
  sheetTimer = setInterval(sheetGameStep, 220);

  // キーボードイベント
  window.onkeydown = (e) => {
    if (currentScreen !== 'screen-camo_sheet') return;
    if (e.key === 'Escape') {
      toggleBossKey();
      return;
    }
    if (isBossMode) return;
    if (e.key === 'ArrowUp' && sheetDir.r !== 1) sheetDir = { r: -1, c: 0 };
    else if (e.key === 'ArrowDown' && sheetDir.r !== -1) sheetDir = { r: 1, c: 0 };
    else if (e.key === 'ArrowLeft' && sheetDir.c !== 1) sheetDir = { r: 0, c: -1 };
    else if (e.key === 'ArrowRight' && sheetDir.c !== -1) sheetDir = { r: 0, c: 1 };
  };
}

function spawnSheetFood() {
  sheetFood = {
    r: Math.floor(Math.random() * (SHEET_ROWS - 2)) + 1,
    c: Math.floor(Math.random() * (SHEET_COLS - 2)) + 1
  };
}

function sheetGameStep() {
  if (currentScreen !== 'screen-camo_sheet' || isBossMode) return;

  const head = { r: sheetSnake[0].r + sheetDir.r, c: sheetSnake[0].c + sheetDir.c };

  // 壁判定（ループ）
  if (head.r < 0) head.r = SHEET_ROWS - 1;
  if (head.r >= SHEET_ROWS) head.r = 0;
  if (head.c < 0) head.c = SHEET_COLS - 1;
  if (head.c >= SHEET_COLS) head.c = 0;

  // 自己衝突
  if (sheetSnake.some(seg => seg.r === head.r && seg.c === head.c)) {
    if (window.sounds) window.sounds.playExplosion();
    clearInterval(sheetTimer);
    showModal('📋 計算エラー！(#REF!)', `セルオーバーフロー！\n集計結果スコア: ${sheetScore}`, () => {
      initCamoSheetGame();
    });
    return;
  }

  sheetSnake.unshift(head);

  if (head.r === sheetFood.r && head.c === sheetFood.c) {
    sheetScore += 10;
    if (window.sounds) window.sounds.playTap();
    spawnSheetFood();
  } else {
    sheetSnake.pop();
  }

  renderCamoSheet();
}

function setSheetDir(r, c) {
  if (isBossMode) return;
  if (sheetDir.r + r !== 0 || sheetDir.c + c !== 0) {
    sheetDir = { r, c };
  }
}

function toggleBossKey() {
  isBossMode = !isBossMode;
  const btn = document.getElementById('btn-boss-mode');
  if (btn) btn.textContent = isBossMode ? '戻る 🔄' : '🚨 先生が来た！';
  renderCamoSheet();
}

function renderCamoSheet() {
  const container = document.getElementById('sheet-grid-wrap');
  if (!container) return;

  if (isBossMode) {
    // 完全に真面目な定期テスト成績表
    container.innerHTML = `
      <table class="sheet-table">
        <thead>
          <tr>
            <th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th>
          </tr>
        </thead>
        <tbody>
          <tr><th>1</th><td colspan="6" style="background:#e8f0fe;font-weight:bold;text-align:left;padding-left:12px;">令和8年度 第2学期 実力判定考査 成績集計表</td></tr>
          <tr><th>2</th><td>学籍番号</td><td>氏名</td><td>国語</td><td>数学</td><td>英語</td><td>総合偏差値</td></tr>
          <tr><th>3</th><td>1001</td><td>青山 健</td><td>88</td><td>94</td><td>91</td><td>68.4</td></tr>
          <tr><th>4</th><td>1002</td><td>井上 咲</td><td>76</td><td>82</td><td>85</td><td>61.2</td></tr>
          <tr><th>5</th><td>1003</td><td>佐藤 蓮</td><td>92</td><td>70</td><td>78</td><td>59.8</td></tr>
          <tr><th>6</th><td>1004</td><td>高橋 葵</td><td>85</td><td>88</td><td>92</td><td>65.0</td></tr>
          <tr><th>7</th><td>1005</td><td>田中 陽</td><td>64</td><td>95</td><td>80</td><td>62.1</td></tr>
          <tr><th>8</th><td><strong>平均</strong></td><td>-</td><td>81.0</td><td>85.8</td><td>85.2</td><td>63.3</td></tr>
          <tr><th>9</th><td><strong>標準偏差</strong></td><td>-</td><td>9.4</td><td>9.1</td><td>5.6</td><td>3.1</td></tr>
          <tr><th>10</th><td colspan="6" style="color:#64748b;font-style:italic;">※次回考査は11月14日(金)を予定。課題提出締切厳守。</td></tr>
        </tbody>
      </table>
    `;
    return;
  }

  // 通常ゲームモード
  let html = '<table class="sheet-table"><thead><tr><th></th>';
  for (let c = 0; c < SHEET_COLS; c++) {
    html += `<th>${String.fromCharCode(65 + c)}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (let r = 0; r < SHEET_ROWS; r++) {
    html += `<tr><th>${r + 1}</th>`;
    for (let c = 0; c < SHEET_COLS; c++) {
      const isHead = sheetSnake.length > 0 && sheetSnake[0].r === r && sheetSnake[0].c === c;
      const isBody = sheetSnake.slice(1).some(seg => seg.r === r && seg.c === c);
      const isFood = sheetFood.r === r && sheetFood.c === c;

      if (isHead) {
        html += `<td class="sheet-cell-player" style="background:#2563eb;color:white;">=NOW()</td>`;
      } else if (isBody) {
        html += `<td class="sheet-cell-player" style="background:#60a5fa;color:white;">●</td>`;
      } else if (isFood) {
        html += `<td class="sheet-cell-target">=SUM</td>`;
      } else {
        html += `<td>${((r * 7 + c * 13) % 99)}</td>`;
      }
    }
    html += '</tr>';
  }
  html += '</tbody></table>';

  container.innerHTML = html;

  const formulaInput = document.getElementById('sheet-formula-input');
  if (formulaInput) {
    formulaInput.value = `=SUM(A1:H12) * ${sheetScore}`;
  }
}

// ==============================================================================
// 3. 放課後 Wordle (wordle_jp)
// ==============================================================================
const WORDLE_WORDS = [
  'がっこう', 'きょうし', 'こくばん', 'やすみじ', 'ほうかご',
  'えんぴつ', 'としょか', 'たいそう', 'ともだち', 'べんきょ',
  'きゅうし', 'しゅくだ', 'てすとお', 'じゅぎょ', 'せんせい',
  'けしごむ', 'ろっかあ', 'たいいく', 'すいそう', 'おべんとう',
  'しゃあぷ', 'じょうぎ', 'こんぱす', 'ふでばこ', 'せいふく',
  'こうてい', 'つうがく', 'ぶかつど', 'ぷうるう', 'おんがく'
];

let wordleTarget = '';
let wordleGuesses = [];
let wordleCurrentGuess = '';
const WORDLE_MAX_GUESSES = 6;

function initWordleJpGame() {
  wordleTarget = WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
  wordleGuesses = [];
  wordleCurrentGuess = '';

  renderWordleBoard();
  renderWordleKeyboard();
}

function wordleInputChar(char) {
  if (wordleGuesses.length >= WORDLE_MAX_GUESSES) return;
  if (wordleCurrentGuess.length < 5) {
    wordleCurrentGuess += char;
    if (window.sounds) window.sounds.playTap();
    renderWordleBoard();
  }
}

function wordleDeleteChar() {
  if (wordleCurrentGuess.length > 0) {
    wordleCurrentGuess = wordleCurrentGuess.slice(0, -1);
    if (window.sounds) window.sounds.playTap();
    renderWordleBoard();
  }
}

function wordleSubmitGuess() {
  if (wordleCurrentGuess.length !== 5) {
    alert('5文字入力してください！');
    return;
  }

  wordleGuesses.push(wordleCurrentGuess);
  const guess = wordleCurrentGuess;
  wordleCurrentGuess = '';

  if (window.sounds) {
    if (guess === wordleTarget) {
      window.sounds.playSuccess();
    } else {
      window.sounds.playTap();
    }
  }

  renderWordleBoard();
  renderWordleKeyboard();

  if (guess === wordleTarget) {
    setTimeout(() => {
      showModal('🎉 完全正解！！', `見事「${wordleTarget}」を当てました！\n挑戦回数: ${wordleGuesses.length} / 6`, () => {
        initWordleJpGame();
      });
    }, 600);
  } else if (wordleGuesses.length >= WORDLE_MAX_GUESSES) {
    setTimeout(() => {
      showModal('😢 残念！', `正解は「${wordleTarget}」でした！`, () => {
        initWordleJpGame();
      });
    }, 600);
  }
}

function renderWordleBoard() {
  const board = document.getElementById('wordle-board');
  if (!board) return;

  let html = '';
  for (let r = 0; r < WORDLE_MAX_GUESSES; r++) {
    html += '<div class="wordle-row">';
    const guess = wordleGuesses[r] || (r === wordleGuesses.length ? wordleCurrentGuess : '');

    for (let c = 0; c < 5; c++) {
      const char = guess[c] || '';
      let statusClass = '';

      if (r < wordleGuesses.length) {
        if (wordleTarget[c] === char) {
          statusClass = 'correct';
        } else if (wordleTarget.includes(char)) {
          statusClass = 'present';
        } else {
          statusClass = 'absent';
        }
      }

      html += `<div class="wordle-tile ${statusClass}">${char}</div>`;
    }
    html += '</div>';
  }
  board.innerHTML = html;
}

function renderWordleKeyboard() {
  const kb = document.getElementById('wordle-keyboard');
  if (!kb) return;

  const rows = [
    ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り'],
    ['る', 'れ', 'ろ', 'わ', 'を', 'ん', 'っ', 'ゃ', 'ゅ', 'ょ']
  ];

  let html = '';
  for (const row of rows) {
    html += '<div class="wordle-kb-row">';
    for (const char of row) {
      let state = '';
      for (const g of wordleGuesses) {
        for (let i = 0; i < 5; i++) {
          if (g[i] === char) {
            if (wordleTarget[i] === char) state = 'correct';
            else if (wordleTarget.includes(char) && state !== 'correct') state = 'present';
            else if (!state) state = 'absent';
          }
        }
      }
      html += `<div class="wordle-key ${state}" onclick="wordleInputChar('${char}')">${char}</div>`;
    }
    html += '</div>';
  }

  // 確定 & 削除ボタン
  html += `
    <div class="wordle-kb-row" style="margin-top:6px;">
      <div class="wordle-key wide" onclick="wordleSubmitGuess()">決定</div>
      <div class="wordle-key wide" onclick="wordleDeleteChar()">⌫ 消す</div>
    </div>
  `;

  kb.innerHTML = html;
}

// ==============================================================================
// 4. 授業中タイピング・マスター (school_typing)
// ==============================================================================
const TYPING_SENTENCES = [
  { kanji: '起立、礼、着席。', romaji: 'kiritu,rei,tyakuseki.' },
  { kanji: '消しゴムの角を使う贅沢。', romaji: 'kesigomunokadowotukauzeitaku.' },
  { kanji: '今日の給食は揚げパンだ！', romaji: 'kyounokyuusyokuhaagepanda!' },
  { kanji: '席替えで窓際の一番後ろを狙う。', romaji: 'sekigaedemadogiwanoitibanusillowonerau.' },
  { kanji: 'チャイムと同時に校門へダッシュ！', romaji: 'tyaimutodouziniyoumonhedassyu!' },
  { kanji: '教科書を忘れて隣の人に見せてもらう。', romaji: 'kyoukasyowowasuretetonarironitoninisetemorau.' }
];

let typingIndex = 0;
let typingCharIndex = 0;
let typingScore = 0;
let typingStartTime = 0;

function initSchoolTypingGame() {
  typingIndex = 0;
  typingCharIndex = 0;
  typingScore = 0;
  typingStartTime = Date.now();

  renderSchoolTyping();

  window.onkeydown = (e) => {
    if (currentScreen !== 'screen-school_typing') return;
    const current = TYPING_SENTENCES[typingIndex];
    if (!current) return;

    const targetChar = current.romaji[typingCharIndex];
    if (e.key.toLowerCase() === targetChar.toLowerCase()) {
      typingCharIndex++;
      typingScore += 10;
      if (window.sounds) window.sounds.playTap();

      if (typingCharIndex >= current.romaji.length) {
        typingIndex++;
        typingCharIndex = 0;
        if (window.sounds) window.sounds.playSuccess();

        if (typingIndex >= TYPING_SENTENCES.length) {
          const elapsed = (Date.now() - typingStartTime) / 1000;
          const wpm = Math.round((typingScore / elapsed) * 60);
          showModal('🏆 タイピング合格！', `全問クリア！\n所要時間: ${elapsed.toFixed(1)}秒\nWPM: ${wpm}`, () => {
            initSchoolTypingGame();
          });
          return;
        }
      }
      renderSchoolTyping();
    }
  };
}

function handleTypingVirtualTap(char) {
  const current = TYPING_SENTENCES[typingIndex];
  if (!current) return;
  const targetChar = current.romaji[typingCharIndex];
  if (char.toLowerCase() === targetChar.toLowerCase()) {
    typingCharIndex++;
    typingScore += 10;
    if (window.sounds) window.sounds.playTap();

    if (typingCharIndex >= current.romaji.length) {
      typingIndex++;
      typingCharIndex = 0;
      if (window.sounds) window.sounds.playSuccess();

      if (typingIndex >= TYPING_SENTENCES.length) {
        const elapsed = (Date.now() - typingStartTime) / 1000;
        showModal('🏆 タイピング合格！', `全問クリア！\n時間: ${elapsed.toFixed(1)}秒`, () => {
          initSchoolTypingGame();
        });
        return;
      }
    }
    renderSchoolTyping();
  }
}

function renderSchoolTyping() {
  const kanjiEl = document.getElementById('typing-kanji');
  const typedEl = document.getElementById('typing-typed');
  const remainEl = document.getElementById('typing-remain');
  const scoreEl = document.getElementById('typing-score');

  const current = TYPING_SENTENCES[typingIndex];
  if (!current) return;

  if (kanjiEl) kanjiEl.textContent = current.kanji;
  if (typedEl) typedEl.textContent = current.romaji.slice(0, typingCharIndex);
  if (remainEl) remainEl.textContent = current.romaji.slice(typingCharIndex);
  if (scoreEl) scoreEl.textContent = typingScore;

  // モバイル用候補キーボタン
  const vkeys = document.getElementById('typing-vkeys');
  if (vkeys) {
    const nextChar = current.romaji[typingCharIndex] || '';
    const randomChars = ['a', 'i', 'u', 'e', 'o', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', '.', ','];
    const choices = Array.from(new Set([nextChar, ...randomChars.sort(() => 0.5 - Math.random()).slice(0, 5)])).sort();
    
    vkeys.innerHTML = choices.map(c => 
      `<button class="btn-primary" style="padding:10px 18px;font-size:16px;" onclick="handleTypingVirtualTap('${c}')">${c}</button>`
    ).join(' ');
  }
}

// ==============================================================================
// 5. 黒板消し＆落書きクリッカー (board_clicker)
// ==============================================================================
let clickerChalkDust = 0;
let clickerPerClick = 1;
let clickerPerSec = 0;
let clickerTimer = null;

const CLICKER_UPGRADES = [
  { id: 'sponge', name: '新品の黒板消し', cost: 15, power: 1, type: 'click' },
  { id: 'cleaner', name: '自動クリーナー', cost: 50, power: 2, type: 'sec' },
  { id: 'helper', name: '日直の友達', cost: 200, power: 10, type: 'sec' },
  { id: 'super_wipe', name: '激落ちモップ', cost: 800, power: 25, type: 'click' },
  { id: 'sensei', name: '教頭先生の一喝', cost: 3000, power: 100, type: 'sec' }
];

function initBoardClickerGame() {
  clickerChalkDust = 0;
  clickerPerClick = 1;
  clickerPerSec = 0;

  renderBoardClicker();

  if (clickerTimer) clearInterval(clickerTimer);
  clickerTimer = setInterval(() => {
    if (currentScreen !== 'screen-board_clicker') return;
    clickerChalkDust += clickerPerSec;
    renderBoardClicker();
  }, 1000);
}

function handleBoardClick(e) {
  clickerChalkDust += clickerPerClick;
  if (window.sounds) window.sounds.playTap();

  // クリックエフェクト（チョークの粉パーティクル）
  const board = document.getElementById('clicker-chalkboard');
  if (board && e) {
    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const particle = document.createElement('div');
    particle.textContent = `+${clickerPerClick} 💨`;
    particle.style.position = 'absolute';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.color = '#fef08a';
    particle.style.fontWeight = 'bold';
    particle.style.pointerEvents = 'none';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.animation = 'float-up 0.6s ease-out forwards';
    board.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
  }

  renderBoardClicker();
}

function buyClickerUpgrade(index) {
  const up = CLICKER_UPGRADES[index];
  if (clickerChalkDust >= up.cost) {
    clickerChalkDust -= up.cost;
    if (up.type === 'click') clickerPerClick += up.power;
    else clickerPerSec += up.power;

    up.cost = Math.floor(up.cost * 1.5);
    if (window.sounds) window.sounds.playSuccess();
    renderBoardClicker();
  }
}

function renderBoardClicker() {
  const dustEl = document.getElementById('clicker-dust');
  const perSecEl = document.getElementById('clicker-per-sec');
  const upgradesEl = document.getElementById('clicker-upgrades');

  if (dustEl) dustEl.textContent = clickerChalkDust;
  if (perSecEl) perSecEl.textContent = clickerPerSec;

  if (upgradesEl) {
    upgradesEl.innerHTML = CLICKER_UPGRADES.map((up, idx) => `
      <div class="upgrade-card" onclick="buyClickerUpgrade(${idx})" style="opacity: ${clickerChalkDust >= up.cost ? '1' : '0.5'};">
        <div class="upgrade-name">${up.name}</div>
        <div class="upgrade-cost">粉: ${up.cost} (${up.type === 'click' ? `+${up.power}/クリック` : `+${up.power}/秒`})</div>
      </div>
    `).join('');
  }
}

// ==============================================================================
// 6. 10秒ピッタリ ＆ 反射神経テスト (time_reflex)
// ==============================================================================
let stopwatchStartTime = 0;
let stopwatchTimer = null;
let stopwatchIsRunning = false;

let soloReflexState = 'idle'; // idle, waiting, ready, done
let soloReflexWaitTimer = null;
let soloReflexReadyTime = 0;

function initTimeReflexGame() {
  switchTimeReflexTab('stopwatch');
}

function switchTimeReflexTab(tab) {
  document.getElementById('tr-panel-stopwatch').style.display = tab === 'stopwatch' ? 'block' : 'none';
  document.getElementById('tr-panel-reflex').style.display = tab === 'reflex' ? 'block' : 'none';
  
  document.getElementById('tr-tab-stopwatch').classList.toggle('active', tab === 'stopwatch');
  document.getElementById('tr-tab-reflex').classList.toggle('active', tab === 'reflex');

  resetStopwatch();
  resetReflexTest();
}

function handleStopwatchToggle() {
  const timeDisplay = document.getElementById('stopwatch-display');
  const btn = document.getElementById('btn-stopwatch-toggle');
  const resultEl = document.getElementById('stopwatch-result');

  if (!stopwatchIsRunning) {
    // スタート
    stopwatchIsRunning = true;
    stopwatchStartTime = Date.now();
    resultEl.textContent = '';
    btn.textContent = '⏹️ 今だ！ストップ！';
    btn.className = 'btn-danger';
    if (window.sounds) window.sounds.playTap();

    stopwatchTimer = setInterval(() => {
      const elapsed = (Date.now() - stopwatchStartTime) / 1000;
      if (elapsed >= 3.0) {
        timeDisplay.textContent = '?.??? 秒';
      } else {
        timeDisplay.textContent = elapsed.toFixed(3) + ' 秒';
      }
    }, 30);
  } else {
    // ストップ
    stopwatchIsRunning = false;
    clearInterval(stopwatchTimer);
    const finalTime = (Date.now() - stopwatchStartTime) / 1000;
    timeDisplay.textContent = finalTime.toFixed(3) + ' 秒';
    btn.textContent = '▶️ もう一度挑戦';
    btn.className = 'btn-primary';

    const diff = Math.abs(10.0 - finalTime);
    let rank = '';
    if (diff <= 0.05) {
      rank = '👑 神の体内時計！！(±0.05秒以内)';
      if (window.sounds) window.sounds.playSuccess();
    } else if (diff <= 0.2) {
      rank = '✨ プロ級の体内時計！';
      if (window.sounds) window.sounds.playSuccess();
    } else if (diff <= 0.6) {
      rank = '👍 なかなか優秀！';
      if (window.sounds) window.sounds.playTap();
    } else {
      rank = '😅 ズレすぎかも！？';
      if (window.sounds) window.sounds.playTap();
    }

    resultEl.innerHTML = `<div style="font-size:18px;font-weight:bold;margin-top:12px;color:#38bdf8;">誤差: ${diff.toFixed(3)}秒</div><div>${rank}</div>`;
  }
}

function resetStopwatch() {
  stopwatchIsRunning = false;
  if (stopwatchTimer) clearInterval(stopwatchTimer);
  document.getElementById('stopwatch-display').textContent = '0.000 秒';
  document.getElementById('btn-stopwatch-toggle').textContent = '▶️ 10秒ピッタリ スタート';
  document.getElementById('btn-stopwatch-toggle').className = 'btn-primary';
  document.getElementById('stopwatch-result').textContent = '';
}

function resetReflexTest() {
  soloReflexState = 'idle';
  if (soloReflexWaitTimer) clearTimeout(soloReflexWaitTimer);
  const box = document.getElementById('reflex-test-box');
  if (!box) return;
  box.className = 'reflex-test-box reflex-blue';
  box.innerHTML = 'タップして開始<br><span style="font-size:14px;font-weight:normal;">緑になったら即タップ！</span>';
}

function handleReflexBoxTap() {
  const box = document.getElementById('reflex-test-box');
  if (!box) return;

  if (soloReflexState === 'idle') {
    soloReflexState = 'waiting';
    box.className = 'reflex-test-box reflex-red';
    box.innerHTML = 'まだ待て！赤です...';
    if (window.sounds) window.sounds.playTap();

    const delay = Math.random() * 2500 + 1500;
    soloReflexWaitTimer = setTimeout(() => {
      soloReflexState = 'ready';
      soloReflexReadyTime = Date.now();
      box.className = 'reflex-test-box reflex-green';
      box.innerHTML = '💥 今だ！TAP！！';
      if (window.sounds) window.sounds.playTap();
    }, delay);
  } else if (soloReflexState === 'waiting') {
    // フライング！
    clearTimeout(soloReflexWaitTimer);
    soloReflexState = 'done';
    box.className = 'reflex-test-box reflex-blue';
    box.innerHTML = '⚠️ フライング！早すぎ！<br><span style="font-size:14px;">タップして再挑戦</span>';
    if (window.sounds) window.sounds.playExplosion();
  } else if (soloReflexState === 'ready') {
    // 成功！
    const ms = Date.now() - soloReflexReadyTime;
    soloReflexState = 'done';
    box.className = 'reflex-test-box reflex-blue';

    let rank = '';
    if (ms < 200) rank = '⚡ 神速ゲーマー級！';
    else if (ms < 260) rank = '🔥 優秀な瞬発力！';
    else if (ms < 350) rank = '🙂 平均的！';
    else rank = '😴 眠気マックス！？';

    box.innerHTML = `${ms} ms<br><span style="font-size:16px;">${rank}</span><br><span style="font-size:12px;opacity:0.8;">タップして再挑戦</span>`;
    if (window.sounds) window.sounds.playSuccess();
  } else if (soloReflexState === 'done') {
    resetReflexTest();
  }
}

// ==============================================================================
// 7. 究極の2択 ＆ ネタガチャ (ultimate_choice)
// ==============================================================================
const ULTIMATE_QUESTIONS = [
  { q: '一生食べるならどっち？', a: '給食の揚げパン', b: '給食のカレーライス', ratioA: 54 },
  { q: '手に入るならどっち？', a: 'テスト全問ヤマが当たる', b: '一生宿題が完全免除', ratioA: 62 },
  { q: '席替えで選べるならどっち？', a: '好きな人の真隣の席', b: '窓際一番後ろの主人公席', ratioA: 48 },
  { q: '体育でやるならどっち？', a: '一生ガチドッジボール', b: '一生サッカー', ratioA: 58 },
  { q: '休み時間に起きるならどっち？', a: '次の授業が急遽自習になる', b: '早退して帰れる', ratioA: 71 },
  { q: '担任になるならどっち？', a: '怒ると怖いけど超熱心な先生', b: 'ゆるくて放置気味な先生', ratioA: 39 },
  { q: 'どっちの能力がほしい？', a: '1回見た教科書を丸暗記できる', b: 'いつでも5分間時を止められる', ratioA: 65 },
  { q: '朝の通学路、どっちが嫌？', a: '土砂降りの雨で靴が浸水', b: '教科書全部忘れたことに気付く', ratioA: 53 },
  { q: '学校の自販機に入るならどっち？', a: '全品100円の冷たい炭酸飲料', b: 'アイスの自動販売機', ratioA: 78 }
];

let choiceIndex = 0;
let choiceAnswered = false;

function initUltimateChoiceGame() {
  choiceIndex = Math.floor(Math.random() * ULTIMATE_QUESTIONS.length);
  choiceAnswered = false;
  renderUltimateChoice();
}

function handleChooseOption(opt) {
  if (choiceAnswered) return;
  choiceAnswered = true;
  if (window.sounds) window.sounds.playTap();

  const item = ULTIMATE_QUESTIONS[choiceIndex];
  const barA = document.getElementById('choice-bar-a');
  const barB = document.getElementById('choice-bar-b');
  const labelA = document.getElementById('choice-pct-a');
  const labelB = document.getElementById('choice-pct-b');

  if (barA) barA.style.width = `${item.ratioA}%`;
  if (barB) barB.style.width = `${100 - item.ratioA}%`;

  if (labelA) labelA.textContent = `${item.ratioA}% の人が選択！`;
  if (labelB) labelB.textContent = `${100 - item.ratioA}% の人が選択！`;

  const nextBtn = document.getElementById('btn-choice-next');
  if (nextBtn) nextBtn.style.display = 'inline-block';
}

function nextUltimateChoice() {
  choiceIndex = (choiceIndex + 1) % ULTIMATE_QUESTIONS.length;
  choiceAnswered = false;
  renderUltimateChoice();
}

function renderUltimateChoice() {
  const item = ULTIMATE_QUESTIONS[choiceIndex];
  const qEl = document.getElementById('choice-question');
  const btnA = document.getElementById('choice-text-a');
  const btnB = document.getElementById('choice-text-b');
  const barA = document.getElementById('choice-bar-a');
  const barB = document.getElementById('choice-bar-b');
  const labelA = document.getElementById('choice-pct-a');
  const labelB = document.getElementById('choice-pct-b');
  const nextBtn = document.getElementById('btn-choice-next');

  if (qEl) qEl.textContent = `Q. ${item.q}`;
  if (btnA) btnA.textContent = `🅰️ ${item.a}`;
  if (btnB) btnB.textContent = `🅱️ ${item.b}`;

  if (barA) barA.style.width = '0%';
  if (barB) barB.style.width = '0%';
  if (labelA) labelA.textContent = '';
  if (labelB) labelB.textContent = '';

  if (nextBtn) nextBtn.style.display = 'none';
}

// ==============================================================================
// 8. 席替えシミュレーター (seat_shuffle)
// ==============================================================================
const DEFAULT_STUDENTS = [
  '自分', '親友', '推し', 'メガネ君', 'ギャル', 'サッカー部',
  '委員長', '寝てる人', '天才肌', 'お調子者', '図書委員', '生徒会長',
  '帰宅部エース', 'バンドマン', 'ゲーム達人', '先生の真ん前', '理科オタク', '留学生',
  '絵師', 'スポーツ万能', 'いつも遅刻', '給食おかわり王', 'クール女子', '癒やし系',
  'クラスのムードメーカー', 'お嬢様', '天然キャラ', '読書家', '怪力男', '未来の社長'
];

let seatShuffleTimer = null;

function initSeatShuffleGame() {
  renderSeatGrid(DEFAULT_STUDENTS);
}

function startSeatShuffle() {
  const btn = document.getElementById('btn-seat-shuffle');
  if (btn) btn.disabled = true;

  let count = 0;
  if (seatShuffleTimer) clearInterval(seatShuffleTimer);

  seatShuffleTimer = setInterval(() => {
    count++;
    const shuffled = [...DEFAULT_STUDENTS].sort(() => 0.5 - Math.random());
    renderSeatGrid(shuffled);
    if (window.sounds) window.sounds.playTap();

    if (count > 15) {
      clearInterval(seatShuffleTimer);
      if (btn) btn.disabled = false;
      if (window.sounds) window.sounds.playSuccess();
    }
  }, 100);
}

function renderSeatGrid(students) {
  const grid = document.getElementById('seat-grid');
  if (!grid) return;

  grid.innerHTML = students.map((name, idx) => {
    let extraClass = '';
    let badge = '';

    // 窓際一番後ろ（5行目、0列目または5列目など）
    if (idx === 24) {
      extraClass = 'hero-seat';
      badge = '<div style="font-size:9px;color:#fef08a;">✨主人公席</div>';
    } else if (idx === 2 || idx === 3) {
      extraClass = 'teacher-front';
      badge = '<div style="font-size:9px;color:#fca5a5;">👀教卓正面</div>';
    }

    return `
      <div class="seat-desk ${extraClass}">
        <div>${name}</div>
        ${badge}
      </div>
    `;
  }).join('');
}

// ==============================================================================
// 9. うろ覚えお絵かきジャッジ (drawing_quiz)
// ==============================================================================
const DRAWING_PROMPTS = [
  'ピカチュウ', '自由の女神', 'ドラえもん', '非常口の逃げてる人',
  '学校の校章', '救急車', 'モナ・リザ', 'ライオン', 'カンガルー',
  'ペンギン', 'トトロ', '東京タワー', 'パンダ', 'サッカーボール'
];

let drawCanvas, drawCtx;
let drawIsPainting = false;
let drawColor = '#000000';
let drawLineWidth = 4;
let drawTimer = null;
let drawTimeLeft = 30;

function initDrawingQuizGame() {
  drawCanvas = document.getElementById('draw-canvas');
  if (!drawCanvas) return;
  drawCtx = drawCanvas.getContext('2d');

  drawCanvas.width = drawCanvas.parentElement.clientWidth || 340;
  drawCanvas.height = drawCanvas.parentElement.clientHeight || 380;

  clearDrawCanvas();
  pickNewDrawPrompt();

  // ドローイングイベント
  drawCanvas.onpointerdown = (e) => {
    drawIsPainting = true;
    const rect = drawCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (drawCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (drawCanvas.height / rect.height);
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
    if (window.sounds) window.sounds.playTap();
  };

  drawCanvas.onpointermove = (e) => {
    if (!drawIsPainting) return;
    const rect = drawCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (drawCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (drawCanvas.height / rect.height);
    drawCtx.lineTo(x, y);
    drawCtx.strokeStyle = drawColor;
    drawCtx.lineWidth = drawLineWidth;
    drawCtx.lineCap = 'round';
    drawCtx.stroke();
  };

  window.onpointerup = () => {
    drawIsPainting = false;
  };
}

function pickNewDrawPrompt() {
  const promptEl = document.getElementById('draw-prompt-text');
  const randomPrompt = DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)];
  if (promptEl) promptEl.textContent = `お題: 「${randomPrompt}」`;

  drawTimeLeft = 30;
  const timerEl = document.getElementById('draw-timer');
  if (timerEl) timerEl.textContent = `${drawTimeLeft}s`;

  if (drawTimer) clearInterval(drawTimer);
  drawTimer = setInterval(() => {
    if (currentScreen !== 'screen-drawing_quiz') return;
    drawTimeLeft--;
    if (timerEl) timerEl.textContent = `${drawTimeLeft}s`;

    if (drawTimeLeft <= 0) {
      clearInterval(drawTimer);
      if (window.sounds) window.sounds.playSuccess();
      showModal('⏱️ タイムアップ！', '絵が完成しました！\n隣の友達に見せて採点してもらおう！', () => {
        clearDrawCanvas();
        pickNewDrawPrompt();
      });
    }
  }, 1000);
}

function clearDrawCanvas() {
  if (!drawCtx || !drawCanvas) return;
  drawCtx.fillStyle = '#ffffff';
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
}

function setDrawColor(color, el) {
  drawColor = color;
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  if (el) el.classList.add('active');
}

// ==============================================================================
// 10. 「数字で例えろ！」(talk_ito) - ito風・価値観協力ゲーム
// ==============================================================================
const ITO_THEMES = [
  '最強の給食メニュー（1=まずい 〜 100=神メニュー）',
  'カッコいい苗字（1=平凡 〜 100=アニメの主人公並み）',
  '学校でされて嬉しいこと（1=微妙 〜 100=一生の思い出）',
  '無人島に持っていきたいもの（1=ゴミ 〜 100=最強の脱出具）',
  '怖いもの（1=そよ風 〜 100=トラウマ級の恐怖）',
  'テンションが上がる瞬間（1=真顔 〜 100=叫んで飛び跳ねる）',
  '持ってたらモテそうな特技（1=鼻毛抜き 〜 100=世界レベルのピアノ）',
  '学校の嫌なシチュエーション（1=消しゴム落とす 〜 100=全校朝礼で盛大に転ぶ）'
];

let itoPlayerCount = 4;
let itoCurrentPlayer = 0;
let itoNumbers = [];
let itoTheme = '';
let itoStep = 'setup'; // setup, pass, talk, answer

function initTalkItoGame() {
  itoStep = 'setup';
  itoPlayerCount = 4;
  renderTalkIto();
}

function startItoGame(players) {
  itoPlayerCount = players;
  itoTheme = ITO_THEMES[Math.floor(Math.random() * ITO_THEMES.length)];
  itoNumbers = [];
  while (itoNumbers.length < itoPlayerCount) {
    const r = Math.floor(Math.random() * 100) + 1;
    if (!itoNumbers.includes(r)) itoNumbers.push(r);
  }
  itoCurrentPlayer = 0;
  itoStep = 'pass';
  renderTalkIto();
  if (window.sounds) window.sounds.playTap();
}

function handleItoReveal(reveal) {
  const card = document.getElementById('ito-secret-card');
  if (!card) return;
  if (reveal) {
    card.classList.add('revealed');
    card.innerHTML = `
      <div style="font-size:12px;opacity:0.8;">あなたの秘密の数字</div>
      <div class="talk-number-huge">${itoNumbers[itoCurrentPlayer]}</div>
      <div style="font-size:12px;opacity:0.8;">指を離すと隠れます</div>
    `;
    if (window.sounds) window.sounds.playTap();
  } else {
    card.classList.remove('revealed');
    card.innerHTML = `
      <div style="font-size:36px;margin-bottom:8px;">🔒</div>
      <div style="font-weight:bold;">長押しして数字を見る</div>
      <div style="font-size:12px;color:#94a3b8;">他の人に見られないように！</div>
    `;
  }
}

function nextItoPlayer() {
  itoCurrentPlayer++;
  if (itoCurrentPlayer >= itoPlayerCount) {
    itoStep = 'talk';
  }
  renderTalkIto();
  if (window.sounds) window.sounds.playTap();
}

function finishItoAnswer() {
  // 並び替え確認
  const sorted = [...itoNumbers].sort((a, b) => a - b);
  const correct = sorted.every((val, i) => val === itoNumbers[i]);

  if (window.sounds) {
    if (correct) window.sounds.playSuccess();
    else window.sounds.playExplosion();
  }

  showModal(
    correct ? '🎉 完全一致！大成功！' : '💥 惜しい！数字オープン！',
    `数字の結果:\n${itoNumbers.map((n, i) => `P${i+1}: 【${n}】`).join(' ➔ ')}\n\n${correct ? '全員の価値観が奇跡のシンクロ！' : '価値観のズレを楽しもう！'}`,
    () => initTalkItoGame()
  );
}

function renderTalkIto() {
  const container = document.getElementById('screen-talk_ito');
  if (!container) return;

  if (itoStep === 'setup') {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header"><div class="solo-title">🔢 数字で例えろ！ (ito風)</div></div>
        <div class="talk-card-container">
          <div class="talk-prompt-box">
            <span class="talk-badge-tag">参加人数を選んでね</span>
            <div class="talk-main-theme">何人で遊びますか？</div>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px;">
              <button class="btn-primary" style="padding:12px 20px;" onclick="startItoGame(2)">2人</button>
              <button class="btn-primary" style="padding:12px 20px;" onclick="startItoGame(3)">3人</button>
              <button class="btn-primary" style="padding:12px 20px;" onclick="startItoGame(4)">4人</button>
              <button class="btn-primary" style="padding:12px 20px;" onclick="startItoGame(5)">5人</button>
              <button class="btn-primary" style="padding:12px 20px;" onclick="startItoGame(6)">6人</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (itoStep === 'pass') {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header">
          <div class="solo-title">🔢 プレイヤー ${itoCurrentPlayer + 1} の番</div>
        </div>
        <div class="talk-card-container">
          <div class="talk-prompt-box">
            <span class="talk-badge-tag">本日のお題</span>
            <div class="talk-main-theme">${itoTheme}</div>
          </div>
          <div id="ito-secret-card" class="talk-secret-card"
               onpointerdown="handleItoReveal(true)" onpointerup="handleItoReveal(false)">
            <div style="font-size:36px;margin-bottom:8px;">🔒</div>
            <div style="font-weight:bold;">長押しして数字を見る</div>
            <div style="font-size:12px;color:#94a3b8;">他の人に見られないように！</div>
          </div>
          <button class="btn-primary" style="padding:12px 28px;margin-top:12px;" onclick="nextItoPlayer()">
            確認した！${itoCurrentPlayer + 1 < itoPlayerCount ? '次の人へ ➡️' : '全員確認完了！会話へ 🗣️'}
          </button>
        </div>
      </div>
    `;
  } else if (itoStep === 'talk') {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header">
          <div class="solo-title">🗣️ トーク＆すり合わせタイム！</div>
        </div>
        <div class="talk-card-container">
          <div class="talk-prompt-box">
            <span class="talk-badge-tag">お題</span>
            <div class="talk-main-theme">${itoTheme}</div>
            <p style="font-size:13px;color:#cbd5e1;line-height:1.5;">
              ⚠️ <strong>数字を直接言うのは禁止！</strong><br>
              「給食の揚げパン」「冷凍みかん」などの言葉で自分の数字を例え合い、小さい順を予想しよう！
            </p>
          </div>
          <div style="font-size:14px;color:#94a3b8;margin-bottom:12px;">話し合いが終わったら答え合わせ！</div>
          <button class="btn-primary" style="padding:14px 32px;font-size:18px;" onclick="finishItoAnswer()">
            🎉 答え合わせ！数字オープン！
          </button>
        </div>
      </div>
    `;
  }
}

// ==============================================================================
// 11. 「カタカナーシ」(talk_katakana) - カタカナ語禁止トーク
// ==============================================================================
const KATAKANA_WORDS = [
  'スマートフォン', 'シャーペン', 'ハンバーガー', 'サッカー', 'カラオケ',
  'エレベーター', 'マクドナルド', 'チョコレート', 'イヤホン', 'プログラミング',
  'ノートパソコン', 'バナナ', 'テレビ', 'クリスマス', 'ジェットコースター',
  'コンビニ', 'スニーカー', 'ゲームセンター', 'タピオカ', 'インスタグラム',
  'サングラス', 'マフラー', 'リコーダー', 'プール', 'リュックサック'
];

let katakanaCurrentWord = '';
let katakanaScore = 0;
let katakanaTimer = null;
let katakanaTimeLeft = 60;
let katakanaIsActive = false;

function initTalkKatakanaGame() {
  katakanaScore = 0;
  katakanaTimeLeft = 60;
  katakanaIsActive = false;
  if (katakanaTimer) clearInterval(katakanaTimer);
  renderTalkKatakana();
}

function startKatakanaGame() {
  katakanaScore = 0;
  katakanaTimeLeft = 60;
  katakanaIsActive = true;
  pickNewKatakanaWord();
  renderTalkKatakana();

  if (katakanaTimer) clearInterval(katakanaTimer);
  katakanaTimer = setInterval(() => {
    if (currentScreen !== 'screen-talk_katakana') return;
    katakanaTimeLeft--;
    const tEl = document.getElementById('katakana-timer');
    if (tEl) tEl.textContent = `${katakanaTimeLeft}s`;

    if (katakanaTimeLeft <= 0) {
      clearInterval(katakanaTimer);
      katakanaIsActive = false;
      if (window.sounds) window.sounds.playSuccess();
      showModal('⏱️ タイムアップ！', `正解数: ${katakanaScore} 問！\n見事な日本語力でした！`, () => {
        initTalkKatakanaGame();
      });
    }
  }, 1000);
}

function pickNewKatakanaWord() {
  katakanaCurrentWord = KATAKANA_WORDS[Math.floor(Math.random() * KATAKANA_WORDS.length)];
}

function katakanaNext(success) {
  if (!katakanaIsActive) return;
  if (success) {
    katakanaScore++;
    if (window.sounds) window.sounds.playSuccess();
  } else {
    if (window.sounds) window.sounds.playExplosion();
  }
  pickNewKatakanaWord();
  renderTalkKatakana();
}

function renderTalkKatakana() {
  const container = document.getElementById('screen-talk_katakana');
  if (!container) return;

  if (!katakanaIsActive) {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header"><div class="solo-title">🚫 カタカナーシ</div></div>
        <div class="talk-card-container">
          <div class="talk-prompt-box">
            <span class="talk-badge-tag">ルール説明</span>
            <div class="talk-main-theme">カタカナ語を一切使わずに説明せよ！</div>
            <p style="font-size:13px;color:#cbd5e1;line-height:1.6;text-align:left;">
              1. 画面にお題（例:「スマホ」）が出ます。<br>
              2. 出題者はカタカナを一切喋らずに言葉で説明します。<br>
              3. 友達が当てたら「正解！」ボタン！カタカナを言ったら「アウト（パス）」！<br>
              4. 60秒間で何問正解できるか挑戦！
            </p>
          </div>
          <button class="btn-primary" style="padding:14px 32px;font-size:18px;" onclick="startKatakanaGame()">
            🔥 60秒ゲームスタート！
          </button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header">
          <div class="solo-title">🚫 カタカナーシ</div>
          <div class="solo-badge">スコア: ${katakanaScore}</div>
        </div>
        <div class="talk-card-container">
          <div id="katakana-timer" class="katakana-timer-huge">${katakanaTimeLeft}s</div>
          <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">出題者はお題をカタカナ抜きで説明してね！</div>
          <div class="katakana-word-display">${katakanaCurrentWord}</div>
          <div style="display:flex;gap:14px;justify-content:center;width:100%;max-width:320px;">
            <button class="btn-primary" style="flex:1;padding:14px;font-size:16px;background:#22c55e;" onclick="katakanaNext(true)">
              ⭕ 当たった！(+1)
            </button>
            <button class="btn-danger" style="flex:1;padding:14px;font-size:16px;background:#ef4444;" onclick="katakanaNext(false)">
              ❌ カタカナ言った(パス)
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// ==============================================================================
// 12. 「言わせろ！NGワードバトル」(talk_ngword)
// ==============================================================================
const NG_WORDS_LIST = [
  'それな', 'マジで？', '知らんけど', 'ヤバい', '宿題',
  '先生', '眠い', '草', '無理', 'お腹すいた', 'だるい',
  '可愛い', 'すごい', 'ほんとに？', 'ちょっと待って'
];

let ngPlayers = [];
let ngPlayerCount = 3;
let ngCurrentCheck = 0;
let ngStep = 'setup';

function initTalkNgWordGame() {
  ngStep = 'setup';
  renderTalkNgWord();
}

function startNgGame(count) {
  ngPlayerCount = count;
  const shuffled = [...NG_WORDS_LIST].sort(() => 0.5 - Math.random());
  ngPlayers = [];
  for (let i = 0; i < count; i++) {
    ngPlayers.push({
      id: i + 1,
      word: shuffled[i % shuffled.length],
      out: false
    });
  }
  ngCurrentCheck = 0;
  ngStep = 'view';
  renderTalkNgWord();
  if (window.sounds) window.sounds.playTap();
}

function handleNgReveal(reveal) {
  const card = document.getElementById('ng-secret-card');
  if (!card) return;
  if (reveal) {
    card.classList.add('revealed');
    card.innerHTML = `
      <div style="font-size:12px;opacity:0.8;">あなたのNGワード（言ったら負け！）</div>
      <div class="talk-number-huge" style="font-size:36px;color:#f87171;">「${ngPlayers[ngCurrentCheck].word}」</div>
      <div style="font-size:12px;opacity:0.8;">指を離すと隠れます</div>
    `;
    if (window.sounds) window.sounds.playTap();
  } else {
    card.classList.remove('revealed');
    card.innerHTML = `
      <div style="font-size:36px;margin-bottom:8px;">🔒</div>
      <div style="font-weight:bold;">長押ししてNGワードを見る</div>
      <div style="font-size:12px;color:#94a3b8;">他の人にバレないように！</div>
    `;
  }
}

function nextNgPlayer() {
  ngCurrentCheck++;
  if (ngCurrentCheck >= ngPlayerCount) {
    ngStep = 'battle';
  }
  renderTalkNgWord();
  if (window.sounds) window.sounds.playTap();
}

function triggerNgOut(idx) {
  ngPlayers[idx].out = true;
  if (window.sounds) window.sounds.playExplosion();
  renderTalkNgWord();
  alert(`💥 プレイヤー ${idx + 1} がNGワード「${ngPlayers[idx].word}」を言いました！脱落！`);
}

function renderTalkNgWord() {
  const container = document.getElementById('screen-talk_ngword');
  if (!container) return;

  if (ngStep === 'setup') {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header"><div class="solo-title">🤐 言わせろ！NGワードバトル</div></div>
        <div class="talk-card-container">
          <div class="talk-prompt-box">
            <span class="talk-badge-tag">人数選択</span>
            <div class="talk-main-theme">何人で遊びますか？</div>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">
              <button class="btn-primary" style="padding:12px 20px;" onclick="startNgGame(2)">2人</button>
              <button class="btn-primary" style="padding:12px 20px;" onclick="startNgGame(3)">3人</button>
              <button class="btn-primary" style="padding:12px 20px;" onclick="startNgGame(4)">4人</button>
              <button class="btn-primary" style="padding:12px 20px;" onclick="startNgGame(5)">5人</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (ngStep === 'view') {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header">
          <div class="solo-title">🤐 プレイヤー ${ngCurrentCheck + 1} の番</div>
        </div>
        <div class="talk-card-container">
          <div class="talk-prompt-box">
            <div class="talk-main-theme">スマホを回してNGワードを確認！</div>
            <p style="font-size:13px;color:#94a3b8;">会話中に自分がこの言葉を言ったら負けです！</p>
          </div>
          <div id="ng-secret-card" class="talk-secret-card"
               onpointerdown="handleNgReveal(true)" onpointerup="handleNgReveal(false)">
            <div style="font-size:36px;margin-bottom:8px;">🔒</div>
            <div style="font-weight:bold;">長押ししてNGワードを見る</div>
            <div style="font-size:12px;color:#94a3b8;">他の人にバレないように！</div>
          </div>
          <button class="btn-primary" style="padding:12px 28px;margin-top:12px;" onclick="nextNgPlayer()">
            覚えた！${ngCurrentCheck + 1 < ngPlayerCount ? '次の人へ ➡️' : 'バトル開始！🗣️'}
          </button>
        </div>
      </div>
    `;
  } else if (ngStep === 'battle') {
    container.innerHTML = `
      <div class="solo-game-container">
        <div class="solo-header">
          <div class="solo-title">🤐 バトル中！普通に雑談しよう</div>
        </div>
        <div class="talk-card-container">
          <div class="talk-prompt-box">
            <span class="talk-badge-tag">ルール</span>
            <div style="font-size:15px;color:#e2e8f0;line-height:1.6;">
              普通の会話をしつつ、相手にNGワードを言わせよう！<br>
              言った人がいたら下のボタンをポチッ！
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:320px;">
            ${ngPlayers.map((p, idx) => `
              <button class="btn-primary" style="padding:12px;display:flex;justify-content:space-between;align-items:center;background:${p.out ? '#475569' : '#1e293b'};border:1px solid #334155;"
                      ${p.out ? 'disabled' : ''} onclick="triggerNgOut(${idx})">
                <span>プレイヤー ${p.id}</span>
                <span>${p.out ? '💥 脱落！' : '言った！押す 🚨'}</span>
              </button>
            `).join('')}
          </div>
          <button class="btn-secondary" style="margin-top:20px;padding:8px 18px;" onclick="initTalkNgWordGame()">もう一回遊ぶ 🔄</button>
        </div>
      </div>
    `;
  }
}

// ==============================================================================
// 13. 「すべらない話・エピソードトークガチャ」(talk_story_roulette)
// ==============================================================================
const STORY_TOPICS = [
  '先生にガチで怒られた伝説の事件',
  '今までで一番恥ずかしかった言い間違い・聞き間違い',
  '実はまだクラスの誰にも言ってない秘密',
  '小学生の頃に信じ込んでた変な思い込み',
  '人生で一番痛かった瞬間',
  'テスト中に起きた気まずいハプニング',
  '家族にバレてめちゃくちゃ焦ったこと',
  '今思い返しても謎すぎる自分の奇行',
  '給食・弁当で起きた笑える事件',
  '通学路で遭遇した怪しい出来事',
  '夜中に一人でやってしまった黒歴史'
];

let storyIndex = 0;
let storyTimer = null;
let storyTimeLeft = 60;
let storyTimerRunning = false;

function initTalkStoryRouletteGame() {
  storyIndex = Math.floor(Math.random() * STORY_TOPICS.length);
  storyTimeLeft = 60;
  storyTimerRunning = false;
  if (storyTimer) clearInterval(storyTimer);
  renderTalkStory();
}

function spinStoryTopic() {
  if (window.sounds) window.sounds.playTap();
  const box = document.getElementById('story-topic-text');
  if (box) box.textContent = 'ルーレット回転中...🎲';

  let count = 0;
  const spinInterval = setInterval(() => {
    count++;
    storyIndex = (storyIndex + 1) % STORY_TOPICS.length;
    if (box) box.textContent = STORY_TOPICS[storyIndex];

    if (count > 10) {
      clearInterval(spinInterval);
      if (window.sounds) window.sounds.playSuccess();
    }
  }, 80);
}

function toggleStoryTimer() {
  const btn = document.getElementById('btn-story-timer');
  if (!storyTimerRunning) {
    storyTimerRunning = true;
    if (btn) btn.textContent = '⏹️ ストップ';
    if (window.sounds) window.sounds.playTap();

    storyTimer = setInterval(() => {
      storyTimeLeft--;
      const tEl = document.getElementById('story-timer-display');
      if (tEl) tEl.textContent = `${storyTimeLeft}秒`;

      if (storyTimeLeft <= 0) {
        clearInterval(storyTimer);
        storyTimerRunning = false;
        if (btn) btn.textContent = '▶️ タイマースタート';
        if (window.sounds) window.sounds.playSuccess();
        alert('🔔 タイムアップ！面白い話をありがとう！');
      }
    }, 1000);
  } else {
    storyTimerRunning = false;
    clearInterval(storyTimer);
    if (btn) btn.textContent = '▶️ 再開';
  }
}

function renderTalkStory() {
  const container = document.getElementById('screen-talk_story_roulette');
  if (!container) return;

  container.innerHTML = `
    <div class="solo-game-container">
      <div class="solo-header"><div class="solo-title">🎤 エピソードトークガチャ</div></div>
      <div class="talk-card-container">
        <div class="talk-prompt-box">
          <span class="talk-badge-tag">今日のお題トーク</span>
          <div id="story-topic-text" class="talk-main-theme">${STORY_TOPICS[storyIndex]}</div>
        </div>
        <button class="btn-primary" style="padding:14px 28px;font-size:16px;margin-bottom:20px;" onclick="spinStoryTopic()">
          🎲 別のお題を引く！
        </button>

        <div style="background:rgba(30,41,59,0.8);padding:14px 20px;border-radius:12px;border:1px solid #334155;max-width:320px;width:100%;">
          <div style="font-size:12px;color:#94a3b8;">トークタイマー</div>
          <div id="story-timer-display" style="font-size:32px;font-weight:900;color:#38bdf8;margin:6px 0;">60秒</div>
          <button id="btn-story-timer" class="btn-primary" style="padding:8px 20px;font-size:14px;" onclick="toggleStoryTimer()">
            ▶️ 1分タイマースタート
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==============================================================================
// 14. 「2つの真実と1つの嘘」(talk_two_truths) - ライアーゲーム
// ==============================================================================
const TWO_TRUTHS_THEMES = [
  'テーマ: 「子供の頃にやったヤバいこと」',
  'テーマ: 「実は今苦手なもの・怖いもの」',
  'テーマ: 「誰にも言ってない最近の小さな秘密」',
  'テーマ: 「今までに会ったことのある有名人・変な人」',
  'テーマ: 「自分の家族・ペットの伝説エピソード」'
];

let twoTruthsThemeIdx = 0;

function initTalkTwoTruthsGame() {
  twoTruthsThemeIdx = Math.floor(Math.random() * TWO_TRUTHS_THEMES.length);
  renderTalkTwoTruths();
}

function nextTwoTruthsTheme() {
  twoTruthsThemeIdx = (twoTruthsThemeIdx + 1) % TWO_TRUTHS_THEMES.length;
  if (window.sounds) window.sounds.playTap();
  renderTalkTwoTruths();
}

function renderTalkTwoTruths() {
  const container = document.getElementById('screen-talk_two_truths');
  if (!container) return;

  container.innerHTML = `
    <div class="solo-game-container">
      <div class="solo-header"><div class="solo-title">🕵️ 2つの真実と1つの嘘</div></div>
      <div class="talk-card-container">
        <div class="talk-prompt-box">
          <span class="talk-badge-tag">ルール説明</span>
          <div class="talk-main-theme">本物2つと真っ赤な嘘1つを語れ！</div>
          <p style="font-size:13px;color:#cbd5e1;line-height:1.6;text-align:left;">
            1. 話し手は以下のテーマに沿って「本当にあった話2つ」と「嘘の話1つ」を喋ります。<br>
            2. 聞き手は質問攻めにして、どれが作り話か暴いてください！
          </p>
        </div>

        <div style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:white;padding:16px 20px;border-radius:14px;font-size:18px;font-weight:900;margin-bottom:16px;box-shadow:0 8px 20px rgba(59,130,246,0.3);">
          ${TWO_TRUTHS_THEMES[twoTruthsThemeIdx]}
        </div>

        <button class="btn-primary" style="padding:12px 24px;font-size:15px;" onclick="nextTwoTruthsTheme()">
          🔄 次のテーマへ！
        </button>
      </div>
    </div>
  `;
}

// ==============================================================================
// 15. 「偏見プロフィールメーカー」(talk_prejudice)
// ==============================================================================
const PREJUDICE_POOL = [
  '家でYouTube見ながら絶対変なオリジナルダンス踊ってる',
  '前世はたぶんナマケモノかコアラ',
  'カバンの中に3ヶ月前のシワシワのプリントが化石化してる',
  '休日は昼過ぎまで寝てて、起きた瞬間「腹減った」って言う',
  '筆箱の中に使えない芯の折れた鉛筆が3本入ってる',
  '目覚ましのアラームを3分おきに7個かけてるけど全部止めて二度寝する',
  'テスト前日に「全然勉強してないわ〜」って言ってガチでしてないタイプ',
  'コンビニで新しいアイスが出たら誰よりも早く買ってる',
  '靴下の片方を部屋の隙間に吸い込まれがち',
  '怒られた直後、誰も見てないところで絶対変な顔してる'
];

let prejudiceTargetName = '友達';
let currentPrejudices = [];

function initTalkPrejudiceGame() {
  generatePrejudice('隣の友達');
}

function generatePrejudice(name) {
  prejudiceTargetName = name || '隣の友達';
  const shuffled = [...PREJUDICE_POOL].sort(() => 0.5 - Math.random());
  currentPrejudices = shuffled.slice(0, 3);
  if (window.sounds) window.sounds.playSuccess();
  renderTalkPrejudice();
}

function handlePrejudiceCustom() {
  const input = document.getElementById('prejudice-input-name');
  if (input && input.value.trim()) {
    generatePrejudice(input.value.trim());
  }
}

function renderTalkPrejudice() {
  const container = document.getElementById('screen-talk_prejudice');
  if (!container) return;

  container.innerHTML = `
    <div class="solo-game-container">
      <div class="solo-header"><div class="solo-title">🏆 偏見プロフィールメーカー</div></div>
      <div class="talk-card-container">
        <div style="display:flex;gap:8px;margin-bottom:16px;width:100%;max-width:340px;">
          <input type="text" id="prejudice-input-name" placeholder="友達の名前を入力" class="formula-input" style="flex:1;padding:8px 12px;font-size:14px;border-radius:8px;" value="${prejudiceTargetName}">
          <button class="btn-primary" style="padding:8px 16px;" onclick="handlePrejudiceCustom()">鑑定！🔍</button>
        </div>

        <div class="prejudice-certificate">
          <div class="prejudice-title">📜 【公認】勝手な偏見鑑定書</div>
          <div style="text-align:center;font-weight:900;font-size:18px;margin-bottom:12px;color:#854d0e;">対象: ${prejudiceTargetName} 殿</div>
          ${currentPrejudices.map(p => `
            <div class="prejudice-item">${p}</div>
          `).join('')}
          <div style="margin-top:14px;font-size:11px;color:#a16207;text-align:right;">※この判定は全自動AI（偏見100%）による妄想です</div>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px;">
          <button class="btn-primary" style="padding:10px 20px;" onclick="generatePrejudice('${prejudiceTargetName}')">もう一度鑑定 🎲</button>
        </div>
      </div>
    </div>
  `;
}
