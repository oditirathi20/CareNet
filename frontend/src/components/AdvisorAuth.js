import React, { useState } from 'react';
import './AdvisorAuth.css';
import { verifyAdvisorID } from '../data/advisorRegistry';

function AdvisorAuth({ onAuthenticated, onBack }) {
  const [advisorId, setAdvisorId] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Validate ID format (14 alphanumeric characters)
    const idPattern = /^[A-Z0-9]{14}$/i;
    if (!idPattern.test(advisorId)) {
      setError('Invalid ID format. Must be 14 alphanumeric characters.');
      setIsVerifying(false);
      return;
    }

    // Verify Advisor ID
    setTimeout(() => {
      const result = verifyAdvisorID(advisorId);
      if (result.valid) {
        onAuthenticated(result.advisor);
      } else {
        setError('Advisor ID not found. Please check your credentials.');
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleIdChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 14) {
      setAdvisorId(value);
      setError('');
    }
  };

  return (
    <div className="advisor-auth-container">
      <div className="advisor-auth-card">
        <div className="auth-header">
          <div className="auth-icon">🏥</div>
          <h2>Loop Medical Advisor Login</h2>
          <p>Enter your 14-digit advisor ID to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="advisorId">Advisor ID</label>
            <input
              type="text"
              id="advisorId"
              value={advisorId}
              onChange={handleIdChange}
              placeholder="LOOP2024ADV001"
              className={error ? 'input-error' : ''}
              required
              autoFocus
            />
            <span className="id-counter">{advisorId.length}/14</span>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isVerifying || advisorId.length !== 14}
            className="btn-verify"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="auth-info">
          <h4>Sample Valid IDs for Testing:</h4>
          <ul>
            <li><code>LOOP2024ADV001</code> - Sarah Thompson</li>
            <li><code>LOOP2024ADV002</code> - Michael Rodriguez</li>
            <li><code>LOOP2024ADV003</code> - Priya Kapoor</li>
          </ul>
        </div>

        <button onClick={onBack} className="back-button">
          ← Back
        </button>
      </div>
    </div>
  );
}

export default AdvisorAuth;
