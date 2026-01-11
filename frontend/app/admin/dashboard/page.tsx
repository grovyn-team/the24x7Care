'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';

interface DashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  totalDoctors: number;
  totalServices: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboard() as DashboardStats;
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalEnquiries || 0}
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="Pending Queries"
          value={stats?.newEnquiries || 0}
          change="-5%"
          changeType="negative"
        />
        <StatCard
          title="Active Services"
          value={stats?.totalServices || 0}
          change="+2"
          changeType="positive"
        />
        <StatCard
          title="Total Doctors"
          value={stats?.totalDoctors || 0}
          change="+18%"
          changeType="positive"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Connect to database to view real data</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  changeType,
}: {
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative';
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <span
          className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
