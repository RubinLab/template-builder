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
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import SearchResults from './searchResults.jsx';
import AnswerList from './answersList.jsx';
import TermSearch from './TermSearch.jsx';
import { getCollectionResults, getDetail } from '../../services/apiServices';
import { createID, shapeSelectedTermData } from '../../utils/helper';

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
  answerGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
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
  button: {
    display: 'block',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    background: '#E3E0D8',
    '&:hover': {
      background: '#CCBC8E'
    }
  }
}));

const QuestionForm = props => {
  const classes = materialUseStyles();
  const { postQuestion, characteristic, ontology, edit } = props;
  const [searchResults, setSearchResults] = useState({});
  const [question, setQuestion] = useState('');
  const [explanatoryText, setExplanatoryText] = useState();
  const [questionType, setQuestionType] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerms, setTermSelection] = useState(null);
  const [minCard, setMinCard] = useState('');
  const [maxCard, setMaxCard] = useState('');
  const [showConfidence, setshowConfidence] = useState(false);
  const [answerType, setAnswerType] = useState('');
  const [ontologyLibs, setOntologyLibs] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const searchResultsRef = useRef();

  const formInput = {
    questionType,
    question,
    explanatoryText,
    selectedTerms,
    minCard,
    maxCard,
    showConfidence
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleClickOutsideOfDrawer = e => {
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
    setShowSearchResults(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideOfDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideOfDrawer);
    };
  }, []);

  console.log(edit);

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
    if (edit.AllowedTerm.length > 0) {
      const selectedTermsfromEdit = shapeSelectedTermData(edit.AllowedTerm);
      setTermSelection(selectedTermsfromEdit);
    }
    if (edit.AnatomicEntity) {
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

  const handleBioportalSearch = async () => {
    let searchedTerms = JSON.parse(sessionStorage.getItem('searchedTerms'));
    const trimmedSearchTerm = searchTerm.trim();
    if (searchedTerms && !searchedTerms.includes(trimmedSearchTerm)) {
      searchedTerms = [...searchedTerms, trimmedSearchTerm];
    } else if (!searchedTerms) {
      searchedTerms = [trimmedSearchTerm];
    }
    sessionStorage.setItem('searchedTerms', JSON.stringify(searchedTerms));
    const filteredOntology = filterOntologyList();

    if (trimmedSearchTerm) {
      getCollectionResults(trimmedSearchTerm, filteredOntology)
        .then(res => {
          if (res.data.collection.length === 0) {
            enqueueSnackbar(
              `There isn't any result for "${trimmedSearchTerm.toUpperCase()}"!. You can search the term in ePAD lexicon.`,
              {
                autoHideDuration: 5000,
                variant: 'warning'
              }
            );
          } else {
            setSearchResults(res.data);
            setShowSearchResults(true);
          }
        })
        .catch(err => console.error(err));
    }
  };

  const handleQuestionType = async e => {
    setQuestionType(e.target.value);
    postQuestion({ ...formInput, questionType: e.target.value });
  };

  const handleSearchInput = (e, option) => {
    if (e) setSearchTerm(e.target.value);
    else setSearchTerm(option);
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

  const handleTermSelection = async (termIndex, title) => {
    try {
      const acronym = searchResults.collection[termIndex].links.ontology
        .split('/')
        .pop();
      const url = searchResults.collection[termIndex][`@id`];
      const details = await getDetail(acronym, url);
      const allowedTerm = returnSelection(acronym, details.data);
      if (allowedTerm || (allowedTerm && !allowedTerm.codeMeaning)) {
        const id = createID();
        const newTerm = {
          [id]: {
            allowedTerm,
            title,
            id
          }
        };
        const newSelected = selectedTerms
          ? { ...selectedTerms, ...newTerm }
          : newTerm;
        postQuestion({ ...formInput, selectedTerms: newSelected });
        setTermSelection(newSelected);
        setShowSearchResults(false);
        setOpenSearch(false);
        setOntologyLibs([]);
        setSearchTerm('');
      } else {
        setShowSearchResults(false);
        const message = `Couldnt find ${
          allowedTerm ? 'preferred name' : 'cui or notation'
        } for this term in ${acronym}. You can upload the term with a .csv file!`;
        enqueueSnackbar(message, {
          variant: 'error'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUploadedTerms = data => {
    const newSelected = { ...selectedTerms, ...data };
    postQuestion({ ...formInput, selectedTerms: newSelected });
    setTermSelection(newSelected);
    setOpenSearch(false);
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
        assignDefaultVals(null, null, true);
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

  const handleDeleteSelectedTerm = key => {
    const currentSelectedTerms = { ...selectedTerms };
    delete currentSelectedTerms[key];
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
    }
  };

  console.log(' --->questiontype', questionType);

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
          }}
        />
      </div>

      <div className={classes.answerGroup}>
        {openSearch && (
          <TermSearch
            handleBioportalSearch={handleBioportalSearch}
            ontologyLibs={ontologyLibs}
            handleSearchInput={handleSearchInput}
            handleOntologyInput={handleOntologyInput}
            searchTerm={searchTerm}
            getUploadedTerms={getUploadedTerms}
            handleClose={() => setOpenSearch(false)}
            ontology={ontology}
          />
        )}
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
              <LinearScale className={classes.icon} />
              Linear scale
            </MenuItem>
            <MenuItem value={'text'}>
              <ShortText className={classes.icon} />
              Short answer
            </MenuItem>
          </Select>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => setOpenSearch(true)}
          >
            Search Terms
          </Button>
        </FormControl>
      </div>
      {selectedTerms && (
        <div>
          <AnswerList
            answers={Object.values(selectedTerms)}
            handleDelete={handleDeleteSelectedTerm}
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
        {/* <TextField
          className={classes.inputField}
          label="Next ID"
          size="small"
          onChange={e => {
            setNextID(e.target.value);
          }}
        />
        <FormControlLabel
          className={classes.checkbox}
          value="noMore"
          control={<Checkbox color="primary" />}
          label="No more question"
          labelPlacement="end"
          onChange={e => {
            setNoMore(e.target.value);
          }}
        /> */}
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
  edit: PropTypes.object
};
