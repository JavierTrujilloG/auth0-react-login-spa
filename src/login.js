import React, { useState, useContext } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AuthContext } from "./auth";

const LoginSchema = yup.object().shape({
  username: yup.string().required("Please enter your email address."),
  password: yup.string().required("Please enter your password."),
});

const styles = {}; // TODO

export default function Login() {
  const [authError, setAuthError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const validationOpt = { resolver: yupResolver(LoginSchema) };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(validationOpt);

  const {
    loginWithUsernamePassword,
    loginWithGoogle,
    loginWithFacebook,
    signUp,
    signupAndLogin
  } = useContext(AuthContext);


  async function onSubmit(data) {
    try {
      await loginWithUsernamePassword(data.username, data.password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onSignup(e) {
    e.preventDefault();
    try {
      await signUp(username, password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onSignUpAndLogin(e) {
    e.preventDefault();
    try {
      await signupAndLogin(username, password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  return (
    <>
      <main id={styles.container}>
        <div>
          <h1 id={styles.header}>Login</h1>
        </div>
        <div id={styles.socialWrapper}>
          <button
            type="button"
            id={styles.google}
            onClick={async (e) => {
              e.preventDefault();
              loginWithGoogle();
            }}
          >
            Login with Google
          </button>

          <button
            type="button"
            id={styles.facebook}
            onClick={async (e) => {
              e.preventDefault();
              loginWithFacebook();
            }}
          >
            Login with Facebook
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} id={styles.loginForm}>
          <label htmlFor="username">
            <input
              type="text"
              {...register("username")}
              placeholder="Email"
              name="username"
              id="username"
              autoComplete="username"
              onChange={({ target }) => setUsername(target.value)}
              className={
                authError || errors.username ? styles.inputWithError : ""
              }
            />
          </label>
          <label htmlFor="password">
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              name="password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
              autoComplete="current-password"
              className={
                authError || errors.password ? styles.inputWithError : ""
              }
            />
          </label>

          {authError && <p id={styles.authError}>{authError}</p>}
          {errors.username && (
            <p id={styles.authError}>{errors.username.message}</p>
          )}
          {errors.password && (
            <p id={styles.authError}>{errors.password.message}</p>
          )}
          <button
            type="submit"
            className={authError ? styles.submitWithError : ""}
          >
            Log in
          </button>
        </form>
        <div id={styles.forgotPasswordWrapper}>
          <button
            type="button"
            className="link-button"
            onClick={(e) => {
              e.preventDefault();
              //goToResetPassword(); TODO
            }}
          >
            Forgot your password?
          </button>
        </div>
        <div id={styles.registrationWrapper}>
          <p>
            Don't have an account?
            <button
              type="button"
              className="link-button"
              onClick={onSignup}
            >
              Sign up
            </button>
          </p>
          <p>
            <button
              type="button"
              className="link-button"
              onClick={onSignUpAndLogin}
            >
              SignUp And Login
            </button>
          </p>
        </div>
      </main>
    </>
  );
}
