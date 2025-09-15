import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

export default function App() {
  return (
    <Routes>
      {/* Default route → Login page */}
      <Route path="/" element={<Login />} />

      {/* Dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Fallback if user visits an unknown route */}
      <Route path="*" element={<div className="p-10 text-center text-red-600 text-xl">404 - Page Not Found</div>} />
    </Routes>
  )
}
