import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Interval = props => {
  const [formInput, setFormInput] = useState({});

  const handleFormInput = e => {
    console.log(e.target);
    const { name, value } = e.target;
    const newFormInput = { ...formInput, [name]: value };
    setFormInput(newFormInput);
    props.postFormInput(newFormInput, 'Interval');
  };

  return (
    <FormControl>
      <TextField
        // className={classes.textField}
        label="Minimum Value"
        name="minValue"
        onChange={handleFormInput}
        required
      />
      <TextField
        // className={classes.textField}
        label="Maximum Value"
        name="maxValue"
        onChange={handleFormInput}
        required
      />
      <TextField
        // className={classes.textField}
        label="UcumString"
        name="ucumString"
        onChange={handleFormInput}
        required
      />
      <TextField
        // className={classes.textField}
        label="Minimum Operator"
        name="minOperator"
        onChange={handleFormInput}
        required
      />
      <TextField
        // className={classes.textField}
        label="Maximum Operator"
        name="maxOperator"
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
    </FormControl>
  );
};

export default Interval;

Interval.propTypes = {
  postFormInput: PropTypes.func
};
