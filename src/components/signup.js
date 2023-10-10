import React, { useState, useContext } from 'react';
import authAPI from '../api/authentication';

function SignUp() {
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState(null);
  const [password, setPassword] = useState('');
  async function onSignUpAndLogin(e) {
    e.preventDefault();
    try {
      const auth = new authAPI();
      await auth.signUpAndLogin(email, password);
    } catch (err) {
      setAuthError('Error, check console');
      console.log(err);
    }
  }
  return (
    <div className="flex items-center h-screen bg-[url('https://login.klm.com/enrol/assets/kl/img/enrol-background.jpg')] pt-3 bg-cover">
      <div className="p-8 bg-white w-[500px] ml-48">
        <p className="text-4xl mb-8">Create you account</p>
        {authError && <p className="text-rose-600 mb-4">{authError}</p>}
        <p> E-mail address </p>
        <label htmlFor="email">
          <input
            type="text"
            name="identifier"
            id="identifier"
            onChange={({ target }) => setEmail(target.value)}
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
          onClick={onSignUpAndLogin}>
          Create
        </button>
      </div>
    </div>
  );
}

export default SignUp;
