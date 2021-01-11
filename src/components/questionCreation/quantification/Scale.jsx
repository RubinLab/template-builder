import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

const Scale = props => {
  const [formInput, setFormInput] = useState({});

  const saveCalculation = () => {
    if (!formInput.value) {
      console.log('here');
    } else {
      props.postFormInput(formInput, 'Scale');
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
      <Button onClick={saveCalculation}>{'Save & Next'}</Button>
    </FormControl>
  );
};

export default Scale;

Scale.propTypes = {
  postFormInput: PropTypes.func
};
