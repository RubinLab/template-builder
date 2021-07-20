import React, { useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from './components/navbar/index.jsx';
import Homepage from './components/homepage/index.jsx';
import UploadTemplate from './components/homepage/UploadTemplate.jsx';
import { insertTermToEPAD } from './services/apiServices';
import constants from './utils/constants';

const useStyles = makeStyles(theme => ({
  app: {
    flexGrow: 1,
    width: 'fit-content',
    [theme.breakpoints.up('sm')]: {
      width: '-webkit-fill-available'
    }
  },
  progress: {
    width: '100%',
    marginTop: theme.spacing(2),
    height: theme.spacing(1)
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
  const [uploaded, setUploaded] = useState(false);
  const [uploadTemplateClicked, setUploadTemplateClicked] = useState(false);
  const [lexicon, setLexicon] = useState({});
  const [downloading, setDownloading] = useState(false);

  const onUploadTemplate = uploadedTemplate => {
    setTemplate(uploadedTemplate);
    setUploaded(true);
    setUploadTemplateClicked(false);
  };

  const handleAddQuestion = value => {
    // const preview = document.getElementById('questionaire');
    // if (preview) preview.remove();
    setShowDialog(value);
  };

  const populateLexicon = values => {
    const { term, id, description } = values;
    const newLexicon = { ...lexicon };
    if (newLexicon[term]) newLexicon[term].ids.push(id);
    else newLexicon[term] = { ids: [id], description };

    setLexicon(newLexicon);
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

  const saveTemplateToDB = async (authors, name, uid) => {
    try {
      const tempSource = template.TemplateContainer.Template[0];
      const templateTerm = await insertTermToEPAD(
        tempSource.codeMeaning,
        tempSource.description,
        authors,
        name,
        uid,
        'T'
      );
      const { codemeaning, codevalue } = templateTerm.data;
      const newTemplate = { ...template };
      newTemplate.TemplateContainer.Template[0].codeMeaning = codemeaning;
      newTemplate.TemplateContainer.Template[0].codevalue = codevalue;
      newTemplate.TemplateContainer.Template[0].codingSchemeDesignator =
        constants.localLexicon;
      setTemplate(newTemplate);
    } catch (err) {
      console.error(err);
      // setValidTemplate(false);
      // show snackbar and say, couldn't sav to db try again
    }
  };

  const saveTermsToDB = async (authors, name, uid) => {
    const questionIDTermsMap = {};
    try {
      const terms = Object.keys(lexicon);
      const descriptions = Object.values(lexicon).map(el => el.description);
      const ids = Object.values(lexicon).map(el => el.ids);
      const promises = [];

      terms.forEach((term, i) => {
        promises.push(
          insertTermToEPAD(term, descriptions[i], authors, name, uid, 'T')
        );
      });

      const savedTerms = await Promise.all(promises);
      savedTerms.forEach((el, i) => {
        ids[i].forEach(id => {
          if (questionIDTermsMap[id]) {
            questionIDTermsMap[id].push(el.data);
          } else questionIDTermsMap[id] = [el.data];
        });
      });
      return questionIDTermsMap;
    } catch (err) {
      console.error(err);
      return questionIDTermsMap;
    }
  };

  const replaceSingleTerm = (term, savedList) => {
    const updatedTerm = { ...term };
    savedList.forEach(newTerm => {
      if (
        newTerm.codemeaning === updatedTerm.codeMeaning &&
        !updatedTerm.codeValue
      )
        updatedTerm.codeValue = newTerm.codevalue;
    });
    return updatedTerm;
  };

  const replaceTerm = (templateList, savedList) => {
    const newTempLateList = [];
    savedList.forEach(newTerm => {
      templateList.forEach(term => {
        if (newTerm.codemeaning === term.codeMeaning && !term.codeValue) {
          newTempLateList.push({ ...term, codeValue: newTerm.codevalue });
        } else if (term.codeValue) {
          newTempLateList.push(term);
        }
      });
    });
    return newTempLateList;
  };

  const saveTermCodeValues = map => {
    const newTemplate = { ...template };
    const questions = newTemplate.TemplateContainer.Template[0].Component;

    const newComponent = [];
    questions.forEach(question => {
      const newQuestion = { ...question };
      if (map[question.id]) {
        newQuestion.AllowedTerm = replaceTerm(
          question.AllowedTerm,
          map[question.id]
        );
      }
      if (
        map[question.id] &&
        question.QuestionType &&
        !question.QuestionType.codeValue
      ) {
        newQuestion.QuestionType = replaceSingleTerm(
          newQuestion.QuestionType,
          map[question.id]
        );
      }

      if (question.ImagingObservation) {
        if (
          question.ImagingObservation.ImagingObservationCharacteristic?.length >
          0
        ) {
          question.ImagingObservation.ImagingObservationCharacteristic.forEach(
            (el, k) => {
              if (map[el.id]) {
                newQuestion.ImagingObservation.ImagingObservationCharacteristic[
                  k
                ].AllowedTerm = replaceTerm(el.AllowedTerm, map[el.id]);
              }
            }
          );
        }
      }
      if (question.AnatomicEntity) {
        if (question.AnatomicEntity.AnatomicEntityCharacteristic?.length > 0) {
          question.AnatomicEntity.AnatomicEntityCharacteristic.forEach(
            (el, k) => {
              if (map[el.id]) {
                newQuestion.AnatomicEntity.AnatomicEntityCharacteristic[
                  k
                ].AllowedTerm = replaceTerm(el.AllowedTerm, map[el.id]);
              }
            }
          );
        }
      }
      newComponent.push(newQuestion);
    });
    newTemplate.TemplateContainer.Template[0].Component = newComponent;
    setTemplate(newTemplate);
  };

  const handleDownload = async () => {
    setDownloading(true);
    if (!validTemplate || misingInfo) {
      setShowSnackbar(true);
    } else {
      try {
        const { authors, name, uid } = template.TemplateContainer.Template[0];

        // saves template to db
        await saveTemplateToDB(authors, name, uid);

        // saves terms to db
        const questionIDTermsMap = await saveTermsToDB(authors, name, uid);

        // iterate over the template and replace the placeholder
        // codeValues with the ones from the db
        saveTermCodeValues(questionIDTermsMap);
        await downloadFile();
        setDownloading(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteTermFromLexicon = (term, questionID) => {
    const newLexicon = { ...lexicon };
    if (newLexicon[term]?.ids.length === 1) {
      delete newLexicon[term];
    } else if (newLexicon[term]?.ids.length > 1) {
      const index = newLexicon[term].ids.indexOf(questionID);
      if (index > -1) {
        newLexicon[term].ids.splice(index, 1);
      }
    }
    setLexicon(newLexicon);
  };

  return (
    <SnackbarProvider maxSnack={5}>
      <div className={classes.app}>
        <CssBaseline />
        <Navbar
          handleAddQuestion={handleAddQuestion}
          handleDownload={handleDownload}
          handleUpload={() => {
            setUploadTemplateClicked(true);
          }}
          downloading={downloading}
        />
        {downloading && (
          <div className={classes.progress}>
            <LinearProgress color="secondary" />
          </div>
        )}
        <Homepage
          showDialog={showDialog}
          handleAddQuestion={handleAddQuestion}
          setValidTemplate={val => {
            setValidTemplate(val);
          }}
          setMissingInfo={val => setMissingInfo(val)}
          getTemplate={temp => setTemplate(temp)}
          uploaded={uploaded ? template : null}
          populateLexicon={populateLexicon}
          deleteTermFromLexicon={deleteTermFromLexicon}
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
      <UploadTemplate
        open={uploadTemplateClicked}
        onCancel={() => {
          setUploadTemplateClicked(false);
        }}
        onUpload={onUploadTemplate}
      />
    </SnackbarProvider>
  );
}

export default App;
