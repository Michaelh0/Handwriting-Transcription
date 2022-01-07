//var text = JSON.stringify(configData);

//document.getElementById('main').innerHTML = JSON.stringify(data);
// data is a JavaScript object now. Handle it as such

var promiseDict = (fetch("index.json")
  .then(response => response.json())
  .then(json => 
    {
      document.getElementById('main').innerHTML = JSON.stringify(json);

      var dictionaryInside = new Set(json);

      console.log(json);
      console.log(dictionaryInside);
      return dictionaryInside;
    }));

const doesItExist = (word) =>{
    promiseDict.then(dictionary => {

      console.log(dictionary.has(word));


    })
};
