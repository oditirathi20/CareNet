// Mock database of registered doctors with their UIDs
export const registeredDoctors = [
  {
    uid: 'DOC2024ABCD123',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Medicine',
    verified: true
  },
  {
    uid: 'DOC2024EFGH456',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiology',
    verified: true
  },
  {
    uid: 'DOC2024IJKL789',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrics',
    verified: true
  },
  {
    uid: 'DOC2024MNOP012',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedics',
    verified: true
  },
  {
    uid: 'DOC2024QRST345',
    name: 'Dr. Emily Davis',
    specialization: 'Dermatology',
    verified: true
  }
];

// Function to verify doctor UID
export const verifyDoctorUID = (uid) => {
  const doctor = registeredDoctors.find(doc => doc.uid === uid.toUpperCase());
  return doctor ? { valid: true, doctor } : { valid: false, doctor: null };
};
