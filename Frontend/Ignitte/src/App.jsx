import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import React from 'react';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* More routes will be added later */}
    </Routes>
  );
}

export default App;
