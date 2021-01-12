import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

const Interval = props => {
  const [formInput, setFormInput] = useState({
    minValue: '',
    maxValue: '',
    ucumString: '',
    minOperator: '',
    maxOperator: '',
    valueLabel: '',
    valueDescription: '',
    defaultAnswer: false,
    noMoreQuestions: false,
    askForInput: false
  });
  const [submitted, setSubmitted] = useState(false);

  const {
    minValue,
    maxValue,
    minOperator,
    maxOperator,
    ucumString
  } = formInput;
  const { enqueueSnackbar } = useSnackbar();

  const saveCalculation = () => {
    if (!minValue || !maxValue || !minOperator || !maxOperator || !ucumString) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.postFormInput(formInput, 'Interval');
      setSubmitted(false);
      setFormInput({
        minValue: '',
        maxValue: '',
        ucumString: '',
        minOperator: '',
        maxOperator: '',
        valueLabel: '',
        valueDescription: '',
        defaultAnswer: false,
        noMoreQuestions: false,
        askForInput: false
      });
    }
  };

  const handleFormInput = e => {
    e.preventDefault();
    console.log(e.target);
    const { name, value } = e.target;
    const newFormInput = { ...formInput, [name]: value };
    setFormInput(newFormInput);
  };

  const handleFormCheckbox = e => {
    const { checked, name } = e.target;
    const newFormInput = { ...formInput, [name]: checked };
    setFormInput(newFormInput);
  };

  return (
    <FormControl>
      <TextField
        // className={classes.textField}
        label="Minimum Value"
        name="minValue"
        value={formInput.minValue}
        onChange={handleFormInput}
        required
        error={!formInput.minValue && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Maximum Value"
        name="maxValue"
        value={formInput.maxValue}
        onChange={handleFormInput}
        required
        error={!formInput.maxValue && submitted}
      />
      <TextField
        // className={classes.textField}
        label="UcumString"
        name="ucumString"
        value={formInput.ucumString}
        onChange={handleFormInput}
        required
        error={!formInput.ucumString && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Minimum Operator"
        name="minOperator"
        value={formInput.minOperator}
        onChange={handleFormInput}
        required
        error={!formInput.minOperator && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Maximum Operator"
        name="maxOperator"
        value={formInput.maxOperator}
        onChange={handleFormInput}
        required
        error={!formInput.maxOperator && submitted}
      />

      <TextField
        // className={classes.textField}
        label="Value label"
        name="valueLabel"
        value={formInput.valueLabel}
        onChange={handleFormInput}
      />
      <TextField
        // className={classes.textField}
        label="Value description"
        name="valueDescription"
        value={formInput.valueDescription}
        onChange={handleFormInput}
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            onChange={handleFormCheckbox}
            checked={formInput.defaultAnswer}
            name="defaultAnswer"
          />
        }
        label="Default Answer"
        labelPlacement="end"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            name="noMoreQuestions"
            checked={formInput.noMoreQuestions}
            onChange={handleFormCheckbox}
          />
        }
        label="No more questions"
        labelPlacement="end"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            name="askForInput"
            checked={formInput.askForInput}
            onChange={handleFormCheckbox}
          />
        }
        label="Ask For Input"
        labelPlacement="end"
      />
      <Button onClick={saveCalculation}>{'Save & Next'}</Button>
    </FormControl>
  );
};

export default Interval;

Interval.propTypes = {
  postFormInput: PropTypes.func
};
