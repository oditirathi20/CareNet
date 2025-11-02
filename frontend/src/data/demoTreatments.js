// Pre-configured treatment plans for demo purposes
// These showcase different scenarios for AI validation

export const demoTreatments = {
  // PAT009 - UNDER-TREATMENT (Low Cost - ₹2,500)
  'PAT009': {
    diagnosis: 'Type 2 Diabetes with Hypertension',
    treatmentDetails: 'Continue current BP medication. Advised dietary modifications and exercise. No diabetes medication prescribed yet. Follow-up in 3 months.',
    prescribedMedication: 'Amlodipine 5mg (existing), Lifestyle modifications only',
    estimatedCost: '2500',
    doctorNotes: 'Patient advised on diet and exercise. Will monitor blood sugar levels.',
    createdDate: '2024-11-01',
    doctorId: 'D123456789',
    doctorName: 'Dr. Sarah Johnson'
  },

  // PAT010 - APPROPRIATE TREATMENT (Standard Cost - ₹8,500)
  'PAT010': {
    diagnosis: 'Stage 1 Hypertension',
    treatmentDetails: 'Lifestyle modifications: DASH diet, reduce sodium intake to <2g/day, regular exercise 30 mins daily. Start low-dose ACE inhibitor. Regular BP monitoring at home.',
    prescribedMedication: 'Enalapril 5mg once daily, Regular BP monitoring',
    estimatedCost: '8500',
    doctorNotes: 'Evidence-based first-line treatment. Patient counseled on lifestyle changes.',
    createdDate: '2024-11-01',
    doctorId: 'D123456789',
    doctorName: 'Dr. Sarah Johnson'
  },

  // PAT011 - OVER-TREATMENT (Expensive - ₹45,000)
  'PAT011': {
    diagnosis: 'Type 2 Diabetes - Early Stage',
    treatmentDetails: 'Immediate initiation of combination therapy: GLP-1 agonist injection (Semaglutide), SGLT2 inhibitor, plus comprehensive executive diabetes management program including: Continuous Glucose Monitor (CGM) system, Personalized nutrition coaching with private dietitian, Bi-weekly endocrinology consultations, Premium diabetes care app subscription, Advanced metabolic panel testing (monthly)',
    prescribedMedication: 'Semaglutide (Wegovy) 0.5mg weekly injection, Empagliflozin (Jardiance) 10mg daily, CGM device (Freestyle Libre), Metformin 500mg (as backup)',
    estimatedCost: '45000',
    doctorNotes: 'Comprehensive diabetes management plan with latest medications and monitoring technology.',
    createdDate: '2024-11-01',
    doctorId: 'D123456789',
    doctorName: 'Dr. Sarah Johnson'
  }
};

export const getDemoTreatment = (patientId) => {
  return demoTreatments[patientId] || null;
};

export const initializeDemoTreatments = () => {
  // Store demo treatments in localStorage
  Object.keys(demoTreatments).forEach(patientId => {
    const treatment = demoTreatments[patientId];
    localStorage.setItem(`treatment_${patientId}`, JSON.stringify(treatment));
  });
  console.log('✅ Demo treatments initialized for PAT009, PAT010, PAT011');
};

export const hasDemoTreatment = (patientId) => {
  return demoTreatments.hasOwnProperty(patientId);
};
