const fs = require("fs");
const path = require("path");

/**
 * Read the api-histoy file inside tmp
 * @returns {string}
 */
const getAPIHistory = () => {
  const fileContent = fs.readFileSync(
    path.join(__dirname, "..", "tmp/api-history.json")
  );
  const APIHistory = fileContent.toString();
  return APIHistory;
};

module.exports = { getAPIHistory };
