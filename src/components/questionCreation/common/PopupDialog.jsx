import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const PopupDialog = props => {
  return (
    <Dialog open={props.open}>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        {props.onDone && (
          <Button onClick={props.onDone} color="primary">
            Done
          </Button>
        )}
        <Button onClick={props.onCancel} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupDialog;

PopupDialog.propTypes = {
  onCancel: PropTypes.func,
  open: PropTypes.bool,
  onDone: PropTypes.func,
  children: PropTypes.node.isRequired
};
