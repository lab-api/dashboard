import axios from 'axios'

export function get (url, callback=(response)=>null) {
  axios.get(url).then((response) => callback(response.data))
}

export function post(url, payload={}, callback=(response)=>null) {
  axios.post(url, payload).then((response)=>callback(response.data))
}
