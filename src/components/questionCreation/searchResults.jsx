import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { getTitle } from '../../services/apiServices';

const useStyles = makeStyles(theme => ({
  listItemTitle: {
    paddingLeft: theme.spacing(2),
    color: 'blue',
    fontSize: '16px',
  },
  listItemUrl: {
    paddingLeft: theme.spacing(2),
    color: 'gray',
    fontSize: '12px',
  },
}));

export default function SearchResults(props) {
  const classes = useStyles();
  const { handleClose, open, results, handleSelection, term } = props;
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState({ 1: [] });
  const [listItems, setListItems] = useState([]);
  const resultList = results.collection || [];
  const pageSize = 25;
  const totalNoOfPage = resultList.length / pageSize;

  const populateList = (titlesObj, pageNo) => {
    const nodeList = [];
    for (let k = 0; k < titlesObj[pageNo].length; k += 1) {
      let linkTitle = `Result for ${term}`;
      if (titlesObj[pageNo][k].title) {
        const pipeIndex = titlesObj[pageNo][k].title.indexOf('|');
        linkTitle = titlesObj[pageNo][k].title.substring(0, pipeIndex).trim();
      }

      nodeList.push(
        <ListItem
          // button
          onClick={() => {
            handleSelection(k);
            window.open(titlesObj[pageNo][k].url, '_blank', '');
          }}
          key={`${titlesObj[pageNo][k].url}-${k}`}
          className={classes.listItemContainer}
        >
          <ListItemText
            primary={
              <>
                <Typography className={classes.listItemTitle} component="span">
                  {linkTitle}
                </Typography>
              </>
            }
          />
        </ListItem>
      );
    }
    setListItems(nodeList);
  };

  const handleGetTitle = pageNo => {
    const promises = [];
    const index = (pageNo - 1) * pageSize;
    const limit = index + pageSize;
    for (let i = index; i < limit; i += 1) {
      promises.push(getTitle(resultList[i].links.ui));
    }
    Promise.all(promises)
      .then(res => {
        const currentTitle = { ...title };
        currentTitle[pageNo] = res;
        setTitle(currentTitle);
        populateList(currentTitle, pageNo);
      })
      .catch(err => console.log(err));
  };

  const handleChange = (e, pageChanged) => {
    setPage(pageChanged);
    if (!title[pageChanged]) {
      handleGetTitle(pageChanged);
    }
  };

  useEffect(() => {
    handleGetTitle(page);
  }, [page]);

  return (
    <Dialog onClose={handleClose} open={open} onClick={handleSelection}>
      <DialogTitle id="simple-dialog-title">{`${resultList.length} results for ${term}`}</DialogTitle>
      <List>{listItems}</List>
      {resultList.length > 0 && (
        <>
          <Pagination
            count={totalNoOfPage}
            page={page}
            onChange={handleChange}
          />
        </>
      )}
    </Dialog>
  );
}

SearchResults.propTypes = {
  handleClose: PropTypes.func,
  handleSelection: PropTypes.func,
  open: PropTypes.bool,
  results: PropTypes.object,
  term: PropTypes.string,
};
