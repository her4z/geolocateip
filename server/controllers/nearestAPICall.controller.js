import { getAPIHistory } from "../utils/getAPIHistory";

const getDistance = async (req, res) => {
  const apiHistory = await getAPIHistory();
  const apiHistoryJSON = JSON.parse(apiHistory);

  const distances = apiHistoryJSON.map((item) => {
    return item.kms_from_ba;
  });

  const minDistance = Math.min(...distances);

  const minDistanceIndex = distances.indexOf(minDistance);

  const minDistanceData = apiHistoryJSON[minDistanceIndex];

  res.send(minDistanceData || null);
};

module.exports = { getDistance };
