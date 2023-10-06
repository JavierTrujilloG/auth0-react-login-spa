import React, { useState, useContext } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { AuthContext } from './auth';
import authAPI from './api/authentication';

const LoginSchema = yup.object().shape({
  username: yup.string().required('Please enter your email address.'),
  password: yup.string().required('Please enter your password.'),
});

const styles = {}; // TODO

export default function Login() {
  const [authError, setAuthError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const errors = {}; // TODO

  async function onLogInWithEmail(data) {
    try {
      const auth = new authAPI();
      await auth.loginWithUsernamePassword(email, password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onLogInWithFBN(data) {
    try {
      const auth = new authAPI();
      await auth.loginWithUsernamePassword(email, password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onPasswordlessStart() {
    try {
      const auth = new authAPI({ responseType: 'token id_token' });
      const code = await auth.passwordlessStart(email);
      console.log(code);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onPasswordlessVerify() {
    try {
      const auth = new authAPI({ responseType: 'token id_token' });
      const response = await auth.passwordlessLogin(email, otp);
      console.log(response);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onSignup(e) {
    e.preventDefault();
    try {
      const auth = new authAPI();
      await auth.signUp(email, password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onSignUpAndLogin(e) {
    e.preventDefault();
    try {
      const auth = new authAPI();
      await auth.signUpAndLogin(email, password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  return (
    <>
      <main id={styles.container}>
        <div>
          <h1 id={styles.header}>Login </h1>
        </div>
        <div>
          <label htmlFor="email">
            <input
              type="text"
              placeholder="Email"
              name="email"
              id="username"
              autoComplete="email"
              onChange={({ target }) => setEmail(target.value)}
              className={
                authError || errors.username ? styles.inputWithError : ''
              }
            />
          </label>
          <label htmlFor="password">
            <input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
              autoComplete="current-password"
              className={
                authError || errors.password ? styles.inputWithError : ''
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
            type="button"
            onClick={onLogInWithEmail}
            className={authError ? styles.submitWithError : ''}>
            Log in with Email
          </button>
          <button
            type="button"
            onClick={onLogInWithFBN}
            className={authError ? styles.submitWithError : ''}>
            Log in with FBN
          </button>
        </div>
        <div id={styles.forgotPasswordWrapper}>
          <button
            type="button"
            className="link-button"
            onClick={onPasswordlessStart}>
            Send OTP
          </button>
        </div>
        <div id={styles.forgotPasswordWrapper}>
          <label htmlFor="otp">
            <input
              type="text"
              name="otp"
              id="otp"
              onChange={({ target }) => setOtp(target.value)}
            />
          </label>

          <button
            type="button"
            className="link-button"
            onClick={onPasswordlessVerify}>
            Verify OTP
          </button>
        </div>
        <div id={styles.forgotPasswordWrapper}>
          <button
            type="button"
            className="link-button"
            onClick={(e) => {
              e.preventDefault();
              //goToResetPassword(); TODO
            }}>
            Forgot your password?
          </button>
        </div>
        <div id={styles.registrationWrapper}>
          <p>
            Don't have an account?
            <button type="button" className="link-button" onClick={onSignup}>
              Sign up
            </button>
          </p>
          <p>
            <button
              type="button"
              className="link-button"
              onClick={onSignUpAndLogin}>
              SignUp And Login
            </button>
          </p>
        </div>
      </main>
    </>
  );
}
