import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

import { ClipboardPlus, MapPin, Bell, Building2 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container-app py-10 space-y-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Citizen Service Portal
            </h1>

            <p className="text-blue-100 mb-6">
              Report civic issues, track complaint progress, and stay updated
              with your city services — all in one place.
            </p>

            <Link to="/new-complaint">
              <Button>Report an Issue</Button>
            </Link>
          </div>

          <div className="flex justify-center">
            <Building2 size={120} className="text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardPlus size={22} className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Submit Complaint</p>
              <p className="text-lg font-semibold">Report new issues</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin size={22} className="text-green-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Track Complaints</p>
              <p className="text-lg font-semibold">View complaint progress</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Bell size={22} className="text-orange-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">City Updates</p>
              <p className="text-lg font-semibold">Notifications & alerts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold text-lg mb-2">Submit Complaint</h3>

            <p className="text-sm text-slate-600 mb-4">
              Report civic issues in your area quickly and easily.
            </p>

            <Link to="/new-complaint">
              <Button>New Complaint</Button>
            </Link>
          </Card>

          <Card>
            <h3 className="font-semibold text-lg mb-2">Track Status</h3>

            <p className="text-sm text-slate-600 mb-4">
              View progress and updates on submitted complaints.
            </p>

            <Link to="/my-complaints">
              <Button variant="outline">View Complaints</Button>
            </Link>
          </Card>

          <Card>
            <h3 className="font-semibold text-lg mb-2">City Updates</h3>

            <p className="text-sm text-slate-600 mb-4">
              Latest announcements and service notifications.
            </p>

            <Button variant="outline">Coming Soon</Button>
          </Card>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <Building2 size={100} className="text-blue-500" />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              Building a Smarter City Together
            </h3>

            <p className="text-slate-600">
              Our intelligent system automatically classifies and routes your
              complaints to the correct municipal departments using AI, ensuring
              faster resolution and better public services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
