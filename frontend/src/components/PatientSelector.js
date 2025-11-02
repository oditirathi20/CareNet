import React, { useState, useEffect } from 'react';
import './PatientSelector.css';
import { getAllPatients, searchPatients as searchStaticPatients } from '../data/patientRegistry';

// Map conditions to doctor specializations
const conditionToSpecialization = {
  'Type 2 Diabetes': 'General Medicine',
  'Chronic Acne': 'Dermatology',
  'Coronary Artery Disease': 'Cardiology',
  'Childhood Asthma': 'Pediatrics',
  'Osteoarthritis': 'Orthopedics',
  'Asthma': 'General Medicine',
  'Chronic Lower Back Pain': 'Orthopedics',
  'Hypothyroidism': 'General Medicine'
};

function PatientSelector({ onSelectPatient, doctorSpecialization }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadAllPatients();
  }, [doctorSpecialization]);

  const filterPatientsBySpecialization = (patientList) => {
    if (!doctorSpecialization) return patientList;
    
    return patientList.filter(patient => {
      const matchingSpec = conditionToSpecialization[patient.condition];
      return matchingSpec === doctorSpecialization;
    });
  };

  const loadAllPatients = () => {
    // Load both static demo patients and user-registered patients
    const staticPatients = getAllPatients();
    
    // Load user-registered patients from localStorage
    const patientList = JSON.parse(localStorage.getItem('patientList') || '[]');
    const userPatients = patientList.map(id => {
      const data = localStorage.getItem(`patient_${id}`);
      return data ? JSON.parse(data) : null;
    }).filter(p => p !== null);

    // Combine both lists
    const allPatients = [...staticPatients, ...userPatients];
    
    // Filter by doctor's specialization
    const filteredPatients = filterPatientsBySpecialization(allPatients);
    setPatients(filteredPatients);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      loadAllPatients();
    } else {
      const staticResults = searchStaticPatients(term);
      
      // Search user-registered patients
      const patientList = JSON.parse(localStorage.getItem('patientList') || '[]');
      const userResults = patientList.map(id => {
        const data = localStorage.getItem(`patient_${id}`);
        return data ? JSON.parse(data) : null;
      }).filter(p => {
        if (!p) return false;
        const lowerTerm = term.toLowerCase();
        return p.name.toLowerCase().includes(lowerTerm) ||
               p.id.toLowerCase().includes(lowerTerm) ||
               p.condition.toLowerCase().includes(lowerTerm);
      });

      const allResults = [...staticResults, ...userResults];
      // Filter by doctor's specialization
      const filteredResults = filterPatientsBySpecialization(allResults);
      setPatients(filteredResults);
    }
  };

  const getSeverityClass = (severity) => {
    if (severity.includes('Severe')) return 'severity-high';
    if (severity.includes('Moderate')) return 'severity-medium';
    return 'severity-low';
  };

  return (
    <div className="patient-selector">
      <div className="selector-header">
        <h2>Select a Patient</h2>
        <p>Choose a patient from the registry to view or manage their treatment</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name, ID, or condition..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="patients-grid">
        {patients.length === 0 ? (
          <div className="no-results">
            <p>No patients found matching "{searchTerm}"</p>
          </div>
        ) : (
          patients.map((patient) => (
            <div 
              key={patient.id} 
              className="patient-card"
              onClick={() => onSelectPatient(patient)}
            >
              <div className="patient-header">
                <div className="patient-avatar">
                  {patient.gender === 'Male' ? '👨' : '👩'}
                </div>
                <div className="patient-basic-info">
                  <h3>{patient.name}</h3>
                  <span className="patient-id">{patient.id}</span>
                </div>
                <span className={`severity-badge ${getSeverityClass(patient.severity)}`}>
                  {patient.severity}
                </span>
              </div>

              <div className="patient-details">
                <div className="detail-row">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{patient.age} years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Condition:</span>
                  <span className="detail-value">{patient.condition}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Visit:</span>
                  <span className="detail-value">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="patient-symptoms">
                <strong>Symptoms:</strong>
                <p>{patient.symptoms.length > 100 ? patient.symptoms.substring(0, 100) + '...' : patient.symptoms}</p>
              </div>

              <button className="select-btn">
                Select Patient →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PatientSelector;
