const Alexa = require('ask-sdk-core');
const cfg = require('../config/appConfig');
const { getAnswer } = require('../services/openaiClient');
const { toSpeechText, toCardText, trimConversation } = require('../utils/text');
const { log } = require('../interceptors/loggers');

module.exports = {
  canHandle(handlerInput) {
    const r = handlerInput.requestEnvelope.request;
    return r && r.type === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChatGPTIntent';
  },
  async handle(handlerInput) {
    log('Hit ChatGPTIntentHandler');

    const attrsMgr = handlerInput.attributesManager;
    const attr = await attrsMgr.getSessionAttributes() || {};
    if (!attr.conversation) {
      attr.conversation = [{ role: 'system', content: cfg.openai.system_message }];
    }

    const question = Alexa.getSlotValue(handlerInput.requestEnvelope, 'question');
    if (!question || !question.trim()) {
      const speak = 'すみません、もう一度質問をお願いします。';
      return handlerInput.responseBuilder.speak(speak).reprompt('ご質問は？').getResponse();
    }

    attr.conversation.push({ role: 'user', content: cfg.convo.concisePrefix + question });
    attr.conversation = trimConversation(attr.conversation); // ← maxTurns はconfig

    try {
      log('Calling OpenAI… model=', cfg.openai.model);
      const response = await getAnswer(attr.conversation);   // ← max_tokens/temperature はconfigで付与
      log('OpenAI usage:', response && response.usage);

      let raw = 'すみません、うまく答えられませんでした。';
      if (response && response.choices && response.choices[0]
          && response.choices[0].message && response.choices[0].message.content) {
        raw = response.choices[0].message.content;
      }

      const speakOutput = toSpeechText(raw);
      const cardOutput  = toCardText(raw);

      attr.conversation.push({ role: 'assistant', content: speakOutput });
      const totalTokens = (response && response.usage && response.usage.total_tokens) || 0;
      if (totalTokens > 1500) attr.conversation.splice(0, 2);
      attrsMgr.setSessionAttributes(attr);

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withSimpleCard('チャッピー', cardOutput)
        .reprompt('他に質問はありますか？')
        .getResponse();

    } catch (e) {
      let status = (e && e.response && e.response.status) || 'N/A';
      let msg = '不明なエラー';
      if (e && e.response && e.response.data && e.response.data.error && e.response.data.error.message) {
        msg = e.response.data.error.message;
      } else if (e && e.message) {
        msg = e.message;
      }
      const speak = `外部APIでエラー。ステータス${status}。メッセージ: ${msg}`;
      return handlerInput.responseBuilder
        .speak(speak)
        .withSimpleCard('Chappie Debug', `status=${status}\nmessage=${msg}`)
        .reprompt('別の質問はありますか？')
        .getResponse();
    }
  }
};