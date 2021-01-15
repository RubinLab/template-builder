import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';

const Quantile = props => {
  const [formInput, setFormInput] = useState({
    minValue: '',
    maxValue: '',
    bins: '',
    defaultBin: '',
    valueLabel: '',
    valueDescription: '',
    noMoreQuestions: false
  });
  const [submitted, setSubmitted] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const saveQuantification = () => {
    if (
      !formInput.bins ||
      !formInput.maxValue ||
      !formInput.minValue ||
      !props.name
    ) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.postFormInput(formInput, 'Quantile');
      setSubmitted(false);
      setFormInput({
        minValue: '',
        maxValue: '',
        bins: '',
        defaultBin: '',
        valueLabel: '',
        valueDescription: '',
        noMoreQuestions: false
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
    const { checked, value } = e.target;
    const newFormInput = { ...formInput, [value]: checked };
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
        label="Bins"
        name="bins"
        value={formInput.bins}
        onChange={handleFormInput}
        required
        error={!formInput.bins && submitted}
      />
      <TextField
        // className={classes.textField}
        label="Default Bin"
        name="defaultBin"
        value={formInput.defaultBin}
        onChange={handleFormInput}
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
        value="noMoreQuestions"
        checked={formInput.noMoreQuestions}
        control={<Checkbox color="primary" />}
        label="No more questions"
        labelPlacement="end"
        onChange={handleFormCheckbox}
      />
      <Button onClick={saveQuantification}>{'Save & Next'}</Button>
    </FormControl>
  );
};

export default Quantile;

Quantile.propTypes = {
  postFormInput: PropTypes.func,
  validateName: PropTypes.func,
  name: PropTypes.string
};
