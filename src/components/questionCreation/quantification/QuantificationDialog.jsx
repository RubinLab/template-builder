import React from 'react';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import QuantificationWrap from './QuantificationWrap.jsx';
import PopupDialog from '../common/PopupDialog.jsx';

// const useStyles = makeStyles(theme => ({
//   accordionRoot: {
//     width: '100%'
//   }
// }));

const QuantificationDialog = props => {
  //   const classes = useStyles();
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
      <QuantificationWrap
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

export default QuantificationDialog;

QuantificationDialog.propTypes = {
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
