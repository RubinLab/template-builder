import axios from 'axios';
import config from './keys';

const REST_URL = 'http://data.bioontology.org';

const getResults = (keyword, page, ontologiesList) => {
  let params = `/search?q=${keyword}`;
  if (ontologiesList) {
    const ontologies =
      ontologiesList && ontologiesList.length > 1
        ? ontologiesList.join(',')
        : ontologiesList[0];
    params = `${params}&ontologies=${ontologies}`;
  }
  if (page) params = `${params}&page=${page}`;
  return axios.get(`${REST_URL}${params}&pagesize=150`, {
    headers: { Authorization: `apikey token=${config.API_KEY}` },
  });
};

const getOntologyData = () => {
  return axios.get(`${REST_URL}/ontologies`, {
    headers: { Authorization: `apikey token=${config.API_KEY}` },
  });
};

export { getResults, getOntologyData };
