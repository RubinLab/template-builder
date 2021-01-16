import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Accessibility from '@material-ui/icons/Accessibility';
import { useSnackbar } from 'notistack';
import Visibility from '@material-ui/icons/Visibility';
// import Search from '@material-ui/icons/Search';
import LocalHospital from '@material-ui/icons/LocalHospital';
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import CheckBox from '@material-ui/icons/CheckBox';
import LinearScale from '@material-ui/icons/LinearScale';
import ShortText from '@material-ui/icons/ShortText';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import SearchResults from './searchResults.jsx';
import AnswerList from './answersList.jsx';
import TermSearchDialog from './TermSearchDialog.jsx';
import QuantificationDialog from './quantification/QuantificationDialog.jsx';

import {
  getCollectionResults,
  getDetail,
  getTermFromEPAD,
  insertTermToEPAD
} from '../../services/apiServices';
import {
  createID,
  shapeSelectedTermData,
  geometricShapes
} from '../../utils/helper';

const materialUseStyles = makeStyles(theme => ({
  root: { direction: 'row', marginLeft: theme.spacing(1) },
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: 150
  },

  icon: {
    marginRight: theme.spacing(1),
    verticalAlign: 'middle'
  },
  textField: {
    marginTop: theme.spacing(3),
    width: 400,
    [theme.breakpoints.down('sm')]: {
      width: 300
    }
  },
  searchInput: {
    width: 250,
    marginTop: theme.spacing(3)
  },
  inputFieldGroup: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3)
  },
  checkbox: {
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(3),
    padding: theme.spacing(0)
  },
  filledText: {
    paddingTop: theme.spacing(0.5),
    marginRight: theme.spacing(2)
  },
  inputField: {
    marginRight: theme.spacing(2)
  },
  answerTypeMenu: {
    marginRight: theme.spacing(2)
  },
  resultsDrawer: {
    flexShrink: 0
  },
  answerTermGroup: {
    display: 'flex',
    width: 400,
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    background: '#E3E0D8',
    '&:hover': {
      background: '#CCBC8E'
    }
  },
  geometricShape: {
    width: 150
  }
}));

const QuestionForm = props => {
  const classes = materialUseStyles();
  const {
    postQuestion,
    characteristic,
    ontology,
    edit,
    detailEdit,
    author
  } = props;
  const [searchResults, setSearchResults] = useState({});
  const [question, setQuestion] = useState('');
  const [explanatoryText, setExplanatoryText] = useState();
  const [questionType, setQuestionType] = useState('');
  const [showSearchResults, _setShowSearchResults] = useState(false);
  const [searchTerm, _setSearchTerm] = useState('');
  const [selectedTerms, setTermSelection] = useState(null);
  const [minCard, setMinCard] = useState('');
  const [maxCard, setMaxCard] = useState('');
  const [showConfidence, setshowConfidence] = useState(false);
  const [answerType, setAnswerType] = useState('');
  const [ontologyLibs, setOntologyLibs] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [addQuantification, setAddQuantification] = useState(false);
  const [nonquantifiableTerm, setNonquantifiableTerm] = useState({});
  const [termID, setTermID] = useState(false);
  const [GeometricShape, setGeometricShape] = useState('');
  const [addTerm, setAddTerm] = useState(false);

  // const [quantificationName, setquantificationName] = useState('');
  const [searchStatus, _setSearchStatus] = useState({
    explanation: null,
    message: null,
    onClick: null,
    status: null
  });
  const searchResultsRef = useRef();

  const showResultsRef = useRef(searchStatus);
  const searchTermRef = useRef(searchTerm);

  const { enqueueSnackbar } = useSnackbar();

  const setSearchTerm = (value, option) => {
    if (value || value === '') {
      searchTermRef.current = value;
      _setSearchTerm(value);
    } else {
      searchTermRef.current = option;
      _setSearchTerm(option);
    }
  };

  const setShowSearchResults = bool => {
    showResultsRef.current = bool;
    _setShowSearchResults(bool);
  };

  const searchStatusRef = useRef(searchStatus);
  const setSearchStatus = status => {
    searchStatusRef.current = status;
    _setSearchStatus(status);
  };

  const formInput = {
    questionType,
    question,
    explanatoryText,
    selectedTerms,
    minCard,
    maxCard,
    showConfidence,
    GeometricShape
  };

  const addToEpad = () => {};

  const filterOntologyList = () => {
    let filteredOntology = [];
    if (
      ontologyLibs &&
      Array.isArray(ontologyLibs) &&
      ontologyLibs.length > 0
    ) {
      filteredOntology = ontologyLibs.map(el => el.acronym);
    } else if (ontology) {
      filteredOntology = [ontology];
    }
    return filteredOntology;
  };

  const searchEPAD = async term => {
    try {
      const { data: terms } = await getTermFromEPAD(term);
      if (Array.isArray(terms) && terms.length) return { collection: terms };
    } catch (err) {
      console.error(err);
      return { collection: [] };
    }
    return { collection: [] };
  };

  const populateAlternativeSearch = (status, data) => {
    const trimmedTerm = searchTerm.trim();
    const ontList = filterOntologyList().join(', ');
    switch (status) {
      case 'showOther':
        return {
          explanation: `Couldn't find ${trimmedTerm ||
            'the term'} in ${ontList || 'supported ontologies'} `,
          link: `Show ${
            data ? data.collection.length : 'all'
          } results from other ontologies!`,
          onClick: () => {
            setSearchResults(data);
            setShowSearchResults(true);
          },
          status
        };
      case 'suggestAddEpad':
        return {
          explanation: `Couldn't find the term in ePAD Lexicon `,
          link: 'Add to ePAD Lexicon!',
          onClick: () => {
            setSearchStatus(populateAlternativeSearch('showEpadAdd'));
          },
          status
        };
      case 'showEpadAdd':
        return {
          explanation: `Save the term to ePAD Lexicon`,
          onClick: addToEpad,
          status
        };
      default:
        return {
          explanation: null,
          message: null,
          onClick: null,
          status: null
        };
    }
  };

  const saveTermToEPAD = description => {
    const codeMeaning = searchTerm.trim();
    insertTermToEPAD(codeMeaning, description, author)
      .then(() => {
        enqueueSnackbar(
          `${codeMeaning} successfully saved to the EPAD lexicon`,
          {
            variant: 'success'
          }
        );
      })
      .catch(err => {
        const errMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : '';
        enqueueSnackbar(
          `Couln't save ${codeMeaning} to the EPAD lexicon! ${errMessage}`,
          {
            variant: 'error'
          }
        );
      });
  };

  const formCombinedSearchResult = async () => {
    const searchResult = await getCollectionResults(
      searchTermRef.current.trim()
    );
    const epadResults = await searchEPAD(searchTermRef.current.trim());

    if (
      searchResult.data.collection.length > 0 &&
      epadResults.collection.length > 0
    ) {
      const combinedData = {
        ...searchResult.data,
        collection: [...epadResults.collection, ...searchResult.data.collection]
      };
      setSearchStatus(populateAlternativeSearch('showOther', combinedData));
    } else if (searchResult.data.collection.length > 0) {
      setSearchStatus(
        populateAlternativeSearch('showOther', searchResult.data)
      );
    } else if (epadResults.collection.length > 0) {
      setSearchStatus(
        populateAlternativeSearch('showOther', {
          collection: epadResults
        })
      );
    } else {
      setSearchStatus(populateAlternativeSearch('suggestAddEpad'));
    }
  };

  const handleClickOutsideOfDrawer = async e => {
    try {
      const { className } = e.target;
      if (
        searchResultsRef &&
        searchResultsRef.current &&
        searchResultsRef.current.contains(e.target)
      ) {
        return;
      }
      if (
        className &&
        typeof className === 'string' &&
        className.includes('MuiDrawer-paper')
      ) {
        return;
      }
      if (
        searchStatusRef.current.status === 'showOther' &&
        showResultsRef.current
      ) {
        setSearchStatus(populateAlternativeSearch('suggestAddEpad'));
      }

      if (searchStatusRef.current.firstSearch && showResultsRef.current) {
        const filteredOntology = filterOntologyList();

        if (filteredOntology.length !== 0 && filteredOntology.length !== 4) {
          // if there is a filter make a search with no filter including epad
          formCombinedSearchResult();
        } else {
          // if there isn't any filtter make the search only in epad
          const epadResults = await searchEPAD(searchTermRef.current.trim());

          if (epadResults.collection.length > 0)
            setSearchStatus(
              populateAlternativeSearch('showOther', epadResults)
            );
          else setSearchStatus(populateAlternativeSearch('suggestAddEpad'));
        }
      }
      setShowSearchResults(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideOfDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideOfDrawer);
    };
  }, []);

  const filFormInputOnEdit = () => {
    setQuestion(edit.label);
    setExplanatoryText(edit.explanatoryText);
    setMinCard(edit.minCardinality);
    setMaxCard(edit.maxCardinality);
    if (edit.maxCardinality === 1 && edit.minCardinality === 1) {
      setAnswerType('single');
    } else if (
      typeof edit.maxCardinality === 'number' &&
      typeof edit.minCardinality === 'number'
    ) {
      setAnswerType('multi');
    }
    if (edit && edit.AllowedTerm.length > 0) {
      const selectedTermsfromEdit = shapeSelectedTermData(edit.AllowedTerm);
      setTermSelection(selectedTermsfromEdit);
    }
    if (edit.AnatomicEntity || (detailEdit && detailEdit[0] === 'anatomic')) {
      setQuestionType('anatomic');
    } else {
      setQuestionType('observation');
    }
    postQuestion(formInput);
  };

  useEffect(() => {
    if (edit) {
      filFormInputOnEdit();
    }
  }, [edit]);

  const handleBioportalSearch = async () => {
    try {
      let searchedTerms = JSON.parse(sessionStorage.getItem('searchedTerms'));
      const trimmedSearchTerm = searchTerm.trim();
      if (searchedTerms && !searchedTerms.includes(trimmedSearchTerm)) {
        searchedTerms = [...searchedTerms, trimmedSearchTerm];
      } else if (!searchedTerms) {
        searchedTerms = [trimmedSearchTerm];
      }
      sessionStorage.setItem('searchedTerms', JSON.stringify(searchedTerms));
      const filteredOntology = filterOntologyList();

      let searchResult;
      if (trimmedSearchTerm) {
        searchResult = await getCollectionResults(
          trimmedSearchTerm,
          filteredOntology
        );
        if (searchResult.data.collection.length === 0) {
          // if thre isn't a result check if there is a filter in the search
          if (filteredOntology.length !== 0 && filteredOntology.length !== 4) {
            // if there is a filter make a search with no filter including epad
            formCombinedSearchResult();
          } else {
            // if there isn't any filtter make the search only in epad
            const epadResults = await searchEPAD(searchTermRef.current.trim());
            if (epadResults.collection.length > 0)
              setSearchStatus(
                populateAlternativeSearch('showOther', epadResults)
              );
            else setSearchStatus(populateAlternativeSearch('suggestAddEpad'));
          }
        } else {
          setSearchResults(searchResult.data);
          setShowSearchResults(true);
          setSearchStatus({
            explanation: null,
            message: null,
            onClick: null,
            status: null,
            firstSearch: true
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuestionType = async e => {
    setQuestionType(e.target.value);
    postQuestion({ ...formInput, questionType: e.target.value });
  };

  const handleSearchInput = (e, option) => {
    if (e) setSearchTerm(e.target.value);
    else setSearchTerm(e, option);
  };

  const getNewSearchResult = pageNo => {
    const filteredOntology = filterOntologyList();
    getCollectionResults(searchTerm, filteredOntology, pageNo)
      .then(res => {
        setSearchResults(res.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const handleKeyboardEvent = e => {
      const termNotEmpty =
        searchTerm && searchTerm.length > 0 && searchTerm.trim().length > 0;
      if (e.key === 'Enter' && termNotEmpty) {
        handleBioportalSearch();
      }
    };
    window.addEventListener('keydown', handleKeyboardEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent);
    };
  });

  const selectCodeValue = (ontologyName, item) => {
    const { cui, notation } = item;
    let codeValue = null;
    if (ontologyName === 'ICD10' || ontologyName === 'SNOMEDCT') {
      if (cui && cui.length > 0) {
        codeValue = cui.shift();
      } else if (notation) {
        codeValue = notation;
      }
    } else if (ontologyName === 'RADLEX') {
      codeValue = item.prefixIRI;
    } else if (ontologyName === 'NCIT') {
      codeValue = item.prefixIRI.split(':').pop();
    }
    return codeValue;
  };

  const returnSelection = (acronym, item) => {
    const result = {};
    const codeValue = selectCodeValue(acronym, item);
    if (codeValue) {
      result.codeValue = codeValue;
      result.codeMeaning = item.prefLabel;
      result.codingSchemeDesignator = acronym;
      return result;
    }
    return codeValue;
  };

  const clearSearchSetup = () => {
    setShowSearchResults(false);
    setOpenSearch(false);
    setOntologyLibs([]);
    setSearchTerm('');
    setSearchStatus({
      explanation: null,
      message: null,
      onClick: null,
      status: null
    });
  };

  const handleTermSelection = async (termIndex, title) => {
    try {
      let allowedTerm = {};
      let newSelected = selectedTerms ? { ...selectedTerms } : {};
      const id = createID();
      if (title !== '99EPAD') {
        const acronym = searchResults.collection[termIndex].links.ontology
          .split('/')
          .pop();
        const url = searchResults.collection[termIndex][`@id`];
        const details = await getDetail(acronym, url);
        allowedTerm = returnSelection(acronym, details.data);
        if (allowedTerm || (allowedTerm && !allowedTerm.codeMeaning)) {
          const newTerm = {
            [id]: {
              allowedTerm,
              title,
              id
            }
          };
          newSelected = { ...selectedTerms, ...newTerm };
        } else {
          setShowSearchResults(false);
          const message = `Couldnt find ${
            allowedTerm ? 'preferred name' : 'cui or notation'
          } for this term in ${acronym}. You can upload the term with a .csv file!`;
          enqueueSnackbar(message, {
            variant: 'error'
          });
        }
      } else {
        allowedTerm = {
          codeValue: searchResults.collection[termIndex].codevalue,
          codeMeaning: searchResults.collection[termIndex].codemeaning,
          codingSchemeDesignator:
            searchResults.collection[termIndex].schemadesignator
        };
        const newTerm = { [id]: { allowedTerm, title, id } };
        newSelected = { ...selectedTerms, ...newTerm };
      }
      if (addQuantification) {
        setNonquantifiableTerm(allowedTerm);
        clearSearchSetup();
        setTermID('');
      } else if (addTerm) {
        if (selectedTerms[termID].allowedTerm.ValidTerm) {
          selectedTerms[termID].allowedTerm.ValidTerm.push(allowedTerm);
        } else {
          selectedTerms[termID].allowedTerm.ValidTerm = [allowedTerm];
        }
        clearSearchSetup();
      } else {
        postQuestion({ ...formInput, selectedTerms: newSelected });
        setTermSelection(newSelected);
        clearSearchSetup();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveQuantification = quantification => {
    const newSelected = { ...selectedTerms };
    const termWithQuantification = { ...newSelected[termID] };
    // check if already quantification form the term
    const existingQuantification =
      termWithQuantification.allowedTerm.CharacteristicQuantification;
    // if there is merge, if not accept the new
    const mergedQuantification = existingQuantification
      ? [...existingQuantification, ...quantification]
      : quantification;
    // assign index numbers for quantification
    const finalQuantification = mergedQuantification.map((el, i) => ({
      ...el,
      characteristicQuantificationIndex: i + 1
    }));
    termWithQuantification.allowedTerm.CharacteristicQuantification = finalQuantification;
    newSelected[termID] = termWithQuantification;
    setTermSelection(newSelected);
    setAddQuantification(false);
    setTermID('');
  };

  const getUploadedTerms = data => {
    if (addQuantification) {
      const dataArray = Object.values(data);
      setNonquantifiableTerm(dataArray[0].allowedTerm);
      if (dataArray.length > 1) {
        enqueueSnackbar(
          'First entry in the file is accepted! Expecting one term at a time!',
          {
            variant: 'warning'
          }
        );
      }
    } else {
      const newSelected = { ...selectedTerms, ...data };
      postQuestion({ ...formInput, selectedTerms: newSelected });
      setTermSelection(newSelected);
      setOpenSearch(false);
    }
  };

  const assignDefaultVals = (min, max) => {
    setMinCard(min);
    setMaxCard(max);
    postQuestion({ ...formInput, minCard: min, maxCard: max });
  };

  const handleAnswerTypeSelection = e => {
    const selection = e.target.value;
    setAnswerType(selection);
    switch (selection) {
      case 'single':
        assignDefaultVals(1, 1, true);
        break;
      case 'multi':
        assignDefaultVals(0, 3, false);
        break;
      case 'scale':
        if (!characteristic) {
          enqueueSnackbar(
            `Quantification can be created in characteristic questions! 
            Select a "Question type" and click on "ADD CHARACTERISTICS" button`,
            {
              variant: 'warning'
            }
          );
          setAnswerType('');
        } else {
          enqueueSnackbar(
            `To create a quantification, first add a term and click on the scale icon next to the term!`,
            {
              variant: 'info'
            }
          );
          assignDefaultVals(1, 1, false);
        }
        break;
      case 'text':
        assignDefaultVals(null, null, true);
        break;
      default:
        setMinCard(null);
        setMaxCard(null);
    }
  };

  const handleQuestion = e => {
    setQuestion(e.target.value);
    postQuestion({ ...formInput, question: e.target.value });
  };

  const handleDeleteSelectedTerm = item => {
    const currentSelectedTerms = { ...selectedTerms };
    delete currentSelectedTerms[item.id];
    setTermSelection(currentSelectedTerms);
  };

  const handleOntologyInput = (e, options) => {
    if (Array.isArray(options)) {
      if (options.length === 0) setOntologyLibs(options);
      else {
        // setOntologyLibs(options.map(el => el.acronym));
        setOntologyLibs(options);
      }
    }
  };

  const toggleDrawer = event => {
    if (event.key === 'Escape') {
      setShowSearchResults(false);
      if (searchStatus.status === 'showOther' || searchTerm) {
        setSearchStatus(populateAlternativeSearch('suggestAddEpad'));
      }
    }
  };

  const openTermAdding = () => {
    if (answerType === 'single' || answerType === 'multi') {
      setOpenSearch(true);
    } else if (answerType === 'scale') {
      // setAddQuantification(true);
    }
  };

  const disabled = answerType === 'single';
  return (
    <div className={classes.root}>
      {(characteristic === 'anatomic' || characteristic === undefined) && (
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="questionType">Question type</InputLabel>
            <Select
              labelId="questionType"
              id="questionType-controlled-open-select"
              value={questionType}
              onChange={handleQuestionType}
            >
              <MenuItem value={'anatomic'}>
                <Accessibility className={classes.icon} />
                Anatomic Location
              </MenuItem>
              <MenuItem value={'observation'}>
                <Visibility className={classes.icon} />
                Imaging Observation
              </MenuItem>
              {!characteristic && (
                <MenuItem value={'history'}>
                  <LocalHospital className={classes.icon} />
                  {`Clinical hist. & diagnosis`}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
      )}
      <div>
        <TextField
          className={classes.textField}
          label="Question"
          multiline={true}
          onChange={handleQuestion}
          defaultValue={question}
        />
      </div>
      <div>
        <TextField
          className={classes.textField}
          label="Explanation (optional)"
          multiline={true}
          defaultValue={explanatoryText}
          onChange={e => {
            setExplanatoryText(e.target.value);
            postQuestion({ ...formInput, explanatoryText: e.target.value });
          }}
        />
      </div>

      {/* <div className={classes.answerGroup}> */}
      <TermSearchDialog
        handleBioportalSearch={handleBioportalSearch}
        ontologyLibs={ontologyLibs}
        handleSearchInput={handleSearchInput}
        handleOntologyInput={handleOntologyInput}
        saveTerm={saveTermToEPAD}
        searchTerm={searchTerm}
        getUploadedTerms={getUploadedTerms}
        ontology={ontology}
        searchStatus={searchStatus}
        onCancel={() => setOpenSearch(false)}
        open={openSearch}
      />

      <QuantificationDialog
        saveQuantification={saveQuantification}
        onCancel={() => setAddQuantification(false)}
        clearSearchTerm={() => setNonquantifiableTerm({})}
        open={addQuantification}
        handleBioportalSearch={handleBioportalSearch}
        ontologyLibs={ontologyLibs}
        handleSearchInput={handleSearchInput}
        handleOntologyInput={handleOntologyInput}
        saveTerm={saveTermToEPAD}
        searchTerm={searchTerm}
        getUploadedTerms={getUploadedTerms}
        ontology={ontology}
        searchStatus={searchStatus}
        nonquantifiableTerm={nonquantifiableTerm}
      />

      <FormControl className={classes.formControl}>
        <InputLabel id="answerType">Answer type</InputLabel>
        <Select
          labelId="answerType"
          id="answerType-controlled-open-select"
          value={answerType}
          onChange={handleAnswerTypeSelection}
          className={classes.answerTypeMenu}
        >
          <MenuItem value={'single'}>
            <RadioButtonChecked className={classes.icon} />
            Single select
          </MenuItem>
          <MenuItem value={'multi'}>
            <CheckBox className={classes.icon} />
            Multiple select
          </MenuItem>
          <MenuItem value={'scale'}>
            <LinearScale className={classes.icon} disabled={!characteristic} />
            Scale/Quantification
          </MenuItem>
          <MenuItem value={'text'}>
            <ShortText className={classes.icon} />
            Short answer
          </MenuItem>
        </Select>
      </FormControl>
      <div className={classes.answerTermGroup}>
        <Button
          variant="outlined"
          className={classes.button}
          onClick={openTermAdding}
          disabled={GeometricShape}
        >
          Add Controlled Term
        </Button>
        <FormControl className={classes.geometricShape}>
          <InputLabel id="GeometricShape">Geometric Shape</InputLabel>
          <Select
            labelId="GeometricShape"
            value={GeometricShape}
            onChange={e => {
              postQuestion({ ...formInput, GeometricShape: e.target.value });
              setGeometricShape(e.target.value);
            }}
            disabled={selectedTerms && Object.keys(selectedTerms).length > 0}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Object.keys(geometricShapes).map(el => (
              <MenuItem value={el} key={el}>
                {geometricShapes[el]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* </div> */}
      {/* {answerType === 'scale' && characteristic && (
        <TextField
          className={classes.textField}
          label="Name for the quantification"
          onChange={e => setquantificationName(e.target.value)}
        />
      )} */}
      {selectedTerms && (
        <div>
          <AnswerList
            answers={Object.values(selectedTerms)}
            handleDelete={handleDeleteSelectedTerm}
            characteristic={characteristic}
            handleAddTerm={index => {
              setTermID(index);
              setOpenSearch(true);
              setAddTerm(true);
            }}
            handleAddCalculation={index => {
              setAddQuantification(true);
              setTermID(index);
            }}
          />
        </div>
      )}
      <div className={classes.inputFieldGroup}>
        <TextField
          className={maxCard ? classes.filledText : classes.inputField}
          label="Max Cardinality"
          value={maxCard}
          onChange={e => {
            setMaxCard(e.target.value);
            postQuestion({ ...formInput, maxCard: e.target.value });
          }}
          InputLabelProps={{
            shrink: maxCard >= 0 || disabled
          }}
          type="number"
          size="small"
          InputProps={{
            inputProps: {
              min: 0
            }
          }}
          disabled={disabled}
        />
        <TextField
          className={minCard ? classes.filledText : classes.inputField}
          label="Min Cardinality"
          value={minCard}
          onChange={e => {
            setMinCard(e.target.value);
            postQuestion({ ...formInput, minCard: e.target.value });
          }}
          InputLabelProps={{
            shrink: minCard >= 0 || minCard === 0 || disabled
          }}
          type="number"
          size="small"
          InputProps={{
            inputProps: {
              min: 0
            }
          }}
          disabled={disabled}
        />
      </div>
      <div>
        <FormControlLabel
          className={classes.checkbox}
          value="showConfidence"
          control={<Checkbox color="primary" />}
          label="Show annotator confidence"
          labelPlacement="end"
          onChange={e => {
            setshowConfidence(e.target.value);
            postQuestion({ ...formInput, showConfidence: e.target.value });
          }}
        />
      </div>
      <Drawer
        className={classes.resultsDrawer}
        variant="temporary"
        anchor="right"
        open={showSearchResults}
        classes={{
          paper: classes.drawerPaper
        }}
        onClose={toggleDrawer}
      >
        <div ref={searchResultsRef}>
          <SearchResults
            results={searchResults}
            handleSelection={handleTermSelection}
            handleClose={() => setShowSearchResults(false)}
            term={searchTerm}
            handleNewPage={getNewSearchResult}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default QuestionForm;

QuestionForm.propTypes = {
  postQuestion: PropTypes.func,
  characteristic: PropTypes.string,
  ontology: PropTypes.string,
  edit: PropTypes.object,
  detailEdit: PropTypes.array,
  author: PropTypes.string
};
