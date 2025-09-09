// backend/services/projectAnalysisService.js
const { prisma } = require("../config/database");
const geminiService = require("./geminiService");
const climateService = require("./climateService");

async function runAnalysis(projectId, user) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new Error("Project not found");
    if (project.farmer_id !== user.id && user.userType !== "admin") {
      throw new Error("Unauthorized");
    }

    const climateData = await climateService.getClimateData(project.location);
    const aiResults = await geminiService.analyzeProjectProposal(
      project,
      climateData
    );

    const climateRiskAssessment = climateService.generateRiskAssessment(
        climateData.historicalWeather,
        climateData.nasaPowerData,
        climateData.forecast
    );

    // Create analysis records in separate tables
    await prisma.$transaction([
      prisma.aiAnalysis.upsert({
        where: { project_id: projectId },
        update: {
          risk_score: aiResults.riskScore,
          roi_score: aiResults.roiScore,
          risk_factors: aiResults.riskFactors.join("; "),
          strengths: aiResults.strengths.join("; "),
          recommendations: aiResults.recommendations.join("; "),
          market_analysis: aiResults.marketAnalysis,
          feasibility: aiResults.feasibilityAssessment,
          expected_roi: aiResults.expectedROI,
          confidence_level: aiResults.confidenceLevel,
          risk_score_explanation: aiResults.riskScoreExplanation, 
          roi_score_explanation: aiResults.roiScoreExplanation, 
          confidence_level_explanation: aiResults.confidenceLevelExplanation, 
          conclusion: aiResults.conclusion,
          expected_roi_score_explanation: aiResults.expectedROIExplanation
        },
        create: {
          project_id: projectId,
          risk_score: aiResults.riskScore,
          roi_score: aiResults.roiScore,
          risk_factors: aiResults.riskFactors.join("; "),
          strengths: aiResults.strengths.join("; "),
          recommendations: aiResults.recommendations.join("; "),
          market_analysis: aiResults.marketAnalysis,
          feasibility: aiResults.feasibilityAssessment,
          expected_roi: aiResults.expectedROI,
          confidence_level: aiResults.confidenceLevel,
          risk_score_explanation: aiResults.riskScoreExplanation, 
          roi_score_explanation: aiResults.roiScoreExplanation, 
          confidence_level_explanation: aiResults.confidenceLevelExplanation, 
          conclusion: aiResults.conclusion,
          expected_roi_score_explanation: aiResults.expectedROIExplanation
        }
      }),
      
      prisma.climateData.upsert({
        where: { project_id: projectId },
        update: {
          risk_level: climateRiskAssessment.riskLevel || "Unknown",
          risk_factors: climateRiskAssessment.riskFactors.join("; ") || "",
          recommendations: climateRiskAssessment.recommendations.join("; ") || "",
          current_weather: climateData.currentWeather,
          forecast: climateData.forecast,
          soil_data: climateData.soilData,
        },
        create: {
          project_id: projectId,
          risk_level: climateRiskAssessment.riskLevel || "Unknown",
          risk_factors: climateRiskAssessment.riskFactors.join("; ") || "",
          recommendations: climateRiskAssessment.recommendations.join("; ") || "",
          current_weather: climateData.currentWeather,
          forecast: climateData.forecast,
          soil_data: climateData.soilData,
        }
      })
    ]);

    return await prisma.project.update({
      where: { id: projectId },
      data: {
        analysis_status: "completed",
      }
    });
  } catch (error) {
    await prisma.project.update({
      where: { id: projectId },
      data: { analysis_status: "failed" }
    });
    console.error(`Analysis failed for project ${projectId}:`, error);
    throw error;
  }
}

module.exports = { runAnalysis };
