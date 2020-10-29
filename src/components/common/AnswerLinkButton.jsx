import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LinkOff from '@material-ui/icons/LinkOff';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import IconButton from '@material-ui/core/IconButton';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import DeleteForever from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles(theme => ({
  popup: {
    background: '#E3E0D8',
    padding: theme.spacing(0.5),
  },
  popupContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentText: {
    paddingRight: theme.spacing(3),
  },
}));

export default function AnswerLinkButton({
  linkTextMap,
  linkedIdMap,
  index,
  handleAnswerLink,
  i,
  term,
  question,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const showInfo = Boolean(anchorEl);
  let answerLink = null;
  if (linkTextMap[term.id]) {
    answerLink = (
      <>
        <LinkOff
          id={`disableLink-${i}`}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
        <Popper
          id={`disableLink-${i}`}
          open={showInfo}
          anchorEl={anchorEl}
          transition
          className={classes.popup}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <div className={classes.popupContent}>
                <div className={classes.contentText}>
                  {linkTextMap[term.id]}
                </div>
                <DeleteForever />
              </div>
            </Fade>
          )}
        </Popper>
      </>
    );
  }

  if (!linkedIdMap.linkedAnswer && !linkTextMap[term.id]) {
    answerLink = (
      <IconButton
        onClick={() =>
          handleAnswerLink(false, term, question.id, index, question.question)
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
  index: PropTypes.number,
  i: PropTypes.number,
  question: PropTypes.object,
  term: PropTypes.object,
};
