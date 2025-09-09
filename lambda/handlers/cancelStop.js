module.exports = {
  canHandle(handlerInput) {
    const r = handlerInput.requestEnvelope.request;
    return r && r.type === 'IntentRequest'
      && r.intent && (r.intent.name === 'AMAZON.CancelIntent' || r.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak('Goodbye!').getResponse();
  }
};