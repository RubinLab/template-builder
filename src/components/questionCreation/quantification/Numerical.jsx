import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

const Numerical = props => {
  const [formInput, setFormInput] = useState({
    value: '',
    valueLabel: '',
    valueDescription: '',
    ucumString: '',
    operator: '',
    defaultAnswer: false,
    noMoreQuestions: false,
    askForInput: false
  });
  const [submitted, setSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const saveCalculation = () => {
    if (!formInput.value || !formInput.ucumString) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.postFormInput(formInput, 'Numerical');
      setSubmitted(false);
      setFormInput({
        value: '',
        valueLabel: '',
        valueDescription: '',
        ucumString: '',
        operator: '',
        defaultAnswer: false,
        noMoreQuestions: false,
        askForInput: false
      });
    }
  };

  const handleFormInput = e => {
    e.preventDefault();
    const { name, value } = e.target;
    const newFormInput = { ...formInput, [name]: value };
    setFormInput(newFormInput);
  };

  const handleFormCheckbox = e => {
    const { checked, value, name } = e.target;
    const newFormInput = { ...formInput, [name]: checked };
    setFormInput(newFormInput);
  };

  return (
    <FormControl>
      <TextField
        // className={classes.textField}
        label="Value"
        value={formInput.value}
        name="value"
        onChange={handleFormInput}
        required
        error={!formInput.value && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Value label"
        value={formInput.valueLabel}
        name="valueLabel"
        onChange={handleFormInput}
      />
      <TextField
        // className={classes.textField}
        label="Value description"
        value={formInput.valueDescription}
        name="valueDescription"
        onChange={handleFormInput}
      />
      <TextField
        // className={classes.textField}
        label="UcumString"
        value={formInput.ucumString}
        name="ucumString"
        onChange={handleFormInput}
        required
        error={!formInput.ucumString && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Operator"
        value={formInput.operator}
        name="operator"
        onChange={handleFormInput}
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={formInput.defaultAnswer}
            name="defaultAnswer"
            onChange={handleFormCheckbox}
          />
        }
        label="Default Answer"
        labelPlacement="end"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            onChange={handleFormCheckbox}
            checked={formInput.noMoreQuestions}
            name="noMoreQuestions"
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

export default Numerical;

Numerical.propTypes = {
  postFormInput: PropTypes.func
};
