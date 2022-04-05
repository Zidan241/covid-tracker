import auth0 from "auth0-js";
import params from './auth0-params.json';

export const webAuth = new auth0.WebAuth({
  domain: params.domain,
  clientID: params.clientId,
  responseType: "token id_token",
  redirectUri: `${window.location.origin}/authorize`,
  useRefreshTokens: true
});

export const otpStart = (email) => {
  return new Promise((resolve, reject) => {
    const variables = { email, connection: "email", send: "code", };
    webAuth.passwordlessStart(variables, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

export const otpLogin = (email, otp) => {
  return new Promise((resolve, reject) => {
    webAuth.passwordlessLogin(
      { email, connection: "email", verificationCode: otp},
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

export const logout = () => {
  webAuth.logout({
    returnTo: `${window.location.origin}`,
    clientID: process.env.REACT_APP_CLIENT_ID,
  });
};
// credits --> https://github.com/krizten/passwordless-auth