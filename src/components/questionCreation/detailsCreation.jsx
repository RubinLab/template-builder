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

const materialUseStyles = makeStyles(theme => ({
  root: { direction: 'row', marginLeft: theme.spacing(1) },
  checkbox: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
}));

export default function DetailsCreation(props) {
  const { open, handleClose, handleSave } = props;
  const classes = materialUseStyles();
  const [question, setQuestion] = useState({});
  console.log(question);

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
        <DialogTitle id="createQuestion-title">Create Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Fill the form and save to add a details to the question`}
          </DialogContentText>
          <Form postQuestion={setQuestion} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="secondary">
            Close
          </Button>
          <Button onClick={() => handleSave(question)} color="primary">
            Save Details
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
};
