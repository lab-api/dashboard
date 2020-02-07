import axios from 'axios'

export function get (url, callback) {
  console.log(url)
  const resp = axios.get(url)
  if (typeof(callback) != 'undefined') {
    resp.then((response)=> {
      callback(response.data)
    })
  }

}

export function post(url, payload={}, callback=(response)=>null) {
  axios.post(url, payload).then((response)=> {
    callback(response.data)
  })
}
