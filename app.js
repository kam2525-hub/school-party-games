// アプリ全体のステート管理とゲームロジック

let currentScreen = 'screen-menu';

// 画面切り替え
function showScreen(screenId) {
  // すべてのスクリーンを非表示
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
  }

  // ホームボタンの表示/非表示
  const homeBtn = document.getElementById('btn-home');
  if (screenId === 'screen-menu') {
    homeBtn.style.display = 'none';
    cleanupActiveGame();
  } else {
    homeBtn.style.display = 'flex';
  }

  // モーダルを閉じる
  closeModal();
}

function cleanupActiveGame() {
  if (window.activeGameTimer) {
    clearInterval(window.activeGameTimer);
    window.activeGameTimer = null;
  }
  if (window.activeGameTimeout) {
    clearTimeout(window.activeGameTimeout);
    window.activeGameTimeout = null;
  }
}

// サウンド切り替え
document.getElementById('btn-sound').addEventListener('click', () => {
  const isMuted = window.sounds.toggleMute();
  document.getElementById('btn-sound').textContent = isMuted ? '🔇' : '🔊';
});

// ホームボタン
document.getElementById('btn-home').addEventListener('click', () => {
  showScreen('screen-menu');
});

// モーダル
function showModal(title, msg, onRetry) {
  const modal = document.getElementById('game-modal');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-msg').textContent = msg;
  
  const retryBtn = document.getElementById('modal-btn-retry');
  retryBtn.onclick = () => {
    closeModal();
    if (onRetry) onRetry();
  };
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('game-modal').style.display = 'none';
}

// ゲーム起動ルーティング
function startGame(gameKey) {
  cleanupActiveGame();
  window.sounds.init();

  switch (gameKey) {
    case 'sumo':
      showScreen('screen-sumo');
      initSumoGame();
      break;
    case 'reflex':
      showScreen('screen-reflex');
      initReflexGame();
      break;
    case 'wolf':
      showScreen('screen-wolf');
      setupWordWolfScreen();
      break;
    case 'bomb':
      showScreen('screen-bomb');
      initBombGame();
      break;
    case 'twister':
      showScreen('screen-twister');
      initTwisterGame();
      break;
  }
}

/* ============================================================
   1. 連打相撲 (Tap Battle / Sumo)
   ============================================================ */
let sumoPos = 50; // 0 (P1勝利) 〜 100 (P2勝利)
let sumoScore1 = 0;
let sumoScore2 = 0;
let isSumoActive = false;

function initSumoGame() {
  sumoPos = 50;
  isSumoActive = true;
  updateSumoUI();

  const p1Zone = document.getElementById('sumo-p1');
  const p2Zone = document.getElementById('sumo-p2');

  const onP1Tap = (e) => {
    e.preventDefault();
    if (!isSumoActive) return;
    window.sounds.playTap();
    sumoPos += 2.5; // P1(上側)は下方向(100側)へ押し込む
    checkSumoState();
  };

  const onP2Tap = (e) => {
    e.preventDefault();
    if (!isSumoActive) return;
    window.sounds.playTap();
    sumoPos -= 2.5; // P2(下側)は上方向(0側)へ押し込む
    checkSumoState();
  };

  p1Zone.onpointerdown = onP1Tap;
  p2Zone.onpointerdown = onP2Tap;
}

function updateSumoUI() {
  const divider = document.getElementById('sumo-divider');
  divider.style.top = `${sumoPos}%`;
  document.getElementById('sumo-score-p1').textContent = sumoScore1;
  document.getElementById('sumo-score-p2').textContent = sumoScore2;
}

function checkSumoState() {
  updateSumoUI();
  if (sumoPos >= 92) {
    isSumoActive = false;
    sumoScore1++;
    updateSumoUI();
    window.sounds.playSuccess();
    showModal('🎉 プレイヤー 1 の勝利！', '圧倒的な連打力で相手を押し切りました！', () => {
      initSumoGame();
    });
  } else if (sumoPos <= 8) {
    isSumoActive = false;
    sumoScore2++;
    updateSumoUI();
    window.sounds.playSuccess();
    showModal('🎉 プレイヤー 2 の勝利！', '圧倒的な連打力で相手を押し切りました！', () => {
      initSumoGame();
    });
  }
}

/* ============================================================
   2. 早押しデュエル (Reflex Duel)
   ============================================================ */
let reflexScore1 = 0;
let reflexScore2 = 0;
let reflexState = 'idle'; // 'waiting', 'ready', 'ended'
let reflexStartTime = 0;

function initReflexGame() {
  reflexScore1 = 0;
  reflexScore2 = 0;
  updateReflexUI();
  nextReflexRound();

  const p1Zone = document.getElementById('reflex-p1');
  const p2Zone = document.getElementById('reflex-p2');

  p1Zone.onpointerdown = (e) => {
    e.preventDefault();
    handleReflexTap(1);
  };

  p2Zone.onpointerdown = (e) => {
    e.preventDefault();
    handleReflexTap(2);
  };
}

function updateReflexUI() {
  document.getElementById('reflex-score-p1').textContent = reflexScore1;
  document.getElementById('reflex-score-p2').textContent = reflexScore2;
}

function nextReflexRound() {
  reflexState = 'waiting';
  const center = document.getElementById('reflex-center');
  center.textContent = '待て……';
  center.style.background = '#0f172a';
  center.style.color = '#f8fafc';
  center.style.borderColor = '#f8fafc';

  const delay = 1800 + Math.random() * 3200; // 1.8秒〜5秒のランダム
  window.activeGameTimeout = setTimeout(() => {
    if (currentScreen !== 'screen-reflex') return;
    reflexState = 'ready';
    reflexStartTime = performance.now();
    center.textContent = '💥 今だ！撃て！';
    center.style.background = '#e11d48';
    center.style.color = '#ffffff';
    center.style.borderColor = '#fbbf24';
    window.sounds.playGunshot();
  }, delay);
}

function handleReflexTap(player) {
  if (reflexState === 'waiting') {
    // お手つき！
    reflexState = 'ended';
    clearTimeout(window.activeGameTimeout);
    window.sounds.playError();
    const other = player === 1 ? 2 : 1;
    if (other === 1) reflexScore1++; else reflexScore2++;
    updateReflexUI();

    const center = document.getElementById('reflex-center');
    center.textContent = `❌ P${player} お手つき！`;
    center.style.background = '#475569';

    checkReflexWinner(other);
  } else if (reflexState === 'ready') {
    // 成功！
    reflexState = 'ended';
    const reactionTime = Math.round(performance.now() - reflexStartTime);
    window.sounds.playSuccess();
    if (player === 1) reflexScore1++; else reflexScore2++;
    updateReflexUI();

    const center = document.getElementById('reflex-center');
    center.textContent = `P${player} 命中! (${reactionTime}ms)`;

    checkReflexWinner(player);
  }
}

function checkReflexWinner(lastWinner) {
  if (reflexScore1 >= 3 || reflexScore2 >= 3) {
    const winner = reflexScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
    setTimeout(() => {
      showModal(`👑 ${winner} の総合勝利！`, `3本先取で見事勝利しました！`, () => {
        initReflexGame();
      });
    }, 700);
  } else {
    window.activeGameTimeout = setTimeout(() => {
      if (currentScreen === 'screen-reflex') {
        nextReflexRound();
      }
    }, 1200);
  }
}

/* ============================================================
   3. ワードウルフ (Word Wolf)
   ============================================================ */
let wolfTotalPlayers = 4;
let wolfCurrentIndex = 0;
let wolfCards = []; // 各プレイヤーのお題
let wolfMajorityWord = '';
let wolfMinorityWord = '';
let wolfTimerSeconds = 180;
let wolfTimerRunning = false;

function setupWordWolfScreen() {
  document.getElementById('wolf-setup').style.display = 'flex';
  document.getElementById('wolf-reveal').style.display = 'none';
  document.getElementById('wolf-talk').style.display = 'none';
  document.getElementById('wolf-result').style.display = 'none';
}

function adjustWolfPlayers(delta) {
  wolfTotalPlayers = Math.max(3, Math.min(8, wolfTotalPlayers + delta));
  document.getElementById('wolf-player-count').textContent = wolfTotalPlayers;
  document.getElementById('wolf-citizen-count').textContent = wolfTotalPlayers - 1;
}

function initWordWolfGame() {
  // お題のランダム抽選
  const topics = window.GAME_DATA.wordWolfTopics;
  const pair = topics[Math.floor(Math.random() * topics.length)];
  
  // どっちを市民にするかもランダム
  const flip = Math.random() < 0.5;
  wolfMajorityWord = flip ? pair[0] : pair[1];
  wolfMinorityWord = flip ? pair[1] : pair[0];

  // ウルフを1人ランダム決定
  const wolfIndex = Math.floor(Math.random() * wolfTotalPlayers);
  wolfCards = [];
  for (let i = 0; i < wolfTotalPlayers; i++) {
    wolfCards.push({
      playerNum: i + 1,
      isWolf: i === wolfIndex,
      word: i === wolfIndex ? wolfMinorityWord : wolfMajorityWord
    });
  }

  wolfCurrentIndex = 0;
  document.getElementById('wolf-setup').style.display = 'none';
  document.getElementById('wolf-reveal').style.display = 'flex';
  showWolfTurn();
}

function showWolfTurn() {
  const current = wolfCards[wolfCurrentIndex];
  document.getElementById('wolf-turn-label').textContent = `プレイヤー ${current.playerNum} さんの番`;
  document.getElementById('wolf-topic-text').textContent = current.word;
  
  const card = document.getElementById('wolf-card');
  const hiddenDiv = document.getElementById('wolf-card-hidden');
  const visibleDiv = document.getElementById('wolf-card-visible');

  card.classList.remove('revealed');
  hiddenDiv.style.display = 'block';
  visibleDiv.style.display = 'none';

  // 長押し検知
  const showWord = (e) => {
    e.preventDefault();
    card.classList.add('revealed');
    hiddenDiv.style.display = 'none';
    visibleDiv.style.display = 'block';
    window.sounds.playTap();
  };

  const hideWord = (e) => {
    e.preventDefault();
    card.classList.remove('revealed');
    hiddenDiv.style.display = 'block';
    visibleDiv.style.display = 'none';
  };

  card.onpointerdown = showWord;
  card.onpointerup = hideWord;
  card.onpointercancel = hideWord;
}

function nextWolfPlayer() {
  wolfCurrentIndex++;
  if (wolfCurrentIndex < wolfTotalPlayers) {
    showWolfTurn();
  } else {
    // 全員確認終了！話し合いへ
    startWolfTalk();
  }
}

function startWolfTalk() {
  document.getElementById('wolf-reveal').style.display = 'none';
  document.getElementById('wolf-talk').style.display = 'flex';

  wolfTimerSeconds = 180;
  wolfTimerRunning = true;
  updateWolfTimerDisplay();

  window.activeGameTimer = setInterval(() => {
    if (wolfTimerRunning) {
      wolfTimerSeconds--;
      updateWolfTimerDisplay();
      if (wolfTimerSeconds <= 10 && wolfTimerSeconds > 0) {
        window.sounds.playTick();
      }
      if (wolfTimerSeconds <= 0) {
        clearInterval(window.activeGameTimer);
        window.sounds.playExplosion();
        endWolfTalk();
      }
    }
  }, 1000);
}

function updateWolfTimerDisplay() {
  const m = Math.floor(wolfTimerSeconds / 60).toString().padStart(2, '0');
  const s = (wolfTimerSeconds % 60).toString().padStart(2, '0');
  document.getElementById('wolf-timer').textContent = `${m}:${s}`;
}

function toggleWolfTimer() {
  wolfTimerRunning = !wolfTimerRunning;
  document.getElementById('wolf-timer-btn').textContent = wolfTimerRunning ? '一時停止' : '再開';
}

function endWolfTalk() {
  clearInterval(window.activeGameTimer);
  document.getElementById('wolf-talk').style.display = 'none';
  document.getElementById('wolf-result').style.display = 'flex';

  const wolfUser = wolfCards.find(c => c.isWolf);
  const resultHtml = `
    <div style="font-size: 18px; font-weight: 800; color: #f87171; margin-bottom: 12px;">
      🐺 ウルフは プレイヤー ${wolfUser.playerNum} でした！
    </div>
    <div style="text-align: left; font-size: 15px; line-height: 1.8;">
      <div>・市民のお題: <b style="color: #38bdf8;">${wolfMajorityWord}</b></div>
      <div>・ウルフのお題: <b style="color: #fb923c;">${wolfMinorityWord}</b></div>
    </div>
  `;
  document.getElementById('wolf-result-details').innerHTML = resultHtml;
}

/* ============================================================
   4. 爆弾チキンレース (Bomb Pass)
   ============================================================ */
let bombPassCount = 0;
let bombRemainingSeconds = 0;
let bombIsExploded = false;

function initBombGame() {
  bombPassCount = 0;
  bombIsExploded = false;
  // 15秒〜38秒でランダム爆発
  bombRemainingSeconds = Math.floor(15 + Math.random() * 23);
  
  document.getElementById('bomb-pass-count').textContent = `パス回数: 0回`;
  document.getElementById('bomb-visual').textContent = '💣';
  document.getElementById('bomb-pass-btn').disabled = false;
  nextBombTopic();

  clearInterval(window.activeGameTimer);
  window.activeGameTimer = setInterval(() => {
    if (bombIsExploded || currentScreen !== 'screen-bomb') return;
    
    bombRemainingSeconds--;
    window.sounds.playTick();

    if (bombRemainingSeconds <= 0) {
      explodeBomb();
    }
  }, 1000);
}

function nextBombTopic() {
  const list = window.GAME_DATA.bombPrompts;
  const topic = list[Math.floor(Math.random() * list.length)];
  document.getElementById('bomb-topic').textContent = topic;
}

function passBomb() {
  if (bombIsExploded) return;
  bombPassCount++;
  document.getElementById('bomb-pass-count').textContent = `パス回数: ${bombPassCount}回`;
  window.sounds.playTap();
  nextBombTopic();
}

function explodeBomb() {
  bombIsExploded = true;
  clearInterval(window.activeGameTimer);
  window.sounds.playExplosion();

  document.getElementById('bomb-visual').textContent = '💥💥💥';
  document.getElementById('bomb-pass-btn').disabled = true;

  setTimeout(() => {
    showModal('💥 ボカァァン！！', `爆発しました！いまスマホを持っていた人の負け！\n(パス回数: ${bombPassCount}回)`, () => {
      initBombGame();
    });
  }, 400);
}

/* ============================================================
   5. フィンガーツイスター (Finger Twister)
   ============================================================ */
let twisterCanvas, twisterCtx;
let twisterTargets = []; // { id, player: 1|2, x, y, radius: 45, touched: false }
let twisterTouches = [];
let twisterInterval = null;
let isTwisterRunning = false;

function initTwisterGame() {
  twisterCanvas = document.getElementById('twister-canvas');
  twisterCtx = twisterCanvas.getContext('2d');
  
  // リサイズ
  twisterCanvas.width = twisterCanvas.clientWidth;
  twisterCanvas.height = twisterCanvas.clientHeight;

  twisterTargets = [];
  twisterTouches = [];
  isTwisterRunning = true;

  // 初期ターゲット2つ（P1上側、P2下側）
  addTwisterTarget(1);
  addTwisterTarget(2);

  // タッチイベント
  twisterCanvas.ontouchstart = handleTwisterTouch;
  twisterCanvas.ontouchmove = handleTwisterTouch;
  twisterCanvas.ontouchend = handleTwisterTouch;
  twisterCanvas.ontouchcancel = handleTwisterTouch;

  // 4秒ごとに新しい指ターゲットを追加
  clearInterval(twisterInterval);
  twisterInterval = setInterval(() => {
    if (!isTwisterRunning || currentScreen !== 'screen-twister') return;
    if (twisterTargets.length < 6) {
      const nextPlayer = twisterTargets.length % 2 === 0 ? 1 : 2;
      addTwisterTarget(nextPlayer);
      window.sounds.playBeep(520, 0.15);
    }
  }, 4000);

  requestAnimationFrame(twisterRenderLoop);
}

function addTwisterTarget(player) {
  const w = twisterCanvas.width;
  const h = twisterCanvas.height;
  const padding = 60;

  // P1は画面上半分、P2は画面下半分に出現しやすいように
  const minY = player === 1 ? padding : h / 2 + 20;
  const maxY = player === 1 ? h / 2 - 20 : h - padding;

  const target = {
    id: Date.now() + Math.random(),
    player: player,
    x: padding + Math.random() * (w - padding * 2),
    y: minY + Math.random() * (maxY - minY),
    radius: 46,
    activeTime: performance.now()
  };
  twisterTargets.push(target);
}

function handleTwisterTouch(e) {
  e.preventDefault();
  if (!isTwisterRunning) return;

  const rect = twisterCanvas.getBoundingClientRect();
  twisterTouches = [];
  for (let i = 0; i < e.touches.length; i++) {
    const t = e.touches[i];
    twisterTouches.push({
      x: t.clientX - rect.left,
      y: t.clientY - rect.top
    });
  }
}

function twisterRenderLoop() {
  if (currentScreen !== 'screen-twister') return;

  const ctx = twisterCtx;
  const w = twisterCanvas.width;
  const h = twisterCanvas.height;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 境界線（中央）
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // ガイドテキスト
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('🔴 プレイヤー 1 エリア（指を離すな！）', w / 2, 30);

  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
  ctx.fillText('🔵 プレイヤー 2 エリア（指を離すな！）', w / 2, h - 20);

  // ターゲット描画とタッチ判定
  const now = performance.now();
  let failedPlayer = null;

  twisterTargets.forEach((tg) => {
    // タッチされているか判定
    let isTouched = false;
    for (const touch of twisterTouches) {
      const dist = Math.hypot(touch.x - tg.x, touch.y - tg.y);
      if (dist <= tg.radius + 15) {
        isTouched = true;
        break;
      }
    }

    // 出現後2秒の猶予期間を過ぎてから判定
    const elapsed = now - tg.activeTime;
    if (elapsed > 2000 && !isTouched && isTwisterRunning) {
      failedPlayer = tg.player;
    }

    // 描画
    ctx.beginPath();
    ctx.arc(tg.x, tg.y, tg.radius, 0, Math.PI * 2);
    ctx.fillStyle = tg.player === 1 
      ? (isTouched ? '#ef4444' : 'rgba(239, 68, 68, 0.4)')
      : (isTouched ? '#3b82f6' : 'rgba(59, 130, 246, 0.4)');
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = isTouched ? '#ffffff' : (tg.player === 1 ? '#f87171' : '#60a5fa');
    ctx.stroke();

    // ラベル
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`P${tg.player} 指`, tg.x, tg.y);
  });

  // 失敗判定
  if (failedPlayer && isTwisterRunning) {
    isTwisterRunning = false;
    clearInterval(twisterInterval);
    window.sounds.playError();
    const winner = failedPlayer === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
    showModal(`🎉 ${winner} の勝利！`, `プレイヤー ${failedPlayer} の指が離れてしまいました！`, () => {
      initTwisterGame();
    });
    return;
  }

  requestAnimationFrame(twisterRenderLoop);
}

// 画面回転やリサイズ時のCanvas追従
window.addEventListener('resize', () => {
  if (twisterCanvas) {
    twisterCanvas.width = twisterCanvas.clientWidth;
    twisterCanvas.height = twisterCanvas.clientHeight;
  }
});
