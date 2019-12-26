var conv = new showdown.Converter({emoji: true});


function BODYtoMKDW(divid) {
    var txt = document.getElementById(divid).innerHTML;
    console.log(txt);
    document.getElementById(divid).innerHTML = conv.makeHtml(txt);
}

function contentFromFile(filename, elemToAppend){
    // Create new div under body
    var elem = document.createElement('div');
    elem.setAttribute("id", filename);
    elemToAppend.appendChild(elem);

    // Get file and put on new div created
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          responseMD = this.responseText;
          responseHTML = conv.makeHtml(responseMD)
          document.getElementById(filename).innerHTML = responseHTML;
          renderMathInElement(elem, {delimiters:[{left: "$", right: "$", display: false}, 
                                                 {left: "$\\", right: "\\$", display: true}]});
        }
        if (this.status == 404) {
          document.getElementById(filename).innerHTML = "Page not found.";
        }
      }
    }
    xhttp.open("GET", filename, true);
    xhttp.send();
}
