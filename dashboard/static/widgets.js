    function get (url, callback=null){
      console.log(url, callback)
      var req = new XMLHttpRequest();
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

    function updateParameter(name, prefix) {
        text = document.getElementById(`'${name}'-value`).value;
        url = prefix.concat(name, '/set/', text)
        get(url)
    }

    function updateValue(name, val) {
      console.log(val)
      document.getElementById(`'${name}'-value`).value = val
    }

    function createPartial(func /*, 0..n args */) {
    	var args = Array.prototype.slice.call(arguments, 1);
    	return function() {
    		var allArguments = args.concat(Array.prototype.slice.call(arguments));
    		return func.apply(this, allArguments);
    	};
    }

    function refreshParameter(name, prefix) {
        url = prefix.concat(name, '/get')
        var callback = createPartial(updateValue, name)
        get(url, callback=callback)
    }

    function widget(name, prefix) {
      var new_widget = document.createElement('div')
      new_widget.setAttribute("class", "input-group mb-3")

      var prepend = document.createElement('div')
      prepend.setAttribute("class", "input-group-prepend")
      var span = document.createElement('span')
      span.setAttribute("class", "input-group-text")
      span.innerHTML = name
      prepend.appendChild(span)
      new_widget.appendChild(prepend)

      var text = document.createElement("input")
      text.setAttribute("type", "text")
      text.setAttribute("class", "form-control")
      text.setAttribute("id", `'${name}'-value`)
      text.value = ''


      new_widget.appendChild(text)

      var append = document.createElement('div')
      append.setAttribute("class", "input-group-append")

      var updateButton = document.createElement('button')
      updateButton.setAttribute("class", "btn btn-outline-secondary")
      updateButton.setAttribute("type", "button")
      updateButton.innerHTML = "Update"
      updateButton.setAttribute("onclick", `updateParameter('${name}', '${prefix}');`)
      append.appendChild(updateButton)

      var refreshButton = document.createElement('button')
      refreshButton.setAttribute("class", "btn btn-outline-secondary")
      refreshButton.setAttribute("type", "button")
      refreshButton.innerHTML = "Refresh"
      refreshButton.setAttribute("onclick", `refreshParameter('${name}', '${prefix}');`)
      append.appendChild(refreshButton)

      new_widget.appendChild(append)
      document.body.appendChild(new_widget)

      text.addEventListener("keyup", function(event) {
              event.preventDefault();
              if (event.key === 'Enter' && event.shiftKey) {
                updateButton.click()
              }
            });

    }

  function createWidgets(arr, prefix) {
    for (i=0; i<arr.length; i++) {
      widget(arr[i], prefix=prefix)
      refreshParameter(arr[i], prefix=prefix)
    }
  }
