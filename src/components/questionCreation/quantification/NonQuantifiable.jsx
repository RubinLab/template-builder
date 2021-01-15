import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import TermSearchDialog from '../TermSearchDialog.jsx';

const NonQuantifiable = props => {
  const [formInput, setFormInput] = useState({
    valueDescription: '',
    defaultAnswer: false,
    noMoreQuestions: false,
    codeMeaning: '',
    codeValue: '',
    codingSchemeDesignator: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const saveQuantification = () => {
    if (
      !formInput.codeMeaning ||
      !formInput.codeValue ||
      !formInput.codingSchemeDesignator ||
      !props.name
    ) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.postFormInput(formInput, 'NonQuantifiable');
      props.clearSearchTerm();
      setSubmitted(false);
      setFormInput({
        valueDescription: '',
        defaultAnswer: false,
        noMoreQuestions: false,
        codeMeaning: '',
        codeValue: '',
        codingSchemeDesignator: ''
      });
    }
  };

  useEffect(() => {
    setStartSearch(false);
    let newFormInput = {};
    const {
      codeMeaning,
      codeValue,
      codingSchemeDesignator
    } = props.nonquantifiableTerm;
    if (formInput) {
      newFormInput = { ...formInput };
      newFormInput.codeMeaning = codeMeaning;
      newFormInput.codeValue = codeValue;
      newFormInput.codingSchemeDesignator = codingSchemeDesignator;
    } else {
      newFormInput = {
        valueDescription: '',
        defaultAnswer: false,
        noMoreQuestions: false,
        codeMeaning,
        codeValue,
        codingSchemeDesignator
      };
    }
    setFormInput(newFormInput);
  }, [props.nonquantifiableTerm]);

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
      <TermSearchDialog
        handleBioportalSearch={props.handleBioportalSearch}
        ontologyLibs={props.ontologyLibs}
        handleSearchInput={props.handleSearchInput}
        handleOntologyInput={props.handleOntologyInput}
        saveTerm={props.saveTerm}
        searchTerm={props.searchTerm}
        getUploadedTerms={props.getUploadedTerms}
        ontology={props.ontology}
        searchStatus={props.searchStatus}
        open={startSearch}
        onCancel={() => setStartSearch(false)}
      />
      <TextField
        // className={classes.textField}
        label="Code Meaning"
        name="codeMeaning"
        onMouseDown={() => {
          setStartSearch(true);
        }}
        value={formInput.codeMeaning}
        disabled={formInput.codeMeaning}
        InputLabelProps={{
          shrink: formInput.codeMeaning
        }}
        error={!formInput.codeMeaning && submitted}
        required
      />
      <TextField
        // className={classes.textField}
        label="Code Value"
        name="codeValue"
        onMouseDown={() => {
          setStartSearch(true);
        }}
        value={formInput.codeValue}
        disabled={formInput.codeValue}
        InputLabelProps={{
          shrink: formInput.codeMeaning
        }}
        error={!formInput.codeValue && submitted}
        required
      />
      <TextField
        // className={classes.textField}
        label="Coding Scheme Designator"
        name="codingSchemeDesignator"
        onMouseDown={() => {
          setStartSearch(true);
        }}
        value={formInput.codingSchemeDesignator}
        disabled={formInput.codingSchemeDesignator}
        InputLabelProps={{
          shrink: formInput.codeMeaning
        }}
        error={!formInput.codingSchemeDesignator && submitted}
        required
      />
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
      <Button onClick={saveQuantification}>{'Save & Next'}</Button>
    </>
  );
};

export default NonQuantifiable;

NonQuantifiable.propTypes = {
  postFormInput: PropTypes.func,
  handleBioportalSearch: PropTypes.func,
  ontologyLibs: PropTypes.object,
  handleSearchInput: PropTypes.func,
  handleOntologyInput: PropTypes.func,
  searchTerm: PropTypes.string,
  saveTerm: PropTypes.func,
  getUploadedTerms: PropTypes.func,
  ontology: PropTypes.string,
  searchStatus: PropTypes.object,
  nonquantifiableTerm: PropTypes.object,
  clearSearchTerm: PropTypes.func,
  validateName: PropTypes.func,
  name: PropTypes.string
};
