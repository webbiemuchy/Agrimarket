// backend/controllers/projectController.js

const { prisma } = require("../config/database");
const { runAnalysis } = require("../services/projectAnalysisService");

// Create new project: run AI+Climate analysis, then notify admins
async function createProject(req, res) {
  try {
    if (req.user.userType !== "farmer") {
      return res
        .status(403)
        .json({ success: false, message: "Only farmers can submit proposals" });
    }

    const {
      title,
      description,
      budget,
      location,
      expected_yield,
      project_type,
      duration_months,
      funding_goal,
      funding_deadline,
      farm_size,
    } = req.body;

    if (!title || !description || !budget || !location) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Normalize location
    const locationStr =
      typeof location === "object"
        ? `${location.lat},${location.lng}`
        : location;

    // 1) Create project (status defaults to pending)
    const project = await prisma.project.create({
      data: {
        farmer_id: req.user.id,
        title,
        description,
        budget: parseFloat(budget),
        location: locationStr,
        expected_yield: expected_yield || null,
        project_type: project_type || null,
        duration_months: duration_months ? parseInt(duration_months, 10) : null,
        funding_goal: funding_goal ? parseFloat(funding_goal) : 0,
        funding_deadline: funding_deadline ? new Date(funding_deadline) : null,
        farm_size: farm_size ? parseFloat(farm_size) : null,
      },
    });

    // 2) Run AI + climate analysis
    try {
      await runAnalysis(project.id, req.user);
    } catch (analysisError) {
      console.error("Analysis failed:", analysisError);
    }

    // 3) Notify admins that a fully‑analyzed proposal is ready
    const admins = await prisma.user.findMany({
      where: { user_type: "admin" },
    });
    await Promise.all(
      admins.map((admin) =>
        prisma.notification.create({
          data: {
            user_id: admin.id,
            title: "Proposal ready for review",
            message: `"${project.title}" has AI & Climate insights and awaits your review`,
            type: "proposal_review",
            metadata: { projectId: project.id },
          },
        })
      )
    );

    return res.status(201).json({ success: true, data: { project } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
}
async function getProjectWithAnalysis(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    // Fetch project with AI analysis and climate data

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            first_name: true,
            last_name: true,
            location: true,
            bio: true,
          },
        },
        ai_analysis: true,
        climate_data: true,
      },
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    
    if (user.userType !== "admin" && project.farmer_id !== user.id && user.userType !== "investor") {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions" });
    }
    return res.json({
      success: true,
      project: project,
      aiAnalysis: project.ai_analysis,
      climateData: project.climate_data,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}


async function getProjects(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      project_type,
      location,
      minBudget,
      maxBudget,
      sortBy = "created_at",
      sortOrder = "desc",
      search,
    } = req.query;

    const where = { status: "approved" };
    if (project_type) where.project_type = project_type;
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget.gte = parseFloat(minBudget);
      if (maxBudget) where.budget.lte = parseFloat(maxBudget);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          farmer: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              location: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        take: parseInt(limit, 10),
        skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      }),
      prisma.project.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10),
        },
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            location: true,
            bio: true,
          },
        },
        investments: {
          include: {
            investor: {
              select: { id: true, first_name: true, last_name: true },
            },
          },
        },
      },
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    return res.json({ success: true, data: { project } });
  } catch (error) {
    console.error("Get project by ID error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function getFarmerProjects(req, res) {
  try {
    const farmerId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const where = { farmer_id: farmerId };
    if (status) where.status = status;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          investments: {
            select: {
              id: true,
              amount: true,
              status: true,
              investment_date: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        take: parseInt(limit, 10),
        skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      }),
      prisma.project.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit, 10),
        },
      },
    });
  } catch (error) {
    console.error("Get farmer projects error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    if (project.farmer_id !== req.user.id && req.user.userType !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to update this project",
        });
    }
    const updateFields = {
      title: data.title,
      description: data.description,
      expected_yield: data.expected_yield,
      project_type: data.project_type,
    };

    if (data.budget !== undefined) updateFields.budget = parseFloat(data.budget);
    if (data.funding_goal !== undefined) updateFields.funding_goal = parseFloat(data.funding_goal);
    if (data.duration_months !== undefined) updateFields.duration_months = parseInt(data.duration_months, 10);
    if (data.farm_size !== undefined) updateFields.farm_size = parseFloat(data.farm_size);
    
    if (data.location !== undefined) {
      updateFields.location = data.location;
    }
    
    if (data.funding_deadline !== undefined) {
      updateFields.funding_deadline = data.funding_deadline 
        ? new Date(data.funding_deadline) 
        : null;
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateFields,
    });

    return res.json({ success: true, data: { project: updated } });
  } catch (error) {
    console.error("Update project error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    if (project.farmer_id !== req.user.id && req.user.userType !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this project",
        });
    }
    const count = await prisma.investment.count({ where: { project_id: id } });
    if (count > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot delete project with investments",
        });
    }
    await prisma.project.delete({ where: { id } });
    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function updateProjectStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = [
      "pending",
      "approved",
      "rejected",
      "in_progress",
      "funded",
      "completed",
    ];
    if (!valid.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });

    await prisma.notification.create({
      data: {
        user_id: project.farmer_id,
        title: `Your proposal was ${status}`,
        message: `Project "${project.title}" has been ${status}`,
        type: "status_update",
        metadata: { projectId: id },
      },
    });

    return res.json({ success: true, data: project });
  } catch (error) {
    console.error("Update status error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getFarmerProjects,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getProjectWithAnalysis,
};
