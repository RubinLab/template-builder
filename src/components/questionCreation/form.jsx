import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Accessibility from '@material-ui/icons/Accessibility';
import Visibility from '@material-ui/icons/Visibility';
import Search from '@material-ui/icons/Search';
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
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import Drawer from '@material-ui/core/Drawer';
import SearchResults from './searchResults.jsx';
import AnswerList from './answersList.jsx';
import { getResults } from '../../services/apiServices';

const drawerWidth = 240;

const materialUseStyles = makeStyles(theme => ({
  root: { direction: 'row', marginLeft: theme.spacing(1) },
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: 150,
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(3),
    background: '#E3E0D8',
    '&:hover': {
      background: '#CCBC8E',
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(3),
    width: 400,
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
  },
  searchInput: {
    width: 250,
    marginTop: theme.spacing(3),
  },
  searchButton: {
    background: '#E3E0D8',
    padding: theme.spacing(1),
    '&:hover': {
      background: '#CCBC8E',
    },
  },
  inputFieldGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3),
  },
  answerGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  checkbox: {
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(3),
    padding: theme.spacing(0),
  },
  filledText: {
    paddingTop: theme.spacing(0.5),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  answerTypeMenu: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
}));

export default function Form(props) {
  const classes = materialUseStyles();
  const { postQuestion } = props;
  const [searchResults, setSearchResults] = useState({});
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerms, setTermSelection] = useState(null);
  const [minCard, setMinCard] = useState('');
  const [maxCard, setMaxCard] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [nextId, setNextID] = useState(null);
  const [noMore, setNoMore] = useState(null);
  const [showConfidence, setshowConfidence] = useState(null);
  const [answerType, setAnswerType] = useState('');
  const [showBackdrop, setShowBackdrop] = useState(false);

  const formInput = {
    questionType,
    question,
    selectedTerms,
    minCard,
    maxCard,
    nextId,
    noMore,
    showConfidence,
  };

  const toggleDrawer = event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setShowSearchResults(false);
  };

  const handleSearch = async () => {
    let searchedTerms = JSON.parse(sessionStorage.getItem('searchedTerms'));
    const trimmedSearchTerm = searchTerm.trim();
    if (searchedTerms && !searchedTerms.includes(trimmedSearchTerm)) {
      searchedTerms = [...searchedTerms, trimmedSearchTerm];
    } else if (!searchedTerms) {
      searchedTerms = [trimmedSearchTerm];
    }
    sessionStorage.setItem('searchedTerms', JSON.stringify(searchedTerms));
    setShowBackdrop(true);
    getResults(trimmedSearchTerm)
      .then(res => {
        setSearchResults(res.data);
        setShowSearchResults(true);
        setShowBackdrop(false);
      })
      .catch(err => console.error(err));
  };

  const handleQuestionType = async e => {
    setQuestionType(e.target.value);
    postQuestion({ ...formInput, questionType: e.target.value });
  };

  const handleSearchInput = (e, option) => {
    if (e) setSearchTerm(e.target.value);
    else setSearchTerm(option);
  };

  const handleKeyboardEvent = e => {
    const termNotEmpty =
      searchTerm && searchTerm.length > 0 && searchTerm.trim().length > 0;
    if (e.key === 'Enter' && termNotEmpty) {
      handleSearch();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [handleKeyboardEvent]);

  const handleTermSelection = termIndex => {
    let newSelected;
    if (typeof termIndex === 'number') {
      newSelected = { ...selectedTerms };
      if (selectedTerms) {
        newSelected[searchTerm] = searchResults[termIndex];
        postQuestion({ ...formInput, selectedTerms: newSelected });
      } else {
        newSelected = { [searchTerm]: searchResults[termIndex] };
        postQuestion({ ...formInput, selectedTerms: newSelected });
      }
      setTermSelection(newSelected);
      setShowSearchResults(false);
      // setSearchResults([]);
    }
  };

  const assignDefaultVals = (min, max, disabledBool) => {
    setMinCard(min);
    setMaxCard(max);
    setDisabled(disabledBool);
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

  return (
    <div className={classes.root} onClick={toggleDrawer}>
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
            <MenuItem value={'history'}>
              <LocalHospital className={classes.icon} />
              {`Clinical hist. & diagnosis`}
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <TextField
          className={classes.textField}
          label="Question"
          multiline={true}
          onChange={handleQuestion}
        />
      </div>
      <div className={classes.answerGroup}>
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
        </FormControl>
        <div className={classes.answerGroup}>
          <Autocomplete
            id="combo-box-demo"
            options={JSON.parse(sessionStorage.getItem('searchedTerms')) || []}
            // getOptionLabel={option => option.title}
            value={searchTerm}
            onChange={(_, data) => handleSearchInput(null, data)}
            onInputChange={handleSearchInput}
            style={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                className={classes.searchInput}
                placeholder="Search terms"
                // onChange={handleSearchInput}
              />
            )}
          />

          <IconButton className={classes.searchButton} onClick={handleSearch}>
            <Search />
          </IconButton>
        </div>
      </div>
      {selectedTerms && (
        <div>
          <AnswerList
            answerType={answerType}
            answers={Object.keys(selectedTerms)}
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
          }}
          InputLabelProps={{
            shrink: maxCard >= 0 || disabled,
          }}
          type="number"
          size="small"
          disabled={disabled}
        />
        <TextField
          className={minCard ? classes.filledText : classes.inputField}
          label="Min Cardinality"
          value={minCard}
          onChange={e => {
            setMinCard(e.target.value);
          }}
          InputLabelProps={{
            shrink: minCard >= 0 || minCard === 0 || disabled,
          }}
          type="number"
          size="small"
          disabled={disabled}
        />
        <TextField
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
          }}
        />
      </div>
      <Backdrop className={classes.backdrop} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor="right"
        open={showSearchResults}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <SearchResults
          results={searchResults}
          handleSelection={handleTermSelection}
          handleClose={() => setShowSearchResults(false)}
          term={searchTerm}
        />
      </Drawer>
    </div>
  );
}

Form.propTypes = {
  postQuestion: PropTypes.func,
};
