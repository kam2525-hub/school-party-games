import re
import sys

def verify_codebase():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    errors = []

    # 1. startGame('key') が switch (gameKey) にあるか
    menu_keys = re.findall(r"startGame\('([a-zA-Z0-9_-]+)'\)", html)
    switch_cases = re.findall(r"case\s+'([a-zA-Z0-9_-]+)':", js)

    print(f"Total game keys in menu: {len(menu_keys)}")
    print(f"Total switch cases in app.js: {len(switch_cases)}")

    for k in menu_keys:
        if k not in switch_cases:
            errors.append(f"Missing switch case in app.js for key: '{k}'")

    # 2. showScreen('screen-xxx') の要素が index.html に存在するか
    screens = re.findall(r"showScreen\('([a-zA-Z0-9_-]+)'\)", js)
    for s in set(screens):
        if f'id="{s}"' not in html and f"id='{s}'" not in html:
            errors.append(f"Screen ID '{s}' called in showScreen() not found in index.html")

    # 3. getElementById('xxx') の要素が index.html に存在するか
    get_ids = re.findall(r"getElementById\('([a-zA-Z0-9_-]+)'\)", js)
    for gid in set(get_ids):
        if f'id="{gid}"' not in html and f"id='{gid}'" not in html:
            errors.append(f"Element ID '{gid}' accessed via getElementById() not found in index.html")

    if errors:
        print("ERRORS FOUND:")
        for err in errors:
            print("  -", err)
        sys.exit(1)
    else:
        print("SUCCESS: All element IDs, screens, and router keys perfectly match!")

if __name__ == '__main__':
    verify_codebase()
