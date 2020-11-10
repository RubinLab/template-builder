import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LinkOff from '@material-ui/icons/LinkOff';
import IconButton from '@material-ui/core/IconButton';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles(theme => ({
  popupContent: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentText: {
    paddingRight: theme.spacing(3),
  },
  listItemIcon: {
    padding: theme.spacing(0.5),
  },
}));

export default function AnswerLinkButton({
  linkTextMap,
  linkedIdMap,
  questionIndex,
  handleAnswerLink,
  answerIndex,
  term,
  question,
  handleDeleteLink,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const showInfo = Boolean(anchorEl);
  let answerLink = null;
  if (linkTextMap[term.id]) {
    answerLink = (
      <>
        <LinkOff id={`disableLink-${answerIndex}`} onMouseEnter={handleOpen} />
        <Menu
          id={`disableLink-${answerIndex}`}
          open={showInfo}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <div className={classes.popupContent}>
            <div className={classes.contentText}>{`Next: ${
              linkTextMap[term.id]
            }`}</div>
            <IconButton
              className={classes.listItemIcon}
              onClick={handleDeleteLink}
            >
              <DeleteForever />
            </IconButton>
          </div>
        </Menu>
      </>
    );
  }

  if (!linkedIdMap.linkedAnswer && !linkTextMap[term.id]) {
    answerLink = (
      <IconButton
        onClick={() =>
          handleAnswerLink(
            false,
            term,
            question.id,
            questionIndex,
            question.question
          )
        }
      >
        <InsertLinkIcon />
      </IconButton>
    );
  }
  return <>{answerLink}</>;
}

AnswerLinkButton.propTypes = {
  handleAnswerLink: PropTypes.func,
  linkTextMap: PropTypes.object,
  linkedIdMap: PropTypes.object,
  questionIndex: PropTypes.number,
  answerIndex: PropTypes.number,
  question: PropTypes.object,
  term: PropTypes.object,
  handleDeleteLink: PropTypes.func,
};
