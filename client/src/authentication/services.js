import auth0 from "auth0-js";
import params from './auth0-params.json';

export const webAuth = new auth0.WebAuth({
  domain: params.domain,
  clientID: params.clientId,
  responseType: "token id_token",
  redirectUri: `${window.location.origin}/authorize`,
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
    returnTo: `${window.location.origin}/login`,
    clientID:  params.clientId,
  });
};

export const getUser = (token) => {
  return new Promise((resolve, reject) => {
      webAuth.client.userInfo(token, (err,user) => {
        if (err) {
          reject(err);
          console.log(err);
        }
        resolve(user);
      });
  });
};
export const getToken = () =>{
  return new Promise((resolve, reject) => {
    webAuth.checkSession({}, function(err, result) {
      if (err) {
        reject(err);
        console.log(err);
      }
      resolve(result);
    });
  });
}
// credits --> https://github.com/krizten/passwordless-auth