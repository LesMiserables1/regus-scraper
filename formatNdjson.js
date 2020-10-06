/**
 *
 * Nodejs algorihm to convert scrapped data from regus.com to
 * ndjson format to be able to use it on AWS Elasticsearch
 *
 * Basic functionality descpription:
 * 1) Read the json file from given path
 * 2) Give an ID to each property
 * 3) Add a header to each property with same ID
 * 4) Save back to the given path as properties.ndjson
 *
 */

const fs = require("fs");
const ndjson = require("ndjson");

// const BASE_PATH = "assets";
const FILE_PATH = `result.json`;
const SAVE_AS = "properties.ndjson";

(() => {
  const propertiesRaw = JSON.parse(
    fs.readFileSync(FILE_PATH, { encoding: "utf-8" })
  );

  // add index and header
  const properties = [];
  propertiesRaw.forEach((property, idx) => {
    properties.push({ index: { _index: "aos-prototype-1", _id: idx } });
    properties.push({ id: idx, ...property });
  });

  // convert json to ndjson format
  let __ndJson = "";
  properties.forEach((propery) => {
    __ndJson += JSON.stringify(propery) + "\n";
  });

  // save to file
  fs.writeFileSync(`${SAVE_AS}`, __ndJson);
})();