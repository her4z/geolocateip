const getTimeByTimezone = (timezones) => {
  const localTime = new Date().getTime();
  let timezonesMsg = [];

  for (let timezone of timezones) {
    const regex = /([UTC])/g;
    let offset = timezone.replace(regex, "").split(":"); //Transforms 'UTC-03:00' to ['-03', '00']
    let hours = parseInt(offset[0]) * 60 * 60000;
    let minutes = parseInt(offset[1]) * 60000;

    if (hours >= 0) {
      offset = hours + minutes; //Check if the offset is negative or positive and builds it
    } else if (hours < 0) {
      offset = hours - minutes;
    }

    const time = localTime + offset;
    const hs = ("0" + new Date(time).getUTCHours()).slice(-2);
    const min = new Date(time).getUTCMinutes();
    const sec = new Date(time).getUTCSeconds();

    timezonesMsg.push(`${hs}:${min}:${sec} (${timezone})`);
  }
  return timezonesMsg;
};

module.exports = { getTimeByTimezone };
