import subprocess
import time
import os

# index.htmlに全30ゲームの初期化を自動実行してコンソールに出力するテストランナーを作成
test_html_content = open('index.html', 'r', encoding='utf-8').read()

test_script = """
<script>
window.testResults = [];
window.addEventListener('load', () => {
  const games = [
    'sumo', 'reflex', 'wolf', 'bomb', 'twister',
    'hockey', 'rps', 'knife', 'color', 'space',
    'pong', 'penalty', 'racer', 'lumber', 'jump',
    'numbers', 'fishing', 'slash', 'highlow', 'tank',
    'basket', 'darts', 'rope', 'breakout', 'ufo',
    'boxing', 'highway', 'rhythm', 'mines', 'archery',
    'cricket', 'hurdle', 'snake', 'invaders', 'curling',
    'memory', 'skate', 'catch', 'blocktennis', 'seesaw'
  ];

  let successCount = 0;
  for (const g of games) {
    try {
      startGame(g);
      successCount++;
      console.log(`[TEST_OK] Game: ${g}`);
    } catch (e) {
      console.error(`[TEST_ERR] Game: ${g} -> ${e.message} at ${e.stack}`);
    }
  }

  const out = document.createElement('div');
  out.id = 'test-summary';
  out.textContent = `RESULT: ${successCount}/${games.length} GAMES INITIALIZED SUCCESSFULLY`;
  document.body.appendChild(out);
});
</script>
"""

# </body>の直前にテストスクリプトを挿入
test_html = test_html_content.replace('</body>', test_script + '\n</body>')
with open('test_runner.html', 'w', encoding='utf-8') as f:
    f.write(test_html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
file_url = "file:///" + os.path.abspath('test_runner.html').replace('\\', '/')

cmd = [
    edge_path,
    "--headless",
    "--dump-dom",
    "--disable-gpu",
    file_url
]

print("Launching Edge to verify all 40 games...")
result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

if "RESULT: 40/40 GAMES INITIALIZED SUCCESSFULLY" in result.stdout:
    print("\n[SUCCESS] All 40 mini-games successfully initialized in real Edge browser engine with zero errors!")
else:
    print("Browser DOM Dump Output:")
    for line in result.stdout.splitlines()[-15:]:
        print(line)
