import React, { useState, useEffect } from 'react';
import './PatientAuth.css';
import { getAllPatients } from '../data/patientRegistry';
import { initializeDemoTreatments } from '../data/demoTreatments';

function PatientAuth({ onAuthenticated, onBack }) {
  const [patientId, setPatientId] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Form for new patient registration
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    condition: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Initialize localStorage with demo patients on component mount
  useEffect(() => {
    const initializeDemoPatients = () => {
      const demoPatients = getAllPatients();
      const patientList = JSON.parse(localStorage.getItem('patientList') || '[]');
      
      demoPatients.forEach(patient => {
        // Only add if not already in localStorage
        if (!localStorage.getItem(`patient_${patient.id}`)) {
          localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
          if (!patientList.includes(patient.id)) {
            patientList.push(patient.id);
          }
        }
      });
      
      localStorage.setItem('patientList', JSON.stringify(patientList));
    };

    initializeDemoPatients();
    // Initialize demo treatments for PAT009, PAT010, PAT011
    initializeDemoTreatments();
  }, []);

  const handleExistingPatientLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      // Check if patient exists in localStorage
      const patientData = localStorage.getItem(`patient_${patientId}`);
      if (patientData) {
        const patient = JSON.parse(patientData);
        onAuthenticated(patient);
      } else {
        setError('Patient ID not found. Please check your ID or register as a new patient.');
      }
      setIsVerifying(false);
    }, 500);
  };

  const handleNewPatientRegistration = (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      // Generate unique patient ID in format PAT009, PAT010, etc.
      const patientList = JSON.parse(localStorage.getItem('patientList') || '[]');
      
      // Find the highest numeric ID
      let maxNum = 8; // Start from 8 since we have PAT001-PAT008
      patientList.forEach(id => {
        if (id.startsWith('PAT')) {
          const num = parseInt(id.replace('PAT', ''));
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      
      const newPatientId = 'PAT' + String(maxNum + 1).padStart(3, '0');
      
      const patientRecord = {
        id: newPatientId,
        name: newPatientData.name,
        age: parseInt(newPatientData.age),
        gender: newPatientData.gender,
        condition: newPatientData.condition,
        symptoms: newPatientData.symptoms,
        medicalHistory: newPatientData.medicalHistory,
        currentMedications: newPatientData.currentMedications,
        lastVisit: new Date().toISOString().split('T')[0],
        severity: 'Moderate', // Default
        registeredDate: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem(`patient_${newPatientId}`, JSON.stringify(patientRecord));
      
      // Add to patient list
      patientList.push(newPatientId);
      localStorage.setItem('patientList', JSON.stringify(patientList));

      alert(`Registration successful! Your Patient ID is: ${newPatientId}\nPlease save this ID for future logins.`);
      onAuthenticated(patientRecord);
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileNames = files.map(f => ({
        name: f.name,
        size: (f.size / 1024).toFixed(2) + ' KB',
        type: f.type
      }));
      setUploadedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="patient-auth-container">
      <div className="patient-auth-card">
        <div className="auth-header">
          <div className="auth-icon">🏥</div>
          <h2>Patient Login</h2>
          <p>Access your medical records</p>
        </div>

        <div className="auth-toggle">
          <button 
            className={!isNewPatient ? 'active' : ''} 
            onClick={() => setIsNewPatient(false)}
          >
            Existing Patient
          </button>
          <button 
            className={isNewPatient ? 'active' : ''} 
            onClick={() => setIsNewPatient(true)}
          >
            New Patient
          </button>
        </div>

        {!isNewPatient ? (
          // Existing Patient Login
          <form onSubmit={handleExistingPatientLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="patientId">Patient ID</label>
              <input
                type="text"
                id="patientId"
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="PAT123456"
                required
                autoFocus
              />
              <span className="help-text">Enter your 6-character Patient ID</span>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={isVerifying} className="btn-verify">
              {isVerifying ? 'Verifying...' : 'Login'}
            </button>
          </form>
        ) : (
          // New Patient Registration
          <form onSubmit={handleNewPatientRegistration} className="auth-form registration-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={newPatientData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={newPatientData.age}
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={newPatientData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Current Condition *</label>
              <input
                type="text"
                name="condition"
                value={newPatientData.condition}
                onChange={handleInputChange}
                placeholder="e.g., Type 2 Diabetes, Hypertension"
                required
              />
            </div>

            <div className="form-group">
              <label>Symptoms *</label>
              <textarea
                name="symptoms"
                value={newPatientData.symptoms}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe your current symptoms"
                required
              />
            </div>

            <div className="form-group">
              <label>Medical History & Documents</label>
              <textarea
                name="medicalHistory"
                value={newPatientData.medicalHistory}
                onChange={handleInputChange}
                rows="3"
                placeholder="Previous conditions, surgeries, family history"
              />
              
              <div className="file-upload-section">
                <input
                  type="file"
                  id="medical-files"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="medical-files" className="file-upload-btn">
                  📎 Attach Medical Documents
                </label>
                <span className="file-upload-info">or upload previous reports, prescriptions, test results</span>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="uploaded-files-list">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="uploaded-file-item">
                      <span className="file-icon">📄</span>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{file.size}</span>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={() => removeFile(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Current Medications</label>
              <textarea
                name="currentMedications"
                value={newPatientData.currentMedications}
                onChange={handleInputChange}
                rows="2"
                placeholder="List any medications you're currently taking"
              />
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={isVerifying} className="btn-verify">
              {isVerifying ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        <button onClick={onBack} className="back-button">
          ← Back
        </button>
      </div>
    </div>
  );
}

export default PatientAuth;
