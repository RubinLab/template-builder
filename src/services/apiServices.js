import axios from 'axios';
import formurlencoded from 'form-urlencoded';
import config from './keys';
import { ontologies } from '../utils/helper';

const BIOPORTAL_URL = 'http://data.bioontology.org';
const EPAD_URL = 'http://localhost:8080';

const validatOntologyFilter = list => {
  let result = [];
  console.log(list);
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

const getCollectionResults = (keyword, ontologiesList, page) => {
  let params = `/search?q=${keyword}`;
  const ontologyFilter = validatOntologyFilter(ontologiesList);
  params = `${params}&ontologies=${ontologyFilter}`;
  if (page) params = `${params}&page=${page}`;
  return axios.get(
    `${BIOPORTAL_URL}${params}&pagesize=150&display=prefLabel,synonym,definition,notation,cui,semanticType,properties`,
    {
      headers: { Authorization: `apikey token=${config.API_KEY}` }
    }
  );
};

const getDetail = (ontology, url) => {
  const encodedURL = formurlencoded({ url })
    .split('=')
    .pop();
  return axios.get(
    `${BIOPORTAL_URL}/ontologies/${ontology}/classes/${encodedURL}?display=all`,
    {
      headers: { Authorization: `apikey token=${config.API_KEY}` }
    }
  );
};

const getSelectedDetails = (ontology, url) => {
  return axios.get(
    `${BIOPORTAL_URL}/ontologies/${ontology}/${url}?display=all`,
    {
      headers: { Authorization: `apikey token=${config.API_KEY}` }
    }
  );
};

const getTermFromEPAD = term => {
  return axios.get(`${EPAD_URL}/ontology?CODE_MEANING=${term}`);
};

export { getCollectionResults, getSelectedDetails, getDetail, getTermFromEPAD };
