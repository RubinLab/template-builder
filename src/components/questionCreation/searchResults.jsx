import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { getTitle } from '../../services/apiServices';

const useStyles = makeStyles(theme => ({
  listHeader: {
    paddingLeft: theme.spacing(2),
  },
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
  listItemTextContainer: {
    flexDirection: 'row',
  },
  listItemContainer: {
    '&:hover': {
      background: '#ededed',
    },
  },
}));

export default function SearchResults(props) {
  const classes = useStyles();
  const { handleClose, results, handleSelection, term } = props;
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState({ 1: [] });
  const [listItems, setListItems] = useState([]);
  const [showBackdrop, setShowBackdrop] = useState(true);
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

      const idIndex = (page - 1) * pageSize + k;
      nodeList.push(
        <ListItem
          key={`${titlesObj[pageNo][k].url}-${k}`}
          className={classes.listItemContainer}
        >
          <Checkbox
            onClick={() => {
              window.setTimeout(() => {
                handleSelection(k);
              }, 250);
            }}
          />
          <div className={classes.listItemTextContainer}>
            <Link
              component="button"
              variant="body2"
              className={classes.listItemTitle}
              onClick={() => {
                window.open(titlesObj[pageNo][k].url, '_blank', '');
              }}
            >
              {linkTitle}
            </Link>
            <ListItemText
              secondary={
                <>
                  <Typography className={classes.listItemUrl} component="span">
                    {results.collection[idIndex]['@id']}
                  </Typography>
                </>
              }
            />
          </div>
        </ListItem>
      );
    }
    setListItems(nodeList);
  };

  const handleGetTitle = pageNo => {
    const promises = [];
    const index = (pageNo - 1) * pageSize;
    let limit = index + pageSize;
    limit = limit > resultList.length ? resultList.length : limit;
    for (let i = index; i < limit; i += 1) {
      promises.push(getTitle(resultList[i].links.ui));
    }
    Promise.all(promises)
      .then(res => {
        const currentTitle = { ...title };
        currentTitle[pageNo] = res;
        setTitle(currentTitle);
        populateList(currentTitle, pageNo);
        setShowBackdrop(false);
      })
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
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
    <>
      <Backdrop className={classes.backdrop} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography className={classes.listHeader} variant="h5" align="justify">
        {`Results for "${term}"`}
      </Typography>
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
    </>
  );
}

SearchResults.propTypes = {
  handleClose: PropTypes.func,
  handleSelection: PropTypes.func,
  results: PropTypes.object,
  term: PropTypes.string,
};
