import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LinearScale from '@material-ui/icons/LinearScale';
import Delete from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  listItem: {
    direction: 'column',
    width: 'fit-content',
    borderBottom: '1px solid #E3E0D8',
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
    // [theme.breakpoints.down('sm')]: {
    //   width: 300,
    // },
  },
  listItemTerm: {
    witdh: '-webkit-fill-available',
    fontSize: '1.2rem',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
  },
  ontologyTitle: {
    witdh: '-webkit-fill-available',
    fontSize: '0.9rem',
    margin: '0rem 1rem 0rem 1rem',
    color: '#8c1717'
  },
  listItemIcon: {
    padding: theme.spacing(0.5)
  },
  // itemTextGrp: {
  //   marginTop: theme.spacing(0.5),
  //   marginBottom: theme.spacing(0.5)
  // }
  list: {
    maxHeight: '20rem',
    height: 'fit-content',
    overflow: 'auto'
  }
}));

export default function AnswersList(props) {
  const classes = useStyles();
  const { handleDelete, handleAddCalculation, answers } = props;

  return (
    <List className={classes.list}>
      {answers.map((el, i) => {
        const title =
          typeof el.title === 'string'
            ? el.title
            : `(${el.title.acronym} - ${el.title.name})`;
        return (
          <ListItem
            className={classes.listItem}
            key={`${el.allowedTerm.codeMeaning}-${i}`}
          >
            <div className={classes.itemTextGrp}>
              <span className={classes.listItemTerm}>
                {el.allowedTerm.codeMeaning}
              </span>
              <span className={classes.ontologyTitle}>{title}</span>
            </div>
            <IconButton
              onClick={() => handleAddCalculation(i)}
              className={classes.listItemIcon}
            >
              <LinearScale />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(el)}
              className={classes.listItemIcon}
            >
              <Delete />
            </IconButton>
          </ListItem>
        );
      })}
    </List>
  );
}

AnswersList.propTypes = {
  handleDelete: PropTypes.func,
  handleAddCalculation: PropTypes.func,
  chracteristic: PropTypes.bool,
  answers: PropTypes.array
};
