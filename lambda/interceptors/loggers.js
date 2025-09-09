const log = (...args) => console.log('[Chappie]', ...args);

const RequestLogger = {
  process(handlerInput) {
    const request = handlerInput.requestEnvelope.request || {};
    const context = handlerInput.requestEnvelope.context || {};
    const system  = context.System || {};
    const user    = system.user || {};

    let intentName;
    if (request.type === 'IntentRequest' && request.intent && request.intent.name) {
      intentName = request.intent.name;
    }

    log('REQUEST', {
      type: request.type,
      intent: intentName,
      locale: request.locale,
      userId: user.userId
    });
  }
};

const ResponseLogger = {
  process(handlerInput, response) {
    console.log('[Chappie] RESPONSE', {
      hasSpeak: !!(response && response.outputSpeech),
      reprompt: !!(response && response.reprompt),
      shouldEnd: response ? response.shouldEndSession : undefined,
    });
  }
};

module.exports = { RequestLogger, ResponseLogger, log };