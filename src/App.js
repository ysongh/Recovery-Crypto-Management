import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Box } from "@chakra-ui/core";

import Home from './pages/Home';

function App() {
  return (
    <HashRouter>
      <Box p={4}>
        <Routes>
          <Route
            path="/test"
            element={
              <h1>Test</h1> } />
          <Route
            path="/"
            element={
              <Home />} />
        </Routes>
      </Box>
    </HashRouter>
  );
}

export default App;
