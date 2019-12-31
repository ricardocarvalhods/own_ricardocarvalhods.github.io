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
          document.getElementById(filename).innerHTML = responseMD;
          renderMathInElement(elem, {delimiters:[{left: "$", right: "$", display: false}, 
                                                 {left: "$\\", right: "\\$", display: true}]});
          responseHTML = conv.makeHtml(document.getElementById(filename).innerHTML)
          document.getElementById(filename).innerHTML = responseHTML
        }
        if (this.status == 404) {
          document.getElementById(filename).innerHTML = "Page not found.";
        }
      }
    }
    xhttp.open("GET", filename, true);
    xhttp.send();
}

function loadTitlesFromFolder(folder){
    fetch('https://api.github.com/repos/ricardocarvalhods/ricardocarvalhods.github.io/contents/' + folder)
      .then(response => response.json())
      .then(data => {
    data.sort((a, b) => (b.name > a.name) ? 1 : -1);
    final_mkdw = ""
    for(data_i in data){
        name_without_dot = data[data_i].name.split(".")[0];
        name_split = name_without_dot.split("-");
        i_date = ""
        i_title = ""
        for(vl in name_split){
        if(vl == 0){
            i_date = name_split[vl]	
        }
            else if(vl == 1 || vl == 2){
                i_date = name_split[vl] + "/" + i_date
        }
        else if(vl == 3){
            i_title = name_split[vl]
        }
        else if(vl > 3){
            i_title = i_title + " " + name_split[vl]
        }
        }
        final_mkdw = final_mkdw + "- **" + i_date + "**: [" + i_title + "](html/page?" + folder + "/" + name_without_dot +  ") \n"
    }
    document.getElementById(folder).innerHTML = conv.makeHtml(final_mkdw);
    //console.log(final_mkdw)
    }).catch(error => console.error(error))
 }

function loadFolder(folder){
    fetch('https://api.github.com/repos/ricardocarvalhods/ricardocarvalhods.github.io/contents/' + folder)
      .then(response => response.json())
      .then(data => {
    for(data_i in data){
        contentFromFile(folder + '/' + data[data_i].name, document.getElementById(folder + 'content'))
    }
    //console.log(data)
    }).catch(error => console.error(error))
}
