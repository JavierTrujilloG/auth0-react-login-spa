import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import authAPI from '../api/authentication';

export default function Login() {
  const [authError, setAuthError] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState('');

  /* Dummy function to fake the checking of the user's identifier
     It 'verifies' that a user with identifier exists and decides on either of next steps:
     - identifier is unique --> ask user if they would like to authenticate with OTP
     - (email) identifier is not unique --> ask user to provide FBN instead
  */
  async function onCheckingIdentifier() {
    try {
      // Communicate with (dummy) external auth service
      const resp = await axios.request({
        url: 'https://kzmnauw4utp33ch3e7vxypwahq0qcvto.lambda-url.eu-central-1.on.aws/',
        method: 'POST',
        data: { identifier },
        responseType: 'json',
        validateStatus: () => true,
      });

      if (resp.status === 200) {
        // User record found
        const user = resp.data.user;
        console.log(typeof resp.data, resp.data.user);
        // Check if user has a GIN associated
        if (!user.GIN) {
          throw new Error(
            'More than 1 passenger is registered with this e-mail address. Please log in with your Flying Blue number instead, so we can uniquely identify you.',
          );
        }
        setEmail(user.email);
        setAuthError(null);
        setStep(1);
      } else if (resp.status === 404) {
        // User not found
        throw new Error(resp.data.error);
      } else {
        throw new Error(resp.data.error || 'Unknown error');
      }
    } catch (e) {
      setAuthError(`Something went wrong: ${e.message}`);
    }
  }

  async function onPasswordlessStart() {
    try {
      const auth = new authAPI({ responseType: 'token id_token' });
      await auth.passwordlessStart(email);
      setAuthError(null);
      setStep(2);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onPasswordlessVerify() {
    try {
      const auth = new authAPI({ responseType: 'token id_token' });
      const response = await auth.passwordlessLogin(email, otp);
      setAuthError(null);
      console.log(response);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  async function onLogInWithUsername() {
    try {
      const auth = new authAPI();
      await auth.loginWithUsernamePassword(identifier, password);
    } catch (err) {
      setAuthError(err.description);
      console.log(err);
    }
  }

  function renderStep() {
    let prompt;
    switch (step) {
      case 0:
        prompt = (
          <>
            <p className="text-4xl mb-8">
              Enter your e-mail or Flying Blue number{' '}
            </p>
            {authError && <p className="text-rose-600 mb-4">{authError}</p>}
            <p> Flying Blue number or e-mail address </p>
            <label htmlFor="email">
              <input
                type="text"
                name="identifier"
                id="identifier"
                onChange={({ target }) => setIdentifier(target.value)}
                className="w-full p-4 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light mb-2"
              />
            </label>
            <button
              className="w-full flex justify-center items-center p-2 font-sans text-white rounded-md shadow-lg px-9 bg-orange-500 shadow-cyan-100 shadow-sm hover:shadow-lg border transition duration-150"
              onClick={onCheckingIdentifier}>
              Continue
            </button>
            <p className="mt-2 cursor-pointer">
              <Link to="/signup">
                <b> Don't have an account yet? </b> Sign up now
              </Link>
            </p>
            <br />
            <p className="text-xl mb-2"> Need help ? </p>
            <p className="underline cursor-pointer" onClick={() => setStep(3)}>
              {' '}
              Log in with your password instead{' '}
            </p>
          </>
        );
        break;
      case 1:
        prompt = (
          <>
            <p className="text-4xl">Get your one-time PIN code </p>
            {authError && <p className="text-rose-600 mb-4">{authError}</p>}
            <p className="py-8">
              You’ll receive a message with a one-time PIN code in a few
              seconds. How would you like to receive your PIN code?
            </p>
            <input
              type="radio"
              id="send_otp"
              name="send_otp"
              checked
              value="send_otp"></input>
            <label className="pl-2" for="send_otp">
              Send an e-mail to {email}
            </label>
            <button
              className="mt-8 w-full flex justify-center items-center p-2 font-sans text-white rounded-md shadow-lg px-9 bg-orange-500 shadow-cyan-100 shadow-sm hover:shadow-lg border transition duration-150"
              onClick={onPasswordlessStart}>
              Continue
            </button>
            <br />
            <p className="text-xl mb-2"> Need help ? </p>
            <p className="underline cursor-pointer" onClick={() => setStep(3)}>
              {' '}
              Log in with your password instead{' '}
            </p>
          </>
        );
        break;
      case 2:
        prompt = (
          <>
            <p className="text-4xl">
              We’ve sent the PIN code to your e-mail address{' '}
            </p>
            {authError && <p className="text-rose-600 mb-4">{authError}</p>}
            <p className="my-4">Please enter the PIN code below</p>
            <label htmlFor="otp">
              <input
                type="text"
                name="otp"
                id="otp"
                className="w-full p-4 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light mb-2"
                onChange={({ target }) => setOtp(target.value)}
              />
            </label>
            <br></br>
            <button
              className="mt-8 w-full flex justify-center items-center p-2 font-sans text-white rounded-md shadow-lg px-9 bg-orange-500 shadow-cyan-100 shadow-sm hover:shadow-lg border transition duration-150"
              onClick={onPasswordlessVerify}>
              Continue
            </button>
            <br />
            <p className="text-xl mb-2"> Need help ? </p>
            <p className="underline cursor-pointer" onClick={() => setStep(3)}>
              {' '}
              Log in with your password instead{' '}
            </p>
          </>
        );
        break;
      case 3: // login with u/p
        prompt = (
          <>
            <p className="text-4xl mb-8">Log in</p>
            {authError && <p className="text-rose-600 mb-4">{authError}</p>}
            <p> Flying Blue number or e-mail address </p>
            <label htmlFor="email">
              <input
                type="text"
                name="identifier"
                id="identifier"
                onChange={({ target }) => setIdentifier(target.value)}
                className="w-full p-4 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light mb-2"
              />
            </label>
            <p> Passsword </p>
            <label htmlFor="password">
              <input
                type="password"
                name="password"
                onChange={({ target }) => setPassword(target.value)}
                className="w-full p-4 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light mb-2"
              />
            </label>
            <button
              className="mt-8 w-full flex justify-center items-center p-2 font-sans text-white rounded-md shadow-lg px-9 bg-orange-500 shadow-cyan-100 shadow-sm hover:shadow-lg border transition duration-150"
              onClick={onLogInWithUsername}>
              Login
            </button>
            <br />
            <p className="text-xl mb-2"> Need help ? </p>
            <p className="underline cursor-pointer" onClick={() => setStep(0)}>
              {' '}
              Login with OTP
            </p>
            <p className="underline cursor-pointer">
              {' '}
              <Link to="/signup">Create an account instead </Link>
            </p>
          </>
        );
      default:
        console.log('Error, step no identified');
    }

    return prompt;
  }

  return (
    <div className="flex items-center h-screen bg-[url('https://login.klm.com/login/assets/kl/img/login-background.jpg')] pt-3 bg-cover">
      <div className="p-8 bg-white w-[500px] ml-48">{renderStep(step)}</div>
    </div>
  );
}
