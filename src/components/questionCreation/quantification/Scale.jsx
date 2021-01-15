import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { useSnackbar } from 'notistack';

const Scale = props => {
  const [formInput, setFormInput] = useState({
    value: '',
    valueLabel: '',
    valueDescription: '',
    scaleType: 'Nominal',
    defaultAnswer: false,
    noMoreQuestions: false
  });
  const [submitted, setSubmitted] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const saveQuantification = () => {
    if (!formInput.value || !props.name) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.postFormInput(formInput, 'Scale');
      setSubmitted(false);
      setFormInput({
        value: '',
        valueLabel: '',
        valueDescription: '',
        scaleType: formInput.scaleType,
        defaultAnswer: false,
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
      <InputLabel id="templateLevel">Scale Type</InputLabel>
      <Select
        value={formInput.scaleType}
        onChange={handleFormInput}
        name="scaleType"
        // label="Scale Type"
      >
        <option value={'Nominal'}>Nominal</option>
        <option value={'Ordinal'}>Ordinal</option>
        <option value={'Ratio'}>Ratio</option>
      </Select>
      <TextField
        // className={classes.textField}
        value={formInput.value}
        label="Value"
        name="value"
        onChange={handleFormInput}
        required
        error={!formInput.value && submitted}
      />
      <TextField
        // className={classes.textField}
        value={formInput.valueLabel}
        label="Value label"
        name="valueLabel"
        onChange={handleFormInput}
      />
      <TextField
        // className={classes.textField}
        value={formInput.valueDescription}
        label="Value description"
        name="valueDescription"
        onChange={handleFormInput}
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            value="defaultAnswer"
            checked={formInput.defaultAnswer}
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
            checked={formInput.noMoreQuestions}
            value="noMoreQuestions"
            onChange={handleFormCheckbox}
          />
        }
        label="No more questions"
        labelPlacement="end"
      />
      <Button onClick={saveQuantification}>{'Save & Next'}</Button>
    </FormControl>
  );
};

export default Scale;

Scale.propTypes = {
  postFormInput: PropTypes.func,
  setNewScaleType: PropTypes.func,
  validateName: PropTypes.func,
  name: PropTypes.string
};
