import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

export default function SearchResults(props) {
  const { handleClose, open, results, handleSelection, term } = props;

  return (
    <Dialog onClose={handleClose} open={open} onClick={handleSelection}>
      <DialogTitle id="simple-dialog-title">{`Results for ${term}`}</DialogTitle>
      <List>
        {results.map((el, i) => (
          <ListItem
            button
            onClick={() => handleSelection(i)}
            key={`${el.id}-${i}`}
          >
            <ListItemText primary={el.id} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SearchResults.propTypes = {
  handleClose: PropTypes.func,
  handleSelection: PropTypes.func,
  open: PropTypes.bool,
  results: PropTypes.array,
  term: PropTypes.string,
};
