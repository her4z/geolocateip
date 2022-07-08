import { getAPIHistory } from "../utils/getAPIHistory";

const getDistance = async (req, res) => {
  const apiHistory = await getAPIHistory();
  if (apiHistory) {
    const apiHistoryJSON = JSON.parse(apiHistory);

    const distances = apiHistoryJSON.map((item) => {
      return item.kms_from_ba;
    });

    const maxDistance = Math.max(...distances);

    const maxDistanceIndex = distances.indexOf(maxDistance);

    const maxDistanceData = apiHistoryJSON[maxDistanceIndex];

    res.send(maxDistanceData);
  } else {
    res.status(503).send();
  }
};

module.exports = { getDistance };
