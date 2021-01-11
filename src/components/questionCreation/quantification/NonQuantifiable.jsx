import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import TermSearch from '../TermSearch.jsx';

const NonQuantifiable = props => {
  const [formInput, setFormInput] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  const saveCalculation = () => {
    if (!formInput.value) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
    } else {
      props.postFormInput(newFormInput, 'NonQuantifiable');
    }
  };

  const handleFormInput = e => {
    console.log(e.target);
    const { name, value } = e.target;
    const newFormInput = { ...formInput, [name]: value };
    setFormInput(newFormInput);
  };

  return (
    <>
      <TermSearch />
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
    </>
  );
};

export default NonQuantifiable;

NonQuantifiable.propTypes = {
  postFormInput: PropTypes.func
};
