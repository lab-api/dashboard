    function get (url, callback=null){
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

    function setAttributes(elem, obj) {
        for (var prop in obj) {
          elem.setAttribute(prop, obj[prop])
        }
    }

    function updateParameter(name, prefix) {
        text = document.getElementById(`'${name}'-value`).value;
        url = prefix.concat(name, '/set/', text)
        get(url)
    }

    function updateValue(name, val) {
      document.getElementById(`'${name}'-value`).value = val
    }

    function createPartial(func /*, 0..n args */) {
    	var args = Array.prototype.slice.call(arguments, 1);
    	return function() {
    		var allArguments = args.concat(Array.prototype.slice.call(arguments));
    		return func.apply(this, allArguments);
    	};
    }

    function refreshParameter(name, prefix, container) {
        get(prefix.concat(name, '/get'), callback=createPartial(updateValue, name))
    }

    function widget(name, value, prefix) {
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
      setAttributes(text, {
        "type": "text",
        "class": "form-control",
        "id": `'${name}'-value`,
        "value": value
      })

      new_widget.appendChild(text)

      var append = document.createElement('div')
      append.setAttribute("class", "input-group-append")

      var updateButton = document.createElement('button')
      setAttributes(updateButton, {
        "class": "btn btn-outline-secondary",
        "type": "button",
        "onclick": `updateParameter('${name}', '${prefix}');`
      })
      updateButton.innerHTML = "Update"
      append.appendChild(updateButton)

      var refreshButton = document.createElement('button')
      setAttributes(updateButton, {
        "class": "btn btn-outline-secondary",
        "type": "button",
        "onclick": `refreshParameter('${name}', '${prefix}');`
      })
      refreshButton.innerHTML = "Refresh"
      append.appendChild(refreshButton)

      new_widget.appendChild(append)
      container.appendChild(new_widget)

      text.addEventListener("keyup", function(event) {
              event.preventDefault();
              if (event.key === 'Enter' && event.shiftKey) {
                updateButton.click()
              }
            });

    }


  function createWidgets(parameters) {
    for (var key in parameters) {
      if (typeof(parameters[key]) == "number"){
        widget(key, parameters[key], prefix='/parameters/', container=document.getElementById('parameters'))

      }
      else {
        instrument_parameters = parameters[key]
        prefix = `/instruments/${key}/parameters/`

        header = document.createElement("button")

        setAttributes(header, {
          "class": "btn btn-primary",
          "data-toggle": "collapse",
          "data-target": `#${key}`,
          "aria-controls": key,
          "aria-expanded": "true"
        })
        header.innerHTML = key

        div = document.createElement("div")
        setAttributes(div, {
          "class": "collapse show",
          "id": key
        })

        document.getElementById("parameters").appendChild(header)
        document.getElementById("parameters").appendChild(div)

        console.log(header)
        for (var inst_key in instrument_parameters) {
          widget(inst_key, instrument_parameters[inst_key], prefix=prefix, container=div)
        }

      }
    }
  }
