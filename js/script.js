
//const funcClosematches = require("./editdistance")
require(["./editDistance folder/levenshtein","//d3js.org/d3.v3.min.js"], function(levenshtein){

  frequency("the");

  window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
  
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            //console.log(this.files[0]);
           tesseract(this.files[0]);
        }
    });
  });
var promiseDict = (fetch("housing_dictionary/index.json")
  .then(response => response.json())
  .then(json => {
    //document.getElementById('main').innerHTML = JSON.stringify(json);

    var dictionaryInside = new Set(json);

    console.log(json);
    console.log(dictionaryInside);
    return dictionaryInside;
  }));

const  doesItExist = async (word) => {
  //var WordWithExistance;
  var dictionary = await promiseDict;
  
  
  
  //document.getElementById("outputTesseract").innerHTML = WordWithExistance;
  //
  /*if(!(dictionary.has(word)))
      funcClosematches(word);
  */
  // want to return the string wordWithExistance

  //replace returning a string into returning bool true or false

  //WordWithExistance = word + " exists: " + (dictionary.has(word)).toString();
  //return WordWithExistance;

  return dictionary.has(word);

};

const alternativeWords = async (word) => {
  var dictionary = await promiseDict;
  var MAX = 1;
  //console.log(dictionary);
  //console.log(dictionary.size);
  var stringA = word;
  //console.log(stringA); // don't need to really declare other variable 
  const altwords = [];
  let i = 0;
  dictionary.forEach (function(stringB) {
    //var stringB = value;
    var insert = remove = function(char) { return 1; };
    var update = function(charA, charB) { return charA !== charB ? 1 : 0; };
    if (levenshtein(stringA, stringB, insert, remove, update).distance <= MAX){
      //console.log(stringB);
      altwords[i] = stringB;
      i++;
    }
  })
  console.log(altwords);
  /*if (altwords.length == 0){
    console.log("0 it is.");
    console.log([""]);
    return [""];
  }*/
    
  return altwords;
}


function output_image(val) {
  var src = val;
  show_image(src, 276, 110, "Google Logo");
}

function tesseract(val) {
  //'img/a01-000u-1.1.png'
  Tesseract.recognize(
    val,
    'eng', {
      logger: m => {
        if (m.status == "recognizing text") {
          console.log(m);
          jump(m.progress * 100);
        }

      }
    }
    // here is where i should access the logger information
  ).then(async({
    data
  }) => {
    console.log(data.words);
    var element = document.getElementById("outputTesseract");
    element.innerHTML = "";
    for (let i = 0; i < data.words.length; i++) {
      //var outputText = i.toString();
      var cleanedWord = clean_up_word(data.words[i].text)
      var existanceResult = await doesItExist(cleanedWord);
      
      var tag;
      if(!existanceResult){
        const altArray = await (alternativeWords(cleanedWord));
        console.log(altArray);
        tag = document.createElement("select");
        var text;
        if(altArray.length != 0){ 

          for (let j = 0; j < 4; j++) // number of options is currently hard coded
          {
            var option = document.createElement("option");
            //let length = altwordArray.length;
            if(!j)
              text = document.createTextNode(data.words[i].text);
            else{
              if(altArray.length >= j){
                text = document.createTextNode(altArray[j-1]);
                console.log(altArray[j-1]);
                console.log(j-1);
              }
              else
                text = document.createTextNode("alternative word don't exist");
            }
              
            option.appendChild(text);
            tag.appendChild(option);
          }
        }
        else{
          tag = document.createElement("span");
        }
      }
      else{
        tag = document.createElement("span");
      } 
        var text = document.createTextNode(data.words[i].text + " ");
        tag.appendChild(text);
      if(!existanceResult)
        tag.classList.add("false");
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

function clean_up_word(word) {
  var updatedWord = word.toLowerCase();

  var finalString, firstWord, secondWord;
  var posOfDash = 0;

  if (/[\-]/.test(updatedWord)) {
    posOfDash = updatedWord.indexOf("-");
    //https://stackoverflow.com/questions/22553586/javascript-string-contains-commas-and-dashes
    firstWord = updatedWord.slice(0, posOfDash);
    secondWord = updatedWord.slice(posOfDash + 1);
    console.log(updatedWord + " is made up of two other words.");
    doesItExist(firstWord);
    alternativeWords(firstWord);
    doesItExist(secondWord);
    alternativeWords(secondWord);
  }

  var punctuationless = updatedWord.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, ""); //removed /- from list to only focus on end punctutation - .,;!' etc.
  finalString = punctuationless.replace(/\s{2,}/g, " ");
  //took these two lines of code from website - https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex

  return finalString;

}

// took all this from website https://www.w3schools.com/howto/howto_js_progressbar.asp to create progress bar
/*

function frequency(file,word) {
  var database = d3.csv("..unigram_freq/mydata.csv");
  
  return frequency;
}
*/
/*var table = document.createElement("table");  

const frequency = new Map();
var word = "";
var frequencyNum = 0;

var rows = e.target.result.split("\n");

for (var i = 0; i < rows.length; i++) {
  var row = table.insertRow(-1);
  var cells = rows[i].split(",");
  for (var j = 0; j < cells.length; j++) {
      var cell = row.insertCell(-1);
      if(i){
        if(j)
          frequencyNum = parseInt(cells[j]);
        else
          word = cells[j];
      }
      cell.innerHTML = cells[j];
  }
  frequency.set(word,frequencyNum);
  var dvCSV = document.getElementById("dvCSV");
  dvCSV.innerHTML = "";
  dvCSV.appendChild(table);

*/

/*
var reader = new FileReader();
          reader.onload = function (e) {      
              var table = document.createElement("table");
              var rows = e.target.result.split("\n");
              for (var i = 0; i < rows.length; i++) {
                  var row = table.insertRow(-1);
                  var cells = rows[i].split(",");
                  for (var j = 0; j < cells.length; j++) {
                      var cell = row.insertCell(-1);
                      cell.innerHTML = cells[j];
                  }
              }
              var dvCSV = document.getElementById("dvCSV");
              dvCSV.innerHTML = "";
              dvCSV.appendChild(table);
              
          }
          reader.readAsText(fileUpload.files[0]);

*/
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

function jump(val) {
  var elem = document.getElementById("myBar");
  elem.style.width = val + "%";
}

document.getElementById("tesseractBut").addEventListener("click",function(){
  tesseract(document.getElementById('tesseract').value);
});

document.getElementById("imageBut").addEventListener("click",function(){
  output_image(document.getElementById('image').value);
});

document.getElementById("move").addEventListener("click",function(){
  move(50);
});

document.getElementById("jump").addEventListener("click",function(){
  jump(50);
});

/*document.getElementById("upload").addEventListener("click",function(){
  Upload();
});
*/


function frequency(word){
  d3.csv("./unigram_freq/unigram_freq.csv", function(data) {
    var output = "doesn't exist";
    data.forEach(function(d) {
      /* Each row has the variable name 'd': 'columns' can be accessed as object properties */
      if (d['word'] == word){
        return d['count'];
      }
        
    });

    return(output);
  });
}

});