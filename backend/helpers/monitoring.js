const Sentry = require('@sentry/node');
const amplitude = require('@amplitude/analytics-node');
const { apiConfig } = require('./config');

let amplitudeClient = null;

function initMonitoring() {
  if (apiConfig.sentryDsn) {
    Sentry.init({
      dsn: apiConfig.sentryDsn,
      tracesSampleRate: 1.0,
      environment: apiConfig.env,
    });
    console.log('[monitoring] Sentry initialized');
  }

  if (apiConfig.amplitudeApiKey) {
    amplitudeClient = amplitude.init(apiConfig.amplitudeApiKey);
    console.log('[monitoring] Amplitude initialized');
  }
}

function trackEvent(eventType, eventProperties = {}, userId) {
  if (!amplitudeClient) return;
  amplitudeClient.logEvent({
    event_type: eventType,
    user_id: userId || 'anonymous',
    event_properties: eventProperties,
  });
}

module.exports = {
  initMonitoring,
  trackEvent,
  sentry: Sentry,
};

