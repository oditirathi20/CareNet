import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdvisorDashboard from './components/AdvisorDashboard';
import DoctorAuth from './components/DoctorAuth';
import AdvisorAuth from './components/AdvisorAuth';
import PatientAuth from './components/PatientAuth';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [showDoctorAuth, setShowDoctorAuth] = useState(false);
  const [showAdvisorAuth, setShowAdvisorAuth] = useState(false);
  const [showPatientAuth, setShowPatientAuth] = useState(false);

  // Role options
  const ROLES = {
    1: 'Patient',
    2: 'Doctor',
    3: 'LoopAdvisor'
  };

  // Simple login without blockchain
  const handleLogin = (role) => {
    if (role === 1) {
      // Show patient authentication page
      setShowPatientAuth(true);
    } else if (role === 2) {
      // Show doctor authentication page
      setShowDoctorAuth(true);
    } else if (role === 3) {
      // Show advisor authentication page
      setShowAdvisorAuth(true);
    }
  };

  // Handle patient authentication success
  const handlePatientAuthenticated = (patient) => {
    setPatientInfo(patient);
    setUserRole(1);
    setShowPatientAuth(false);
  };

  // Handle doctor authentication success
  const handleDoctorAuthenticated = (doctor) => {
    setDoctorInfo(doctor);
    setUserRole(2);
    setShowDoctorAuth(false);
  };

  // Handle advisor authentication success
  const handleAdvisorAuthenticated = (advisor) => {
    setAdvisorInfo(advisor);
    setUserRole(3);
    setShowAdvisorAuth(false);
  };

  // Handle back button from auth pages
  const handleBackToLogin = () => {
    setShowDoctorAuth(false);
    setShowAdvisorAuth(false);
    setShowPatientAuth(false);
  };

  // Render role-specific dashboard
  const renderDashboard = () => {
    // Show patient authentication page
    if (showPatientAuth) {
      return <PatientAuth onAuthenticated={handlePatientAuthenticated} onBack={handleBackToLogin} />;
    }

    // Show doctor authentication page
    if (showDoctorAuth) {
      return <DoctorAuth onAuthenticated={handleDoctorAuthenticated} onBack={handleBackToLogin} />;
    }

    // Show advisor authentication page
    if (showAdvisorAuth) {
      return <AdvisorAuth onAuthenticated={handleAdvisorAuthenticated} onBack={handleBackToLogin} />;
    }

    if (!userRole) {
      return (
        <div className="connect-wallet">
          <div className="app-brand">CareNet</div>
          <h1>Healthcare Platform</h1>
          <p>Bringing Awareness, Transparency and Trust</p>
          <div className="role-selection">
            <h2>Select Your Role</h2>
            <div className="role-buttons">
              <div className="button-group" id="btn-group-1">
                <button onClick={() => handleLogin(1)}>
                  <span className="button-icon">👤</span>
                  <span className="button-text">
                    <span className="button-title">Login as Patient</span>
                    <span className="button-subtitle">Your health, your data. Get clear, trusted guidance.</span>
                  </span>
                </button>
              </div>
              <div className="button-group" id="btn-group-2">
                <button onClick={() => handleLogin(2)}>
                  <span className="button-icon">⚕️</span>
                  <span className="button-text">
                    <span className="button-title">Login as Doctor</span>
                    <span className="button-subtitle">Access verified patient histories. Focus on care.</span>
                  </span>
                </button>
              </div>
              <div className="button-group" id="btn-group-3">
                <button onClick={() => handleLogin(3)}>
                  <span className="button-icon">🛡️</span>
                  <span className="button-text">
                    <span className="button-title">Login as Loop Advisor</span>
                    <span className="button-subtitle">Your AI-powered dashboard for patient advocacy.</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>Healthcare Platform - {ROLES[userRole]}</h1>
            <div className="account-info">
              {patientInfo && (
                <span className="doctor-name">
                  {patientInfo.name} (ID: {patientInfo.id})
                </span>
              )}
              {doctorInfo && (
                <span className="doctor-name">
                  {doctorInfo.name} ({doctorInfo.specialization})
                </span>
              )}
              {advisorInfo && (
                <span className="doctor-name">
                  {advisorInfo.name} ({advisorInfo.department})
                </span>
              )}
              <button 
                onClick={() => {
                  setUserRole(null);
                  setPatientInfo(null);
                  setDoctorInfo(null);
                  setAdvisorInfo(null);
                  setShowDoctorAuth(false);
                  setShowAdvisorAuth(false);
                  setShowPatientAuth(false);
                }} 
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </header>

          <Routes>
            <Route 
              path="/patient" 
              element={
                userRole === 1 ? 
                  <PatientDashboard patientInfo={patientInfo} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/doctor" 
              element={
                userRole === 2 ? 
                  <DoctorDashboard doctorInfo={doctorInfo} /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/advisor" 
              element={
                userRole === 3 ? 
                  <AdvisorDashboard /> : 
                  <Navigate to="/" />
              } 
            />
            <Route 
              path="/" 
              element={
                <Navigate to={
                  userRole === 1 ? '/patient' :
                  userRole === 2 ? '/doctor' :
                  userRole === 3 ? '/advisor' :
                  '/'
                } />
              } 
            />
          </Routes>
        </div>
      </Router>
    );
  };

  return (
    <div className="App">
      {renderDashboard()}
    </div>
  );
}

export default App;
