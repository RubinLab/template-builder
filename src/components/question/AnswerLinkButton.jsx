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
    alignItems: 'center'
  },
  contentText: {
    paddingRight: theme.spacing(3)
  },
  listItemIcon: {
    padding: theme.spacing(0.5)
  },
  disabledLink: {
    color: '#a70432'
  },
  answerIcon: {
    padding: theme.spacing(0.3)
  }
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
  charIndex,
  scaleIndex
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
  let answerID = `${questionIndex}-${answerIndex}-${term.codeValue}`;
  answerID = charIndex ? `${answerID}/${charIndex}` : answerID;
  answerID = scaleIndex ? `${answerID}/${scaleIndex}` : answerID;
  if (linkTextMap && linkTextMap[answerID] && !linkedIdMap.linkedAnswer) {
    answerLink = (
      <IconButton onMouseEnter={handleOpen} className={classes.answerIcon}>
        <LinkOff
          id={`disableLink-${answerIndex}`}
          className={classes.disabledLink}
        />
        <Menu
          id={`disableLink-${answerIndex}`}
          open={showInfo}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <div className={classes.popupContent}>
            <div
              className={classes.contentText}
            >{`Next: ${linkTextMap[answerID]}`}</div>
            <IconButton
              className={classes.listItemIcon}
              onClick={handleDeleteLink}
            >
              <DeleteForever />
            </IconButton>
          </div>
        </Menu>
      </IconButton>
    );
  }

  if (!linkedIdMap.linkedAnswer && !linkTextMap[answerID]) {
    answerLink = (
      <IconButton
        className={classes.answerIcon}
        onClick={() =>
          handleAnswerLink(
            false,
            term,
            question.id,
            answerIndex,
            questionIndex,
            question.label,
            charIndex
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
  charIndex: PropTypes.number,
  answerIndex: PropTypes.number,
  question: PropTypes.object,
  term: PropTypes.object,
  handleDeleteLink: PropTypes.func,
  scaleIndex: PropTypes.number
};
