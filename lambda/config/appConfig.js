// すべての調整パラメータをここで一元管理
module.exports = Object.freeze({
  openai: {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini-search-preview', // モデル名
    system_message: process.env.SYSTEM_MESSAGE || 'あなたは優秀なAIです。助けになるように真剣に答えてください。', // システムメッセージ
    maxTokens: process.env.OPENAI_MAX_TOKENS ? Number(process.env.OPENAI_MAX_TOKENS) : 200, // 最大トークン
    maxRetries: process.env.OPENAI_MAX_RETRIES ? Number(process.env.OPENAI_MAX_RETRIES) : 3, // 聞き直す回数
    initialBackoffMs: process.env.OPENAI_BACKOFF_MS ? Number(process.env.OPENAI_BACKOFF_MS) : 500, 
  },
  speech: {
    rate: process.env.SPEECH_RATE || '150%',  // 読み上げデフォ速度
  },
  text: {
    stripUrls: true,                                   // URL読み上げ禁止
    maxSpeechChars: process.env.MAX_SPEECH_CHARS ? Number(process.env.MAX_SPEECH_CHARS) : 300,
  },
  convo: {
    maxTurns: process.env.CONVO_MAX_TURNS ? Number(process.env.CONVO_MAX_TURNS) : 2, // 直近N往復
    concisePrefix: process.env.CONCISE_PREFIX || 'わかりやすく簡潔に答えて。'
  }
});