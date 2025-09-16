import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import {
  Sprout,
  TrendingUp,
  Shield,
  Users,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Target,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-500 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-orange-500 rounded-full animate-bounce delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            <div className="animate-fadeIn">
              <Badge className="mb-6 px-6 py-2 text-sm font-semibold shadow-lg" variant="primary">
                🚀 AI-Powered Agricultural Investment Platform
              </Badge>
            </div>
            <div className="animate-slideUp">
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
                Connecting Farmers with
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Impact Investors
                </span>
              </h1>
            </div>
            <div className="animate-slideUp delay-200">
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Bridge the financing gap for smallholder farmers in Africa through
                AI-driven risk analysis, transparent funding, and measurable
                impact tracking.
              </p>
            </div>
            <div className="animate-slideUp delay-400 flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth/signup?type=farmer">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sprout className="mr-3 h-6 w-6" />
                  I'm a Farmer
                </Button>
              </Link>
              <Link to="/auth/signup?type=investor">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2"
                >
                  <TrendingUp className="mr-3 h-6 w-6" />
                  I'm an Investor
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Cards */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center space-x-4 p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Secure & Transparent</h3>
                  <p className="text-gray-600 text-sm">Blockchain-backed escrow system</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 delay-100">
              <div className="flex items-center space-x-4 p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">AI-Powered Analysis</h3>
                  <p className="text-gray-600 text-sm">Smart risk assessment & ROI prediction</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 delay-200">
              <div className="flex items-center space-x-4 p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Measurable Impact</h3>
                  <p className="text-gray-600 text-sm">Track social & environmental outcomes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2" variant="outline">
              ⚡ Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by AI, Built for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform combines artificial intelligence with agricultural
              expertise to create transparent, efficient and impactful funding
              solutions for smallholder farmers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI Risk Analysis",
                description: "Large Language models analyze climate data, soil conditions, and market trends to provide accurate risk assessments for investments.",
                color: "green",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: Shield,
                title: "Secure Escrow",
                description: "Funds are held securely until project milestones are met, ensuring transparency and accountability for all parties.",
                color: "blue",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: TrendingUp,
                title: "ROI Estimation",
                description: "Data-driven return on investment calculations help investors make informed decisions based on historical and predictive analytics.",
                color: "purple",
                gradient: "from-purple-500 to-violet-600"
              },
              {
                icon: Users,
                title: "Community Impact",
                description: "Track the social and environmental impact of your investments with detailed metrics and progress reports.",
                color: "orange",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Globe,
                title: "Mobile Money",
                description: "Integrated payment solutions supporting mobile money and traditional banking for seamless transactions across Africa.",
                color: "red",
                gradient: "from-red-500 to-pink-600"
              },
              {
                icon: CheckCircle,
                title: "Milestone Tracking",
                description: "Real-time project monitoring with automated milestone verification and progress updates for complete transparency.",
                color: "teal",
                gradient: "from-teal-500 to-cyan-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white">
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2" variant="outline">
              🔄 Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How AgriMarket Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A simple, transparent process that connects smallholder farmers
              with investors through AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              {[
                {
                  step: 1,
                  title: "Farmers Submit Projects",
                  description: "Smallholder farmers create detailed project proposals including crop type, budget requirements, funding goal, expected yields, farm size and location data."
                },
                {
                  step: 2,
                  title: "AI Analysis",
                  description: "Our AI engine analyzes climate data, soil conditions, market trends and historical performance to generate comprehensive risk and ROI scores based on the farmer's proposal."
                },
                {
                  step: 3,
                  title: "Investor Discovery",
                  description: "Investors browse the marketplace, filter projects by risk level, ROI potential and impact metrics to find suitable investments."
                },
                {
                  step: 4,
                  title: "Secure Funding",
                  description: "Funds are transferred through secure escrow, released based on verified milestones, ensuring accountability and transparency."
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-6 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-white shadow-2xl border-0 transform hover:scale-105 transition-all duration-500">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Sprout className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Sample Project
                  </h4>
                  <p className="text-gray-600 font-medium">
                    Drip Irrigation System Implementation
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Funding Goal</span>
                    <span className="text-lg font-bold text-gray-900">$2,500</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">AI Risk Score</span>
                    <Badge variant="success" className="bg-green-100 text-green-800 px-4 py-2 font-bold">
                      Low Risk
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Estimated ROI</span>
                    <span className="text-lg font-bold text-green-600">18-22%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Climate Risk</span>
                    <Badge variant="warning" className="bg-yellow-100 text-yellow-800 px-4 py-2 font-bold">
                      Moderate
                    </Badge>
                  </div>
                </div>

                <Button className="w-full mt-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  View Full Analysis
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2" variant="outline">
              📈 Our Impact
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Creating Measurable
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every investment through AgriMarket contributes to sustainable
              agricultural development and improved livelihoods across Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {[
              { number: "2,500+", label: "Farmers Supported", color: "green", icon: Users },
              { number: "$1.2M", label: "Total Funding", color: "blue", icon: TrendingUp },
              { number: "85%", label: "Success Rate", color: "purple", icon: Award },
              { number: "12,000", label: "Lives Impacted", color: "orange", icon: Star }
            ].map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                <div className="p-8">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${
                    stat.color === 'green' ? 'from-green-500 to-green-600' :
                    stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    'from-orange-500 to-orange-600'
                  } rounded-2xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`text-5xl font-bold mb-3 ${
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-green-600 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full animate-bounce"></div>
            </div>
            
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make an Impact?
              </h3>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                Join thousands of farmers and investors creating sustainable
                change in agriculture. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/auth/signup?type=farmer">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Start as Farmer
                  </Button>
                </Link>
                <Link to="/auth/signup?type=investor">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-green-600 bg-transparent shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Invest Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
            }
