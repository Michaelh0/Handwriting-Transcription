{var elementId = "outputTesseract";
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
        tag = "select";
        tagId = "outputTess" + AltwordCount;
        var text;
        
        if(altArray.length != 0){ 

          for (let j = 0; j < 4; j++) // number of options is currently hard coded
          {
            var optionTag = "option";
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
              
            createHtml(text,elementId,optionTag,"",false,tagId);
          }
        }
        tagId2 = "pureOutput" + AltwordCount;
      }
      else{
        tag = "span";
        var text = data.words[i].text + " ";
        //tag.appendChild(text);
        createHtml(text,elementId,tag,"",false,tagId);
      } 
      
      tag2 = "span";
      
      var text2 = data.words[i].text + " ";
      createHtml(text2,pureElementId,tag2,pureElementId,true,tagId2);
      pureElement.appendChild(tag2);
      //createHtml(text,elementId,tag,"",existanceResult,tagId);
      element.appendChild(tag);

      //https://www.tutorialspoint.com/how-to-add-a-new-element-to-html-dom-in-javascript
      // need to create an array to hold all of the strings of existence and output it here

      //this calls exist function and lowercases the word to fit the dictionary
}

displayTesseract(AltwordCount);
}

function createHtmlTag(word,id,type,classes,exists,tagId)
{
  var element = document.getElementById(id);
  var tag = document.createElement(type);
  var text = document.createTextNode(word);
  tag.appendChild(text);
  if(classes != "")
    tag.classList.add(classes);
  if(!exists)
    tag.classList.add("false");
  tag.id = tagId;
  //element.appendChild(tag);
  return tag;
}




//Previous version

//console.log(data.words);
var element = document.getElementById("outputTesseract");
var pureElement = document.getElementById("pureOutput");
element.innerHTML = "";
pureElement.innerHTML = "";
var AltwordCount = 0;
for (let i = 0; i < data.words.length; i++) {
  //var outputText = i.toString();
  var cleanedWord = clean_up_word(data.words[i].text)
  var existanceResult = await doesItExist(cleanedWord);
  
  var tag;
  var tag2;
  if(!existanceResult){
    const newArray = await (alternativeWords(cleanedWord));
    const altArray = sortByLikeliness(newArray);
    AltwordCount++;
    tag = document.createElement("select");
    tag.id = "outputTess" + AltwordCount;
    var text;
    
    if(altArray.length != 0){ 

      for (let j = 0; j < 4; j++) // number of options is currently hard coded
      {
        var option = document.createElement("option");
        //let length = altwordArray.length;
        if(!j)
          text = document.createTextNode(data.words[i].text + " ");
        else{
          if(altArray.length >= j){
            text = document.createTextNode(altArray[j-1]+ " ");
            //console.log(altArray[j-1]);
            //console.log(j-1);
          }
          else
            text = document.createTextNode("alternative word don't exist ");
        }
          
        option.appendChild(text);
        tag.appendChild(option);
      }
    }
    else{
      tag = document.createElement("span");
      //tag.id = "outputTess" + i;
    }
  }
  else{
    tag = document.createElement("span");
    //tag.id = "outputTess" + i;
  } 
  tag2 = document.createElement("span");
  if(!existanceResult){
    tag2.id = "pureOutput" + AltwordCount;
  }
  else{
    var text = document.createTextNode(data.words[i].text + " ");
    tag.appendChild(text);
  }
  var text2 = document.createTextNode(data.words[i].text + " ");
  tag2.appendChild(text2);
  tag2.classList.add("pureOutput");
  //
  //tag2.appendChild(text);
  if(!existanceResult)
    tag.classList.add("false");
  element.appendChild(tag);

  pureElement.appendChild(tag2);

  //https://www.tutorialspoint.com/how-to-add-a-new-element-to-html-dom-in-javascript
  // need to create an array to hold all of the strings of existence and output it here

  //this calls exist function and lowercases the word to fit the dictionary
}

displayTesseract(AltwordCount);
