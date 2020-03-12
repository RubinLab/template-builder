import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import AddCircle from '@material-ui/icons/AddCircle';
import GetApp from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    background: '#8c1717',
  },
  button: {
    color: '#E3E0D8',
    marginLeft: theme.spacing(3),
    '&:hover': {
      color: 'white',
      border: '1px solid #E3E0D8',
    },
  },
  buttonGroup: {
    marginRight: theme.spacing(6),
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    marginLeft: theme.spacing(4),
  },
}));

export default function Navbar(props) {
  const classes = useStyles();
  const { handleAddQuestion } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Template Builder
          </Typography>
          <div className={classes.buttonGroup}>
            <Button
              className={classes.button}
              variant="outlined"
              startIcon={<AddCircle />}
              onClick={() => handleAddQuestion(true)}
            >
              Add Question
            </Button>
            <Button
              className={classes.button}
              variant="outlined"
              startIcon={<GetApp />}
            >
              Download
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

Navbar.propTypes = {
  handleAddQuestion: PropTypes.func,
};
