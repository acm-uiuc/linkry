require('dotenv').config()

function makeSecret(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]\;\',./<>?:"{}|';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.groups_permitted = process.env.groupsPermitted ? process.env.groupsPermitted.split(',') : ['ACM Link Shortener Managers', 'ACM Exec', 'ACM Infra Leadership'];

exports.branding = {
  title: process.env.brandTitle || "ACM Link Shortener",
  loginProvider: process.env.brandLoginProvider ||"ACM",
  logoPath: process.env.brandLogoPath || "/static/img/white-banner.svg",
  orgHome: process.env.brandOrgHome || "https://acm.illinois.edu",
  statusURL: process.env.brandStatusURL || "https://status.acm.illinois.edu",
  copyrightOwner: process.env.brandCopyrightOwner || "ACM @ UIUC",
  domainHint: process.env.brandDomainHint || "acm.illinois.edu" // primary azure AD domain for tenant.
}

exports.creds = {
    // Required
    identityMetadata: `https://login.microsoftonline.com/${process.env.AAD_TENANT_ID}/v2.0/.well-known/openid-configuration`, 
    // or equivalently: 'https://login.microsoftonline.com/<tenant_guid>/v2.0/.well-known/openid-configuration'
    //
    // or you can use the common endpoint
    // 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration'
    // To use the common endpoint, you have to either turn `validateIssuer` off, or provide the `issuer` value.
  
    // Required, the client ID of your app in AAD  
    clientID: process.env.AAD_CLIENT_ID,
  
    // Required if `responseType` is 'code', 'id_token code' or 'code id_token'. 
    // If app key contains '\', replace it with '\\'.
    clientSecret: process.env.AAD_CLIENT_SECRET, 
  
    // Required, must be 'code', 'code id_token', 'id_token code' or 'id_token'
    // If you want to get access_token, you must use 'code', 'code id_token' or 'id_token code' 
    responseType: 'code id_token', 
  
    // Required
    responseMode: 'form_post', 
  
    // Required, the reply URL registered in AAD for your app
    redirectUrl: `${process.env.BASE_PROTO}://${process.env.baseURL}/auth/openid/return`,
    // Required if we use http for redirectUrl
    allowHttpForRedirectUrl: true,
  
    // Required to set to false if you don't want to validate issuer
    validateIssuer: true,

    isB2C: false,
  
    // Required if you want to provide the issuer(s) you want to validate instead of using the issuer from metadata
    // issuer could be a string or an array of strings of the following form: 'https://sts.windows.net/<tenant_guid>/v2.0'
    issuer: null,
  
    // Required to set to true if the `verify` function has 'req' as the first parameter
    passReqToCallback: false,
  
    // Recommended to set to true. By default we save state in express session, if this option is set to true, then
    // we encrypt state and save it in cookie instead. This option together with { session: false } allows your app
    // to be completely express session free.
    useCookieInsteadOfSession: true,
  
    // Required if `useCookieInsteadOfSession` is set to true. You can provide multiple set of key/iv pairs for key
    // rollover purpose. We always use the first set of key/iv pair to encrypt cookie, but we will try every set of
    // key/iv pair to decrypt cookie. Key can be any string of length 32, and iv can be any string of length 12.
    cookieEncryptionKeys: [ 
      {
        'key': process.env.NODE_ENV == "development" ? "TfGVn2Sn3WjFk3GNzvIvOw8aXh16NqFC" : makeSecret(32), 
        'iv': process.env.NODE_ENV == "development" ? "C1fRcgVZs1K7" : makeSecret(12)
      },
    ],
  
    // The additional scopes we want besides 'openid'.
    // 'profile' scope is required, the rest scopes are optional.
    // (1) if you want to receive refresh_token, use 'offline_access' scope
    // (2) if you want to get access_token for graph api, use the graph api url like 'https://graph.microsoft.com/mail.read'
    scope: ['profile', 'https://graph.microsoft.com/user.read', 'https://graph.microsoft.com/GroupMember.Read.All'],
  
    // Optional, 'error', 'warn' or 'info'
    loggingLevel: 'error',
  
    // Optional. The lifetime of nonce in session or cookie, the default value is 3600 (seconds).
    nonceLifetime: null,
  
    // Optional. The max amount of nonce saved in session or cookie, the default value is 10.
    nonceMaxAmount: 5,
  
    // Optional. The clock skew allowed in token validation, the default value is 300 seconds.
    clockSkew: 300,
  };
  
  // The url you need to go to destroy the session with AAD
  exports.destroySessionUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${process.env.BASE_PROTO}://${process.env.baseURL}`
  
  // If you want to use the mongoDB session store for session middleware, set to true; otherwise we will use the default
  // session store provided by express-session.
  // Note that the default session store is designed for development purpose only.
  exports.useMongoDBSessionStore = false;  