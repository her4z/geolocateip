const fs = require("fs");
const path = require("path");

/**
 * Read the api-histoy file inside tmp
 * @returns {string}
 */
const getAPIHistory = () => {
  const dirExists = fs.existsSync(
    path.join(__dirname, "..", "/tmp/api-history.json")
  );

  if (dirExists) {
    const fileContent = fs.readFileSync(
      path.join(__dirname, "..", "tmp/api-history.json")
    );
    const APIHistory = fileContent.toString();
    return APIHistory;
  }
  return;
};

module.exports = { getAPIHistory };
