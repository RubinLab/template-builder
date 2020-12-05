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

const useStyles = makeStyles(theme => ({
  listHeader: {
    paddingLeft: theme.spacing(2)
  },
  listItemCheckbox: {
    padding: theme.spacing(0.5)
  },
  listItemTitle: {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    color: 'blue',
    fontSize: '14px',
    maxWidth: 380,
    textAlign: 'left'
  },
  listItemExplanation: {
    paddingLeft: theme.spacing(2),
    color: '#575656',
    fontSize: '10px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    maxWidth: 380
  },
  listItemTextContainer: {
    paddingLeft: theme.spacing(1),
    width: '100%'
  },
  listItemContainer: {
    '&:hover': {
      background: '#ededed'
    },
    paddingLeft: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column'
  }
}));

const SearchResults = props => {
  const classes = useStyles();
  const { results, handleSelection, term, handleNewPage } = props;
  const [page, setPage] = useState(1);
  const [listItems, setListItems] = useState([]);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const resultList = results.collection || [];
  const ontologyMap = JSON.parse(sessionStorage.getItem('ontologyMap'));

  const populateList = () => {
    const nodeList = [];
    for (let k = 0; k < results.collection.length; k += 1) {
      const acronym = results.collection[k].links.ontology.split('/').pop();
      const { definition } = results.collection[k];
      nodeList.push(
        <ListItem key={`result${k}`} className={classes.listItemContainer}>
          <div className={classes.listItemTextContainer}>
            <Checkbox
              size="small"
              className={classes.listItemCheckbox}
              onClick={() => handleSelection(k, ontologyMap[acronym])}
            />
            <Link
              component="button"
              variant="body2"
              className={classes.listItemTitle}
              onClick={() => {
                window.open(results.collection[k].links.ui, '_blank', '');
              }}
            >
              {`${results.collection[k].prefLabel} - ${ontologyMap[acronym].name} (${ontologyMap[acronym].acronym})`}
            </Link>
          </div>
          <ListItemText
            className={classes.listItemExplanation}
            secondary={
              <>
                <Typography component="span">
                  {definition ? `${definition[0].substring(0, 150)}...` : ''}
                </Typography>
              </>
            }
          />
        </ListItem>
      );
    }
    setListItems(nodeList);
    setShowBackdrop(false);
    const drawer = document.getElementById('drawer-header');
    drawer.scrollIntoView();
  };

  const handleChange = (e, pageChanged) => {
    setShowBackdrop(true);
    setPage(pageChanged);
    handleNewPage(pageChanged);
  };

  useEffect(() => {
    populateList();
  }, [results]);

  return (
    <>
      <Backdrop className={classes.backdrop} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography
        className={classes.listHeader}
        id="drawer-header"
        variant="h5"
        align="justify"
      >
        {`Results for "${term}"`}
      </Typography>
      <List>{listItems}</List>
      {resultList.length > 0 && (
        <>
          <Pagination
            count={results.pageCount}
            page={page}
            onChange={handleChange}
          />
        </>
      )}
    </>
  );
};

export default SearchResults;

SearchResults.propTypes = {
  handleClose: PropTypes.func,
  handleSelection: PropTypes.func,
  handleNewPage: PropTypes.func,
  results: PropTypes.object,
  term: PropTypes.string
};
