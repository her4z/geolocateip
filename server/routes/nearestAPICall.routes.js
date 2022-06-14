const nearestAPICallController = require("../controllers/nearestAPICall.controller");

const nearestAPICall = (app) => {
  app.get("/nearestAPICall", nearestAPICallController.getDistance);

  return app;
};

module.exports = { nearestAPICall };
