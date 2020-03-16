import axios from 'axios';
import config from './config';

const REST_URL = 'http://data.bioontology.org';

const getResults = keyword => {
  return axios.get(`${REST_URL}/search?q=${keyword}&pagesize=150`, {
    headers: { Authorization: `apikey token=${config.API_KEY}` },
  });
};

function getTitle(url) {
  return new Promise(function(resolve) {
    axios
      .get(`https://textance.herokuapp.com/rest/title/${url}`, {
        headers: { Authorization: `apikey token=${config.API_KEY}` },
      })
      .then(res => {
        resolve({ url, title: res.data });
      })
      .catch(err => resolve({ error: err, url }));
  });
}

export { getResults, getTitle };
