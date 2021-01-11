import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

const Quantile = props => {
  const [formInput, setFormInput] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const saveCalculation = () => {
    if (!formInput.bins || !formInput.maxValue || !formInput.minValue) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.postFormInput(formInput, 'Quantile');
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
        label="Minimum Value"
        name="minValue"
        onChange={handleFormInput}
        required
        error={!formInput.minValue && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Maximum Value"
        name="maxValue"
        onChange={handleFormInput}
        required
        error={!formInput.maxValue && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Bins"
        name="bins"
        onChange={handleFormInput}
        required
        error={!formInput.bins && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Default Bin"
        name="defaultBin"
        onChange={handleFormInput}
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
      <Button onClick={saveCalculation}>{'Save & Next'}</Button>
    </FormControl>
  );
};

export default Quantile;

Quantile.propTypes = {
  postFormInput: PropTypes.func
};
