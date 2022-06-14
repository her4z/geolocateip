const geolocateIPController = require("../controllers/geolocateIP.controller");

const geolocateIP = (app) => {
  app.get("/geolocateIP", geolocateIPController.getLocation);

  return app;
};

module.exports = { geolocateIP };
