/* eslint quotes: ["error", "double"] */
/* eslint semi: [0] */

const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

const port = minimist(process.argv);

let homeContent = "";
let projectContent = "";
let formContent = "";
let formjs = "";

fs.readFile("registration.html", (err, data) => {
  if (err) throw err;
  formContent = data;
});
fs.readFile("main.js", (err, data) => {
  if (err) throw err;
  formjs = data;
});

fs.readFile("home.html", (err, homedata) => {
  if (err) throw err;
  homeContent = homedata;
});
fs.readFile("project.html", (err, projectdata) => {
  if (err) throw err;
  projectContent = projectdata;
});

http
  .createServer((req, res) => {
    const url = req.url;
    res.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/registration":
        res.write(formContent);
        res.end();
        break;
      case "/main.js":
        res.write(formjs);
        res.end();
        break;

      case "/project":
        res.write(projectContent);
        res.end();
        break;

      default:
        res.write(homeContent);
        res.end();
        break;
    }
  })
  .listen(port);
