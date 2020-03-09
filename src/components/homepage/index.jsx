import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import QuestionList from '../common/questionList.jsx';
import QuestionCreation from '../questionCreation/index.jsx';

const materialUseStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    width: 300,
  },
  form: {
    margin: theme.spacing(2),
    width: 300,
  },
  container: {
    direction: 'column',
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
}));

export default function HomePage(props) {
  const classes = materialUseStyles();
  const [templateName, setTemplateName] = useState('');
  const [templateLevel, setTemplateLevel] = useState('');
  const [questions, setQuestions] = useState([]);

  const { handleAddQuestion, showDialog } = props;

  const handleSaveQuestion = questionInput => {
    const newQuestions = [...questions];
    newQuestions.push(questionInput);
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

  return (
    <div className={classes.root}>
      <Grid>
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
          <QuestionList
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            questions={questions}
            handleLink={handleLink}
          />
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
