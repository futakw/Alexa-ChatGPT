const Alexa = require('ask-sdk-core');
module.exports = {
  canHandle(handlerInput) {
    const r = handlerInput.requestEnvelope.request;
    return r && r.type === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return handlerInput.responseBuilder.speak('You just triggered ' + intentName).getResponse();
  }
};