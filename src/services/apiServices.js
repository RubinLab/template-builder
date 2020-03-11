import axios from 'axios';
import config from './config';

const getResults = keyword => {
  axios.get('https://developer.nps.gov/api/v0/parks?parkCode=yell', {
    headers: { Authorization: `apikey token=${config.API_KEY}` },
  });
};

const getInfo = () => {};

export { getResults, getInfo };
