import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  group: {
    padding: theme.spacing(0),
    borderBottom: '1px solid #E3E0D8'
  },
  line: {
    padding: theme.spacing(0),
    marginBottom: theme.spacing(0)
  }
}));

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
export default function ErrorDisplay({ onOK, onDownload, open, errors }) {
  const classes = useStyles();
  const formErrorText = () => {
    const paragrafs = [];
    for (let k = 0; k < errors.length; k++) {
      const paramsKeys = Object.keys(errors[k].params);
      const paramsValues = Object.values(errors[k].params);
      const details = paramsKeys.map((el, i) => {
        const value = Array.isArray(paramsValues[i])
          ? paramsValues[i].join()
          : paramsValues[i];
        return (
          <Typography
            key={`params-${i}`}
            className={classes.line}
          >{`${el}:${value}`}</Typography>
        );
      });

      const err = (
        <Typography key={`err-${k}`}>
          <Typography className={classes.line} variant="h6">{`Error ${k +
            1}`}</Typography>
          <Typography
            className={classes.line}
          >{`path: ${errors[k].dataPath}`}</Typography>
          <Typography className={classes.line}>{errors[k].message}</Typography>
          {details}
        </Typography>
      );
      paragrafs.push(err);
    }
    return paragrafs;
  };

  return (
    <Dialog
      open={open}
      onClose={onDownload}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {/* <DialogTitle id="alert-dialog-title">  </DialogTitle> */}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {formErrorText()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDownload} color="secondary">
          Download anyway
        </Button>
        <Button onClick={onOK} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ErrorDisplay.propTypes = {
  onOK: PropTypes.func,
  onDownload: PropTypes.func,
  open: PropTypes.bool,
  errors: PropTypes.array
};
