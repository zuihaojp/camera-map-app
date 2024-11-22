function drawCard() {
  const cards = [
    { name: "愚者", image: "images/fool.jpg", message: "自由な気持ちで冒険に出ましょう！新しいスタートが待っています。" },
    { name: "魔術師", image: "images/magician.jpg", message: "チャンスを掴むときです！自信を持って行動してください。" },
    { name: "女教皇", image: "images/high-priestess.jpg", message: "直感を信じて静かに見守るとき。焦らず状況を観察しましょう。" },
    { name: "女帝", image: "images/empress.jpg", message: "豊かさと成長の象徴。今は良い結果が期待できます！" },
    { name: "皇帝", image: "images/emperor.jpg", message: "安定した計画が必要です。自信を持ってリーダーシップを発揮しましょう。" },
    { name: "法王", image: "images/hierophant.jpg", message: "伝統や規律を大切に。周りと協力して進みましょう。" },
    { name: "恋人", image: "images/lovers.jpg", message: "大切な人との絆を深めるとき。愛情を大切にしてください。" },
    { name: "戦車", image: "images/chariot.jpg", message: "目標に向かって突き進む力があります。自信を持って前進を！" },
    { name: "力", image: "images/strength.jpg", message: "心の強さが試される時。勇気を持って立ち向かいましょう。" },
    { name: "運命の輪", image: "images/wheel-of-fortune.jpg", message: "運命が変わる兆し。チャンスを逃さないように！" }
  ];

  // ランダムなカードを引く
  const card = cards[Math.floor(Math.random() * cards.length)];

  // カード情報を表示
  const resultDiv = document.getElementById("result");
  const cardImage = document.getElementById("card-image");
  const message = document.getElementById("message");

  cardImage.src = card.image;
  cardImage.style.display = "block";
  message.textContent = `${card.name}: ${card.message}`;
}