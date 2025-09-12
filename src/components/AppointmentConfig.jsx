"use client"

import { useState } from "react"

const AppointmentConfig = () => {
  const [slotDuration, setSlotDuration] = useState("30")
  const [provider, setProvider] = useState("")
  const [availability, setAvailability] = useState([])
  const [savedConfigs, setSavedConfigs] = useState([])
  const [showSavedConfigs, setShowSavedConfigs] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    if (!provider) {
      alert("Please select a provider")
      return
    }

    const config = {
      id: Date.now(),
      slotDuration,
      provider,
      availability: [...availability],
      savedAt: new Date().toLocaleString(),
    }

    setSavedConfigs((prev) => [...prev, config])
    console.log("[v0] Saving configuration:", config)
    alert("Configuration saved successfully!")
  }

  const handleLoadConfig = (config) => {
    setSlotDuration(config.slotDuration)
    setProvider(config.provider)
    setAvailability([...config.availability])
    setShowSavedConfigs(false)
    console.log("[v0] Loaded configuration:", config)
  }

  const handleDeleteConfig = (configId) => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      setSavedConfigs((prev) => prev.filter((config) => config.id !== configId))
      console.log("[v0] Deleted configuration:", configId)
    }
  }

  const handleRemoveAvailability = (index) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddAvailability = () => {
    setAvailability([...availability, { day: "Monday", startTime: "09:00", endTime: "17:00" }])
  }

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...availability]
    newAvailability[index][field] = value
    setAvailability(newAvailability)
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointment Configuration</h2>
        <button
          onClick={() => setShowSavedConfigs(!showSavedConfigs)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          {showSavedConfigs ? "Hide" : "Show"} Saved Configs
        </button>
      </div>

      {showSavedConfigs && (
        <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Saved Configurations</h3>
          {savedConfigs.length === 0 ? (
            <p className="text-gray-500">No saved configurations yet.</p>
          ) : (
            <div className="space-y-2">
              {savedConfigs.map((config) => (
                <div key={config.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <span className="font-medium">{config.provider}</span>
                    <span className="text-gray-500 ml-2">({config.slotDuration} min slots)</span>
                    <span className="text-xs text-gray-400 ml-2">Saved: {config.savedAt}</span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleLoadConfig(config)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteConfig(config.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="slotDuration" className="block text-sm font-medium text-gray-700">
            Slot Duration (minutes)
          </label>
          <select
            id="slotDuration"
            name="slotDuration"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
            Select Provider
          </label>
          <select
            id="provider"
            name="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">-- Select a Provider --</option>
            <option value="provider1">Provider A</option>
            <option value="provider2">Provider B</option>
          </select>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Provider Availability</h3>
          <div className="space-y-4">
            {availability.map((slot, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 border rounded-xl border-gray-200"
              >
                <select
                  value={slot.day}
                  onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)}
                  className="block w-full sm:w-1/3 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)}
                  className="block w-full sm:w-1/3 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500 hidden sm:block">to</span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)}
                  className="block w-full sm:w-1/3 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAvailability(index)}
                  className="w-full sm:w-auto py-2 px-3 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddAvailability}
            className="mt-4 w-full sm:w-auto py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Add Availability
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300
          bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
        >
          Save Configuration
        </button>
      </form>
    </div>
  )
}

export default AppointmentConfig
