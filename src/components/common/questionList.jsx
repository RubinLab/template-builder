import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Remove from '@material-ui/icons/Remove';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

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
  nestedListItemText: {
    paddingLeft: theme.spacing(8),
  },
}));

export default function QuestionsList(props) {
  const classes = useStyles();
  const { handleDelete, handleEdit, handleLink } = props;
  const [questions, setQuestions] = useState([...props.questions]);
  const [open, setOpen] = useState([]);
  const handleQuestionClick = index => {
    const newOpen = [...open];
    newOpen[index] = !open[index];
    setOpen(newOpen);
  };
  useEffect(() => {
    const newList = [...questions];
    const newLength = props.questions.length;
    const diff = newLength - questions.length;
    if (diff > 0) {
      for (let i = 1; i <= diff; i += 1) {
        newList.push({ ...props.questions[newLength - i] });
      }
      setQuestions(newList);
    }
  }, [props.questions, questions]);

  const handleReorder = ({ oldIndex, newIndex }) => {
    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    setQuestions(newQuestions);
  };

  const SortableItem = SortableElement(({ el, sortIndex }) => {
    const selectedTerms = el.selectedTerms ? Object.keys(el.selectedTerms) : [];
    return (
      <>
        <ListItem className={classes.listItem}>
          <IconButton onClick={() => handleQuestionClick(sortIndex)}>
            {open[sortIndex] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <ListItemText
            primary={el.question}
            className={classes.listItemText}
          />
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
        <Collapse in={open[sortIndex]} timeout="auto" unmountOnExit>
          <List component="div">
            {selectedTerms.map((term, i) => {
              return (
                <ListItem className={classes.listItem} key={`${term}-${i}`}>
                  <Remove className={classes.nestedListItemText} />
                  <ListItemText primary={term} />
                  <IconButton onClick={() => handleLink(term)}>
                    <InsertLinkIcon />
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
        {/* <Divider /> */}
      </>
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

  return (
    <SortableList
      questionsArr={questions}
      onSortEnd={handleReorder}
      //   pressDelay={100}
      distance={2}
    />
  );
}

QuestionsList.propTypes = {
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  questions: PropTypes.array,
  handleLink: PropTypes.func,
};
