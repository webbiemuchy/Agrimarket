// backend/services/geminiService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1200
      }
    });
  }

  createAnalysisPrompt({ project, climateData }) {
    const solarArr = climateData.nasaPowerData?.solarRadiation
      ? Object.values(climateData.nasaPowerData.solarRadiation)
      : [];
    const precipArr = climateData.historicalWeather?.dailyPrecip || [];
    const avgSolar = solarArr.length
      ? (solarArr.reduce((s, v) => s + v, 0) / solarArr.length).toFixed(2)
      : '0.00';
    const avgPrecip = precipArr.length
      ? (precipArr.reduce((s, v) => s + v, 0) / precipArr.length).toFixed(2)
      : '0.00';

    const soil = project.soilData || {};
    const forecast = climateData.forecast?.summary || 'No forecast available';
    const nasaNote = climateData.dataLimitation
      ? `\nNOTE: ${climateData.dataLimitation}`
      : '';

    return `
You are an expert agricultural investment analyst. Using the farmer's submitted proposals, climate and soil data  provided below based on the location of the proposal for investment, produce a JSON object with:
{
  "riskScore": float (0–1),
  "roiScore": float (0–1),
  "riskFactors": [string],
  "strengths": [string],
  "recommendations": [string],
  "marketAnalysis": "string (Analyze in-depth the market potential for this project, including demand, competition, and pricing trends.)",
  "feasibilityAssessment": "string (Assess the technical and financial feasibility of the project, including potential challenges and solutions.)",
  "expectedROI": float,
  "expectedROIExplanation": "string (Explain how the expected ROI was calculated based on the data provided.)",
  "confidenceLevel": float (0–1),
  "riskScoreExplanation": "string (Explain in 1-2 sentences how the risk score was derived from the data provided.)",
  "roiScoreExplanation": "string (Explain in 1-2 sentences how the ROI score was derived from the data provided.)",
  "confidenceLevelExplanation":" string (Explain in 1-2 sentences how the confidence level was derived from the data provided.)",
  "conclusion": "string (Provide a clear, final recommendation. Start with 'Good Investment', 'Requires Caution', or 'High Risk'. Then, briefly justify your conclusion.)"

}

=== PROJECT ===
Title: ${project.title}
Description: ${project.description}
Budget: $${project.budget}
Location: ${project.location}
Type: ${project.project_type || 'General Agriculture'}
Expected Yield: ${project.expected_yield || 'Not specified'}
Duration: ${project.duration_months || 'Not specified'} months
Funding Goal: $${project.funding_goal}

=== CLIMATE — CURRENT ===
Temperature: ${climateData.currentWeather?.temperature ?? 'N/A'}°C
Humidity: ${climateData.currentWeather?.humidity ?? 'N/A'}%
Precipitation: ${climateData.currentWeather?.precipitation ?? 'N/A'} mm
Wind Speed: ${climateData.currentWeather?.windSpeed ?? 'N/A'} km/h

=== CLIMATE — HISTORICAL (past year) ===
Avg Precipitation: ${avgPrecip} mm/day

=== NASA POWER (past year averages) ===
Avg Solar Radiation: ${avgSolar} MJ/m²/day${nasaNote}

=== SOIL ANALYSIS ===
Type: ${soil.type || 'Loam'}
pH Level: ${soil.ph || '6.5'}
Composition: Sand ${soil.sand || '40'}%, Silt ${soil.silt || '40'}%, Clay ${soil.clay || '20'}%
Organic Carbon: ${soil.organicCarbon || '1.0'}%

=== 30-DAY FORECAST ===
${forecast}
`;
  }

    async analyzeProjectProposal(project, climateData) {
    const prompt = this.createAnalysisPrompt({ project, climateData });
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      const json = JSON.parse(jsonString);
    return {
      riskScore:             json.riskScore,
      roiScore:              json.roiScore,
      riskFactors:           json.riskFactors,
      strengths:             json.strengths,
      recommendations:       json.recommendations,
      marketAnalysis:        json.marketAnalysis,
      feasibilityAssessment: json.feasibilityAssessment,
      expectedROI:           json.expectedROI,
      confidenceLevel:       json.confidenceLevel,
      conclusion:            json.conclusion,
      riskScoreExplanation:  json.riskScoreExplanation,
      roiScoreExplanation:   json.roiScoreExplanation,
      confidenceLevelExplanation: json.confidenceLevelExplanation,
      expectedROIExplanation: json.expectedROIScoreExplanation
    };} catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("AI analysis failed");
    }
  }
}

module.exports = new GeminiService();
