require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const sql = require("../db");

// Get data API call
router.get("/getData", async (req, res) => {
  const date = req.query.date || "2023-11-07T00:00:00Z";
  const longitudeFromQuery = req.query.longitude || "146.199";
  const latitudeFromQuery = req.query.latitude || "12.1498";
  const longitude = parseFloat(longitudeFromQuery).toFixed(3);
  const latitude = parseFloat(latitudeFromQuery).toFixed(3);
  // tries to get data from database
  const selectQuery =
    "SELECT * FROM waves WHERE date = ? AND latitude = ? AND longitude = ?";
  const selectValues = [date, latitude, longitude];
  try {
    const [results, fields] = await sql
      .promise()
      .query(selectQuery, selectValues);
    if (results.length > 0) {
      res.status(200).json({ data: results, message: "cache response" });
    } else {
      // If data is not found, go for the API
      const apiUrl = `https://${process.env.METEO_API_USERNAME}:${process.env.METEO_API_PASSWORD}@api.meteomatics.com/${date}/mean_wave_direction:d,significant_wave_height_first_swell:m,significant_wave_height_second_swell:m,significant_wave_height_third_swell:m,ocean_current_speed:kn,mean_wave_period_first_swell:s,mean_wave_period_second_swell:s,mean_wave_period_third_swell:s/${latitude},${longitude}/json`;
      
      axios.get(apiUrl).then((response) => {
        const apiResponse = response.data;
        const formattedData = {
          latitude: apiResponse.data[0].coordinates[0].lat,
          longitude: apiResponse.data[0].coordinates[0].lon,
          date: apiResponse.data[0].coordinates[0].dates[0].date
        };
        // map keys to values
        apiResponse.data.forEach((item) => {
          const parameter = item.parameter.split(":")[0];
          const value = item.coordinates[0].dates[0].value;
          formattedData[parameter] = value;
        });
        // calculations to get significant values -> Round to lower value
        formattedData.significant_wave_height_first_swell_converted = calculator(
          formattedData.significant_wave_height_first_swell,
          0.1,
          10,
          0.1,
          1,
          1
        );
        formattedData.significant_wave_height_second_swell_converted = calculator(
          formattedData.significant_wave_height_second_swell,
          0.1,
          5,
          0.1,
          1,
          1
        );
        formattedData.significant_wave_height_third_swell_converted = calculator(
          formattedData.significant_wave_height_third_swell,
          0.1,
          5,
          0.1,
          1,
          1
        );
        formattedData.wave_length_1 = wavelengthCalculator(formattedData.mean_wave_period_first_swell, formattedData.significant_wave_height_first_swell);
        formattedData.wave_length_2 = wavelengthCalculator(formattedData.mean_wave_period_second_swell, formattedData.significant_wave_height_second_swell);
        formattedData.wave_length_3 = wavelengthCalculator(formattedData.mean_wave_period_third_swell, formattedData.significant_wave_height_third_swell);
        console.log(formattedData, "formattedData from the API");
        const insertQuery = `INSERT INTO waves (latitude, longitude, date, mean_wave_direction, mean_wave_direction_converted, significant_wave_height_first_swell, significant_wave_height_first_swell_converted, significant_wave_height_second_swell, significant_wave_height_second_swell_converted, significant_wave_height_third_swell, significant_wave_height_third_swell_converted, ocean_current_speed, ocean_current_speed_converted, wave_length_1, wave_length_2, wave_length_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertValues = [
          formattedData.latitude,
          formattedData.longitude,
          new Date(), // Date
          formattedData.mean_wave_direction,
          formattedData.mean_wave_direction,
          formattedData.significant_wave_height_first_swell,
          formattedData.significant_wave_height_first_swell_converted,
          formattedData.significant_wave_height_second_swell,
          formattedData.significant_wave_height_second_swell_converted,
          formattedData.significant_wave_height_third_swell,
          formattedData.significant_wave_height_third_swell_converted,
          formattedData.ocean_current_speed,
          formattedData.ocean_current_speed,
          formattedData.formattedData.wave_length_1,
          formattedData.formattedData.wave_length_2,
          formattedData.formattedData.wave_length_3,
        ];
        sql.query(insertQuery, insertValues, (error, results, fields) => {
          if (error) {
            res.status(500).json({ error: "Failed to insert data" });
          } else {
            console.log("Data inserted to DB and DB response is sent back");
            const lastInsertedId = results.insertId;
            if (lastInsertedId) {
              // Use the lastInsertedId to retrieve the newly created row from the database
              const selectQuery = 'SELECT * FROM waves WHERE id = ?';
              sql.query(selectQuery, [lastInsertedId], (selectError, selectResults, selectFields) => {
                if (selectError) {
                  res.status(500).json({ error: "Failed to retrieve the newly created row", details: selectError });
                } else {
                  console.log("Data inserted to DB and DB response is sent back");
                  res.status(200).json({ data: selectResults, message: "API RESP DATA" });
                }
              });
            } else {
              res.status(500).json({ error: "Failed to get the last inserted ID" });
            }
            // res.status(200).json({ data: results, message: "API RESP DATA" });
          }
        });

      });
    }
  } catch (error) {
    console.error("Error querying MySQL database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function calculator(value, inMin, inMax, outMin, outMax, decimalPlaces) {
  // Check for out-of-range input
  if (value < inMin) {
    return outMin;
  }
  if (value > inMax) {
    return outMax;
  }
  // Calculate the mapped value
  const inRange = inMax - inMin;
  const outRange = outMax - outMin;
  const mappedValue = ((value - inMin) / inRange) * outRange + outMin;
  // Round the mapped value to the specified number of decimal places
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(mappedValue * multiplier) / multiplier;
}

function wavelengthCalculator(wavePeriod, SignificantWaveHeight) {
  // failsafe to prevent if period is 0
  if (wavePeriod === 0) {
    wavePeriod = 1;
  }
  // Calculate wave speed
  const waveSpeed = 1.56 * Math.sqrt(9.81 * SignificantWaveHeight);
  // Calculate frequency
  const frequency = 1 / wavePeriod;
  // Calculate wavelength
  const wavelength = waveSpeed / frequency;
  return wavelength.toFixed(2);
}
// test
router.get("/test", (req, res) => {
  // sample return suppliers
  sql.query("SELECT * FROM users", (error, results, fields) => {
    if (error) throw error;
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ data: results });
  });
});

module.exports = router;
