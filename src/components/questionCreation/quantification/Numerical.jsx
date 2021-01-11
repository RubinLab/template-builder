import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

const Numerical = props => {
  const [formInput, setFormInput] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const saveCalculation = () => {
    if (!formInput.value || !formInput.ucumString) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.postFormInput(newFormInput, 'Numerical');
      setSubmitted(false);
      setFormInput({});
    }
  };

  const handleFormInput = e => {
    console.log(e.target);
    const { name, value } = e.target;
    const newFormInput = { ...formInput, [name]: value };
    setFormInput(newFormInput);
  };

  return (
    <FormControl>
      <TextField
        // className={classes.textField}
        label="Value"
        name="value"
        onChange={handleFormInput}
        required
        error={!formInput.value && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Value label"
        name="valueLabel"
        onChange={handleFormInput}
      />
      <TextField
        // className={classes.textField}
        label="Value description"
        name="valueDescription"
        onChange={handleFormInput}
      />
      <TextField
        // className={classes.textField}
        label="UcumString"
        name="ucumString"
        onChange={handleFormInput}
        required
        error={!formInput.ucumString && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Operator"
        name="operator"
        onChange={handleFormInput}
      />
      <FormControlLabel
        value="defaultAnswer"
        control={<Checkbox color="primary" />}
        label="Default Answer"
        labelPlacement="end"
        onChange={e => {
          console.log(e.target.value);
          console.log(e.target.checked);
        }}
      />
      <FormControlLabel
        value="noMoreQuestions"
        control={<Checkbox color="primary" />}
        label="No more questions"
        labelPlacement="end"
        onChange={e => {
          console.log(e.target.value);
          console.log(e.target.checked);
        }}
      />
      <FormControlLabel
        name="askForInput"
        control={<Checkbox color="primary" />}
        label="Ask For Input"
        labelPlacement="end"
        onChange={e => {
          console.log(e.target.value);
          console.log(e.target.checked);
        }}
      />
      <Button onClick={saveCalculation}>{'Save & Next'}</Button>
    </FormControl>
  );
};

export default Numerical;

Numerical.propTypes = {
  postFormInput: PropTypes.func
};
