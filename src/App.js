import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth';
import Login from './components/login';
import Signup from './components/signup';
import Layout from './layouts/layout';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
