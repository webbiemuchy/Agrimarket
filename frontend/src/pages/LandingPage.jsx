//frontend/src/pages/LandingPage.jsx

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
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-4" variant="primary">
              AI-Powered Agricultural Investment
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connecting Farmers with
              <span className="text-green-600"> Impact Investors</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bridge the financing gap for smallholder farmers in Africa through
              AI-driven risk analysis, transparent funding, and measurable
              impact tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup?type=farmer">
                <Button size="lg" className="w-full sm:w-auto">
                  <Sprout className="mr-2 h-5 w-5" />
                  I'm a Farmer
                </Button>
              </Link>
              <Link to="/auth/signup?type=investor">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  I'm an Investor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by AI, Built for Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines artificial intelligence with agricultural
              expertise to create transparent, efficient and impactful funding
              solutions for small holders farmers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Risk Analysis
              </h3>
              <p className="text-gray-600">
                Large Language models analyze climate data, soil conditions, and
                market trends to provide accurate risk assessments for the
                investment.
              </p>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Escrow
              </h3>
              <p className="text-gray-600">
                Funds are held securely until project milestones are met,
                ensuring transparency and accountability for all parties.
              </p>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ROI Estimation
              </h3>
              <p className="text-gray-600">
                Data-driven return on investment calculations help investors
                make informed decisions based on historical and predictive
                analytics.
              </p>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community Impact
              </h3>
              <p className="text-gray-600">
                Track the social and environmental impact of your investments
                with detailed metrics and progress reports.
              </p>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mobile Money
              </h3>
              <p className="text-gray-600">
                Integrated payment solutions supporting mobile money and
                traditional banking for seamless transactions across Africa.
              </p>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Milestone Tracking
              </h3>
              <p className="text-gray-600">
                Real-time project monitoring with automated milestone
                verification and progress updates for complete transparency.
              </p>
            </Card>
          </div>
        </div>
      </section>

      
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AgriMarket Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, transparent process that connects small holders farmers
              with investors through AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Farmers Submit Projects
                  </h3>
                  <p className="text-gray-600">
                    Smallholder farmers create detailed project proposals
                    including crop type, budget requirements, funding goal,
                    expected yields, farm size and location data .
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI Analysis
                  </h3>
                  <p className="text-gray-600">
                    Our AI engine analyzes climate data, soil conditions, market
                    trends and historical performance to generate comprehensive
                    risk and ROI scores based on the farmer's proposal.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Investor Discovery
                  </h3>
                  <p className="text-gray-600">
                    Investors browse the marketplace, filter projects by risk
                    level, ROI potential and impact metrics to find suitable
                    investments.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Secure Funding
                  </h3>
                  <p className="text-gray-600">
                    Funds are transferred through secure escrow, released based
                    on verified milestones, ensuring accountability and
                    transparency.
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-white shadow-xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sprout className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Sample Project
                  </h4>
                  <p className="text-sm text-gray-600">
                    Drip Irrigation System
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Funding Goal</span>
                    <span className="text-sm font-medium">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">AI Risk Score</span>
                    <Badge
                      variant="success"
                      className="bg-green-100 text-green-800"
                    >
                      Low Risk
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated ROI</span>
                    <span className="text-sm font-medium text-green-600">
                      18-22%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Climate Risk</span>
                    <Badge
                      variant="warning"
                      className="border-yellow-200 text-yellow-800"
                    >
                      Moderate
                    </Badge>
                  </div>
                </div>

                <Button className="w-full">
                  View Full Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      
      <section id="impact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Creating Measurable Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every investment through AgriMarket contributes to sustainable
              agricultural development and improved livelihoods across Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                2,500+
              </div>
              <div className="text-gray-600">Farmers Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$1.2M</div>
              <div className="text-gray-600">Total Funding</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                12,000
              </div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of farmers and investors creating sustainable
              change in agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup?type=farmer">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Start as Farmer
                </Button>
              </Link>
              <Link to="/auth/signup?type=investor">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                >
                  Invest Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
