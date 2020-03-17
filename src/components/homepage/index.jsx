import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import QuestionList from '../common/questionList.jsx';
import QuestionCreation from '../questionCreation/index.jsx';
import TemplatePreview from './templatePreview.jsx';
import template1 from '../../utils/recist.1.json';
import template2 from '../../utils/recist.2.json';

const materialUseStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    // margin: 'auto',
    witdh: '-webkit-fill-available',
  },
  form: {
    margin: theme.spacing(2),
    width: 300,
  },
  container: {
    direction: 'column',
    justify: 'space-between',
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
  preview: {
    width: '45%',
    minWidth: 300,
  },
  templateContent: {
    width: '45%',
    minWidth: 300,
    marginRight: theme.spacing(4),
  },
  title: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(5),
    color: '#8c1717',
  },
}));

export default function HomePage(props) {
  const classes = materialUseStyles();
  const [templateName, setTemplateName] = useState('');
  const [templateLevel, setTemplateLevel] = useState('');
  const [questions, setQuestions] = useState([]);

  const { handleAddQuestion, showDialog } = props;

  const handleSaveQuestion = questionInput => {
    // const newQuestions = [...questions];
    const newQuestions = questions.concat(questionInput);
    setQuestions(newQuestions);
  };
  const handleChangeTemplateName = e => {
    setTemplateName(e.target.value);
  };

  const handleChangeTemplateLevel = e => {
    setTemplateLevel(e.target.value);
  };

  const handleEdit = () => {};
  const handleDelete = () => {};
  const handleLink = () => {};

  const template = questions.length === 1 ? template1 : template2;

  return (
    <div className={classes.root}>
      <Grid container={true} className={classes.container}>
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
          {questions.length > 0 && (
            <>
              <Typography variant="h6" className={classes.title}>
                Questions
              </Typography>
              <QuestionList
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                questions={questions}
                handleLink={handleLink}
              />
            </>
          )}
        </div>
        {questions.length > 0 && (
          <>
            <TemplatePreview
              className={classes.preview}
              template={template}
              noOfQuestions={questions.length}
            />
          </>
        )}
      </Grid>
      {showDialog && (
        <QuestionCreation
          open={showDialog}
          templateName={templateName}
          handleClose={handleAddQuestion}
          handleSaveQuestion={handleSaveQuestion}
        />
      )}
    </div>
  );
}

HomePage.propTypes = {
  showDialog: PropTypes.bool,
  handleAddQuestion: PropTypes.func,
};
