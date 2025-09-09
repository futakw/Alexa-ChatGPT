const Alexa = require('ask-sdk-core');

const { RequestLogger, ResponseLogger } = require('./interceptors/loggers');
const { SpeedResponseInterceptor } = require('./interceptors/speed');

const LaunchRequestHandler = require('./handlers/launch');
const ChatGPTIntentHandler = require('./handlers/chatgpt');
const HelpIntentHandler = require('./handlers/help');
const CancelAndStopIntentHandler = require('./handlers/cancelStop');
const FallbackIntentHandler = require('./handlers/fallback');
const SessionEndedRequestHandler = require('./handlers/sessionEnded');
const IntentReflectorHandler = require('./handlers/reflector');
const ErrorHandler = require('./handlers/error');

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ChatGPTIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addRequestInterceptors(RequestLogger)
  .addResponseInterceptors(SpeedResponseInterceptor, ResponseLogger)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('chappie/skill/v1')
  .lambda();

