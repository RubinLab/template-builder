import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import AddCircle from '@material-ui/icons/AddCircle';
import GetApp from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    background: '#8c1717',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(3)
    },
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(25),
      paddingLeft: theme.spacing(25)
    }
  },
  button: {
    color: '#E3E0D8',
    marginLeft: theme.spacing(2),
    '&:hover': {
      color: 'white',
      border: '1px solid #E3E0D8'
    }
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold'
  }
}));

export default function Navbar(props) {
  const classes = useStyles();
  const {
    handleAddQuestion,
    handleDownload,
    handleUpload,
    downloading
  } = props;

  return (
    <AppBar position="static" className={classes.root}>
      <div>
        <Typography variant="h5" className={classes.title}>
          Template Builder
        </Typography>
      </div>
      <div className={classes.buttonGroup}>
        <Button
          className={classes.button}
          id="addQuestionBtn"
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
          onClick={handleDownload}
          disabled={downloading}
        >
          Download
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          startIcon={<PublishIcon />}
          onClick={handleUpload}
        >
          Upload Template
        </Button>
      </div>
    </AppBar>
  );
}

Navbar.propTypes = {
  handleAddQuestion: PropTypes.func,
  handleDownload: PropTypes.func,
  handleUpload: PropTypes.func,
  downloading: PropTypes.bool
};
