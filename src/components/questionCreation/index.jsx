import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import QuestionForm from './QuestionForm.jsx';
import DetailCreation from './detailsCreation.jsx';
import QuestionList from '../question/QuestionList.jsx';
import { createID, createTemplateQuestion } from '../../utils/helper';

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    marginBottom: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),

    background: '#E3E0D8',
    '&:hover': {
      background: '#CCBC8E',
    },
  },
  checkbox: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
}));

export default function QuestionCreation(props) {
  const classes = useStyles();
  const {
    open,
    templateName,
    handleClose,
    handleSaveQuestion,
    questionID,
    authors,
    index,
  } = props;
  const [showDetailCreation, setShowDetailCreation] = useState(false);
  const [details, setDetails] = useState([]);
  const [question, setQuestion] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  const validateQuestionAttributes = (ques, questionType, char) => {
    const errors = [];
    const invalidMin =
      typeof ques.minCardinality !== 'number' ||
      Number.isNaN(ques.minCardinality);
    const invalidMax =
      typeof ques.maxCardinality !== 'number' ||
      Number.isNaN(ques.maxCardinality);

    if (ques.minCardinality > ques.maxCardinality) {
      errors.push(
        'Minimum cardinaltiy can not be bigger than maximum Cardinality!'
      );
    }
    if (invalidMin || invalidMax) {
      errors.push('Minimum and maximum cardinality fields are both required!');
    }

    if (ques.maxCardinality === 0) {
      errors.push('Maximum Cardinality should be bigger than 0!');
    }
    if (!ques.label) {
      errors.push('Question text is required!');
    }
    if (!char) {
      if (!questionType) {
        errors.push('Question type is required!');
      }
    }
    errors.map(msg => enqueueSnackbar(msg, { variant: 'error' }));
    return errors.length === 0;
  };

  const handleSaveDetail = detail => {
    const id = createID();
    let newDetail = { ...detail };
    newDetail.id = id;
    newDetail.questionID = questionID;
    newDetail = createTemplateQuestion(newDetail, authors, details.length);
    const valid = validateQuestionAttributes(newDetail, true, true);
    if (valid) {
      setDetails(details.concat(newDetail));
      setShowDetailCreation(false);
    }
  };

  const handleSave = () => {
    let updatedQuestion = { ...question };
    updatedQuestion.id = questionID;
    updatedQuestion = createTemplateQuestion(updatedQuestion, authors, index);
    if (question.questionType === 'observation' && details.length > 0) {
      updatedQuestion.ImagingObservation.ImagingObservationCharacteristic = details;
    }
    const valid = validateQuestionAttributes(
      updatedQuestion,
      question.questionType
    );
    if (valid) {
      setQuestion(updatedQuestion);
      handleSaveQuestion(updatedQuestion);
      handleClose(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        className={classes.root}
        onClose={() => handleClose(false)}
        scroll="body"
      >
        <DialogTitle id="createQuestion-title">Create Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Fill the form and save to add a new question to the template ${templateName}`}
          </DialogContentText>
          <QuestionForm postQuestion={setQuestion} />

          {question.questionType === 'observation' && (
            <Button
              variant="outlined"
              className={classes.button}
              onClick={() => setShowDetailCreation(true)}
            >
              Add Observation Characteristics
            </Button>
          )}

          {details.length > 0 && (
            <QuestionList questions={details} creation={true} />
          )}
          {showDetailCreation && (
            <DetailCreation
              open={showDetailCreation}
              handleClose={setShowDetailCreation}
              handleSave={handleSaveDetail}
              setQuestion={setQuestion}
              authors={authors}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

QuestionCreation.propTypes = {
  open: PropTypes.bool,
  templateName: PropTypes.string,
  handleClose: PropTypes.func,
  handleSaveQuestion: PropTypes.func,
  questionID: PropTypes.string,
  authors: PropTypes.string,
  index: PropTypes.number,
};
