import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as questionaire from '../../utils/parseClass';
import recist from '../../utils/recist.json';

const materialUseStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    width: 'fit-content',
    color: 'black',
    borderLeft: '3px solid #8c1717',
  },
  title: {
    margin: theme.spacing(4),
    color: '#8c1717',
  },
  questionaire: {
    margin: theme.spacing(4),
    padding: theme.spacing(6),
    // paddingLeft:
    border: '1px solid #8c1717',
    width: 400,
    background: '#E3E0D8',
  },
}));

export default function TemplatePreview(props) {
  const [buttonGroupShow, setButtonGroupShow] = useState(false);
  const validateForm = hasError => {
    if (hasError) console.log('Answer form has error/s!!!');
  };

  const renderButtons = buttonsState => {
    setButtonGroupShow(buttonsState);
  };

  useEffect(() => {
    let element = document.getElementById('questionaire');
    if (props.noOfQuestions > 1) {
      element.remove();
      element = document.createElement('div');
      element.id = 'questionaire';
      element.style = 'color: black;';
      const component = document.getElementById('templatePreview');
      component.appendChild(element);
    }
    const semanticAnswers = new questionaire.AimEditor(
      element,
      validateForm,
      renderButtons,
    );
    semanticAnswers.loadTemplates([props.template, recist]);
    semanticAnswers.createViewerWindow();
  });

  const classes = materialUseStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Template Preview
      </Typography>
      <div className={classes.questionaire} id="templatePreview">
        <div id="questionaire" />
      </div>
    </div>
  );
}

TemplatePreview.propTypes = {
  template: PropTypes.object,
  noOfQuestions: PropTypes.number,
};
