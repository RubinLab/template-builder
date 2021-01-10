import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

const Quantile = props => {
  const [formInput, setFormInput] = useState({});

  const handleFormInput = e => {
    console.log(e.target);
    const { name, value } = e.target;
    const newFormInput = { ...formInput, [name]: value };
    setFormInput(newFormInput);
    props.postFormInput(newFormInput, 'Quantile');
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
        label="Bins"
        name="bins"
        onChange={handleFormInput}
        required
      />
      <TextField
        className={classes.textField}
        label="Default Bin"
        name="defaultBin"
        onChange={handleFormInput}
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
        label="No more questions"
        name="noMoreQuestions"
        onChange={handleFormInput}
      />
    </FormControl>
  );
};

export default Quantile;

Quantile.propTypes = {
  postFormInput: PropTypes.func
};
