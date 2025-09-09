// backend/controllers/investmentController.js
const { prisma } = require('../config/database');
const paystackService = require("../services/paystackService");


const createInvestment = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { projectId, amount, paymentMethod } = req.body;

    if (req.user.userType !== 'investor') {
      return res.status(403).json({ success: false, message: 'Only investors can make investments' });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.status !== 'approved') {
      return res.status(404).json({ success: false, message: 'Project not available for investment' });
    }

    const newTotal = parseFloat(project.currentFunding) + parseFloat(amount);
    if (newTotal > parseFloat(project.fundingGoal)) {
      return res.status(400).json({ success: false, message: 'Investment exceeds funding needed' });
    }

    const investment = await prisma.investment.create({
      data: {
        investorId,
        projectId,
        amount,
        paymentMethod,
        status: 'pending',
        expectedReturn: parseFloat(amount) * 1.15,
      },
      include: {
        investor: { select: { id: true, firstName: true, lastName: true, email: true } },
        project: { select: { id: true, title: true, fundingGoal: true, currentFunding: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Investment created',
      data: { investment }
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


const processPayment = async (req, res) => {
  try {
    const { investmentId } = req.body;

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: {
        project: { select: { id: true, title: true, farmerId: true } },
        investor: { select: { id: true, email: true, firstName: true, lastName: true } }
      }
    });

    if (!investment || investment.investorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const paymentDetails = await paystackService.initializePayment(
      investment.investor.email,
      investment.amount,
      investment.id,
      { investmentId: investment.id, projectId: investment.projectId, investorId: investment.investorId }
    );

    await prisma.investment.update({
      where: { id: investment.id },
      data: {
        paymentReference: paymentDetails.reference,
        status: 'pending'
      }
    });

    res.json({
      success: true,
      message: 'Payment initialized',
      data: paymentDetails
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed', error: error.message });
  }
};


const getInvestorInvestments = async (req, res) => {
  try {
    const investorId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { investorId, ...(status && { status }) };

    const [count, investments] = await Promise.all([
      prisma.investment.count({ where }),
      prisma.investment.findMany({
        where,
        skip: offset,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              status: true,
              fundingGoal: true,
              currentFunding: true,
              location: true,
              farmer: { select: { id: true, firstName: true, lastName: true } }
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get investor investments error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


const getInvestmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await prisma.investment.findUnique({
      where: { id: parseInt(id) },
      include: {
        investor: { select: { id: true, firstName: true, lastName: true, email: true } },
        project: {
          include: {
            farmer: { select: { id: true, firstName: true, lastName: true, email: true } }
          }
        }
      }
    });

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    const userId = req.user.id;
    const isAuthorized = investment.investorId === userId || investment.project.farmerId === userId || req.user.userType === 'admin';
    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    res.json({ success: true, data: { investment } });
  } catch (error) {
    console.error('Get investment by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


const getProjectInvestments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const project = await prisma.project.findUnique({ where: { id: parseInt(projectId) } });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.farmerId !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const [count, investments] = await Promise.all([
      prisma.investment.count({ where: { projectId: parseInt(projectId) } }),
      prisma.investment.findMany({
        where: { projectId: parseInt(projectId) },
        skip: offset,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          investor: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get project investments error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createInvestment,
  processPayment,
  getInvestorInvestments,
  getInvestmentById,
  getProjectInvestments
};
