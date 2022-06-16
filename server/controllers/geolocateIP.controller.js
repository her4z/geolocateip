import { getTimeByTimezone } from "../utils/getTimeByTimezone";
import { calculateDistance } from "../utils/calculateDistance";
const fetch = require("node-fetch");

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

    let distance_from_ba = await calculateDistance([latitude, longitude]);

    const locationData = {
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
    res.send(locationData);
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

module.exports = { getLocation };
