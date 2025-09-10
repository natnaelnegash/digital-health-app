import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// A mock token that represents a provider.
const MOCK_PROVIDER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDEiLCJyb2xlIjoiUFJPVklERVIiLCJpYXQiOjE3NTc0ODYwMzIsImV4cCI6MTc4OTA0MzYzMn0.xHXkGRMBWVcY0XOHw3J1JEYnEKnvy6WcxBHx58jADR8';

const Login = ({ setToken, setUserRole }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // This useEffect hook runs once when the component mounts
  // to clear the email and password fields.
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      const { token } = response.data;
      const { role: userRole } = response.data.user;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      setToken(token);
      setUserRole(userRole);
      
      if (userRole.toUpperCase() === 'PROVIDER') {
        navigate('/provider');
      } else if (userRole.toUpperCase() === 'PATIENT') {
        navigate('/patient');
      } else {
        setError('Login successful, but an unknown role was returned.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = () => {
    localStorage.setItem('token', MOCK_PROVIDER_TOKEN);
    localStorage.setItem('userRole', 'PROVIDER');
    setToken(MOCK_PROVIDER_TOKEN);
    setUserRole('PROVIDER');
    navigate('/provider');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Log In</h2>
        <p className="text-gray-400 mb-8">
          Enter your email and password to access your dashboard.
        </p>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full py-3 px-4 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full py-3 px-4 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-full font-bold text-lg transition-all duration-300 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-700 pt-6">
          <p className="text-gray-400 mb-4">
            If you are a provider, you can use the mock login button.
          </p>
          <button
            onClick={handleProviderLogin}
            className="w-full py-3 rounded-full bg-teal-500 hover:bg-teal-600 transition-colors duration-300 font-bold text-lg text-white shadow-lg"
          >
            Mock Log in as Provider
          </button>
        </div>
      </div>
    </div>
  );
};





//patient dashboard component

const PatientDashboard = ({ token }) => {
  const API_BASE_URL = 'http://localhost:3000/api/patients';
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const [recordsResponse, appointmentsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/records`),
          axios.get(`${API_BASE_URL}/appointments`),
        ]);
        setRecords(recordsResponse.data);
        setAppointments(appointmentsResponse.data);
      } catch (err) {
        console.error('Failed to fetch patient data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPatientData();
    }
  }, [token]);

  const handleExportPdf = async () => {
    
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = height - 50;
    const margin = 50;

    // Title
    const title = 'Patient Health Records';
    page.drawText(title, {
      x: margin,
      y: y,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0.5, 0),
    });
    y -= 30;

    // Health Records Section
    page.drawText('Your Health Records', {
      x: margin,
      y: y,
      size: 18,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 25;

    if (records.length > 0) {
      records.forEach(record => {
        const recordText = `${record.type.toUpperCase()}: ${record.details} (Date: ${new Date(record.date).toLocaleDateString()})`;
        if (y < 50) { // Check for page break
          page = pdfDoc.addPage([595, 842]);
          y = height - 50;
        }
        page.drawText(recordText, {
          x: margin,
          y: y,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
        y -= 20;
      });
    } else {
      page.drawText('No health records found.', {
        x: margin,
        y: y,
        size: 12,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= 20;
    }

    y -= 30; // Spacer

    // Appointments Section
    page.drawText('Your Appointments', {
      x: margin,
      y: y,
      size: 18,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 25;

    if (appointments.length > 0) {
      appointments.forEach(appt => {
        const apptText = `Appointment with Dr. ${appt.provider.lastname} on ${new Date(appt.startTime).toLocaleDateString()} from ${new Date(appt.startTime).toLocaleTimeString()} to ${new Date(appt.endTime).toLocaleTimeString()}`;
        if (y < 50) { // Check for page break
          page = pdfDoc.addPage([595, 842]);
          y = height - 50;
        }
        page.drawText(apptText, {
          x: margin,
          y: y,
          size: 12,
          font: helvetica,
          color: rgb(0, 0, 0),
        });
        y -= 20;
      });
    } else {
      page.drawText('No upcoming appointments found.', {
        x: margin,
        y: y,
        size: 12,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= 20;
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "patient-records.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-12">{error}</div>;
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-400 text-center">Patient Dashboard</h2>
        <button
          onClick={handleExportPdf}
          className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300 font-semibold shadow-md"
        >
          Export to PDF
        </button>
      </div>
      <p className="text-gray-400 mb-8 text-center">
        Welcome! This is your personal health and wellness portal.
      </p>
      <div className="space-y-12">
        <div>
          <h3 className="text-xl font-bold text-gray-300 border-b border-gray-700 pb-2 mb-4">Your Health Records</h3>
          {records.length > 0 ? (
            <ul className="space-y-4">
              {records.map(record => (
                <li key={record.id} className="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300">
                  <span className="font-semibold text-blue-400 capitalize">{record.type}: </span>
                  <p className="text-gray-300 mt-1">{record.details}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Date: {new Date(record.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No health records found.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-300 border-b border-gray-700 pb-2 mb-4">Your Appointments</h3>
          {appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map(appt => (
                <li key={appt.id} className="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300">
                  <span className="font-semibold text-blue-400">Appointment with Dr. {appt.provider.lastname}</span>
                  <p className="text-gray-300 mt-1">
                    Date: {new Date(appt.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Time: {new Date(appt.startTime).toLocaleTimeString()} - {new Date(appt.endTime).toLocaleTimeString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No upcoming appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};



//provider dashboard component

const ProviderDashboard = ({ token }) => {
  const API_BASE_URL = 'http://localhost:3000/api/provider';
  
  const [patientEmail, setPatientEmail] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [view, setView] = useState('emailForm'); // 'emailForm' or 'recordsList'

  const [recordId, setRecordId] = useState('');
  const [recordType, setRecordType] = useState('history');
  const [recordDetails, setRecordDetails] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const fetchRecordsByEmail = async (email) => {
    setLoading(true);
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_BASE_URL}/records/${email}`);

      setPatientId(response.data.patientId);
      setPatientRecords(response.data.records);
      setView('recordsList');
      showMessage('Patient records found.', 'success');
      
    } catch (error) {
      console.error('Failed to find patient:', error.response?.data?.error || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to find patient. Check the email or server status.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!recordId) {
      showMessage('Please select a record to update.', 'error');
      setLoading(false);
      return;
    }
    if (!recordDetails) {
      showMessage('Please enter new details for the record.', 'error');
      setLoading(false);
      return;
    }

    const updateUrl = `${API_BASE_URL}/update-record/${patientId}`;
    
    const formattedDate = recordDate ? new Date(recordDate).toISOString() : new Date().toISOString();
    
    console.log('Sending PUT request to:', updateUrl);
    console.log('Formatted date for payload:', formattedDate);

    try {
      const payload = {
        type: recordType,
        id: recordId,
        data: {
          details: recordDetails,
          date: formattedDate,
        },
      };

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.put(updateUrl, payload);
      
      console.log('Update successful:', response.data);
      showMessage('Record updated successfully!', 'success');
      
    } catch (error) {
      console.error('Failed to update record:', error.response?.data?.error || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to update record. Check your server status and the record ID.';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a record from the list

  const handleSelectRecord = (record) => {
    setRecordId(record.id);
    setRecordType(record.type);
    setRecordDetails(record.details);
    setRecordDate(record.date);
    showMessage(`Record ID ${record.id} selected for editing.`, 'info');
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mt-12">
      <h2 className="text-3xl font-semibold text-teal-400 mb-6 text-center">Provider Dashboard</h2>
      
      <p className="text-gray-400 mb-8 text-center">
        This dashboard allows you to view and manage patient records.
      </p>

      {message.text && (
        <div
          className={`mt-6 p-4 rounded-lg font-semibold text-center transition-all duration-300 ${
            message.type === 'success' ? 'bg-green-500 text-white' : message.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      {view === 'emailForm' ? (
        <form onSubmit={(e) => { e.preventDefault(); fetchRecordsByEmail(patientEmail); }} className="flex flex-col gap-6">
          <h3 className="text-xl text-gray-300 font-medium border-b border-gray-700 pb-2">
            1. Enter Patient Email
          </h3>
          <div>
            <label className="block text-gray-400 mb-2">Patient Email</label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="e.g., patient@example.com"
              className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-full font-bold text-lg transition-all duration-300 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
          >
            {loading ? 'Finding Records...' : 'Find Records'}
          </button>
        </form>
      ) : (
        <>
          <p className="text-gray-400 text-center mb-6">Viewing records for Patient ID: <span className="font-semibold text-teal-400">{patientId}</span></p>
          <div className="space-y-6 mb-8">
            <h3 className="text-xl text-gray-300 font-medium border-b border-gray-700 pb-2">
              2. Select a record to update
            </h3>
            <ul className="space-y-4">
              {patientRecords.length > 0 ? (
                patientRecords.map(record => (
                  <li key={record.id} className="flex flex-col md:flex-row md:items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300">
                    <div>
                      <span className="font-semibold text-teal-400 capitalize">{record.type}: </span>
                      <span className="text-gray-300 italic">ID: {record.id}</span>
                      <p className="text-sm text-gray-400 mt-1">{record.details}</p>
                    </div>
                    <button
                      onClick={() => handleSelectRecord(record)}
                      className="mt-3 md:mt-0 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-colors duration-300"
                    >
                      Select
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 italic text-center">No records found. Check your backend API.</p>
              )}
            </ul>
          </div>
          
          <form onSubmit={handleUpdateRecord} className="flex flex-col gap-6">
            <h3 className="text-xl text-gray-300 font-medium border-b border-gray-700 pb-2">
              3. Update the record details
            </h3>
            <div>
              <label className="block text-gray-400 mb-2">Selected Record ID</label>
              <input
                type="text"
                value={recordId}
                readOnly
                placeholder="Select a record from the list above"
                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border-none focus:outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Record Type</label>
              <input
                type="text"
                value={recordType.charAt(0).toUpperCase() + recordType.slice(1)}
                readOnly
                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border-none focus:outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">New Record Details</label>
              <textarea
                rows="4"
                value={recordDetails}
                onChange={(e) => setRecordDetails(e.target.value)}
                placeholder="Enter new details for the record..."
                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Record Date</label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !recordId}
              className={`w-full py-3 mt-4 rounded-full font-bold text-lg transition-all duration-300 ${loading || !recordId ? 'bg-gray-500 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
            >
              {loading ? 'Updating...' : 'Update Record'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

// Main App component

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const navigate = useNavigate(); // Add this line

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken('');
    setUserRole('');
  };

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true }); // Change this line
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 text-white shadow-lg">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-400 tracking-wide">Digital Health System</h1>
          {token && (
            <div className="space-x-6 flex items-center">
              {userRole === 'PROVIDER' && (
                <Link to="/provider" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Provider Dashboard</Link>
              )}
              {userRole === 'PATIENT' && (
                <Link to="/patient" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Patient Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8 md:py-12">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} setUserRole={setUserRole} />} />
          <Route path="/provider" element={
            token && userRole === 'PROVIDER' ? 
              <ProviderDashboard token={token} /> : 
              <Login setToken={setToken} setUserRole={setUserRole} />
          } />
          <Route path="/patient" element={
            token && userRole === 'PATIENT' ?
              <PatientDashboard token={token} /> :
              <Login setToken={setToken} setUserRole={setUserRole} />
          } />
          <Route path="/" element={<h2 className="text-3xl md:text-4xl text-center mt-12 mb-8 font-extrabold text-white">Welcome! Please log in to continue.</h2>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;