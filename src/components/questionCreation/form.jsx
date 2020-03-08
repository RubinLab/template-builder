import React, { useState } from 'react';
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
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchResults from './searchResults.jsx';
import AnswerList from './answersList.jsx';

const data = [
  { id: 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C12468' },
  { id: 'http://purl.obolibrary.org/obo/NCIT_C12468' },
  { id: 'http://purl.jp/bio/4/id/200906085331650597' },
  { id: 'http://purl.org/sig/ont/fma/fma7195' },
  { id: 'http://purl.bioontology.org/ontology/LNC/LP199934-3' },
  { id: 'http://purl.bioontology.org/ontology/LNC/LA4579-4' },
  { id: 'http://purl.bioontology.org/ontology/LNC/MTHU008683' },
  { id: 'http://purl.bioontology.org/ontology/LNC/LP7407-2' },
  { id: 'http://purl.bioontology.org/ontology/RCD/7N225' },
  { id: 'http://purl.bioontology.org/ontology/MESH/D008168' },
  { id: 'http://purl.bioontology.org/ontology/OMIM/MTHU016106' },
  { id: 'http://purl.bioontology.org/ontology/OMIM/MTHU000106' },
  { id: 'http://purl.bioontology.org/ontology/CSP/2612-7088' },
  { id: 'http://radlex.org/RID/RID1301' },
  { id: 'http://purl.obolibrary.org/obo/BTO_0000763' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.jp/bio/11/meo/MEO_0000506' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/XAO_0000119' },
  { id: 'http://purl.org/sig/ont/fma/fma7195' },
  { id: 'http://phenomebrowser.net/ontologies/mesh/mesh.owl#D008168' },
  { id: 'http://phenomebrowser.net/ontologies/mesh/mesh.owl#A04.411' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://www.ebi.ac.uk/efo/EFO_0000934' },
  { id: 'http://purl.obolibrary.org/obo/BTO_0000763' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://scai.fraunhofer.de/CSEO#Lung' },
  { id: 'http://ontology.apa.org/apaonto/termsonlyOUT%20(5).owl#Lung' },
  { id: 'http://www.co-ode.org/ontologies/galen#Lung' },
  { id: 'http://sig.uw.edu/fma#Lung' },
  { id: 'http://www.icn.ch/icnp#Lung' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
  { id: 'http://purl.obolibrary.org/obo/MA_0000415' },
  { id: 'http://purl.obolibrary.org/obo/UBERON_0002048' },
];
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
    minWidth: 400,
  },
  searchInput: {
    width: 400,
    marginLeft: theme.spacing(3),
  },
  searchButton: {
    background: '#E3E0D8',
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
}));

export default function Form(props) {
  const classes = materialUseStyles();
  const { postQuestion } = props;
  const [searchResults, setSearchResults] = useState(data);
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

  const handleSearch = () => {
    setShowSearchResults(true);
  };

  const handleQuestionType = async e => {
    setQuestionType(e.target.value);
    postQuestion({ ...formInput, questionType: e.target.value });
  };

  const handleSearchInput = e => {
    setSearchTerm(e.target.value);
  };

  const handleSelection = termIndex => {
    let newSelected;
    if (typeof termIndex === 'number') {
      newSelected = { ...selectedTerms };
      if (selectedTerms) {
        newSelected[searchTerm] = searchResults[termIndex];
      } else {
        newSelected = { [searchTerm]: searchResults[termIndex] };
      }
      setTermSelection(newSelected);
      setShowSearchResults(false);
      setSearchResults([]);
    }
    postQuestion({ ...formInput, selectedTerms: newSelected });
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
  const handleDeleteSelectedTerm = () => {};

  const handleQuestion = e => {
    setQuestion(e.target.value);
    postQuestion({ ...formInput, question: e.target.value });
  };

  return (
    <div className={classes.root}>
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
              Anotomic Location
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
          <TextField
            className={classes.searchInput}
            placeholder="Search terms"
            onChange={handleSearchInput}
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
          labelPlacement="start"
          onChange={e => {
            setshowConfidence(e.target.value);
          }}
        />
      </div>
      {showSearchResults && (
        <SearchResults
          results={searchResults}
          open={showSearchResults}
          handleSelection={handleSelection}
          handleClose={() => setShowSearchResults(false)}
          term={searchTerm}
        />
      )}
    </div>
  );
}

Form.propTypes = {
  postQuestion: PropTypes.func,
};
