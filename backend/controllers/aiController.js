// backend/controllers/aiController.js

const { prisma }           = require("../config/database");
const geminiService       = require("../services/geminiService");
const climateService       = require("../services/climateService");



async function analyzeProject(req, res) {
  try {
    const { projectId } = req.params;
    const user          = req.user;

   
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    if (project.farmer_id !== user.id && user.userType !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    
    if (!project.location) {
      console.warn(`Project ${projectId} missing location, defaulting to Nairobi`);
      project.location = "-0.0236,37.9062";
    }

    
    const climateData = await climateService.getClimateData(project.location);

    const projectWithSoil = { ...project, soilData: climateData.soilData || {} };

  
    let aiAnalysis;
    try {
      aiAnalysis = await geminiService.analyzeProjectProposal(projectWithSoil, climateData);
    } catch (err) {
    
      if (err.response?.status === 429) {
        return res.status(503).json({
          success: false,
          message: "AI service is at capacity; please try again later."
        });
      }
      throw err;
    }

    
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ai_risk_score:             aiAnalysis.riskScore,
        ai_roi_score:              aiAnalysis.roiScore,
        climate_risk_level:        climateData.riskAssessment.riskLevel,
        climate_warnings:          aiAnalysis.riskFactors.join("; "),
        mitigation_recommendations:aiAnalysis.recommendations.join("; ")
      }
    });

    return res.json({
      success: true,
      message: "Analysis complete",
      data: {
        project: {
          id:               updatedProject.id,
          title:            updatedProject.title,
          aiRiskScore:      updatedProject.ai_risk_score,
          aiRoiScore:       updatedProject.ai_roi_score,
          climateRiskLevel: updatedProject.climate_risk_level
        },
        aiAnalysis,    
        climateData,   
        analyzedAt:    new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Project analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze project",
      error:   error.message
    });
  }
}


async function getClimateData(req, res) {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ success: false, message: "Location parameter is required" });
    }
    const data = await climateService.getClimateData(location);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Climate data error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch climate data",
      error:   error.message
    });
  }
}


async function summarizeText(req, res) {
  try {
    const { text, maxLength = 200 } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Text parameter is required" });
    }
    const summary = await mistralService.summarizeText(text, maxLength);
    return res.json({
      success: true,
      data: {
        originalText:   text,
        summary,
        originalLength: text.length,
        summaryLength:  summary.length
      }
    });
  } catch (error) {
    console.error("Text summarization error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to summarize text",
      error:   error.message
    });
  }
}


async function classifyProject(req, res) {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: "Description parameter is required" });
    }
    const classification = await mistralService.classifyProject(description);
    return res.json({ success: true, data: { description, classification } });
  } catch (error) {
    console.error("Project classification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to classify project",
      error:   error.message
    });
  }
}


async function batchAnalyzeProjects(req, res) {
  try {
    const { projectIds } = req.body;
    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ success: false, message: "Project IDs array is required" });
    }
    if (projectIds.length > 10) {
      return res.status(400).json({ success: false, message: "Maximum 10 projects per batch" });
    }

    const results = [];
    const errors  = [];

    for (const id of projectIds) {
      try {
        const p = await prisma.project.findUnique({ where: { id } });
        if (!p) {
          errors.push({ projectId: id, error: "Project not found" });
          continue;
        }
        if (p.farmer_id !== req.user.id && req.user.userType !== "admin") {
          errors.push({ projectId: id, error: "Unauthorized access" });
          continue;
        }

       
        const climateData = await climateService.getClimateData(p.location);
        const ai          = await mistralService.analyzeProjectProposal(p, climateData);

       
        await prisma.project.update({
          where: { id },
          data: {
            ai_risk_score:              ai.riskScore,
            ai_roi_score:               ai.roiScore,
            climate_warnings:           ai.riskFactors.join("; "),
            mitigation_recommendations: ai.recommendations.join("; ")
          }
        });

        results.push({
          projectId:       id,
          success:         true,
          aiRiskScore:     ai.riskScore,
          aiRoiScore:      ai.roiScore
        });
      } catch (err) {
        errors.push({ projectId: id, error: err.message });
      }
    }

    return res.json({
      success: true,
      message: `Analyzed ${results.length} of ${projectIds.length} projects`,
      data:    { results, errors }
    });
  } catch (error) {
    console.error("Batch analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to perform batch analysis",
      error:   error.message
    });
  }
}

module.exports = {
  analyzeProject,
  getClimateData,
  summarizeText,
  classifyProject,
  batchAnalyzeProjects,
};
