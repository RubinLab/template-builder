import React, { useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from './components/navbar/index.jsx';
import Homepage from './components/homepage/index.jsx';

const useStyles = makeStyles(theme => ({
  app: {
    flexGrow: 1,
    width: 'fit-content',
    [theme.breakpoints.up('sm')]: {
      width: '-webkit-fill-available'
    }
  }
}));

const messages = {
  invalidTemp: 'Template is not valid!',
  miisngIInfo: 'Please create a question before downloading the template!'
};
function App() {
  const classes = useStyles();

  const [showDialog, setShowDialog] = useState(false);
  const [validTemplate, setValidTemplate] = useState(false);
  const [misingInfo, setMissingInfo] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [template, setTemplate] = useState({});

  const handleAddQuestion = value => {
    // const preview = document.getElementById('questionaire');
    // if (preview) preview.remove();
    setShowDialog(value);
  };

  const downloadFile = async () => {
    const fileName = template.TemplateContainer.name;
    const json = JSON.stringify(template);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    if (!validTemplate || misingInfo) {
      console.log('validTemplate', validTemplate);
      setShowSnackbar(true);
    } else {
      try {
        await downloadFile();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <SnackbarProvider maxSnack={5}>
      <div className={classes.app}>
        <CssBaseline />
        <Navbar
          handleAddQuestion={handleAddQuestion}
          handleDownload={handleDownload}
        />
        <Homepage
          showDialog={showDialog}
          handleAddQuestion={handleAddQuestion}
          setValidTemplate={val => setValidTemplate(val)}
          setMissingInfo={val => setMissingInfo(val)}
          getTemplate={temp => setTemplate(temp)}
        />
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={showSnackbar}
        message={misingInfo ? messages.misingInfo : messages.invalidTemp}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              // size="small"
              onClick={() => {
                setShowSnackbar(false);
              }}
            >
              OK
            </Button>
          </React.Fragment>
        }
      />
    </SnackbarProvider>
  );
}

export default App;
