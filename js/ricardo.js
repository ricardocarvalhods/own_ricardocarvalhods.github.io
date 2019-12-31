showdown.extension('codehighlight', function() {
  function htmlunencode(text) {
    return (
      text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
      );
  }
  return [
    {
      type: 'output',
      filter: function (text, converter, options) {
        // use new shodown's regexp engine to conditionally parse codeblocks
        var left  = '<pre><code\\b[^>]*>',
            right = '</code></pre>',
            flags = 'g',
            replacement = function (wholeMatch, match, left, right) {
              // unescape match to prevent double escaping
              match = htmlunencode(match);
              return left + hljs.highlightAuto(match).value + right;
            };
        return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
      }
    }
  ];
});

showdown.setFlavor('github');

var conv = new showdown.Converter({emoji: true, underline:true, extensions: ['codehighlight']});


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
        var dateParts = i_date.split("/");
        var new_i_date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        parsed_i_date = monthNames[new_i_date.getMonth()] + " " + new_i_date.getDate() + ", " + new_i_date.getFullYear();
          
        counter_html = ""
        //counter_html = " &nbsp; &middot; &nbsp; <i class='fa fa-comments'></i> <span class='disqus-comment-count' data-disqus-identifier='ricardocarvalhods/html/page?" + folder + "/" + name_without_dot + "'> Comments</span>"
        final_mkdw = final_mkdw + "[" + i_title + "](html/page?" + folder + "/" + name_without_dot +  ") " + counter_html  + " <br/> <small style='color:gray'>" + parsed_i_date + "</small>" + " <br/><br/>"
    }
    document.getElementById(folder).innerHTML = conv.makeHtml(final_mkdw);
    
    DISQUSWIDGETS.getCount({reset: true});
    
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
