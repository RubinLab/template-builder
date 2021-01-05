import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CSVReader from 'react-csv-reader';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Search from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import SaveIcon from '@material-ui/icons/Save';
import { useSnackbar } from 'notistack';
import { ontologies, shapeSelectedTermData } from '../../utils/helper';

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true
  //   transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  accordionRoot: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
    // color: 'green'
    // flexGrow: 1
  },
  attributes: {
    color: '#3f51b5'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
    // flexDirection: 'column'
  },
  searchInput: {
    width: 400,
    marginTop: theme.spacing(1.5)
  },
  entryInput: {
    width: 300,
    marginTop: theme.spacing(1.5)
  },
  searchButton: {
    width: 'fit-content',
    background: '#E3E0D8',
    height: 'fit-content',
    padding: theme.spacing(1),
    '&:hover': {
      background: '#CCBC8E'
    }
  },
  textField: {
    marginTop: theme.spacing(1),
    minWidth: 300,
    width: 400
  },
  searchLink: {
    marginTop: theme.spacing(1),
    // color: '#f50057',
    fontSize: theme.typography.pxToRem(15),
    textAlign: 'inherit'
  },
  linkWrap: {
    marginTop: theme.spacing(2)
    // background: '#E3E0D8'
  },
  epadTitle: {
    color: '#3f51b5',
    fontWeight: '500'
  },
  explanation: {
    marginTop: theme.spacing(2)
  }
}));

const TermSearch = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleBioportalSearch,
    ontologyLibs,
    handleSearchInput,
    handleOntologyInput,
    searchTerm,
    saveTerm,
    getUploadedTerms,
    handleClose,
    ontology,
    searchStatus
  } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const checkAllowedTermsAttributes = attribute => {
    const errors = [];
    const allowedAttributes = [
      'codeMeaning',
      'codeValue',
      'codingSchemeDesignator',
      'codingSchemeVersion',
      'defaultAnswer',
      'nextId',
      'noMoreQuestions',
      'CharacteristicQuantification'
    ];

    const requiredAttributes = [
      'codeMeaning',
      'codeValue',
      'codingSchemeDesignator'
    ];
    const keys = Object.keys(attribute);

    keys.forEach(attr => {
      if (!allowedAttributes.includes(attr)) {
        errors.push(`${attr} is not an allowed key!`);
        enqueueSnackbar(`${attr} is not an allowed key!`, { variant: 'error' });
      }
    });

    requiredAttributes.forEach(el => {
      if (!keys.includes(el)) {
        errors.push(`${el} is required!`);
        enqueueSnackbar(`${el} is required!`, { variant: 'error' });
      }
    });

    return errors.length === 0;
  };

  const handleUpload = data => {
    if (checkAllowedTermsAttributes(data[0])) {
      const shapedData = shapeSelectedTermData(data);
      getUploadedTerms(shapedData);
    }
  };

  const upload = () => {
    return (
      <div className="container">
        <CSVReader
          cssClass="react-csv-input"
          onFileLoaded={handleUpload}
          parserOptions={papaparseOptions}
        />
        <p className={classes.explanation}>
          Upload CSV file with the columns of
          <span className={classes.attributes}> codeMeaning, codeValue</span>,
          and
          <span className={classes.attributes}> codingSchemeDesignator</span>
        </p>
      </div>
    );
  };

  const selectedOntologies = () => {
    let selectValue = [];
    if (ontologyLibs && ontologyLibs.length > 0) {
      selectValue = ontologyLibs;
    } else if (ontology) {
      selectValue = [ontologies[ontology]];
    }
    return selectValue;
  };

  const renderSearchOptions = () => {
    const { status } = searchStatus;
    const newSearch = status === 'showOther' || status === 'suggestAddEpad';
    let node;
    if (newSearch) {
      node = (
        <>
          <Typography>{searchStatus.explanation}</Typography>
          <Link
            component="button"
            variant="body2"
            onClick={searchStatus.onClick}
            className={classes.searchLink}
          >
            {searchStatus.link}
          </Link>
        </>
      );
    } else if (status === 'showEpadSearch') {
      node = (
        <>
          <Typography className={classes.epadTitle}>
            {searchStatus.explanation}
          </Typography>
          <div className={classes.searchGroup}>
            <div className={classes.inputGroup}>
              <TextField
                className={classes.searchInput}
                // placeholder="Search term"
                defaultValue={searchTerm}
              />
            </div>
            <IconButton
              className={classes.searchButton}
              onClick={() => searchStatus.onClick(searchTerm.trim())}
            >
              <Search />
            </IconButton>
          </div>
        </>
      );
    } else if (status === 'showEpadAdd') {
      node = (
        <>
          <Typography className={classes.epadTitle}>
            {searchStatus.explanation}
          </Typography>
          <div className={classes.searchGroup}>
            <div className={classes.inputGroup}>
              <TextField
                className={classes.searchInput}
                // placeholder="Term"
                defaultValue={searchTerm}
              />
            </div>
            <IconButton className={classes.searchButton} onClick={saveTerm}>
              <SaveIcon />
            </IconButton>
          </div>
        </>
      );
    }
    return <div className={classes.linkWrap}> {node} </div>;
  };

  const bioPortalSearch = () => {
    return (
      <>
        <div className={classes.searchGroup}>
          <div className={classes.inputGroup}>
            <TextField
              value={searchTerm}
              onChange={handleSearchInput}
              className={classes.searchInput}
              placeholder="Search term"
            />

            <Autocomplete
              multiple
              size="small"
              options={ontologies ? Object.values(ontologies) : []}
              renderOption={option => (
                <React.Fragment>
                  {option.name} ({option.acronym})
                </React.Fragment>
              )}
              getOptionLabel={option => option.acronym || ''}
              onChange={(_, data) => handleOntologyInput(null, data)}
              onInputChange={handleOntologyInput}
              style={{ width: 300 }}
              value={selectedOntologies()}
              renderInput={params => (
                <TextField
                  {...params}
                  className={classes.searchInput}
                  placeholder={
                    selectedOntologies().length < 3
                      ? `Choose ${
                          ontology || selectedOntologies().length > 0
                            ? 'more'
                            : 'an'
                        } ontology`
                      : ''
                  }
                />
              )}
            />
          </div>
          <IconButton
            className={classes.searchButton}
            onClick={handleBioportalSearch}
          >
            <Search />
          </IconButton>
        </div>
        {searchStatus.status && renderSearchOptions()}
      </>
    );
  };

  return (
    <Dialog open={true}>
      <DialogContent>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Term Search" {...a11yProps(0)} />
              <Tab label="upload Term" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {bioPortalSearch()}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {upload()}
          </TabPanel>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermSearch;

TermSearch.propTypes = {
  handleBioportalSearch: PropTypes.func,
  ontologyLibs: PropTypes.object,
  handleSearchInput: PropTypes.func,
  handleOntologyInput: PropTypes.func,
  searchTerm: PropTypes.string,
  saveTerm: PropTypes.func,
  getUploadedTerms: PropTypes.func,
  handleClose: PropTypes.func,
  ontology: PropTypes.string,
  searchStatus: PropTypes.object
};
