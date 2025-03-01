import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { ShitifyDocs } from './pages/ShitifyDocs';
import { ShitifyWebpage } from './pages/ShitifyWebpage';
import { Menu } from './components/Menu';
import { trackNavigation } from './services/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    trackNavigation(location.pathname);
  }, [location]);

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shitify-docs" element={<ShitifyDocs />} />
        <Route path="/shitify-webpage" element={<ShitifyWebpage />} />
      </Routes>
    </>
  );
}

export default App;