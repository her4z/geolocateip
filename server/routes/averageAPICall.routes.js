const averageAPICallController = require("../controllers/averageAPICall.controller");

const averageAPICall = (app) => {
  app.get("/averageAPICall", averageAPICallController.getDistance);

  return app;
};

module.exports = { averageAPICall };
