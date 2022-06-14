const getLocation = (req, res) => {
  res.send("geolocateIP called");
};

module.exports = { getLocation };
