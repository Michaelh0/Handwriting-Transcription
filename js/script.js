
//const funcClosematches = require("./editdistance")
require(["./editDistance folder/levenshtein","//d3js.org/d3.v3.min.js"], function(levenshtein){

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
  const map = new Map();
  d3.csv("unigram_freq/unigram_freq.csv", function(data) {
    var dataset = data;
    console.log(dataset)
    data.forEach(function(d) {
      /* Each row has the variable name 'd': 'columns' can be accessed as object properties */
      map.set(d['word'], d['count']); 
    });
  });
  console.log(map);
const  doesItExist = async (word) => {
  //var WordWithExistance;
  var dictionary = await promiseDict;
  return dictionary.has(word);

};

const alternativeWords = async (word) => {
  var dictionary = await promiseDict;
  var MAX = 1;
  var stringA = word;
  const altwords = [];
  do{
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
  MAX++;
  }while(altwords.length < 3 );
  //|| MAX > 7
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

    const proccessedData = await (preProccessData(data));
    //console.log(proccessedData);
    var elementId = "outputTesseract";
    var element = document.getElementById(elementId);
    
    var pureElementId = "pureOutput";
    var pureElement = document.getElementById(pureElementId);
    element.innerHTML = "";
    pureElement.innerHTML = "";
    
    var AltwordCount = 0;
    

    
    for (let i = 0; i < data.words.length; i++) {
    
        //var outputText = i.toString();
        var cleanedWord = clean_up_word(data.words[i].text)
        var existanceResult = await doesItExist(cleanedWord);
          
          var tag;
          var tag2;
          var tagId;
          var tagId2;
          if(!existanceResult){
            const newArray = await (alternativeWords(cleanedWord));
            const altArray = sortByLikeliness(newArray);
            AltwordCount++;
            tag = document.createElement("select");
            tagId = "outputTess" + AltwordCount;
            var text;
            
            if(altArray.length != 0){ 
    
              for (let j = 0; j < 4; j++) // number of options is currently hard coded
              {
                var optionTag = document.createElement("option");
                //let length = altwordArray.length;
                if(!j)
                  text = data.words[i].text + " ";
                else{
                  if(altArray.length >= j){
                    text = altArray[j-1]+ " ";
                  }
                  else
                    text = "alternative word don't exist ";
                }
                  
                createHtml(text,elementId,optionTag,"",existanceResult,tagId);
                tag.appendChild(optionTag);
              }
              createHtml(text,elementId,tag,"",existanceResult,tagId);
            }
            
            tagId2 = "pureOutput" + AltwordCount;
          }
          else{
            tag = document.createElement("span");
            var text = data.words[i].text + " ";
            //tag.appendChild(text);
            createHtml(text,elementId,tag,"",existanceResult,tagId);
          } 
          
          tag2 = document.createElement("span");
          
          var text2 = data.words[i].text + " ";
          createHtml(text2,pureElementId,tag2,pureElementId,true,tagId2);
          pureElement.appendChild(tag2);
          element.appendChild(tag);
    
          //https://www.tutorialspoint.com/how-to-add-a-new-element-to-html-dom-in-javascript
          // need to create an array to hold all of the strings of existence and output it here
    
          //this calls exist function and lowercases the word to fit the dictionary
    }
    
    displayTesseract(AltwordCount);

  })
}

const existanceLikeliness = (edit_distance,word) => {
  var wordFrequency = frequency(word);
  if(!wordFrequency){
    wordFrequency = frequency("golgw");
  }
  var theFrequency = frequency("the");
  var cost = 1/edit_distance + 25*wordFrequency/theFrequency;
  console.log(cost);
  return cost;
}


function sortByLikeliness(array){
  var size = array.length;
  const newArray = [0,0,0];
  const newArrayWords = ["","",""];
  for(let p = 0; p < size; p++)
  {
    var likeliness = existanceLikeliness(1,array[p])
    if(likeliness > newArray[2]){

      if (likeliness > newArray[1]){
        newArray[2] = newArray[1];
        newArrayWords[2] = newArrayWords[1];
        if (likeliness > newArray[0]){
          newArray[1] = newArray[0];
          newArrayWords[1] = newArrayWords[0];
          newArray[0] = likeliness;
          newArrayWords[0] = array[p];
        }
        else{
          newArray[1] = likeliness;
          newArrayWords[1] = array[p];
        }
      }
      else {
        newArray[2] = likeliness;
        newArrayWords[2] = array[p];
      }
        
    }
  }
  console.log(newArrayWords);
  return newArrayWords;
}

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
//var i = 0;
/*
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
*/
function jump(val) {
  var elem = document.getElementById("myBar");
  elem.style.width = val + "%";
}

document.getElementById("tesseractBut").addEventListener("click",function(){
  var img = document.querySelector('img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
  
  img.src = document.getElementById('tesseract').value;
  tesseract(document.getElementById('tesseract').value);
});
/*
document.getElementById("imageBut").addEventListener("click",function(){
  output_image(document.getElementById('image').value);
});

document.getElementById("move").addEventListener("click",function(){
  move(50);
});

document.getElementById("jump").addEventListener("click",function(){
  jump(50);
});
*/
document.getElementById("btn").addEventListener("click",function(){
  set_value();
});

function set_value() { 
  
  let items = document.getElementsByClassName('pureOutput');
 
  let data = [].map.call(items, item => item.textContent);
 
  console.log(data);
} 

function frequency(word)
{
  //console.log("frequency function called" + word);
  if (map.size != 0) 
    return map.get(word);
  
}

function update(idname) {
  var select = document.getElementById("outputTess" + idname);
  //console.log(select.options[1]);
  var option = select.options[select.selectedIndex].text;
  console.log(option);
  document.getElementById("pureOutput" + idname).innerHTML = option + " ";
}

function displayTesseract(size){

  //for loop
    for(let i = 1; i <= size; i++)
    {
      var idname = "outputTess" + i;
      document.getElementById(idname).addEventListener("change",function(){
        update(i);
      });

    }
  
}

function createHtml(word,id,type,classes,exists,tagId)
{
  //var element = document.getElementById(id);
  
  //let tag = document.createElement(type);
  var text = document.createTextNode(word);
  type.appendChild(text);
  if(classes != "")
    type.classList.add(classes);
  if(!exists)
    type.classList.add("false");
  type.id = tagId;
  //element.appendChild(tag);

}
/*
async function twoWordCheck (word1, word2,id,classes,type,tagId){
  let newWord = word1 + word2;
  var existanceResult = await doesItExist(clean_up_word(newWord));
  if(existanceResult)  {
    //createHtml(newWord,id,type,classes,true,tagId);
    return true;
  }
  return false;

}
*/
//create a new function that replaces current tesseract function
// uses twoWord check and if it does not work then it calls the "normal" function

async function preProccessData(arr){
  let i = 0;
  const postArr = [];
  //console.log(arr.words[i].text);
  while (i < arr.words.length - 1){
    let firstWord = arr.words[i].text;
    let secondWord = arr.words[i+1].text;
    let newWord = firstWord + secondWord;
    var existanceResult = await doesItExist(newWord);
    if (existanceResult){
      postArr.push(newWord);
      i+=2;
    }
    else{
      postArr.push(arr.words[i].text);
      i++;
    }
    
  }
  if(i != arr.words.length - 1){
    i++;
    console.log(arr.words[i]);
  }
  //console.log(postArr);
  return postArr;
}

});