module.exports = {
  canHandle(handlerInput) {
    const r = handlerInput.requestEnvelope.request;
    return r && r.type === 'IntentRequest'
      && r.intent && r.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const msg = 'You can say hello to me! How can I help?';
    return handlerInput.responseBuilder.speak(msg).reprompt(msg).getResponse();
  }
};