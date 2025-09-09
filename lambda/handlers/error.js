const { log } = require('../interceptors/loggers');
module.exports = {
  canHandle() { return true; },
  handle(handlerInput, error) {
    log('GLOBAL ERROR', error && error.stack ? error.stack : error);
    const speak = 'Sorry, I had trouble doing what you asked. Please try again.';
    return handlerInput.responseBuilder.speak(speak).reprompt(speak).getResponse();
  }
};