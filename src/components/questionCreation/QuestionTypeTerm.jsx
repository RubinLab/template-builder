import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const materialUseStyles = makeStyles(theme => ({
  listItemIcon: {
    padding: theme.spacing(0.5)
  }
}));

export default function QuestionTypeTerm(props) {
  const classes = materialUseStyles();

  return (
    <div>
      <span>{props.term.codeMeaning}</span>
      <Tooltip title="Delete">
        <IconButton
          onClick={() => props.handleDelete()}
          className={classes.listItemIcon}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </div>
  );
}

QuestionTypeTerm.propTypes = {
  handleDelete: PropTypes.func,
  term: PropTypes.object
};
