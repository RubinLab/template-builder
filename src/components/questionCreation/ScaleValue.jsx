import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  accordionRoot: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
    // color: 'green'
    // flexGrow: 1
  },
  attributes: {
    color: '#3f51b5'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
    // flexDirection: 'column'
  },
  searchInput: {
    width: 400,
    marginTop: theme.spacing(1.5)
  },
  entryInput: {
    width: 300,
    marginTop: theme.spacing(1.5)
  },
  searchButton: {
    width: 'fit-content',
    background: '#E3E0D8',
    height: 'fit-content',
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    '&:hover': {
      background: '#CCBC8E'
    }
  },
  textField: {
    marginTop: theme.spacing(1),
    minWidth: 300,
    width: 400
  },
  searchLink: {
    marginTop: theme.spacing(1),
    // color: '#f50057',
    fontSize: theme.typography.pxToRem(15),
    textAlign: 'inherit'
  },
  linkWrap: {
    marginTop: theme.spacing(2)
    // background: '#E3E0D8'
  },
  epadTitle: {
    color: '#3f51b5',
    fontWeight: '500'
  },
  explanation: {
    marginTop: theme.spacing(2)
  },
  wrap: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const ScaleValue = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [valueLabel, setLabel] = React.useState('');
  const [valueDescription, setDescription] = React.useState('');

  const saveValue = () => {
    props.saveValue(value, valueLabel, valueDescription);
    setValue('');
    setLabel('');
    setDescription('');
  };
  return (
    <Dialog open={true}>
      <DialogContent>
        <div className={classes.root}>
          <div className={classes.inputGroup}>
            <TextField
              onChange={e => setValue(e.target.value)}
              className={classes.searchInput}
              placeholder="Value"
            />
            <TextField
              onChange={e => setLabel(e.target.value)}
              className={classes.searchInput}
              placeholder="Value label"
            />
            <TextField
              onChange={e => setDescription(e.target.value)}
              className={classes.searchInput}
              placeholder="Value description"
            />
          </div>
          <IconButton className={classes.searchButton} onClick={saveValue}>
            Next
          </IconButton>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={props.handleClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScaleValue;

ScaleValue.propTypes = {
  saveValue: PropTypes.func,
  handleClose: PropTypes.func
};
