import axios from 'axios';
import config from './keys';

const REST_URL = 'http://data.bioontology.org';

const getResults = (keyword, ontologiesList, page) => {
  let params = `/search?q=${keyword}`;
  if (ontologiesList && ontologiesList.length > 0) {
    params = `${params}&ontologies=${ontologiesList.join(',')}`;
  }
  if (page) params = `${params}&page=${page}`;
  console.log(params);
  return axios.get(
    `${REST_URL}${params}&pagesize=150&display=prefLabel,synonym,definition,notation,cui,semanticType,properties`,
    // `http://data.bioontology.org/ontologies/RADLEX/classes/http%3A%2F%2Fradlex.org%2FRID%2FRID1301?display=all`,
    {
      headers: { Authorization: `apikey token=${config.API_KEY}` }
    }
  );
};

const getOntologyData = () => {
  return axios.get(`${REST_URL}/ontologies`, {
    headers: { Authorization: `apikey token=${config.API_KEY}` }
  });
};

export { getResults, getOntologyData };
