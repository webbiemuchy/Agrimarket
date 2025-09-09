// backend/routes/geocode.js
const express = require("express");
const axios = require("axios");
const router = express.Router();


router.get("/reverse", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: "Missing lat/lng" });
  }
  try {
    const { data } = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/reverse",
      { params: { latitude: lat, longitude: lng, count: 1 } }
    );
    return res.json({ success: true, data });
  } catch (err) {
    const status = err.response?.status;
    
    if (status === 404) {
      return res.json({ success: true, data: { results: [] } });
    }
    console.error(
      "Reverse-geocode proxy error:",
      err.response?.statusText || err.message
    );
    return res
      .status(500)
      .json({ success: false, message: "Reverse geocode failed" });
  }
});

module.exports = router;
