// スマホのノッチやホームボタン（🏠）との重複を防ぐ上部セーフマージン計算
function getTopSafeY() {
  const probe = document.getElementById('safe-area-probe');
  const safeTop = (probe && probe.offsetTop) ? probe.offsetTop : 0;
  return Math.max(76, safeTop + 54);
}

// 対面P1（上側プレイヤー）向けに180度反転してテキストを描画するヘルパー
function drawP1Text(ctx, text, x, y, font = 'bold 20px sans-serif', color = '#ef4444', align = 'left') {
  ctx.save();
  const w = ctx.canvas.width;
  ctx.translate(w - x, y);
  ctx.rotate(Math.PI);
  if (font) ctx.font = font;
  if (color) ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

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

// カテゴリフィルター
function filterCategory(cat, targetBtn) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const btn = targetBtn || (window.event ? window.event.target : null);
  if (btn && btn.classList) {
    btn.classList.add('active');
  }

  const cards = document.querySelectorAll('#game-grid .game-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    const cats = cardCat.split(/\s+/);
    if (cat === 'all' || cats.includes(cat)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
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
    case 'pong':
      showScreen('screen-pong');
      initPongGame();
      break;
    case 'penalty':
      showScreen('screen-penalty');
      initPenaltyGame();
      break;
    case 'racer':
      showScreen('screen-racer');
      initRacerGame();
      break;
    case 'lumber':
      showScreen('screen-lumber');
      initLumberGame();
      break;
    case 'jump':
      showScreen('screen-jump');
      initJumpGame();
      break;
    case 'numbers':
      showScreen('screen-numbers');
      initNumbersGame();
      break;
    case 'fishing':
      showScreen('screen-fishing');
      initFishingGame();
      break;
    case 'slash':
      showScreen('screen-slash');
      initSlashGame();
      break;
    case 'highlow':
      showScreen('screen-highlow');
      initHighLowGame();
      break;
    case 'tank':
      showScreen('screen-tank');
      initTankGame();
      break;
    case 'basket':
      showScreen('screen-basket');
      initBasketGame();
      break;
    case 'darts':
      showScreen('screen-darts');
      initDartsGame();
      break;
    case 'rope':
      showScreen('screen-rope');
      initRopeGame();
      break;
    case 'breakout':
      showScreen('screen-breakout');
      initBreakoutGame();
      break;
    case 'ufo':
      showScreen('screen-ufo');
      initUfoGame();
      break;
    case 'boxing':
      showScreen('screen-boxing');
      initBoxingGame();
      break;
    case 'highway':
      showScreen('screen-highway');
      initHighwayGame();
      break;
    case 'rhythm':
      showScreen('screen-rhythm');
      initRhythmGame();
      break;
    case 'mines':
      showScreen('screen-mines');
      initMinesGame();
      break;
    case 'archery':
      showScreen('screen-archery');
      initArcheryGame();
      break;
    case 'cricket':
      showScreen('screen-cricket');
      initCricketGame();
      break;
    case 'hurdle':
      showScreen('screen-hurdle');
      initHurdleGame();
      break;
    case 'snake':
      showScreen('screen-snake');
      initSnakeGame();
      break;
    case 'invaders':
      showScreen('screen-invaders');
      initInvadersGame();
      break;
    case 'curling':
      showScreen('screen-curling');
      initCurlingGame();
      break;
    case 'memory':
      showScreen('screen-memory');
      initMemoryGame();
      break;
    case 'skate':
      showScreen('screen-skate');
      initSkateGame();
      break;
    case 'catch':
      showScreen('screen-catch');
      initCatchGame();
      break;
    case 'blocktennis':
      showScreen('screen-blocktennis');
      initBlockTennisGame();
      break;
    case 'seesaw':
      showScreen('screen-seesaw');
      initSeesawGame();
      break;
    case 'bowling':
      showScreen('screen-bowling');
      initBowlingGame();
      break;
    case 'dribble':
      showScreen('screen-dribble');
      initDribbleGame();
      break;
    case 'gravity':
      showScreen('screen-gravity');
      initGravityGame();
      break;
    case 'axe':
      showScreen('screen-axe');
      initAxeGame();
      break;
    case 'balloon':
      showScreen('screen-balloon');
      initBalloonGame();
      break;
    case 'arm':
      showScreen('screen-arm');
      initArmGame();
      break;
    case 'pitstop':
      showScreen('screen-pitstop');
      initPitstopGame();
      break;
    case 'laser':
      showScreen('screen-laser');
      initLaserGame();
      break;
    case 'pogo':
      showScreen('screen-pogo');
      initPogoGame();
      break;
    case 'fencing':
      showScreen('screen-fencing');
      initFencingGame();
      break;
    case 'stealthlunch':
      showScreen('screen-stealthlunch');
      initStealthLunchGame();
      break;
    case 'eraser':
      showScreen('screen-eraser');
      initEraserGame();
      break;
    case 'edgestopper':
      showScreen('screen-edgestopper');
      initEdgeStopperGame();
      break;
    case 'whackamole':
      showScreen('screen-whackamole');
      initWhackAMoleGame();
      break;
    case 'stopwatch':
      showScreen('screen-stopwatch');
      initStopwatchGame();
      break;
    case 'zombie':
      showScreen('screen-zombie');
      initZombieGame();
      break;
    case 'cointoss':
      showScreen('screen-cointoss');
      initCoinTossGame();
      break;
    case 'crane':
      showScreen('screen-crane');
      initCraneGame();
      break;
    case 'electricwire':
      showScreen('screen-electricwire');
      initElectricWireGame();
      break;
    case 'suikadrop':
      showScreen('screen-suikadrop');
      initSuikaDropGame();
      break;
    case 'snooze':
      showScreen('screen-snooze');
      initSnoozeGame();
      break;
    case 'ruler':
      showScreen('screen-ruler');
      initRulerGame();
      break;
    case 'flipbook':
      showScreen('screen-flipbook');
      initFlipbookGame();
      break;
    case 'paperplane':
      showScreen('screen-paperplane');
      initPaperPlaneGame();
      break;
    case 'thumbsumo':
      showScreen('screen-thumbsumo');
      initThumbSumoGame();
      break;
    case 'cupshuffle':
      showScreen('screen-cupshuffle');
      initCupShuffleGame();
      break;
    case 'uforescue':
      showScreen('screen-uforescue');
      initUfoRescueGame();
      break;
    case 'pinball':
      showScreen('screen-pinball');
      initPinballGame();
      break;
    case 'hockeyshot':
      showScreen('screen-hockeyshot');
      initHockeyShotGame();
      break;
    case 'goldfish':
      showScreen('screen-goldfish');
      initGoldfishGame();
      break;
    case 'chalkdust':
      showScreen('screen-chalkdust');
      initChalkDustGame();
      break;
    case 'rubberband':
      showScreen('screen-rubberband');
      initRubberBandGame();
      break;
    case 'booktower':
      showScreen('screen-booktower');
      initBookTowerGame();
      break;
    case 'penspin':
      showScreen('screen-penspin');
      initPenSpinGame();
      break;
    case 'deskcurling':
      showScreen('screen-deskcurling');
      initDeskCurlingGame();
      break;
    case 'calculator':
      showScreen('screen-calculator');
      initCalculatorGame();
      break;
    case 'lunchbread':
      showScreen('screen-lunchbread');
      initLunchBreadGame();
      break;
    case 'eyedrops':
      showScreen('screen-eyedrops');
      initEyeDropsGame();
      break;
    case 'doubledutch':
      showScreen('screen-doubledutch');
      initDoubleDutchGame();
      break;
    case 'rocketlaunch':
      showScreen('screen-rocketlaunch');
      initRocketLaunchGame();
      break;
    case 'stationery_merge':
      showScreen('screen-stationery_merge');
      initStationeryMergeGame();
      break;
    case 'camo_sheet':
      showScreen('screen-camo_sheet');
      initCamoSheetGame();
      break;
    case 'wordle_jp':
      showScreen('screen-wordle_jp');
      initWordleJpGame();
      break;
    case 'school_typing':
      showScreen('screen-school_typing');
      initSchoolTypingGame();
      break;
    case 'board_clicker':
      showScreen('screen-board_clicker');
      initBoardClickerGame();
      break;
    case 'time_reflex':
      showScreen('screen-time_reflex');
      initTimeReflexGame();
      break;
    case 'ultimate_choice':
      showScreen('screen-ultimate_choice');
      initUltimateChoiceGame();
      break;
    case 'seat_shuffle':
      showScreen('screen-seat_shuffle');
      initSeatShuffleGame();
      break;
    case 'drawing_quiz':
      showScreen('screen-drawing_quiz');
      initDrawingQuizGame();
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
  ctx.font = 'bold 15px sans-serif';
  drawP1Text(ctx, '🔴 P1 エリア (指を離すな！)', w / 2, getTopSafeY(), 'bold 20px sans-serif', '#ef4444', 'center');

  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('🔵 P2 エリア (指を離すな！)', w / 2, h - 20);

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
    if (tg.player === 1) {
      drawP1Text(ctx, 'P1 指', w - tg.x, tg.y, 'bold 14px sans-serif', '#ffffff', 'center');
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P2 指', tg.x, tg.y);
    }
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
  [
    twisterCanvas, hockeyCanvas, knifeCanvas, spaceCanvas,
    pongCanvas, penaltyCanvas, racerCanvas, lumberCanvas,
    jumpCanvas, fishingCanvas, slashCanvas, tankCanvas,
    basketCanvas, dartsCanvas, ropeCanvas, breakoutCanvas,
    ufoCanvas, boxingCanvas, highwayCanvas, rhythmCanvas, archeryCanvas,
    cricketCanvas, hurdleCanvas, snakeCanvas, invadersCanvas,
    curlingCanvas, skateCanvas, catchCanvas, blocktennisCanvas, seesawCanvas,
    bowlingCanvas, dribbleCanvas, gravityCanvas, axeCanvas,
    balloonCanvas, armCanvas, pitstopCanvas, laserCanvas, pogoCanvas, fencingCanvas
  ].forEach(c => {
    if (c) {
      c.width = c.clientWidth;
      c.height = c.clientHeight;
    }
  });
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
      hockeyP1.y = Math.max(getTopSafeY() - 25, Math.min(midY - hockeyP1.radius, ty));
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

  // スコア表示（P1は対面向きに180度回転、P2は通常向き）
  ctx.save();
  ctx.translate(w - 40, h / 2 - 35);
  ctx.rotate(Math.PI);
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hockeyScore1, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(40, h / 2 + 35);
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hockeyScore2, 0, 0);
  ctx.restore();

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
    knifeFlying = { x: knifeCanvas.width / 2, y: getTopSafeY(), vy: 18, player: 1 };
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
  drawP1Text(ctx, `P1 残り: ${knifeKnivesP1}本`, 58, getTopSafeY(), 'bold 20px sans-serif', '#ef4444');

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'left';
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
let spaceShip1, spaceShip2;
let spaceAsteroids1 = [], spaceAsteroids2 = [];
let spaceSpeed = 3.2;
let isSpaceRunning = false;

function initSpaceGame() {
  spaceCanvas = document.getElementById('space-canvas');
  spaceCtx = spaceCanvas.getContext('2d');
  spaceCanvas.width = spaceCanvas.clientWidth;
  spaceCanvas.height = spaceCanvas.clientHeight;

  const w = spaceCanvas.width;
  const h = spaceCanvas.height;
  const topY = getTopSafeY();

  // 対面配置: P1は上部(下向き)、P2は下部(上向き)
  spaceShip1 = { x: w / 2, y: topY + 45, radius: 22 };
  spaceShip2 = { x: w / 2, y: h - 55, radius: 22 };
  spaceAsteroids1 = [];
  spaceAsteroids2 = [];
  spaceSpeed = 3.2;
  isSpaceRunning = true;

  const handleSpaceMultiTouch = (e) => {
    e.preventDefault();
    if (!isSpaceRunning) return;
    const rect = spaceCanvas.getBoundingClientRect();
    const touches = e.touches ? Array.from(e.touches) : [e];
    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      const tx = t.clientX - rect.left;
      const ty = t.clientY - rect.top;
      if (ty < h / 2) {
        // P1: 上半分 (左右反転: P1から見て直感的)
        spaceShip1.x = Math.max(spaceShip1.radius + 10, Math.min(w - spaceShip1.radius - 10, tx));
      } else {
        // P2: 下半分
        spaceShip2.x = Math.max(spaceShip2.radius + 10, Math.min(w - spaceShip2.radius - 10, tx));
      }
    }
  };

  spaceCanvas.onpointerdown = handleSpaceMultiTouch;
  spaceCanvas.onpointermove = handleSpaceMultiTouch;
  spaceCanvas.ontouchstart = handleSpaceMultiTouch;
  spaceCanvas.ontouchmove = handleSpaceMultiTouch;

  requestAnimationFrame(spaceLoop);
}

function spaceLoop() {
  if (currentScreen !== 'screen-space' || !isSpaceRunning) return;

  const ctx = spaceCtx;
  const w = spaceCanvas.width;
  const h = spaceCanvas.height;
  const midY = h / 2;
  const topY = getTopSafeY();

  spaceSpeed += 0.0015;

  // 隕石生成: 中央から外側へ迫る
  if (Math.random() < 0.08) {
    // P1側: 中央から上へ迫る
    spaceAsteroids1.push({
      x: 25 + Math.random() * (w - 50),
      y: midY - 10,
      radius: 13 + Math.random() * 11,
      vy: -(spaceSpeed + Math.random() * 1.8)
    });
    // P2側: 中央から下へ迫る
    spaceAsteroids2.push({
      x: 25 + Math.random() * (w - 50),
      y: midY + 10,
      radius: 13 + Math.random() * 11,
      vy: spaceSpeed + Math.random() * 1.8
    });
  }

  // 描画
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, w, h);

  // 中央の仕切り
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(w, midY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: スライドして小惑星を回避！', w / 2, topY + 16, 'bold 14px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: スライドして小惑星を回避！', w / 2, h - 30);

  let hitPlayer = null;

  // P1 隕石更新
  for (let i = spaceAsteroids1.length - 1; i >= 0; i--) {
    const a = spaceAsteroids1[i];
    a.y += a.vy;
    if (Math.hypot(a.x - spaceShip1.x, a.y - spaceShip1.y) < a.radius + spaceShip1.radius) {
      hitPlayer = 1;
    }
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (a.y < topY - 30) spaceAsteroids1.splice(i, 1);
  }

  // P2 隕石更新
  for (let i = spaceAsteroids2.length - 1; i >= 0; i--) {
    const a = spaceAsteroids2[i];
    a.y += a.vy;
    if (Math.hypot(a.x - spaceShip2.x, a.y - spaceShip2.y) < a.radius + spaceShip2.radius) {
      hitPlayer = 2;
    }
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (a.y > h + 30) spaceAsteroids2.splice(i, 1);
  }

  // P1 自機 (下向きに回転)
  ctx.save();
  ctx.translate(spaceShip1.x, spaceShip1.y);
  ctx.rotate(Math.PI);
  ctx.beginPath();
  ctx.moveTo(0, -spaceShip1.radius);
  ctx.lineTo(-spaceShip1.radius * 0.8, spaceShip1.radius);
  ctx.lineTo(spaceShip1.radius * 0.8, spaceShip1.radius);
  ctx.closePath();
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();

  // P2 自機 (上向き)
  ctx.save();
  ctx.translate(spaceShip2.x, spaceShip2.y);
  ctx.beginPath();
  ctx.moveTo(0, -spaceShip2.radius);
  ctx.lineTo(-spaceShip2.radius * 0.8, spaceShip2.radius);
  ctx.lineTo(spaceShip2.radius * 0.8, spaceShip2.radius);
  ctx.closePath();
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();

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

/* ============================================================
   11. ピンポン・ラリー (Pong Rally)
   ============================================================ */
let pongCanvas, pongCtx;
let pongP1 = { x: 0, width: 80, height: 14 };
let pongP2 = { x: 0, width: 80, height: 14 };
let pongBall = { x: 0, y: 0, vx: 0, vy: 0, radius: 10, speed: 6 };
let pongScore1 = 0, pongScore2 = 0;
let isPongRunning = false;

function initPongGame() {
  pongCanvas = document.getElementById('pong-canvas');
  pongCtx = pongCanvas.getContext('2d');
  pongCanvas.width = pongCanvas.clientWidth;
  pongCanvas.height = pongCanvas.clientHeight;

  pongScore1 = 0;
  pongScore2 = 0;
  isPongRunning = true;

  resetPongBall();
  pongCanvas.ontouchstart = handlePongTouch;
  pongCanvas.ontouchmove = handlePongTouch;

  requestAnimationFrame(pongLoop);
}

function resetPongBall() {
  const w = pongCanvas.width;
  const h = pongCanvas.height;
  pongP1.x = (w - pongP1.width) / 2;
  pongP2.x = (w - pongP2.width) / 2;
  pongBall = {
    x: w / 2,
    y: h / 2,
    vx: (Math.random() > 0.5 ? 1 : -1) * 3.5,
    vy: (Math.random() > 0.5 ? 1 : -1) * 4.5,
    radius: 10,
    speed: 5.5
  };
}

function handlePongTouch(e) {
  e.preventDefault();
  if (!isPongRunning) return;
  const rect = pongCanvas.getBoundingClientRect();
  const midY = pongCanvas.height / 2;

  for (let i = 0; i < e.touches.length; i++) {
    const t = e.touches[i];
    const tx = t.clientX - rect.left;
    const ty = t.clientY - rect.top;

    if (ty < midY) {
      pongP1.x = Math.max(0, Math.min(pongCanvas.width - pongP1.width, tx - pongP1.width / 2));
    } else {
      pongP2.x = Math.max(0, Math.min(pongCanvas.width - pongP2.width, tx - pongP2.width / 2));
    }
  }
}

function pongLoop() {
  if (currentScreen !== 'screen-pong' || !isPongRunning) return;

  const ctx = pongCtx;
  const w = pongCanvas.width;
  const h = pongCanvas.height;

  // ボール移動
  pongBall.x += pongBall.vx;
  pongBall.y += pongBall.vy;

  // 左右壁反射
  if (pongBall.x - pongBall.radius <= 0) {
    pongBall.x = pongBall.radius;
    pongBall.vx = -pongBall.vx;
    window.sounds.playTap();
  } else if (pongBall.x + pongBall.radius >= w) {
    pongBall.x = w - pongBall.radius;
    pongBall.vx = -pongBall.vx;
    window.sounds.playTap();
  }

  // P1パドル衝突 (上側 y: 25)
  const p1Y = getTopSafeY();
  if (pongBall.y - pongBall.radius <= p1Y + pongP1.height && pongBall.y + pongBall.radius >= p1Y) {
    if (pongBall.x >= pongP1.x && pongBall.x <= pongP1.x + pongP1.width && pongBall.vy < 0) {
      pongBall.vy = -pongBall.vy * 1.05;
      pongBall.vx = (pongBall.x - (pongP1.x + pongP1.width / 2)) * 0.15;
      window.sounds.playTap();
    }
  }

  // P2パドル衝突 (下側 y: h - 39)
  const p2Y = h - 39;
  if (pongBall.y + pongBall.radius >= p2Y && pongBall.y - pongBall.radius <= p2Y + pongP2.height) {
    if (pongBall.x >= pongP2.x && pongBall.x <= pongP2.x + pongP2.width && pongBall.vy > 0) {
      pongBall.vy = -pongBall.vy * 1.05;
      pongBall.vx = (pongBall.x - (pongP2.x + pongP2.width / 2)) * 0.15;
      window.sounds.playTap();
    }
  }

  // ゴールアウト
  if (pongBall.y < getTopSafeY() - 20) {
    pongScore2++;
    window.sounds.playSuccess();
    checkPongWinner();
    resetPongBall();
  } else if (pongBall.y > h) {
    pongScore1++;
    window.sounds.playSuccess();
    checkPongWinner();
    resetPongBall();
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // センターネット
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // スコア（P1は対面向きに180度回転、P2は通常向き）
  ctx.save();
  ctx.translate(w / 2, h / 2 - 36);
  ctx.rotate(Math.PI);
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`P1: ${pongScore1}`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(w / 2, h / 2 + 36);
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`P2: ${pongScore2}`, 0, 0);
  ctx.restore();

  // スタート時のガイド
  if (pongScore1 === 0 && pongScore2 === 0) {
    ctx.save();
    ctx.translate(w / 2, p1Y + pongP1.height + 26);
    ctx.rotate(Math.PI);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔴 スライドして打ち返せ！', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.font = '13px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔵 スライドして打ち返せ！', w / 2, p2Y - 18);
    ctx.restore();
  }

  // パドル描画
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(pongP1.x, p1Y, pongP1.width, pongP1.height);

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(pongP2.x, p2Y, pongP2.width, pongP2.height);

  // ボール
  ctx.beginPath();
  ctx.arc(pongBall.x, pongBall.y, pongBall.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();

  requestAnimationFrame(pongLoop);
}

function checkPongWinner() {
  if (pongScore1 >= 3 || pongScore2 >= 3) {
    isPongRunning = false;
    const winner = pongScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🏓 ${winner} の勝利！`, `ピンポン・ラリーで3点先取しました！`, () => {
      initPongGame();
    });
  }
}

/* ============================================================
   12. PKサッカー対決 (Soccer Penalty Kick)
   ============================================================ */
let penaltyCanvas, penaltyCtx;
let penaltyRound = 1;
let penaltyTurn = 1; // 1: P1キッカー vs P2キーパー, 2: P2キッカー vs P1キーパー
let penaltyScore1 = 0, penaltyScore2 = 0;
let penaltyState = 'aiming'; // 'aiming' | 'result'
let pKickerAim = null, pKeeperAim = null;
let isPenaltyRunning = false;

function initPenaltyGame() {
  penaltyCanvas = document.getElementById('penalty-canvas');
  penaltyCtx = penaltyCanvas.getContext('2d');
  penaltyCanvas.width = penaltyCanvas.clientWidth;
  penaltyCanvas.height = penaltyCanvas.clientHeight;

  penaltyRound = 1;
  penaltyTurn = 1;
  penaltyScore1 = 0;
  penaltyScore2 = 0;
  isPenaltyRunning = true;
  startPenaltyTurn();

  penaltyCanvas.onpointerdown = handlePenaltyTouch;
  requestAnimationFrame(penaltyLoop);
}

function startPenaltyTurn() {
  penaltyState = 'aiming';
  pKickerAim = null;
  pKeeperAim = null;
}

function handlePenaltyTouch(e) {
  if (!isPenaltyRunning || penaltyState !== 'aiming') return;
  const rect = penaltyCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = penaltyCanvas.width;
  const h = penaltyCanvas.height;

  // 上半分はP1ゾーン、下半分はP2ゾーン
  if (y < h / 2) {
    // P1の操作: P1から見て左・中・右 (P1は対面なので x の大小が反転)
    if (!pKickerAim && penaltyTurn === 1) {
      // P1がキッカー
      pKickerAim = x > w * 2 / 3 ? 'left' : (x < w / 3 ? 'right' : 'center');
      window.sounds.playTap();
    } else if (!pKeeperAim && penaltyTurn === 2) {
      // P1がキーパー
      pKeeperAim = x > w * 2 / 3 ? 'left' : (x < w / 3 ? 'right' : 'center');
      window.sounds.playTap();
    }
  } else {
    // P2の操作: P2から見て左・中・右
    const zone = x < w / 3 ? 'left' : (x < w * 2 / 3 ? 'center' : 'right');
    if (!pKickerAim && penaltyTurn === 2) {
      // P2がキッカー
      pKickerAim = zone;
      window.sounds.playTap();
    } else if (!pKeeperAim && penaltyTurn === 1) {
      // P2がキーパー
      pKeeperAim = zone;
      window.sounds.playTap();
    }
  }

  if (pKickerAim && pKeeperAim) {
    resolvePenaltyShot();
  }
}

function resolvePenaltyShot() {
  penaltyState = 'result';
  const isGoal = pKickerAim !== pKeeperAim;

  if (isGoal) {
    window.sounds.playSuccess();
    if (penaltyTurn === 1) penaltyScore1++; else penaltyScore2++;
  } else {
    window.sounds.playError();
  }

  setTimeout(() => {
    if (penaltyTurn === 1) {
      penaltyTurn = 2;
    } else {
      penaltyTurn = 1;
      penaltyRound++;
    }

    if (penaltyRound > 3) {
      isPenaltyRunning = false;
      let winnerMsg = penaltyScore1 > penaltyScore2 ? 'プレイヤー 1 の勝利！' : (penaltyScore2 > penaltyScore1 ? 'プレイヤー 2 の勝利！' : '引き分け！');
      showModal(`⚽ PK戦終了！`, `${winnerMsg}\n(P1: ${penaltyScore1}点 - P2: ${penaltyScore2}点)`, () => {
        initPenaltyGame();
      });
    } else {
      startPenaltyTurn();
    }
  }, 1200);
}

function penaltyLoop() {
  if (currentScreen !== 'screen-penalty' || !isPenaltyRunning) return;

  const ctx = penaltyCtx;
  const w = penaltyCanvas.width;
  const h = penaltyCanvas.height;
  const topY = getTopSafeY();

  ctx.fillStyle = '#15803d'; // サッカー芝生
  ctx.fillRect(0, 0, w, h);

  // 中央仕切り線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // 中央円
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
  ctx.stroke();

  // 3コース境界ガイド
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(w / 3, 0); ctx.lineTo(w / 3, h);
  ctx.moveTo(w * 2 / 3, 0); ctx.lineTo(w * 2 / 3, h);
  ctx.stroke();
  ctx.setLineDash([]);

  // P1 ガイド (180度反転)
  const p1Role = penaltyTurn === 1 ? '⚽ キッカー (コースをタップ！)' : '🧤 キーパー (守るコースをタップ！)';
  const p1Status = (penaltyTurn === 1 ? pKickerAim : pKeeperAim) ? '✅ 選択済み！' : p1Role;
  drawP1Text(ctx, `🔴 P1: [スコア ${penaltyScore1}] ${p1Status}`, w / 2, topY + 18, 'bold 15px sans-serif', '#ef4444', 'center');

  // P2 ガイド
  const p2Role = penaltyTurn === 2 ? '⚽ キッカー (コースをタップ！)' : '🧤 キーパー (守るコースをタップ！)';
  const p2Status = (penaltyTurn === 2 ? pKickerAim : pKeeperAim) ? '✅ 選択済み！' : p2Role;
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText(`🔵 P2: [スコア ${penaltyScore2}] ${p2Status}`, w / 2, h - 30);

  // 結果演出
  if (penaltyState === 'result') {
    const isGoal = pKickerAim !== pKeeperAim;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = isGoal ? '#facc15' : '#ef4444';
    ctx.textAlign = 'center';
    ctx.fillText(isGoal ? 'GOAAAL! ⚽🔥' : 'SAVED! 🧤🚫', w / 2, h / 2 + 12);
  }

  requestAnimationFrame(penaltyLoop);
}

/* ============================================================
   13. ワンタップレーサー (One-Tap Drift Racer)
   ============================================================ */
let racerCanvas, racerCtx;
let racerCar1 = { angle: 0, speed: 0.035, lap: 0 };
let racerCar2 = { angle: Math.PI, speed: 0.035, lap: 0 };
let isRacerDrifting1 = false, isRacerDrifting2 = false;
let isRacerRunning = false;

function initRacerGame() {
  racerCanvas = document.getElementById('racer-canvas');
  racerCtx = racerCanvas.getContext('2d');
  racerCanvas.width = racerCanvas.clientWidth;
  racerCanvas.height = racerCanvas.clientHeight;

  racerCar1 = { angle: 0, speed: 0.038, lap: 0, radius: 100 };
  racerCar2 = { angle: Math.PI, speed: 0.038, lap: 0, radius: 100 };
  isRacerDrifting1 = false;
  isRacerDrifting2 = false;
  isRacerRunning = true;

  racerCanvas.onpointerdown = (e) => {
    const y = e.clientY - racerCanvas.getBoundingClientRect().top;
    if (y < racerCanvas.height / 2) isRacerDrifting1 = true;
    else isRacerDrifting2 = true;
  };

  racerCanvas.onpointerup = (e) => {
    isRacerDrifting1 = false;
    isRacerDrifting2 = false;
  };

  requestAnimationFrame(racerLoop);
}

function racerLoop() {
  if (currentScreen !== 'screen-racer' || !isRacerRunning) return;

  const ctx = racerCtx;
  const w = racerCanvas.width;
  const h = racerCanvas.height;
  const centerX = w / 2;
  const centerY = h / 2;

  // 車の回転とドリフト半径制御
  racerCar1.angle += racerCar1.speed;
  racerCar2.angle += racerCar2.speed;

  racerCar1.radius += isRacerDrifting1 ? -2.2 : 2.0;
  racerCar1.radius = Math.max(65, Math.min(130, racerCar1.radius));

  racerCar2.radius += isRacerDrifting2 ? -2.2 : 2.0;
  racerCar2.radius = Math.max(65, Math.min(130, racerCar2.radius));

  // ラップ加算
  if (racerCar1.angle >= Math.PI * 2) {
    racerCar1.angle -= Math.PI * 2;
    racerCar1.lap++;
    window.sounds.playCoin();
    checkRacerWinner();
  }
  if (racerCar2.angle >= Math.PI * 2) {
    racerCar2.angle -= Math.PI * 2;
    racerCar2.lap++;
    window.sounds.playCoin();
    checkRacerWinner();
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // コース描画 (ドーナツ状サーキット)
  ctx.beginPath();
  ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
  ctx.stroke();

  // ラップ表示
  drawP1Text(ctx, `P1: ${racerCar1.lap}/3 周`, 58, getTopSafeY(), 'bold 22px sans-serif', '#ef4444');

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'left';
  ctx.fillText(`P2: ${racerCar2.lap}/3 周`, 20, h - 24);

  // 車1 (赤)
  const c1X = centerX + Math.cos(racerCar1.angle) * racerCar1.radius;
  const c1Y = centerY + Math.sin(racerCar1.angle) * racerCar1.radius;
  ctx.beginPath();
  ctx.arc(c1X, c1Y, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // 車2 (青)
  const c2X = centerX + Math.cos(racerCar2.angle) * racerCar2.radius;
  const c2Y = centerY + Math.sin(racerCar2.angle) * racerCar2.radius;
  ctx.beginPath();
  ctx.arc(c2X, c2Y, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.stroke();

  requestAnimationFrame(racerLoop);
}

function checkRacerWinner() {
  if (racerCar1.lap >= 3 || racerCar2.lap >= 3) {
    isRacerRunning = false;
    window.sounds.playSuccess();
    const winner = racerCar1.lap >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🏎️ ${winner} のチェッカーフラッグ！`, `3周を最速で駆け抜けました！`, () => {
      initRacerGame();
    });
  }
}

/* ============================================================
   14. 木こり早切りバトル (Lumberjack Duel)
   ============================================================ */
let lumberCanvas, lumberCtx;
let lumberScore1 = 0, lumberScore2 = 0;
let lumberBranches = []; // 'left', 'right', 'none'
let lumberPlayerPos1 = 'left'; // 'left' or 'right'
let lumberPlayerPos2 = 'left';
let isLumberRunning = false;

function initLumberGame() {
  lumberCanvas = document.getElementById('lumber-canvas');
  lumberCtx = lumberCanvas.getContext('2d');
  lumberCanvas.width = lumberCanvas.clientWidth;
  lumberCanvas.height = lumberCanvas.clientHeight;

  lumberScore1 = 0;
  lumberScore2 = 0;
  lumberPlayerPos1 = 'left';
  lumberPlayerPos2 = 'left';
  isLumberRunning = true;

  lumberBranches = [];
  for (let i = 0; i < 12; i++) {
    const r = Math.random();
    lumberBranches.push(r < 0.4 ? 'left' : (r < 0.8 ? 'right' : 'none'));
  }

  lumberCanvas.onpointerdown = handleLumberTouch;
  requestAnimationFrame(lumberLoop);
}

function handleLumberTouch(e) {
  e.preventDefault();
  if (!isLumberRunning) return;

  const rect = lumberCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const midX = lumberCanvas.width / 2;
  const midY = lumberCanvas.height / 2;

  if (y < midY) {
    // P1 (上)
    lumberPlayerPos1 = x < midX ? 'left' : 'right';
    lumberScore1++;
    window.sounds.playSlash();
    if (lumberBranches[0] === lumberPlayerPos1) {
      // 枝に激突！
      lumberFail(1);
      return;
    }
  } else {
    // P2 (下)
    lumberPlayerPos2 = x < midX ? 'left' : 'right';
    lumberScore2++;
    window.sounds.playSlash();
    if (lumberBranches[0] === lumberPlayerPos2) {
      // 枝に激突！
      lumberFail(2);
      return;
    }
  }

  // 1段木が下がる
  lumberBranches.shift();
  const r = Math.random();
  lumberBranches.push(r < 0.4 ? 'left' : (r < 0.8 ? 'right' : 'none'));

  if (lumberScore1 >= 20 || lumberScore2 >= 20) {
    isLumberRunning = false;
    window.sounds.playSuccess();
    const winner = lumberScore1 >= 20 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🪓 ${winner} の勝利！`, `20カット達成で見事な木こり王に輝きました！`, () => {
      initLumberGame();
    });
  }
}

function lumberFail(loser) {
  isLumberRunning = false;
  window.sounds.playError();
  const winner = loser === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
  showModal(`💥 枝にぶつかった！`, `${winner} の勝利！相手が枝に直撃しました！`, () => {
    initLumberGame();
  });
}

function lumberLoop() {
  if (currentScreen !== 'screen-lumber' || !isLumberRunning) return;

  const ctx = lumberCtx;
  const w = lumberCanvas.width;
  const h = lumberCanvas.height;
  const midX = w / 2;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 幹
  ctx.fillStyle = '#78350f';
  ctx.fillRect(midX - 25, 0, 50, h);

  // スコア
  drawP1Text(ctx, `P1: ${lumberScore1}/20`, 58, getTopSafeY(), 'bold 22px sans-serif', '#ef4444');
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'left';
  ctx.fillText(`P2: ${lumberScore2}/20`, 30, h - 30);

  // 枝の描画
  lumberBranches.forEach((b, idx) => {
    const branchY = h / 2 + (idx - 3) * 45;
    ctx.fillStyle = '#15803d';
    if (b === 'left') {
      ctx.fillRect(midX - 85, branchY, 60, 18);
    } else if (b === 'right') {
      ctx.fillRect(midX + 25, branchY, 60, 18);
    }
  });

  // プレイヤー1 (上側木こり)
  ctx.fillStyle = '#ef4444';
  const p1X = lumberPlayerPos1 === 'left' ? midX - 60 : midX + 45;
  ctx.fillRect(p1X, h * 0.35, 25, 35);

  // プレイヤー2 (下側木こり)
  ctx.fillStyle = '#3b82f6';
  const p2X = lumberPlayerPos2 === 'left' ? midX - 60 : midX + 45;
  ctx.fillRect(p2X, h * 0.65, 25, 35);

  requestAnimationFrame(lumberLoop);
}

/* ============================================================
   15. ピンボールジャンプ (Pinball Jump)
   ============================================================ */
let jumpCanvas, jumpCtx;
let jumpBall1 = { y: 0, vy: 0, isJumping: false };
let jumpBall2 = { y: 0, vy: 0, isJumping: false };
let jumpTraps1 = [], jumpTraps2 = [];
let isJumpRunning = false;

function initJumpGame() {
  jumpCanvas = document.getElementById('jump-canvas');
  jumpCtx = jumpCanvas.getContext('2d');
  jumpCanvas.width = jumpCanvas.clientWidth;
  jumpCanvas.height = jumpCanvas.clientHeight;

  const trackH = jumpCanvas.height / 2;
  const groundY = trackH - 55;

  jumpBall1 = { y: groundY, vy: 0, isJumping: false };
  jumpBall2 = { y: groundY, vy: 0, isJumping: false };
  jumpTraps1 = [];
  jumpTraps2 = [];
  isJumpRunning = true;

  jumpCanvas.onpointerdown = (e) => {
    const rect = jumpCanvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y < trackH && !jumpBall1.isJumping) {
      jumpBall1.vy = -12;
      jumpBall1.isJumping = true;
      window.sounds.playJump();
    } else if (y >= trackH && !jumpBall2.isJumping) {
      jumpBall2.vy = -12;
      jumpBall2.isJumping = true;
      window.sounds.playJump();
    }
  };

  requestAnimationFrame(jumpLoop);
}

function jumpLoop() {
  if (currentScreen !== 'screen-jump' || !isJumpRunning) return;

  const ctx = jumpCtx;
  const w = jumpCanvas.width;
  const h = jumpCanvas.height;
  const trackH = h / 2;
  const groundY = trackH - 55;

  // 重力
  jumpBall1.vy += 0.8;
  jumpBall1.y += jumpBall1.vy;
  if (jumpBall1.y >= groundY) {
    jumpBall1.y = groundY;
    jumpBall1.vy = 0;
    jumpBall1.isJumping = false;
  }

  jumpBall2.vy += 0.8;
  jumpBall2.y += jumpBall2.vy;
  if (jumpBall2.y >= groundY) {
    jumpBall2.y = groundY;
    jumpBall2.vy = 0;
    jumpBall2.isJumping = false;
  }

  // トゲ障害物生成
  if (Math.random() < 0.02) {
    jumpTraps1.push({ x: w + 20 });
    jumpTraps2.push({ x: w + 20 });
  }

  // 描画クリア
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // センター仕切り線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, trackH);
  ctx.lineTo(w, trackH);
  ctx.stroke();

  // --- P1 エリア (上半分: 対面P1向きに180度反転描画) ---
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, trackH);
  ctx.clip();
  ctx.translate(w / 2, trackH / 2);
  ctx.rotate(Math.PI);
  ctx.translate(-w / 2, -trackH / 2);

  // P1 床
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY); ctx.lineTo(w, groundY);
  ctx.stroke();

  // P1 ボール
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(60, jumpBall1.y, 14, 0, Math.PI * 2);
  ctx.fill();

  // P1 トゲ
  ctx.fillStyle = '#f43f5e';
  jumpTraps1.forEach(t => {
    ctx.beginPath();
    ctx.moveTo(t.x, groundY);
    ctx.lineTo(t.x + 12, groundY - 24);
    ctx.lineTo(t.x + 24, groundY);
    ctx.fill();
  });

  // P1 ラベル (対面向き)
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'left';
  ctx.fillText('🔴 P1: タップでジャンプ', 20, groundY + 35);
  ctx.restore();

  // --- P2 エリア (下半分: 通常向き描画) ---
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, trackH, w, trackH);
  ctx.clip();

  const p2Ground = trackH + groundY;
  // P2 床
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, p2Ground); ctx.lineTo(w, p2Ground);
  ctx.stroke();

  // P2 ボール
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(60, trackH + jumpBall2.y, 14, 0, Math.PI * 2);
  ctx.fill();

  // P2 トゲ
  ctx.fillStyle = '#f43f5e';
  jumpTraps2.forEach(t => {
    ctx.beginPath();
    ctx.moveTo(t.x, p2Ground);
    ctx.lineTo(t.x + 12, p2Ground - 24);
    ctx.lineTo(t.x + 24, p2Ground);
    ctx.fill();
  });

  // P2 ラベル (通常向き)
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'left';
  ctx.fillText('🔵 P2: タップでジャンプ', 20, p2Ground + 35);
  ctx.restore();

  // トゲ移動と衝突判定
  let hit1 = false, hit2 = false;
  [jumpTraps1, jumpTraps2].forEach((traps, pIdx) => {
    const ball = pIdx === 0 ? jumpBall1 : jumpBall2;
    for (let i = traps.length - 1; i >= 0; i--) {
      const t = traps[i];
      t.x -= 5.5;

      // 衝突判定: ボールがX軸で重なり、かつジャンプしていなければ衝突
      if (Math.abs(60 - (t.x + 12)) < 16 && (groundY - ball.y < 20)) {
        if (pIdx === 0) hit1 = true; else hit2 = true;
      }

      if (t.x < -30) traps.splice(i, 1);
    }
  });

  if ((hit1 || hit2) && isJumpRunning) {
    isJumpRunning = false;
    window.sounds.playError();
    const winner = hit1 ? 'プレイヤー 2' : 'プレイヤー 1';
    showModal(`💥 トゲに衝突！`, `${winner} の勝利！障害物を華麗に飛び越え続けました！`, () => {
      initJumpGame();
    });
    return;
  }

  requestAnimationFrame(jumpLoop);
}

/* ============================================================
   16. スピード数字タッチ (Speed Numbers 1-16)
   ============================================================ */
let numNext1 = 1, numNext2 = 1;

function initNumbersGame() {
  numNext1 = 1;
  numNext2 = 1;
  document.getElementById('num-next-p1').textContent = 1;
  document.getElementById('num-next-p2').textContent = 1;

  setupNumberGrid(1);
  setupNumberGrid(2);
}

function setupNumberGrid(player) {
  const container = document.getElementById(`grid-p${player}`);
  container.innerHTML = '';

  const nums = Array.from({ length: 16 }, (_, i) => i + 1);
  // シャッフル
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  nums.forEach(n => {
    const cell = document.createElement('div');
    cell.className = 'num-cell';
    cell.textContent = n;
    cell.onclick = (e) => {
      e.preventDefault();
      handleNumberClick(player, n, cell);
    };
    container.appendChild(cell);
  });
}

function handleNumberClick(player, num, cell) {
  const expected = player === 1 ? numNext1 : numNext2;
  if (num === expected) {
    window.sounds.playTap();
    cell.classList.add('cleared');
    if (player === 1) {
      numNext1++;
      document.getElementById('num-next-p1').textContent = numNext1 <= 16 ? numNext1 : 'GOAL!';
    } else {
      numNext2++;
      document.getElementById('num-next-p2').textContent = numNext2 <= 16 ? numNext2 : 'GOAL!';
    }

    if (num === 16) {
      window.sounds.playSuccess();
      const winner = player === 1 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`👑 ${winner} の最速クリア！`, `1から16まで完璧にタッチしきりました！`, () => {
        initNumbersGame();
      });
    }
  } else {
    window.sounds.playError();
  }
}

/* ============================================================
   17. 魚釣りバトル (Fishing Hook Timing)
   ============================================================ */
let fishingCanvas, fishingCtx;
let fishingState = 'waiting'; // 'waiting' | 'bite'
let isFishingRunning = false;

function initFishingGame() {
  fishingCanvas = document.getElementById('fishing-canvas');
  fishingCtx = fishingCanvas.getContext('2d');
  fishingCanvas.width = fishingCanvas.clientWidth;
  fishingCanvas.height = fishingCanvas.clientHeight;

  fishingState = 'waiting';
  isFishingRunning = true;

  const waitTime = 1800 + Math.random() * 3200;
  window.activeGameTimeout = setTimeout(() => {
    if (currentScreen !== 'screen-fishing' || !isFishingRunning) return;
    fishingState = 'bite';
    window.sounds.playSlash();
  }, waitTime);

  fishingCanvas.onpointerdown = handleFishingTouch;
  requestAnimationFrame(fishingLoop);
}

function handleFishingTouch(e) {
  if (!isFishingRunning) return;
  const y = e.clientY - fishingCanvas.getBoundingClientRect().top;
  const player = y < fishingCanvas.height / 2 ? 1 : 2;

  if (fishingState === 'waiting') {
    // お手つき！
    isFishingRunning = false;
    window.sounds.playError();
    const loser = player === 1 ? 'プレイヤー 1' : 'プレイヤー 2';
    const winner = player === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
    showModal(`⚠️ お手つき！`, `${loser} のフライング！\n${winner} の勝利！`, () => {
      initFishingGame();
    });
  } else if (fishingState === 'bite') {
    // 釣り上げ成功！
    isFishingRunning = false;
    window.sounds.playSuccess();
    const winner = player === 1 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🐟 大物GET！`, `${winner} が見事に釣り上げました！`, () => {
      initFishingGame();
    });
  }
}

function fishingLoop() {
  if (currentScreen !== 'screen-fishing' || !isFishingRunning) return;

  const ctx = fishingCtx;
  const w = fishingCanvas.width;
  const h = fishingCanvas.height;
  const topY = getTopSafeY();

  // 水面背景
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w, h);

  // 波のエフェクト
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  for (let i = 0; i < w; i += 20) {
    ctx.arc(i + 10, h / 2, 8, 0, Math.PI);
  }
  ctx.fill();

  // 中央仕切り
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // P1 浮き (上部) & P2 浮き (下部)
  const bobP1 = fishingState === 'bite' ? (Math.random() - 0.5) * 12 : Math.sin(performance.now() * 0.005) * 5;
  const bobP2 = fishingState === 'bite' ? (Math.random() - 0.5) * 12 : Math.sin(performance.now() * 0.005 + 1) * 5;

  ctx.font = '50px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔴', w / 2, h * 0.28 + bobP1);
  ctx.fillText('🔵', w / 2, h * 0.72 + bobP2);

  // 180度反転 P1 ガイド
  if (fishingState === 'waiting') {
    drawP1Text(ctx, '🔴 P1: 浮きが沈んだらタップ！(お手つき厳禁)', w / 2, topY + 16, 'bold 15px sans-serif', '#ffffff', 'center');
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('🔵 P2: 浮きが沈んだらタップ！(お手つき厳禁)', w / 2, h - 30);
  } else {
    drawP1Text(ctx, '🎣 HIT!! 今すぐタップ！', w / 2, h * 0.2, 'bold 26px sans-serif', '#facc15', 'center');
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'center';
    ctx.fillText('🎣 HIT!! 今すぐタップ！', w / 2, h * 0.82);
  }

  requestAnimationFrame(fishingLoop);
}

/* ============================================================
   18. フルーツスラッシュ (Fruit Slash Duel)
   ============================================================ */
let slashCanvas, slashCtx;
let slashScore1 = 0, slashScore2 = 0;
let slashFruits = [];
let isSlashRunning = false;

function initSlashGame() {
  slashCanvas = document.getElementById('slash-canvas');
  slashCtx = slashCanvas.getContext('2d');
  slashCanvas.width = slashCanvas.clientWidth;
  slashCanvas.height = slashCanvas.clientHeight;

  slashScore1 = 0;
  slashScore2 = 0;
  slashFruits = [];
  isSlashRunning = true;

  slashCanvas.ontouchmove = handleSlashTouch;
  requestAnimationFrame(slashLoop);
}

function handleSlashTouch(e) {
  e.preventDefault();
  if (!isSlashRunning) return;

  const rect = slashCanvas.getBoundingClientRect();
  const midY = slashCanvas.height / 2;

  for (let i = 0; i < e.touches.length; i++) {
    const t = e.touches[i];
    const tx = t.clientX - rect.left;
    const ty = t.clientY - rect.top;

    for (let j = slashFruits.length - 1; j >= 0; j--) {
      const f = slashFruits[j];
      const dist = Math.hypot(tx - f.x, ty - f.y);
      if (dist < f.radius + 15) {
        window.sounds.playSlash();
        if (ty < midY) slashScore1++; else slashScore2++;
        slashFruits.splice(j, 1);
        checkSlashWinner();
      }
    }
  }
}

function slashLoop() {
  if (currentScreen !== 'screen-slash' || !isSlashRunning) return;

  const ctx = slashCtx;
  const w = slashCanvas.width;
  const h = slashCanvas.height;

  // フルーツ射出
  if (Math.random() < 0.05 && slashFruits.length < 8) {
    slashFruits.push({
      x: 30 + Math.random() * (w - 60),
      y: h + 10,
      vx: (Math.random() - 0.5) * 4,
      vy: -12 - Math.random() * 6,
      radius: 24,
      emoji: ['🍉', '🍊', '🍎', '🍇'][Math.floor(Math.random() * 4)]
    });
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // スコア表示
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${slashScore1} 切断`, 58, getTopSafeY());

  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${slashScore2} 切断`, 20, h - 24);

  // フルーツ移動と描画
  for (let i = slashFruits.length - 1; i >= 0; i--) {
    const f = slashFruits[i];
    f.x += f.vx;
    f.y += f.vy;
    f.vy += 0.35; // 重力

    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(f.emoji, f.x, f.y);

    if (f.y > h + 50) {
      slashFruits.splice(i, 1);
    }
  }

  requestAnimationFrame(slashLoop);
}

function checkSlashWinner() {
  if (slashScore1 >= 10 || slashScore2 >= 10) {
    isSlashRunning = false;
    window.sounds.playSuccess();
    const winner = slashScore1 >= 10 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`⚔️ ${winner} の勝利！`, `10個のフルーツを華麗に切り刻みました！`, () => {
      initSlashGame();
    });
  }
}

/* ============================================================
   19. ハイ＆ロー対決 (High & Low)
   ============================================================ */
let highLowScore1 = 0, highLowScore2 = 0;
let currentCardNumber = 7;
let highLowResolved = false;

function initHighLowGame() {
  highLowScore1 = 0;
  highLowScore2 = 0;
  currentCardNumber = Math.floor(2 + Math.random() * 10);
  updateHighLowUI();
}

function updateHighLowUI() {
  document.getElementById('highlow-score-p1').textContent = highLowScore1;
  document.getElementById('highlow-score-p2').textContent = highLowScore2;
  document.getElementById('highlow-current-num').textContent = currentCardNumber;
  highLowResolved = false;
}

function handleHighLowGuess(player, guess) {
  if (highLowResolved) return;
  highLowResolved = true;

  const nextNum = Math.floor(1 + Math.random() * 13);
  const isHigh = nextNum >= currentCardNumber;
  const isCorrect = (guess === 'high' && isHigh) || (guess === 'low' && !isHigh);

  if (isCorrect) {
    window.sounds.playSuccess();
    if (player === 1) highLowScore1++; else highLowScore2++;
  } else {
    window.sounds.playError();
  }

  currentCardNumber = nextNum;
  updateHighLowUI();

  if (highLowScore1 >= 4 || highLowScore2 >= 4) {
    const winner = highLowScore1 >= 4 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🎲 ${winner} の勝利！`, `鋭い直感で見事ハイ＆ローを制覇！`, () => {
      initHighLowGame();
    });
  }
}

/* ============================================================
   20. 戦車デュエル (Tank 1v1 Battle)
   ============================================================ */
let tankCanvas, tankCtx;
let tank1, tank2, tankBullets = [];
let isTankRunning = false;

function initTankGame() {
  tankCanvas = document.getElementById('tank-canvas');
  tankCtx = tankCanvas.getContext('2d');
  tankCanvas.width = tankCanvas.clientWidth;
  tankCanvas.height = tankCanvas.clientHeight;

  const w = tankCanvas.width;
  const h = tankCanvas.height;
  const topY = getTopSafeY();

  tank1 = { x: w / 2, y: topY + 60, angle: Math.PI / 2, radius: 20 };
  tank2 = { x: w / 2, y: h - 70, angle: -Math.PI / 2, radius: 20 };
  tankBullets = [];
  isTankRunning = true;

  // タップで旋回、指を離した瞬間に砲撃！
  tankCanvas.onpointerdown = (e) => {
    if (!isTankRunning) return;
    const y = e.clientY - tankCanvas.getBoundingClientRect().top;
    if (y < h / 2) tank1.angle += 0.45;
    else tank2.angle += 0.45;
  };

  tankCanvas.onpointerup = (e) => {
    if (!isTankRunning) return;
    const y = e.clientY - tankCanvas.getBoundingClientRect().top;
    if (y < h / 2) {
      shootTankBullet(1);
    } else {
      shootTankBullet(2);
    }
  };

  requestAnimationFrame(tankLoop);
}

function shootTankBullet(player) {
  const tank = player === 1 ? tank1 : tank2;
  tankBullets.push({
    x: tank.x + Math.cos(tank.angle) * 26,
    y: tank.y + Math.sin(tank.angle) * 26,
    vx: Math.cos(tank.angle) * 8,
    vy: Math.sin(tank.angle) * 8,
    player: player
  });
  window.sounds.playGunshot();
}

function tankLoop() {
  if (currentScreen !== 'screen-tank' || !isTankRunning) return;

  const ctx = tankCtx;
  const w = tankCanvas.width;
  const h = tankCanvas.height;
  const topY = getTopSafeY();

  // 砲弾移動
  let hitPlayer = null;
  for (let i = tankBullets.length - 1; i >= 0; i--) {
    const b = tankBullets[i];
    b.x += b.vx;
    b.y += b.vy;

    const target = b.player === 1 ? tank2 : tank1;
    const targetNum = b.player === 1 ? 2 : 1;
    if (Math.hypot(b.x - target.x, b.y - target.y) < target.radius + 6) {
      hitPlayer = targetNum;
    }

    if (b.x < 0 || b.x > w || b.y < 0 || b.y > h) {
      tankBullets.splice(i, 1);
    }
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 中央境界線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: タップで旋回 / 離して砲撃！', w / 2, topY + 16, 'bold 15px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: タップで旋回 / 離して砲撃！', w / 2, h - 30);

  // 砲弾
  ctx.fillStyle = '#facc15';
  tankBullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 戦車描画
  [ { tank: tank1, color: '#ef4444' }, { tank: tank2, color: '#3b82f6' } ].forEach(({ tank, color }) => {
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.angle);
    // 車体
    ctx.fillStyle = color;
    ctx.fillRect(-18, -14, 36, 28);
    // 砲身
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, -4, 25, 8);
    ctx.restore();
  });

  if (hitPlayer && isTankRunning) {
    isTankRunning = false;
    window.sounds.playExplosion();
    const winner = hitPlayer === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
    showModal(`💥 命中！`, `${winner} の砲撃が決まりました！`, () => {
      initTankGame();
    });
    return;
  }

  requestAnimationFrame(tankLoop);
}

/* ============================================================
   21. バスケシュート対決 (Basketball Shootout)
   ============================================================ */
let basketCanvas, basketCtx;
let basketScore1 = 0, basketScore2 = 0;
let basketBall = null; // { x, y, vx, vy, player }
let isBasketRunning = false;

function initBasketGame() {
  basketCanvas = document.getElementById('basket-canvas');
  basketCtx = basketCanvas.getContext('2d');
  basketCanvas.width = basketCanvas.clientWidth;
  basketCanvas.height = basketCanvas.clientHeight;

  basketScore1 = 0;
  basketScore2 = 0;
  basketBall = null;
  isBasketRunning = true;

  let dragStart = null;
  basketCanvas.onpointerdown = (e) => {
    const rect = basketCanvas.getBoundingClientRect();
    dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  basketCanvas.onpointerup = (e) => {
    if (!dragStart || !isBasketRunning || basketBall) return;
    const rect = basketCanvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const dx = endX - dragStart.x;
    const dy = endY - dragStart.y;
    const player = dragStart.y < basketCanvas.height / 2 ? 1 : 2;

    basketBall = {
      x: dragStart.x,
      y: dragStart.y,
      vx: Math.max(-10, Math.min(10, dx * 0.15)),
      vy: Math.max(-16, Math.min(16, dy * 0.18)),
      player: player,
      radius: 16
    };
    window.sounds.playJump();
    dragStart = null;
  };

  requestAnimationFrame(basketLoop);
}

function basketLoop() {
  if (currentScreen !== 'screen-basket' || !isBasketRunning) return;

  const ctx = basketCtx;
  const w = basketCanvas.width;
  const h = basketCanvas.height;
  const midY = h / 2;

  // ボール物理
  if (basketBall) {
    basketBall.x += basketBall.vx;
    basketBall.y += basketBall.vy;
    basketBall.vy += 0.45; // 重力

    // 壁反射
    if (basketBall.x - basketBall.radius < 0 || basketBall.x + basketBall.radius > w) {
      basketBall.vx = -basketBall.vx * 0.8;
    }

    // リング判定 (中央にリング)
    const hoopX = w / 2;
    const hoopY = midY;
    if (Math.hypot(basketBall.x - hoopX, basketBall.y - hoopY) < 24 && basketBall.vy > 0) {
      window.sounds.playSuccess();
      if (basketBall.player === 1) basketScore1++; else basketScore2++;
      basketBall = null;
      checkBasketWinner();
    } else if (basketBall.y > h + 40 || basketBall.y < -40) {
      basketBall = null;
    }
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // スコア
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${basketScore1}/3`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${basketScore2}/3`, 30, h - 30);

  // バスケットリング (中央)
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(w / 2 - 25, midY - 4, 50, 8);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(w / 2 - 20, midY + 4, 40, 24);

  // ガイド文字
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('指でスワイプしてシュート！', w / 2, midY - 60);

  // ボール描画
  if (basketBall) {
    ctx.beginPath();
    ctx.arc(basketBall.x, basketBall.y, basketBall.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f97316';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }

  requestAnimationFrame(basketLoop);
}

function checkBasketWinner() {
  if (basketScore1 >= 3 || basketScore2 >= 3) {
    isBasketRunning = false;
    const winner = basketScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🏀 ${winner} の勝利！`, `見事3本シュートを決めました！`, () => {
      initBasketGame();
    });
  }
}

/* ============================================================
   22. ダーツ・ブルズアイ (Darts Bullseye)
   ============================================================ */
let dartsCanvas, dartsCtx;
let dartsCrosshairAngle = 0;
let dartsThrowsP1 = 3, dartsThrowsP2 = 3;
let dartsScore1 = 0, dartsScore2 = 0;
let isDartsRunning = false;

function initDartsGame() {
  dartsCanvas = document.getElementById('darts-canvas');
  dartsCtx = dartsCanvas.getContext('2d');
  dartsCanvas.width = dartsCanvas.clientWidth;
  dartsCanvas.height = dartsCanvas.clientHeight;

  dartsThrowsP1 = 3;
  dartsThrowsP2 = 3;
  dartsScore1 = 0;
  dartsScore2 = 0;
  dartsCrosshairAngle = 0;
  isDartsRunning = true;

  dartsCanvas.onpointerdown = (e) => {
    if (!isDartsRunning) return;
    const y = e.clientY - dartsCanvas.getBoundingClientRect().top;
    const midY = dartsCanvas.height / 2;
    const w = dartsCanvas.width;
    const cx = w / 2 + Math.cos(dartsCrosshairAngle) * 80;
    const cy = midY + Math.sin(dartsCrosshairAngle * 1.5) * 80;
    const distToCenter = Math.hypot(cx - w / 2, cy - midY);

    let pts = 10;
    if (distToCenter < 18) pts = 50; // BULL!
    else if (distToCenter < 45) pts = 30;

    if (y < midY && dartsThrowsP1 > 0) {
      dartsThrowsP1--;
      dartsScore1 += pts;
      window.sounds.playCoin();
    } else if (y >= midY && dartsThrowsP2 > 0) {
      dartsThrowsP2--;
      dartsScore2 += pts;
      window.sounds.playCoin();
    }

    if (dartsThrowsP1 === 0 && dartsThrowsP2 === 0) {
      isDartsRunning = false;
      window.sounds.playSuccess();
      const winner = dartsScore1 > dartsScore2 ? 'プレイヤー 1' : (dartsScore2 > dartsScore1 ? 'プレイヤー 2' : '引き分け');
      showModal(`🎯 ダーツ決着！`, `${winner} の勝利！\n(P1: ${dartsScore1}点 - P2: ${dartsScore2}点)`, () => {
        initDartsGame();
      });
    }
  };

  requestAnimationFrame(dartsLoop);
}

function dartsLoop() {
  if (currentScreen !== 'screen-darts' || !isDartsRunning) return;

  const ctx = dartsCtx;
  const w = dartsCanvas.width;
  const h = dartsCanvas.height;
  const midX = w / 2;
  const midY = h / 2;

  dartsCrosshairAngle += 0.055;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ダーツ的 (同心円)
  [ { r: 90, c: '#ffffff' }, { r: 65, c: '#ef4444' }, { r: 40, c: '#10b981' }, { r: 16, c: '#eab308' } ].forEach(ring => {
    ctx.beginPath();
    ctx.arc(midX, midY, ring.r, 0, Math.PI * 2);
    ctx.fillStyle = ring.c;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
  });

  // スコア・残弾
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${dartsScore1}点 (残${dartsThrowsP1})`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${dartsScore2}点 (残${dartsThrowsP2})`, 25, h - 30);

  // 揺れる照準 (クロスヘア)
  const targetX = midX + Math.cos(dartsCrosshairAngle) * 80;
  const targetY = midY + Math.sin(dartsCrosshairAngle * 1.5) * 80;

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(targetX, targetY, 14, 0, Math.PI * 2);
  ctx.moveTo(targetX - 22, targetY); ctx.lineTo(targetX + 22, targetY);
  ctx.moveTo(targetX, targetY - 22); ctx.lineTo(targetX, targetY + 22);
  ctx.stroke();

  requestAnimationFrame(dartsLoop);
}

/* ============================================================
   23. 大縄跳びサバイバル (Jump Rope)
   ============================================================ */
let ropeCanvas, ropeCtx;
let ropeAngle = 0;
let isRopeJumping1 = false, isRopeJumping2 = false;
let isRopeRunning = false;

function initRopeGame() {
  ropeCanvas = document.getElementById('rope-canvas');
  ropeCtx = ropeCanvas.getContext('2d');
  ropeCanvas.width = ropeCanvas.clientWidth;
  ropeCanvas.height = ropeCanvas.clientHeight;

  ropeAngle = 0;
  isRopeJumping1 = false;
  isRopeJumping2 = false;
  isRopeRunning = true;

  ropeCanvas.onpointerdown = (e) => {
    if (!isRopeRunning) return;
    const y = e.clientY - ropeCanvas.getBoundingClientRect().top;
    if (y < ropeCanvas.height / 2 && !isRopeJumping1) {
      isRopeJumping1 = true;
      window.sounds.playJump();
      setTimeout(() => { isRopeJumping1 = false; }, 360);
    } else if (y >= ropeCanvas.height / 2 && !isRopeJumping2) {
      isRopeJumping2 = true;
      window.sounds.playJump();
      setTimeout(() => { isRopeJumping2 = false; }, 360);
    }
  };

  requestAnimationFrame(ropeLoop);
}

function ropeLoop() {
  if (currentScreen !== 'screen-rope' || !isRopeRunning) return;

  const ctx = ropeCtx;
  const w = ropeCanvas.width;
  const h = ropeCanvas.height;
  const midX = w / 2;
  const midY = h / 2;
  const topY = getTopSafeY();

  ropeAngle += 0.065;
  const ropeY = midY + Math.sin(ropeAngle) * 90;
  const isRopeAtBottom = Math.sin(ropeAngle) > 0.88;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: タイミングよくタップしてジャンプ！', w / 2, topY + 16, 'bold 15px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: タイミングよくタップしてジャンプ！', w / 2, h - 30);

  // 中央仕切り線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, midY); ctx.lineTo(w, midY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 縄の描画 (放物線)
  ctx.beginPath();
  ctx.moveTo(40, midY);
  ctx.quadraticCurveTo(midX, ropeY, w - 40, midY);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#facc15';
  ctx.stroke();

  // キャラクター P1 (赤) & P2 (青)
  const char1Y = isRopeJumping1 ? midY - 48 : midY;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(midX - 45, char1Y, 18, 0, Math.PI * 2);
  ctx.fill();

  const char2Y = isRopeJumping2 ? midY - 48 : midY;
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(midX + 45, char2Y, 18, 0, Math.PI * 2);
  ctx.fill();

  // 判定
  if (isRopeAtBottom) {
    if (!isRopeJumping1 && !isRopeJumping2) {
      isRopeRunning = false;
      window.sounds.playError();
      showModal(`💥 相討ち！`, `二人同時に引っかかりました！引き分け！`, () => {
        initRopeGame();
      });
      return;
    } else if (!isRopeJumping1) {
      isRopeRunning = false;
      window.sounds.playError();
      showModal(`💥 引っかかった！`, `プレイヤー 2 の勝利！P1が縄に当たりました！`, () => {
        initRopeGame();
      });
      return;
    } else if (!isRopeJumping2) {
      isRopeRunning = false;
      window.sounds.playError();
      showModal(`💥 引っかかった！`, `プレイヤー 1 の勝利！P2が縄に当たりました！`, () => {
        initRopeGame();
      });
      return;
    }
  }

  requestAnimationFrame(ropeLoop);
}

/* ============================================================
   24. ブロッククラッシュ (Breakout Clash)
   ============================================================ */
let breakoutCanvas, breakoutCtx;
let breakoutPaddle1 = 0, breakoutPaddle2 = 0;
let breakoutBall = { x: 0, y: 0, vx: 3.5, vy: 4.5, radius: 9 };
let breakoutBlocks = [];
let isBreakoutRunning = false;

function initBreakoutGame() {
  breakoutCanvas = document.getElementById('breakout-canvas');
  breakoutCtx = breakoutCanvas.getContext('2d');
  breakoutCanvas.width = breakoutCanvas.clientWidth;
  breakoutCanvas.height = breakoutCanvas.clientHeight;

  const w = breakoutCanvas.width;
  const h = breakoutCanvas.height;

  breakoutPaddle1 = (w - 70) / 2;
  breakoutPaddle2 = (w - 70) / 2;
  breakoutBall = { x: w / 2, y: h / 2, vx: 3.5, vy: 4.5, radius: 9 };
  isBreakoutRunning = true;

  // 中央にブロック配置
  breakoutBlocks = [];
  const rows = 3;
  const cols = 6;
  const blockW = (w - 40) / cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      breakoutBlocks.push({
        x: 20 + c * blockW,
        y: h / 2 - 30 + r * 20,
        w: blockW - 4,
        h: 16,
        alive: true
      });
    }
  }

  const handleBreakoutTouch = (e) => {
    e.preventDefault();
    if (!isBreakoutRunning) return;
    const rect = breakoutCanvas.getBoundingClientRect();
    const touches = e.touches ? Array.from(e.touches) : [e];
    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      const tx = t.clientX - rect.left;
      const ty = t.clientY - rect.top;
      if (ty < h / 2) {
        breakoutPaddle1 = Math.max(0, Math.min(w - 70, tx - 35));
      } else {
        breakoutPaddle2 = Math.max(0, Math.min(w - 70, tx - 35));
      }
    }
  };

  breakoutCanvas.onpointerdown = handleBreakoutTouch;
  breakoutCanvas.onpointermove = handleBreakoutTouch;
  breakoutCanvas.ontouchstart = handleBreakoutTouch;
  breakoutCanvas.ontouchmove = handleBreakoutTouch;

  requestAnimationFrame(breakoutLoop);
}

function breakoutLoop() {
  if (currentScreen !== 'screen-breakout' || !isBreakoutRunning) return;

  const ctx = breakoutCtx;
  const w = breakoutCanvas.width;
  const h = breakoutCanvas.height;
  const topY = getTopSafeY();

  breakoutBall.x += breakoutBall.vx;
  breakoutBall.y += breakoutBall.vy;

  // 左右壁
  if (breakoutBall.x - breakoutBall.radius < 0 || breakoutBall.x + breakoutBall.radius > w) {
    breakoutBall.vx = -breakoutBall.vx;
    window.sounds.playTap();
  }

  // パドル衝突
  if (breakoutBall.y - breakoutBall.radius <= topY + 14 && breakoutBall.vy < 0 && breakoutBall.y >= topY - 5) {
    if (breakoutBall.x >= breakoutPaddle1 && breakoutBall.x <= breakoutPaddle1 + 70) {
      breakoutBall.vy = -breakoutBall.vy;
      window.sounds.playTap();
    }
  }
  if (breakoutBall.y + breakoutBall.radius >= h - 35 && breakoutBall.vy > 0) {
    if (breakoutBall.x >= breakoutPaddle2 && breakoutBall.x <= breakoutPaddle2 + 70) {
      breakoutBall.vy = -breakoutBall.vy;
      window.sounds.playTap();
    }
  }

  // ブロック衝突
  breakoutBlocks.forEach(b => {
    if (b.alive) {
      if (breakoutBall.x > b.x && breakoutBall.x < b.x + b.w && breakoutBall.y > b.y && breakoutBall.y < b.y + b.h) {
        b.alive = false;
        breakoutBall.vy = -breakoutBall.vy;
        window.sounds.playCoin();
      }
    }
  });

  // 勝敗
  if (breakoutBall.y < topY - 20) {
    isBreakoutRunning = false;
    window.sounds.playSuccess();
    showModal(`🎉 プレイヤー 2 の勝利！`, `相手の守備を突破しました！`, () => {
      initBreakoutGame();
    });
    return;
  } else if (breakoutBall.y > h) {
    isBreakoutRunning = false;
    window.sounds.playSuccess();
    showModal(`🎉 プレイヤー 1 の勝利！`, `相手の守備を突破しました！`, () => {
      initBreakoutGame();
    });
    return;
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ブロック
  breakoutBlocks.forEach(b => {
    if (b.alive) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  });

  // パドル
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(breakoutPaddle1, topY, 70, 14);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(breakoutPaddle2, h - 34, 70, 14);

  // ガイドラベル (P1は180度反転)
  drawP1Text(ctx, '🔴 P1: スライドしてブロックを崩せ！', w / 2, topY + 30, 'bold 14px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: スライドしてブロックを崩せ！', w / 2, h - 48);

  // ボール
  ctx.beginPath();
  ctx.arc(breakoutBall.x, breakoutBall.y, breakoutBall.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  requestAnimationFrame(breakoutLoop);
}

/* ============================================================
   25. UFOキャッチャー (UFO Grabber)
   ============================================================ */
let ufoCanvas, ufoCtx;
let ufoX1 = 50, ufoX2 = 50;
let ufoArmY1 = 0, ufoArmY2 = 0;
let isUfoGrabbing1 = false, isUfoGrabbing2 = false;
let ufoScore1 = 0, ufoScore2 = 0;
let isUfoRunning = false;

function initUfoGame() {
  ufoCanvas = document.getElementById('ufo-canvas');
  ufoCtx = ufoCanvas.getContext('2d');
  ufoCanvas.width = ufoCanvas.clientWidth;
  ufoCanvas.height = ufoCanvas.clientHeight;

  ufoScore1 = 0;
  ufoScore2 = 0;
  isUfoGrabbing1 = false;
  isUfoGrabbing2 = false;
  isUfoRunning = true;

  ufoCanvas.onpointerdown = (e) => {
    const y = e.clientY - ufoCanvas.getBoundingClientRect().top;
    if (y < ufoCanvas.height / 2 && !isUfoGrabbing1) isUfoGrabbing1 = true;
    else if (y >= ufoCanvas.height / 2 && !isUfoGrabbing2) isUfoGrabbing2 = true;
  };

  requestAnimationFrame(ufoLoop);
}

function ufoLoop() {
  if (currentScreen !== 'screen-ufo' || !isUfoRunning) return;

  const ctx = ufoCtx;
  const w = ufoCanvas.width;
  const h = ufoCanvas.height;
  const midY = h / 2;

  // UFO巡回
  ufoX1 = w / 2 + Math.sin(performance.now() * 0.003) * (w * 0.4);
  ufoX2 = w / 2 + Math.cos(performance.now() * 0.003) * (w * 0.4);

  if (isUfoGrabbing1) {
    ufoArmY1 += 8;
    if (ufoArmY1 >= midY - 60) {
      // 掴み判定
      if (Math.abs(ufoX1 - w / 2) < 40) {
        ufoScore1++;
        window.sounds.playCoin();
      }
      isUfoGrabbing1 = false;
      ufoArmY1 = 0;
      checkUfoWinner();
    }
  }

  if (isUfoGrabbing2) {
    ufoArmY2 += 8;
    if (ufoArmY2 >= midY - 60) {
      if (Math.abs(ufoX2 - w / 2) < 40) {
        ufoScore2++;
        window.sounds.playCoin();
      }
      isUfoGrabbing2 = false;
      ufoArmY2 = 0;
      checkUfoWinner();
    }
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // お宝 (中央の宝石)
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💎', w / 2, midY);

  // スコア
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${ufoScore1}/3`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${ufoScore2}/3`, 30, h - 30);

  // UFO 1
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(ufoX1 - 25, getTopSafeY(), 50, 18);
  if (isUfoGrabbing1) {
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(ufoX1 - 6, getTopSafeY() + 18, 12, ufoArmY1);
  }

  // UFO 2
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(ufoX2 - 25, h - 58, 50, 18);
  if (isUfoGrabbing2) {
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(ufoX2 - 6, h - 58 - ufoArmY2, 12, ufoArmY2);
  }

  requestAnimationFrame(ufoLoop);
}

function checkUfoWinner() {
  if (ufoScore1 >= 3 || ufoScore2 >= 3) {
    isUfoRunning = false;
    window.sounds.playSuccess();
    const winner = ufoScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🛸 ${winner} の勝利！`, `お宝宝石を3つ回収しました！`, () => {
      initUfoGame();
    });
  }
}

/* ============================================================
   26. ボクシング・パンチ (Boxing Clash)
   ============================================================ */
let boxingCanvas, boxingCtx;
let boxingScore1 = 0, boxingScore2 = 0;
let boxingGuard1 = true, boxingGuard2 = true;
let isBoxingRunning = false;

function initBoxingGame() {
  boxingCanvas = document.getElementById('boxing-canvas');
  boxingCtx = boxingCanvas.getContext('2d');
  boxingCanvas.width = boxingCanvas.clientWidth;
  boxingCanvas.height = boxingCanvas.clientHeight;

  boxingScore1 = 0;
  boxingScore2 = 0;
  boxingGuard1 = true;
  boxingGuard2 = true;
  isBoxingRunning = true;

  boxingCanvas.onpointerdown = (e) => {
    const y = e.clientY - boxingCanvas.getBoundingClientRect().top;
    if (y < boxingCanvas.height / 2) {
      // P1パンチ！
      boxingGuard1 = false;
      window.sounds.playSlash();
      if (!boxingGuard2) {
        boxingScore1++;
        window.sounds.playGunshot();
      }
      setTimeout(() => { boxingGuard1 = true; }, 400);
    } else {
      // P2パンチ！
      boxingGuard2 = false;
      window.sounds.playSlash();
      if (!boxingGuard1) {
        boxingScore2++;
        window.sounds.playGunshot();
      }
      setTimeout(() => { boxingGuard2 = true; }, 400);
    }

    if (boxingScore1 >= 3 || boxingScore2 >= 3) {
      isBoxingRunning = false;
      window.sounds.playSuccess();
      const winner = boxingScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🥊 K.O.! ${winner} の勝利！`, `豪快なクリーンヒットで相手をノックアウト！`, () => {
        initBoxingGame();
      });
    }
  };

  requestAnimationFrame(boxingLoop);
}

function boxingLoop() {
  if (currentScreen !== 'screen-boxing' || !isBoxingRunning) return;

  const ctx = boxingCtx;
  const w = boxingCanvas.width;
  const h = boxingCanvas.height;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${boxingScore1}/3`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${boxingScore2}/3`, 30, h - 30);

  // P1ボクサー
  ctx.font = '60px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(boxingGuard1 ? '🛡️' : '🥊', w / 2, h * 0.35);

  // P2ボクサー
  ctx.fillText(boxingGuard2 ? '🛡️' : '🥊', w / 2, h * 0.65);

  requestAnimationFrame(boxingLoop);
}

/* ============================================================
   27. ハイウェイドライブ (Highway Racer)
   ============================================================ */
let highwayCanvas, highwayCtx;
let highwayLane1 = 1, highwayLane2 = 1; // 0, 1, 2
let highwayEnemies = [];
let isHighwayRunning = false;

function initHighwayGame() {
  highwayCanvas = document.getElementById('highway-canvas');
  highwayCtx = highwayCanvas.getContext('2d');
  highwayCanvas.width = highwayCanvas.clientWidth;
  highwayCanvas.height = highwayCanvas.clientHeight;

  highwayLane1 = 1;
  highwayLane2 = 1;
  highwayEnemies = [];
  isHighwayRunning = true;

  highwayCanvas.onpointerdown = (e) => {
    const x = e.clientX - highwayCanvas.getBoundingClientRect().left;
    const y = e.clientY - highwayCanvas.getBoundingClientRect().top;
    const w = highwayCanvas.width;
    const lane = Math.floor(x / (w / 3));

    if (y < highwayCanvas.height / 2) highwayLane1 = Math.max(0, Math.min(2, lane));
    else highwayLane2 = Math.max(0, Math.min(2, lane));
    window.sounds.playTap();
  };

  requestAnimationFrame(highwayLoop);
}

function highwayLoop() {
  if (currentScreen !== 'screen-highway' || !isHighwayRunning) return;

  const ctx = highwayCtx;
  const w = highwayCanvas.width;
  const h = highwayCanvas.height;
  const laneW = w / 3;

  // 敵車生成
  if (Math.random() < 0.035) {
    highwayEnemies.push({ lane: Math.floor(Math.random() * 3), y: -30, vy: 5 });
  }

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);

  // 車線ライン
  ctx.strokeStyle = '#facc15';
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(laneW, 0); ctx.lineTo(laneW, h);
  ctx.moveTo(laneW * 2, 0); ctx.lineTo(laneW * 2, h);
  ctx.stroke();
  ctx.setLineDash([]);

  // 自車 P1 (上)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(highwayLane1 * laneW + laneW * 0.25, h * 0.25, laneW * 0.5, 45);

  // 自車 P2 (下)
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(highwayLane2 * laneW + laneW * 0.25, h * 0.75, laneW * 0.5, 45);

  // 敵車と衝突判定
  let hitPlayer = null;
  for (let i = highwayEnemies.length - 1; i >= 0; i--) {
    const en = highwayEnemies[i];
    en.y += en.vy;

    ctx.fillStyle = '#64748b';
    ctx.fillRect(en.lane * laneW + laneW * 0.25, en.y, laneW * 0.5, 45);

    if (en.lane === highwayLane1 && Math.abs(en.y - h * 0.25) < 40) hitPlayer = 1;
    if (en.lane === highwayLane2 && Math.abs(en.y - h * 0.75) < 40) hitPlayer = 2;

    if (en.y > h + 50) highwayEnemies.splice(i, 1);
  }

  if (hitPlayer && isHighwayRunning) {
    isHighwayRunning = false;
    window.sounds.playExplosion();
    const winner = hitPlayer === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
    showModal(`💥 事故発生！`, `${winner} の勝利！安全運転を完遂しました！`, () => {
      initHighwayGame();
    });
    return;
  }

  requestAnimationFrame(highwayLoop);
}

/* ============================================================
   28. リズムビート (Rhythm Beat)
   ============================================================ */
let rhythmCanvas, rhythmCtx;
let rhythmNotes1 = [], rhythmNotes2 = [];
let rhythmScore1 = 0, rhythmScore2 = 0;
let isRhythmRunning = false;

function initRhythmGame() {
  rhythmCanvas = document.getElementById('rhythm-canvas');
  rhythmCtx = rhythmCanvas.getContext('2d');
  rhythmCanvas.width = rhythmCanvas.clientWidth;
  rhythmCanvas.height = rhythmCanvas.clientHeight;

  rhythmScore1 = 0;
  rhythmScore2 = 0;
  rhythmNotes1 = [];
  rhythmNotes2 = [];
  isRhythmRunning = true;

  rhythmCanvas.onpointerdown = (e) => {
    const y = e.clientY - rhythmCanvas.getBoundingClientRect().top;
    const midY = rhythmCanvas.height / 2;

    if (y < midY) {
      // P1判定 (ラインは y: 60)
      for (let i = 0; i < rhythmNotes1.length; i++) {
        const rLine1Y = getTopSafeY() + 15;
      if (Math.abs(rhythmNotes1[i].y - rLine1Y) < 30) {
          rhythmScore1 += 100;
          window.sounds.playCoin();
          rhythmNotes1.splice(i, 1);
          break;
        }
      }
    } else {
      // P2判定 (ラインは y: h - 60)
      const lineY = rhythmCanvas.height - 60;
      for (let i = 0; i < rhythmNotes2.length; i++) {
        if (Math.abs(rhythmNotes2[i].y - lineY) < 30) {
          rhythmScore2 += 100;
          window.sounds.playCoin();
          rhythmNotes2.splice(i, 1);
          break;
        }
      }
    }

    if (rhythmScore1 >= 500 || rhythmScore2 >= 500) {
      isRhythmRunning = false;
      window.sounds.playSuccess();
      const winner = rhythmScore1 >= 500 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🎵 FULL COMBO!`, `${winner} の勝利！見事なリズムキープ！`, () => {
        initRhythmGame();
      });
    }
  };

  requestAnimationFrame(rhythmLoop);
}

function rhythmLoop() {
  if (currentScreen !== 'screen-rhythm' || !isRhythmRunning) return;

  const ctx = rhythmCtx;
  const w = rhythmCanvas.width;
  const h = rhythmCanvas.height;

  if (Math.random() < 0.04) rhythmNotes1.push({ y: h / 2 - 20, vy: -4 });
  if (Math.random() < 0.04) rhythmNotes2.push({ y: h / 2 + 20, vy: 4 });

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 判定ライン
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  const rLineDraw1Y = getTopSafeY() + 15;
  ctx.moveTo(30, rLineDraw1Y); ctx.lineTo(w - 30, rLineDraw1Y);
  ctx.moveTo(30, h - 60); ctx.lineTo(w - 30, h - 60);
  ctx.stroke();

  // スコア
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${rhythmScore1}`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${rhythmScore2}`, 30, h - 20);

  // ノーツ
  ctx.fillStyle = '#f43f5e';
  rhythmNotes1.forEach(n => {
    n.y += n.vy;
    ctx.beginPath();
    ctx.arc(w / 2, n.y, 16, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#3b82f6';
  rhythmNotes2.forEach(n => {
    n.y += n.vy;
    ctx.beginPath();
    ctx.arc(w / 2, n.y, 16, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(rhythmLoop);
}

/* ============================================================
   29. 地雷チキンレース (Minefield Duel)
   ============================================================ */
let minesTurn = 1;
let minesData = []; // 25マス
let isMinesRunning = false;

function initMinesGame() {
  minesTurn = 1;
  isMinesRunning = true;
  document.getElementById('mines-turn-label').textContent = 'プレイヤー 1 の番';

  // 25マス中、4個が地雷
  minesData = Array(25).fill(false);
  let placed = 0;
  while (placed < 4) {
    const idx = Math.floor(Math.random() * 25);
    if (!minesData[idx]) {
      minesData[idx] = true;
      placed++;
    }
  }

  const container = document.getElementById('mines-grid');
  container.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'mine-cell';
    cell.textContent = '?';
    cell.onclick = () => handleMineClick(i, cell);
    container.appendChild(cell);
  }
}

function handleMineClick(idx, cell) {
  if (!isMinesRunning) return;

  if (minesData[idx]) {
    // 地雷爆発！
    isMinesRunning = false;
    cell.classList.add('exploded');
    cell.textContent = '💣';
    window.sounds.playExplosion();
    const winner = minesTurn === 1 ? 'プレイヤー 2' : 'プレイヤー 1';
    showModal(`💥 ドッカーン！`, `地雷を踏んでしまいました！\n${winner} の勝利！`, () => {
      initMinesGame();
    });
  } else {
    // 安全！
    cell.classList.add('safe');
    cell.textContent = '💎';
    window.sounds.playCoin();
    minesTurn = minesTurn === 1 ? 2 : 1;
    document.getElementById('mines-turn-label').textContent = `プレイヤー ${minesTurn} の番`;
  }
}

/* ============================================================
   30. アーチェリー・エイム (Archery Duel)
   ============================================================ */
let archeryCanvas, archeryCtx;
let archeryScore1 = 0, archeryScore2 = 0;
let archeryArrow = null;
let archeryWind = 0;
let isArcheryRunning = false;

function initArcheryGame() {
  archeryCanvas = document.getElementById('archery-canvas');
  archeryCtx = archeryCanvas.getContext('2d');
  archeryCanvas.width = archeryCanvas.clientWidth;
  archeryCanvas.height = archeryCanvas.clientHeight;

  archeryScore1 = 0;
  archeryScore2 = 0;
  archeryWind = Math.round((Math.random() - 0.5) * 6);
  isArcheryRunning = true;

  archeryCanvas.onpointerdown = (e) => {
    if (!isArcheryRunning || archeryArrow) return;
    const y = e.clientY - archeryCanvas.getBoundingClientRect().top;
    const player = y < archeryCanvas.height / 2 ? 1 : 2;

    archeryArrow = {
      x: archeryCanvas.width / 2,
      y: player === 1 ? 40 : archeryCanvas.height - 40,
      vy: player === 1 ? 8 : -8,
      player: player
    };
    window.sounds.playSlash();
  };

  requestAnimationFrame(archeryLoop);
}

function archeryLoop() {
  if (currentScreen !== 'screen-archery' || !isArcheryRunning) return;

  const ctx = archeryCtx;
  const w = archeryCanvas.width;
  const h = archeryCanvas.height;
  const midX = w / 2;
  const midY = h / 2;

  // 矢の移動
  if (archeryArrow) {
    archeryArrow.x += archeryWind * 0.4;
    archeryArrow.y += archeryArrow.vy;

    if (Math.abs(archeryArrow.y - midY) < 15) {
      // 的に命中
      const dist = Math.abs(archeryArrow.x - midX);
      let pts = 10;
      if (dist < 15) pts = 50; // センター
      else if (dist < 35) pts = 30;

      window.sounds.playCoin();
      if (archeryArrow.player === 1) archeryScore1 += pts; else archeryScore2 += pts;
      archeryArrow = null;
      archeryWind = Math.round((Math.random() - 0.5) * 6); // 風向き更新

      if (archeryScore1 >= 100 || archeryScore2 >= 100) {
        isArcheryRunning = false;
        window.sounds.playSuccess();
        const winner = archeryScore1 >= 100 ? 'プレイヤー 1' : 'プレイヤー 2';
        showModal(`🏹 ${winner} の勝利！`, `見事なエイムで100ポイント到達！`, () => {
          initArcheryGame();
        });
        return;
      }
    } else if (archeryArrow.y < 0 || archeryArrow.y > h) {
      archeryArrow = null;
    }
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 的 (中央)
  [ { r: 60, c: '#ffffff' }, { r: 40, c: '#ef4444' }, { r: 20, c: '#facc15' } ].forEach(ring => {
    ctx.beginPath();
    ctx.arc(midX, midY, ring.r, 0, Math.PI * 2);
    ctx.fillStyle = ring.c;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
  });

  // 風表示
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText(`風: ${archeryWind > 0 ? '右 → ' : (archeryWind < 0 ? '左 ← ' : '無風 ')}${Math.abs(archeryWind)}m`, midX, midY - 80);

  // スコア
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${archeryScore1}/100`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${archeryScore2}/100`, 30, h - 30);

  // 矢描画
  if (archeryArrow) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(archeryArrow.x - 2, archeryArrow.y - 12, 4, 24);
  }

  requestAnimationFrame(archeryLoop);
}

/* ============================================================
   31. バッティング・スマッシュ (Batting Smash)
   ============================================================ */
let cricketCanvas, cricketCtx;
let cricketBall = null;
let cricketScore1 = 0, cricketScore2 = 0;
let cricketHitsP1 = 3, cricketHitsP2 = 3;
let isCricketRunning = false;

function initCricketGame() {
  cricketCanvas = document.getElementById('cricket-canvas');
  cricketCtx = cricketCanvas.getContext('2d');
  cricketCanvas.width = cricketCanvas.clientWidth;
  cricketCanvas.height = cricketCanvas.clientHeight;

  cricketScore1 = 0;
  cricketScore2 = 0;
  cricketHitsP1 = 3;
  cricketHitsP2 = 3;
  cricketBall = null;
  isCricketRunning = true;

  cricketPitchNext();
  cricketCanvas.onpointerdown = handleCricketSwing;
  requestAnimationFrame(cricketLoop);
}

function cricketPitchNext() {
  if (!isCricketRunning) return;
  const w = cricketCanvas.width;
  const h = cricketCanvas.height;
  const isP1Turn = cricketHitsP1 > cricketHitsP2;
  const targetPlayer = isP1Turn ? 1 : 2;

  cricketBall = {
    x: w / 2,
    y: targetPlayer === 1 ? h * 0.7 : h * 0.3,
    vy: targetPlayer === 1 ? -7 : 7,
    player: targetPlayer,
    hit: false
  };
}

function handleCricketSwing(e) {
  if (!isCricketRunning || !cricketBall || cricketBall.hit) return;
  const y = e.clientY - cricketCanvas.getBoundingClientRect().top;
  const h = cricketCanvas.height;
  const targetY = cricketBall.player === 1 ? 70 : h - 70;

  if (Math.abs(cricketBall.y - targetY) < 35) {
    // ヒット！
    cricketBall.hit = true;
    window.sounds.playGunshot();
    const pts = Math.abs(cricketBall.y - targetY) < 15 ? 100 : 50; // ホームラン or ヒット
    if (cricketBall.player === 1) {
      cricketScore1 += pts;
      cricketHitsP1--;
    } else {
      cricketScore2 += pts;
      cricketHitsP2--;
    }

    if (cricketHitsP1 === 0 && cricketHitsP2 === 0) {
      isCricketRunning = false;
      window.sounds.playSuccess();
      const winner = cricketScore1 > cricketScore2 ? 'プレイヤー 1' : (cricketScore2 > cricketScore1 ? 'プレイヤー 2' : '引き分け');
      showModal(`🏏 試合終了！`, `${winner} の勝利！\n(P1: ${cricketScore1}点 - P2: ${cricketScore2}点)`, () => {
        initCricketGame();
      });
    } else {
      setTimeout(cricketPitchNext, 800);
    }
  } else {
    // 空振り
    window.sounds.playSlash();
  }
}

function cricketLoop() {
  if (currentScreen !== 'screen-cricket' || !isCricketRunning) return;

  const ctx = cricketCtx;
  const w = cricketCanvas.width;
  const h = cricketCanvas.height;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 打席ライン
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 40, 70); ctx.lineTo(w / 2 + 40, 70);
  ctx.moveTo(w / 2 - 40, h - 70); ctx.lineTo(w / 2 + 40, h - 70);
  ctx.stroke();

  // スコア
  drawP1Text(ctx, `P1: ${cricketScore1} (残${cricketHitsP1})`, 58, getTopSafeY(), 'bold 20px sans-serif', '#ef4444');
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'left';
  ctx.fillText(`P2: ${cricketScore2} (残${cricketHitsP2})`, 30, h - 25);

  // ボール移動＆描画
  if (cricketBall) {
    if (!cricketBall.hit) {
      cricketBall.y += cricketBall.vy;
      ctx.beginPath();
      ctx.arc(cricketBall.x, cricketBall.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      if (cricketBall.y < 0 || cricketBall.y > h) {
        // 見逃し
        if (cricketBall.player === 1) cricketHitsP1--; else cricketHitsP2--;
        cricketPitchNext();
      }
    }
  }

  requestAnimationFrame(cricketLoop);
}

/* ============================================================
   32. ハードル走スプリント (Hurdle Sprint)
   ============================================================ */
let hurdleCanvas, hurdleCtx;
let hurdlePos1 = 0, hurdlePos2 = 0;
let hurdleJump1 = false, hurdleJump2 = false;
let hurdleObstacles = [200, 450, 700, 950];
let isHurdleRunning = false;

function initHurdleGame() {
  hurdleCanvas = document.getElementById('hurdle-canvas');
  hurdleCtx = hurdleCanvas.getContext('2d');
  hurdleCanvas.width = hurdleCanvas.clientWidth;
  hurdleCanvas.height = hurdleCanvas.clientHeight;

  hurdlePos1 = 0;
  hurdlePos2 = 0;
  hurdleJump1 = false;
  hurdleJump2 = false;
  isHurdleRunning = true;

  hurdleCanvas.onpointerdown = (e) => {
    if (!isHurdleRunning) return;
    const y = e.clientY - hurdleCanvas.getBoundingClientRect().top;
    if (y < hurdleCanvas.height / 2) {
      // P1: 連打で進み、近くにハードルがあればジャンプ
      hurdlePos1 += 18;
      hurdleJump1 = true;
      window.sounds.playJump();
      setTimeout(() => { hurdleJump1 = false; }, 280);
    } else {
      // P2
      hurdlePos2 += 18;
      hurdleJump2 = true;
      window.sounds.playJump();
      setTimeout(() => { hurdleJump2 = false; }, 280);
    }

    if (hurdlePos1 >= 1100 || hurdlePos2 >= 1100) {
      isHurdleRunning = false;
      window.sounds.playSuccess();
      const winner = hurdlePos1 >= 1100 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🏃 ${winner} の1着ゴール！`, `全ハードルを駆け抜け見事勝利！`, () => {
        initHurdleGame();
      });
    }
  };

  requestAnimationFrame(hurdleLoop);
}

function hurdleLoop() {
  if (currentScreen !== 'screen-hurdle' || !isHurdleRunning) return;

  const ctx = hurdleCtx;
  const w = hurdleCanvas.width;
  const h = hurdleCanvas.height;
  const trackH = h / 2;
  const laneGround = trackH - 55;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // センター仕切り線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, trackH);
  ctx.lineTo(w, trackH);
  ctx.stroke();

  // ハードル障害物との衝突ペナルティ
  hurdleObstacles.forEach(ob => {
    const ob1X = ob - hurdlePos1 + 60;
    const ob2X = ob - hurdlePos2 + 60;
    if (Math.abs(ob1X - 60) < 14 && !hurdleJump1) hurdlePos1 -= 8;
    if (Math.abs(ob2X - 60) < 14 && !hurdleJump2) hurdlePos2 -= 8;
  });

  // --- P1 レーン (上半分: 対面P1向きに180度反転描画) ---
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, trackH);
  ctx.clip();
  ctx.translate(w / 2, trackH / 2);
  ctx.rotate(Math.PI);
  ctx.translate(-w / 2, -trackH / 2);

  // P1 トラック
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, laneGround); ctx.lineTo(w, laneGround);
  ctx.stroke();

  // P1 ハードル
  hurdleObstacles.forEach(ob => {
    const ob1X = ob - hurdlePos1 + 60;
    if (ob1X > 0 && ob1X < w) {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(ob1X, laneGround - 20, 10, 20);
    }
  });

  // P1 ランナー (赤)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(60, hurdleJump1 ? laneGround - 34 : laneGround - 14, 14, 0, Math.PI * 2);
  ctx.fill();

  // P1 進捗バー & ラベル
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(20, laneGround + 20, (hurdlePos1 / 1100) * (w - 40), 6);
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🔴 P1: 連打でダッシュ！', 20, laneGround + 40);
  ctx.restore();

  // --- P2 レーン (下半分: 通常向き描画) ---
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, trackH, w, trackH);
  ctx.clip();

  const p2Ground = trackH + laneGround;
  // P2 トラック
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, p2Ground); ctx.lineTo(w, p2Ground);
  ctx.stroke();

  // P2 ハードル
  hurdleObstacles.forEach(ob => {
    const ob2X = ob - hurdlePos2 + 60;
    if (ob2X > 0 && ob2X < w) {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(ob2X, p2Ground - 20, 10, 20);
    }
  });

  // P2 ランナー (青)
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(60, hurdleJump2 ? p2Ground - 34 : p2Ground - 14, 14, 0, Math.PI * 2);
  ctx.fill();

  // P2 進捗バー & ラベル
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(20, p2Ground + 20, (hurdlePos2 / 1100) * (w - 40), 6);
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🔵 P2: 連打でダッシュ！', 20, p2Ground + 40);
  ctx.restore();

  requestAnimationFrame(hurdleLoop);
}

/* ============================================================
   33. スネーク・デュエル (Snake 1v1)
   ============================================================ */
let snakeCanvas, snakeCtx;
let snake1 = [], snake2 = [];
let snakeDir1 = { x: 0, y: 1 }, snakeDir2 = { x: 0, y: -1 };
let snakeApple = { x: 10, y: 15 };
let isSnakeRunning = false;
let snakeLastTick = 0;

function initSnakeGame() {
  snakeCanvas = document.getElementById('snake-canvas');
  snakeCtx = snakeCanvas.getContext('2d');
  snakeCanvas.width = snakeCanvas.clientWidth;
  snakeCanvas.height = snakeCanvas.clientHeight;

  snake1 = [ { x: 5, y: 5 }, { x: 5, y: 4 } ];
  snake2 = [ { x: 15, y: 25 }, { x: 15, y: 26 } ];
  snakeDir1 = { x: 0, y: 1 };
  snakeDir2 = { x: 0, y: -1 };
  snakeApple = { x: 10, y: 15 };
  isSnakeRunning = true;
  snakeLastTick = performance.now();

  snakeCanvas.onpointerdown = (e) => {
    if (!isSnakeRunning) return;
    const rect = snakeCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = snakeCanvas.width / 2;

    if (y < snakeCanvas.height / 2) {
      // P1: 対面視点。P1から見て左タップ(画面右側)で左旋回、右タップ(画面左側)で右旋回
      if (x > midX) {
        // P1から見て左折
        snakeDir1 = { x: snakeDir1.y, y: -snakeDir1.x };
      } else {
        // P1から見て右折
        snakeDir1 = { x: -snakeDir1.y, y: snakeDir1.x };
      }
    } else {
      // P2: 通常視点。画面左タップで左旋回、右タップで右旋回
      if (x < midX) {
        snakeDir2 = { x: snakeDir2.y, y: -snakeDir2.x };
      } else {
        snakeDir2 = { x: -snakeDir2.y, y: snakeDir2.x };
      }
    }
  };

  requestAnimationFrame(snakeLoop);
}

function snakeLoop(time) {
  if (currentScreen !== 'screen-snake' || !isSnakeRunning) return;

  const ctx = snakeCtx;
  const w = snakeCanvas.width;
  const h = snakeCanvas.height;
  const topY = getTopSafeY();
  const cellSize = 16;
  const cols = Math.floor(w / cellSize);
  const rows = Math.floor(h / cellSize);

  if (time - snakeLastTick > 140) {
    snakeLastTick = time;

    // ヘビ前進
    const h1 = { x: (snake1[0].x + snakeDir1.x + cols) % cols, y: (snake1[0].y + snakeDir1.y + rows) % rows };
    const h2 = { x: (snake2[0].x + snakeDir2.x + cols) % cols, y: (snake2[0].y + snakeDir2.y + rows) % rows };

    snake1.unshift(h1);
    snake2.unshift(h2);

    // リンゴ判定
    if (h1.x === snakeApple.x && h1.y === snakeApple.y) {
      window.sounds.playCoin();
      snakeApple = { x: Math.floor(Math.random() * (cols - 2)) + 1, y: Math.floor(Math.random() * (rows - 2)) + 1 };
    } else {
      snake1.pop();
    }

    if (h2.x === snakeApple.x && h2.y === snakeApple.y) {
      window.sounds.playCoin();
      snakeApple = { x: Math.floor(Math.random() * (cols - 2)) + 1, y: Math.floor(Math.random() * (rows - 2)) + 1 };
    } else {
      snake2.pop();
    }

    // 衝突判定
    let dead1 = false, dead2 = false;
    for (let i = 1; i < snake1.length; i++) {
      if (h1.x === snake1[i].x && h1.y === snake1[i].y) dead1 = true;
    }
    for (let i = 1; i < snake2.length; i++) {
      if (h2.x === snake2[i].x && h2.y === snake2[i].y) dead2 = true;
    }
    for (let i = 0; i < snake2.length; i++) {
      if (h1.x === snake2[i].x && h1.y === snake2[i].y) dead1 = true;
    }
    for (let i = 0; i < snake1.length; i++) {
      if (h2.x === snake1[i].x && h2.y === snake1[i].y) dead2 = true;
    }

    if (dead1 || dead2) {
      isSnakeRunning = false;
      window.sounds.playError();
      const winner = dead1 && dead2 ? '引き分け！' : (dead1 ? 'プレイヤー 2 の勝利！' : 'プレイヤー 1 の勝利！');
      showModal(`🐍 激突！`, winner, () => {
        initSnakeGame();
      });
      return;
    }
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // リンゴ
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc((snakeApple.x + 0.5) * cellSize, (snakeApple.y + 0.5) * cellSize, cellSize * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // スネーク 1
  ctx.fillStyle = '#ef4444';
  snake1.forEach((seg, idx) => {
    ctx.fillRect(seg.x * cellSize + 1, seg.y * cellSize + 1, cellSize - 2, cellSize - 2);
  });

  // スネーク 2
  ctx.fillStyle = '#3b82f6';
  snake2.forEach((seg, idx) => {
    ctx.fillRect(seg.x * cellSize + 1, seg.y * cellSize + 1, cellSize - 2, cellSize - 2);
  });

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: 左右タップで曲がれ！', w / 2, topY + 16, 'bold 15px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: 左右タップで曲がれ！', w / 2, h - 30);

  requestAnimationFrame(snakeLoop);
}

/* ============================================================
   34. スペースインベーダー (Mini Invaders)
   ============================================================ */
let invadersCanvas, invadersCtx;
let invaderEnemies = [];
let invaderScore1 = 0, invaderScore2 = 0;
let isInvadersRunning = false;

function initInvadersGame() {
  invadersCanvas = document.getElementById('invaders-canvas');
  invadersCtx = invadersCanvas.getContext('2d');
  invadersCanvas.width = invadersCanvas.clientWidth;
  invadersCanvas.height = invadersCanvas.clientHeight;

  invaderScore1 = 0;
  invaderScore2 = 0;
  invaderEnemies = [];
  isInvadersRunning = true;

  invadersCanvas.onpointerdown = (e) => {
    const x = e.clientX - invadersCanvas.getBoundingClientRect().left;
    const y = e.clientY - invadersCanvas.getBoundingClientRect().top;
    const player = y < invadersCanvas.height / 2 ? 1 : 2;

    // タップ位置に向けて弾を発射し、近くの敵を撃破
    for (let i = invaderEnemies.length - 1; i >= 0; i--) {
      const en = invaderEnemies[i];
      if (Math.hypot(x - en.x, y - en.y) < 35) {
        invaderEnemies.splice(i, 1);
        window.sounds.playGunshot();
        if (player === 1) invaderScore1++; else invaderScore2++;
        checkInvadersWinner();
        return;
      }
    }
  };

  requestAnimationFrame(invadersLoop);
}

function invadersLoop() {
  if (currentScreen !== 'screen-invaders' || !isInvadersRunning) return;

  const ctx = invadersCtx;
  const w = invadersCanvas.width;
  const h = invadersCanvas.height;

  if (Math.random() < 0.04 && invaderEnemies.length < 8) {
    invaderEnemies.push({
      x: 30 + Math.random() * (w - 60),
      y: h / 2 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 4
    });
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // スコア
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${invaderScore1}/5`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${invaderScore2}/5`, 30, h - 25);

  // インベーダー描画
  invaderEnemies.forEach(en => {
    en.x += en.vx;
    if (en.x < 20 || en.x > w - 20) en.vx = -en.vx;

    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👾', en.x, en.y);
  });

  requestAnimationFrame(invadersLoop);
}

function checkInvadersWinner() {
  if (invaderScore1 >= 5 || invaderScore2 >= 5) {
    isInvadersRunning = false;
    window.sounds.playSuccess();
    const winner = invaderScore1 >= 5 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`👾 ${winner} の勝利！`, `インベーダーを5体撃墜しました！`, () => {
      initInvadersGame();
    });
  }
}

/* ============================================================
   35. カーリング・ストーン (Curling Slide)
   ============================================================ */
let curlingCanvas, curlingCtx;
let curlingPower = 0;
let curlingScore1 = 0, curlingScore2 = 0;
let curlingTurn = 1;
let isCurlingRunning = false;

function initCurlingGame() {
  curlingCanvas = document.getElementById('curling-canvas');
  curlingCtx = curlingCanvas.getContext('2d');
  curlingCanvas.width = curlingCanvas.clientWidth;
  curlingCanvas.height = curlingCanvas.clientHeight;

  curlingPower = 0;
  curlingScore1 = 0;
  curlingScore2 = 0;
  curlingTurn = 1;
  isCurlingRunning = true;

  curlingCanvas.onpointerdown = () => {
    if (!isCurlingRunning) return;
    window.sounds.playSlash();
    const distToCenter = Math.abs(curlingPower - 50);
    const pts = Math.max(0, 100 - distToCenter * 4);

    if (curlingTurn === 1) {
      curlingScore1 = Math.round(pts);
      curlingTurn = 2;
    } else {
      curlingScore2 = Math.round(pts);
      isCurlingRunning = false;
      window.sounds.playSuccess();
      const winner = curlingScore1 > curlingScore2 ? 'プレイヤー 1' : (curlingScore2 > curlingScore1 ? 'プレイヤー 2' : '引き分け');
      showModal(`🥌 試合終了！`, `${winner} の勝利！\n(P1: ${curlingScore1}点 / P2: ${curlingScore2}点)`, () => {
        initCurlingGame();
      });
    }
  };

  requestAnimationFrame(curlingLoop);
}

function curlingLoop() {
  if (currentScreen !== 'screen-curling' || !isCurlingRunning) return;

  const ctx = curlingCtx;
  const w = curlingCanvas.width;
  const h = curlingCanvas.height;
  const topY = getTopSafeY();

  curlingPower = (Math.sin(performance.now() * 0.004) + 1) * 50;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 的 (ハウス)
  const targetY = h / 2;
  [80, 50, 25].forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(w / 2, targetY, r, 0, Math.PI * 2);
    ctx.fillStyle = idx === 0 ? '#3b82f6' : (idx === 1 ? '#ffffff' : '#ef4444');
    ctx.fill();
  });

  // パワーバー
  const barW = w * 0.7;
  const barX = (w - barW) / 2;

  if (curlingTurn === 1) {
    // P1の手番: 上部に180度反転して表示
    drawP1Text(ctx, `🔴 P1 の投球！ タップでストップ！`, w / 2, topY + 16, 'bold 16px sans-serif', '#ef4444', 'center');
    ctx.save();
    ctx.translate(w / 2, topY + 65);
    ctx.rotate(Math.PI);
    // パワーバー枠
    ctx.fillStyle = '#334155';
    ctx.fillRect(-barW / 2, -10, barW, 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-barW / 2, -10, barW * (curlingPower / 100), 20);
    ctx.restore();

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(`🔵 P2 待機中... (P1スコア: 投球中)`, w / 2, h - 30);
  } else {
    // P2の手番: 下部に表示
    drawP1Text(ctx, `🔴 P1 スコア: ${curlingScore1}点 (待機中)`, w / 2, topY + 16, 'bold 14px sans-serif', '#94a3b8', 'center');

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'center';
    ctx.fillText(`🔵 P2 の投球！ タップでストップ！`, w / 2, h - 65);

    // パワーバー枠
    ctx.fillStyle = '#334155';
    ctx.fillRect(barX, h - 50, barW, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(barX, h - 50, barW * (curlingPower / 100), 20);
  }

  requestAnimationFrame(curlingLoop);
}

/* ============================================================
   36. メモリーライト (Simon Memory Light)
   ============================================================ */
let memorySequence = [];
let memoryPlayerInput = [];
let isMemoryShowing = false;

function initMemoryGame() {
  memorySequence = [];
  memoryPlayerInput = [];
  addMemoryStep();
}

function addMemoryStep() {
  memorySequence.push(Math.floor(Math.random() * 4));
  memoryPlayerInput = [];
  playMemorySequence();
}

function playMemorySequence() {
  isMemoryShowing = true;
  document.getElementById('memory-turn-label').textContent = '光る順番を覚えろ！';

  memorySequence.forEach((btnIdx, step) => {
    setTimeout(() => {
      const btn = document.getElementById(`mem-btn-${btnIdx}`);
      btn.classList.add('lit');
      window.sounds.playBeep(400 + btnIdx * 100, 0.2);
      setTimeout(() => { btn.classList.remove('lit'); }, 350);
    }, (step + 1) * 600);
  });

  setTimeout(() => {
    isMemoryShowing = false;
    document.getElementById('memory-turn-label').textContent = '同じ順番で押せ！';
  }, (memorySequence.length + 1) * 600);
}

function handleMemoryInput(btnIdx) {
  if (isMemoryShowing) return;

  window.sounds.playBeep(400 + btnIdx * 100, 0.15);
  memoryPlayerInput.push(btnIdx);

  const curIdx = memoryPlayerInput.length - 1;
  if (memoryPlayerInput[curIdx] !== memorySequence[curIdx]) {
    // ミス！
    window.sounds.playError();
    showModal(`❌ メモリーミス！`, `スコア: ${memorySequence.length - 1}回連続成功！`, () => {
      initMemoryGame();
    });
    return;
  }

  if (memoryPlayerInput.length === memorySequence.length) {
    // ステップクリア！
    window.sounds.playSuccess();
    setTimeout(addMemoryStep, 800);
  }
}

/* ============================================================
   37. スケボー・バランス (Skate Balance)
   ============================================================ */
let skateCanvas, skateCtx;
let skateTilt1 = 0, skateTilt2 = 0;
let isSkateRunning = false;

function initSkateGame() {
  skateCanvas = document.getElementById('skate-canvas');
  skateCtx = skateCanvas.getContext('2d');
  skateCanvas.width = skateCanvas.clientWidth;
  skateCanvas.height = skateCanvas.clientHeight;

  skateTilt1 = 0;
  skateTilt2 = 0;
  isSkateRunning = true;

  skateCanvas.onpointerdown = (e) => {
    if (!isSkateRunning) return;
    const x = e.clientX - skateCanvas.getBoundingClientRect().left;
    const y = e.clientY - skateCanvas.getBoundingClientRect().top;
    const midX = skateCanvas.width / 2;

    if (y < skateCanvas.height / 2) {
      // P1: 対面視点。P1から見て左(画面右)タップで左傾き、右(画面左)タップで右傾き
      skateTilt1 += x > midX ? -0.16 : 0.16;
    } else {
      // P2: 通常視点
      skateTilt2 += x < midX ? -0.16 : 0.16;
    }
  };

  requestAnimationFrame(skateLoop);
}

function skateLoop() {
  if (currentScreen !== 'screen-skate' || !isSkateRunning) return;

  const ctx = skateCtx;
  const w = skateCanvas.width;
  const h = skateCanvas.height;
  const topY = getTopSafeY();

  // ランダムに傾く
  skateTilt1 += (Math.random() - 0.5) * 0.04;
  skateTilt2 += (Math.random() - 0.5) * 0.04;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 中央仕切り
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: 左右タップでスケボーのバランスを保て！', w / 2, topY + 16, 'bold 14px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: 左右タップでスケボーのバランスを保て！', w / 2, h - 30);

  // スケボー描画 P1 (180度反転して対面向き)
  ctx.save();
  ctx.translate(w / 2, h * 0.28);
  ctx.rotate(skateTilt1 + Math.PI);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-60, -7, 120, 14);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-40, 11, 7, 0, Math.PI * 2);
  ctx.arc(40, 11, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // スケボー描画 P2
  ctx.save();
  ctx.translate(w / 2, h * 0.72);
  ctx.rotate(skateTilt2);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(-60, -7, 120, 14);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-40, 11, 7, 0, Math.PI * 2);
  ctx.arc(40, 11, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 転倒判定
  if (Math.abs(skateTilt1) > 0.82) {
    isSkateRunning = false;
    window.sounds.playError();
    showModal(`🛹 転倒！`, `プレイヤー 2 の勝利！P1のバランスが崩れました！`, () => {
      initSkateGame();
    });
    return;
  }
  if (Math.abs(skateTilt2) > 0.82) {
    isSkateRunning = false;
    window.sounds.playError();
    showModal(`🛹 転倒！`, `プレイヤー 1 の勝利！P2のバランスが崩れました！`, () => {
      initSkateGame();
    });
    return;
  }

  requestAnimationFrame(skateLoop);
}

/* ============================================================
   38. キャッチボール (Catch & Throw)
   ============================================================ */
let catchCanvas, catchCtx;
let catchGlove1 = 0, catchGlove2 = 0;
let catchBall = { x: 0, y: 0, vx: 2, vy: 6 };
let isCatchRunning = false;

function initCatchGame() {
  catchCanvas = document.getElementById('catch-canvas');
  catchCtx = catchCanvas.getContext('2d');
  catchCanvas.width = catchCanvas.clientWidth;
  catchCanvas.height = catchCanvas.clientHeight;

  const w = catchCanvas.width;
  const h = catchCanvas.height;
  catchGlove1 = w / 2;
  catchGlove2 = w / 2;
  catchBall = { x: w / 2, y: h / 2, vx: 2.2, vy: 6 };
  isCatchRunning = true;

  const handleCatchTouch = (e) => {
    e.preventDefault();
    if (!isCatchRunning) return;
    const rect = catchCanvas.getBoundingClientRect();
    const touches = e.touches ? Array.from(e.touches) : [e];
    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      const tx = t.clientX - rect.left;
      const ty = t.clientY - rect.top;
      if (ty < h / 2) {
        catchGlove1 = Math.max(35, Math.min(w - 35, tx));
      } else {
        catchGlove2 = Math.max(35, Math.min(w - 35, tx));
      }
    }
  };

  catchCanvas.onpointerdown = handleCatchTouch;
  catchCanvas.onpointermove = handleCatchTouch;
  catchCanvas.ontouchstart = handleCatchTouch;
  catchCanvas.ontouchmove = handleCatchTouch;

  requestAnimationFrame(catchLoop);
}

function catchLoop() {
  if (currentScreen !== 'screen-catch' || !isCatchRunning) return;

  const ctx = catchCtx;
  const w = catchCanvas.width;
  const h = catchCanvas.height;
  const topY = getTopSafeY();

  catchBall.x += catchBall.vx;
  catchBall.y += catchBall.vy;

  if (catchBall.x < 15 || catchBall.x > w - 15) catchBall.vx = -catchBall.vx;

  // キャッチ判定 P1 (上)
  if (catchBall.y <= topY + 16 && catchBall.vy < 0) {
    if (Math.abs(catchBall.x - catchGlove1) < 42) {
      catchBall.vy = -catchBall.vy * 1.05;
      catchBall.vx += (Math.random() - 0.5) * 2;
      window.sounds.playTap();
    } else {
      isCatchRunning = false;
      window.sounds.playError();
      showModal(`⚾ ポロリ！`, `プレイヤー 2 の勝利！P1がキャッチできませんでした！`, () => {
        initCatchGame();
      });
      return;
    }
  }

  // キャッチ判定 P2 (下)
  if (catchBall.y >= h - 42 && catchBall.vy > 0) {
    if (Math.abs(catchBall.x - catchGlove2) < 42) {
      catchBall.vy = -catchBall.vy * 1.05;
      catchBall.vx += (Math.random() - 0.5) * 2;
      window.sounds.playTap();
    } else {
      isCatchRunning = false;
      window.sounds.playError();
      showModal(`⚾ ポロリ！`, `プレイヤー 1 の勝利！P2がキャッチできませんでした！`, () => {
        initCatchGame();
      });
      return;
    }
  }

  // 描画
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // グローブ P1 & P2
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(catchGlove1 - 35, topY, 70, 16);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(catchGlove2 - 35, h - 41, 70, 16);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: スライドして捕球！', w / 2, topY + 32, 'bold 14px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: スライドして捕球！', w / 2, h - 55);

  // ボール
  ctx.beginPath();
  ctx.arc(catchBall.x, catchBall.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  requestAnimationFrame(catchLoop);
}

/* ============================================================
   39. ブロックテニス (Block Tennis)
   ============================================================ */
let blocktennisCanvas, blocktennisCtx;
let btBall = { x: 0, y: 0, vx: 4, vy: 5 };
let btObstacleX = 50, btObstacleVx = 3;
let isBtRunning = false;

let btPaddle1 = 0, btPaddle2 = 0;

function initBlockTennisGame() {
  blocktennisCanvas = document.getElementById('blocktennis-canvas');
  blocktennisCtx = blocktennisCanvas.getContext('2d');
  blocktennisCanvas.width = blocktennisCanvas.clientWidth;
  blocktennisCanvas.height = blocktennisCanvas.clientHeight;

  const w = blocktennisCanvas.width;
  const h = blocktennisCanvas.height;
  btPaddle1 = (w - 80) / 2;
  btPaddle2 = (w - 80) / 2;
  btBall = { x: w / 2, y: h / 2, vx: 4, vy: (Math.random() > 0.5 ? 4.5 : -4.5) };
  isBtRunning = true;

  const handleBtTouch = (e) => {
    e.preventDefault();
    if (!isBtRunning) return;
    const rect = blocktennisCanvas.getBoundingClientRect();
    const midY = blocktennisCanvas.height / 2;
    const touches = e.touches ? Array.from(e.touches) : [e];
    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      const tx = t.clientX - rect.left;
      const ty = t.clientY - rect.top;
      if (ty < midY) btPaddle1 = Math.max(0, Math.min(w - 80, tx - 40));
      else btPaddle2 = Math.max(0, Math.min(w - 80, tx - 40));
    }
  };
  blocktennisCanvas.onpointerdown = handleBtTouch;
  blocktennisCanvas.onpointermove = handleBtTouch;
  blocktennisCanvas.ontouchstart = handleBtTouch;
  blocktennisCanvas.ontouchmove = handleBtTouch;

  requestAnimationFrame(btLoop);
}

function btLoop() {
  if (currentScreen !== 'screen-blocktennis' || !isBtRunning) return;

  const ctx = blocktennisCtx;
  const w = blocktennisCanvas.width;
  const h = blocktennisCanvas.height;
  const p1Y = getTopSafeY();
  const p2Y = h - 35;

  btBall.x += btBall.vx;
  btBall.y += btBall.vy;

  btObstacleX += btObstacleVx;
  if (btObstacleX < 40 || btObstacleX > w - 40) btObstacleVx = -btObstacleVx;

  if (btBall.x < 15 || btBall.x > w - 15) {
    btBall.vx = -btBall.vx;
    window.sounds.playTap();
  }

  // 中央障害物反射
  if (Math.abs(btBall.y - h / 2) < 18 && Math.abs(btBall.x - btObstacleX) < 40) {
    btBall.vy = -btBall.vy;
    window.sounds.playTap();
  }

  // パドル反射 P1 (上)
  if (btBall.y - 12 <= p1Y + 14 && btBall.vy < 0 && btBall.y >= p1Y - 10) {
    if (btBall.x >= btPaddle1 && btBall.x <= btPaddle1 + 80) {
      btBall.vy = -btBall.vy * 1.05;
      btBall.vx = (btBall.x - (btPaddle1 + 40)) * 0.15;
      window.sounds.playTap();
    }
  }

  // パドル反射 P2 (下)
  if (btBall.y + 12 >= p2Y && btBall.vy > 0 && btBall.y <= p2Y + 24) {
    if (btBall.x >= btPaddle2 && btBall.x <= btPaddle2 + 80) {
      btBall.vy = -btBall.vy * 1.05;
      btBall.vx = (btBall.x - (btPaddle2 + 40)) * 0.15;
      window.sounds.playTap();
    }
  }

  // アウト判定
  if (btBall.y < getTopSafeY() - 25) {
    isBtRunning = false;
    window.sounds.playSuccess();
    showModal(`🎾 プレイヤー 2 の勝利！`, `相手のコートを撃ち抜きました！`, () => {
      initBlockTennisGame();
    });
    return;
  } else if (btBall.y > h) {
    isBtRunning = false;
    window.sounds.playSuccess();
    showModal(`🎾 プレイヤー 1 の勝利！`, `相手のコートを撃ち抜きました！`, () => {
      initBlockTennisGame();
    });
    return;
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // センターライン
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 中央動くブロック
  ctx.fillStyle = '#facc15';
  ctx.fillRect(btObstacleX - 40, h / 2 - 10, 80, 20);

  // パドル描画 P1 (赤) & P2 (青)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(btPaddle1, p1Y, 80, 14);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(btPaddle2, p2Y, 80, 14);

  // ガイドラベル (P1は対面向き、P2は通常向き)
  drawP1Text(ctx, '🔴 P1: スライドして打ち返せ！', w / 2, p1Y + 28, 'bold 14px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: スライドして打ち返せ！', w / 2, p2Y - 16);

  // ボール
  ctx.beginPath();
  ctx.arc(btBall.x, btBall.y, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  requestAnimationFrame(btLoop);
}

/* ============================================================
   40. シーソー・カタパルト (Seesaw Launcher)
   ============================================================ */
let seesawCanvas, seesawCtx;
let seesawSide = 'left';
let seesawStar = { x: 50, y: 50 };
let seesawScore1 = 0, seesawScore2 = 0;
let isSeesawRunning = false;

function initSeesawGame() {
  seesawCanvas = document.getElementById('seesaw-canvas');
  seesawCtx = seesawCanvas.getContext('2d');
  seesawCanvas.width = seesawCanvas.clientWidth;
  seesawCanvas.height = seesawCanvas.clientHeight;

  seesawScore1 = 0;
  seesawScore2 = 0;
  seesawSide = 'left';
  seesawStar = { x: seesawCanvas.width / 2, y: getTopSafeY() + 15 };
  isSeesawRunning = true;

  seesawCanvas.onpointerdown = (e) => {
    if (!isSeesawRunning) return;
    const y = e.clientY - seesawCanvas.getBoundingClientRect().top;
    const player = y < seesawCanvas.height / 2 ? 1 : 2;

    window.sounds.playJump();
    seesawSide = seesawSide === 'left' ? 'right' : 'left';

    if (player === 1) seesawScore1++; else seesawScore2++;
    window.sounds.playCoin();

    if (seesawScore1 >= 5 || seesawScore2 >= 5) {
      isSeesawRunning = false;
      window.sounds.playSuccess();
      const winner = seesawScore1 >= 5 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🎪 ${winner} の大ジャンプ勝利！`, `見事5つの星をキャッチ！`, () => {
        initSeesawGame();
      });
    }
  };

  requestAnimationFrame(seesawLoop);
}

function seesawLoop() {
  if (currentScreen !== 'screen-seesaw' || !isSeesawRunning) return;

  const ctx = seesawCtx;
  const w = seesawCanvas.width;
  const h = seesawCanvas.height;
  const midX = w / 2;
  const midY = h / 2;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 星
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⭐', midX, getTopSafeY() + 15);

  // スコア
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${seesawScore1}/5`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${seesawScore2}/5`, 30, h - 25);

  // シーソー描画
  ctx.save();
  ctx.translate(midX, midY);
  ctx.rotate(seesawSide === 'left' ? -0.2 : 0.2);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-90, -8, 180, 16);
  ctx.restore();

  requestAnimationFrame(seesawLoop);
}

/* ============================================================
   41. ボウリング・ストライク (Bowling Strike)
   ============================================================ */
let bowlingCanvas, bowlingCtx;
let bowlingBall = null;
let bowlingPins = [];
let bowlingScore1 = 0, bowlingScore2 = 0;
let isBowlingRunning = false;

function initBowlingGame() {
  bowlingCanvas = document.getElementById('bowling-canvas');
  bowlingCtx = bowlingCanvas.getContext('2d');
  bowlingCanvas.width = bowlingCanvas.clientWidth;
  bowlingCanvas.height = bowlingCanvas.clientHeight;

  const w = bowlingCanvas.width;
  const h = bowlingCanvas.height;

  bowlingScore1 = 0;
  bowlingScore2 = 0;
  bowlingBall = null;
  isBowlingRunning = true;

  resetBowlingPins();

  let startY = 0;
  bowlingCanvas.onpointerdown = (e) => {
    startY = e.clientY - bowlingCanvas.getBoundingClientRect().top;
  };

  bowlingCanvas.onpointerup = (e) => {
    if (!isBowlingRunning || bowlingBall) return;
    const endY = e.clientY - bowlingCanvas.getBoundingClientRect().top;
    const player = startY > h / 2 ? 2 : 1;
    const speed = (startY - endY) * 0.15;

    bowlingBall = {
      x: w / 2,
      y: player === 2 ? h - 40 : 40,
      vy: player === 2 ? -Math.max(6, Math.min(16, speed)) : Math.max(6, Math.min(16, -speed)),
      radius: 15,
      player: player
    };
    window.sounds.playSlash();
  };

  requestAnimationFrame(bowlingLoop);
}

function resetBowlingPins() {
  const w = bowlingCanvas.width;
  const h = bowlingCanvas.height;
  bowlingPins = [];
  // 中央にピンを三角配置
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c <= r; c++) {
      bowlingPins.push({
        x: w / 2 + (c - r / 2) * 24,
        y: h / 2 - 20 + r * 20,
        alive: true
      });
    }
  }
}

function bowlingLoop() {
  if (currentScreen !== 'screen-bowling' || !isBowlingRunning) return;

  const ctx = bowlingCtx;
  const w = bowlingCanvas.width;
  const h = bowlingCanvas.height;

  if (bowlingBall) {
    bowlingBall.y += bowlingBall.vy;

    // ピン衝突
    bowlingPins.forEach(p => {
      if (p.alive && Math.hypot(bowlingBall.x - p.x, bowlingBall.y - p.y) < bowlingBall.radius + 12) {
        p.alive = false;
        window.sounds.playCoin();
        if (bowlingBall.player === 1) bowlingScore1++; else bowlingScore2++;
      }
    });

    if (bowlingBall.y < 0 || bowlingBall.y > h) {
      bowlingBall = null;
      if (bowlingScore1 >= 6 || bowlingScore2 >= 6) {
        isBowlingRunning = false;
        window.sounds.playSuccess();
        const winner = bowlingScore1 >= 6 ? 'プレイヤー 1' : 'プレイヤー 2';
        showModal(`🎳 STRIKE!`, `${winner} の勝利！ピンを爽快に吹き飛ばしました！`, () => {
          initBowlingGame();
        });
        return;
      }
    }
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // レーン
  ctx.fillStyle = '#78350f';
  ctx.fillRect(w / 2 - 70, 0, 140, h);

  // ピン
  bowlingPins.forEach(p => {
    if (p.alive) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ef4444';
      ctx.stroke();
    }
  });

  // ボール
  if (bowlingBall) {
    ctx.beginPath();
    ctx.arc(bowlingBall.x, bowlingBall.y, bowlingBall.radius, 0, Math.PI * 2);
    ctx.fillStyle = bowlingBall.player === 1 ? '#ef4444' : '#3b82f6';
    ctx.fill();
  }

  // スコア
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${bowlingScore1}/6`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${bowlingScore2}/6`, 30, h - 25);

  requestAnimationFrame(bowlingLoop);
}

/* ============================================================
   42. ホッケー・ドリブル (Hockey Dribble)
   ============================================================ */
let dribbleCanvas, dribbleCtx;
let dribbleP1, dribbleP2;
let isDribbleRunning = false;

function initDribbleGame() {
  dribbleCanvas = document.getElementById('dribble-canvas');
  dribbleCtx = dribbleCanvas.getContext('2d');
  dribbleCanvas.width = dribbleCanvas.clientWidth;
  dribbleCanvas.height = dribbleCanvas.clientHeight;

  const w = dribbleCanvas.width;
  const h = dribbleCanvas.height;
  const topY = getTopSafeY();

  dribbleP1 = { x: w / 2, y: topY + 35 };
  dribbleP2 = { x: w / 2, y: h - 55 };
  isDribbleRunning = true;

  dribbleCanvas.onpointerdown = (e) => {
    if (!isDribbleRunning) return;
    const x = e.clientX - dribbleCanvas.getBoundingClientRect().left;
    const y = e.clientY - dribbleCanvas.getBoundingClientRect().top;
    if (y < h / 2) {
      dribbleP1.x = x;
      dribbleP1.y += 18;
      window.sounds.playTap();
    } else {
      dribbleP2.x = x;
      dribbleP2.y -= 18;
      window.sounds.playTap();
    }

    if (dribbleP1.y >= h / 2 - 20) {
      isDribbleRunning = false;
      window.sounds.playSuccess();
      showModal(`🏒 ゴール！`, `プレイヤー 1 の勝利！見事なドリブル突破！`, () => {
        initDribbleGame();
      });
    } else if (dribbleP2.y <= h / 2 + 20) {
      isDribbleRunning = false;
      window.sounds.playSuccess();
      showModal(`🏒 ゴール！`, `プレイヤー 2 の勝利！見事なドリブル突破！`, () => {
        initDribbleGame();
      });
    }
  };

  requestAnimationFrame(dribbleLoop);
}

function dribbleLoop() {
  if (currentScreen !== 'screen-dribble' || !isDribbleRunning) return;

  const ctx = dribbleCtx;
  const w = dribbleCanvas.width;
  const h = dribbleCanvas.height;
  const topY = getTopSafeY();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 中央ゴールライン
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: タップで障害物を避けて前進！', w / 2, topY + 16, 'bold 15px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: タップで障害物を避けて前進！', w / 2, h - 30);

  // コーン
  ctx.font = '26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔺', w * 0.35, h * 0.28);
  ctx.fillText('🔺', w * 0.65, h * 0.36);
  ctx.fillText('🔺', w * 0.35, h * 0.64);
  ctx.fillText('🔺', w * 0.65, h * 0.72);

  // パック / ボール
  ctx.beginPath();
  ctx.arc(dribbleP1.x, dribbleP1.y, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(dribbleP2.x, dribbleP2.y, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();

  requestAnimationFrame(dribbleLoop);
}

/* ============================================================
   43. 重力反転ランナー (Gravity Flip Runner)
   ============================================================ */
let gravityCanvas, gravityCtx;
let gravityP1, gravityP2;
let gravitySpikes1 = [], gravitySpikes2 = [];
let isGravityRunning = false;

function initGravityGame() {
  gravityCanvas = document.getElementById('gravity-canvas');
  gravityCtx = gravityCanvas.getContext('2d');
  gravityCanvas.width = gravityCanvas.clientWidth;
  gravityCanvas.height = gravityCanvas.clientHeight;

  const h = gravityCanvas.height;
  gravityP1 = { y: h * 0.32, onCeiling: false };
  gravityP2 = { y: h * 0.85, onCeiling: false };
  gravitySpikes1 = [];
  gravitySpikes2 = [];
  isGravityRunning = true;

  gravityCanvas.onpointerdown = (e) => {
    if (!isGravityRunning) return;
    const y = e.clientY - gravityCanvas.getBoundingClientRect().top;
    if (y < h / 2) {
      gravityP1.onCeiling = !gravityP1.onCeiling;
      window.sounds.playJump();
    } else {
      gravityP2.onCeiling = !gravityP2.onCeiling;
      window.sounds.playJump();
    }
  };

  requestAnimationFrame(gravityLoop);
}

function gravityLoop() {
  if (currentScreen !== 'screen-gravity' || !isGravityRunning) return;

  const ctx = gravityCtx;
  const w = gravityCanvas.width;
  const h = gravityCanvas.height;
  const topY = getTopSafeY();

  // P1レーン (上半分)
  const floor1 = h * 0.35, ceil1 = topY + 40;
  // P2レーン (下半分)
  const floor2 = h * 0.86, ceil2 = h * 0.62;

  // プレイヤー位置補間
  gravityP1.y += (gravityP1.onCeiling ? ceil1 - gravityP1.y : floor1 - gravityP1.y) * 0.28;
  gravityP2.y += (gravityP2.onCeiling ? ceil2 - gravityP2.y : floor2 - gravityP2.y) * 0.28;

  // トゲ生成
  if (Math.random() < 0.026) {
    gravitySpikes1.push({ x: w + 20, isCeil: Math.random() < 0.5 });
  }
  if (Math.random() < 0.026) {
    gravitySpikes2.push({ x: w + 20, isCeil: Math.random() < 0.5 });
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // レーン描画 (床と天井)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  // P1 レーン
  ctx.beginPath();
  ctx.moveTo(0, ceil1); ctx.lineTo(w, ceil1);
  ctx.moveTo(0, floor1); ctx.lineTo(w, floor1);
  ctx.stroke();

  // P2 レーン
  ctx.beginPath();
  ctx.moveTo(0, ceil2); ctx.lineTo(w, ceil2);
  ctx.moveTo(0, floor2); ctx.lineTo(w, floor2);
  ctx.stroke();

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: タップで重力反転して障害物を回避！', w / 2, topY + 16, 'bold 14px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: タップで重力反転して障害物を回避！', w / 2, h - 30);

  // P1 レーン描画 (180度反転して対面向き)
  ctx.save();
  const p1MidY = (ceil1 + floor1) / 2;
  ctx.translate(w / 2, p1MidY);
  ctx.rotate(Math.PI);
  // P1 キャラクター (相対座標)
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  const p1RelY = gravityP1.y - p1MidY;
  ctx.fillText('🏃', (w / 2) - 60, -p1RelY + 10);
  ctx.restore();

  // P1 トゲ更新と判定
  let hit1 = false;
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  for (let i = gravitySpikes1.length - 1; i >= 0; i--) {
    const s = gravitySpikes1[i];
    s.x -= 4.2;
    const sy = s.isCeil ? ceil1 + 14 : floor1 - 6;
    ctx.fillText('🔺', s.x, sy);

    if (Math.abs(s.x - 60) < 18) {
      if ((s.isCeil && gravityP1.onCeiling) || (!s.isCeil && !gravityP1.onCeiling)) {
        hit1 = true;
      }
    }
    if (s.x < -20) gravitySpikes1.splice(i, 1);
  }

  // P2 キャラクター描画
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏃', 60, gravityP2.y);

  // P2 トゲ更新と判定
  let hit2 = false;
  for (let i = gravitySpikes2.length - 1; i >= 0; i--) {
    const s = gravitySpikes2[i];
    s.x -= 4.2;
    const sy = s.isCeil ? ceil2 + 14 : floor2 - 6;
    ctx.fillText('🔺', s.x, sy);

    if (Math.abs(s.x - 60) < 18) {
      if ((s.isCeil && gravityP2.onCeiling) || (!s.isCeil && !gravityP2.onCeiling)) {
        hit2 = true;
      }
    }
    if (s.x < -20) gravitySpikes2.splice(i, 1);
  }

  if ((hit1 || hit2) && isGravityRunning) {
    isGravityRunning = false;
    window.sounds.playError();
    const winner = hit1 ? 'プレイヤー 2 の勝利！' : 'プレイヤー 1 の勝利！';
    showModal(`💥 激突！`, `${winner} 障害物を避けきりました！`, () => {
      initGravityGame();
    });
    return;
  }

  requestAnimationFrame(gravityLoop);
}

/* ============================================================
   44. トマホーク・スロー (Axe Throw)
   ============================================================ */
let axeCanvas, axeCtx;
let axeAngle = 0;
let axeScore1 = 0, axeScore2 = 0;
let isAxeRunning = false;

function initAxeGame() {
  axeCanvas = document.getElementById('axe-canvas');
  axeCtx = axeCanvas.getContext('2d');
  axeCanvas.width = axeCanvas.clientWidth;
  axeCanvas.height = axeCanvas.clientHeight;

  axeAngle = 0;
  axeScore1 = 0;
  axeScore2 = 0;
  isAxeRunning = true;

  axeCanvas.onpointerdown = (e) => {
    if (!isAxeRunning) return;
    const y = e.clientY - axeCanvas.getBoundingClientRect().top;
    const player = y < axeCanvas.height / 2 ? 1 : 2;
    const rot = Math.abs(Math.sin(axeAngle));

    if (rot > 0.85) {
      window.sounds.playGunshot();
      if (player === 1) axeScore1 += 50; else axeScore2 += 50;
    } else {
      window.sounds.playTap();
      if (player === 1) axeScore1 += 10; else axeScore2 += 10;
    }

    if (axeScore1 >= 100 || axeScore2 >= 100) {
      isAxeRunning = false;
      window.sounds.playSuccess();
      const winner = axeScore1 >= 100 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🪓 的中！`, `${winner} の勝利！見事なアックススロー！`, () => {
        initAxeGame();
      });
    }
  };

  requestAnimationFrame(axeLoop);
}

function axeLoop() {
  if (currentScreen !== 'screen-axe' || !isAxeRunning) return;

  const ctx = axeCtx;
  const w = axeCanvas.width;
  const h = axeCanvas.height;

  axeAngle += 0.08;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 的
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
  ctx.fill();

  // 回転する斧
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(axeAngle);
  ctx.font = '50px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🪓', 0, 0);
  ctx.restore();

  // スコア
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${axeScore1}/100`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${axeScore2}/100`, 30, h - 25);

  requestAnimationFrame(axeLoop);
}

/* ============================================================
   45. バルーン・ポップ (Balloon Pop Duel)
   ============================================================ */
let balloonCanvas, balloonCtx;
let balloonList = [];
let balloonScore1 = 0, balloonScore2 = 0;
let isBalloonRunning = false;

function initBalloonGame() {
  balloonCanvas = document.getElementById('balloon-canvas');
  balloonCtx = balloonCanvas.getContext('2d');
  balloonCanvas.width = balloonCanvas.clientWidth;
  balloonCanvas.height = balloonCanvas.clientHeight;

  balloonScore1 = 0;
  balloonScore2 = 0;
  balloonList = [];
  isBalloonRunning = true;

  balloonCanvas.onpointerdown = (e) => {
    const x = e.clientX - balloonCanvas.getBoundingClientRect().left;
    const y = e.clientY - balloonCanvas.getBoundingClientRect().top;
    const player = y < balloonCanvas.height / 2 ? 1 : 2;

    for (let i = balloonList.length - 1; i >= 0; i--) {
      const b = balloonList[i];
      if (Math.hypot(x - b.x, y - b.y) < b.radius + 15) {
        balloonList.splice(i, 1);
        if (b.bomb) {
          window.sounds.playExplosion();
          if (player === 1) balloonScore1 -= 2; else balloonScore2 -= 2;
        } else {
          window.sounds.playCoin();
          if (player === 1) balloonScore1++; else balloonScore2++;
        }
        checkBalloonWinner();
        return;
      }
    }
  };

  requestAnimationFrame(balloonLoop);
}

function balloonLoop() {
  if (currentScreen !== 'screen-balloon' || !isBalloonRunning) return;

  const ctx = balloonCtx;
  const w = balloonCanvas.width;
  const h = balloonCanvas.height;

  if (Math.random() < 0.05 && balloonList.length < 10) {
    balloonList.push({
      x: 30 + Math.random() * (w - 60),
      y: h + 20,
      vy: -3 - Math.random() * 3,
      radius: 20,
      bomb: Math.random() < 0.2
    });
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${balloonScore1}/8`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${balloonScore2}/8`, 30, h - 25);

  for (let i = balloonList.length - 1; i >= 0; i--) {
    const b = balloonList[i];
    b.y += b.vy;

    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(b.bomb ? '💣' : '🎈', b.x, b.y);

    if (b.y < -30) balloonList.splice(i, 1);
  }

  requestAnimationFrame(balloonLoop);
}

function checkBalloonWinner() {
  if (balloonScore1 >= 8 || balloonScore2 >= 8) {
    isBalloonRunning = false;
    window.sounds.playSuccess();
    const winner = balloonScore1 >= 8 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal(`🎈 ${winner} の勝利！`, `風船を素早く割り尽くしました！`, () => {
      initBalloonGame();
    });
  }
}

/* ============================================================
   46. アームレスリング (Arm Wrestling)
   ============================================================ */
let armCanvas, armCtx;
let armPower = 50;
let isArmRunning = false;

function initArmGame() {
  armCanvas = document.getElementById('arm-canvas');
  armCtx = armCanvas.getContext('2d');
  armCanvas.width = armCanvas.clientWidth;
  armCanvas.height = armCanvas.clientHeight;

  armPower = 50;
  isArmRunning = true;

  armCanvas.onpointerdown = (e) => {
    if (!isArmRunning) return;
    const y = e.clientY - armCanvas.getBoundingClientRect().top;
    if (y < armCanvas.height / 2) {
      armPower -= 3.5;
      window.sounds.playTap();
    } else {
      armPower += 3.5;
      window.sounds.playTap();
    }

    if (armPower <= 10) {
      isArmRunning = false;
      window.sounds.playSuccess();
      showModal(`💪 プレイヤー 1 の怪力勝利！`, `相手の腕を机に叩きつけました！`, () => {
        initArmGame();
      });
    } else if (armPower >= 90) {
      isArmRunning = false;
      window.sounds.playSuccess();
      showModal(`💪 プレイヤー 2 の怪力勝利！`, `相手の腕を机に叩きつけました！`, () => {
        initArmGame();
      });
    }
  };

  requestAnimationFrame(armLoop);
}

function armLoop() {
  if (currentScreen !== 'screen-arm' || !isArmRunning) return;

  const ctx = armCtx;
  const w = armCanvas.width;
  const h = armCanvas.height;
  const topY = getTopSafeY();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 中央仕切り
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: 画面を連打して相手の腕を倒せ！', w / 2, topY + 16, 'bold 15px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: 画面を連打して相手の腕を倒せ！', w / 2, h - 30);

  // パワーゲージ
  const barW = w * 0.75;
  const barH = 24;
  const barX = (w - barW) / 2;
  const barY = h / 2 - 50;

  ctx.fillStyle = '#334155';
  ctx.fillRect(barX, barY, barW, barH);

  // P1側パワー (赤)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(barX, barY, barW * (1 - armPower / 100), barH);

  // P2側パワー (青)
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(barX + barW * (1 - armPower / 100), barY, barW * (armPower / 100), barH);

  // 腕相撲絵文字
  ctx.font = '65px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🤼', w / 2, h / 2 + 50);

  requestAnimationFrame(armLoop);
}

/* ============================================================
   47. ピットストップ・レース (Pit Stop)
   ============================================================ */
let pitstopCanvas, pitstopCtx;
let pitstopBolts1 = 8, pitstopBolts2 = 8;
let isPitstopRunning = false;

function initPitstopGame() {
  pitstopCanvas = document.getElementById('pitstop-canvas');
  pitstopCtx = pitstopCanvas.getContext('2d');
  pitstopCanvas.width = pitstopCanvas.clientWidth;
  pitstopCanvas.height = pitstopCanvas.clientHeight;

  pitstopBolts1 = 8;
  pitstopBolts2 = 8;
  isPitstopRunning = true;

  pitstopCanvas.onpointerdown = (e) => {
    if (!isPitstopRunning) return;
    const y = e.clientY - pitstopCanvas.getBoundingClientRect().top;
    if (y < pitstopCanvas.height / 2 && pitstopBolts1 > 0) {
      pitstopBolts1--;
      window.sounds.playCoin();
    } else if (y >= pitstopCanvas.height / 2 && pitstopBolts2 > 0) {
      pitstopBolts2--;
      window.sounds.playCoin();
    }

    if (pitstopBolts1 === 0 || pitstopBolts2 === 0) {
      isPitstopRunning = false;
      window.sounds.playSuccess();
      const winner = pitstopBolts1 === 0 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🏎️ タイヤ交換完了！`, `${winner} が驚異のピット作業で勝利！`, () => {
        initPitstopGame();
      });
    }
  };

  requestAnimationFrame(pitstopLoop);
}

function pitstopLoop() {
  if (currentScreen !== 'screen-pitstop' || !isPitstopRunning) return;

  const ctx = pitstopCtx;
  const w = pitstopCanvas.width;
  const h = pitstopCanvas.height;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#ef4444';
  ctx.textAlign = 'center';
  ctx.font = 'bold 16px sans-serif';
  drawP1Text(ctx, `P1 残りボルト: ${pitstopBolts1}個`, w / 2, getTopSafeY(), 'bold 20px sans-serif', '#ef4444', 'center');

  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`P2 残りボルト: ${pitstopBolts2}個`, w / 2, h - 70);

  ctx.font = '70px sans-serif';
  ctx.fillText('🛞', w / 2, h * 0.35);
  ctx.fillText('🛞', w / 2, h * 0.65);

  requestAnimationFrame(pitstopLoop);
}

/* ============================================================
   48. レーザー・ミラー (Laser Mirror)
   ============================================================ */
let laserCanvas, laserCtx;
let laserAngle = 0;
let isLaserRunning = false;

function initLaserGame() {
  laserCanvas = document.getElementById('laser-canvas');
  laserCtx = laserCanvas.getContext('2d');
  laserCanvas.width = laserCanvas.clientWidth;
  laserCanvas.height = laserCanvas.clientHeight;

  laserAngle = 0;
  isLaserRunning = true;

  laserCanvas.onpointerdown = (e) => {
    if (!isLaserRunning) return;
    const y = e.clientY - laserCanvas.getBoundingClientRect().top;
    if (y < laserCanvas.height / 2) {
      // P1: ミラーを回転
      laserAngle += 0.22;
      window.sounds.playTap();
    } else {
      // P2: ミラーを逆回転
      laserAngle -= 0.22;
      window.sounds.playTap();
    }

    // コア照射判定
    const sinVal = Math.sin(laserAngle);
    if (sinVal > 0.92) {
      // P1の勝利 (レーザーがP2コアへ到達)
      isLaserRunning = false;
      window.sounds.playGunshot();
      showModal(`💥 コア破壊！`, `プレイヤー 1 の勝利！反射レーザーで相手コアを撃ち抜きました！`, () => {
        initLaserGame();
      });
    } else if (sinVal < -0.92) {
      // P2の勝利 (レーザーがP1コアへ到達)
      isLaserRunning = false;
      window.sounds.playGunshot();
      showModal(`💥 コア破壊！`, `プレイヤー 2 の勝利！反射レーザーで相手コアを撃ち抜きました！`, () => {
        initLaserGame();
      });
    }
  };

  requestAnimationFrame(laserLoop);
}

function laserLoop() {
  if (currentScreen !== 'screen-laser' || !isLaserRunning) return;

  const ctx = laserCtx;
  const w = laserCanvas.width;
  const h = laserCanvas.height;
  const topY = getTopSafeY();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: タップでミラーを回転して相手コアを狙え！', w / 2, topY + 16, 'bold 14px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: タップでミラーを回転して相手コアを狙え！', w / 2, h - 30);

  // コアターゲット P1 (上)
  ctx.beginPath();
  ctx.arc(w / 2, topY + 45, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // コアターゲット P2 (下)
  ctx.beginPath();
  ctx.arc(w / 2, h - 60, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 中央ミラー
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(laserAngle);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-50, -6, 100, 12);
  ctx.restore();

  // 反射レーザー光線
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h / 2);
  ctx.lineTo(w / 2, h / 2);
  const endY = (h / 2) + Math.sin(laserAngle) * (h * 0.42);
  ctx.lineTo(w / 2, endY);
  ctx.stroke();

  requestAnimationFrame(laserLoop);
}

/* ============================================================
   49. カンガルー・ポゴ (Kangaroo Pogo)
   ============================================================ */
let pogoCanvas, pogoCtx;
let pogoScore1 = 0, pogoScore2 = 0;
let isPogoRunning = false;

function initPogoGame() {
  pogoCanvas = document.getElementById('pogo-canvas');
  pogoCtx = pogoCanvas.getContext('2d');
  pogoCanvas.width = pogoCanvas.clientWidth;
  pogoCanvas.height = pogoCanvas.clientHeight;

  pogoScore1 = 0;
  pogoScore2 = 0;
  isPogoRunning = true;

  pogoCanvas.onpointerdown = (e) => {
    const y = e.clientY - pogoCanvas.getBoundingClientRect().top;
    window.sounds.playJump();
    if (y < pogoCanvas.height / 2) pogoScore1++; else pogoScore2++;

    if (pogoScore1 >= 10 || pogoScore2 >= 10) {
      isPogoRunning = false;
      window.sounds.playSuccess();
      const winner = pogoScore1 >= 10 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🦘 ${winner} の大跳躍勝利！`, `ポゴジャンプでコインを10枚獲得！`, () => {
        initPogoGame();
      });
    }
  };

  requestAnimationFrame(pogoLoop);
}

function pogoLoop() {
  if (currentScreen !== 'screen-pogo' || !isPogoRunning) return;

  const ctx = pogoCtx;
  const w = pogoCanvas.width;
  const h = pogoCanvas.height;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${pogoScore1}/10`, 58, getTopSafeY());
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`P2: ${pogoScore2}/10`, 30, h - 25);

  ctx.font = '60px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🦘', w / 2, h * 0.35 + Math.sin(performance.now() * 0.01) * 30);
  ctx.fillText('🦘', w / 2, h * 0.65 + Math.cos(performance.now() * 0.01) * 30);

  requestAnimationFrame(pogoLoop);
}

/* ============================================================
   50. フェンシング・デュエル (Fencing Duel)
   ============================================================ */
let fencingCanvas, fencingCtx;
let fencingDist = 100;
let isFencingRunning = false;

function initFencingGame() {
  fencingCanvas = document.getElementById('fencing-canvas');
  fencingCtx = fencingCanvas.getContext('2d');
  fencingCanvas.width = fencingCanvas.clientWidth;
  fencingCanvas.height = fencingCanvas.clientHeight;

  fencingDist = 100;
  isFencingRunning = true;

  fencingCanvas.onpointerdown = (e) => {
    if (!isFencingRunning) return;
    const y = e.clientY - fencingCanvas.getBoundingClientRect().top;
    const player = y < fencingCanvas.height / 2 ? 1 : 2;

    window.sounds.playSlash();
    if (fencingDist < 45) {
      isFencingRunning = false;
      window.sounds.playSuccess();
      const winner = player === 1 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🤺 クード・グラース！`, `${winner} の電光石火の突きが決まりました！`, () => {
        initFencingGame();
      });
    }
  };

  requestAnimationFrame(fencingLoop);
}

function fencingLoop() {
  if (currentScreen !== 'screen-fencing' || !isFencingRunning) return;

  const ctx = fencingCtx;
  const w = fencingCanvas.width;
  const h = fencingCanvas.height;
  const topY = getTopSafeY();

  fencingDist = 30 + Math.abs(Math.sin(performance.now() * 0.003)) * 80;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 中央仕切り
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 対面ラベル
  drawP1Text(ctx, `🔴 P1: 間合い ${Math.round(fencingDist)}cm (間合いに入ったら突け!)`, w / 2, topY + 16, 'bold 15px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText(`🔵 P2: 間合い ${Math.round(fencingDist)}cm (間合いに入ったら突け!)`, w / 2, h - 30);

  // フェンサー P1 (上側、180度反転してP2に向かって構える)
  ctx.save();
  ctx.translate(w / 2, (h / 2) - fencingDist - 20);
  ctx.rotate(Math.PI);
  ctx.font = '55px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🤺', 0, 0);
  ctx.restore();

  // フェンサー P2 (下側、P1に向かって構える)
  ctx.save();
  ctx.translate(w / 2, (h / 2) + fencingDist + 20);
  ctx.font = '55px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🤺', 0, 0);
  ctx.restore();

  requestAnimationFrame(fencingLoop);
}

/* ============================================================
   51. 早弁ウォンテッド (Stealth Lunch)
   ============================================================ */
let stealthlunchCanvas, stealthlunchCtx;
let lunchP1Progress = 0, lunchP2Progress = 0;
let teacherState = 'writing'; // 'writing', 'warn', 'watching'
let teacherTimer = 0;
let p1Holding = false, p2Holding = false;
let isLunchRunning = false;

function initStealthLunchGame() {
  stealthlunchCanvas = document.getElementById('stealthlunch-canvas');
  stealthlunchCtx = stealthlunchCanvas.getContext('2d');
  stealthlunchCanvas.width = stealthlunchCanvas.clientWidth;
  stealthlunchCanvas.height = stealthlunchCanvas.clientHeight;

  lunchP1Progress = 0;
  lunchP2Progress = 0;
  teacherState = 'writing';
  teacherTimer = 120 + Math.random() * 100;
  p1Holding = false;
  p2Holding = false;
  isLunchRunning = true;

  stealthlunchCanvas.onpointerdown = (e) => {
    if (!isLunchRunning) return;
    const y = e.clientY - stealthlunchCanvas.getBoundingClientRect().top;
    if (y < stealthlunchCanvas.height / 2) {
      p1Holding = true;
    } else {
      p2Holding = true;
    }
    window.sounds.playTap();
  };

  stealthlunchCanvas.onpointerup = (e) => {
    const y = e.clientY - stealthlunchCanvas.getBoundingClientRect().top;
    if (y < stealthlunchCanvas.height / 2) {
      p1Holding = false;
    } else {
      p2Holding = false;
    }
  };

  requestAnimationFrame(stealthlunchLoop);
}

function stealthlunchLoop() {
  if (currentScreen !== 'screen-stealthlunch' || !isLunchRunning) return;

  const ctx = stealthlunchCtx;
  const w = stealthlunchCanvas.width;
  const h = stealthlunchCanvas.height;

  // Teacher AI update
  teacherTimer--;
  if (teacherTimer <= 0) {
    if (teacherState === 'writing') {
      teacherState = 'warn';
      teacherTimer = 40; // 0.6s warning
      window.sounds.playCountdown();
    } else if (teacherState === 'warn') {
      teacherState = 'watching';
      teacherTimer = 60 + Math.random() * 60; // 1-2s watching
      window.sounds.playGunshot();
    } else {
      teacherState = 'writing';
      teacherTimer = 100 + Math.random() * 120;
    }
  }

  // Eating logic
  if (p1Holding) {
    if (teacherState === 'watching') {
      // Caught!
      isLunchRunning = false;
      window.sounds.playExplosion();
      showModal('🚨 先生にバレた！', 'プレイヤー 1 が早弁を見つかりました！\nプレイヤー 2 の勝利！', () => {
        initStealthLunchGame();
      });
      return;
    } else {
      lunchP1Progress += 0.4;
      if (lunchP1Progress >= 100) {
        isLunchRunning = false;
        window.sounds.playSuccess();
        showModal('🍱 完食！', 'プレイヤー 1 が見事に弁当を食べきりました！', () => {
          initStealthLunchGame();
        });
        return;
      }
    }
  }

  if (p2Holding) {
    if (teacherState === 'watching') {
      // Caught!
      isLunchRunning = false;
      window.sounds.playExplosion();
      showModal('🚨 先生にバレた！', 'プレイヤー 2 が早弁を見つかりました！\nプレイヤー 1 の勝利！', () => {
        initStealthLunchGame();
      });
      return;
    } else {
      lunchP2Progress += 0.4;
      if (lunchP2Progress >= 100) {
        isLunchRunning = false;
        window.sounds.playSuccess();
        showModal('🍱 完食！', 'プレイヤー 2 が見事に弁当を食べきりました！', () => {
          initStealthLunchGame();
        });
        return;
      }
    }
  }

  // Render
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);

  // Middle line (Blackboard / Teacher area)
  ctx.fillStyle = '#065f46'; // Blackboard color
  ctx.fillRect(0, h / 2 - 60, w, 120);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';

  if (teacherState === 'writing') {
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('👨‍🏫 先生: 板書中... (長押しで早弁！)', w / 2, h / 2 - 25);
    ctx.font = '40px sans-serif';
    ctx.fillText('✍️ 👨‍🏫', w / 2, h / 2 + 30);
  } else if (teacherState === 'warn') {
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('⚠️ 先生: 「ん？物音が...」(指を離せ！)', w / 2, h / 2 - 25);
    ctx.font = '40px sans-serif';
    ctx.fillText('❓ 👨‍🏫 💦', w / 2, h / 2 + 30);
  } else {
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('👀 先生: ジーッ... (動くな！)', w / 2, h / 2 - 25);
    ctx.font = '40px sans-serif';
    ctx.fillText('👓 😠 💢', w / 2, h / 2 + 30);
  }

  // Player 1 (Top)
  ctx.fillStyle = '#334155';
  const lunchY = getTopSafeY();
  ctx.fillRect(20, lunchY, w - 40, h / 2 - (lunchY + 45));
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  drawP1Text(ctx, 'P1 (長押しで早弁)', 58, getTopSafeY() + 22);
  ctx.save();
  ctx.translate(w / 2, h * 0.25);
  ctx.rotate(Math.PI);
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(p1Holding ? '😋 🍱🥢' : '🤫 🍱', 0, 0);
  ctx.restore();
  // P1 Progress bar
  ctx.fillStyle = '#475569';
  ctx.fillRect(35, h * 0.35, w - 70, 16);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(35, h * 0.35, (w - 70) * (lunchP1Progress / 100), 16);

  // Player 2 (Bottom)
  ctx.fillStyle = '#334155';
  ctx.fillRect(20, h / 2 + 70, w - 40, h / 2 - 90);
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('P2 (長押しで早弁)', 35, h / 2 + 95);
  ctx.font = '36px sans-serif';
  ctx.fillText(p2Holding ? '😋 🍱🥢' : '🤫 🍱', w / 2 - 40, h * 0.75);
  // P2 Progress bar
  ctx.fillStyle = '#475569';
  ctx.fillRect(35, h * 0.85, w - 70, 16);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(35, h * 0.85, (w - 70) * (lunchP2Progress / 100), 16);

  requestAnimationFrame(stealthlunchLoop);
}

/* ============================================================
   52. 机の上の消しゴム落とし (Eraser Battle)
   ============================================================ */
let eraserCanvas, eraserCtx;
let eraserP1, eraserP2;
let eraserAiming = null;
let isEraserRunning = false;

function initEraserGame() {
  eraserCanvas = document.getElementById('eraser-canvas');
  eraserCtx = eraserCanvas.getContext('2d');
  eraserCanvas.width = eraserCanvas.clientWidth;
  eraserCanvas.height = eraserCanvas.clientHeight;

  const w = eraserCanvas.width;
  const h = eraserCanvas.height;

  eraserP1 = { x: w / 2, y: h * 0.25, vx: 0, vy: 0, r: 24, color: '#ef4444', label: 'MONO 1' };
  eraserP2 = { x: w / 2, y: h * 0.75, vx: 0, vy: 0, r: 24, color: '#3b82f6', label: 'MONO 2' };
  eraserAiming = null;
  isEraserRunning = true;

  eraserCanvas.onpointerdown = (e) => {
    if (!isEraserRunning) return;
    const rect = eraserCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const d1 = Math.hypot(x - eraserP1.x, y - eraserP1.y);
    const d2 = Math.hypot(x - eraserP2.x, y - eraserP2.y);
    if (d1 < 45) {
      eraserAiming = { player: 1, startX: eraserP1.x, startY: eraserP1.y, curX: x, curY: y };
    } else if (d2 < 45) {
      eraserAiming = { player: 2, startX: eraserP2.x, startY: eraserP2.y, curX: x, curY: y };
    }
  };

  eraserCanvas.onpointermove = (e) => {
    if (!eraserAiming) return;
    const rect = eraserCanvas.getBoundingClientRect();
    eraserAiming.curX = e.clientX - rect.left;
    eraserAiming.curY = e.clientY - rect.top;
  };

  eraserCanvas.onpointerup = () => {
    if (!eraserAiming) return;
    const p = eraserAiming.player === 1 ? eraserP1 : eraserP2;
    p.vx = (eraserAiming.startX - eraserAiming.curX) * 0.22;
    p.vy = (eraserAiming.startY - eraserAiming.curY) * 0.22;
    window.sounds.playGunshot();
    eraserAiming = null;
  };

  requestAnimationFrame(eraserLoop);
}

function eraserLoop() {
  if (currentScreen !== 'screen-eraser' || !isEraserRunning) return;

  const ctx = eraserCtx;
  const w = eraserCanvas.width;
  const h = eraserCanvas.height;
  const topY = getTopSafeY();

  // 物理挙動更新
  [eraserP1, eraserP2].forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
  });

  // 消しゴム同士の衝突
  const dist = Math.hypot(eraserP1.x - eraserP2.x, eraserP1.y - eraserP2.y);
  if (dist < eraserP1.r + eraserP2.r && dist > 0) {
    window.sounds.playTap();
    const overlap = (eraserP1.r + eraserP2.r) - dist;
    const nx = (eraserP1.x - eraserP2.x) / dist;
    const ny = (eraserP1.y - eraserP2.y) / dist;

    eraserP1.x += nx * overlap * 0.5;
    eraserP1.y += ny * overlap * 0.5;
    eraserP2.x -= nx * overlap * 0.5;
    eraserP2.y -= ny * overlap * 0.5;

    const kx = eraserP1.vx - eraserP2.vx;
    const ky = eraserP1.vy - eraserP2.vy;
    const p = 2 * (nx * kx + ny * ky) / 2;
    eraserP1.vx -= p * nx * 0.95;
    eraserP1.vy -= p * ny * 0.95;
    eraserP2.vx += p * nx * 0.95;
    eraserP2.vy += p * ny * 0.95;
  }

  // 机からの落下判定 (机の範囲: 左右20pxマージン、上下topY+10からh-20)
  const deskLeft = 20, deskRight = w - 20;
  const deskTop = topY + 20, deskBottom = h - 20;

  const p1Out = eraserP1.x < deskLeft || eraserP1.x > deskRight || eraserP1.y < deskTop || eraserP1.y > deskBottom;
  const p2Out = eraserP2.x < deskLeft || eraserP2.x > deskRight || eraserP2.y < deskTop || eraserP2.y > deskBottom;

  // 描画: 木目調の机
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#b45309';
  ctx.fillRect(deskLeft, deskTop, deskRight - deskLeft, deskBottom - deskTop);

  // 机の中央ライン
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(deskLeft, h / 2);
  ctx.lineTo(deskRight, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: 引っ張って相手を机から落とせ！', w / 2, topY + 14, 'bold 14px sans-serif', '#ffffff', 'center');
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: 引っ張って相手を机から落とせ！', w / 2, h - 25);

  // エイムライン
  if (eraserAiming) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(eraserAiming.startX, eraserAiming.startY);
    ctx.lineTo(eraserAiming.curX, eraserAiming.curY);
    ctx.stroke();
  }

  // 消しゴム P1 (180度反転文字)
  ctx.save();
  ctx.translate(eraserP1.x, eraserP1.y);
  ctx.fillStyle = eraserP1.color;
  ctx.fillRect(-eraserP1.r, -eraserP1.r * 0.7, eraserP1.r * 2, eraserP1.r * 1.4);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-eraserP1.r, -eraserP1.r * 0.7, eraserP1.r * 2, eraserP1.r * 1.4);
  ctx.rotate(Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MONO 1', 0, 4);
  ctx.restore();

  // 消しゴム P2
  ctx.save();
  ctx.translate(eraserP2.x, eraserP2.y);
  ctx.fillStyle = eraserP2.color;
  ctx.fillRect(-eraserP2.r, -eraserP2.r * 0.7, eraserP2.r * 2, eraserP2.r * 1.4);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-eraserP2.r, -eraserP2.r * 0.7, eraserP2.r * 2, eraserP2.r * 1.4);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MONO 2', 0, 4);
  ctx.restore();

  if ((p1Out || p2Out) && isEraserRunning) {
    isEraserRunning = false;
    window.sounds.playFall();
    const winner = p1Out && p2Out ? '引き分け！' : (p1Out ? 'プレイヤー 2 の勝利！' : 'プレイヤー 1 の勝利！');
    showModal(`落盤！`, `${winner}相手の消しゴムが机から落ちました！`, () => {
      initEraserGame();
    });
    return;
  }

  requestAnimationFrame(eraserLoop);
}

/* ============================================================
   53. ギリギリ寸止めチキンレース (Edge Stopper)
   ============================================================ */
let edgeCanvas, edgeCtx;
let car1X = 0, car2X = 0;
let car1Speed = 0, car2Speed = 0;
let car1Stopped = false, car2Stopped = false;
let isEdgeRunning = false;

function initEdgeStopperGame() {
  edgeCanvas = document.getElementById('edgestopper-canvas');
  edgeCtx = edgeCanvas.getContext('2d');
  edgeCanvas.width = edgeCanvas.clientWidth;
  edgeCanvas.height = edgeCanvas.clientHeight;

  car1X = 40;
  car2X = 40;
  car1Speed = 12 + Math.random() * 4;
  car2Speed = car1Speed;
  car1Stopped = false;
  car2Stopped = false;
  isEdgeRunning = true;

  edgeCanvas.onpointerdown = (e) => {
    if (!isEdgeRunning) return;
    const y = e.clientY - edgeCanvas.getBoundingClientRect().top;
    if (y < edgeCanvas.height / 2 && !car1Stopped) {
      car1Stopped = true;
      window.sounds.playGunshot();
    } else if (y >= edgeCanvas.height / 2 && !car2Stopped) {
      car2Stopped = true;
      window.sounds.playGunshot();
    }

    if (car1Stopped && car2Stopped) {
      evaluateEdgeResult();
    }
  };

  requestAnimationFrame(edgeStopperLoop);
}

function evaluateEdgeResult() {
  isEdgeRunning = false;
  const cliffX = edgeCanvas.width - 70;
  const p1Dist = cliffX - car1X;
  const p2Dist = cliffX - car2X;

  const p1Fell = p1Dist < 0;
  const p2Fell = p2Dist < 0;

  let msg = '';
  if (p1Fell && p2Fell) {
    msg = '両者崖から落下！ドロー！';
  } else if (p1Fell) {
    msg = `P1が落下！プレイヤー 2 の勝利！(残り: ${Math.round(p2Dist)}px)`;
  } else if (p2Fell) {
    msg = `P2が落下！プレイヤー 1 の勝利！(残り: ${Math.round(p1Dist)}px)`;
  } else if (p1Dist < p2Dist) {
    msg = `プレイヤー 1 の勝利！\n(P1: 残り${Math.round(p1Dist)}px vs P2: 残り${Math.round(p2Dist)}px)`;
  } else {
    msg = `プレイヤー 2 の勝利！\n(P2: 残り${Math.round(p2Dist)}px vs P1: 残り${Math.round(p1Dist)}px)`;
  }

  window.sounds.playSuccess();
  showModal('🛑 チキンレース判定！', msg, () => {
    initEdgeStopperGame();
  });
}

function edgeStopperLoop() {
  if (currentScreen !== 'screen-edgestopper' || !isEdgeRunning) return;

  const ctx = edgeCtx;
  const w = edgeCanvas.width;
  const h = edgeCanvas.height;
  const cliffX = w - 70;

  if (!car1Stopped) {
    car1X += car1Speed;
    if (car1X > w) {
      car1Stopped = true;
      if (car2Stopped) evaluateEdgeResult();
    }
  }
  if (!car2Stopped) {
    car2X += car2Speed;
    if (car2X > w) {
      car2Stopped = true;
      if (car1Stopped) evaluateEdgeResult();
    }
  }

  // Draw track
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Cliff line
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cliffX, 0, 8, h);
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(cliffX + 8, 0, w - cliffX, h);

  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('崖 (FALL)', cliffX + 15, h / 2);

  // P1 lane
  ctx.fillStyle = '#334155';
  ctx.fillRect(20, h * 0.25 - 25, cliffX - 20, 50);
  ctx.font = '40px sans-serif';
  ctx.fillText('🏎️', car1X - 25, h * 0.25 + 14);

  // P2 lane
  ctx.fillStyle = '#334155';
  ctx.fillRect(20, h * 0.75 - 25, cliffX - 20, 50);
  ctx.font = '40px sans-serif';
  ctx.fillText('🏎️', car2X - 25, h * 0.75 + 14);

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  drawP1Text(ctx, 'P1: タップでブレーキ！', 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText('P2: タップでブレーキ！', 30, h - 30);

  requestAnimationFrame(edgeStopperLoop);
}

/* ============================================================
   54. モグラたたきデュエル (Whack-a-Mole)
   ============================================================ */
let moleCanvas, moleCtx;
let moles = [];
let moleScore1 = 0, moleScore2 = 0;
let isMoleRunning = false;

function initWhackAMoleGame() {
  moleCanvas = document.getElementById('whackamole-canvas');
  moleCtx = moleCanvas.getContext('2d');
  moleCanvas.width = moleCanvas.clientWidth;
  moleCanvas.height = moleCanvas.clientHeight;

  const w = moleCanvas.width;
  const h = moleCanvas.height;

  // 6 holes
  moles = [
    { x: w * 0.28, y: h * 0.35, active: false, timer: 60 },
    { x: w * 0.72, y: h * 0.35, active: false, timer: 90 },
    { x: w * 0.28, y: h * 0.50, active: false, timer: 120 },
    { x: w * 0.72, y: h * 0.50, active: false, timer: 40 },
    { x: w * 0.28, y: h * 0.65, active: false, timer: 80 },
    { x: w * 0.72, y: h * 0.65, active: false, timer: 110 }
  ];

  moleScore1 = 0;
  moleScore2 = 0;
  isMoleRunning = true;

  moleCanvas.onpointerdown = (e) => {
    if (!isMoleRunning) return;
    const rect = moleCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < moleCanvas.height / 2 ? 1 : 2;

    for (const m of moles) {
      if (m.active && Math.hypot(x - m.x, y - m.y) < 45) {
        m.active = false;
        m.timer = 60 + Math.random() * 80;
        window.sounds.playGunshot();
        if (player === 1) moleScore1++;
        else moleScore2++;

        if (moleScore1 >= 10 || moleScore2 >= 10) {
          isMoleRunning = false;
          window.sounds.playSuccess();
          const winner = moleScore1 >= 10 ? 'プレイヤー 1' : 'プレイヤー 2';
          showModal('🔨 モグラ退治マスター！', `${winner} の勝利！\n(P1: ${moleScore1}匹 vs P2: ${moleScore2}匹)`, () => {
            initWhackAMoleGame();
          });
        }
        break;
      }
    }
  };

  requestAnimationFrame(whackAMoleLoop);
}

function whackAMoleLoop() {
  if (currentScreen !== 'screen-whackamole' || !isMoleRunning) return;

  const ctx = moleCtx;
  const w = moleCanvas.width;
  const h = moleCanvas.height;

  // Update moles
  moles.forEach(m => {
    m.timer--;
    if (m.timer <= 0) {
      m.active = !m.active;
      m.timer = m.active ? 45 + Math.random() * 40 : 60 + Math.random() * 80;
    }
  });

  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, w, h);

  // Scores
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${moleScore1}/10`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${moleScore2}/10`, 30, h - 30);

  // Draw holes & moles
  moles.forEach(m => {
    ctx.beginPath();
    ctx.ellipse(m.x, m.y + 10, 40, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#022c22';
    ctx.fill();

    if (m.active) {
      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐹', m.x, m.y + 12);
    }
  });

  requestAnimationFrame(whackAMoleLoop);
}

/* ============================================================
   55. 10秒ピタリ体内時計 (Stopwatch 10s)
   ============================================================ */
let stopwatchCanvas, stopwatchCtx;
let stopStartTime = 0;
let stopP1Time = null, stopP2Time = null;
let isStopwatchRunning = false;

function initStopwatchGame() {
  stopwatchCanvas = document.getElementById('stopwatch-canvas');
  stopwatchCtx = stopwatchCanvas.getContext('2d');
  stopwatchCanvas.width = stopwatchCanvas.clientWidth;
  stopwatchCanvas.height = stopwatchCanvas.clientHeight;

  stopStartTime = performance.now();
  stopP1Time = null;
  stopP2Time = null;
  isStopwatchRunning = true;

  stopwatchCanvas.onpointerdown = (e) => {
    if (!isStopwatchRunning) return;
    const now = (performance.now() - stopStartTime) / 1000;
    const y = e.clientY - stopwatchCanvas.getBoundingClientRect().top;

    if (y < stopwatchCanvas.height / 2 && stopP1Time === null) {
      stopP1Time = now;
      window.sounds.playGunshot();
    } else if (y >= stopwatchCanvas.height / 2 && stopP2Time === null) {
      stopP2Time = now;
      window.sounds.playGunshot();
    }

    if (stopP1Time !== null && stopP2Time !== null) {
      evaluateStopwatch();
    }
  };

  requestAnimationFrame(stopwatchLoop);
}

function evaluateStopwatch() {
  isStopwatchRunning = false;
  const diff1 = Math.abs(10.0 - stopP1Time);
  const diff2 = Math.abs(10.0 - stopP2Time);

  const winner = diff1 < diff2 ? 'プレイヤー 1' : 'プレイヤー 2';
  window.sounds.playSuccess();
  showModal('⏱️ 体内時計結果発表！', `${winner} の勝利！\n目標: 10.000秒\nP1: ${stopP1Time.toFixed(3)}秒 (誤差: ${diff1.toFixed(3)}s)\nP2: ${stopP2Time.toFixed(3)}秒 (誤差: ${diff2.toFixed(3)}s)`, () => {
    initStopwatchGame();
  });
}

function stopwatchLoop() {
  if (currentScreen !== 'screen-stopwatch' || !isStopwatchRunning) return;

  const ctx = stopwatchCtx;
  const w = stopwatchCanvas.width;
  const h = stopwatchCanvas.height;
  const elapsed = (performance.now() - stopStartTime) / 1000;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText('目指せ【10.000秒】ピタリ！', w / 2, h / 2 - 80);

  // Time display (blinds after 3 seconds)
  ctx.font = 'bold 54px monospace';
  if (elapsed < 3.0) {
    ctx.fillStyle = '#facc15';
    ctx.fillText(`${elapsed.toFixed(2)}s`, w / 2, h / 2);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('??.??s (集中...)', w / 2, h / 2);
  }

  // P1 zone
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = stopP1Time !== null ? '#4ade80' : '#f87171';
  ctx.font = 'bold 15px sans-serif';
  drawP1Text(ctx, stopP1Time !== null ? `P1: 確定！` : 'P1: 10秒でタップ！', w / 2, getTopSafeY(), 'bold 22px sans-serif', '#ef4444', 'center');

  // P2 zone
  ctx.fillStyle = stopP2Time !== null ? '#4ade80' : '#60a5fa';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(stopP2Time !== null ? `P2: 確定！` : 'P2: 10秒でタップ！', w / 2, h - 70);

  requestAnimationFrame(stopwatchLoop);
}

/* ============================================================
   56. ゾンビ・ディフェンス (Zombie Rush)
   ============================================================ */
let zombieCanvas, zombieCtx;
let zombies = [];
let zombieScore1 = 3, zombieScore2 = 3; // lives
let isZombieRunning = false;

function initZombieGame() {
  zombieCanvas = document.getElementById('zombie-canvas');
  zombieCtx = zombieCanvas.getContext('2d');
  zombieCanvas.width = zombieCanvas.clientWidth;
  zombieCanvas.height = zombieCanvas.clientHeight;

  const w = zombieCanvas.width;
  const h = zombieCanvas.height;

  zombies = [];
  for (let i = 0; i < 6; i++) {
    zombies.push({
      x: 40 + Math.random() * (w - 80),
      y: h / 2 + (Math.random() - 0.5) * 80,
      vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 1.5)
    });
  }

  zombieScore1 = 3;
  zombieScore2 = 3;
  isZombieRunning = true;

  zombieCanvas.onpointerdown = (e) => {
    if (!isZombieRunning) return;
    const rect = zombieCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    zombies.forEach(z => {
      if (Math.hypot(x - z.x, y - z.y) < 40) {
        window.sounds.playGunshot();
        // Repel zombie in opposite direction
        z.vy = y < zombieCanvas.height / 2 ? 3.5 : -3.5;
      }
    });
  };

  requestAnimationFrame(zombieLoop);
}

function zombieLoop() {
  if (currentScreen !== 'screen-zombie' || !isZombieRunning) return;

  const ctx = zombieCtx;
  const w = zombieCanvas.width;
  const h = zombieCanvas.height;

  zombies.forEach(z => {
    z.y += z.vy;
    if (z.y < 50) {
      // P1 hit!
      zombieScore1--;
      window.sounds.playExplosion();
      z.y = h / 2;
      z.vy = 2;
    } else if (z.y > h - 50) {
      // P2 hit!
      zombieScore2--;
      window.sounds.playExplosion();
      z.y = h / 2;
      z.vy = -2;
    }
  });

  if (zombieScore1 <= 0 || zombieScore2 <= 0) {
    isZombieRunning = false;
    window.sounds.playSuccess();
    const winner = zombieScore1 > 0 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal('🧟 ゾンビ襲来！', `防衛失敗！\n${winner} の防衛成功・勝利！`, () => {
      initZombieGame();
    });
    return;
  }

  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, w, h);

  // Goal lines
  ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.fillRect(0, 0, w, 50);
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.fillRect(0, h - 50, w, 50);

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1 防衛ライフ: ${'❤️'.repeat(zombieScore1)}`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2 防衛ライフ: ${'❤️'.repeat(zombieScore2)}`, 20, h - 20);

  // Draw Zombies
  zombies.forEach(z => {
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧟', z.x, z.y + 12);
  });

  requestAnimationFrame(zombieLoop);
}

/* ============================================================
   57. コイントス・キャッチ (Coin Toss)
   ============================================================ */
let coinCanvas, coinCtx;
let coinY = 0, coinVy = 0;
let coinRound = 1;
let coinScore1 = 0, coinScore2 = 0;
let isCoinRunning = false;

function initCoinTossGame() {
  coinCanvas = document.getElementById('cointoss-canvas');
  coinCtx = coinCanvas.getContext('2d');
  coinCanvas.width = coinCanvas.clientWidth;
  coinCanvas.height = coinCanvas.clientHeight;

  coinRound = 1;
  coinScore1 = 0;
  coinScore2 = 0;
  isCoinRunning = true;

  startCoinRound();

  coinCanvas.onpointerdown = (e) => {
    if (!isCoinRunning) return;
    const y = e.clientY - coinCanvas.getBoundingClientRect().top;
    const targetY = coinCanvas.height / 2;
    const diff = Math.abs(coinY - targetY);

    if (diff < 35) {
      window.sounds.playSuccess();
      const pts = diff < 15 ? 100 : 50;
      if (y < coinCanvas.height / 2) coinScore1 += pts;
      else coinScore2 += pts;

      if (coinRound >= 3) {
        isCoinRunning = false;
        const winner = coinScore1 > coinScore2 ? 'プレイヤー 1' : (coinScore2 > coinScore1 ? 'プレイヤー 2' : '引き分け');
        showModal('🪙 トス勝負決着！', `${winner} の勝利！\n(P1: ${coinScore1}点 vs P2: ${coinScore2}点)`, () => {
          initCoinTossGame();
        });
      } else {
        coinRound++;
        setTimeout(startCoinRound, 600);
      }
    } else {
      window.sounds.playSlash();
    }
  };

  requestAnimationFrame(coinTossLoop);
}

function startCoinRound() {
  coinY = 40;
  coinVy = 6 + Math.random() * 3;
}

function coinTossLoop() {
  if (currentScreen !== 'screen-cointoss' || !isCoinRunning) return;

  const ctx = coinCtx;
  const w = coinCanvas.width;
  const h = coinCanvas.height;

  coinY += coinVy;
  if (coinY > h) {
    // missed, reset
    startCoinRound();
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Catch line
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(30, h / 2);
  ctx.lineTo(w - 30, h / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.fillText('ここを通過した瞬間にキャッチ！', w / 2, h / 2 - 15);

  // Scores
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${coinScore1}点`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${coinScore2}点`, 30, h - 30);

  // Draw Coin
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🪙', w / 2, coinY);

  requestAnimationFrame(coinTossLoop);
}

/* ============================================================
   58. クレーン・キャッチャー (Crane Grab)
   ============================================================ */
let craneCanvas, craneCtx;
let craneX = 0, craneSpeed = 4;
let claw1Y = 50, claw2Y = 0;
let claw1Dropping = false, claw2Dropping = false;
let craneScore1 = 0, craneScore2 = 0;
let isCraneRunning = false;

function initCraneGame() {
  craneCanvas = document.getElementById('crane-canvas');
  craneCtx = craneCanvas.getContext('2d');
  craneCanvas.width = craneCanvas.clientWidth;
  craneCanvas.height = craneCanvas.clientHeight;

  craneX = 50;
  craneSpeed = 4;
  claw1Y = 60;
  claw2Y = craneCanvas.height - 60;
  claw1Dropping = false;
  claw2Dropping = false;
  craneScore1 = 0;
  craneScore2 = 0;
  isCraneRunning = true;

  craneCanvas.onpointerdown = (e) => {
    if (!isCraneRunning) return;
    const y = e.clientY - craneCanvas.getBoundingClientRect().top;
    if (y < craneCanvas.height / 2 && !claw1Dropping) {
      claw1Dropping = true;
      window.sounds.playGunshot();
    } else if (y >= craneCanvas.height / 2 && !claw2Dropping) {
      claw2Dropping = true;
      window.sounds.playGunshot();
    }
  };

  requestAnimationFrame(craneLoop);
}

function craneLoop() {
  if (currentScreen !== 'screen-crane' || !isCraneRunning) return;

  const ctx = craneCtx;
  const w = craneCanvas.width;
  const h = craneCanvas.height;

  // Move crane trolley
  craneX += craneSpeed;
  if (craneX > w - 40 || craneX < 40) craneSpeed *= -1;

  // Claws
  if (claw1Dropping) {
    claw1Y += 8;
    if (claw1Y >= h / 2 - 20) {
      claw1Dropping = false;
      claw1Y = 60;
      craneScore1 += 100;
      window.sounds.playSuccess();
    }
  }

  if (claw2Dropping) {
    claw2Y -= 8;
    if (claw2Y <= h / 2 + 20) {
      claw2Dropping = false;
      claw2Y = h - 60;
      craneScore2 += 100;
      window.sounds.playSuccess();
    }
  }

  if (craneScore1 >= 300 || craneScore2 >= 300) {
    isCraneRunning = false;
    const winner = craneScore1 >= 300 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal('🏗️ 景品コンプリート！', `${winner} の勝利！\n(P1: ${craneScore1}点 vs P2: ${craneScore2}点)`, () => {
      initCraneGame();
    });
    return;
  }

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, w, h);

  // Conveyor in middle
  ctx.fillStyle = '#4338ca';
  ctx.fillRect(0, h / 2 - 25, w, 50);
  ctx.font = '32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧸 💎 👑 🧸 💎 👑', w / 2, h / 2 + 10);

  // Claw 1
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(craneX, 40);
  ctx.lineTo(craneX, claw1Y);
  ctx.stroke();
  ctx.fillText('🪝', craneX, claw1Y);

  // Claw 2
  ctx.strokeStyle = '#60a5fa';
  ctx.beginPath();
  ctx.moveTo(craneX, h - 40);
  ctx.lineTo(craneX, claw2Y);
  ctx.stroke();
  ctx.fillText('🪝', craneX, claw2Y);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${craneScore1}/300点`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${craneScore2}/300点`, 20, h - 15);

  requestAnimationFrame(craneLoop);
}

/* ============================================================
   59. ビリビリ電導イライラ棒 (Electric Wire)
   ============================================================ */
let wireCanvas, wireCtx;
let wireP1X = 40, wireP2X = 40;
let isWireRunning = false;

function initElectricWireGame() {
  wireCanvas = document.getElementById('electricwire-canvas');
  wireCtx = wireCanvas.getContext('2d');
  wireCanvas.width = wireCanvas.clientWidth;
  wireCanvas.height = wireCanvas.clientHeight;

  wireP1X = 40;
  wireP2X = 40;
  isWireRunning = true;

  wireCanvas.onpointermove = (e) => {
    if (!isWireRunning) return;
    const rect = wireCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y < wireCanvas.height / 2) {
      wireP1X = x;
      if (wireP1X >= wireCanvas.width - 50) {
        isWireRunning = false;
        window.sounds.playSuccess();
        showModal('⚡ ゴール到達！', 'プレイヤー 1 の勝利！\n電導迷路をクリアしました！', () => {
          initElectricWireGame();
        });
      }
    } else {
      wireP2X = x;
      if (wireP2X >= wireCanvas.width - 50) {
        isWireRunning = false;
        window.sounds.playSuccess();
        showModal('⚡ ゴール到達！', 'プレイヤー 2 の勝利！\n電導迷路をクリアしました！', () => {
          initElectricWireGame();
        });
      }
    }
  };

  requestAnimationFrame(electricWireLoop);
}

function electricWireLoop() {
  if (currentScreen !== 'screen-electricwire' || !isWireRunning) return;

  const ctx = wireCtx;
  const w = wireCanvas.width;
  const h = wireCanvas.height;

  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, w, h);

  // Track 1
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(30, h * 0.25);
  ctx.lineTo(w - 30, h * 0.25);
  ctx.stroke();

  // P1 Ring
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(wireP1X, h * 0.25, 18, 0, Math.PI * 2);
  ctx.fill();

  // Track 2
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(30, h * 0.75);
  ctx.lineTo(w - 30, h * 0.75);
  ctx.stroke();

  // P2 Ring
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.arc(wireP2X, h * 0.75, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('⚡ リングをゴールへ運べ！', w / 2, h / 2);

  requestAnimationFrame(electricWireLoop);
}

/* ============================================================
   60. スイカ・ドロップ・ミニ (Suika Drop)
   ============================================================ */
let suikaCanvas, suikaCtx;
let suikaScore1 = 0, suikaScore2 = 0;
let fruits = [];
let isSuikaRunning = false;

const FRUIT_TYPES = [
  { emoji: '🍒', r: 16, pts: 10 },
  { emoji: '🍓', r: 22, pts: 20 },
  { emoji: '🍇', r: 28, pts: 40 },
  { emoji: '🍊', r: 34, pts: 80 },
  { emoji: '🍉', r: 44, pts: 200 }
];

function initSuikaDropGame() {
  suikaCanvas = document.getElementById('suikadrop-canvas');
  suikaCtx = suikaCanvas.getContext('2d');
  suikaCanvas.width = suikaCanvas.clientWidth;
  suikaCanvas.height = suikaCanvas.clientHeight;

  suikaScore1 = 0;
  suikaScore2 = 0;
  fruits = [];
  isSuikaRunning = true;

  suikaCanvas.onpointerdown = (e) => {
    if (!isSuikaRunning) return;
    const rect = suikaCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < suikaCanvas.height / 2 ? 1 : 2;

    const baseType = Math.floor(Math.random() * 2); // 0 or 1
    fruits.push({
      x: x,
      y: player === 1 ? 50 : suikaCanvas.height / 2 + 50,
      level: baseType,
      player: player,
      vy: 4
    });
    window.sounds.playTap();
  };

  requestAnimationFrame(suikaDropLoop);
}

function suikaDropLoop() {
  if (currentScreen !== 'screen-suikadrop' || !isSuikaRunning) return;

  const ctx = suikaCtx;
  const w = suikaCanvas.width;
  const h = suikaCanvas.height;

  // Update fruits
  fruits.forEach(f => {
    f.y += f.vy;
    const floorY = f.player === 1 ? h / 2 - 30 : h - 30;
    if (f.y > floorY) {
      f.y = floorY;
      f.vy = 0;
    }
  });

  // Check merges
  for (let i = 0; i < fruits.length; i++) {
    for (let j = i + 1; j < fruits.length; j++) {
      const f1 = fruits[i];
      const f2 = fruits[j];
      if (f1.player === f2.player && f1.level === f2.level && f1.level < FRUIT_TYPES.length - 1) {
        if (Math.hypot(f1.x - f2.x, f1.y - f2.y) < FRUIT_TYPES[f1.level].r * 2) {
          // Merge!
          f1.level++;
          fruits.splice(j, 1);
          window.sounds.playSuccess();
          const pts = FRUIT_TYPES[f1.level].pts;
          if (f1.player === 1) suikaScore1 += pts;
          else suikaScore2 += pts;

          if (f1.level === FRUIT_TYPES.length - 1 || suikaScore1 >= 300 || suikaScore2 >= 300) {
            isSuikaRunning = false;
            const winner = suikaScore1 >= suikaScore2 ? 'プレイヤー 1' : 'プレイヤー 2';
            showModal('🍉 スイカ完成！', `${winner} の勝利！\n(P1: ${suikaScore1}点 vs P2: ${suikaScore2}点)`, () => {
              initSuikaDropGame();
            });
            return;
          }
          break;
        }
      }
    }
  }

  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, w, h);

  // Divider
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // Draw fruits
  fruits.forEach(f => {
    const fData = FRUIT_TYPES[f.level];
    ctx.font = `${fData.r * 1.5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(fData.emoji, f.x, f.y);
  });

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${suikaScore1}点`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${suikaScore2}点`, 25, h / 2 + 30);

  requestAnimationFrame(suikaDropLoop);
}

/* ============================================================
   61. 居眠りサバイバル (Classroom Snooze)
   ============================================================ */
let snoozeCanvas, snoozeCtx;
let snoozeP1Energy = 100, snoozeP2Energy = 100;
let chalkX = 0, chalkY = 0, chalkVx = 0, chalkVy = 0, chalkActive = false;
let isSnoozeRunning = false;

function initSnoozeGame() {
  snoozeCanvas = document.getElementById('snooze-canvas');
  snoozeCtx = snoozeCanvas.getContext('2d');
  snoozeCanvas.width = snoozeCanvas.clientWidth;
  snoozeCanvas.height = snoozeCanvas.clientHeight;

  snoozeP1Energy = 100;
  snoozeP2Energy = 100;
  chalkActive = false;
  isSnoozeRunning = true;

  snoozeCanvas.onpointerdown = (e) => {
    if (!isSnoozeRunning) return;
    const y = e.clientY - snoozeCanvas.getBoundingClientRect().top;
    if (y < snoozeCanvas.height / 2) {
      snoozeP1Energy = Math.min(100, snoozeP1Energy + 12);
    } else {
      snoozeP2Energy = Math.min(100, snoozeP2Energy + 12);
    }
    window.sounds.playTap();
  };

  requestAnimationFrame(snoozeLoop);
}

function snoozeLoop() {
  if (currentScreen !== 'screen-snooze' || !isSnoozeRunning) return;

  const ctx = snoozeCtx;
  const w = snoozeCanvas.width;
  const h = snoozeCanvas.height;

  // Energy drains continuously
  snoozeP1Energy -= 0.28;
  snoozeP2Energy -= 0.28;

  if (snoozeP1Energy <= 0 || snoozeP2Energy <= 0) {
    isSnoozeRunning = false;
    window.sounds.playExplosion();
    const winner = snoozeP1Energy > 0 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal('😴 睡魔に敗北！', `居眠りして机に突っ伏した！\n${winner} の耐えきり勝利！`, () => {
      initSnoozeGame();
    });
    return;
  }

  // Random Chalk throw
  if (!chalkActive && Math.random() < 0.02) {
    chalkActive = true;
    chalkX = w / 2;
    chalkY = h / 2;
    chalkVx = (Math.random() - 0.5) * 6;
    chalkVy = (Math.random() > 0.5 ? 1 : -1) * 7;
    window.sounds.playGunshot();
  }

  if (chalkActive) {
    chalkX += chalkVx;
    chalkY += chalkVy;
    if (chalkY < 40) {
      snoozeP1Energy -= 25;
      chalkActive = false;
      window.sounds.playSlash();
    } else if (chalkY > h - 40) {
      snoozeP2Energy -= 25;
      chalkActive = false;
      window.sounds.playSlash();
    }
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Teacher chalk desk in middle
  ctx.fillStyle = '#334155';
  ctx.fillRect(w / 2 - 80, h / 2 - 25, 160, 50);
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('👨‍🏫 授業中 (連打で起きろ！)', w / 2, h / 2 + 6);

  // P1 Eye (Top)
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  const snoozeY = getTopSafeY();
  drawP1Text(ctx, `P1 覚醒度: ${Math.round(snoozeP1Energy)}%`, 58, snoozeY);
  ctx.fillStyle = '#475569';
  ctx.fillRect(25, snoozeY + 12, w - 50, 16);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(25, snoozeY + 12, (w - 50) * (snoozeP1Energy / 100), 16);
  ctx.save();
  ctx.translate(w / 2, h * 0.25);
  ctx.rotate(Math.PI);
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(snoozeP1Energy > 50 ? '😳' : '🥱', 0, 0);
  ctx.restore();

  // P2 Eye (Bottom)
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`P2 覚醒度: ${Math.round(snoozeP2Energy)}%`, 25, h - 65);
  ctx.fillStyle = '#475569';
  ctx.fillRect(25, h - 50, w - 50, 16);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(25, h - 50, (w - 50) * (snoozeP2Energy / 100), 16);
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(snoozeP2Energy > 50 ? '😳' : '🥱', w / 2, h * 0.75);

  // Draw Chalk
  if (chalkActive) {
    ctx.font = '28px sans-serif';
    ctx.fillText('🖍️ チョーク！', chalkX, chalkY);
  }

  requestAnimationFrame(snoozeLoop);
}

/* ============================================================
   62. 定規飛ばしバトル (Ruler Fling)
   ============================================================ */
let rulerCanvas, rulerCtx;
let ruler1, ruler2;
let rulerDrag = null;
let isRulerRunning = false;

function initRulerGame() {
  rulerCanvas = document.getElementById('ruler-canvas');
  rulerCtx = rulerCanvas.getContext('2d');
  rulerCanvas.width = rulerCanvas.clientWidth;
  rulerCanvas.height = rulerCanvas.clientHeight;

  const w = rulerCanvas.width;
  const h = rulerCanvas.height;

  ruler1 = { x: w / 2, y: h * 0.25, vx: 0, vy: 0, w: 90, h: 22, color: '#f87171' };
  ruler2 = { x: w / 2, y: h * 0.75, vx: 0, vy: 0, w: 90, h: 22, color: '#60a5fa' };
  rulerDrag = null;
  isRulerRunning = true;

  rulerCanvas.onpointerdown = (e) => {
    if (!isRulerRunning) return;
    const rect = rulerCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (Math.hypot(x - ruler1.x, y - ruler1.y) < 55) {
      rulerDrag = { ruler: ruler1, startX: ruler1.x, startY: ruler1.y, curX: x, curY: y };
    } else if (Math.hypot(x - ruler2.x, y - ruler2.y) < 55) {
      rulerDrag = { ruler: ruler2, startX: ruler2.x, startY: ruler2.y, curX: x, curY: y };
    }
  };

  rulerCanvas.onpointermove = (e) => {
    if (!rulerDrag) return;
    const rect = rulerCanvas.getBoundingClientRect();
    rulerDrag.curX = e.clientX - rect.left;
    rulerDrag.curY = e.clientY - rect.top;
  };

  rulerCanvas.onpointerup = () => {
    if (!rulerDrag) return;
    rulerDrag.ruler.vx = (rulerDrag.startX - rulerDrag.curX) * 0.22;
    rulerDrag.ruler.vy = (rulerDrag.startY - rulerDrag.curY) * 0.22;
    window.sounds.playGunshot();
    rulerDrag = null;
  };

  requestAnimationFrame(rulerLoop);
}

function rulerLoop() {
  if (currentScreen !== 'screen-ruler' || !isRulerRunning) return;

  const ctx = rulerCtx;
  const w = rulerCanvas.width;
  const h = rulerCanvas.height;
  const topY = getTopSafeY();

  [ruler1, ruler2].forEach(r => {
    r.x += r.vx;
    r.y += r.vy;
    r.vx *= 0.95;
    r.vy *= 0.95;
  });

  // 衝突判定
  if (Math.hypot(ruler1.x - ruler2.x, ruler1.y - ruler2.y) < 45) {
    window.sounds.playGunshot();
    ruler1.vx = (ruler1.x - ruler2.x) * 0.2;
    ruler1.vy = (ruler1.y - ruler2.y) * 0.2;
    ruler2.vx = -ruler1.vx;
    ruler2.vy = -ruler1.vy;
  }

  // 机境界
  const deskLeft = 20, deskRight = w - 20;
  const deskTop = topY + 20, deskBottom = h - 20;

  const r1Out = ruler1.x < deskLeft || ruler1.x > deskRight || ruler1.y < deskTop || ruler1.y > deskBottom;
  const r2Out = ruler2.x < deskLeft || ruler2.x > deskRight || ruler2.y < deskTop || ruler2.y > deskBottom;

  // 机背景
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#334155';
  ctx.fillRect(deskLeft, deskTop, deskRight - deskLeft, deskBottom - deskTop);

  // 対面ラベル
  drawP1Text(ctx, '🔴 P1: 定規を弾いて相手を落とせ！', w / 2, topY + 14, 'bold 15px sans-serif', '#ffffff', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('🔵 P2: 定規を弾いて相手を落とせ！', w / 2, h - 25);

  // エイムライン
  if (rulerDrag) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rulerDrag.startX, rulerDrag.startY);
    ctx.lineTo(rulerDrag.curX, rulerDrag.curY);
    ctx.stroke();
  }

  // 定規描画
  [ruler1, ruler2].forEach(r => {
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.fillStyle = r.color;
    ctx.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-r.w / 2, -r.h / 2, r.w, r.h);
    // 目盛り線
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    for (let x = -r.w / 2 + 8; x < r.w / 2; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, -r.h / 2);
      ctx.lineTo(x, -r.h / 2 + 6);
      ctx.stroke();
    }
    ctx.restore();
  });

  if ((r1Out || r2Out) && isRulerRunning) {
    isRulerRunning = false;
    window.sounds.playFall();
    const winner = r1Out && r2Out ? '引き分け！' : (r1Out ? 'プレイヤー 2 の勝利！' : 'プレイヤー 1 の勝利！');
    showModal(`📏 落下！`, `${winner}相手の定規が机から転落しました！`, () => {
      initRulerGame();
    });
    return;
  }

  requestAnimationFrame(rulerLoop);
}

/* ============================================================
   63. パラパラマンガ・レース (Flipbook Race)
   ============================================================ */
let flipCanvas, flipCtx;
let flipP1Page = 0, flipP2Page = 0;
let isFlipRunning = false;

function initFlipbookGame() {
  flipCanvas = document.getElementById('flipbook-canvas');
  flipCtx = flipCanvas.getContext('2d');
  flipCanvas.width = flipCanvas.clientWidth;
  flipCanvas.height = flipCanvas.clientHeight;

  flipP1Page = 0;
  flipP2Page = 0;
  isFlipRunning = true;

  flipCanvas.onpointerdown = (e) => {
    if (!isFlipRunning) return;
    const y = e.clientY - flipCanvas.getBoundingClientRect().top;
    if (y < flipCanvas.height / 2) {
      flipP1Page += 3;
      if (flipP1Page >= 100) {
        isFlipRunning = false;
        window.sounds.playSuccess();
        showModal('📖 パラパラ完走！', 'プレイヤー 1 が最速で100ページをめくり終えました！', () => {
          initFlipbookGame();
        });
        return;
      }
    } else {
      flipP2Page += 3;
      if (flipP2Page >= 100) {
        isFlipRunning = false;
        window.sounds.playSuccess();
        showModal('📖 パラパラ完走！', 'プレイヤー 2 が最速で100ページをめくり終えました！', () => {
          initFlipbookGame();
        });
        return;
      }
    }
    window.sounds.playTap();
  };

  requestAnimationFrame(flipbookLoop);
}

function flipbookLoop() {
  if (currentScreen !== 'screen-flipbook' || !isFlipRunning) return;

  const ctx = flipCtx;
  const w = flipCanvas.width;
  const h = flipCanvas.height;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);

  // P1 Book (Top)
  ctx.fillStyle = '#f8fafc';
  const flipY = getTopSafeY();
  ctx.fillRect(40, flipY - 10, w - 80, h / 2 - (flipY + 10));
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#ef4444';
  drawP1Text(ctx, `P1: ${flipP1Page}/100 ページ`, 58, flipY + 15);

  // Animated stickman running
  const frame1 = Math.floor(flipP1Page / 5) % 4;
  const stickmen = ['🏃', '🚶', '🤸', '🏃'];
  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(stickmen[frame1], 60 + (w - 140) * (flipP1Page / 100), h * 0.25);

  // P2 Book (Bottom)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(40, h / 2 + 30, w - 80, h / 2 - 60);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'left';
  ctx.fillText(`P2: ${flipP2Page}/100 ページ`, 25, h / 2 + 60);

  const frame2 = Math.floor(flipP2Page / 5) % 4;
  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(stickmen[frame2], 60 + (w - 140) * (flipP2Page / 100), h * 0.75);

  requestAnimationFrame(flipbookLoop);
}

/* ============================================================
   64. 紙ヒコーキ・フライト (Paper Plane)
   ============================================================ */
let planeCanvas, planeCtx;
let plane1 = { x: 30, y: 0, vx: 0, vy: 0, dist: 0, flying: false };
let plane2 = { x: 30, y: 0, vx: 0, vy: 0, dist: 0, flying: false };
let isPlaneRunning = false;

function initPaperPlaneGame() {
  planeCanvas = document.getElementById('paperplane-canvas');
  planeCtx = planeCanvas.getContext('2d');
  planeCanvas.width = planeCanvas.clientWidth;
  planeCanvas.height = planeCanvas.clientHeight;

  const h = planeCanvas.height;
  plane1 = { x: 40, y: h * 0.25, vx: 0, vy: 0, dist: 0, flying: false };
  plane2 = { x: 40, y: h * 0.75, vx: 0, vy: 0, dist: 0, flying: false };
  isPlaneRunning = true;

  planeCanvas.onpointerdown = (e) => {
    if (!isPlaneRunning) return;
    const y = e.clientY - planeCanvas.getBoundingClientRect().top;
    if (y < planeCanvas.height / 2 && !plane1.flying) {
      plane1.flying = true;
      plane1.vx = 8 + Math.random() * 5;
      plane1.vy = -3;
      window.sounds.playGunshot();
    } else if (y >= planeCanvas.height / 2 && !plane2.flying) {
      plane2.flying = true;
      plane2.vx = 8 + Math.random() * 5;
      plane2.vy = -3;
      window.sounds.playGunshot();
    }
  };

  requestAnimationFrame(paperPlaneLoop);
}

function paperPlaneLoop() {
  if (currentScreen !== 'screen-paperplane' || !isPlaneRunning) return;

  const ctx = planeCtx;
  const w = planeCanvas.width;
  const h = planeCanvas.height;

  // Plane 1 physics
  if (plane1.flying) {
    plane1.x += plane1.vx;
    plane1.y += plane1.vy;
    plane1.vy += 0.08; // gravity
    plane1.vx *= 0.985;
    plane1.dist += plane1.vx;
    if (plane1.y > h / 2 - 20) {
      plane1.flying = false;
      plane1.vy = 0;
      plane1.vx = 0;
      if (!plane2.flying && plane2.dist > 0) evaluatePlaneWinner();
    }
  }

  // Plane 2 physics
  if (plane2.flying) {
    plane2.x += plane2.vx;
    plane2.y += plane2.vy;
    plane2.vy += 0.08;
    plane2.vx *= 0.985;
    plane2.dist += plane2.vx;
    if (plane2.y > h - 20) {
      plane2.flying = false;
      plane2.vy = 0;
      plane2.vx = 0;
      if (!plane1.flying && plane1.dist > 0) evaluatePlaneWinner();
    }
  }

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w, h);

  // Clouds
  ctx.font = '36px sans-serif';
  ctx.fillText('☁️', w * 0.3, h * 0.15);
  ctx.fillText('☁️', w * 0.7, h * 0.65);

  // Divider
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // Draw planes
  ctx.font = '40px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✈️', plane1.x, plane1.y);
  ctx.fillText('✈️', plane2.x, plane2.y);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${Math.round(plane1.dist)}m ${plane1.flying ? '🚀' : ''}`, 58, getTopSafeY());
  ctx.fillText(`P2: ${Math.round(plane2.dist)}m ${plane2.flying ? '🚀' : ''}`, 25, h / 2 + 30);

  requestAnimationFrame(paperPlaneLoop);
}

function evaluatePlaneWinner() {
  isPlaneRunning = false;
  window.sounds.playSuccess();
  const winner = plane1.dist > plane2.dist ? 'プレイヤー 1' : 'プレイヤー 2';
  showModal('✈️ 飛行距離コンテスト！', `${winner} の大勝利！\n(P1: ${Math.round(plane1.dist)}m vs P2: ${Math.round(plane2.dist)}m)`, () => {
    initPaperPlaneGame();
  });
}

/* ============================================================
   65. 指相撲・サムレスリング (Thumb Sumo)
   ============================================================ */
let thumbCanvas, thumbCtx;
let thumbP1 = { x: 0, y: 0 }, thumbP2 = { x: 0, y: 0 };
let pinTimer = 0, pinPlayer = 0;
let isThumbRunning = false;

function initThumbSumoGame() {
  thumbCanvas = document.getElementById('thumbsumo-canvas');
  thumbCtx = thumbCanvas.getContext('2d');
  thumbCanvas.width = thumbCanvas.clientWidth;
  thumbCanvas.height = thumbCanvas.clientHeight;

  const w = thumbCanvas.width;
  const h = thumbCanvas.height;

  thumbP1 = { x: w / 2, y: h * 0.35 };
  thumbP2 = { x: w / 2, y: h * 0.65 };
  pinTimer = 0;
  pinPlayer = 0;
  isThumbRunning = true;

  thumbCanvas.onpointermove = (e) => {
    if (!isThumbRunning) return;
    const rect = thumbCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y < thumbCanvas.height / 2) {
      thumbP1.x = x;
      thumbP1.y = y;
    } else {
      thumbP2.x = x;
      thumbP2.y = y;
    }
  };

  requestAnimationFrame(thumbSumoLoop);
}

function thumbSumoLoop() {
  if (currentScreen !== 'screen-thumbsumo' || !isThumbRunning) return;

  const ctx = thumbCtx;
  const w = thumbCanvas.width;
  const h = thumbCanvas.height;

  // Check pin
  const dist = Math.hypot(thumbP1.x - thumbP2.x, thumbP1.y - thumbP2.y);
  if (dist < 40) {
    if (thumbP1.y > thumbP2.y) {
      // P1 on top of P2
      pinPlayer = 1;
      pinTimer++;
    } else {
      pinPlayer = 2;
      pinTimer++;
    }

    if (pinTimer % 30 === 0) window.sounds.playGunshot();

    if (pinTimer >= 90) { // 3 seconds (90 frames)
      isThumbRunning = false;
      window.sounds.playSuccess();
      const winner = pinPlayer === 1 ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal('👍 スリーカウント奪取！', `技あり！${winner} の指相撲勝利！`, () => {
        initThumbSumoGame();
      });
      return;
    }
  } else {
    pinTimer = 0;
    pinPlayer = 0;
  }

  ctx.fillStyle = '#312e81';
  ctx.fillRect(0, 0, w, h);

  // Ring boundary
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Status
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  if (pinPlayer > 0) {
    ctx.fillText(`ホールド中！カウント ${(pinTimer / 30).toFixed(1)} / 3.0`, w / 2, h / 2);
  } else {
    ctx.fillText('相手の親指の上に飛び乗れ！', w / 2, h / 2);
  }

  // Draw thumbs (P1 thumbs face downward towards P2)
  ctx.save();
  ctx.translate(thumbP1.x, thumbP1.y);
  ctx.rotate(Math.PI);
  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('👍', 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(thumbP2.x, thumbP2.y);
  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('👍', 0, 0);
  ctx.restore();

  requestAnimationFrame(thumbSumoLoop);
}

/* ============================================================
   66. シャッフル・カップ (Cup Shuffle)
   ============================================================ */
let cupCanvas, cupCtx;
let cups = [];
let coinIndex = 1;
let shuffleCount = 0;
let isShuffling = false;
let cupScore1 = 0, cupScore2 = 0;
let isCupRunning = false;

function initCupShuffleGame() {
  cupCanvas = document.getElementById('cupshuffle-canvas');
  cupCtx = cupCanvas.getContext('2d');
  cupCanvas.width = cupCanvas.clientWidth;
  cupCanvas.height = cupCanvas.clientHeight;

  const w = cupCanvas.width;
  const h = cupCanvas.height;

  cups = [
    { x: w * 0.25, y: h / 2, targetX: w * 0.25 },
    { x: w * 0.50, y: h / 2, targetX: w * 0.50 },
    { x: w * 0.75, y: h / 2, targetX: w * 0.75 }
  ];

  coinIndex = 1;
  shuffleCount = 10;
  isShuffling = true;
  cupScore1 = 0;
  cupScore2 = 0;
  isCupRunning = true;

  startCupShuffleSequence();

  cupCanvas.onpointerdown = (e) => {
    if (!isCupRunning || isShuffling) return;
    const rect = cupCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < cupCanvas.height / 2 ? 1 : 2;

    for (let i = 0; i < cups.length; i++) {
      if (Math.abs(x - cups[i].x) < 45) {
        if (i === coinIndex) {
          window.sounds.playSuccess();
          if (player === 1) cupScore1++;
          else cupScore2++;

          if (cupScore1 >= 3 || cupScore2 >= 3) {
            isCupRunning = false;
            const winner = cupScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
            showModal('🥤 動体視力マスター！', `${winner} の勝利！\n(P1: ${cupScore1}点 vs P2: ${cupScore2}点)`, () => {
              initCupShuffleGame();
            });
            return;
          } else {
            shuffleCount = 10;
            isShuffling = true;
            setTimeout(startCupShuffleSequence, 600);
          }
        } else {
          window.sounds.playExplosion();
        }
        break;
      }
    }
  };

  requestAnimationFrame(cupShuffleLoop);
}

function startCupShuffleSequence() {
  if (shuffleCount <= 0) {
    isShuffling = false;
    return;
  }
  shuffleCount--;

  // Swap two cups
  const i1 = Math.floor(Math.random() * 3);
  let i2 = Math.floor(Math.random() * 3);
  while (i1 === i2) i2 = Math.floor(Math.random() * 3);

  const tmp = cups[i1].targetX;
  cups[i1].targetX = cups[i2].targetX;
  cups[i2].targetX = tmp;

  if (coinIndex === i1) coinIndex = i2;
  else if (coinIndex === i2) coinIndex = i1;

  window.sounds.playTap();
  setTimeout(startCupShuffleSequence, 200);
}

function cupShuffleLoop() {
  if (currentScreen !== 'screen-cupshuffle' || !isCupRunning) return;

  const ctx = cupCtx;
  const w = cupCanvas.width;
  const h = cupCanvas.height;

  // Move cups towards target
  cups.forEach(c => {
    c.x += (c.targetX - c.x) * 0.25;
  });

  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, w, h);

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${cupScore1}/3点`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${cupScore2}/3点`, 30, h - 30);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(isShuffling ? 'シャッフル中...！' : 'コインのカップをタップ！', w / 2, getTopSafeY() + 25);

  // Draw cups
  cups.forEach((c, idx) => {
    ctx.font = '54px sans-serif';
    ctx.fillText('🥤', c.x, c.y);
    if (!isShuffling && idx === coinIndex) {
      ctx.font = '24px sans-serif';
      ctx.fillText('🪙', c.x, c.y + 35);
    }
  });

  requestAnimationFrame(cupShuffleLoop);
}

/* ============================================================
   67. UFOレスキュー (UFO Rescue)
   ============================================================ */
let ufoResCanvas, ufoResCtx;
let aliens = [];
let ufo1Score = 0, ufo2Score = 0;
let isUfoResRunning = false;

function initUfoRescueGame() {
  ufoResCanvas = document.getElementById('uforescue-canvas');
  ufoResCtx = ufoResCanvas.getContext('2d');
  ufoResCanvas.width = ufoResCanvas.clientWidth;
  ufoResCanvas.height = ufoResCanvas.clientHeight;

  const w = ufoResCanvas.width;
  const h = ufoResCanvas.height;

  aliens = [];
  for (let i = 0; i < 5; i++) {
    aliens.push({
      x: 40 + Math.random() * (w - 80),
      y: h / 2 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 4
    });
  }

  ufo1Score = 0;
  ufo2Score = 0;
  isUfoResRunning = true;

  ufoResCanvas.onpointerdown = (e) => {
    if (!isUfoResRunning) return;
    const rect = ufoResCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < ufoResCanvas.height / 2 ? 1 : 2;

    for (let i = 0; i < aliens.length; i++) {
      const a = aliens[i];
      if (Math.abs(x - a.x) < 45) {
        window.sounds.playGunshot();
        if (player === 1) ufo1Score += 100;
        else ufo2Score += 100;
        a.x = 40 + Math.random() * (ufoResCanvas.width - 80);

        if (ufo1Score >= 500 || ufo2Score >= 500) {
          isUfoResRunning = false;
          window.sounds.playSuccess();
          const winner = ufo1Score >= 500 ? 'プレイヤー 1' : 'プレイヤー 2';
          showModal('🛸 レスキュー完了！', `${winner} の勝利！\n(P1: ${ufo1Score}点 vs P2: ${ufo2Score}点)`, () => {
            initUfoRescueGame();
          });
        }
        break;
      }
    }
  };

  requestAnimationFrame(ufoRescueLoop);
}

function ufoRescueLoop() {
  if (currentScreen !== 'screen-uforescue' || !isUfoResRunning) return;

  const ctx = ufoResCtx;
  const w = ufoResCanvas.width;
  const h = ufoResCanvas.height;

  aliens.forEach(a => {
    a.x += a.vx;
    if (a.x < 30 || a.x > w - 30) a.vx *= -1;
  });

  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, w, h);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${ufo1Score}/500点`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${ufo2Score}/500点`, 30, h - 30);

  // Draw UFOs
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🛸', w / 2, getTopSafeY() + 18);
  ctx.fillText('🛸', w / 2, h - 60);

  // Draw aliens
  aliens.forEach(a => {
    ctx.fillText('👽', a.x, a.y);
  });

  requestAnimationFrame(ufoRescueLoop);
}

/* ============================================================
   68. ピンボール・デュエル (Pinball Duel)
   ============================================================ */
let pinballCanvas, pinballCtx;
let pBall = { x: 0, y: 0, vx: 3, vy: 4, r: 12 };
let pinScore1 = 0, pinScore2 = 0;
let isPinballRunning = false;

function initPinballGame() {
  pinballCanvas = document.getElementById('pinball-canvas');
  pinballCtx = pinballCanvas.getContext('2d');
  pinballCanvas.width = pinballCanvas.clientWidth;
  pinballCanvas.height = pinballCanvas.clientHeight;

  const w = pinballCanvas.width;
  const h = pinballCanvas.height;

  pBall = { x: w / 2, y: h / 2, vx: 3.5, vy: 4, r: 12 };
  pinScore1 = 0;
  pinScore2 = 0;
  isPinballRunning = true;

  pinballCanvas.onpointerdown = (e) => {
    if (!isPinballRunning) return;
    const y = e.clientY - pinballCanvas.getBoundingClientRect().top;
    if (y < pinballCanvas.height / 2 && pBall.y < pinballCanvas.height * 0.35) {
      pBall.vy = Math.abs(pBall.vy) + 1;
      pBall.vx = (Math.random() - 0.5) * 8;
      window.sounds.playGunshot();
    } else if (y >= pinballCanvas.height / 2 && pBall.y > pinballCanvas.height * 0.65) {
      pBall.vy = -(Math.abs(pBall.vy) + 1);
      pBall.vx = (Math.random() - 0.5) * 8;
      window.sounds.playGunshot();
    }
  };

  requestAnimationFrame(pinballLoop);
}

function pinballLoop() {
  if (currentScreen !== 'screen-pinball' || !isPinballRunning) return;

  const ctx = pinballCtx;
  const w = pinballCanvas.width;
  const h = pinballCanvas.height;

  pBall.x += pBall.vx;
  pBall.y += pBall.vy;

  // Wall bounce
  if (pBall.x < pBall.r || pBall.x > w - pBall.r) {
    pBall.vx *= -1;
    window.sounds.playTap();
  }

  // Goals
  if (pBall.y < 0) {
    pinScore2++;
    window.sounds.playSuccess();
    pBall.x = w / 2;
    pBall.y = h / 2;
    pBall.vy = 4;
  } else if (pBall.y > h) {
    pinScore1++;
    window.sounds.playSuccess();
    pBall.x = w / 2;
    pBall.y = h / 2;
    pBall.vy = -4;
  }

  if (pinScore1 >= 3 || pinScore2 >= 3) {
    isPinballRunning = false;
    const winner = pinScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
    showModal('🕹️ ピンボール勝負決着！', `${winner} の勝利！\n(P1: ${pinScore1}点 vs P2: ${pinScore2}点)`, () => {
      initPinballGame();
    });
    return;
  }

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, w, h);

  // Bumpers
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 35, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();
  if (Math.hypot(pBall.x - w / 2, pBall.y - h / 2) < 47) {
    pBall.vx *= -1.2;
    pBall.vy *= -1.2;
    window.sounds.playSlash();
  }

  // Draw ball
  ctx.beginPath();
  ctx.arc(pBall.x, pBall.y, pBall.r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Scores
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${pinScore1}/3点`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${pinScore2}/3点`, 30, h - 30);

  requestAnimationFrame(pinballLoop);
}

/* ============================================================
   69. ホッケー・ペナルティ (Hockey Shot)
   ============================================================ */
let hockeyShotCanvas, hockeyShotCtx;
let goalieX = 150, goalieVx = 4;
let shotScore1 = 0, shotScore2 = 0;
let shotAttempts = 0;
let isHockeyShotRunning = false;

function initHockeyShotGame() {
  hockeyShotCanvas = document.getElementById('hockeyshot-canvas');
  hockeyShotCtx = hockeyShotCanvas.getContext('2d');
  hockeyShotCanvas.width = hockeyShotCanvas.clientWidth;
  hockeyShotCanvas.height = hockeyShotCanvas.clientHeight;

  goalieX = hockeyShotCanvas.width / 2;
  goalieVx = 4;
  shotScore1 = 0;
  shotScore2 = 0;
  shotAttempts = 0;
  isHockeyShotRunning = true;

  hockeyShotCanvas.onpointerdown = (e) => {
    if (!isHockeyShotRunning) return;
    const rect = hockeyShotCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < hockeyShotCanvas.height / 2 ? 1 : 2;

    shotAttempts++;
    if (Math.abs(x - goalieX) > 40) {
      // Goal!
      window.sounds.playSuccess();
      if (player === 1) shotScore1++;
      else shotScore2++;
    } else {
      // Saved!
      window.sounds.playSlash();
    }

    if (shotAttempts >= 6) {
      isHockeyShotRunning = false;
      const winner = shotScore1 > shotScore2 ? 'プレイヤー 1' : (shotScore2 > shotScore1 ? 'プレイヤー 2' : '引き分け');
      showModal('🏒 ペナルティ合戦終了！', `${winner} の勝利！\n(P1: ${shotScore1}点 vs P2: ${shotScore2}点)`, () => {
        initHockeyShotGame();
      });
    }
  };

  requestAnimationFrame(hockeyShotLoop);
}

function hockeyShotLoop() {
  if (currentScreen !== 'screen-hockeyshot' || !isHockeyShotRunning) return;

  const ctx = hockeyShotCtx;
  const w = hockeyShotCanvas.width;
  const h = hockeyShotCanvas.height;

  goalieX += goalieVx;
  if (goalieX < 50 || goalieX > w - 50) goalieVx *= -1;

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w, h);

  // Goal cage
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, h / 2 - 40, w - 80, 80);

  // Goalie
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🤺', goalieX, h / 2 + 15);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${shotScore1}点`, 58, getTopSafeY());
  ctx.fillText(`P2: ${shotScore2}点`, 25, h - 30);

  requestAnimationFrame(hockeyShotLoop);
}

/* ============================================================
   70. 金魚すくいポイバトル (Goldfish Scoop)
   ============================================================ */
let goldfishCanvas, goldfishCtx;
let fishes = [];
let goldP1Score = 0, goldP2Score = 0;
let goldP1Durability = 100, goldP2Durability = 100;
let isGoldRunning = false;

function initGoldfishGame() {
  goldfishCanvas = document.getElementById('goldfish-canvas');
  goldfishCtx = goldfishCanvas.getContext('2d');
  goldfishCanvas.width = goldfishCanvas.clientWidth;
  goldfishCanvas.height = goldfishCanvas.clientHeight;

  const w = goldfishCanvas.width;
  const h = goldfishCanvas.height;

  fishes = [];
  for (let i = 0; i < 8; i++) {
    fishes.push({
      x: 40 + Math.random() * (w - 80),
      y: 60 + Math.random() * (h - 120),
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3
    });
  }

  goldP1Score = 0;
  goldP2Score = 0;
  goldP1Durability = 100;
  goldP2Durability = 100;
  isGoldRunning = true;

  goldfishCanvas.onpointerdown = (e) => {
    if (!isGoldRunning) return;
    const rect = goldfishCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < goldfishCanvas.height / 2 ? 1 : 2;

    if (player === 1) goldP1Durability -= 12;
    else goldP2Durability -= 12;

    let hit = false;
    for (let i = 0; i < fishes.length; i++) {
      const f = fishes[i];
      if (Math.hypot(x - f.x, y - f.y) < 35) {
        hit = true;
        window.sounds.playSuccess();
        if (player === 1) goldP1Score++;
        else goldP2Score++;
        f.x = 40 + Math.random() * (goldfishCanvas.width - 80);
        f.y = 60 + Math.random() * (goldfishCanvas.height - 120);
        break;
      }
    }

    if (!hit) window.sounds.playTap();

    if (goldP1Durability <= 0 && goldP2Durability <= 0) {
      isGoldRunning = false;
      const winner = goldP1Score > goldP2Score ? 'プレイヤー 1' : (goldP2Score > goldP1Score ? 'プレイヤー 2' : '引き分け');
      showModal('🐠 ポイ全損・勝負あり！', `${winner} の勝利！\n(P1: ${goldP1Score}匹 vs P2: ${goldP2Score}匹)`, () => {
        initGoldfishGame();
      });
    }
  };

  requestAnimationFrame(goldfishLoop);
}

function goldfishLoop() {
  if (currentScreen !== 'screen-goldfish' || !isGoldRunning) return;

  const ctx = goldfishCtx;
  const w = goldfishCanvas.width;
  const h = goldfishCanvas.height;

  fishes.forEach(f => {
    f.x += f.vx;
    f.y += f.vy;
    if (f.x < 30 || f.x > w - 30) f.vx *= -1;
    if (f.y < 50 || f.y > h - 50) f.vy *= -1;
  });

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w, h);

  // Scores & Durability
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${goldP1Score}匹 (${Math.max(0, goldP1Durability)}%)`, 58, getTopSafeY());
  ctx.fillText(`P2: ${goldP2Score}匹 (${Math.max(0, goldP2Durability)}%)`, 25, h - 20);

  // Draw Fishes
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  fishes.forEach(f => {
    ctx.fillText('🐠', f.x, f.y);
  });

  requestAnimationFrame(goldfishLoop);
}

/* ============================================================
   71. 黒板消しダストバトル (Chalk Dust Clean)
   ============================================================ */
let chalkdustCanvas, chalkdustCtx;
let dustP1 = 100, dustP2 = 100;
let isChalkDustRunning = false;

function initChalkDustGame() {
  chalkdustCanvas = document.getElementById('chalkdust-canvas');
  chalkdustCtx = chalkdustCanvas.getContext('2d');
  chalkdustCanvas.width = chalkdustCanvas.clientWidth;
  chalkdustCanvas.height = chalkdustCanvas.clientHeight;

  dustP1 = 100;
  dustP2 = 100;
  isChalkDustRunning = true;

  chalkdustCanvas.onpointerdown = (e) => {
    if (!isChalkDustRunning) return;
    const y = e.clientY - chalkdustCanvas.getBoundingClientRect().top;
    if (y < chalkdustCanvas.height / 2) {
      dustP1 = Math.max(0, dustP1 - 4);
      if (dustP1 <= 0) {
        isChalkDustRunning = false;
        window.sounds.playSuccess();
        showModal('🧹 黒板ピカピカ！', 'プレイヤー 1 が最速でチョーク粉を掃除完了！', () => {
          initChalkDustGame();
        });
        return;
      }
    } else {
      dustP2 = Math.max(0, dustP2 - 4);
      if (dustP2 <= 0) {
        isChalkDustRunning = false;
        window.sounds.playSuccess();
        showModal('🧹 黒板ピカピカ！', 'プレイヤー 2 が最速でチョーク粉を掃除完了！', () => {
          initChalkDustGame();
        });
        return;
      }
    }
    window.sounds.playTap();
  };

  requestAnimationFrame(chalkDustLoop);
}

function chalkDustLoop() {
  if (currentScreen !== 'screen-chalkdust' || !isChalkDustRunning) return;

  const ctx = chalkdustCtx;
  const w = chalkdustCanvas.width;
  const h = chalkdustCanvas.height;

  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, w, h);

  // Divider
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // P1 Area
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  const chalkCleanY = getTopSafeY();
  drawP1Text(ctx, `P1 粉: ${dustP1}%`, 58, chalkCleanY);
  ctx.fillStyle = `rgba(255, 255, 255, ${dustP1 / 120})`;
  ctx.fillRect(30, chalkCleanY + 12, w - 60, h / 2 - (chalkCleanY + 25));
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧹 💨', w / 2, h * 0.25);

  // P2 Area
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`P2 粉: ${dustP2}%`, 25, h / 2 + 40);
  ctx.fillStyle = `rgba(255, 255, 255, ${dustP2 / 120})`;
  ctx.fillRect(30, h / 2 + 60, w - 60, h / 2 - 80);
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🧹 💨', w / 2, h * 0.75);

  requestAnimationFrame(chalkDustLoop);
}

/* ============================================================
   72. 輪ゴムパチンコ (Rubber Band Slingshot)
   ============================================================ */
let rubberCanvas, rubberCtx;
let rubberP1Score = 0, rubberP2Score = 0;
let rubberTarget = { x: 150, y: 150, vx: 3 };
let isRubberRunning = false;

function initRubberBandGame() {
  rubberCanvas = document.getElementById('rubberband-canvas');
  rubberCtx = rubberCanvas.getContext('2d');
  rubberCanvas.width = rubberCanvas.clientWidth;
  rubberCanvas.height = rubberCanvas.clientHeight;

  rubberP1Score = 0;
  rubberP2Score = 0;
  rubberTarget = { x: rubberCanvas.width / 2, y: rubberCanvas.height / 2, vx: 3.5 };
  isRubberRunning = true;

  rubberCanvas.onpointerdown = (e) => {
    if (!isRubberRunning) return;
    const rect = rubberCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < rubberCanvas.height / 2 ? 1 : 2;

    window.sounds.playGunshot();
    if (Math.abs(x - rubberTarget.x) < 35) {
      window.sounds.playSuccess();
      if (player === 1) rubberP1Score++;
      else rubberP2Score++;

      if (rubberP1Score >= 3 || rubberP2Score >= 3) {
        isRubberRunning = false;
        const winner = rubberP1Score >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
        showModal('🎯 スナイプ名手！', `${winner} の勝利！\n(P1: ${rubberP1Score}点 vs P2: ${rubberP2Score}点)`, () => {
          initRubberBandGame();
        });
      }
    }
  };

  requestAnimationFrame(rubberBandLoop);
}

function rubberBandLoop() {
  if (currentScreen !== 'screen-rubberband' || !isRubberRunning) return;

  const ctx = rubberCtx;
  const w = rubberCanvas.width;
  const h = rubberCanvas.height;

  rubberTarget.x += rubberTarget.vx;
  if (rubberTarget.x < 40 || rubberTarget.x > w - 40) rubberTarget.vx *= -1;

  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, 0, w, h);

  // Moving target
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🥫', rubberTarget.x, h / 2 + 15);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${rubberP1Score}/3点`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${rubberP2Score}/3点`, 25, h - 30);

  // Rubber band icons
  ctx.font = '36px sans-serif';
  ctx.fillText('🏹 💫', w / 2, getTopSafeY() + 25);
  ctx.fillText('🏹 💫', w / 2, h - 70);

  requestAnimationFrame(rubberBandLoop);
}

/* ============================================================
   73. 教科書タワー (Book Tower Gravity)
   ============================================================ */
let bookCanvas, bookCtx;
let bookFloor1 = 0, bookFloor2 = 0;
let bookX = 50, bookSpeed = 4;
let isBookRunning = false;

function initBookTowerGame() {
  bookCanvas = document.getElementById('booktower-canvas');
  bookCtx = bookCanvas.getContext('2d');
  bookCanvas.width = bookCanvas.clientWidth;
  bookCanvas.height = bookCanvas.clientHeight;

  bookFloor1 = 0;
  bookFloor2 = 0;
  bookX = 50;
  bookSpeed = 4;
  isBookRunning = true;

  bookCanvas.onpointerdown = (e) => {
    if (!isBookRunning) return;
    const y = e.clientY - bookCanvas.getBoundingClientRect().top;
    const center = bookCanvas.width / 2;
    const offset = Math.abs(bookX - center);

    if (offset < 45) {
      window.sounds.playSuccess();
      if (y < bookCanvas.height / 2) bookFloor1++;
      else bookFloor2++;

      if (bookFloor1 >= 5 || bookFloor2 >= 5) {
        isBookRunning = false;
        const winner = bookFloor1 >= 5 ? 'プレイヤー 1' : 'プレイヤー 2';
        showModal('📚 タワー完成！', `${winner} が5階建て教科書タワーを築き上げました！`, () => {
          initBookTowerGame();
        });
      }
    } else {
      window.sounds.playExplosion();
      // collapse
      if (y < bookCanvas.height / 2) bookFloor1 = Math.max(0, bookFloor1 - 1);
      else bookFloor2 = Math.max(0, bookFloor2 - 1);
    }
  };

  requestAnimationFrame(bookTowerLoop);
}

function bookTowerLoop() {
  if (currentScreen !== 'screen-booktower' || !isBookRunning) return;

  const ctx = bookCtx;
  const w = bookCanvas.width;
  const h = bookCanvas.height;

  bookX += bookSpeed;
  if (bookX < 40 || bookX > w - 40) bookSpeed *= -1;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Moving book
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📕', bookX, h / 2 + 10);

  // Stacks
  ctx.font = '28px sans-serif';
  for (let i = 0; i < bookFloor1; i++) {
    ctx.fillText('📘', w / 2, h * 0.25 - i * 22);
  }
  for (let i = 0; i < bookFloor2; i++) {
    ctx.fillText('📗', w / 2, h * 0.75 - i * 22);
  }

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${bookFloor1}/5冊`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${bookFloor2}/5冊`, 25, h - 30);

  requestAnimationFrame(bookTowerLoop);
}

/* ============================================================
   74. ペン回しスピンマスター (Pen Spin Master)
   ============================================================ */
let penCanvas, penCtx;
let penSpin1 = 0, penSpin2 = 0;
let isPenRunning = false;

function initPenSpinGame() {
  penCanvas = document.getElementById('penspin-canvas');
  penCtx = penCanvas.getContext('2d');
  penCanvas.width = penCanvas.clientWidth;
  penCanvas.height = penCanvas.clientHeight;

  penSpin1 = 0;
  penSpin2 = 0;
  isPenRunning = true;

  penCanvas.onpointerdown = (e) => {
    if (!isPenRunning) return;
    const y = e.clientY - penCanvas.getBoundingClientRect().top;
    if (y < penCanvas.height / 2) {
      penSpin1++;
      if (penSpin1 >= 20) {
        isPenRunning = false;
        window.sounds.playSuccess();
        showModal('✒️ ペン回し神業！', 'プレイヤー 1 が20回転の大技を達成！', () => {
          initPenSpinGame();
        });
        return;
      }
    } else {
      penSpin2++;
      if (penSpin2 >= 20) {
        isPenRunning = false;
        window.sounds.playSuccess();
        showModal('✒️ ペン回し神業！', 'プレイヤー 2 が20回転の大技を達成！', () => {
          initPenSpinGame();
        });
        return;
      }
    }
    window.sounds.playSlash();
  };

  requestAnimationFrame(penSpinLoop);
}

function penSpinLoop() {
  if (currentScreen !== 'screen-penspin' || !isPenRunning) return;

  const ctx = penCtx;
  const w = penCanvas.width;
  const h = penCanvas.height;

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, w, h);

  // P1 Pen
  ctx.save();
  ctx.translate(w / 2, h * 0.25);
  ctx.rotate(performance.now() * 0.01 * (1 + penSpin1 * 0.2));
  ctx.font = '60px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✏️', 0, 15);
  ctx.restore();

  // P2 Pen
  ctx.save();
  ctx.translate(w / 2, h * 0.75);
  ctx.rotate(performance.now() * 0.01 * (1 + penSpin2 * 0.2));
  ctx.font = '60px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🖋️', 0, 15);
  ctx.restore();

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${penSpin1}/20回転`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${penSpin2}/20回転`, 25, h - 30);

  requestAnimationFrame(penSpinLoop);
}

/* ============================================================
   75. キャップカーリング (Desk Curling)
   ============================================================ */
let curlCanvas, curlCtx;
let curlP1Dist = 999, curlP2Dist = 999;
let curlP1Turn = true;
let isCurlRunning = false;

function initDeskCurlingGame() {
  curlCanvas = document.getElementById('deskcurling-canvas');
  curlCtx = curlCanvas.getContext('2d');
  curlCanvas.width = curlCanvas.clientWidth;
  curlCanvas.height = curlCanvas.clientHeight;

  curlP1Dist = 999;
  curlP2Dist = 999;
  curlP1Turn = true;
  isCurlRunning = true;

  curlCanvas.onpointerdown = (e) => {
    if (!isCurlRunning) return;
    const rect = curlCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerDist = Math.hypot(x - curlCanvas.width / 2, y - curlCanvas.height / 2);
    window.sounds.playGunshot();

    if (curlP1Turn) {
      curlP1Dist = centerDist;
      curlP1Turn = false;
    } else {
      curlP2Dist = centerDist;
      isCurlRunning = false;
      window.sounds.playSuccess();
      const winner = curlP1Dist < curlP2Dist ? 'プレイヤー 1' : 'プレイヤー 2';
      showModal(`🎯 カーリング決着！`, `${winner} の勝利！\n(P1距離: ${Math.round(curlP1Dist)}px / P2距離: ${Math.round(curlP2Dist)}px)`, () => {
        initDeskCurlingGame();
      });
    }
  };

  requestAnimationFrame(deskCurlingLoop);
}

function deskCurlingLoop() {
  if (currentScreen !== 'screen-deskcurling' || !isCurlRunning) return;

  const ctx = curlCtx;
  const w = curlCanvas.width;
  const h = curlCanvas.height;
  const topY = getTopSafeY();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // ハウス (同心円ターゲット)
  [120, 80, 40].forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.fillStyle = idx === 0 ? 'rgba(59, 130, 246, 0.25)' : (idx === 1 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(250, 204, 21, 0.4)');
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 対面ラベル
  drawP1Text(ctx, `🔴 P1: ${curlP1Turn ? '【あなたの番: 指で弾いて中心を狙え！】' : '(投球完了)'}`, w / 2, topY + 16, 'bold 15px sans-serif', '#ef4444', 'center');
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText(`🔵 P2: ${!curlP1Turn ? '【あなたの番: 指で弾いて中心を狙え！】' : '(投球完了)'}`, w / 2, h - 30);

  // 投げたキャップの位置
  if (curlP1Dist !== 999) {
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔴', w / 2, (h / 2) - curlP1Dist * 0.8);
  }

  requestAnimationFrame(deskCurlingLoop);
}

/* ============================================================
   76. 早押し電卓フラッシュ (Calculator Flash)
   ============================================================ */
let calcCanvas, calcCtx;
let calcA = 3, calcB = 4, calcAns = 7;
let calcP1Score = 0, calcP2Score = 0;
let isCalcRunning = false;

function initCalculatorGame() {
  calcCanvas = document.getElementById('calculator-canvas');
  calcCtx = calcCanvas.getContext('2d');
  calcCanvas.width = calcCanvas.clientWidth;
  calcCanvas.height = calcCanvas.clientHeight;

  calcP1Score = 0;
  calcP2Score = 0;
  isCalcRunning = true;
  nextCalcQuiz();

  calcCanvas.onpointerdown = (e) => {
    if (!isCalcRunning) return;
    const rect = calcCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = y < calcCanvas.height / 2 ? 1 : 2;

    // Check digit hit 1..9
    const col = Math.floor(x / (calcCanvas.width / 3));
    const tappedVal = col + 1; // 1, 2, 3...

    if (tappedVal === calcAns) {
      window.sounds.playSuccess();
      if (player === 1) calcP1Score++;
      else calcP2Score++;

      if (calcP1Score >= 3 || calcP2Score >= 3) {
        isCalcRunning = false;
        const winner = calcP1Score >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
        showModal('🧮 計算マスター！', `${winner} の勝利！\n(P1: ${calcP1Score}問 vs P2: ${calcP2Score}問)`, () => {
          initCalculatorGame();
        });
      } else {
        nextCalcQuiz();
      }
    } else {
      window.sounds.playSlash();
    }
  };

  requestAnimationFrame(calculatorLoop);
}

function nextCalcQuiz() {
  calcA = 1 + Math.floor(Math.random() * 4);
  calcB = 1 + Math.floor(Math.random() * 4);
  calcAns = calcA + calcB; // 2..8
}

function calculatorLoop() {
  if (currentScreen !== 'screen-calculator' || !isCalcRunning) return;

  const ctx = calcCtx;
  const w = calcCanvas.width;
  const h = calcCanvas.height;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);

  // Question in center
  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = '#facc15';
  ctx.textAlign = 'center';
  ctx.fillText(`${calcA} + ${calcB} = ?`, w / 2, h / 2 + 10);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${calcP1Score}/3問`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${calcP2Score}/3問`, 25, h - 30);

  // Number selection buttons preview
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('数字をタップして回答', w / 2, 90);
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('数字をタップして回答', w / 2, h - 70);

  requestAnimationFrame(calculatorLoop);
}

/* ============================================================
   77. 給食パン争奪バトル (Lunch Bread Grab)
   ============================================================ */
let breadCanvas, breadCtx;
let breadActive = false;
let breadP1Score = 0, breadP2Score = 0;
let breadTimer = 0;
let isBreadRunning = false;

function initLunchBreadGame() {
  breadCanvas = document.getElementById('lunchbread-canvas');
  breadCtx = breadCanvas.getContext('2d');
  breadCanvas.width = breadCanvas.clientWidth;
  breadCanvas.height = breadCanvas.clientHeight;

  breadP1Score = 0;
  breadP2Score = 0;
  breadActive = false;
  breadTimer = 60 + Math.random() * 80;
  isBreadRunning = true;

  breadCanvas.onpointerdown = (e) => {
    if (!isBreadRunning) return;
    const y = e.clientY - breadCanvas.getBoundingClientRect().top;
    const player = y < breadCanvas.height / 2 ? 1 : 2;

    if (breadActive) {
      window.sounds.playSuccess();
      breadActive = false;
      breadTimer = 60 + Math.random() * 80;
      if (player === 1) breadP1Score++;
      else breadP2Score++;

      if (breadP1Score >= 3 || breadP2Score >= 3) {
        isBreadRunning = false;
        const winner = breadP1Score >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
        showModal('🥖 揚げパン争奪勝利！', `${winner} が人気パンを独り占め！`, () => {
          initLunchBreadGame();
        });
      }
    } else {
      window.sounds.playExplosion();
      // False start penalty
      if (player === 1) breadP1Score = Math.max(0, breadP1Score - 1);
      else breadP2Score = Math.max(0, breadP2Score - 1);
    }
  };

  requestAnimationFrame(lunchBreadLoop);
}

function lunchBreadLoop() {
  if (currentScreen !== 'screen-lunchbread' || !isBreadRunning) return;

  const ctx = breadCtx;
  const w = breadCanvas.width;
  const h = breadCanvas.height;

  breadTimer--;
  if (breadTimer <= 0 && !breadActive) {
    breadActive = true;
    window.sounds.playGunshot();
  }

  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, 0, w, h);

  // Tray
  ctx.fillStyle = '#78350f';
  ctx.fillRect(w / 2 - 70, h / 2 - 40, 140, 80);

  if (breadActive) {
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥖', w / 2, h / 2 + 18);
  }

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${breadP1Score}/3本`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${breadP2Score}/3本`, 25, h - 30);

  requestAnimationFrame(lunchBreadLoop);
}

/* ============================================================
   78. 目薬さしドロップ (Eye Drops)
   ============================================================ */
let eyeCanvas, eyeCtx;
let eyeOpen = true;
let eyeTimer = 60;
let eyeScore1 = 0, eyeScore2 = 0;
let isEyeRunning = false;

function initEyeDropsGame() {
  eyeCanvas = document.getElementById('eyedrops-canvas');
  eyeCtx = eyeCanvas.getContext('2d');
  eyeCanvas.width = eyeCanvas.clientWidth;
  eyeCanvas.height = eyeCanvas.clientHeight;

  eyeOpen = true;
  eyeTimer = 60;
  eyeScore1 = 0;
  eyeScore2 = 0;
  isEyeRunning = true;

  eyeCanvas.onpointerdown = (e) => {
    if (!isEyeRunning) return;
    const y = e.clientY - eyeCanvas.getBoundingClientRect().top;
    const player = y < eyeCanvas.height / 2 ? 1 : 2;

    if (eyeOpen) {
      window.sounds.playSuccess();
      if (player === 1) eyeScore1++;
      else eyeScore2++;

      if (eyeScore1 >= 3 || eyeScore2 >= 3) {
        isEyeRunning = false;
        const winner = eyeScore1 >= 3 ? 'プレイヤー 1' : 'プレイヤー 2';
        showModal('💧 点眼パーフェクト！', `${winner} の勝利！\n(P1: ${eyeScore1}滴 vs P2: ${eyeScore2}滴)`, () => {
          initEyeDropsGame();
        });
      }
    } else {
      window.sounds.playSlash();
    }
  };

  requestAnimationFrame(eyeDropsLoop);
}

function eyeDropsLoop() {
  if (currentScreen !== 'screen-eyedrops' || !isEyeRunning) return;

  const ctx = eyeCtx;
  const w = eyeCanvas.width;
  const h = eyeCanvas.height;

  eyeTimer--;
  if (eyeTimer <= 0) {
    eyeOpen = !eyeOpen;
    eyeTimer = eyeOpen ? 60 + Math.random() * 40 : 25;
  }

  ctx.fillStyle = '#082f49';
  ctx.fillRect(0, 0, w, h);

  // Big Eye
  ctx.font = '72px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(eyeOpen ? '👀' : '😌', w / 2, h / 2 + 25);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${eyeScore1}/3滴`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${eyeScore2}/3滴`, 25, h - 30);

  // Drops
  ctx.font = '36px sans-serif';
  ctx.fillText('💧', w / 2, getTopSafeY() + 30);
  ctx.fillText('💧', w / 2, h - 70);

  requestAnimationFrame(eyeDropsLoop);
}

/* ============================================================
   79. ダブルダッチ縄跳び (Double Dutch)
   ============================================================ */
let dutchCanvas, dutchCtx;
let dutchScore1 = 0, dutchScore2 = 0;
let isDutchRunning = false;

function initDoubleDutchGame() {
  dutchCanvas = document.getElementById('doubledutch-canvas');
  dutchCtx = dutchCanvas.getContext('2d');
  dutchCanvas.width = dutchCanvas.clientWidth;
  dutchCanvas.height = dutchCanvas.clientHeight;

  dutchScore1 = 0;
  dutchScore2 = 0;
  isDutchRunning = true;

  dutchCanvas.onpointerdown = (e) => {
    if (!isDutchRunning) return;
    const y = e.clientY - dutchCanvas.getBoundingClientRect().top;
    if (y < dutchCanvas.height / 2) {
      dutchScore1++;
      if (dutchScore1 >= 10) {
        isDutchRunning = false;
        window.sounds.playSuccess();
        showModal('🪢 10回連続ジャンプ！', 'プレイヤー 1 がダブルダッチをクリア！', () => {
          initDoubleDutchGame();
        });
        return;
      }
    } else {
      dutchScore2++;
      if (dutchScore2 >= 10) {
        isDutchRunning = false;
        window.sounds.playSuccess();
        showModal('🪢 10回連続ジャンプ！', 'プレイヤー 2 がダブルダッチをクリア！', () => {
          initDoubleDutchGame();
        });
        return;
      }
    }
    window.sounds.playTap();
  };

  requestAnimationFrame(doubleDutchLoop);
}

function doubleDutchLoop() {
  if (currentScreen !== 'screen-doubledutch' || !isDutchRunning) return;

  const ctx = dutchCtx;
  const w = dutchCanvas.width;
  const h = dutchCanvas.height;

  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, w, h);

  // Jumpers
  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🤸', w / 2, h * 0.25 + Math.sin(performance.now() * 0.01) * 20);
  ctx.fillText('🤸', w / 2, h * 0.75 + Math.sin(performance.now() * 0.01) * 20);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${dutchScore1}/10回`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${dutchScore2}/10回`, 25, h - 30);

  requestAnimationFrame(doubleDutchLoop);
}

/* ============================================================
   80. ロケット打上バトル (Rocket Launch)
   ============================================================ */
let rocketCanvas, rocketCtx;
let rockAlt1 = 0, rockAlt2 = 0;
let isRocketRunning = false;

function initRocketLaunchGame() {
  rocketCanvas = document.getElementById('rocketlaunch-canvas');
  rocketCtx = rocketCanvas.getContext('2d');
  rocketCanvas.width = rocketCanvas.clientWidth;
  rocketCanvas.height = rocketCanvas.clientHeight;

  rockAlt1 = 0;
  rockAlt2 = 0;
  isRocketRunning = true;

  rocketCanvas.onpointerdown = (e) => {
    if (!isRocketRunning) return;
    const y = e.clientY - rocketCanvas.getBoundingClientRect().top;
    if (y < rocketCanvas.height / 2) {
      rockAlt1 += 15;
      if (rockAlt1 >= 500) {
        isRocketRunning = false;
        window.sounds.playSuccess();
        showModal('🚀 宇宙へ到達！', 'プレイヤー 1 のロケットが成層圏を突破しました！', () => {
          initRocketLaunchGame();
        });
        return;
      }
    } else {
      rockAlt2 += 15;
      if (rockAlt2 >= 500) {
        isRocketRunning = false;
        window.sounds.playSuccess();
        showModal('🚀 宇宙へ到達！', 'プレイヤー 2 のロケットが成層圏を突破しました！', () => {
          initRocketLaunchGame();
        });
        return;
      }
    }
    window.sounds.playGunshot();
  };

  requestAnimationFrame(rocketLaunchLoop);
}

function rocketLaunchLoop() {
  if (currentScreen !== 'screen-rocketlaunch' || !isRocketRunning) return;

  const ctx = rocketCtx;
  const w = rocketCanvas.width;
  const h = rocketCanvas.height;

  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, w, h);

  // Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 20; i++) {
    ctx.fillRect((i * 37) % w, (i * 59) % h, 2, 2);
  }

  // P1 Rocket
  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🚀 🔥', w / 2, h * 0.40 - rockAlt1 * 0.4);

  // P2 Rocket
  ctx.fillText('🚀 🔥', w / 2, h * 0.90 - rockAlt2 * 0.4);

  // Scores
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = '#f87171';
  ctx.textAlign = 'left';
  drawP1Text(ctx, `P1: ${rockAlt1}km / 500km`, 58, getTopSafeY());
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`P2: ${rockAlt2}km / 500km`, 25, h - 30);

  requestAnimationFrame(rocketLaunchLoop);
}

/* ============================================================
   PWA（ホーム画面に追加・アプリ化）＆スマホタッチ最適化
   ============================================================ */

let deferredInstallPrompt = null;

// Android / Chrome 等のネイティブインストールプロンプト保持
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('btn-install-app');
  if (btn) btn.style.display = 'inline-flex';
});

function showInstallGuide() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        const btn = document.getElementById('btn-install-app');
        if (btn) btn.style.display = 'none';
      }
      deferredInstallPrompt = null;
    });
    return;
  }

  const modal = document.getElementById('modal-install');
  const guideIos = document.getElementById('install-guide-ios');
  const guideAndroid = document.getElementById('install-guide-android');
  
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (guideIos && guideAndroid) {
    if (isIos) {
      guideIos.style.display = 'block';
      guideAndroid.style.display = 'none';
    } else {
      guideIos.style.display = 'none';
      guideAndroid.style.display = 'block';
    }
  }

  if (modal) modal.style.display = 'flex';
}

function closeInstallGuide() {
  const modal = document.getElementById('modal-install');
  if (modal) modal.style.display = 'none';
}

// サービスワーカー登録（オフラインプレイ＆PWA化）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=4').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New version detected! Auto reloading...');
              window.location.reload();
            }
          });
        }
      });
    }).catch((err) => {
      console.log('ServiceWorker note:', err);
    });
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// スマホでの初回タッチ時にオーディオコンテキストをアンロック
window.addEventListener('touchstart', () => {
  if (window.sounds) window.sounds.init();
}, { once: true });

window.addEventListener('pointerdown', () => {
  if (window.sounds) window.sounds.init();
}, { once: true });

// 連打系ゲームでのスマホ画面ピンチズーム・ダブルタップ拡大を無効化
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

let lastTouchEndTimer = 0;
document.addEventListener('touchend', (e) => {
  const now = performance.now();
  if (now - lastTouchEndTimer <= 300) {
    // フォームやボタン以外の連打ズームを抑止
    if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
    }
  }
  lastTouchEndTimer = now;
}, { passive: false });

