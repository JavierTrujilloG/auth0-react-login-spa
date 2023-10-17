import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth';
import Login from './components/login';
import Signup from './components/signup';
import Layout from './layouts/layout';
import Callback from './components/callback';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
