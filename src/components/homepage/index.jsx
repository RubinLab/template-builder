import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import template1 from '../../utils/recist.1.json';
import template2 from '../../utils/recist.2.json';
import createID from '../../utils/helper';
import { getOntologyData } from '../../services/apiServices';

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

export default function HomePage(props) {
  const classes = materialUseStyles();
  const [templateName, setTemplateName] = useState('');
  const [templateLevel, setTemplateLevel] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionID, setquestionID] = useState('');
  const [linkTextMap, setlinkTextMap] = useState({});
  const [linkedIdMap, setLinkedIdMap] = useState({
    linkedAnswer: null,
    linkedQuestion: null,
  });
  const [deletingAnswerLink, setDeletingAnswerLink] = useState(null);
  const [open, setOpen] = useState(false);

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
      console.log(' --> delete implemented');
      const {
        answerLinkID,
        quesID,
        answerIndex,
        questionIndex,
      } = deletingAnswerLink;

      console.log('typeof questions');
      console.log(typeof questions);

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
    setQuestions(questions.concat(questionInput));
  };
  const handleChangeTemplateName = e => {
    setTemplateName(e.target.value);
  };

  const handleChangeTemplateLevel = e => {
    setTemplateLevel(e.target.value);
  };

  const handleQuestionID = () => {
    const id = createID();
    setquestionID(id);
  };

  useEffect(() => {
    handleQuestionID();
  }, [props.showDialog]);

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
  const template = questionsArr.length === 1 ? template1 : template2;
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
                  className={classes.textField}
                  id="standard-basic"
                  label="Template Name"
                  onChange={handleChangeTemplateName}
                />
                <FormControl className={classes.formControl}>
                  <InputLabel id="templateLevel">Type of Template</InputLabel>
                  <Select
                    labelId="templateLevel"
                    id="demo-controlled-open-select"
                    value={templateLevel}
                    onChange={handleChangeTemplateLevel}
                  >
                    <MenuItem value={'study'}>Study</MenuItem>
                    <MenuItem value={'series'}>Series</MenuItem>
                    <MenuItem value={'image'}>Image</MenuItem>
                  </Select>
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
                    template={template}
                    noOfQuestions={questionsArr.length}
                  />
                </CardContent>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      {props.showDialog && (
        <QuestionCreation
          open={props.showDialog}
          templateName={templateName}
          handleClose={props.handleAddQuestion}
          handleSaveQuestion={handleSaveQuestion}
          questionID={questionID}
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
