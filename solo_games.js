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
