import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
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
    // [theme.breakpoints.down('sm')]: {
    //   width: 300,
    // },
  },
  listItemTerm: { witdh: '-webkit-fill-available', fontSize: '1.2rem' },
  ontologyTitle: {
    witdh: '-webkit-fill-available',
    fontSize: '0.9rem',
    margin: '0rem 1rem 0rem 1rem',
    color: '#8c1717',
  },
  listItemIcon: {
    padding: theme.spacing(0.5),
  },
}));

export default function AnswersList(props) {
  const classes = useStyles();
  const { handleDelete, answers } = props;

  return (
    <List>
      {answers.map((el, i) => (
        <ListItem
          className={classes.listItem}
          key={`${el.allowedTerm.codeMeaning}-${i}`}
        >
          <div className={classes.itemTextGrp}>
            <p>
              <span className={classes.listItemTerm}>
                {el.allowedTerm.codeMeaning}
              </span>
              <span className={classes.ontologyTitle}>
                {`(${el.title.acronym} - ${el.title.name})`}
              </span>
            </p>
          </div>
          <IconButton
            onClick={() => handleDelete(el)}
            className={classes.listItemIcon}
          >
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

AnswersList.propTypes = {
  handleDelete: PropTypes.func,
  answers: PropTypes.array,
};
