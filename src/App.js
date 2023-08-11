import React, { useCallback, useMemo, createContext, useContext } from "react"; 
import auth0 from 'auth0-js';
import logo from './logo.svg';
import './App.css';
import { AuthProvider } from "./auth";
import Login from "./login";


function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Login />
    </div>
    </AuthProvider>
  );
}

export default App;
