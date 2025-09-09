const cfg = require('../config/appConfig');

function ssmlEscape(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function wrapSSMLFast(content, rate = cfg.speech.rate) {
  if (!content) return '<speak/>';
  if (/^\s*<speak[\s>]/i.test(content)) {
    if (/<prosody[^>]*\brate=/i.test(content)) return content;
    const inner = content.replace(/^\s*<speak[^>]*>/i,'').replace(/<\/speak>\s*$/i,'');
    return `<speak><prosody rate="${rate}">${inner}</prosody></speak>`;
  }
  return `<speak><prosody rate="${rate}">${ssmlEscape(content)}</prosody></speak>`;
}

const SpeedResponseInterceptor = {
  process(handlerInput, response) {
    if (!response || !response.outputSpeech) return;

    if (response.outputSpeech.type === 'SSML') {
      response.outputSpeech.ssml = wrapSSMLFast(response.outputSpeech.ssml);
    } else {
      response.outputSpeech = { type: 'SSML', ssml: wrapSSMLFast(response.outputSpeech.text) };
    }

    if (response.reprompt && response.reprompt.outputSpeech) {
      const rep = response.reprompt.outputSpeech;
      if (rep.type === 'SSML') {
        rep.ssml = wrapSSMLFast(rep.ssml);
      } else {
        response.reprompt.outputSpeech = { type: 'SSML', ssml: wrapSSMLFast(rep.text) };
      }
    }
  }
};

module.exports = { SpeedResponseInterceptor, wrapSSMLFast };