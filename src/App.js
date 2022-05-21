import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import SafeDashboard from './pages/SafeDashboard';

function App() {
  const [ethAddress, setEthAddress] = useState("");
  const [domainData, setDomainData] = useState('');
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
              domainData={domainData}
              rsContract={rsContract}
              userSigner={userSigner} /> } />
        <Route
          path="/"
          element={
            <Home
              setRSContract={setRSContract}
              setUserSigner={setUserSigner}
              setEthAddress={setEthAddress}
              setDomainData={setDomainData} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
