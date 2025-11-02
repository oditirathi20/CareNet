// Sample patient database for demo purposes
export const patientRegistry = [
  {
    id: 'PAT001',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    condition: 'Type 2 Diabetes',
    symptoms: 'Increased thirst, frequent urination, fatigue, blurred vision',
    medicalHistory: 'Hypertension (5 years), Family history of diabetes',
    currentMedications: 'Lisinopril 10mg daily',
    lastVisit: '2024-10-15',
    severity: 'Moderate'
  },
  {
    id: 'PAT002',
    name: 'Sarah Williams',
    age: 32,
    gender: 'Female',
    condition: 'Chronic Acne',
    symptoms: 'Persistent facial acne, scarring, oily skin',
    medicalHistory: 'Acne since teenage years, tried various topical treatments',
    currentMedications: 'Benzoyl peroxide gel, Antihistamines as needed',
    lastVisit: '2024-10-20',
    severity: 'Moderate'
  },
  {
    id: 'PAT003',
    name: 'Robert Chen',
    age: 58,
    gender: 'Male',
    condition: 'Coronary Artery Disease',
    symptoms: 'Chest pain on exertion, shortness of breath, fatigue',
    medicalHistory: 'High cholesterol (10 years), Previous heart attack (2020), Smoker (quit 2 years ago)',
    currentMedications: 'Atorvastatin 40mg, Aspirin 81mg, Metoprolol 50mg',
    lastVisit: '2024-10-25',
    severity: 'Severe'
  },
  {
    id: 'PAT004',
    name: 'Emily Johnson',
    age: 8,
    gender: 'Female',
    condition: 'Childhood Asthma',
    symptoms: 'Wheezing, shortness of breath, coughing during play',
    medicalHistory: 'Diagnosed at age 5, no hospitalizations',
    currentMedications: 'Albuterol inhaler as needed',
    lastVisit: '2024-10-28',
    severity: 'Moderate'
  },
  {
    id: 'PAT005',
    name: 'Michael Brown',
    age: 67,
    gender: 'Male',
    condition: 'Osteoarthritis',
    symptoms: 'Joint pain and stiffness (knees and hips), reduced mobility, morning stiffness',
    medicalHistory: 'Arthritis progression over 15 years, Previous knee surgery (2018)',
    currentMedications: 'Ibuprofen 400mg as needed, Glucosamine supplement',
    lastVisit: '2024-10-22',
    severity: 'Moderate'
  },
  {
    id: 'PAT006',
    name: 'Lisa Martinez',
    age: 41,
    gender: 'Female',
    condition: 'Asthma',
    symptoms: 'Wheezing, shortness of breath, chest tightness, coughing (especially at night)',
    medicalHistory: 'Childhood asthma, Environmental allergies, No hospitalizations in past 5 years',
    currentMedications: 'Albuterol inhaler (rescue), Fluticasone inhaler (daily)',
    lastVisit: '2024-10-18',
    severity: 'Mild to Moderate'
  },
  {
    id: 'PAT007',
    name: 'David Taylor',
    age: 52,
    gender: 'Male',
    condition: 'Chronic Lower Back Pain',
    symptoms: 'Persistent lower back pain, radiating to left leg, numbness in toes',
    medicalHistory: 'Herniated disc L4-L5 (diagnosed 2022), Physical therapy ongoing',
    currentMedications: 'Gabapentin 300mg twice daily, Acetaminophen as needed',
    lastVisit: '2024-10-30',
    severity: 'Moderate to Severe'
  },
  {
    id: 'PAT008',
    name: 'Jennifer Lee',
    age: 36,
    gender: 'Female',
    condition: 'Hypothyroidism',
    symptoms: 'Fatigue, weight gain, cold intolerance, dry skin, constipation',
    medicalHistory: 'Diagnosed 3 years ago, Regular monitoring of TSH levels',
    currentMedications: 'Levothyroxine 75mcg daily',
    lastVisit: '2024-10-12',
    severity: 'Mild'
  },
  // Demo patients with pre-set treatments for AI validation testing
  {
    id: 'PAT009',
    name: 'Rajesh Kumar',
    age: 52,
    gender: 'Male',
    condition: 'Type 2 Diabetes with Hypertension',
    symptoms: 'High blood sugar (fasting 180 mg/dL), elevated BP (150/95), mild fatigue',
    medicalHistory: 'Recently diagnosed diabetes (3 months ago), Hypertension for 2 years',
    currentMedications: 'Amlodipine 5mg (for BP)',
    lastVisit: '2024-11-01',
    severity: 'Moderate',
    hasDemoTreatment: true,
    demoTreatmentType: 'under-treatment'
  },
  {
    id: 'PAT010',
    name: 'Priya Sharma',
    age: 38,
    gender: 'Female',
    condition: 'Mild Hypertension',
    symptoms: 'Slightly elevated BP (140/90), occasional headaches',
    medicalHistory: 'No significant past medical history, Family history of hypertension',
    currentMedications: 'None currently',
    lastVisit: '2024-11-01',
    severity: 'Mild',
    hasDemoTreatment: true,
    demoTreatmentType: 'appropriate'
  },
  {
    id: 'PAT011',
    name: 'Amit Patel',
    age: 48,
    gender: 'Male',
    condition: 'Type 2 Diabetes',
    symptoms: 'Elevated fasting blood sugar (160 mg/dL), increased thirst',
    medicalHistory: 'Newly diagnosed Type 2 Diabetes (2 months ago), No complications',
    currentMedications: 'None currently',
    lastVisit: '2024-11-01',
    severity: 'Moderate',
    hasDemoTreatment: true,
    demoTreatmentType: 'over-treatment'
  }
];

export const getPatientById = (patientId) => {
  return patientRegistry.find(patient => patient.id === patientId);
};

export const getAllPatients = () => {
  return patientRegistry;
};

export const searchPatients = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return patientRegistry.filter(patient => 
    patient.name.toLowerCase().includes(term) ||
    patient.id.toLowerCase().includes(term) ||
    patient.condition.toLowerCase().includes(term)
  );
};
