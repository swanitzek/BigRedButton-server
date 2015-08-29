var config = {};

config.gcm = {};
config.auth = {};

config.gcm.apikey = '<INSERT API-KEY HERE>';

// This secret must also be known to the firmware and is de-facto a "password" so that no one can raise the alarm without that password.
// It's recommended to use HTTPS as transport-protocol to prevent sniffing of the secret.
config.auth.secret = '<INSERT A SECRET TEXT HERE>';

config.port = 3333;

module.exports = config;