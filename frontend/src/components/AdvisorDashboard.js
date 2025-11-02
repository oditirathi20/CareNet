import React, { useState } from 'react';
import './AdvisorDashboard.css';
import PatientSelector from './PatientSelector';

const API_URL = 'http://localhost:5000';

function AdvisorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setAiAnalysis(null);
    // Load treatment plan for this patient
    const savedPlan = localStorage.getItem(`treatment_${patient.id}`);
    if (savedPlan) {
      setTreatmentPlan(JSON.parse(savedPlan));
    } else {
      setTreatmentPlan(null);
    }
  };

  const handleAnalyzeTreatment = async () => {
    if (!selectedPatient || !treatmentPlan) {
      alert('This patient does not have a treatment plan yet. Please ask the doctor to create one first.');
      return;
    }

    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const analysisData = {
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        medicalHistory: selectedPatient.medicalHistory,
        currentTestReports: selectedPatient.symptoms,
        treatmentPlan: JSON.stringify(treatmentPlan, null, 2)
      };

      const response = await fetch(`${API_URL}/api/analyze-treatment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Clean up any preamble from the AI response
      if (data.analysis) {
        // Remove common preambles like "Okay, here's...", "Based on...", etc.
        data.analysis = data.analysis
          .replace(/^(Okay,?\s*)?here'?s?\s+(a|an|the)\s+fraud\s+detection\s+analysis[^:]*:\s*/i, '')
          .replace(/^Based\s+on\s+the\s+(provided|available|retrieved)\s+medical\s+guidelines[^:]*:\s*/i, '')
          .trim();
      }
      
      setAiAnalysis(data); // Store entire response including sources
      
    } catch (error) {
      console.error('Error analyzing treatment:', error);
      alert('Failed to analyze treatment. Make sure the AI server is running on port 5000.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="dashboard-container">
      {!selectedPatient ? (
        <PatientSelector onSelectPatient={handleSelectPatient} />
      ) : (
        <>
          <div className="dashboard-header" style={{marginBottom: '2rem'}}>
            <button 
              onClick={() => {
                setSelectedPatient(null);
                setTreatmentPlan(null);
                setAiAnalysis(null);
              }} 
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
            <h2>Analyze Treatment Plan - {selectedPatient.name}</h2>
          </div>

          {/* Patient Data */}
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
                <span className="data-value">{selectedPatient.age}</span>
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
            </div>
          </div>

          {/* Treatment Plan */}
          {treatmentPlan ? (
            <div className="data-section">
              <h3>Treatment Plan</h3>
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
              <h3>Treatment Plan</h3>
              <div className="info-box">
                <p>No treatment plan has been created for this patient yet.</p>
                <p className="info-text">The doctor needs to create a treatment plan first.</p>
              </div>
            </div>
          )}

          {/* AI Analysis Tool */}
          <div className="data-section ai-section">
            <h3>🤖 AI Treatment Validation</h3>
            
            <button 
              onClick={handleAnalyzeTreatment}
              disabled={isAnalyzing || !treatmentPlan}
              className="btn-primary analyze-btn"
            >
              {isAnalyzing ? '🔄 Analyzing Treatment Plan...' : '🔍 Analyze Treatment Plan with AI'}
            </button>

            {!treatmentPlan && (
              <p className="info-text">Treatment plan must exist before analysis.</p>
            )}

            {aiAnalysis && (
              <div className="ai-analysis-result">
                <h4>AI Treatment Validation Analysis</h4>
                
                <div className="analysis-content">
                  {(aiAnalysis.analysis || aiAnalysis).split('\n').map((line, index) => {
                    const trimmed = line.trim();
                    
                    // Skip empty lines
                    if (!trimmed) {
                      return <div key={index} className="spacer"></div>;
                    }
                    
                    // Section headers (e.g., "SECTION 1: VALIDITY ASSESSMENT")
                    if (trimmed.startsWith('SECTION ')) {
                      return <h5 key={index} className="section-header">{trimmed}</h5>;
                    }
                    
                    // Subsection headers (e.g., "Key Findings:", "Detailed Analysis:")
                    if (trimmed.endsWith(':') && !trimmed.startsWith('•') && trimmed.length < 50) {
                      return <h6 key={index} className="subsection-header">{trimmed}</h6>;
                    }
                    
                    // Horizontal rules
                    if (trimmed === '---') {
                      return <hr key={index} className="section-divider" />;
                    }
                    
                    // Bullet points (starting with •)
                    if (trimmed.startsWith('•')) {
                      return <li key={index} className="report-bullet">{trimmed.substring(1).trim()}</li>;
                    }
                    
                    // Treatment Status or Decision lines
                    if (trimmed.startsWith('Treatment Status:') || trimmed.startsWith('Decision Recommendation:') || trimmed.startsWith('Confidence Level:')) {
                      return <p key={index} className="status-line"><strong>{trimmed}</strong></p>;
                    }
                    
                    // Regular paragraphs
                    return <p key={index} className="report-paragraph">{trimmed}</p>;
                  })}
                </div>

                {/* Show trusted sources used - moved to bottom */}
                {aiAnalysis.sources && aiAnalysis.sources.length > 0 && (
                  <div className="sources-used">
                    <p className="sources-title">Medical Guidelines Referenced:</p>
                    <div className="source-badges">
                      {aiAnalysis.sources.map((source, idx) => (
                        <div key={idx} className="source-badge">
                          <span className="badge-icon">📄</span>
                          <div className="badge-info">
                            <div className="badge-name">{source.document || source.name}</div>
                            <div className="badge-details">{source.category || source.filename}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Show metadata */}
                {aiAnalysis.metadata && (
                  <div className="analysis-metadata">
                    <small>
                      ✅ Analysis completed: {new Date(aiAnalysis.metadata.timestamp).toLocaleString()}
                      {aiAnalysis.metadata.ragEnabled && (
                        <> | 🔍 RAG-Enhanced: {aiAnalysis.metadata.documentsUsed}/{aiAnalysis.metadata.documentsSearched} documents used</>
                      )}
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdvisorDashboard;
