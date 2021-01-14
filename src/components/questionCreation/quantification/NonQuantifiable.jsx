import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import TermSearch from '../TermSearch.jsx';

const NonQuantifiable = props => {
  const [formInput, setFormInput] = useState({
    valueDescription: '',
    defaultAnswer: false,
    noMoreQuestions: false
  });
  const { enqueueSnackbar } = useSnackbar();

  const saveCalculation = () => {
    if (!formInput.value) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
    } else {
      props.postFormInput(formInput, 'NonQuantifiable');
    }
  };

  const handleFormInput = e => {
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
    <>
      <TermSearch />
      <TextField
        // className={classes.textField}
        label="Value description"
        name="valueDescription"
        onChange={handleFormInput}
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
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
            name="noMoreQuestions"
            onChange={handleFormCheckbox}
          />
        }
        label="No more questions"
        labelPlacement="end"
      />
      <Button onClick={saveCalculation}>{'Save & Next'}</Button>
    </>
  );
};

export default NonQuantifiable;

NonQuantifiable.propTypes = {
  postFormInput: PropTypes.func
};
