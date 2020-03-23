import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CheckBox from '@material-ui/icons/CheckBox';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import LinearScale from '@material-ui/icons/LinearScale';
import ShortText from '@material-ui/icons/ShortText';
import Delete from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  listItem: {
    direction: 'column',
    width: 400,
    borderBottom: '1px solid #E3E0D8',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
  },
  listItemText: { margin: theme.spacing(1), witdh: '-webkit-fill-available' },
}));

export default function AnswersList(props) {
  const classes = useStyles();
  const { handleDelete, answerType, answers } = props;
  let answerTypeIcon;
  switch (answerType) {
    case 'single':
      answerTypeIcon = <RadioButtonChecked />;
      break;
    case 'multi':
      answerTypeIcon = <CheckBox />;
      break;
    case 'scale':
      answerTypeIcon = <LinearScale />;
      break;
    case 'text':
      answerTypeIcon = <ShortText />;
      break;
    default:
      answerTypeIcon = null;
  }
  return (
    <List>
      {answers.map((el, i) => (
        <ListItem className={classes.listItem} key={`${el}-${i}`}>
          {answerTypeIcon}
          <ListItemText primary={el} className={classes.listItemText} />
          <IconButton onClick={() => handleDelete(el)}>
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

AnswersList.propTypes = {
  answerType: PropTypes.string,
  handleDelete: PropTypes.func,
  answers: PropTypes.array,
};
