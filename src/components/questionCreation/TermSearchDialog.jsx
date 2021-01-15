import React from 'react';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import TermSearch from './TermSearch.jsx';
import PopupDialog from './common/PopupDialog.jsx';

// const useStyles = makeStyles(theme => ({
//   accordionRoot: {
//     width: '100%'
//   },
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     fontWeight: theme.typography.fontWeightBold
//   },
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     width: 500
//     // color: 'green'
//     // flexGrow: 1
//   },
//   attributes: {
//     color: '#3f51b5'
//   },
//   inputGroup: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     flexWrap: 'wrap'
//   },
//   searchGroup: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%'
//     // flexDirection: 'column'
//   },
//   searchInput: {
//     width: 400,
//     marginTop: theme.spacing(1.5)
//   },
//   entryInput: {
//     width: 300,
//     marginTop: theme.spacing(1.5)
//   },
//   searchButton: {
//     width: 'fit-content',
//     background: '#E3E0D8',
//     height: 'fit-content',
//     marginLeft: theme.spacing(1),
//     padding: theme.spacing(1),
//     '&:hover': {
//       background: '#CCBC8E'
//     }
//   },
//   textField: {
//     marginTop: theme.spacing(1),
//     minWidth: 300,
//     width: 400
//   },
//   searchLink: {
//     marginTop: theme.spacing(1),
//     // color: '#f50057',
//     fontSize: theme.typography.pxToRem(15),
//     textAlign: 'inherit'
//   },
//   linkWrap: {
//     marginTop: theme.spacing(2)
//     // background: '#E3E0D8'
//   },
//   epadTitle: {
//     color: '#3f51b5',
//     fontWeight: '500'
//   },
//   explanation: {
//     marginTop: theme.spacing(2)
//   },
//   wrap: {
//     paddingLeft: theme.spacing(1),
//     paddingRight: theme.spacing(1)
//   }
// }));

const TermSearchDialog = props => {
  // const classes = useStyles();
  const {
    handleBioportalSearch,
    ontologyLibs,
    handleSearchInput,
    handleOntologyInput,
    searchTerm,
    saveTerm,
    getUploadedTerms,
    onCancel,
    ontology,
    searchStatus,
    open
  } = props;

  return (
    <PopupDialog onCancel={onCancel} open={open}>
      <TermSearch
        handleBioportalSearch={handleBioportalSearch}
        ontologyLibs={ontologyLibs}
        handleSearchInput={handleSearchInput}
        handleOntologyInput={handleOntologyInput}
        searchTerm={searchTerm}
        saveTerm={saveTerm}
        getUploadedTerms={getUploadedTerms}
        ontology={ontology}
        searchStatus={searchStatus}
      />
    </PopupDialog>
  );
};

export default TermSearchDialog;

TermSearchDialog.propTypes = {
  onCancel: PropTypes.func,
  open: PropTypes.bool,
  handleBioportalSearch: PropTypes.func,
  ontologyLibs: PropTypes.object,
  handleSearchInput: PropTypes.func,
  handleOntologyInput: PropTypes.func,
  searchTerm: PropTypes.string,
  saveTerm: PropTypes.func,
  getUploadedTerms: PropTypes.func,
  ontology: PropTypes.string,
  searchStatus: PropTypes.object
};
