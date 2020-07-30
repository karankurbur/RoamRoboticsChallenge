const fetch = require("node-fetch");

const asyncWrap = (fn) => (...args) => fn(...args).catch(args[2]);
async function doPost(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}

module.exports = { asyncWrap, doPost };
