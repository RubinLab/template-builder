import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import * as questionaire from '../../utils/parseClass';
import recist from '../../utils/recist.json';

const materialUseStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    width: 'fit-content'
    // color: 'black',
    // borderLeft: '3px solid #8c1717',
    // paddingLeft: theme.spacing(10),
  },
  title: {
    margin: theme.spacing(3),
    color: '#8c1717'
  },
  questionaire: {
    margin: theme.spacing(4),
    padding: theme.spacing(6),
    border: '1px solid #8c1717',
    width: '-webkit-fill-available',
    minWidth: 300,
    background: '#E3E0D8',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(3),
      padding: theme.spacing(3)
    }
  }
}));

export default function TemplatePreview(props) {
  const [buttonGroupShow, setButtonGroupShow] = useState(false);
  const validateForm = hasError => {
    if (hasError) console.log('Answer form has error/s!!!');
  };

  const renderButtons = buttonsState => {
    setButtonGroupShow(buttonsState);
    console.log(buttonGroupShow);
  };

  useEffect(() => {
    const element = document.getElementById('questionaire');
    const semanticAnswers = new questionaire.AimEditor(
      element,
      validateForm,
      renderButtons
    );
    semanticAnswers.loadTemplates([props.template, recist]);
    semanticAnswers.showTemplatePreview();
  });

  const classes = materialUseStyles();
  return (
    // <div className={classes.root}>
    <div className={classes.questionaire} id="templatePreview">
      <div id="questionaire" />
    </div>
    // </div>ş
  );
}

TemplatePreview.propTypes = {
  template: PropTypes.object,
  noOfQuestions: PropTypes.number
};
