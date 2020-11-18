import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from './components/navbar/index.jsx';
import Homepage from './components/homepage/index.jsx';

const useStyles = makeStyles(theme => ({
  app: {
    flexGrow: 1,
    width: 'fit-content',
    [theme.breakpoints.up('sm')]: {
      width: '-webkit-fill-available',
    },
  },
}));

function App() {
  const classes = useStyles();

  const [showDialog, setShowDialog] = useState(false);

  const handleAddQuestion = value => {
    // const preview = document.getElementById('questionaire');
    // if (preview) preview.remove();
    setShowDialog(value);
  };

  return (
    <div className={classes.app}>
      <CssBaseline />
      <Navbar handleAddQuestion={handleAddQuestion} />
      <Homepage showDialog={showDialog} handleAddQuestion={handleAddQuestion} />
    </div>
  );
}

export default App;
