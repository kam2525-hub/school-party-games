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
    case 'hockey':
      showScreen('screen-hockey');
      initHockeyGame();
      break;
    case 'rps':
      showScreen('screen-rps');
      initRpsGame();
      break;
    case 'knife':
      showScreen('screen-knife');
      initKnifeGame();
      break;
    case 'color':
      showScreen('screen-color');
      initColorGame();
      break;
    case 'space':
      showScreen('screen-space');
      initSpaceGame();
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
  if (hockeyCanvas) {
    hockeyCanvas.width = hockeyCanvas.clientWidth;
    hockeyCanvas.height = hockeyCanvas.clientHeight;
  }
  if (knifeCanvas) {
    knifeCanvas.width = knifeCanvas.clientWidth;
    knifeCanvas.height = knifeCanvas.clientHeight;
  }
  if (spaceCanvas) {
    spaceCanvas.width = spaceCanvas.clientWidth;
    spaceCanvas.height = spaceCanvas.clientHeight;
  }
});

/* ============================================================
   6. エアホッケー (Air Hockey)
   ============================================================ */
let hockeyCanvas, hockeyCtx;
let hockeyScore1 = 0, hockeyScore2 = 0;
let hockeyP1 = { x: 0, y: 0, radius: 28 };
let hockeyP2 = { x: 0, y: 0, radius: 28 };
let hockeyPuck = { x: 0, y: 0, vx: 0, vy: 0, radius: 18 };
let isHockeyRunning = false;

function initHockeyGame() {
  hockeyCanvas = document.getElementById('hockey-canvas');
  hockeyCtx = hockeyCanvas.getContext('2d');
  hockeyCanvas.width = hockeyCanvas.clientWidth;
  hockeyCanvas.height = hockeyCanvas.clientHeight;

  hockeyScore1 = 0;
  hockeyScore2 = 0;
  isHockeyRunning = true;

  resetHockeyPositions();

  hockeyCanvas.ontouchstart = handleHockeyTouch;
  hockeyCanvas.ontouchmove = handleHockeyTouch;

  requestAnimationFrame(hockeyLoop);
}

function resetHockeyPositions() {
  const w = hockeyCanvas.width;
  const h = hockeyCanvas.height;

  hockeyP1 = { x: w / 2, y: h * 0.2, radius: 30 };
  hockeyP2 = { x: w / 2, y: h * 0.8, radius: 30 };
  hockeyPuck = { x: w / 2, y: h / 2, vx: (Math.random() - 0.5) * 4, vy: Math.random() > 0.5 ? 4 : -4, radius: 18 };
}

function handleHockeyTouch(e) {
  e.preventDefault();
  if (!isHockeyRunning) return;

  const rect = hockeyCanvas.getBoundingClientRect();
  const midY = hockeyCanvas.height / 2;

  for (let i = 0; i < e.touches.length; i++) {
    const t = e.touches[i];
    const tx = t.clientX - rect.left;
    const ty = t.clientY - rect.top;

    if (ty < midY) {
      // P1側
      hockeyP1.x = Math.max(hockeyP1.radius, Math.min(hockeyCanvas.width - hockeyP1.radius, tx));
      hockeyP1.y = Math.max(hockeyP1.radius, Math.min(midY - hockeyP1.radius, ty));
    } else {
      // P2側
      hockeyP2.x = Math.max(hockeyP2.radius, Math.min(hockeyCanvas.width - hockeyP2.radius, tx));
      hockeyP2.y = Math.max(midY + hockeyP2.radius, Math.min(hockeyCanvas.height - hockeyP2.radius, ty));
    }
  }
}

function hockeyLoop() {
  if (currentScreen !== 'screen-hockey' || !isHockeyRunning) return;

  const ctx = hockeyCtx;
  const w = hockeyCanvas.width;
  const h = hockeyCanvas.height;
  const goalWidth = w * 0.45;
  const goalLeft = (w - goalWidth) / 2;
  const goalRight = goalLeft + goalWidth;

  // 移動・減衰
  hockeyPuck.x += hockeyPuck.vx;
  hockeyPuck.y += hockeyPuck.vy;
  hockeyPuck.vx *= 0.992;
  hockeyPuck.vy *= 0.992;

  // 左右壁反射
  if (hockeyPuck.x - hockeyPuck.radius <= 0) {
    hockeyPuck.x = hockeyPuck.radius;
    hockeyPuck.vx = -hockeyPuck.vx;
    window.sounds.playTap();
  } else if (hockeyPuck.x + hockeyPuck.radius >= w) {
    hockeyPuck.x = w - hockeyPuck.radius;
    hockeyPuck.vx = -hockeyPuck.vx;
    window.sounds.playTap();
  }

  // 上下壁 & ゴール判定
  if (hockeyPuck.y - hockeyPuck.radius <= 0) {
    if (hockeyPuck.x >= goalLeft && hockeyPuck.x <= goalRight) {
      // P2のゴール（P1陣地に突入）！
      hockeyScore2++;
      window.sounds.playSuccess();
      checkHockeyWinner();
      resetHockeyPositions();
    } else {
      hockeyPuck.y = hockeyPuck.radius;
      hockeyPuck.vy = -hockeyPuck.vy;
      window.sounds.playTap();
    }
  } else if (hockeyPuck.y + hockeyPuck.radius >= h) {
    if (hockeyPuck.x >= goalLeft && hockeyPuck.x <= goalRight) {
      // P1のゴール（P2陣地に突入）！
      hockeyScore1++;
      window.sounds.playSuccess();
      checkHockeyWinner();
      resetHockeyPositions();
    } else {
      hockeyPuck.y = h - hockeyPuck.radius;
      hockeyPuck.vy = -hockeyPuck.vy;
      window.sounds.playTap();
    }
  }

  // パドルとの衝突
  [hockeyP1, hockeyP2].forEach(p => {
    const dx = hockeyPuck.x - p.x;
    const dy = hockeyPuck.y - p.y;
    const dist = Math.hypot(dx, dy);
    const minDist = hockeyPuck.radius + p.radius;

    if (dist < minDist) {
      const angle = Math.atan2(dy, dx);
      hockeyPuck.x = p.x + Math.cos(angle) * minDist;
      hockeyPuck.y = p.y + Math.sin(angle) * minDist;

      const speed = Math.max(8, Math.min(18, Math.hypot(hockeyPuck.vx, hockeyPuck.vy) * 1.1 + 4));
      hockeyPuck.vx = Math.cos(angle) * speed;
      hockeyPuck.vy = Math.sin(angle) * speed;
      window.sounds.playTap();
    }
  });

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // センターライン・サークル
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
  ctx.stroke();

  // ゴールエリア
  ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.fillRect(goalLeft, 0, goalWidth, 12);
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.fillRect(goalLeft, h - 12, goalWidth, 12);

  // スコア表示
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText(hockeyScore1, 40, h / 2 - 30);

  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
  ctx.fillText(hockeyScore2, 40, h / 2 + 55);

  // パドル P1 (赤)
  ctx.beginPath();
  ctx.arc(hockeyP1.x, hockeyP1.y, hockeyP1.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // パドル P2 (青)
  ctx.beginPath();
  ctx.arc(hockeyP2.x, hockeyP2.y, hockeyP2.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.stroke();

  // パック (黄色)
  ctx.beginPath();
  ctx.arc(hockeyPuck.x, hockeyPuck.y, hockeyPuck.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  requestAnimationFrame(hockeyLoop);
}

function checkHockeyWinner() {
  if (hockeyScore1 >= 3 || hockeyScore2 >= 3) {
    isHockeyRunning = false;
    const winner = hockeyScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🎉 ${winner} の勝利！`, `3点先取でエアホッケーを制しました！`, () => {
      initHockeyGame();
    });
  }
}

/* ============================================================
   7. スピードじゃんけん (Speed RPS)
   ============================================================ */
let rpsScore1 = 0, rpsScore2 = 0;
let rpsTargetHand = 'rock'; // 'rock', 'scissors', 'paper'
let rpsInstruction = 'win'; // 'win' (勝て), 'lose' (負けろ)
let rpsRoundResolved = false;

const RPS_EMOJI = { rock: '✊', scissors: '✌️', paper: '🖐️' };
const RPS_WINS_AGAINST = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
const RPS_LOSES_AGAINST = { rock: 'paper', scissors: 'rock', paper: 'scissors' };

function initRpsGame() {
  rpsScore1 = 0;
  rpsScore2 = 0;
  updateRpsUI();
  nextRpsRound();
}

function updateRpsUI() {
  document.getElementById('rps-score-p1').textContent = rpsScore1;
  document.getElementById('rps-score-p2').textContent = rpsScore2;
}

function nextRpsRound() {
  rpsRoundResolved = false;
  const hands = ['rock', 'scissors', 'paper'];
  rpsTargetHand = hands[Math.floor(Math.random() * hands.length)];
  rpsInstruction = Math.random() < 0.5 ? 'win' : 'lose';

  document.getElementById('rps-target-hand').textContent = RPS_EMOJI[rpsTargetHand];
  const instElem = document.getElementById('rps-instruction');
  instElem.textContent = rpsInstruction === 'win' ? '勝て！🔥' : '負けろ！🌀';
  instElem.style.color = rpsInstruction === 'win' ? '#ef4444' : '#3b82f6';
}

function handleRpsChoice(player, chosenHand) {
  if (rpsRoundResolved) return;

  const correctHand = rpsInstruction === 'win' 
    ? RPS_LOSES_AGAINST[rpsTargetHand] // 相手の手(target)に勝つ手
    : RPS_WINS_AGAINST[rpsTargetHand]; // 相手の手(target)に負ける手

  if (chosenHand === correctHand) {
    // 正解！
    rpsRoundResolved = true;
    window.sounds.playSuccess();
    if (player === 1) rpsScore1++; else rpsScore2++;
    updateRpsUI();

    if (rpsScore1 >= 5 || rpsScore2 >= 5) {
      const winner = rpsScore1 >= 5 ? 'プレイヤー 1' : 'プレイヤー 2';
      setTimeout(() => {
        showModal(`🏆 ${winner} の勝利！`, `圧倒的な瞬発力でじゃんけんバトルを制覇！`, () => {
          initRpsGame();
        });
      }, 500);
    } else {
      setTimeout(nextRpsRound, 800);
    }
  } else {
    // 不正解！
    window.sounds.playError();
    const other = player === 1 ? 2 : 1;
    if (other === 1) rpsScore1++; else rpsScore2++;
    updateRpsUI();
    rpsRoundResolved = true;
    setTimeout(nextRpsRound, 800);
  }
}

/* ============================================================
   8. ナイフスロー (Knife Hit Battle)
   ============================================================ */
let knifeCanvas, knifeCtx;
let knifeTargetAngle = 0;
let knifeKnives = []; // { angle, player }
let knifeFlying = null; // { x, y, vy, player }
let knifeKnivesP1 = 5;
let knifeKnivesP2 = 5;
let isKnifeRunning = false;

function initKnifeGame() {
  knifeCanvas = document.getElementById('knife-canvas');
  knifeCtx = knifeCanvas.getContext('2d');
  knifeCanvas.width = knifeCanvas.clientWidth;
  knifeCanvas.height = knifeCanvas.clientHeight;

  knifeTargetAngle = 0;
  knifeKnives = [];
  knifeFlying = null;
  knifeKnivesP1 = 5;
  knifeKnivesP2 = 5;
  isKnifeRunning = true;

  knifeCanvas.onpointerdown = handleKnifeShoot;
  requestAnimationFrame(knifeLoop);
}

function handleKnifeShoot(e) {
  e.preventDefault();
  if (!isKnifeRunning || knifeFlying) return;

  const rect = knifeCanvas.getBoundingClientRect();
  const y = (e.clientY - rect.top);
  const midY = knifeCanvas.height / 2;

  if (y < midY && knifeKnivesP1 > 0) {
    // P1 (上から下へ発射)
    knifeKnivesP1--;
    knifeFlying = { x: knifeCanvas.width / 2, y: 60, vy: 18, player: 1 };
    window.sounds.playTap();
  } else if (y >= midY && knifeKnivesP2 > 0) {
    // P2 (下から上へ発射)
    knifeKnivesP2--;
    knifeFlying = { x: knifeCanvas.width / 2, y: knifeCanvas.height - 60, vy: -18, player: 2 };
    window.sounds.playTap();
  }
}

function knifeLoop() {
  if (currentScreen !== 'screen-knife' || !isKnifeRunning) return;

  const ctx = knifeCtx;
  const w = knifeCanvas.width;
  const h = knifeCanvas.height;
  const targetRadius = 55;
  const centerX = w / 2;
  const centerY = h / 2;

  // 的の回転
  knifeTargetAngle += 0.035;

  // 飛行中ナイフの処理
  if (knifeFlying) {
    knifeFlying.y += knifeFlying.vy;

    const dist = Math.abs(knifeFlying.y - centerY);
    if (dist <= targetRadius + 10) {
      // 的に到達！
      const hitAngle = (knifeFlying.player === 1 ? -Math.PI / 2 : Math.PI / 2) - knifeTargetAngle;

      // 既存のナイフと衝突していないかチェック
      let collision = false;
      for (const k of knifeKnives) {
        const diff = Math.abs((k.angle - hitAngle + Math.PI * 4) % (Math.PI * 2));
        if (diff < 0.22 || diff > Math.PI * 2 - 0.22) {
          collision = true;
          break;
        }
      }

      if (collision) {
        // 刃に激突！負け！
        isKnifeRunning = false;
        window.sounds.playGunshot();
        const winner = knifeFlying.player === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
        showModal(`💥 ナイフが弾かれた！`, `${winner} の勝利！刃に直撃してしまいました！`, () => {
          initKnifeGame();
        });
        return;
      } else {
        // 成功！突き刺さる
        knifeKnives.push({ angle: hitAngle, player: knifeFlying.player });
        window.sounds.playTap();
        knifeFlying = null;

        // 全弾刺し終えたかチェック
        if (knifeKnivesP1 === 0 && knifeKnivesP2 === 0) {
          isKnifeRunning = false;
          window.sounds.playSuccess();
          showModal('🎉 引き分け！見事な命中率！', '両者ともすべてのナイフを刺しきりました！', () => {
            initKnifeGame();
          });
          return;
        }
      }
    }
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // プレイヤー残弾表示
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'left';
  ctx.fillText(`P1 残り: ${knifeKnivesP1}本`, 20, 36);

  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2 残り: ${knifeKnivesP2}本`, 20, h - 24);

  // 的 (木製風の円)
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(knifeTargetAngle);

  ctx.beginPath();
  ctx.arc(0, 0, targetRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#b45309';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#78350f';
  ctx.stroke();

  // 的の内側の年輪
  ctx.beginPath();
  ctx.arc(0, 0, targetRadius * 0.6, 0, Math.PI * 2);
  ctx.stroke();

  // 刺さったナイフの描画
  knifeKnives.forEach(k => {
    ctx.save();
    ctx.rotate(k.angle);
    ctx.fillStyle = k.player === 1 ? '#ef4444' : '#3b82f6';
    ctx.fillRect(-4, targetRadius, 8, 30);
    ctx.restore();
  });

  ctx.restore();

  // 飛行中ナイフ
  if (knifeFlying) {
    ctx.fillStyle = knifeFlying.player === 1 ? '#ef4444' : '#3b82f6';
    ctx.fillRect(knifeFlying.x - 4, knifeFlying.y - 15, 8, 30);
  }

  requestAnimationFrame(knifeLoop);
}

/* ============================================================
   9. カラーブレイン (Color Stroop Duel)
   ============================================================ */
let colorScore1 = 0, colorScore2 = 0;
let colorRoundResolved = false;
let colorCurrentMatch = false;

const COLOR_SET = [
  { name: 'あか', code: '#ef4444' },
  { name: 'あお', code: '#3b82f6' },
  { name: 'きいろ', code: '#eab308' },
  { name: 'みどり', code: '#10b981' }
];

function initColorGame() {
  colorScore1 = 0;
  colorScore2 = 0;
  updateColorUI();
  nextColorRound();
}

function updateColorUI() {
  document.getElementById('color-score-p1').textContent = colorScore1;
  document.getElementById('color-score-p2').textContent = colorScore2;
}

function nextColorRound() {
  colorRoundResolved = false;
  colorCurrentMatch = Math.random() < 0.5;

  const wordItem = COLOR_SET[Math.floor(Math.random() * COLOR_SET.length)];
  let colorItem;
  if (colorCurrentMatch) {
    colorItem = wordItem;
  } else {
    const others = COLOR_SET.filter(c => c.name !== wordItem.name);
    colorItem = others[Math.floor(Math.random() * others.length)];
  }

  const wordElem = document.getElementById('color-word');
  wordElem.textContent = wordItem.name;
  wordElem.style.color = colorItem.code;
}

function handleColorAnswer(player, answer) {
  if (colorRoundResolved) return;

  if (answer === colorCurrentMatch) {
    // 正解！
    colorRoundResolved = true;
    window.sounds.playSuccess();
    if (player === 1) colorScore1++; else colorScore2++;
    updateColorUI();

    if (colorScore1 >= 4 || colorScore2 >= 4) {
      const winner = colorScore1 >= 4 ? 'プレイヤー 1' : 'プレイヤー 2';
      setTimeout(() => {
        showModal(`🧠 ${winner} の勝利！`, `見事な脳の回転でカラーマッチを制しました！`, () => {
          initColorGame();
        });
      }, 500);
    } else {
      setTimeout(nextColorRound, 700);
    }
  } else {
    // 間違い！
    window.sounds.playError();
    colorRoundResolved = true;
    const other = player === 1 ? 2 : 1;
    if (other === 1) colorScore1++; else colorScore2++;
    updateColorUI();
    setTimeout(nextColorRound, 700);
  }
}

/* ============================================================
   10. スペースドッジ (Space Asteroid Dodge)
   ============================================================ */
let spaceCanvas, spaceCtx;
let spaceShip1 = { x: 0, y: 0, radius: 20 };
let spaceShip2 = { x: 0, y: 0, radius: 20 };
let spaceAsteroids = [];
let isSpaceRunning = false;
let spaceSpeed = 3.5;

function initSpaceGame() {
  spaceCanvas = document.getElementById('space-canvas');
  spaceCtx = spaceCanvas.getContext('2d');
  spaceCanvas.width = spaceCanvas.clientWidth;
  spaceCanvas.height = spaceCanvas.clientHeight;

  const w = spaceCanvas.width;
  const h = spaceCanvas.height;

  // 左半分がP1、右半分がP2
  spaceShip1 = { x: w * 0.25, y: h - 60, radius: 22 };
  spaceShip2 = { x: w * 0.75, y: h - 60, radius: 22 };
  spaceAsteroids = [];
  spaceSpeed = 3.5;
  isSpaceRunning = true;

  spaceCanvas.ontouchstart = handleSpaceTouch;
  spaceCanvas.ontouchmove = handleSpaceTouch;

  requestAnimationFrame(spaceLoop);
}

function handleSpaceTouch(e) {
  e.preventDefault();
  if (!isSpaceRunning) return;

  const rect = spaceCanvas.getBoundingClientRect();
  const midX = spaceCanvas.width / 2;

  for (let i = 0; i < e.touches.length; i++) {
    const t = e.touches[i];
    const tx = t.clientX - rect.left;
    if (tx < midX) {
      spaceShip1.x = Math.max(spaceShip1.radius, Math.min(midX - spaceShip1.radius, tx));
    } else {
      spaceShip2.x = Math.max(midX + spaceShip2.radius, Math.min(spaceCanvas.width - spaceShip2.radius, tx));
    }
  }
}

function spaceLoop() {
  if (currentScreen !== 'screen-space' || !isSpaceRunning) return;

  const ctx = spaceCtx;
  const w = spaceCanvas.width;
  const h = spaceCanvas.height;
  const midX = w / 2;

  spaceSpeed += 0.001; // 徐々にスピードアップ

  // 隕石の定期生成
  if (Math.random() < 0.08) {
    // P1側
    spaceAsteroids.push({
      x: 20 + Math.random() * (midX - 40),
      y: -20,
      radius: 14 + Math.random() * 12,
      vy: spaceSpeed + Math.random() * 2
    });
    // P2側
    spaceAsteroids.push({
      x: midX + 20 + Math.random() * (midX - 40),
      y: -20,
      radius: 14 + Math.random() * 12,
      vy: spaceSpeed + Math.random() * 2
    });
  }

  // 描画
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  // 中央の仕切り
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(midX, 0);
  ctx.lineTo(midX, h);
  ctx.stroke();

  // ラベル
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.fillText('🔴 プレイヤー 1', midX / 2, 30);

  ctx.fillStyle = '#3b82f6';
  ctx.fillText('🔵 プレイヤー 2', midX + midX / 2, 30);

  // 隕石の更新と判定
  let hitPlayer = null;
  for (let i = spaceAsteroids.length - 1; i >= 0; i--) {
    const a = spaceAsteroids[i];
    a.y += a.vy;

    // 衝突判定
    const targetShip = a.x < midX ? spaceShip1 : spaceShip2;
    const playerNum = a.x < midX ? 1 : 2;
    const dist = Math.hypot(a.x - targetShip.x, a.y - targetShip.y);

    if (dist < a.radius + targetShip.radius) {
      hitPlayer = playerNum;
    }

    // 描画
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#64748b';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    if (a.y > h + 30) {
      spaceAsteroids.splice(i, 1);
    }
  }

  // 自機描画 (三角宇宙船)
  [ { ship: spaceShip1, color: '#ef4444' }, { ship: spaceShip2, color: '#3b82f6' } ].forEach(({ ship, color }) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.beginPath();
    ctx.moveTo(0, -ship.radius);
    ctx.lineTo(-ship.radius * 0.8, ship.radius);
    ctx.lineTo(ship.radius * 0.8, ship.radius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  });

  if (hitPlayer && isSpaceRunning) {
    isSpaceRunning = false;
    window.sounds.playExplosion();
    const winner = hitPlayer === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
    showModal(`💥 撃墜！`, `${winner} の勝利！小惑星を最後まで回避しきりました！`, () => {
      initSpaceGame();
    });
    return;
  }

  requestAnimationFrame(spaceLoop);
}

