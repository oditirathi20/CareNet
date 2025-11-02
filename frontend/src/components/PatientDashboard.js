import React, { useState } from 'react';
import './PatientDashboard.css';

function PatientDashboard({ patientInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    symptoms: patientInfo.symptoms || '',
    medicalHistory: patientInfo.medicalHistory || '',
    currentMedications: patientInfo.currentMedications || ''
  });

  // Load treatment plan
  React.useEffect(() => {
    const savedPlan = localStorage.getItem(`treatment_${patientInfo.id}`);
    if (savedPlan) {
      setTreatmentPlan(JSON.parse(savedPlan));
    }
  }, [patientInfo.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedPatient = {
        ...patientInfo,
        symptoms: formData.symptoms,
        medicalHistory: formData.medicalHistory,
        currentMedications: formData.currentMedications,
        lastVisit: new Date().toISOString().split('T')[0]
      };

      localStorage.setItem(`patient_${patientInfo.id}`, JSON.stringify(updatedPatient));
      alert('Information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating information:', error);
      alert('Failed to update information');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>My Medical Dashboard</h2>

      {/* Patient Information Section */}
      <div className="data-section">
        <div className="section-header">
          <h3>My Information</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              ✏️ Edit
            </button>
          )}
        </div>
        
        <div className="data-card">
          <div className="data-row">
            <span className="data-label">Name:</span>
            <span className="data-value">{patientInfo.name}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Patient ID:</span>
            <span className="data-value id-highlight">{patientInfo.id}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Age:</span>
            <span className="data-value">{patientInfo.age} years</span>
          </div>
          <div className="data-row">
            <span className="data-label">Gender:</span>
            <span className="data-value">{patientInfo.gender}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Current Condition:</span>
            <span className="data-value">{patientInfo.condition}</span>
          </div>
        </div>
      </div>

      {/* Editable Information */}
      {isEditing ? (
        <div className="data-section">
          <h3>Update Your Information</h3>
          <form onSubmit={handleUpdateInfo} className="patient-form">
            <div className="form-group">
              <label>Current Symptoms:</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Medical History:</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Current Medications:</label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                rows="2"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSaving} className="btn-primary">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    symptoms: patientInfo.symptoms || '',
                    medicalHistory: patientInfo.medicalHistory || '',
                    currentMedications: patientInfo.currentMedications || ''
                  });
                }} 
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="data-section">
          <h3>Medical Details</h3>
          <div className="data-card">
            <div className="data-row">
              <span className="data-label">Symptoms:</span>
              <span className="data-value">{patientInfo.symptoms || 'Not provided'}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Medical History:</span>
              <span className="data-value">{patientInfo.medicalHistory || 'Not provided'}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Current Medications:</span>
              <span className="data-value">{patientInfo.currentMedications || 'None'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Treatment Plan Section */}
      {treatmentPlan ? (
        <div className="data-section">
          <h3>My Treatment Plan</h3>
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
              <span className="data-value highlight-cost">₹{treatmentPlan.estimatedCost}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Last Updated:</span>
              <span className="data-value">{new Date(treatmentPlan.lastUpdated).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="data-section">
          <div className="info-box">
            <p>💊 No treatment plan has been created for you yet.</p>
            <p className="info-text">Your doctor will create a treatment plan after reviewing your case.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
