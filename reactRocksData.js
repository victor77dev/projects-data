import axios from 'axios';
const fs = require('fs');

// Data can be found in bundle.js
const dataUrl = 'https://react.rocks/scripts/bundle.js';

// Downloading bundle.js
const dlReactRockData = function(url) {
  return axios.get(dataUrl).then((res, err) => {
    if (err) throw err;
    return res.data;
  });
};

// Parse and Format the data into JSON format
const parseReactRockData = function(data) {
  const beginStr = '(n=document.createElement("link"),n.id="canonical_link",n.rel="canonical",document.head.appendChild(n)),t="https://react.rocks"+e,n.href=t,t}e.exports=n},function(e,t){"use strict";e.exports=';
  const endStr = '}},function(e,t,n){"use strict";var o=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}';
  const startIndex = data.indexOf(beginStr) + beginStr.length;
  const endIndex = data.indexOf(endStr) + 1;

  const parsedData = data.substring(startIndex, endIndex);
  let formattedDataStr = parsedData;

  // Add double quote for keys
  formattedDataStr = formattedDataStr.replace('{projects:[', '{"projects":[');
  formattedDataStr = formattedDataStr.replace('project_tags', '"project_tags"');
  formattedDataStr = formattedDataStr.replace('tags:[', '"tags":[');

  // Add double quote for key in projects data
  const stringList = ['c', 'd', 'g', 'i', 'n', 's', 'y', 'e'];
  stringList.forEach((targetStr) => {
    const quoteRegex = new RegExp(`${targetStr}:"`, 'g');
    formattedDataStr = formattedDataStr.replace(quoteRegex, `"${targetStr}":"`);
  });

  const formattedData = JSON.parse(formattedDataStr);
  // Saving formattedDataStr
  fs.writeFile('formattedData.json', JSON.stringify(formattedData, null, 2));
  return formattedData;
};

const getReactRocksData = function() {
  return dlReactRockData(dataUrl).then((data) => {
    return parseReactRockData(data);
  });
};

export default getReactRocksData;