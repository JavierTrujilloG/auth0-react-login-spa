import React, { useCallback, useMemo, createContext, useContext, useState } from "react";
import auth0 from "auth0-js";
import { getConfig } from "./config";

const DATABASE_CONNECTION = "Username-Password-Authentication";

export const AuthContext = createContext({
  loginWithUsernamePassword: (username, password) => {},
  loginWithGoogle: () => {},
  signUp: (username, password, name) => {}
});

const { domain, clientId } = getConfig();

export function AuthProvider({ children }) {
  const webAuth = useMemo(
    () =>
      new auth0.WebAuth({
        domain,
        clientID: clientId,
        //redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
        responseType: "code",
      }),
    []
  );
  const [ existingUserError, setExistingError] = useState("");
  const loginWithUsernamePassword = useCallback((username, password) => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get("state") || "";
    return new Promise(
      (resolve, reject) => {
        webAuth.login(
          {
            username,
            password,
            realm: DATABASE_CONNECTION,
            state: stateParam,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );
      },
      [webAuth]
    );
  });
  const loginWithGoogle = useCallback(() => {
    webAuth.authorize({ connection: "google-oauth2" });
  }, [webAuth]);

  const signUp = useCallback(
    (username, password, name) => {
      return new Promise((resolve, reject) => {
        webAuth.signup(
          {
            connection: DATABASE_CONNECTION,
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
          }
        );
      });
    },
    [webAuth]
  );


  const signupAndLogin = useCallback(
    (username, password, name) => {
      return new Promise((resolve, reject) => {
        webAuth.redirect.signupAndLogin(
          {
            connection: DATABASE_CONNECTION,
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
          }
        );
      });
    },
    [webAuth]
  );
  

  const value = useMemo(
    () => ({
      loginWithUsernamePassword,
      loginWithGoogle,
      signUp,
      signupAndLogin
    }),
    [loginWithGoogle, loginWithUsernamePassword, signUp, signupAndLogin]
  );

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
};