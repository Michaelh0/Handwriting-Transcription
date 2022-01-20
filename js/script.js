//const funcClosematches = require("./editdistance")

    window.addEventListener('load', function() {
        document.querySelector('input[type="file"]').addEventListener('change', function() {
    // fix this line above

            if (this.files && this.files[0]) {
                var img = document.querySelector('img');
                img.onload = () => {
                    URL.revokeObjectURL(img.src);  // no longer needed, free memory
                }

                img.src = URL.createObjectURL(this.files[0]); // set src to blob url
                }
            });
    });

    var promiseDict = (fetch("housing_dictionary/index.json")
    .then(response => response.json())
    .then(json => 
      {
        //document.getElementById('main').innerHTML = JSON.stringify(json);
  
        var dictionaryInside = new Set(json);
  
        console.log(json);
        console.log(dictionaryInside);
        return dictionaryInside;
      }));
  
  const doesItExist = (word) =>{
      var WordWithExistance;
      promiseDict.then(dictionary => {
  
        WordWithExistance = word + " exists: " + (dictionary.has(word)).toString();
        
        //document.getElementById("outputTesseract").innerHTML = WordWithExistance;
        //
        /*if(!(dictionary.has(word)))
            funcClosematches(word);
        */
        // want to return the string wordWithExistance
      })
      return WordWithExistance;
  };



function output_image(val) {
    var src = val;
    show_image(src, 276,110, "Google Logo");
}
function tesseract(val) {
    //'img/a01-000u-1.1.png'
    Tesseract.recognize(
        val,
            'eng',
            { logger: m => {
              if (m.status == "recognizing text"){
                console.log(m);
                jump(m.progress * 100);
              }

            }
           }
            // here is where i should access the logger information
        ).then(({ data}) => {
        console.log(data.words);
        for (let i = 0; i < data.words.length; i++) {
            var outputText = i.toString();
            //doesItExist(clean_up_word(data.words[i].text));
            // can't figure out how to get values out of the promise
            var tag = document.createElement("p");
            var text = document.createTextNode(outputText);
            tag.appendChild(text);
            var element = document.getElementById("outputTesseract");
            element.appendChild(tag);

            //https://www.tutorialspoint.com/how-to-add-a-new-element-to-html-dom-in-javascript
            // need to create an array to hold all of the strings of existence and output it here
            
            //this calls exist function and lowercases the word to fit the dictionary
        }
    })  
}

/*function output_array(array,size)
{
    for (let i = 0; i < size; i++) {
        array[i];

}
*/

function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;
    document.body.appendChild(img);
}

function clean_up_word(word){
    var updatedWord = word.toLowerCase();

    var finalString, firstWord, secondWord;
    var posOfDash = 0;
    
    if (/[\-]/.test(updatedWord)){
        posOfDash = updatedWord.indexOf("-");
        //https://stackoverflow.com/questions/22553586/javascript-string-contains-commas-and-dashes
        firstWord = updatedWord.slice(0,posOfDash);
        secondWord = updatedWord.slice(posOfDash+1);
        console.log(updatedWord + " is made up of two other words.");
        doesItExist(firstWord);
        doesItExist(secondWord);
    }

    var punctuationless = updatedWord.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g,"");  //removed /- from list to only focus on end punctutation - .,;!' etc.
    finalString = punctuationless.replace(/\s{2,}/g," ");
    //took these two lines of code from website - https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex

    return finalString;

}

// took all this from website https://www.w3schools.com/howto/howto_js_progressbar.asp to create progress bar

var i = 0;
function move(val) {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, val);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}

function jump(val){
  var elem = document.getElementById("myBar");
  elem.style.width = val + "%";
}