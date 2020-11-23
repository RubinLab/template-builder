import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Ajv from 'ajv';
import ajvDraft from 'ajv/lib/refs/json-schema-draft-04.json';
import { makeStyles } from '@material-ui/core/styles';
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
import AlertDialog from '../common/AlertDialog.jsx';
import QuestionList from '../question/QuestionList.jsx';
import QuestionCreation from '../questionCreation/index.jsx';
import TemplatePreview from './templatePreview.jsx';
import { createID } from '../../utils/helper';
import { getOntologyData } from '../../services/apiServices';
import schema from '../../utils/AIMTemplate_v2rvStanford_schema.json';

const materialUseStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    width: '-webkit-fill-available',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up('lg')]: {
      marginRight: theme.spacing(20),
      marginLeft: theme.spacing(20),
      // padding: theme.spacing(10),
    },
  },
  form: {
    // margin: theme.spacing(2),
    // width: 300,
  },
  textField: {
    marginTop: theme.spacing(3),
    minWidth: 300,
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: 150,
  },
  templateContent: {
    width: '45%',
    minWidth: 300,
  },
  contentCard: {
    boxShadow: 'none',
    background: '#fafafa',
  },
  title: {
    marginTop: theme.spacing(3),
    color: '#8c1717',
  },

  templateGrid: {
    paddingTop: theme.spacing(2),
  },
  templateCard: {
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
    },
  },
}));

const messages = { deleteLink: 'Are you sure you want to delete the link?' };

export default function HomePage({ showDialog, handleAddQuestion }) {
  const classes = materialUseStyles();
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionID, setquestionID] = useState('');
  const [linkTextMap, setlinkTextMap] = useState({});
  const [linkedIdMap, setLinkedIdMap] = useState({
    linkedAnswer: null,
    linkedQuestion: null,
  });
  const [deletingAnswerLink, setDeletingAnswerLink] = useState(null);
  const [open, setOpen] = useState(false);
  const [completeTemplate, setCompTemplate] = useState({});
  const [validationErrors, setValErrors] = useState([]);
  const [requiredError, setRequiredError] = useState(false);

  // TODO
  // CLARIFY how and whre to get data like version codemeaning, codevalue etc.
  // clarify the difference between template and the container

  const validateTemplate = cont => {
    const ajv = new Ajv({ schemaId: 'id' });
    ajv.addMetaSchema(ajvDraft);
    const valid = ajv.validate(schema, cont);
    if (!valid) setValErrors(validationErrors.concat(ajv.errors));
  };

  const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    return `${year}-${month}-${day}`;
  };

  // const validateRequiredTemplateMetadata = () => {};

  const formContainerData = () => {
    const newcontainer = {};
    newcontainer.uid = createID();
    newcontainer.name = templateName; // ??
    newcontainer.authors = author; // ??
    newcontainer.version = version;
    newcontainer.creationDate = getDate();
    newcontainer.description = description; // ??
    return newcontainer;
  };

  const formTemplateData = () => {
    const newTemplate = {};
    newTemplate.uid = createID();
    newTemplate.name = templateName;
    newTemplate.authors = author;
    newTemplate.version = version;
    newTemplate.creationDate = getDate();
    newTemplate.description = description;
    newTemplate.codeMeaning = ''; // ???
    newTemplate.codeValue = ''; // ??
    newTemplate.codingSchemeDesignator = ''; // ??
    newTemplate.codingSchemeVersion = ''; // ??
    return newTemplate;
  };

  // TODO
  // refactor: at the end formCompleteTemplate with download click
  // remove questionslist parameter and take all data from the state
  // for now it's passed as parameter to speed up the development to see the template in aimEditor
  const formCompleteTemplate = questionsList => {
    const temp = { ...formTemplateData(), Component: questionsList };
    const cont = {
      TemplateContainer: { ...formContainerData(), Template: [temp] },
    };
    setCompTemplate({ ...cont });
    validateTemplate(cont);
  };

  const handleDeleteLinkModal = (
    answerLinkID,
    quesID,
    answerIndex,
    questionIndex
  ) => {
    setDeletingAnswerLink({
      answerLinkID,
      quesID,
      answerIndex,
      questionIndex,
    });
    setOpen(!open);
  };

  const deleteLinkFromJson = () => {
    // TODO find the answer and delete the nextId
    try {
      const { answerLinkID, quesID, questionIndex } = deletingAnswerLink;
      const newQuestions = [...questions];
      if (
        newQuestions[questionIndex] &&
        newQuestions[questionIndex].id === quesID
      ) {
        delete newQuestions[questionIndex].selectedTerms[answerLinkID].nextId;
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for (const ques of newQuestions) {
          if (ques.id === quesID) {
            delete ques.selectedTerms[answerLinkID];
          }
        }
      }

      handleDeleteLinkModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveQuestion = questionInput => {
    const newQuestionList = questions.concat(questionInput);
    setQuestions(newQuestionList);
    formCompleteTemplate(newQuestionList);
  };

  const handleQuestionID = () => {
    const id = createID();
    setquestionID(id);
  };
  const checkRequiredFields = addQuestionClicked => {
    if ((!description || !templateName || !version) && showDialog) {
      setRequiredError(true);
      if (addQuestionClicked) handleAddQuestion(false);
    }

    if (description && templateName && version) {
      setRequiredError(false);
    }
  };

  useEffect(() => {
    handleQuestionID();
    if (showDialog) {
      checkRequiredFields(true);
    }
  }, [showDialog]);

  const getOntologyMap = () => {
    getOntologyData()
      .then(res => {
        const map = {};
        const { data } = res;
        data.forEach(el => {
          const { acronym, name } = el;
          map[acronym] = { acronym, name };
        });
        sessionStorage.setItem('ontologyMap', JSON.stringify(map));
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    getOntologyMap();
  }, []);

  const createLink = newLinkedIdMap => {
    const { linkedAnswer, linkedQuestion } = newLinkedIdMap;
    if (linkedAnswer && linkedQuestion) {
      // TODO
      // find the answer and add nextID
      // after that clear linkedIdMap
      setLinkedIdMap({ linkedAnswer: null, linkedQuestion: null });
    }
  };

  const handleAnswerLink = (
    undo,
    answer,
    questionId,
    questionIndex,
    questionText
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
        linkedQuestion: null,
      });
      return;
    }
    newLinkedIdMap.linkedAnswer = {
      id: answer.id,
      questionId,
      questionText,
      answerText: answer.allowedTerm.codeMeaning,
    };
    setLinkedIdMap(newLinkedIdMap);
  };
  const handleQuestionLink = (undo, question) => {
    const newLinkTextMap = { ...linkTextMap };
    const newLinkedIdMap = { ...linkedIdMap };
    if (undo || linkedIdMap[question.id]) {
      if (newLinkedIdMap.linkedQuestion) {
        delete newLinkTextMap[newLinkedIdMap.linkedQuestion.id];
      }
      if (newLinkTextMap[question.id]) delete newLinkTextMap[question.id];
      setlinkTextMap(newLinkTextMap);
      newLinkedIdMap.linkedQuestion = null;
      setLinkedIdMap(newLinkedIdMap);
      return;
    }
    newLinkedIdMap.linkedQuestion = {
      id: question.id,
      questionText: question.question,
    };
    setLinkedIdMap(newLinkedIdMap);
    const { answerText, questionText, id } = linkedIdMap.linkedAnswer;
    newLinkTextMap[question.id] = `${answerText} of ${questionText}`;
    newLinkTextMap[id] = question.question;
    setlinkTextMap(newLinkTextMap);
    createLink(newLinkedIdMap);
  };

  const handleEdit = () => {};

  const handleDelete = question => {
    const updatedQuestions = { ...questions };
    const details = [];
    const arr = Object.values(updatedQuestions);
    if (!question.questionID) {
      arr.forEach(el => {
        if (el.questionID === question.id) {
          details.push(el.id);
        }
      });
      details.forEach(el => delete updatedQuestions[el]);
    }
    delete updatedQuestions[question.id];
    setQuestions(updatedQuestions);
  };

  const questionsArr = Object.values(questions);
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
              <form className={classes.form} noValidate autoComplete="off">
                <TextField
                  error={requiredError && !templateName}
                  helperText={
                    requiredError && !templateName
                      ? 'Fill before creating a question'
                      : ''
                  }
                  required={true}
                  className={classes.textField}
                  id="standard-basic"
                  label="Template Name"
                  onChange={e => {
                    checkRequiredFields();
                    setTemplateName(e.target.value);
                  }}
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="templateLevel">Type of Template</InputLabel>
                  <Select
                    labelId="templateLevel"
                    id="demo-controlled-open-select"
                    value={templateType}
                    onChange={e => setTemplateType(e.target.value)}
                  >
                    <MenuItem value={'study'}>Study</MenuItem>
                    <MenuItem value={'series'}>Series</MenuItem>
                    <MenuItem value={'image'}>Image</MenuItem>
                  </Select>
                  <TextField
                    className={classes.textField}
                    id="standard-basic"
                    label="Author"
                    onChange={e => setAuthor(e.target.value)}
                  />
                  <TextField
                    error={requiredError && !description}
                    helperText={
                      requiredError && !description
                        ? 'Fill before creating a question'
                        : ''
                    }
                    required={true}
                    className={classes.textField}
                    id="standard-basic"
                    label="Description"
                    onChange={e => {
                      checkRequiredFields();
                      setDescription(e.target.value);
                    }}
                  />
                  <TextField
                    error={requiredError && !version}
                    helperText={
                      requiredError && !version
                        ? 'Fill before creating a question'
                        : ''
                    }
                    required={true}
                    className={classes.textField}
                    id="standard-basic"
                    label="Version"
                    onChange={e => {
                      checkRequiredFields();
                      setVersion(e.target.value);
                    }}
                  />
                </FormControl>
              </form>
              {questionsArr.length > 0 && (
                <>
                  <Typography variant="h6" className={classes.title}>
                    Questions
                  </Typography>
                  <QuestionList
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    questions={questionsArr}
                    handleAnswerLink={handleAnswerLink}
                    handleQuestionLink={handleQuestionLink}
                    linkTextMap={linkTextMap}
                    linkedIdMap={linkedIdMap}
                    handleDeleteLink={handleDeleteLinkModal}
                    creation={false}
                  />
                </>
              )}
            </div>
          </Card>
        </Grid>
        <Grid item={true} className={classes.templateGrid}>
          <Card>
            {questionsArr.length > 0 && (
              <>
                <CardContent>
                  <Typography variant="h5" className={classes.title}>
                    Template Preview
                  </Typography>
                  <TemplatePreview
                    template={completeTemplate}
                    noOfQuestions={questionsArr.length}
                  />
                </CardContent>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      {showDialog && !requiredError && (
        <QuestionCreation
          open={showDialog}
          templateName={templateName}
          handleClose={handleAddQuestion}
          handleSaveQuestion={handleSaveQuestion}
          questionID={questionID}
          authors={author}
          index={questions.length}
        />
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
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
      <AlertDialog
        message={messages.deleteLink}
        onOK={deleteLinkFromJson}
        onCancel={deleteLinkFromJson}
        open={open}
      />
    </>
  );
}

HomePage.propTypes = {
  showDialog: PropTypes.bool,
  handleAddQuestion: PropTypes.func,
};
