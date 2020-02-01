
export default function get (url, callback=null){
  var req = new XMLHttpRequest();
  console.log(url)
  if (callback != null)
  {
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200)
      {
        callback(req.responseText)
      }
    }
  }
  req.open("GET", url, true); // true for asynchronous
  req.send()
}
