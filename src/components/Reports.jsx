"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { LineChart, Line } from "recharts"

const Reports = () => {
  const [dateRange, setDateRange] = useState("last6months")
  const [reportType, setReportType] = useState("noshow")

  const noShowData = [
    { month: "Jul", noShow: 12, total: 150, rate: 8.0 },
    { month: "Aug", noShow: 18, total: 180, rate: 10.0 },
    { month: "Sep", noShow: 15, total: 165, rate: 9.1 },
    { month: "Oct", noShow: 22, total: 200, rate: 11.0 },
    { month: "Nov", noShow: 25, total: 210, rate: 11.9 },
    { month: "Dec", noShow: 20, total: 190, rate: 10.5 },
  ]

  const usageData = [
    { week: "Wk 1", users: 145, appointments: 89, logins: 234 },
    { week: "Wk 2", users: 198, appointments: 156, logins: 312 },
    { week: "Wk 3", users: 176, appointments: 134, logins: 287 },
    { week: "Wk 4", users: 223, appointments: 178, logins: 356 },
  ]

  const handleExportReport = () => {
    const data = reportType === "noshow" ? noShowData : usageData
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${reportType}_report_${dateRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    console.log("[v0] Exported report:", reportType)
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <div className="flex space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="noshow">No-Show Reports</option>
            <option value="usage">Usage Reports</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="last6months">Last 6 Months</option>
            <option value="last3months">Last 3 Months</option>
            <option value="lastmonth">Last Month</option>
          </select>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Export CSV
          </button>
        </div>
      </div>

      {reportType === "noshow" && (
        <div className="p-4 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Appointment No-Show Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={noShowData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "noShow" ? `${value} no-shows` : `${value} total`,
                  name === "noShow" ? "No-Shows" : "Total Appointments",
                ]}
              />
              <Bar dataKey="noShow" fill="#ef4444" name="noShow" />
              <Bar dataKey="total" fill="#3b82f6" name="total" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800">Average No-Show Rate</h4>
              <p className="text-2xl font-bold text-red-600">
                {(noShowData.reduce((acc, curr) => acc + curr.rate, 0) / noShowData.length).toFixed(1)}%
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">Total Appointments</h4>
              <p className="text-2xl font-bold text-blue-600">
                {noShowData.reduce((acc, curr) => acc + curr.total, 0)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800">Total No-Shows</h4>
              <p className="text-2xl font-bold text-gray-600">
                {noShowData.reduce((acc, curr) => acc + curr.noShow, 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {reportType === "usage" && (
        <div className="p-4 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Weekly System Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#10b981" name="Active Users" strokeWidth={2} />
              <Line type="monotone" dataKey="appointments" stroke="#3b82f6" name="Appointments" strokeWidth={2} />
              <Line type="monotone" dataKey="logins" stroke="#8b5cf6" name="Logins" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Reports
