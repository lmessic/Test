import axios from 'axios'

export function getData (params) {
  return axios.post('/api/graphsearch/', params)
}
