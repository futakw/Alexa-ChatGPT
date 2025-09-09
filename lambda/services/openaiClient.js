const { Configuration, OpenAIApi } = require('openai');
const keys = require('../config/keys');
const cfg = require('../config/appConfig');

const configuration = new Configuration({ apiKey: keys.OPEN_AI_KEY });
const openai = new OpenAIApi(configuration);

function isNumber(x) { return typeof x === 'number' && !isNaN(x); }
function normOpts(opts) {
  // どんな値が来ても「オブジェクト」に正規化
  if (!opts || typeof opts !== 'object') return {};
  return opts;
}

// 429/5xx リトライ付き
async function getAnswer(messages, opts) {
  opts = normOpts(opts);

  const maxTokens   = isNumber(opts.max_tokens)      ? opts.max_tokens      : cfg.openai.maxTokens;
  const maxRetries  = isNumber(opts.maxRetries)      ? opts.maxRetries      : cfg.openai.maxRetries;
  let   waitMs      = isNumber(opts.initialBackoffMs)? opts.initialBackoffMs: cfg.openai.initialBackoffMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const payload = {
        model: cfg.openai.model,
        messages
      };
      if (isNumber(maxTokens))   payload.max_tokens = maxTokens;

      const resp = await openai.createChatCompletion(payload);
      return resp.data;

    } catch (e) {
      const status = e && e.response && e.response.status;
      const ra = e && e.response && e.response.headers && e.response.headers['retry-after'];
      const retryAfterMs = ra ? Math.ceil(parseFloat(ra) * 1000) : null;

      if ((status === 429 || (status >= 500 && status < 600)) && attempt < maxRetries) {
        const jitter = Math.floor(Math.random() * 250);
        const delay = retryAfterMs || (waitMs + jitter);
        await new Promise(r => setTimeout(r, delay));
        waitMs *= 2;
        continue;
      }
      throw e;
    }
  }
}

module.exports = { getAnswer };