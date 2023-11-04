require("dotenv").config();
const express = require("express");
const axios = require('axios');
const router = express.Router();
const sql = require('../db');


// api call to make request to meteomatics

router.get('/getData', async (req, res) => {
  // Replace these with actual values if needed
  const date = req.query.date || '2023-11-04T00:00:00Z'; // Default date if not provided
  const lat = req.query.lat || '11.3493'; // Default latitude if not provided
  const lng = req.query.lng || '142.1996'; // Default longitude if not provided

  // Define the URL with placeholders
  const apiUrl = `https://${process.env.METEO_API_USERNAME}:${process.env.METEO_API_PASSWORD}@api.meteomatics.com/${date}/mean_wave_direction:d,significant_wave_height_first_swell:m,significant_wave_height_second_swell:m,significant_wave_height_third_swell:m,ocean_current_speed:kmh/${lat},${lng}/json`;
  try {
    // Make an API call using axios
    const response = await axios.get(apiUrl);
    const data = response.data;
    res.json(data); // Return the data as a JSON response
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors gracefully
  }
})
// Define a route for the root URL (/customer)
router.get('/test', (req, res) => {
  // sample return suppliers
  sql.query('SELECT * FROM users', (error, results, fields) => {
    if(error) throw error;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({data: results})
  })
});


router.get("/abc", async (req, res) => {
  try {
    res.status(200).json({
      data: {
        key: "value",
      },
      message: "successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
