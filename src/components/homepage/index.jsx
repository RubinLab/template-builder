import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import QuestionList from '../question/QuestionList.jsx';
import QuestionCreation from '../questionCreation/index.jsx';
import TemplatePreview from './templatePreview.jsx';
import {
  createID,
  getIndecesFromAnswerID,
  formAnswerIDFromIndeces,
  updateQuestionMetadata
} from '../../utils/helper';

const materialUseStyles = makeStyles(theme => ({
  root: {
    /* eslint-disable no-dupe-keys */
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    width: '-webkit-fill-available',
    width: '-moz-available',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      padding: theme.spacing(1)
    },
    [theme.breakpoints.up('lg')]: {
      marginRight: theme.spacing(20),
      marginLeft: theme.spacing(20)
      // padding: theme.spacing(10),
    }
  },
  form: {
    // margin: theme.spacing(2),
    // width: 300,
  },
  textField: {
    marginTop: theme.spacing(1),
    minWidth: 300,
    width: 400
  },
  textFieldUID: {
    marginTop: theme.spacing(1)
    // minWidth: 300,
    // width:
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2)
  },
  formControl: {
    marginTop: theme.spacing(1),
    minWidth: 150,
    width: 400
  },
  templateContent: {
    // width: '45%',
    minWidth: 300,
    background: '#fafafa'
  },
  contentCard: {
    boxShadow: 'none',
    background: '#fafafa',
    width: 'min-content'
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    color: '#8c1717'
  },

  templateGrid: {
    paddingTop: theme.spacing(2),
    maxWidth: '400px'
  },
  templateCard: {
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 'auto'
    }
  },
  required: {
    color: '#8C1718',
    fontWeight: 'bold'
  },
  crumbs: {
    color: 'black',
    fontWeight: 'bold'
  },
  accordionHeader: {
    background: '#E3E0D8'
  }
}));

// const messages = { deleteLink: 'Are you sure you want to delete the link?' };

const ontologies = {
  ICD10: `International Classification of Diseases, Version 10`,
  RADLEX: `Radiology Lexicon`,
  NCIT: `National Cancer Institute Thesaurus`,
  SNOMEDCT: `SNOMED CT`
};

export default function HomePage({
  showDialog,
  handleAddQuestion,
  getTemplate,
  uploaded,
  setUploaded,
  populateLexicon,
  deleteTermFromLexicon,
  apiKeys,
  tempContUID,
  setTempContUID
}) {
  const classes = materialUseStyles();
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [ontology, setOntology] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionID, setquestionID] = useState('');
  const [linkTextMap, setlinkTextMap] = useState({});
  const [linkedIdMap, setLinkedIdMap] = useState({
    linkedAnswer: null,
    linkedQuestion: null
  });
  const [completeTemplate, setCompTemplate] = useState({});
  // Removed the following line. Instead, this hook is defined in App.js and passed to HomePage.
  // This way, the hook can also be used when uploading files.
  // const [tempContUID, setTempContUID] = useState('');
  const [requiredError, setRequiredError] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [codeMeaning, setCodeMeaning] = useState('');
  const [codeValue, setCodeValue] = useState('');
  const [codingSchemeDesignator, setcodingSchemeDesignator] = useState(
    '99EPAD'
  );
  const [showForm, setShowForm] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // TODO
  // CLARIFY how and whre to get data like version codemeaning, codevalue etc.
  // clarify the difference between template and the container

  const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month =
      date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${year}-${month}-${day}`;
  };

  const formContainerData = (key, value) => {
    const newcontainer = {};
    newcontainer.uid = tempContUID;
    newcontainer.name = key === 'name' ? value : templateName; // ??
    newcontainer.authors = key === 'authors' ? value : author; // ??
    newcontainer.version = key === 'version' ? value : version;
    newcontainer.creationDate = getDate();
    newcontainer.description = key === 'description' ? value : description; // ??
    return newcontainer;
  };

  const formTemplateData = (key, value) => {
    const newTemplate = {};
    newTemplate.uid = createID();
    newTemplate.name = key === 'name' ? value : templateName;
    newTemplate.authors = key === 'authors' ? value : author;
    newTemplate.templateType = key === 'templateType' ? value : templateType;
    newTemplate.version = key === 'version' ? value : version;
    newTemplate.creationDate = getDate();
    newTemplate.description = key === 'description' ? value : description;
    newTemplate.codeMeaning = key === 'codeMeaning' ? value : codeMeaning; // ???
    newTemplate.codeValue = key === 'codeValue' ? value : codeValue; // ??
    newTemplate.codingSchemeDesignator =
      key === 'codingSchemeDesignator' ? value : codingSchemeDesignator; // ??
    // newTemplate.codingSchemeVersion = ''; // ??
    return newTemplate;
  };

  // TODO
  // refactor: at the end formCompleteTemplate with download click
  // remove questionslist parameter and take all data from the state
  // for now it's passed as parameter to speed up the development to see the template in aimEditor
  const formCompleteTemplate = (questionsList, key, value) => {
    const temp = { ...formTemplateData(key, value), Component: questionsList };
    const cont = {
      TemplateContainer: { ...formContainerData(key, value), Template: [temp] }
    };
    setCompTemplate({ ...cont });
    getTemplate(cont);
  };

  // TODO
  // creating a link between an answer and question is
  // a too easy task for showing a warning message
  // show this warning for question deletion instead

  const updateTemplateMetadata = (key, value) => {
    if (Object.keys(completeTemplate).length > 0) {
      const newCompleteTemplate = _.cloneDeep(completeTemplate);
      const commonKeys = ['name', 'authors', 'version', 'description'];
      if (commonKeys.includes(key)) {
        newCompleteTemplate.TemplateContainer[key] = value;
        if (key === 'authors') {
          const component =
            newCompleteTemplate.TemplateContainer.Template[0].Component;
          const list = updateQuestionMetadata(key, value, component);
          newCompleteTemplate.TemplateContainer.Template[0].Component = list;
        }
      }

      newCompleteTemplate.TemplateContainer.Template[0][key] = value;
      setCompTemplate(newCompleteTemplate);
      formCompleteTemplate(
        newCompleteTemplate.TemplateContainer.Template[0].Component,
        key,
        value
      );
    }
  };

  const deleteLinkFromJson = answerID => {
    try {
      const {
        questionIndex,
        answerIndex,
        charIndex,
        scaleIndex
      } = getIndecesFromAnswerID(answerID);

      const newQestions = _.cloneDeep(questions);
      // TODO - learn if char observation or anatomic add flag to the answer id
      if (scaleIndex) {
        delete newQestions[questionIndex][charIndex][scaleIndex][answerIndex]
          .nextid;
        // TODO - learn if char observation or anatomic add flag to the answer id
      } else if (charIndex)
        delete newQestions[questionIndex][charIndex][answerIndex].nextid;
      else delete newQestions[questionIndex].AllowedTerm[answerIndex].nextid;

      // delete popup text
      const newLinkTextMap = { ...linkTextMap };
      delete newLinkTextMap[answerID];
      setlinkTextMap(newLinkTextMap);

      // reform the template
      formCompleteTemplate(newQestions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveQuestion = questionInput => {
    const newQuestionList = [...questions];
    if (typeof editIndex === 'number') {
      newQuestionList[editIndex] = questionInput;
    } else {
      newQuestionList.push(questionInput);
    }
    setQuestions(newQuestionList);
    formCompleteTemplate(newQuestionList);
    setEditIndex(null);
    setShowForm(false);
  };

  const handleQuestionID = () => {
    let id;
    if (typeof editIndex === 'number') {
      id = questions[editIndex].id;
    } else id = createID();
    setquestionID(id);
  };

  const checkRequiredFields = addQuestionClicked => {
    const showError =
      !description ||
      !templateName ||
      !version ||
      !author ||
      !codeMeaning ||
      // !codeValue ||
      !codingSchemeDesignator;

    if (showError && showDialog) {
      setRequiredError(true);
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      if (addQuestionClicked) handleAddQuestion(false);
    }

    if (!showError) {
      setRequiredError(false);
    }
  };

  useEffect(() => {
    handleQuestionID();
    if (showDialog) {
      checkRequiredFields(true);
    }
  }, [showDialog]);

  useEffect(() => {
    setTempContUID(createID());
  }, []);

  const populateTemplateMetada = () => {
    const temp = uploaded ? uploaded.TemplateContainer : null;
    if (temp) {
      let tempType = temp.Template[0].templateType;
      tempType = tempType
        ? tempType[0].toUpperCase() + tempType.substring(1).toLowerCase()
        : '';
      setTemplateName(temp.name);
      setTemplateType(tempType);
      setAuthor(temp.authors);
      setDescription(temp.description);
      setVersion(temp.version);
      setCodeMeaning(temp.Template[0].codeMeaning);
      setCodeValue(temp.Template[0].codeValue);
      setcodingSchemeDesignator(temp.Template[0].codingSchemeDesignator);
    }
  };

  useEffect(() => {
    if (uploaded && Object.keys(uploaded).length > 0) {
      setCompTemplate(uploaded);
      populateTemplateMetada();
      const uploadedQuestions = [
        ...uploaded.TemplateContainer.Template[0].Component
      ];
      setQuestions(uploadedQuestions);
      setUploaded(false);
    }
  }, [uploaded]);

  const createLink = newLinkedIdMap => {
    const { linkedAnswer, linkedQuestion } = newLinkedIdMap;
    if (linkedAnswer && linkedQuestion) {
      const {
        questionIndex,
        answerIndex,
        charIndex,
        scaleIndex
      } = getIndecesFromAnswerID(linkedAnswer.id);

      // TODO - learn if char observation or anatomic add flag to the answer id
      if (scaleIndex) {
        questions[questionIndex][charIndex][scaleIndex][answerIndex].nextid =
          linkedQuestion.id;
        // TODO - learn if char observation or anatomic add flag to the answer id
      } else if (charIndex)
        questions[questionIndex][charIndex][answerIndex].nextid =
          linkedQuestion.id;
      else
        questions[questionIndex].AllowedTerm[answerIndex].nextid =
          linkedQuestion.id;

      // TODO
      // after that clear linkedIdMap
      setLinkedIdMap({ linkedAnswer: null, linkedQuestion: null });
    }
  };

  const handleAnswerLink = (
    undo,
    answer,
    questionId,
    answerIndex,
    questionIndex,
    questionText,
    charIndex,
    scaleIndex
  ) => {
    const newLinkTextMap = { ...linkTextMap };
    const newLinkedIdMap = { ...linkedIdMap };
    if (undo || linkedIdMap.linkedAnswer) {
      if (newLinkedIdMap.linkedQuestion) {
        delete newLinkTextMap[newLinkedIdMap.linkedQuestion.id];
      }
      if (newLinkTextMap[linkedIdMap.linkedAnswer.id])
        delete newLinkTextMap[linkedIdMap.linkedAnswer.id];
      setlinkTextMap(newLinkTextMap);
      setLinkedIdMap({
        linkedAnswer: null,
        linkedQuestion: null
      });
      return;
    }
    const answerID = formAnswerIDFromIndeces(
      questionIndex,
      answerIndex,
      answer.codeValue,
      charIndex,
      scaleIndex
    );
    newLinkedIdMap.linkedAnswer = {
      id: answerID,
      questionId,
      questionText,
      answerText: answer.codeMeaning
    };
    setLinkedIdMap(newLinkedIdMap);
  };
  const handleQuestionLink = (undo, question) => {
    // get question index - and answer Index from the selected answer id
    // get question ID from hre and add nextid to that index

    // TODO
    // add question index check
    // question should come after the answer
    const newLinkTextMap = { ...linkTextMap };
    const newLinkedIdMap = { ...linkedIdMap };
    if (undo || linkedIdMap[question.id]) {
      newLinkedIdMap.linkedQuestion = null;
      setLinkedIdMap(newLinkedIdMap);
      return;
    }
    newLinkedIdMap.linkedQuestion = {
      id: question.id,
      questionText: question.label
    };
    setLinkedIdMap(newLinkedIdMap);
    const { id } = linkedIdMap.linkedAnswer;
    // newLinkTextMap[question.id] = `${answerText} of ${questionText}`;
    newLinkTextMap[id] = question.label;
    setlinkTextMap(newLinkTextMap);
    createLink(newLinkedIdMap);
  };

  const handleDelete = (combinedIndex, id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    const newQestions = _.cloneDeep(questions);
    const indeces = combinedIndex.split('-');
    let quesIndex;
    let charIndex;
    if (indeces.length === 2) {
      quesIndex = parseInt(indeces[0], 10);
      charIndex = parseInt(indeces[1], 10);
    } else quesIndex = parseInt(indeces[0], 10);
    const question = newQestions[quesIndex];
    if (charIndex >= 0) {
      // if anatomic entity anatomicEntity arr length
      // if the char index in that boundary delete from that
      // else delete from imaging observation
      let anatomicChars;
      let observationChars;
      let anatomic = false;
      if (question.AnatomicEntity) {
        anatomicChars = question.AnatomicEntity.AnatomicEntityCharacteristic;
        observationChars =
          question.AnatomicEntity.ImagingObservationCharacteristic;
        anatomic = true;
      }
      if (question.ImagingObservation)
        observationChars =
          question.ImagingObservation.ImagingObservationCharacteristic;

      if (anatomic) {
        const anaCharMinus = anatomicChars && anatomicChars.length <= charIndex;
        if (anatomicChars && anatomicChars.length > charIndex) {
          if (anatomicChars[charIndex] && anatomicChars[charIndex].id === id) {
            anatomicChars.splice(charIndex, 1);
            if (anatomicChars.length === 0)
              delete question.AnatomicEntity.AnatomicEntityCharacteristic;
          }
        }
        if (observationChars) {
          const obsIndex = anaCharMinus
            ? charIndex - anatomicChars.length
            : charIndex;
          if (
            observationChars[obsIndex] &&
            observationChars[obsIndex].id === id
          ) {
            observationChars.splice(obsIndex, 1);
            if (observationChars.length === 0)
              delete question.AnatomicEntity.ImagingObservationCharacteristic;
          }
        }
        // if it is imaging observation delete the index directly
      } else if (
        observationChars &&
        observationChars[charIndex] &&
        observationChars[charIndex].id === id
      ) {
        observationChars.splice(charIndex, 1);
        if (observationChars.length === 0) {
          delete question.ImagingObservation.ImagingObservationCharacteristic;
        }
      }
    } else {
      newQestions.splice(quesIndex, 1);
    }
    setQuestions(newQestions);
    formCompleteTemplate(newQestions);
  };
  const showQuestionCreationModal = showDialog && !requiredError;

  return (
    <>
      <Grid
        container={true}
        className={classes.root}
        sm={12}
        xl={6}
        spacing={2}
        justify={'space-between'}
      >
        <Grid item={true}>
          <Card className={classes.contentCard}>
            <div className={classes.templateContent}>
              <Accordion
                className={classes.templateContent}
                expanded={showForm}
              >
                <AccordionSummary
                  className={classes.accordionHeader}
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => setShowForm(!showForm)}
                >
                  <Breadcrumbs>
                    <div
                      className={
                        templateName ? classes.crumbs : classes.required
                      }
                    >
                      {templateName || 'Name required'}
                    </div>
                    <div
                      className={
                        templateType ? classes.crumbs : classes.required
                      }
                    >
                      {templateType || 'Type required'}
                    </div>
                    <div
                      className={version ? classes.crumbs : classes.required}
                    >
                      {version || 'Version required'}
                    </div>
                  </Breadcrumbs>
                </AccordionSummary>

                <AccordionDetails>
                  <form className={classes.form} noValidate autoComplete="off">
                    <TextField
                      error={requiredError && !templateName}
                      required={true}
                      className={classes.textField}
                      id="standard-basic"
                      label="Template Name"
                      onChange={e => {
                        setTemplateName(e.target.value);
                        updateTemplateMetadata('name', e.target.value);
                        checkRequiredFields();
                        // formCompleteTemplate(questions);
                      }}
                      value={templateName}
                    />
                    <FormControl className={classes.formControl}>
                      <InputLabel id="templateLevel">
                        Type of Template
                      </InputLabel>
                      <Select
                        className={classes.textField}
                        labelId="templateLevel"
                        id="demo-controlled-open-select"
                        value={templateType || ''}
                        onChange={e => {
                          setTemplateType(e.target.value);
                          // formCompleteTemplate(questions);
                          updateTemplateMetadata(
                            'templateType',
                            e.target.value
                          );
                        }}
                      >
                        <MenuItem value={'Study'}>Study</MenuItem>
                        <MenuItem value={'Series'}>Series</MenuItem>
                        <MenuItem value={'Image'}>Image</MenuItem>
                      </Select>
                      <TextField
                        className={classes.textField}
                        id="standard-basic"
                        label="Author"
                        onChange={e => {
                          setAuthor(e.target.value);
                          // formCompleteTemplate(questions);
                          updateTemplateMetadata('authors', e.target.value);
                        }}
                        required={true}
                        error={requiredError && !author}
                        value={author}
                      />
                      <TextField
                        error={requiredError && !description}
                        required={true}
                        className={classes.textField}
                        multiline
                        id="standard-basic"
                        label="Description"
                        onChange={e => {
                          setDescription(e.target.value);
                          updateTemplateMetadata('description', e.target.value);
                          checkRequiredFields();
                          // formCompleteTemplate(questions);
                        }}
                        value={description}
                      />
                      <TextField
                        error={requiredError && !version}
                        required={true}
                        className={classes.textField}
                        id="standard-basic"
                        label="Version"
                        onChange={e => {
                          setVersion(e.target.value);
                          updateTemplateMetadata('version', e.target.value);
                          checkRequiredFields();
                          // formCompleteTemplate(questions);
                        }}
                        value={version}
                      />

                      <TextField
                        error={requiredError && !codeMeaning}
                        required={true}
                        className={classes.textField}
                        id="standard-basic"
                        label="Code Meaning"
                        onChange={e => {
                          setCodeMeaning(e.target.value);
                          updateTemplateMetadata('codeMeaning', e.target.value);
                          checkRequiredFields();
                          // formCompleteTemplate(questions);
                        }}
                        value={codeMeaning}
                      />

                      {/* <TextField
                        disabled
                        error={requiredError && !codeValue}
                        required={true}
                        className={classes.textField}
                        id="standard-basic"
                        label="Code Value"
                        onChange={e => {
                          checkRequiredFields();
                          setCodeValue(e.target.value);
                          // formCompleteTemplate(questions);
                        }}
                        value={codeValue}
                      /> */}

                      <TextField
                        disabled
                        defaultValue={'99EPAD'}
                        error={requiredError && !codingSchemeDesignator}
                        required={true}
                        className={classes.textField}
                        id="standard-basic"
                        label="Coding Schema Designator"
                        onChange={e => {
                          setcodingSchemeDesignator(e.target.value);
                          checkRequiredFields();
                          // formCompleteTemplate(questions);
                        }}
                        value={codingSchemeDesignator}
                      />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                      <InputLabel id="ontology">
                        Default ontology for term search
                      </InputLabel>
                      <Select
                        className={classes.textField}
                        labelId="ontology"
                        id="demo-controlled-open-select"
                        value={ontology || ''}
                        onChange={e => setOntology(e.target.value)}
                      >
                        {Object.keys(ontologies).map(el => (
                          <MenuItem
                            value={el}
                            key={el}
                          >{`${el} - ${ontologies[el]}`}</MenuItem>
                        ))}
                      </Select>
                      <TextField
                        disabled
                        fullWidth={true}
                        id="standard-read-only-input"
                        className={classes.textFieldUID}
                        label="Template Container UID"
                        value={tempContUID}
                      />
                      <TextField
                        disabled
                        id="standard-read-only-input"
                        className={classes.textField}
                        label="Date"
                        value={getDate()}
                      />
                    </FormControl>
                  </form>
                </AccordionDetails>
              </Accordion>

              {questions.length > 0 && (
                <>
                  <Typography variant="h6" className={classes.title}>
                    Questions
                  </Typography>
                  <QuestionList
                    handleEdit={(e, i) => {
                      handleAddQuestion(true);
                      setEditIndex(i);
                    }}
                    handleDelete={handleDelete}
                    questions={questions}
                    handleAnswerLink={handleAnswerLink}
                    handleQuestionLink={handleQuestionLink}
                    linkTextMap={linkTextMap}
                    linkedIdMap={linkedIdMap}
                    handleDeleteLink={deleteLinkFromJson}
                    creation={false}
                    apiKeys={apiKeys}
                    getList={list => {
                      const newList = updateQuestionMetadata(
                        'itemNumber',
                        null,
                        list
                      );
                      setQuestions(newList);
                      formCompleteTemplate(newList);
                    }}
                  />
                </>
              )}
            </div>
          </Card>
        </Grid>
        <Grid item={true} className={classes.templateGrid}>
          <Card>
            {questions.length > 0 && (
              <>
                <CardContent>
                  <Typography variant="h5" className={classes.title}>
                    Template Preview
                  </Typography>
                  <TemplatePreview
                    template={completeTemplate}
                    noOfQuestions={questions.length}
                  />
                </CardContent>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      {showQuestionCreationModal && (
        <QuestionCreation
          open={showDialog}
          templateName={templateName}
          handleClose={() => {
            setEditIndex(null);
            handleAddQuestion();
          }}
          handleSaveQuestion={handleSaveQuestion}
          questionID={questionID}
          authors={author}
          index={questions.length}
          ontology={ontology}
          edit={questions[editIndex]}
          templateUID={tempContUID}
          populateLexicon={populateLexicon}
          deleteTermFromLexicon={deleteTermFromLexicon}
          apiKeys={apiKeys}
        />
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={linkedIdMap.linkedAnswer && !linkedIdMap.linkedQuestion}
        message={`Click on the link icon next to the question you want to jump`}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              // size="small"
              onClick={() => handleAnswerLink(true)}
            >
              UNDO
            </Button>
          </React.Fragment>
        }
      />
      {/* <AlertDialog
        message={messages.deleteLink}
        onOK={deleteLinkFromJson}
        onCancel={deleteLinkFromJson}
        open={open}
      /> */}
    </>
  );
}

HomePage.propTypes = {
  showDialog: PropTypes.bool,
  handleAddQuestion: PropTypes.func,
  setValidTemplate: PropTypes.func,
  setMissingInfo: PropTypes.func,
  getTemplate: PropTypes.func,
  uploaded: PropTypes.object,
  setUploaded: PropTypes.func,
  populateLexicon: PropTypes.func,
  deleteTermFromLexicon: PropTypes.func,
  apiKeys: PropTypes.object,
  setTempContUID: PropTypes.func,
  tempContUID: PropTypes.obj
};
