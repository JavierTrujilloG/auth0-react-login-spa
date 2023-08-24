import configJson from "./auth_config.json";

export function getConfig() {
  // Try to access @@config@@ object available in UL runtime
  // if it's not available, fallback to local config file
  let config;
  try {
    config = JSON.parse(
      decodeURIComponent(escape(window.atob("@@config@@")))
    );

    var leeway = config.internalOptions.leeway;
    if (leeway) {
      var convertedLeeway = parseInt(leeway);

      if (!isNaN(convertedLeeway)) {
        config.internalOptions.leeway = convertedLeeway;
      }
    }

    config = Object.assign(
      {
        overrides: {
          __tenant: config.auth0Tenant,
          __token_issuer: config.authorizationServer.issuer,
        },
        domain: config.auth0Domain,
        clientId: config.clientID,
        redirectUri: config.callbackURL,
        responseType: "code",
      },
      config.internalOptions
    );
  } catch (e) {
    const audience =
      configJson.audience && configJson.audience !== "YOUR_API_IDENTIFIER"
        ? configJson.audience
        : null;
      
    config = {
      domain: configJson.domain,
      clientId: configJson.clientId,
      ...(audience ? { audience } : null),
    };
  }
  console.log(config);
  return config;
}
