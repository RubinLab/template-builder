import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import createID from '../../utils/helper';

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
  } = props;
  const [showDetailCreation, setShowDetailCreation] = useState(false);
  const [details, setDetails] = useState([]);
  const [question, setQuestion] = useState({});

  const handleSaveDetail = detail => {
    const id = createID();
    const newDetail = { ...detail };
    newDetail.id = id;
    newDetail.questionID = questionID;
    setDetails(details.concat(newDetail));
    setShowDetailCreation(false);
  };

  const createTemplateQuestion = ques => {
    const { questionType, explanatoryText, id, showConfidence } = ques;
    const allowedTerm = ques.selectedTerms
      ? Object.values(ques.selectedTerms).map(el => el.allowedTerm)
      : [];
    const component = {
      label: ques.question,
      // TODO what is itemnumber ??
      // itemNumber: 0,
      authors,
      explanatoryText,
      minCardinality: ques.minCard,
      maxCardinality: ques.maxCard,
      shouldDisplay: true,
      id,
    };

    component.AllowedTerm = allowedTerm;

    if (questionType === 'anatomic') {
      component.AnatomicEntity = {
        annotatorConfidence: showConfidence,
      };
    } else if (questionType === 'observation') {
      component.ImagingObservation = {
        annotatorConfidence: showConfidence,
      };
    } else {
      component.annotatorConfidence = showConfidence;
    }
    return component;
  };

  const handleSave = () => {
    let updatedQuestion = { ...question };
    updatedQuestion.id = questionID;
    updatedQuestion = createTemplateQuestion(updatedQuestion);
    if (question.questionType === 'observation' && details.length > 0) {
      updatedQuestion.ImagingObservation.ImagingObservationCharacteristic = details.map(
        el => createTemplateQuestion(el)
      );
    }
    setQuestion(updatedQuestion);
    handleSaveQuestion(updatedQuestion);
    handleClose(false);
  };

  const detailsArr = Object.values(details);
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

          {detailsArr.length > 0 && <QuestionList questions={detailsArr} />}
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
};
