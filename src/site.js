require('./common');
require('./images/logo.png');
require('./images/radar_legend.png');

// const GoogleSheetInput = require('./util/factory');
const GoogleSheetInput = require('./util/inlineFactory');

var data;

//TODO this should be injected somewhere really
var apidefinitions;
var xhr = new XMLHttpRequest();

xhr.open('GET', 'https://765440-api-discovery-api-search.ose-preprod.nz.thenational.com/definitions');
xhr.setRequestHeader('Accept', 'application/json');
xhr.onload = function() {
  console.log(xhr);
  console.log(JSON.parse(xhr.response));
  if (xhr.status === 200) {
    // alert('User\'s name is ' + xhr.responseText);
    apidefinitions = JSON.parse(xhr.response);
    // console.log(apidefinitions.definitions[0]);
    data = [];
    for(var i=0; i < apidefinitions.definitions.length; ++i){
      if('ReferenceData.yaml' !== apidefinitions.definitions[i].file){
        console.log(apidefinitions.definitions[i]);
        quadrant = apidefinitions.definitions[i].file.split('/')[0];
        description = apidefinitions.definitions[i].description ? apidefinitions.definitions[i].description : '';
        data.push({name: apidefinitions.definitions[i].name, ring: 'ring ' + i%4, quadrant: quadrant, isNew: 'TRUE', description: description});
      }
    }
    console.log('data',data);
    GoogleSheetInput().build(data);
  } else {
    alert('Request failed.  Returned status of ' + xhr.status);
  }
};

xhr.send();
// END TODO
