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
      promiseDict.then(dictionary => {
  
        var WordWithExistance = word + " exists: " + (dictionary.has(word)).toString();
        
        console.log(WordWithExistance);

        /*if(!(dictionary.has(word)))
            funcClosematches(word);
        */

      })
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
            { logger: m => console.log(m) }
        ).then(({ data}) => {
        console.log(data.words);
        for (let i = 0; i < data.words.length; i++) {
            doesItExist(clean_up_word(data.words[i].text));

            //this calls exist function and lowercases the word to fit the dictionary
            }
    })
}

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

