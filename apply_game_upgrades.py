import re

js = open('app.js', 'r', encoding='utf-8').read()

# 1. BLOCKTENNIS
old_bt = """function initBlockTennisGame() {
  blocktennisCanvas = document.getElementById('blocktennis-canvas');
  blocktennisCtx = blocktennisCanvas.getContext('2d');
  blocktennisCanvas.width = blocktennisCanvas.clientWidth;
  blocktennisCanvas.height = blocktennisCanvas.clientHeight;

  const w = blocktennisCanvas.width;
  const h = blocktennisCanvas.height;
  btBall = { x: w / 2, y: h / 2, vx: 4, vy: 5 };
  isBtRunning = true;

  requestAnimationFrame(btLoop);
}

function btLoop() {
  if (currentScreen !== 'screen-blocktennis' || !isBtRunning) return;

  const ctx = blocktennisCtx;
  const w = blocktennisCanvas.width;
  const h = blocktennisCanvas.height;

  btBall.x += btBall.vx;
  btBall.y += btBall.vy;

  btObstacleX += btObstacleVx;
  if (btObstacleX < 40 || btObstacleX > w - 40) btObstacleVx = -btObstacleVx;

  if (btBall.x < 15 || btBall.x > w - 15) btBall.vx = -btBall.vx;

  // 中央障害物反射
  if (Math.abs(btBall.y - h / 2) < 18 && Math.abs(btBall.x - btObstacleX) < 40) {
    btBall.vy = -btBall.vy;
    window.sounds.playTap();
  }

  // アウト判定
  if (btBall.y < 0) {
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

  // 中央動くブロック
  ctx.fillStyle = '#facc15';
  ctx.fillRect(btObstacleX - 40, h / 2 - 10, 80, 20);

  // ボール
  ctx.beginPath();
  ctx.arc(btBall.x, btBall.y, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  requestAnimationFrame(btLoop);
}"""

new_bt = """let btPaddle1 = 0, btPaddle2 = 0;

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
}"""

assert old_bt in js, "old_bt not found in app.js"
js = js.replace(old_bt, new_bt)
print("Blocktennis upgraded.")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)
