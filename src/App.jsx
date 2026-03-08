import { useEffect, useState } from 'react';
import NameAnimation from './components/NameAnimation';
import About from './components/About';
import Work from './components/Work';
import More from './components/More';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (!isRevealing) return;

    const timer = window.setTimeout(() => {
      setIsRevealing(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isRevealing]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setIsRevealing(true);
  };

  return (
    <div className="app">
      <NameAnimation
        isLoading={isLoading}
        isRevealing={isRevealing}
        onLoadingComplete={handleLoadingComplete}
      />
      {!isLoading && !isRevealing && (
        <>
          <About />
          <Work />
          <More />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
