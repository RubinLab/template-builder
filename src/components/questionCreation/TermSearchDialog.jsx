import React from 'react';
import PropTypes from 'prop-types';
import TermSearch from './TermSearch.jsx';
import PopupDialog from './common/PopupDialog.jsx';

const TermSearchDialog = props => {
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
    open,
    authors,
    templateName,
    templateUID
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
        authors={authors}
        templateName={templateName}
        templateUID={templateUID}
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
  searchStatus: PropTypes.object,
  authors: PropTypes.string,
  templateName: PropTypes.string,
  templateUID: PropTypes.string
};
