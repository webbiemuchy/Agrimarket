// backend/controllers/dashboardController.js
const { prisma } = require('../config/database');

// Get investor dashboard data
const getInvestorDashboard = async (req, res) => {
  try {
    const investorId = req.user.id;

    // Investment Summary
    const investments = await prisma.investment.aggregate({
      where: { investor_id: investorId },
      _count: true,
      _sum: { amount: true, expected_return: true, actual_return: true }
    });

    // Investments by status
    const investmentsByStatus = await prisma.investment.groupBy({
      by: ['status'],
      where: { investor_id: investorId },
      _count: { id: true },
      _sum: { amount: true }
    });

    // Recent investments
    const recentInvestments = await prisma.investment.findMany({
      where: { investor_id: investorId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            location: true,
            farmer: {
              select: {
                first_name: true,
                last_name: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    // Portfolio by project type
    const portfolioByType = await prisma.investment.groupBy({
      by: ['project_id'],
      where: { investor_id: investorId },
      _count: { id: true },
      _sum: { amount: true }
    });

    // Fetch corresponding project types
    const projectMap = await prisma.project.findMany({
      where: { id: { in: portfolioByType.map(p => p.project_id) } },
      select: { id: true, project_type: true }
    });

    const portfolioFormatted = portfolioByType.map(item => {
      const project = projectMap.find(p => p.id === item.project_id);
      return {
        project_type: project?.project_type || 'Unknown',
        count: item._count.id,
        totalAmount: item._sum.amount
      };
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalInvestments: investments._count || 0,
          totalInvested: investments._sum.amount || 0,
          expectedReturns: investments._sum.expected_return || 0,
          actualReturns: investments._sum.actual_return || 0
        },
        investmentsByStatus: investmentsByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
          totalAmount: item._sum.amount
        })),
        recentInvestments,
        portfolioByType: portfolioFormatted
      }
    });
  } catch (error) {
    console.error('Get investor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



const getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Project summary
    const projectsSummary = await prisma.project.aggregate({
      where: { farmer_id: farmerId },
      _count: true,
      _sum: { funding_goal: true, current_funding: true }
    });

    // Projects by status
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      where: { farmer_id: farmerId },
      _count: { id: true },
      _sum: { funding_goal: true, current_funding: true }
    });

    // Recent projects + investor info
    const recentProjects = await prisma.project.findMany({
      where: { farmer_id: farmerId },
      include: {
        investments: {
          select: {
            id: true,
            amount: true,
            status: true,
            investor: {
              select: {
                first_name: true,
                last_name: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    // Active projects funding progress
    const activeProjects = await prisma.project.findMany({
      where: {
        farmer_id: farmerId,
        status: { in: ['approved', 'funded', 'in_progress'] }
      },
      select: {
        id: true,
        title: true,
        funding_goal: true,
        current_funding: true,
        status: true,
        funding_deadline: true
      }
    });

    // Total investments received
    const investmentsReceived = await prisma.investment.aggregate({
      where: {
        project: { farmer_id: farmerId }
      },
      _count: true,
      _sum: { amount: true }
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalProjects: projectsSummary._count || 0,
          totalFundingGoal: projectsSummary._sum.funding_foal || 0,
          totalFundingReceived: projectsSummary._sum.current_funding || 0,
          totalInvestments: investmentsReceived._count || 0,
          totalAmount: investmentsReceived._sum.amount || 0
        },
        projectsByStatus: projectsByStatus.map(p => ({
          status: p.status,
          count: p._count.id,
          totalFundingGoal: p._sum.funding_goal,
          totalFundingReceived: p._sum.current_funding
        })),
        recentProjects,
        activeProjects
      }
    });
  } catch (error) {
    console.error('Get farmer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    
    const [totalUsers, totalFarmers, totalInvestors, totalProjects, totalInvestments, totalInvestmentAmount, totalFundingGoal, totalFundingReceived] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { user_type: 'farmer' } }),
      prisma.user.count({ where: { user_type: 'investor' } }),
      prisma.project.count(),
      prisma.investment.count(),
      prisma.investment.aggregate({ _sum: { amount: true } }),
      prisma.project.aggregate({ _sum: { funding_goal: true } }),
      prisma.project.aggregate({ _sum: { current_funding: true } })
    ]);

    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userRegistrationsRaw = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "created_at") AS month,
        "user_type",
        COUNT(id)::int AS count
      FROM "User"
      WHERE "created_at" >= ${sixMonthsAgo}
      GROUP BY month, "user_type"
      ORDER BY month ASC
    `;

    
    const recentProjects = await prisma.project.findMany({
      include: {
        farmer: {
          select: { first_name: true, last_name: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    
    const recentInvestments = await prisma.investment.findMany({
      include: {
        investor: {
          select: { first_name: true, last_name: true }
        },
        project: {
          select: { title: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    res.json({
      success: true,
      data: {
        platformStats: {
          totalUsers,
          totalFarmers,
          totalInvestors,
          totalProjects,
          totalInvestments,
          totalInvestmentAmount: totalInvestmentAmount._sum.amount || 0,
          totalFundingGoal: totalFundingGoal._sum.funding_goal || 0,
          totalFundingReceived: totalFundingReceived._sum.current_funding || 0
        },
        userRegistrations: userRegistrationsRaw,
        recentProjects,
        recentInvestments,
        projectsByStatus: projectsByStatus.map(p => ({
          status: p.status,
          count: p._count.id
        }))
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getInvestorDashboard,
  getFarmerDashboard,
  getAdminDashboard
};

