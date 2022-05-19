import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import SafeDashboard from './pages/SafeDashboard';

function App() {
  const [ethAddress, setEthAddress] = useState("");
  const [userSigner, setUserSigner] = useState(""); 
  const [rsContract, setRSContract] = useState("");

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <SafeDashboard
              ethAddress={ethAddress}
              rsContract={rsContract}
              userSigner={userSigner} /> } />
        <Route
          path="/"
          element={
            <Home
              setRSContract={setRSContract}
              setUserSigner={setUserSigner}
              setEthAddress={setEthAddress} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
