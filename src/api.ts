import axios from 'axios';

export default axios.create({
  baseURL: 'https://lumi-display-backend.onrender.com/api',
});
