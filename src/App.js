import React, { useState } from 'react';
import Navbar from './components/navbar/index.jsx';
import Homepage from './components/homepage/index.jsx';
import QuestionCreation from './components/questionCreation/index.jsx';

function App() {
  const [showDialog, setShowDialog] = useState(true);
  const handleAddQuestion = value => {
    setShowDialog(value);
  };

  const [templateName, setTemplateName] = useState('');
  const handlechangeTemplateName = value => {
    setTemplateName(value);
  };

  return (
    <div className="App">
      <Navbar handleAddQuestion={handleAddQuestion} />
      <Homepage getTemplateName={handlechangeTemplateName} />
      {showDialog && (
        <QuestionCreation
          open={showDialog}
          templateName={templateName}
          handleClose={handleAddQuestion}
        />
      )}
    </div>
  );
}

export default App;
