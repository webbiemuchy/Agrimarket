// backend/services/climateService.js
const axios = require("axios");

class ClimateService {
  constructor() {
    this.soilGridsURL =
      process.env.SOIL_GRIDS_URL ||
      "https://rest.isric.org/soilgrids/v2.0/properties/query";
    this.openMeteoForecastURL =
      process.env.OPENMETEO_FORECAST_URL ||
      "https://api.open-meteo.com/v1/forecast";
    this.openMeteoArchiveURL =
      process.env.OPENMETEO_ARCHIVE_URL ||
      "https://archive-api.open-meteo.com/v1/archive";
    this.nasaPowerURL =
      process.env.NASA_POWER_API_URL ||
      "https://power.larc.nasa.gov/api/temporal/daily/point";
  }

  async getLocationCoordinates(name) {
    const { data } = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      { params: { name, count: 1, language: "en", format: "json" } }
    );
    if (!data.results?.length) throw new Error("Location not found");
    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
  }

  async getSoilData(lat, lon) {
    try {
      const params = { lon, lat,
        property: "phh2o,sand,silt,clay,ocd",
        depth: "0-5cm",
        value: "mean"
      };
      const { data } = await axios.get(this.soilGridsURL, { params });
      if (!data.properties) throw new Error("Invalid SoilGrids response");
      const props = {};
      data.properties.layers.forEach(layer => {
        props[layer.name] = layer.depths[0].values.mean;
      });
      const { sand=0, silt=0, clay=0 } = props;
      let type = "Loam";
      if (sand>80)     type="Sand";
      else if (clay>40) type="Clay";
      else if (silt>80) type="Silt";
      else if (sand>50 && clay<20) type="Sandy Loam";
      else if (clay>27 && clay<40) type="Clay Loam";
      return {
        type,
        ph: props.phh2o?.toFixed(1)          ?? "6.5",
        organicCarbon: props.ocd?.toFixed(1) ?? "1.0",
        sand:  sand.toFixed(1),
        silt:  silt.toFixed(1),
        clay:  clay.toFixed(1),
      };
    } catch (e) {
      console.error("Soil data error:", e);
      return { type:"Loam", ph:"6.5", organicCarbon:"1.0", sand:"40.0", silt:"40.0", clay:"20.0" };
    }
  }

  async getCurrentWeather(lat, lon) {
    const { data } = await axios.get(this.openMeteoForecastURL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
        timezone: "auto"
      }
    });
    const c = data.current;
    return {
      temperature: c.temperature_2m,
      humidity:    c.relative_humidity_2m,
      precipitation: c.precipitation,
      windSpeed:   c.wind_speed_10m,
      timestamp:   c.time
    };
  }

  async getForecast(lat, lon) {
    try {
      const { data } = await axios.get(this.openMeteoForecastURL, {
        params: {
          latitude: lat,
          longitude: lon,
          daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
          forecast_days: 30,
          timezone: "auto"
        }
      });
      const maxT = data.daily.temperature_2m_max  || [];
      const minT = data.daily.temperature_2m_min  || [];
      const pr   = data.daily.precipitation_sum  || [];
      const avgMax = maxT.reduce((a,b)=>a+b,0)/maxT.length;
      const avgMin = minT.reduce((a,b)=>a+b,0)/minT.length;
      const totP   = pr.reduce((a,b)=>a+b,0);
      let risk = "Normal conditions expected";
      if (totP>150)   risk = "High rainfall risk";
      else if (totP<30) risk = "Drought conditions likely";
      return {
        summary: `${risk}. Avg temp: ${avgMax.toFixed(1)}°C/ ${avgMin.toFixed(1)}°C; Precip: ${totP.toFixed(1)}mm`,
        daily: data.daily
      };
    } catch (e) {
      console.error("Forecast error:", e);
      return { summary: "Forecast unavailable", daily: null };
    }
  }

  async getHistoricalWeather(lat, lon, startDate, endDate) {
    const { data } = await axios.get(this.openMeteoArchiveURL, {
      params: { latitude: lat, longitude: lon,
        start_date: startDate, end_date: endDate,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
        timezone: "auto"
      }
    });
    if (!data.daily?.time?.length) {
      throw new Error("No historical data");
    }
    return {
      dailyMaxTemp: data.daily.temperature_2m_max,
      dailyMinTemp: data.daily.temperature_2m_min,
      dailyPrecip:  data.daily.precipitation_sum,
      dailyWindMax: data.daily.wind_speed_10m_max,
      dates:        data.daily.time
    };
  }

  async getNasaPowerData(lat, lon, startDate, endDate) {
    const params = {
      start: startDate.replace(/-/g,''), end: endDate.replace(/-/g,''),
      latitude: lat, longitude: lon,
      community: "AG",
      parameters: "ALLSKY_SFC_SW_DWN,PRECTOT",
      format: "JSON",
      time_standard: "UTC"
    };
    const { data } = await axios.get(
      `${this.nasaPowerURL}/temporal/daily/point`,
      { params, timeout: 10000 }
    );
    if (!data.properties?.parameter) throw new Error("NASA POWER bad response");
    const p = data.properties.parameter;
    return {
      solarRadiation: p.ALLSKY_SFC_SW_DWN,
      precipitation:  p.PRECTOT
    };
  }

  generateRiskAssessment(h, n, f) {
    const totalP = h.dailyPrecip.reduce((a,b)=>a+b,0);
    const avgP   = totalP / h.dailyPrecip.length;
    const maxT   = Math.max(...h.dailyMaxTemp);
    const minT   = Math.min(...h.dailyMinTemp);
    let level = "Low", factors = [];
    if (avgP < 2)        { level="High"; factors.push("Low historical precipitation"); }
    else if (avgP > 8)   { level="Moderate-High"; factors.push("High historical precipitation"); }
    if (maxT > 35)       { if(level==="Low") level="Moderate"; factors.push("High temperature extremes"); }
    if (f.summary.includes("High rainfall")) factors.push("Forecasted heavy rainfall");
    if (f.summary.includes("Drought"))       factors.push("Forecasted drought conditions");
    return {
      riskLevel:       level,
      riskFactors:     factors,
      recommendations: [
        "Install water storage for drought buffer",
        "Implement drainage system for heavy rains"
      ]
    };
  }

  async getClimateData(location) {
    console.log(`Fetching climate data for: ${location}`);
    let coords;
    if (typeof location === "string" && location.includes(",")) {
      const [lat, lon] = location.split(",").map(Number);
      coords = { latitude: lat, longitude: lon };
    } else if (location.lat != null && location.lng != null) {
      coords = { latitude: location.lat, longitude: location.lng };
    } else {
      coords = await this.getLocationCoordinates(location);
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const endDate = yesterday.toISOString().split("T")[0];
    const start = new Date(endDate);
    start.setFullYear(start.getFullYear()-1);
    const startDate = start.toISOString().split("T")[0];

    const [ currentWeather,
            historicalWeather,
            nasaPowerData,
            forecast,
          soilData ] = await Promise.all([
      this.getCurrentWeather(coords.latitude, coords.longitude),
      this.getHistoricalWeather(coords.latitude, coords.longitude, startDate, endDate),
      this.getNasaPowerData(coords.latitude, coords.longitude, startDate, endDate),
      this.getForecast(coords.latitude, coords.longitude),
      this.getSoilData(coords.latitude, coords.longitude)
    ]);

    const riskAssessment = this.generateRiskAssessment(historicalWeather,nasaPowerData,forecast);
    console.log(`Climate data fetched successfully`);

    return {
      location:          coords,
      currentWeather,
      historicalWeather,
      nasaPowerData,
      forecast,
      soilData,
      riskAssessment,
      lastUpdated:       new Date().toISOString()
    };
  }
}

module.exports = new ClimateService();
