import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../src/App";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const apicache = require("apicache");
const app = express();
const PORT = 8080;
let cache = apicache.middleware;

const { geolocateIP } = require("./routes/geolocateIP.routes");
const { nearestAPICall } = require("./routes/nearestAPICall.routes");
const { averageAPICall } = require("./routes/averageAPICall.routes");
const { farestAPICall } = require("./routes/farestAPICall.routes");

app.use("^/$", (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Can't find './build/index.html'");
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    );
  });
});

const router = express.Router();

geolocateIP(router);
nearestAPICall(router);
averageAPICall(router);
farestAPICall(router);

// app.use(cache()); removed because of problems with counting api calls

app.use("/api", router);

app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
