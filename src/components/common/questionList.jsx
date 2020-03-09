import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const useStyles = makeStyles(theme => ({
  listItem: {
    direction: 'column',
    width: 400,
    borderBottom: '1px solid #E3E0D8',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  listItemText: { margin: theme.spacing(1), witdh: '-webkit-fill-available' },
}));

export default function QuestionsList(props) {
  const classes = useStyles();
  const { handleDelete, handleEdit, handleLink } = props;
  const [questions, setQuestions] = useState([...props.questions]);

  useEffect(() => {
    let newQuestion;
    if (props.questions.length > questions.length) {
      newQuestion = props.questions.pop();
      const newList = [...questions];
      newList.push(newQuestion);
      setQuestions(newList);
    }
  }, [props.questions, questions]);

  const handleReorder = ({ oldIndex, newIndex }) => {
    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    setQuestions(newQuestions);
  };

  const SortableItem = SortableElement(({ el }) => {
    return (
      <ListItem className={classes.listItem}>
        <ListItemText primary={el.question} className={classes.listItemText} />
        <IconButton onClick={() => handleEdit(el)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(el)}>
          <Delete />
        </IconButton>
        <IconButton onClick={() => handleLink(el)}>
          <InsertLinkIcon />
        </IconButton>
      </ListItem>
    );
  });

  const SortableList = SortableContainer(({ questionsArr }) => {
    return (
      <List>
        {questionsArr.map((el, i) => {
          return (
            <SortableItem
              key={`question-${i}`}
              index={i}
              sortIndex={i}
              el={el}
            />
          );
        })}
      </List>
    );
  });

  return <SortableList questionsArr={questions} onSortEnd={handleReorder} />;
}

QuestionsList.propTypes = {
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  questions: PropTypes.array,
  handleLink: PropTypes.func,
};
