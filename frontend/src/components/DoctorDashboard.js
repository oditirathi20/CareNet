import React, { useState } from 'react';
import './DoctorDashboard.css';
import PatientSelector from './PatientSelector';

function DoctorDashboard({ doctorInfo }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state for treatment plan
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatmentDetails: '',
    prescribedMedication: '',
    estimatedCost: ''
  });

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    // Initialize form with patient's condition
    setFormData({
      diagnosis: patient.condition,
      treatmentDetails: '',
      prescribedMedication: '',
      estimatedCost: ''
    });
    // Load any existing treatment plan for this patient
    const savedPlan = localStorage.getItem(`treatment_${patient.id}`);
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      setTreatmentPlan(plan);
      setFormData({
        diagnosis: plan.diagnosis,
        treatmentDetails: plan.treatmentDetails,
        prescribedMedication: plan.prescribedMedication,
        estimatedCost: plan.estimatedCost.toString()
      });
    } else {
      setTreatmentPlan(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTreatment = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const newPlan = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        diagnosis: formData.diagnosis,
        treatmentDetails: formData.treatmentDetails,
        prescribedMedication: formData.prescribedMedication,
        estimatedCost: parseFloat(formData.estimatedCost),
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(`treatment_${selectedPatient.id}`, JSON.stringify(newPlan));
      setTreatmentPlan(newPlan);
      
      alert('Treatment plan updated successfully!');
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      alert('Failed to update treatment plan.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="dashboard-container">
      {!selectedPatient ? (
        <PatientSelector 
          onSelectPatient={handleSelectPatient} 
          doctorSpecialization={doctorInfo?.specialization}
        />
      ) : (
        <>
          <div className="dashboard-header" style={{marginBottom: '2rem'}}>
            <button 
              onClick={() => setSelectedPatient(null)} 
              className="back-to-patients-btn"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                marginBottom: '1rem',
                fontWeight: '500'
              }}
            >
              ← Back to Patient List
            </button>
            <h2>Manage Treatment Plan - {selectedPatient.name}</h2>
          </div>

          {/* Patient Data Section */}
          <div className="data-section">
            <h3>Patient Medical Information</h3>
            
            <div className="data-card">
              <div className="data-row">
                <span className="data-label">Name:</span>
                <span className="data-value">{selectedPatient.name}</span>
              </div>
              
              <div className="data-row">
                <span className="data-label">Patient ID:</span>
                <span className="data-value">{selectedPatient.id}</span>
              </div>
              
              <div className="data-row">
                <span className="data-label">Age:</span>
                <span className="data-value">{selectedPatient.age} years</span>
              </div>
              
              <div className="data-row">
                <span className="data-label">Gender:</span>
                <span className="data-value">{selectedPatient.gender}</span>
              </div>
              
              <div className="data-row">
                <span className="data-label">Condition:</span>
                <span className="data-value">{selectedPatient.condition}</span>
              </div>

              <div className="data-row">
                <span className="data-label">Severity:</span>
                <span className="data-value">{selectedPatient.severity}</span>
              </div>

              <div className="data-row">
                <span className="data-label">Symptoms:</span>
                <span className="data-value">{selectedPatient.symptoms}</span>
              </div>

              <div className="data-row">
                <span className="data-label">Medical History:</span>
                <span className="data-value">{selectedPatient.medicalHistory}</span>
              </div>

              <div className="data-row">
                <span className="data-label">Current Medications:</span>
                <span className="data-value">{selectedPatient.currentMedications}</span>
              </div>

              <div className="data-row">
                <span className="data-label">Last Visit:</span>
                <span className="data-value">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Current Treatment Plan */}
          {treatmentPlan && (
            <div className="data-section">
              <h3>Current Treatment Plan</h3>
              <div className="data-card">
                <div className="data-row">
                  <span className="data-label">Diagnosis:</span>
                  <span className="data-value">{treatmentPlan.diagnosis}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Treatment Details:</span>
                  <span className="data-value">{treatmentPlan.treatmentDetails}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Prescribed Medication:</span>
                  <span className="data-value">{treatmentPlan.prescribedMedication}</span>
                </div>
                <div className="data-field">
                  <span className="data-label">💰 Estimated Cost:</span>
                  <span className="data-value">₹{treatmentPlan.estimatedCost}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Last Updated:</span>
                  <span className="data-value">{new Date(treatmentPlan.lastUpdated).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Update Treatment Plan Form */}
          <div className="data-section">
            <h3>{treatmentPlan ? 'Update Treatment Plan' : 'Create Treatment Plan'}</h3>
            
            <form onSubmit={handleSubmitTreatment} className="treatment-form">
              <div className="form-group">
                <label>Diagnosis:</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Patient diagnosis"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Treatment Details:</label>
                <textarea
                  name="treatmentDetails"
                  value={formData.treatmentDetails}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Detailed treatment plan, procedures, therapies, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Prescribed Medication:</label>
                <textarea
                  name="prescribedMedication"
                  value={formData.prescribedMedication}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List of medications with dosage and frequency"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Estimated Cost (₹):</label>
                <input
                  type="number"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Total estimated cost in INR"
                  required
                />
              </div>
              
              <button type="submit" disabled={isUpdating} className="btn-primary">
                {isUpdating ? 'Updating...' : treatmentPlan ? 'Update Treatment Plan' : 'Create Treatment Plan'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default DoctorDashboard;
