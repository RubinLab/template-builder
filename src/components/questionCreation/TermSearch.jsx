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
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import { useSnackbar } from 'notistack';

const ontologyMap = JSON.parse(sessionStorage.getItem('ontologyMap'));

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
    getUploadedTerms,
    handleClose
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
      const shapedData = {};
      data.forEach(el => {
        shapedData[el.codeValue] = {
          allowedTerm: el,
          title: el.codingSchemeDesignator,
          id: el.codeValue
        };
      });
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
        <p>
          Upload CSV file with the columns of
          <span className={classes.attributes}> codeMeaning, codeValue</span>,
          and
          <span className={classes.attributes}> codingSchemeDesignator</span>
        </p>
      </div>
    );
  };

  const bioPortalSearch = () => {
    return (
      <div className={classes.searchGroup}>
        <div className={classes.inputGroup}>
          <Autocomplete
            options={JSON.parse(sessionStorage.getItem('searchedTerms')) || []}
            value={searchTerm}
            onChange={(_, data) => handleSearchInput(null, data)}
            onInputChange={handleSearchInput}
            style={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                className={classes.searchInput}
                placeholder="Search term"
              />
            )}
          />
          <Autocomplete
            multiple
            size="small"
            options={ontologyMap ? Object.values(ontologyMap) : []}
            renderOption={option => (
              <React.Fragment>
                {option.name} ({option.acronym})
              </React.Fragment>
            )}
            getOptionLabel={option => option.acronym || ''}
            onChange={(_, data) => handleOntologyInput(null, data)}
            onInputChange={handleOntologyInput}
            style={{ width: 300 }}
            value={ontologyLibs || []}
            renderInput={params => (
              <TextField
                {...params}
                className={classes.searchInput}
                placeholder={
                  !ontologyLibs || ontologyLibs.length === 0
                    ? 'Choose Ontology'
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
    );
  };

  const ePADSearch = () => {
    return (
      <div className={classes.accordionRoot}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Search term in ePAD lexicon
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.searchGroup}>
              <div className={classes.inputGroup}>
                <TextField
                  className={classes.entryInput}
                  placeholder="Search term"
                />
              </div>
              <IconButton
                className={classes.searchButton}
                onClick={() => console.log('clicked')}
              >
                <Search />
              </IconButton>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Save term to ePAD lexicon
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.searchGroup}>
              <div className={classes.inputGroup}>
                <TextField className={classes.entryInput} placeholder="Term" />
                <TextField
                  className={classes.entryInput}
                  placeholder="Unique code"
                />
              </div>
              <IconButton
                className={classes.searchButton}
                onClick={() => console.log('clicked')}
              >
                <SaveIcon />
              </IconButton>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
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
            >
              <Tab label="BioPortal" {...a11yProps(0)} />
              <Tab label="ePAD" {...a11yProps(1)} />
              <Tab label="Upload" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {bioPortalSearch()}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {ePADSearch()}
          </TabPanel>
          <TabPanel value={value} index={2}>
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
  getUploadedTerms: PropTypes.func,
  handleClose: PropTypes.func
};
