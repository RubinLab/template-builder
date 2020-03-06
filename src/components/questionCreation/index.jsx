import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Form from './form.jsx';

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    marginBottom: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
}));

export default function QuestionCreation(props) {
  const classes = useStyles();
  const { open, templateName, handleClose } = props;
  // const [question, setQuestion] = useState({});

  // const handleQuestionInput = input => {
  //   const newQuestion = { ...question, ...input };
  //   setQuestion(newQuestion);
  // };

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
          <Form />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Close
          </Button>
          <Button onClick={() => handleClose(false)} color="primary">
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
};
