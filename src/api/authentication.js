import { WebAuth } from 'auth0-js';
import { getConfig } from '../config';

const { domain, clientId } = getConfig();

export default class AuthAPI {
  constructor({ database, responseType, redirectUri } = {}) {
    this.database = database || 'Flying-Blue-DB';
    this.webAuth = new WebAuth({
      domain,
      clientID: clientId,
      redirectUri: redirectUri || process.env.REACT_APP_AUTH0_REDIRECT_URI,
      responseType: responseType || 'code',
    });
  }

  loginWithUsernamePassword(username, password) {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state') || '';
    return new Promise((resolve, reject) => {
      this.webAuth.login(
        {
          username,
          password,
          realm: this.database,
          state: stateParam,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      );
    });
  }

  passwordlessStart(email) {
    return new Promise((resolve, reject) => {
      this.webAuth.passwordlessStart(
        {
          connection: 'email',
          send: 'code',
          email,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      );
    });
  }

  passwordlessLogin(email, code) {
    return new Promise((resolve, reject) => {
      console.log(email, code);
      this.webAuth.passwordlessLogin(
        {
          connection: 'email',
          email,
          verificationCode: code,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      );
    });
  }

  loginWithGoogle() {
    this.webAuth.authorize({ connection: 'google-oauth2' });
  }

  signUp(username, password, name) {
    return new Promise((resolve, reject) => {
      this.webAuth.signup(
        {
          connection: this.database,
          password: password,
          email: username,
          name,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      );
    });
  }

  signUpAndLogin(username, password, name) {
    return new Promise((resolve, reject) => {
      this.webAuth.redirect.signupAndLogin(
        {
          connection: this.database,
          password: password,
          email: username,
          name,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      );
    });
  }
}
