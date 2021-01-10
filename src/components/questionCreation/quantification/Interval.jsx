import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

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
        className={classes.textField}
        label="Minimum Value"
        name="minValue"
        onChange={handleFormInput}
        required
      />
      <TextField
        className={classes.textField}
        label="Maximum Value"
        name="maxValue"
        onChange={handleFormInput}
        required
      />
      <TextField
        className={classes.textField}
        label="UcumString"
        name="ucumString"
        onChange={handleFormInput}
        required
      />
      <TextField
        className={classes.textField}
        label="Minimum Operator"
        name="minOperator"
        onChange={handleFormInput}
        required
      />
      <TextField
        className={classes.textField}
        label="Maximum Operator"
        name="maxOperator"
        onChange={handleFormInput}
        required
      />

      <TextField
        className={classes.textField}
        label="Value label"
        name="valueLabel"
        onChange={handleFormInput}
      />
      <TextField
        className={classes.textField}
        label="Value description"
        name="valueDescription"
        onChange={handleFormInput}
      />

      <Checkbox
        label="Default Answer"
        name="defaultAnswer"
        onChange={handleFormInput}
      />
      <Checkbox
        label="Default Answer"
        name="defaultAnswer"
        onChange={handleFormInput}
      />
      <Checkbox
        label="No more questions"
        name="noMoreQuestions"
        onChange={handleFormInput}
      />
    </FormControl>
  );
};

export default Interval;

Interval.propTypes = {
  postFormInput: PropTypes.func
};
