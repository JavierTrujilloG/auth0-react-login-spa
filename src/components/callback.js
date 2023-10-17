import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import authAPI from '../api/authentication';

export default function Callback() {
  const query = window.location.search;
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const { hash } = useLocation();
  useEffect(() => {
    const getHash = async () => {
      const auth = new authAPI({ responseType: 'token id_token' });
      if (hash) {
        return new Promise((resolve, reject) => {
          auth.webAuth.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
              resolve(authResult);
            } else if (err) {
              console.log(err);
              throw new Error(
                `Error: ${err.error}. Check the console for further details.`,
              );
            } else {
              throw new Error(`Unknown error`);
            }
          });
        });
      }
    };
    getHash()
      .then((res) => setProfile(res.idTokenPayload))
      .catch((e) => console.log(e));
  }, []);
  return (
    <>
      {profile && (
        <div className="flex justify-center items-center h-screen bg-[url('https://login.klm.com/login/assets/kl/img/login-background.jpg')] pt-3 bg-cover">
          <div className="p-8 bg-white">
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        </div>
      )}
    </>
  );
}
