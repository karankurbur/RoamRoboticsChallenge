const fs = require("fs");

const filename = "data.txt";

fs.readFile(filename, "utf8", function (err, data) {
  if (err) throw err;
  console.log(`OK: ${filename}`);
  const lines = data.split(/\r?\n/);
  console.log(lines[0]);
  const line = lines[0].split(" ");
  console.log(line);
});
