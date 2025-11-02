import React, { useState } from 'react';
import './DoctorAuth.css';
import { verifyDoctorUID } from '../data/doctorRegistry';

function DoctorAuth({ onAuthenticated, onBack }) {
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Validate UID format (14 alphanumeric characters)
    const uidPattern = /^[A-Z0-9]{14}$/i;
    if (!uidPattern.test(uid)) {
      setError('Invalid UID format. Must be 14 alphanumeric characters.');
      setIsVerifying(false);
      return;
    }

    // Verify UID
    setTimeout(() => {
      const result = verifyDoctorUID(uid);
      if (result.valid) {
        onAuthenticated(result.doctor);
      } else {
        setError('Doctor UID not found. Please check your registration number.');
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleUidChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 14) {
      setUid(value);
      setError('');
    }
  };

  return (
    <div className="doctor-auth-container">
      <div className="doctor-auth-card">
        <div className="auth-header">
          <h2>Doctor Authentication</h2>
          <p>Enter your 14-digit registration UID to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="uid">Doctor Registration UID</label>
            <input
              type="text"
              id="uid"
              value={uid}
              onChange={handleUidChange}
              placeholder="DOC2024ABCD123"
              className={error ? 'input-error' : ''}
              required
              autoFocus
            />
            <span className="uid-counter">{uid.length}/14</span>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isVerifying || uid.length !== 14}
            className="btn-verify"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="auth-info">
          <h4>Sample Valid UIDs for Testing:</h4>
          <ul>
            <li><code>DOC2024ABCD123</code> - Dr. Sarah Johnson</li>
            <li><code>DOC2024EFGH456</code> - Dr. Michael Chen</li>
            <li><code>DOC2024IJKL789</code> - Dr. Priya Sharma</li>
          </ul>
        </div>

        <button onClick={onBack} className="back-button">
          ← Back
        </button>
      </div>
    </div>
  );
}

export default DoctorAuth;
