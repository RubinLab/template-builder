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
import QuestionList from '../common/questionList.jsx';
import QuestionCreation from '../questionCreation/index.jsx';
import TemplatePreview from './templatePreview.jsx';
import template1 from '../../utils/recist.1.json';
import template2 from '../../utils/recist.2.json';
import createID from '../../utils/helper';

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

export default function HomePage(props) {
  const classes = materialUseStyles();
  const [templateName, setTemplateName] = useState('');
  const [templateLevel, setTemplateLevel] = useState('');
  const [questions, setQuestions] = useState({});
  const [questionID, setquestionID] = useState('');

  const { handleAddQuestion, showDialog } = props;

  const handleSaveQuestion = questionInput => {
    const newQuestions = { ...questions, ...questionInput };
    setQuestions(newQuestions);
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
  const handleLink = () => {};

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
                  <InputLabel id="templateLevel">Template Level</InputLabel>
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
                    handleLink={handleLink}
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
      {showDialog && (
        <QuestionCreation
          open={showDialog}
          templateName={templateName}
          handleClose={handleAddQuestion}
          handleSaveQuestion={handleSaveQuestion}
          questionID={questionID}
        />
      )}
    </>
  );
}

HomePage.propTypes = {
  showDialog: PropTypes.bool,
  handleAddQuestion: PropTypes.func,
};
