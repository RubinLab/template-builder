import formurlencoded from 'form-urlencoded';
import axios from 'axios';
import { ontologies } from '../utils/helper';

const BIOPORTAL_URL = 'http://data.bioontology.org';
// const EPAD_URL = 'http://localhost:8080';
const EPAD_URL = 'http://ch4.local:8080';

const validatOntologyFilter = list => {
  let result = [];
  // if there isn't any ontology filter search in all supported ontologies
  if (!list || list.length === 0) result = Object.keys(ontologies);
  // if there is a ontologies list, search in only supported ones
  else if (list && list.length > 0) {
    list.forEach(el => {
      if (ontologies[el]) result.push(el);
    });
  }
  return result.join(',');
};

const getCollectionResults = (keyword, keys, ontologiesList, page) => {
  let params = `/search?q=${keyword}`;
  const ontologyFilter = validatOntologyFilter(ontologiesList);
  params = `${params}&ontologies=${ontologyFilter}`;
  if (page) params = `${params}&page=${page}`;
  return axios.get(
    `${BIOPORTAL_URL}${params}&pagesize=150&display=prefLabel,synonym,definition,notation,cui,semanticType,properties`,
    {
      headers: { Authorization: `apikey token=${keys.bioportal}` }
    }
  );
};

const getDetail = (ontology, url, keys) => {
  const encodedURL = formurlencoded({ url })
    .split('=')
    .pop();
  return axios.get(
    `${BIOPORTAL_URL}/ontologies/${ontology}/classes/${encodedURL}?display=all`,
    {
      headers: { Authorization: `apikey token=${keys.bioportal}` }
    }
  );
};

const getSelectedDetails = (ontology, url, keys) => {
  return axios.get(
    `${BIOPORTAL_URL}/ontologies/${ontology}/${url}?display=all`,
    {
      headers: { Authorization: `apikey token=${keys.bioportal}` }
    }
  );
};

const getTermFromEPAD = (term, keys) => {
  return axios.get(`${EPAD_URL}/ontology?codemeaning=${term}`, {
    headers: { Authorization: `apikey ${keys.epad}` }
  });
};

const insertTermToEPAD = (
  codemeaning,
  description,
  creator,
  referencename,
  referenceuid,
  referencetype,
  keys
) => {
  return axios.post(
    `${EPAD_URL}/ontology`,
    {
      codemeaning,
      description,
      creator,
      referencename,
      referenceuid,
      referencetype
    },
    {
      headers: { Authorization: `apikey ${keys.epad}` }
    }
  );
};

const getAPIKey = appid => {
  return axios.get(`${EPAD_URL}/apikeys/${appid}`);
};

export {
  getCollectionResults,
  getSelectedDetails,
  getDetail,
  getTermFromEPAD,
  insertTermToEPAD,
  getAPIKey
};
