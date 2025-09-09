const cfg = require('../config/appConfig');

function toSpeechText(text) {
  if (!text) return '';
  let s = String(text).replace(/\n+/g, ' ');
  if (cfg.text.stripUrls) {
    // 1) Markdownリンク [ラベル](https://...) → 「ラベル」
      s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, '$1');
    
      // 2) <https://...> 形式のオートリンクを除去
      s = s.replace(/<https?:\/\/[^>]+>/gi, '');
    
      // 3) http/https から始まるURLを除去
      s = s.replace(/https?:\/\/\S+/gi, '');
    
      // 4) 裸のドメイン（example.com / sub.example.co.jp/path など）を除去
      //    - 末尾のパス/クエリもまとめて消す
      s = s.replace(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?/gi, '');
    
      // 5) メールアドレスを除去
      s = s.replace(/\b[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi, '');
    
      // 6) 単独の .com / .net など（日本語カッコ含む）のトークンを除去
      s = s.replace(/(^|[\s（(])\.[a-z]{2,}(?=[\s）)]|$)/gi, '$1');
    
      // 7) URL削除の名残り（空カッコ、連続スペース）を整理
      s = s.replace(/[（(]\s*[）)]/g, '');      // 空の（）/() を削除
      s = s.replace(/\s{2,}/g, ' ').trim();     // 連続スペースを1つに
  }
  s = s.replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').trim();
  const MAX = cfg.text.maxSpeechChars;
  if (MAX && s.length > MAX) s = s.slice(0, MAX) + '。続きはカードをご覧ください。';
  return s;
}

function toCardText(text) {
  if (!text) return '';
  return String(text).replace(/\n{3,}/g, '\n\n').trim();
}

function trimConversation(conv, maxTurns = cfg.convo.maxTurns) {
  const sys = conv[0];
  const rest = conv.slice(1);
  return [sys].concat(rest.slice(-maxTurns * 2));
}

module.exports = { toSpeechText, toCardText, trimConversation };
