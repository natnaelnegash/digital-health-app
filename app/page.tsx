"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, Users, FileText, Settings, Edit, Trash2, Clock, Calendar, UserCheck } from "lucide-react"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function DigitalHealthSystem() {
  const [currentView, setCurrentView] = useState<"login" | "admin">("login")
  const [activeSection, setActiveSection] = useState<"users" | "reports" | "config">("users")

  const [appointmentSettings, setAppointmentSettings] = useState({
    defaultSlotDuration: "30",
    bufferTime: "15",
    maxAdvanceBooking: "30",
    cancellationDeadline: "24",
    autoReminders: true,
    allowOnlineBooking: true,
    requireApproval: false,
  })

  const [providerAvailability, setProviderAvailability] = useState({
    monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "13:00" },
    sunday: { enabled: false, startTime: "09:00", endTime: "13:00" },
  })

  const mockUsers = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", status: "Active" },
    { id: 2, name: "Nurse Mike Chen", role: "Nurse", status: "Active" },
    { id: 3, name: "Admin Lisa Brown", role: "Administrator", status: "Active" },
    { id: 4, name: "Patient John Smith", role: "Patient", status: "Inactive" },
    { id: 5, name: "Dr. Emily Davis", role: "Doctor", status: "Active" },
  ]

  const appointmentData = [
    { month: "Jan", scheduled: 120, attended: 95, noShow: 25 },
    { month: "Feb", scheduled: 135, attended: 108, noShow: 27 },
    { month: "Mar", scheduled: 148, attended: 125, noShow: 23 },
    { month: "Apr", scheduled: 162, attended: 140, noShow: 22 },
    { month: "May", scheduled: 155, attended: 132, noShow: 23 },
    { month: "Jun", scheduled: 170, attended: 148, noShow: 22 },
  ]

  const systemUsageData = [
    { day: "Mon", logins: 45, appointments: 32 },
    { day: "Tue", logins: 52, appointments: 38 },
    { day: "Wed", logins: 48, appointments: 35 },
    { day: "Thu", logins: 61, appointments: 42 },
    { day: "Fri", logins: 55, appointments: 39 },
    { day: "Sat", logins: 28, appointments: 18 },
    { day: "Sun", logins: 22, appointments: 12 },
  ]

  const userRoleData = [
    { name: "Patients", value: 245, color: "#3b82f6" },
    { name: "Doctors", value: 28, color: "#10b981" },
    { name: "Nurses", value: 42, color: "#f59e0b" },
    { name: "Admins", value: 8, color: "#ef4444" },
  ]

  const handleSettingChange = (key: string, value: string | boolean) => {
    setAppointmentSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleAvailabilityChange = (day: string, field: string, value: string | boolean) => {
    setProviderAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value },
    }))
  }

  const handleSaveSettings = () => {
    console.log("[v0] Saving appointment settings:", appointmentSettings)
    console.log("[v0] Saving provider availability:", providerAvailability)
    // Here you would typically save to a backend
  }

  const handleRoleConfirm = () => {
    setCurrentView("admin")
  }

  if (currentView === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-900">Digital Health System - Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2">
                <span className="text-gray-700 text-sm">English</span>
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </div>
              <Button variant="destructive" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Sidebar */}
          <aside className="w-64 bg-slate-800 text-white">
            <nav className="p-4 space-y-2">
              <Button
                variant={activeSection === "users" ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  activeSection === "users"
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => setActiveSection("users")}
              >
                <Users className="w-4 h-4" />
                User Management
              </Button>
              <Button
                variant={activeSection === "reports" ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  activeSection === "reports"
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => setActiveSection("reports")}
              >
                <FileText className="w-4 h-4" />
                Reports
              </Button>
              <Button
                variant={activeSection === "config" ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  activeSection === "config"
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                onClick={() => setActiveSection("config")}
              >
                <Settings className="w-4 h-4" />
                Appointment Config
              </Button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {activeSection === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700">Add New User</Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mockUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 hover:text-blue-700 bg-transparent"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 bg-transparent"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "reports" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Users</p>
                          <p className="text-2xl font-bold text-gray-900">323</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">This Month</p>
                          <p className="text-2xl font-bold text-gray-900">170</p>
                        </div>
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">No-Show Rate</p>
                          <p className="text-2xl font-bold text-gray-900">12.9%</p>
                        </div>
                        <Settings className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Today</p>
                          <p className="text-2xl font-bold text-gray-900">61</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Appointment No-Show Rates */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointment No-Show Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={appointmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="attended" fill="#10b981" name="Attended" />
                          <Bar dataKey="noShow" fill="#ef4444" name="No Show" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* System Usage */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly System Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={systemUsageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="logins" stroke="#3b82f6" name="Logins" strokeWidth={2} />
                          <Line
                            type="monotone"
                            dataKey="appointments"
                            stroke="#10b981"
                            name="Appointments"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* User Role Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Role Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={userRoleData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {userRoleData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Monthly Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Appointment Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={appointmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="scheduled" stroke="#f59e0b" name="Scheduled" strokeWidth={2} />
                          <Line type="monotone" dataKey="attended" stroke="#10b981" name="Attended" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "config" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">Appointment Configuration</h2>
                  <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                    Save Settings
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* General Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        General Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="slotDuration">Default Slot Duration (minutes)</Label>
                        <Select
                          value={appointmentSettings.defaultSlotDuration}
                          onValueChange={(value) => handleSettingChange("defaultSlotDuration", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bufferTime">Buffer Time Between Appointments (minutes)</Label>
                        <Select
                          value={appointmentSettings.bufferTime}
                          onValueChange={(value) => handleSettingChange("bufferTime", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No buffer</SelectItem>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxAdvance">Maximum Advance Booking (days)</Label>
                        <Input
                          id="maxAdvance"
                          type="number"
                          value={appointmentSettings.maxAdvanceBooking}
                          onChange={(e) => handleSettingChange("maxAdvanceBooking", e.target.value)}
                          placeholder="30"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cancellation">Cancellation Deadline (hours)</Label>
                        <Input
                          id="cancellation"
                          type="number"
                          value={appointmentSettings.cancellationDeadline}
                          onChange={(e) => handleSettingChange("cancellationDeadline", e.target.value)}
                          placeholder="24"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Booking Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Booking Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="autoReminders"
                          checked={appointmentSettings.autoReminders}
                          onCheckedChange={(checked) => handleSettingChange("autoReminders", checked as boolean)}
                        />
                        <Label htmlFor="autoReminders">Enable automatic reminders</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="onlineBooking"
                          checked={appointmentSettings.allowOnlineBooking}
                          onCheckedChange={(checked) => handleSettingChange("allowOnlineBooking", checked as boolean)}
                        />
                        <Label htmlFor="onlineBooking">Allow online booking</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requireApproval"
                          checked={appointmentSettings.requireApproval}
                          onCheckedChange={(checked) => handleSettingChange("requireApproval", checked as boolean)}
                        />
                        <Label htmlFor="requireApproval">Require admin approval for bookings</Label>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-3">Current Settings Summary</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• Slot Duration: {appointmentSettings.defaultSlotDuration} minutes</p>
                          <p>• Buffer Time: {appointmentSettings.bufferTime} minutes</p>
                          <p>• Max Advance: {appointmentSettings.maxAdvanceBooking} days</p>
                          <p>• Cancellation: {appointmentSettings.cancellationDeadline} hours notice</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Provider Availability */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Provider Availability Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(providerAvailability).map(([day, schedule]) => (
                        <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-20">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={schedule.enabled}
                                onCheckedChange={(checked) =>
                                  handleAvailabilityChange(day, "enabled", checked as boolean)
                                }
                              />
                              <Label className="capitalize font-medium">{day}</Label>
                            </div>
                          </div>

                          {schedule.enabled && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm">From:</Label>
                                <Input
                                  type="time"
                                  value={schedule.startTime}
                                  onChange={(e) => handleAvailabilityChange(day, "startTime", e.target.value)}
                                  className="w-32"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Label className="text-sm">To:</Label>
                                <Input
                                  type="time"
                                  value={schedule.endTime}
                                  onChange={(e) => handleAvailabilityChange(day, "endTime", e.target.value)}
                                  className="w-32"
                                />
                              </div>
                            </div>
                          )}

                          {!schedule.enabled && <span className="text-gray-500 text-sm">Unavailable</span>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-teal-800 relative overflow-hidden">
      {/* Medical Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-20 left-20 w-32 h-32 border-2 border-white/30 transform rotate-45"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 border-2 border-white/20 transform rotate-12"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        ></div>
        <div
          className="absolute bottom-32 left-40 w-28 h-28 border-2 border-white/25 transform -rotate-12"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        ></div>
        <div
          className="absolute top-60 left-1/2 w-20 h-20 border-2 border-white/30"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        ></div>
        <div
          className="absolute bottom-40 right-20 w-36 h-36 border-2 border-white/15 transform rotate-30"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        ></div>

        <div className="absolute top-32 right-1/4 w-16 h-16 border-2 border-white/25 rounded-lg flex items-center justify-center">
          <div className="w-8 h-2 bg-white/30 absolute"></div>
          <div className="w-2 h-8 bg-white/30 absolute"></div>
        </div>

        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 border-2 border-white/20 rounded-lg flex items-center justify-center">
          <div className="w-12 h-8 border-2 border-white/30 rounded-full relative">
            <div className="w-3 h-3 bg-white/30 rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>

        <div className="absolute top-1/2 right-1/3 w-18 h-18 border-2 border-white/25 rounded-lg flex items-center justify-center">
          <div className="w-10 h-6 border-2 border-white/30 rounded-full transform rotate-12"></div>
        </div>
      </div>

      <header className="relative z-10 flex items-center justify-between p-6">
        <h1 className="text-white text-xl font-semibold">Digital Health System</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2">
            <span className="text-white text-sm">English</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
          <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            Logout
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white">Welcome, John Doe!</h2>
              <p className="text-gray-300 text-sm">Email: john@example.com</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center text-white">Select Your Role</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Role</label>
                  <Select>
                    <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="doctor" className="text-white hover:bg-slate-700">
                        Doctor
                      </SelectItem>
                      <SelectItem value="nurse" className="text-white hover:bg-slate-700">
                        Nurse
                      </SelectItem>
                      <SelectItem value="admin" className="text-white hover:bg-slate-700">
                        Administrator
                      </SelectItem>
                      <SelectItem value="patient" className="text-white hover:bg-slate-700">
                        Patient
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={handleRoleConfirm}
                >
                  Confirm Role
                </Button>
              </div>

              <p className="text-center text-sm text-gray-300 leading-relaxed">
                Once selected, your role will determine the features you can access.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="relative z-10 text-center text-white/80 pb-6 px-6">
        <div className="space-y-2">
          <p className="text-sm">© 2025 Digital Health System. All rights reserved.</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <button className="hover:text-white transition-colors">Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
