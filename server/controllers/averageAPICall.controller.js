import { getAPIHistory } from "../utils/getAPIHistory";

const getDistance = async (req, res) => {
  const apiHistory = await getAPIHistory();
  const apiHistoryJSON = JSON.parse(apiHistory);

  let totalKMS = 0;
  let totalCalls = 0;
  for (let item of apiHistoryJSON) {
    totalKMS = totalKMS + item.kms_from_ba * item.calls;
    totalCalls = totalCalls + item.calls;
  }

  const averageKMS = totalKMS / totalCalls;

  res.send(averageKMS.toFixed(2).toString());
};

module.exports = { getDistance };
