import requests
from bs4 import BeautifulSoup
import json
import random

# 裁判所判例検索サイトURL
BASE_URL = "https://www.courts.go.jp/app/hanrei_jp/search1"

def fetch_cases(keyword, max_cases=10):
    """判例検索サイトからデータを取得"""
    params = {
        "searchWord": keyword,
        "page": 1
    }
    response = requests.get(BASE_URL, params=params)
    soup = BeautifulSoup(response.content, "html.parser")
    
    cases = []
    results = soup.select(".searchResult")[:max_cases]  # 最大 max_cases 件取得
    for result in results:
        title = result.select_one(".title").text.strip()
        summary = result.select_one(".summary").text.strip()
        link = result.select_one("a")["href"]
        cases.append({
            "title": title,
            "summary": summary,
            "link": f"https://www.courts.go.jp{link}"
        })
    return cases

def create_game_data(cases):
    """ゲーム用の問題データを生成"""
    game_data = []
    for case in cases:
        words = case["summary"].split()
        if len(words) < 3:  # 判例文が短すぎる場合はスキップ
            continue
        hidden_index = random.randint(0, len(words) - 1)
        problem = " ".join(
            ["_" * len(word) if i == hidden_index else word for i, word in enumerate(words)]
        )
        game_data.append({
            "original": case["summary"],
            "problem": problem,
            "link": case["link"]
        })
    return game_data

def main():
    """メイン処理"""
    keyword = "表現の自由"  # 検索キーワードを指定
    max_cases = 10  # 最大取得件数
    print(f"「{keyword}」に関連する判例を取得中...")
    
    cases = fetch_cases(keyword, max_cases)
    if not cases:
        print("判例が見つかりませんでした。")
        return

    game_data = create_game_data(cases)
    
    # JSONファイルに保存
    with open("game_data.json", "w", encoding="utf-8") as f:
        json.dump(game_data, f, ensure_ascii=False, indent=2)
    
    print("game_data.json を生成しました！")

if __name__ == "__main__":
    main()
