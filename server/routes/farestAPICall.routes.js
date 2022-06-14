const farestAPICallController = require("../controllers/farestAPICall.controller");

const farestAPICall = (app) => {
  app.get("/farestAPICall", farestAPICallController.getDistance);

  return app;
};

module.exports = { farestAPICall };
