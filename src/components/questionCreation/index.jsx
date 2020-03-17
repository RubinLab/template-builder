import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Form from './form.jsx';
import DetailCreation from './detailsCreation.jsx';
import QuestionList from '../common/questionList.jsx';

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
  const { open, templateName, handleClose, handleSaveQuestion } = props;
  const [showDetailCreation, setShowDetailCreation] = useState(false);
  const [details, setDetails] = useState([]);
  const [question, setQuestion] = useState({});

  const handleSaveDetail = detail => {
    const newDetails = [...details];
    newDetails.push(detail);
    setDetails(newDetails);
    setShowDetailCreation(false);
  };

  const handleSave = () => {
    handleSaveQuestion([question, ...details]);
    handleClose(false);
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
          <Form postQuestion={setQuestion} />
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => setShowDetailCreation(true)}
          >
            Add details
          </Button>

          {details.length > 0 && <QuestionList questions={details} />}
          {showDetailCreation && (
            <DetailCreation
              open={showDetailCreation}
              handleClose={setShowDetailCreation}
              handleSave={handleSaveDetail}
              setQuestion={setQuestion}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleSave} color="primary">
            Save question
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
};
