function send_notification_to_slack() {
  const slack_webhook_url = "{url}";

  // Gmailから質問箱の内容を取得する
  const query = 'Subject:"{name}さん、あなたに質問が届きました！" AND is:unread';
  const threads = GmailApp.search(query);
  if (threads.length == 0) {
    return;
  }
  let messages = threads[threads.length - 1].getMessages();
  let message = messages[messages.length - 1];
  let mail_Body = message.getBody();
  let mail_question = Parser.data(mail_Body).from('alt="').to('"').build();
  const text = "質問箱に質問が来ました。\n回答しましょう！\n質問: " + mail_question;
  GmailApp.markThreadsRead(threads);

  // SlackのWebhook URLに投稿するデータをまとめる
  const json = {
    "text": text,
  };

  // SlackのWebhook URLに送信するデータをJSONに変換する
  const payload = JSON.stringify(json);

  // UrlFetchAppで使用するメソッドやコンテントタイプを指定
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": payload,
  };

  // Slackに送信
  UrlFetchApp.fetch(slack_webhook_url, options);
}
