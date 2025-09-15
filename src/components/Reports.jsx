"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts"
import { API_URL } from "../apiConfig"

const Reports = () => {
  const [dateRange, setDateRange] = useState("last6months")
  const [reportType, setReportType] = useState("noshow")
  const [reportData, setReportData] = useState([])

  useEffect(() => {
    fetchReport()
  }, [dateRange, reportType])

  const getStartDate = (range) => {
    const now = new Date()
    switch (range) {
      case "last3months":
        return new Date(now.setMonth(now.getMonth() - 3)).toISOString()
      case "lastmonth":
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString()
      default:
        return new Date(now.setMonth(now.getMonth() - 6)).toISOString()
    }
  }

  const fetchReport = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/reports`, {
        params: { reportType, startDate: getStartDate(dateRange), endDate: new Date().toISOString() },
        withCredentials: true,
      })
      if (reportType === "noshow") {
        setReportData(res.data.data.noShows || [])
      } else {
        setReportData(res.data.data.loginStats || [])
      }
    } catch (err) {
      console.error("Error fetching report:", err)
    }
  }

  const handleExportReport = () => {
    if (!reportData.length) return alert("No data to export")
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(reportData[0]).join(",") +
      "\n" +
      reportData.map((row) => Object.values(row).join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${reportType}_report_${dateRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

      {reportType === "noshow" && reportData.length > 0 && (
        <div className="p-4 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Appointment No-Show Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="appointmentDate" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value}`, name]} />
              <Bar dataKey="noShow" fill="#ef4444" name="No-Shows" />
              <Bar dataKey="totalAppointments" fill="#3b82f6" name="Total Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {reportType === "usage" && reportData.length > 0 && (
        <div className="p-4 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">System Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="unique_logins" stroke="#10b981" name="Unique Logins" strokeWidth={2} />
              <Line type="monotone" dataKey="appointments" stroke="#3b82f6" name="Appointments" strokeWidth={2} />
              <Line type="monotone" dataKey="active_users" stroke="#8b5cf6" name="Active Users" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Reports
