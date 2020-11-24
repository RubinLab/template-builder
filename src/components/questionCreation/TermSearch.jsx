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
import DialogTitle from '@material-ui/core/DialogTitle';

const handleForce = (data, fileInfo) => console.log(data, fileInfo);
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
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  }
}));

const TermSearch = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const {
    handleBioportalSearch,
    ontologyLibs,
    handleSearchInput,
    handleOntologyInput,
    searchTerm
  } = props;

  const handleChange = (event, newValue) => {
    console.log('---> newValue', newValue);
    setValue(newValue);
  };

  const upload = () => {
    return (
      <div className="container">
        <CSVReader
          cssClass="react-csv-input"
          label="Select CSV with secret Death Star statistics"
          onFileLoaded={handleForce}
          parserOptions={papaparseOptions}
        />
        <p>and then open the console</p>
      </div>
    );
  };

  const bioPortalSearch = () => {
    return (
      <div className={classes.answerGroup}>
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
              placeholder="Search terms"
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
    return <div>ePAD search</div>;
  };
  return (
    <Dialog open={true}>
      <DialogTitle>Search terms</DialogTitle>
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
    </Dialog>
  );
};

export default TermSearch;

TermSearch.propTypes = {
  handleBioportalSearch: PropTypes.func,
  ontologyLibs: PropTypes.object,
  handleSearchInput: PropTypes.func,
  handleOntologyInput: PropTypes.func,
  searchTerm: PropTypes.string
};
