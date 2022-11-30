import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const ConfirmYesNo = props => {
  return (
    <Dialog open={props.open}>
      <DialogContent>{props.text}</DialogContent>
      <DialogActions>
        {props.onYes && (
          <Button onClick={props.onYes} color="primary">
            {props.yesText}
          </Button>
        )}
        <Button onClick={props.onNo} color="secondary" autoFocus>
          {props.noText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmYesNo;

ConfirmYesNo.propTypes = {
  onYes: PropTypes.func,
  open: PropTypes.bool,
  onNo: PropTypes.func,
  text: PropTypes.string,
  yesText: PropTypes.string,
  noText: PropTypes.string
};
