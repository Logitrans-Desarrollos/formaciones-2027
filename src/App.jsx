import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Training from './pages/Training';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curso/:courseId" element={<Training />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
