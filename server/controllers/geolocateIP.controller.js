import { getTimeByTimezone } from "../utils/getTimeByTimezone";
import { calculateDistanceInKM } from "../utils/calculateDistance";
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const getLocation = async (req, res) => {
  let { ip } = req.params;

  if (ip && ip.replace(" ", "") !== "") {
    const countryData = await getCountryByIP(ip);

    if (countryData.error) {
      res.status(400).send(countryData.error);
      return;
    }

    const { country_code, country_name, latitude, longitude, location } =
      countryData;

    const currencyData = await getCurrencyByCountry(country_name);

    if (currencyData.error) {
      res.status(400).send(currencyData.error);
      return;
    }

    let { currencies, timezones } = currencyData[0];

    let currency = Object.keys(currencies)[0]; // Extract currency code from the object keys

    const ratesData = await USDToCurrency(currency);

    if (ratesData.error) {
      res.status(400).send(ratesData.error);
      return;
    }

    const value = ratesData.rates[currency] || null; //Get the rate value of the correct key

    currency = `${currency} ($1 USD = $${value} ${currency})`;

    timezones = await getTimeByTimezone(timezones);

    const kms_from_ba = await calculateDistanceInKM([latitude, longitude]);
    const distance_from_ba = `${kms_from_ba}kms from (${[
      latitude,
      longitude,
    ]}) to Buenos Aires (-34.603722, -58.381592)`;

    const responseData = {
      ip,
      country_name,
      country_code,
      languages: location?.languages?.map((language) => {
        return language.name;
      }),
      currency,
      timezones,
      distance_from_ba,
    };

    const tmpString = JSON.stringify({
      country_name,
      kms_from_ba,
      calls: 1,
    });

    writeTempData(tmpString);

    res.send(responseData);
  } else {
    res.status(400).send("Missing IP address");
  }
};

/**
 * Geolocate IP and return data from the IP origin country
 * @param {string} ip
 * @returns {object}
 */
const getCountryByIP = async (ip) => {
  const res = await fetch(
    `http://api.ipapi.com/${ip}?access_key=${process.env.IPAPI_KEY}`
  );
  return await res.json();
};

/**
 * Get the official currency of a given country
 * @param {string} country
 * @returns {object}
 */
const getCurrencyByCountry = async (country) => {
  const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  const data = await res.json();
  if (!data[0]?.currencies || !data[0].timezones)
    return { error: "Could not get the location currencies or timezones" };
  return data;
};

/**
 * Return the USD rates of a given currency
 * @param {string} currency
 * @returns {object}
 */
const USDToCurrency = async (currency) => {
  const res = await fetch(
    `https://api.apilayer.com/fixer/latest?base=USD&symbols=${currency}`,
    {
      headers: { apikey: process.env.FIXER_KEY },
    }
  );
  return await res.json();
};

/**
 * Creates tmp/api-history.json if not exists, and appends data into it
 * @param {object} data
 * @returns {object}
 */
const writeTempData = async (tmpString) => {
  const dirExists = await fs.existsSync(
    path.join(__dirname, "..", "/tmp/api-history.json")
  );

  if (!dirExists) {
    await fs.mkdirSync(path.join(__dirname, "..", "/tmp"));
    await fs.appendFileSync(
      path.join(__dirname, "..", "/tmp/api-history.json"),
      "[]"
    );
  }

  fs.readFile(
    path.join(__dirname, "..", "/tmp/api-history.json"),
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let fileContent = data.toString();
        let fileContentJSON = JSON.parse(fileContent);
        let tmpStringJSON = JSON.parse(tmpString);

        fileContentJSON.map((item) => {
          if (item.country_name === tmpStringJSON.country_name) {
            let itemUpdated = item;
            itemUpdated.calls++;
            return itemUpdated;
          }
          return item;
        });

        let file = await fs.openSync(
          path.join(__dirname, "..", "/tmp/api-history.json"),
          "r+"
        );

        if (JSON.stringify(fileContentJSON) !== fileContent) {
          // If the file content was updated overwrite the file
          fileContent = JSON.stringify(fileContentJSON);
          let bufferedText = Buffer.from(fileContent);
          fs.writeSync(file, bufferedText, 0, bufferedText.length);
        } else {
          if (fileContent.length > 3) {
            //If it is the first call don't add a comma after tmpString value
            fileContent = fileContent.substring(1);
            let bufferedText = Buffer.from(`${tmpString},` + fileContent);
            fs.writeSync(file, bufferedText, 0, bufferedText.length, 1);
          } else {
            fileContent = fileContent.substring(1);
            let bufferedText = Buffer.from(tmpString + fileContent);
            fs.writeSync(file, bufferedText, 0, bufferedText.length, 1);
          }
        }

        fs.close(file);
      }
    }
  );
};

module.exports = { getLocation };
