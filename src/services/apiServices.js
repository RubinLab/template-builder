import axios from 'axios';
import config from './keys';

const REST_URL = 'http://data.bioontology.org';

const getCollectionResults = (keyword, ontologiesList, page) => {
  let params = `/search?q=${keyword}`;
  if (
    ontologiesList &&
    ontologiesList.length > 0 &&
    ontologiesList.length < 5
  ) {
    params = `${params}&ontologies=${ontologiesList.join(',')}`;
  } else if (!ontologiesList)
    params = `${params}&ontologies=NCIT,SNOMEDCT,ICD10,RADLEX`;
  else if (!ontologiesList.length > 4)
    params = `${params}&ontologies=NCIT,SNOMEDCT,ICD10,RADLEX`;
  if (page) params = `${params}&page=${page}`;
  return axios.get(
    `${REST_URL}${params}&pagesize=150&display=prefLabel,synonym,definition,notation,cui,semanticType,properties`,
    {
      headers: { Authorization: `apikey token=${config.API_KEY}` }
    }
  );
};

const getDetail = (ontology, url) => {
  const encodedURL = url;
  return axios.get(
    `${REST_URL}/ontologies/${ontology}/classes/${encodedURL}?display=all`,
    {
      headers: { Authorization: `apikey token=${config.API_KEY}` }
    }
  );
};

const getSelectedDetails = (ontology, url) => {
  return axios.get(`${REST_URL}/ontologies/${ontology}/${url}?display=all`, {
    headers: { Authorization: `apikey token=${config.API_KEY}` }
  });
};

export { getCollectionResults, getSelectedDetails, getDetail };
