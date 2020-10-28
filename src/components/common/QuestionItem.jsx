import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles(theme => ({
  listItem0: {
    direction: 'column',
    width: 400,
    borderBottom: '1px solid #E3E0D8',
    // paddingTop: theme.spacing(0),
    // paddingBottom: theme.spacing(0),
    padding: theme.spacing(0),
  },
  listItem1: {
    direction: 'column',
    width: 400,
    borderBottom: '1px solid #E3E0D8',
    // paddingTop: theme.spacing(0),
    // paddingBottom: theme.spacing(0),
    marginLeft: theme.spacing(2),
    padding: theme.spacing(0),
  },
  listItem2: {
    direction: 'column',
    width: 400,
    borderBottom: '1px solid #E3E0D8',
    // paddingTop: theme.spacing(0),
    // paddingBottom: theme.spacing(0),
    padding: theme.spacing(0),
    marginLeft: theme.spacing(4),
  },
  listItemText: { witdh: '-webkit-fill-available' },
  nestedListItemText: {
    paddingLeft: theme.spacing(8),
  },
  listItemHeader: {
    fontSize: '1.2rem',
  },
  listItemIcon: {
    padding: theme.spacing(0.5),
  },
}));

export default function QuestionItem(props) {
  const classes = useStyles();
  const {
    handleEdit,
    handleDelete,
    question,
    index,
    level,
    handleAnswerLink,
    handleQuestionLink,
    linkTextMap,
    linkedIdMap,
  } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListItem className={classes[`listItem${level}`]}>
        <IconButton
          onClick={() => setOpen(!open)}
          className={classes.listItemIcon}
        >
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <ListItemText
          primary={
            <>
              <Typography className={classes.listItemHeader}>
                {question.question}
              </Typography>
            </>
          }
          className={classes.listItemText}
        />
        <IconButton
          onClick={() => handleEdit()}
          className={classes.listItemIcon}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleDelete()}
          className={classes.listItemIcon}
        >
          <Delete />
        </IconButton>
        {linkedIdMap.linkedAnswer && (
          <IconButton
            onClick={() => handleQuestionLink(false, question)}
            className={classes.listItemIcon}
          >
            <InsertLinkIcon />
          </IconButton>
        )}
      </ListItem>
      {question.selectedTerms && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div">
            {Object.values(question.selectedTerms).map((term, i) => {
              return (
                <ListItem
                  className={classes.listItem}
                  key={`${term.allowedTerm.codeMeaning}-${i}`}
                >
                  <ListItemText primary={term.allowedTerm.codeMeaning} />
                  {!linkedIdMap.linkedAnswer && (
                    <IconButton
                      onClick={() =>
                        handleAnswerLink(
                          false,
                          term,
                          question.id,
                          index,
                          question.question
                        )
                      }
                    >
                      <InsertLinkIcon />
                    </IconButton>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}

QuestionItem.propTypes = {
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  question: PropTypes.object,
  index: PropTypes.number,
  level: PropTypes.number,
  handleAnswerLink: PropTypes.func,
  handleQuestionLink: PropTypes.func,
  linkTextMap: PropTypes.object,
  linkedIdMap: PropTypes.object,
};
