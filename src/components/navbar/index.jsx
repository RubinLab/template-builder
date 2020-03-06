import React from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import AddCircle from '@material-ui/icons/AddCircle';
import GetApp from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    background: '#8c1717',
  },
  button: {
    color: '#E3E0D8',
    marginLeft: '10px',
    '&:hover': {
      color: 'white',
      border: '1px solid #E3E0D8',
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Template Builder
          </Typography>
          <Button
            className={classes.button}
            variant="outlined"
            startIcon={<AddCircle />}
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
        </Toolbar>
      </AppBar>
    </div>
  );
}
