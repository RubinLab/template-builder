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

const materialUseStyles = makeStyles(theme => ({
  root: { direction: 'row', marginLeft: theme.spacing(1) },
  checkbox: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3)
  }
}));

export default function DetailsCreation(props) {
  const { open, handleClose, handleSave, characteristic, ontology } = props;
  const classes = materialUseStyles();
  const [question, setQuestion] = useState({});

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
        <DialogTitle id="createQuestion-title">
          Create Characteristics
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Fill the form and save to add an observation characteristic question`}
          </DialogContentText>
          <QuestionForm
            postQuestion={setQuestion}
            characteristic={characteristic}
            ontology={ontology}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleSave(question)} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

DetailsCreation.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSave: PropTypes.func,
  characteristic: PropTypes.string,
  ontology: PropTypes.string
};
