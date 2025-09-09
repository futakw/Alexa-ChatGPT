module.exports = {
  canHandle(handlerInput) {
    const r = handlerInput.requestEnvelope.request;
    return r && r.type === 'IntentRequest'
      && r.intent && r.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const msg = 'Sorry, I don\'t know about that. Please try again.';
    return handlerInput.responseBuilder.speak(msg).reprompt('Please try again.').getResponse();
  }
};