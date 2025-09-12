// frontend/src/components/dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Activity,
  DollarSign,
  BarChart3,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  Sprout,
 
} from "lucide-react";
import Card from "../ui/Card";
import Table from "../ui/Table";
import Button from "../ui/Button";
import AdminProjectModal from "./AdminProjectModal";
import { getAdminDashboard } from "../../services/dashboardService";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalInvestors: 0,
    totalProjects: 0,
    totalInvestments: 0,
    totalInvestmentAmount: 0,
    totalFundingGoal: 0,
    totalFundingReceived: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentInvestments, setRecentInvestments] = useState([]);
  const [projectsByStatus, setProjectsByStatus] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "proposals", label: "Proposals", icon: FileText },
    { id: "investments", label: "Investments", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
  ];

  
  const fetchData = async () => {
    setLoading(true);
    try {
      const {
        platformStats,
        recentProjects: rp,
        recentInvestments: ri,
        projectsByStatus: pbs,
      } = await getAdminDashboard();

      setStats({
        totalUsers: platformStats.totalUsers,
        totalFarmers: platformStats.totalFarmers,
        totalInvestors: platformStats.totalInvestors,
        totalProjects: platformStats.totalProjects,
        totalInvestments: platformStats.totalInvestments,
        totalInvestmentAmount: platformStats.totalInvestmentAmount,
        totalFundingGoal: platformStats.totalFundingGoal,
        totalFundingReceived: platformStats.totalFundingReceived,
      });

      setRecentProjects(
        rp.map((pr) => ({
          id: pr.id,
          title: pr.title,
          farmer: `${pr.farmer.first_name} ${pr.farmer.last_name}`,
          amount: `$${pr.current_funding.toLocaleString()}`,
          status: pr.status,
          actions: (
            <Button
              className="text-emerald-600 hover:underline"
              onClick={() => setSelectedProjectId(pr.id)}
            >
              View
            </Button>
          ),
        }))
      );

      setRecentInvestments(
        ri.map((inv) => ({
          id: inv.id,
          investor: `${inv.investor.first_name} ${inv.investor.last_name}`,
          project: inv.project.title,
          amount: `$${inv.amount.toLocaleString()}`,
          status: inv.status,
          actions: (
            <a
              href={`/investments/${inv.id}`}
              className="text-emerald-600 hover:underline"
            >
              Details
            </a>
          ),
        }))
      );

      setProjectsByStatus(pbs);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const getFilteredData = () => {
    if (activeTab === "proposals") {
      return recentProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.farmer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab === "investments") {
      return recentInvestments.filter(
        (i) =>
          i.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.project.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab === "users") {
      return [
        { id: 1, name: "Total Farmers", count: stats.totalFarmers, type: "Farmer" },
        { id: 2, name: "Total Investors", count: stats.totalInvestors, type: "Investor" },
      ].filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [];
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const renderPagination = () =>
    totalPages > 1 && (
      <div className="flex items-center justify-between mt-6 flex-wrap gap-2">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, getFilteredData().length)} of{" "}
          {getFilteredData().length} entries
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-white border border-emerald-300 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === i + 1
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-emerald-600 border border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-white border border-emerald-300 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );

  /** ---------------------------
   * Dashboard Layout
   * --------------------------- */
  const renderDashboard = () => (
    <div className="p-6 space-y-8">
    <div className="space-y-6">
      {/* Metrics */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Metrics</h1>
        <p className="text-gray-600">Platform performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-emerald-700">Total Users</p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.totalUsers}</p>
              <p className="text-xs text-emerald-600 mt-1">Platform users</p>
            </div>
            <div className="bg-emerald-200 text-emerald-700 p-3 rounded-full">
              <Users size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-green-700">Total Projects</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalProjects}</p>
              <p className="text-xs text-green-600 mt-1">Active projects</p>
            </div>
            <div className="bg-green-200 text-green-700 p-3 rounded-full">
              <FileText size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-yellow-700">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {projectsByStatus.find((p) => p.status === "pending")?.count || 0}
              </p>
              <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
            </div>
            <div className="bg-yellow-200 text-yellow-700 p-3 rounded-full">
              <Activity size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Funding</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${stats.totalInvestmentAmount.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">Investment amount</p>
            </div>
            <div className="bg-blue-200 text-blue-700 p-3 rounded-full">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Sprout className="mr-2 text-emerald-600" size={20} /> Recent Projects
        </h2>
        <Table
          columns={[
            { header: "Project", accessor: "title" },
            { header: "Farmer", accessor: "farmer" },
            { header: "Funded", accessor: "amount" },
            { header: "Status", accessor: "status" },
            { header: "Actions", accessor: "actions" },
          ]}
          data={recentProjects}
        />
      </Card>

      {/* Recent Investments */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-blue-600" size={20} /> Recent Investments
        </h2>
        <Table
          columns={[
            { header: "Investor", accessor: "investor" },
            { header: "Project", accessor: "project" },
            { header: "Amount", accessor: "amount" },
            { header: "Status", accessor: "status" },
            { header: "Actions", accessor: "actions" },
          ]}
          data={recentInvestments}
        />
      </Card>
    </div>
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === "dashboard") return renderDashboard();

    const data = getPaginatedData();
    let columns = [];
    let title = "";

    if (activeTab === "proposals") {
      title = "Proposals Management";
      columns = [
        { header: "Project", accessor: "title" },
        { header: "Farmer", accessor: "farmer" },
        { header: "Funded", accessor: "amount" },
        { header: "Status", accessor: "status" },
        { header: "Actions", accessor: "actions" },
      ];
    } else if (activeTab === "investments") {
      title = "Investments Management";
      columns = [
        { header: "Investor", accessor: "investor" },
        { header: "Project", accessor: "project" },
        { header: "Amount", accessor: "amount" },
        { header: "Status", accessor: "status" },
        { header: "Actions", accessor: "actions" },
      ];
    } else if (activeTab === "users") {
      title = "Users Management";
      columns = [
        { header: "User Type", accessor: "name" },
        { header: "Count", accessor: "count" },
        { header: "Type", accessor: "type" },
      ];
    }

    return (

      <div className="pt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Manage and monitor {activeTab}</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <Table columns={columns} data={data} />
          {renderPagination()}
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-emerald-500">
      {/* Sidebar */}
      <aside
        className={`sticky top-12 bg-white shadow-lg transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } flex-shrink-0 overflow-y-auto h-[calc(100vh-5rem)]`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">AgriMarket</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "text-gray-700 hover:bg-gray-100" 
                } `}
              >
                <Icon size={30} />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>       
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">{renderTabContent()}</div>

      {/* Project Modal */}
      {selectedProjectId && (
        <AdminProjectModal
          projectId={selectedProjectId}
          onStatusChange={() => fetchData()}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
