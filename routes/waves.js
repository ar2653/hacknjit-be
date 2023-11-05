require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const sql = require("../db");

router.get("/getData", async (req, res) => {
  // custom data
  let response1 = {
      id: 106,
      date: "2023-11-05T04:00:00.000Z",
      significant_wave_height_first_swell_converted: "0.2",
      significant_wave_height_second_swell_converted: "0.2",
      significant_wave_height_third_swell_converted: "0.2",
      ocean_current_speed_converted: "0.010",
      significant_wave_height_first_swell: "0.150",
      significant_wave_height_second_swell: "0.000",
      significant_wave_height_third_swell: "0.000",
      ocean_current_speed: "0.010",
      created_date: "2023-11-05T20:19:27.000Z",
      wave_length_1: "20",
      wave_length_2: "20",
      wave_length_3: "20",
      mean_wave_direction_first_swell: "29.600",
      mean_wave_direction_second_swell: "65.000",
      mean_wave_direction_third_swell: "65.000",
      latitude: "12.150",
      longitude: "123.199",
  };
  let response2 = {
      id: 106,
      date: "2023-11-05T04:00:00.000Z",
      significant_wave_height_first_swell_converted: "0.4",
      significant_wave_height_second_swell_converted: "0.4",
      significant_wave_height_third_swell_converted: "0.4",
      ocean_current_speed_converted: "0.010",
      significant_wave_height_first_swell: "0.150",
      significant_wave_height_second_swell: "0.000",
      significant_wave_height_third_swell: "0.000",
      ocean_current_speed: "0.010",
      created_date: "2023-11-05T20:19:27.000Z",
      wave_length_1: "40",
      wave_length_2: "40",
      wave_length_3: "40",
      mean_wave_direction_first_swell: "29.600",
      mean_wave_direction_second_swell: "65.000",
      mean_wave_direction_third_swell: "65.000",
      latitude: "12.150",
      longitude: "123.199",  
  };
  let response3 = {
      id: 106,
      date: "2023-11-05T04:00:00.000Z",
      significant_wave_height_first_swell_converted: "0.6",
      significant_wave_height_second_swell_converted: "0.6",
      significant_wave_height_third_swell_converted: "0.6",
      ocean_current_speed_converted: "0.010",
      significant_wave_height_first_swell: "0.150",
      significant_wave_height_second_swell: "0.000",
      significant_wave_height_third_swell: "0.000",
      ocean_current_speed: "0.010",
      created_date: "2023-11-05T20:19:27.000Z",
      wave_length_1: "60",
      wave_length_2: "60",
      wave_length_3: "60",
      mean_wave_direction_first_swell: "29.600",
      mean_wave_direction_second_swell: "65.000",
      mean_wave_direction_third_swell: "65.000",
      latitude: "12.150",
      longitude: "123.199",
  };
  if(req.query.latitude == 0.01 && req.query.longitude == 0.01) {
    res.status(200).json({data: response1, message: "custom data"});
    return;
  }
  if(req.query.latitude == 0.02 && req.query.longitude == 0.02) {
    res.status(200).json({data: response2, message: "custom data"});
    return;
  }
  if(req.query.latitude == 0.03 && req.query.longitude == 0.03) {
    res.status(200).json({data: response3, message: "custom data"});
    return;
  }

  // logical data
  try {
    const date = req.query.date || "2023-11-05T00:00:00Z";
    const sqlData = req.query?.date?.split("T")[0] || "2023-11-05";
    const longitudeFromQuery = req.query.longitude || "123.199";
    const latitudeFromQuery = req.query.latitude || "12.1498";
    const longitude = parseFloat(longitudeFromQuery).toFixed(3);
    const latitude = parseFloat(latitudeFromQuery).toFixed(3);

    // Tries to get data from the database
    const selectQuery =
      "SELECT * FROM waves WHERE date = ? AND latitude = ? AND longitude = ?";
    const selectValues = [date, latitude, longitude];

    try {
      const [results, fields] = await sql
        .promise()
        .query(selectQuery, selectValues);

      if (results.length > 0) {
        res.status(200).json({ data: results[0], message: "cache response" });
        return;
      }
    } catch (sqlError) {
      console.error("Error querying MySQL database:", sqlError);
      res.status(500).json({ error: "Error querying the database" });
      return;
    }

    // If data is not found, go for the API
    const apiUrl = `https://${process.env.METEO_API_USERNAME}:${process.env.METEO_API_PASSWORD}@api.meteomatics.com/${date}/mean_wave_direction_first_swell:d,mean_wave_direction_second_swell:d,mean_wave_direction_third_swell:d,significant_wave_height_first_swell:m,significant_wave_height_second_swell:m,significant_wave_height_third_swell:m,ocean_current_speed:kn,mean_wave_period_first_swell:s,mean_wave_period_second_swell:s,mean_wave_period_third_swell:s/${latitude},${longitude}/json`;

    try {
      const response = await axios.get(apiUrl);
      const apiResponse = response.data;

      // Process the API response data
      const formattedData = {
        latitude: apiResponse.data[0].coordinates[0].lat,
        longitude: apiResponse.data[0].coordinates[0].lon,
        date: apiResponse.data[0].coordinates[0].dates[0].date,
      };
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
      // calculate wavelengths
      formattedData.wave_length_1 = wavelengthCalculator(
        formattedData.mean_wave_period_first_swell,
        formattedData.significant_wave_height_first_swell
      );
      formattedData.wave_length_2 = wavelengthCalculator(
        formattedData.mean_wave_period_second_swell,
        formattedData.significant_wave_height_second_swell
      );
      formattedData.wave_length_3 = wavelengthCalculator(
        formattedData.mean_wave_period_third_swell,
        formattedData.significant_wave_height_third_swell
      );
      // Insert record to DB for cache purposes
      const insertQuery = `INSERT INTO waves (latitude, longitude, date, mean_wave_direction_first_swell, mean_wave_direction_second_swell, mean_wave_direction_third_swell, significant_wave_height_first_swell, significant_wave_height_first_swell_converted, significant_wave_height_second_swell, significant_wave_height_second_swell_converted, significant_wave_height_third_swell, significant_wave_height_third_swell_converted, ocean_current_speed, ocean_current_speed_converted, wave_length_1, wave_length_2, wave_length_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const insertValues = [
        formattedData.latitude,
        formattedData.longitude,
        sqlData,
        formattedData.mean_wave_direction_first_swell,
        formattedData.mean_wave_direction_second_swell,
        formattedData.mean_wave_direction_third_swell,
        formattedData.significant_wave_height_first_swell,
        formattedData.significant_wave_height_first_swell_converted,
        formattedData.significant_wave_height_second_swell,
        formattedData.significant_wave_height_second_swell_converted,
        formattedData.significant_wave_height_third_swell,
        formattedData.significant_wave_height_third_swell_converted,
        formattedData.ocean_current_speed,
        formattedData.ocean_current_speed,
        formattedData.wave_length_1,
        formattedData.wave_length_2,
        formattedData.wave_length_3,
      ];

      try {
        const [insertResults, insertFields] = await sql
          .promise()
          .query(insertQuery, insertValues);

        if (insertResults.affectedRows > 0) {
          const lastInsertedId = insertResults.insertId;

          // Use the lastInsertedId to retrieve the newly created row from the database
          const selectQuery = "SELECT * FROM waves WHERE id = ?";
          const [selectResults, selectFields] = await sql
            .promise()
            .query(selectQuery, [lastInsertedId]);

          if (selectResults.length > 0) {
            res
              .status(200)
              .json({ data: selectResults[0], message: "API RESP DATA" });
            return;
          } else {
            res
              .status(500)
              .json({ error: "Failed to retrieve the newly created row" });
            return;
          }
        } else {
          res.status(500).json({ error: "Failed to get the last inserted ID" });
          return;
        }
      } catch (insertError) {
        console.error("Error inserting data into the database:", insertError);
        res.status(500).json({ error: "Failed to insert data" });
        return;
      }
    } catch (apiError) {
      console.error("Error in API request:", apiError);
      res.status(500).json({ error: "Error in API request" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// calculate rounding for wave heights
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

// calculate wave lengths
function wavelengthCalculator(wavePeriod, SignificantWaveHeight) {
  console.log(wavePeriod, SignificantWaveHeight, "!!!");
  // failsafe to prevent if period is 0
  if (wavePeriod === 0) {
    wavePeriod = 1;
  }
  // failsafe to prevent if height is 0
  if (SignificantWaveHeight === 0) {
    SignificantWaveHeight = 0.1;
  }
  // Calculate wave speed
  // const waveSpeed = 1.56 * Math.sqrt(9.81 * SignificantWaveHeight);
  const waveSpeed = 1.56 * Math.sqrt(Math.abs(9.81 * SignificantWaveHeight));
  // Calculate frequency
  const frequency = 1 / Math.abs(wavePeriod);
  // Calculate wavelength
  let wavelength = waveSpeed / frequency;

  console.log(wavelength, frequency, waveSpeed, "@@@");

  if (isNaN(wavelength) || !isFinite(wavelength)) {
    wavelength = 1;
  }
  return wavelength.toFixed(2);
}

module.exports = router;
