const myModule = require('./../editDistance folder/levenshtein');

const configData = require('./../housing_dictionary/index.json');

var MAX = 2;

function findCloseMatches(word) {

  for (var i = 0; i < (configData.length); i += 1) {

      var stringA = word;
      var stringB = configData[i];
      var insert = remove = function(char) { return 1; };
      var update = function(charA, charB) { return charA !== charB ? 1 : 0; };
      if (myModule(stringA, stringB, insert, remove, update).distance <= MAX)
          console.log(stringB);
  }
}



// myModule returns all of the data types inside the function 
// distance is just the edit distance 
  // thinking of brute forcing every combination with the potential word and outputing all the distances that are less than a certain number like 2 or 3 edits