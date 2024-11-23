import requests
from bs4 import BeautifulSoup

# 判例検索のベースURL
BASE_URL = "https://www.courts.go.jp/app/hanrei_jp/search2"

# 判例を取得する関数
def fetch_cases(keyword, max_cases=5):
    """指定したキーワードで判例を検索して取得"""
    params = {
        "searchWord": keyword,
        "page": "1",
    }

    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()  # エラー時に例外を発生
    soup = BeautifulSoup(response.text, "html.parser")

    cases = []
    results = soup.select(".searchResult")[:max_cases]
    for result in results:
        title = result.select_one(".title").text.strip()
        summary = result.select_one(".summary").text.strip()
        link = result.select_one("a")["href"]
        cases.append({
            "title": title,
            "summary": summary,
            "link": f"https://www.courts.go.jp{link}",
        })
    return cases

# HTMLを生成する関数
def generate_html(cases):
    """判例データを使用してHTMLファイルを生成"""
    html_content = """<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>判例タイピングゲーム</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            margin: 0;
            padding: 0;
        }
        h1 {
            color: #0078d7;
        }
        .case {
            margin: 20px auto;
            padding: 15px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 90%;
            max-width: 600px;
            text-align: left;
        }
        .case a {
            text-decoration: none;
            color: #0078d7;
        }
        .case a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>判例タイピングゲーム</h1>
    <div id="cases">
"""
    for case in cases:
        html_content += f"""
        <div class="case">
            <h2>{case['title']}</h2>
            <p>{case['summary']}</p>
            <a href="{case['link']}" target="_blank">判例全文を見る</a>
        </div>
"""
    html_content += """
    </div>
</body>
</html>
"""
    return html_content

# メイン処理
def main():
    # 検索キーワードを指定
    keyword = "憲法"
    cases = fetch_cases(keyword)

    # HTMLファイルを生成
    html_content = generate_html(cases)

    # HTMLを保存
    with open("hanrei_typing.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("HTMLファイルが生成されました: hanrei_typing.html")

# 実行
if __name__ == "__main__":
    main()
