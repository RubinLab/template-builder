import React, { useState } from 'react';
import Navbar from './components/navbar/index.jsx';
import Homepage from './components/homepage/index.jsx';

function App() {
  const [showDialog, setShowDialog] = useState(false);

  const handleAddQuestion = value => {
    setShowDialog(value);
  };

  return (
    <div className="App">
      <Navbar handleAddQuestion={handleAddQuestion} />
      <Homepage showDialog={showDialog} handleAddQuestion={handleAddQuestion} />
    </div>
  );
}

export default App;
