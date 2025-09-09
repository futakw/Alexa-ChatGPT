const { log } = require('../interceptors/loggers');

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request
      && handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    log('Hit LaunchRequestHandler');
    const speakOutput = 'チャッピーです。ご用件をどうぞ！';
    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
  }
};