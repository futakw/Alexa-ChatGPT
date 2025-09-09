module.exports = {
  canHandle(handlerInput) {
    const r = handlerInput.requestEnvelope.request;
    return r && r.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log('[Chappie] Session ended:', JSON.stringify(handlerInput.requestEnvelope));
    return handlerInput.responseBuilder.getResponse();
  }
};