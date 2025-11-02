// Mock database of registered Loop Medical Advisors
export const registeredAdvisors = [
  {
    id: 'LOOP2024ADV001',
    name: 'Sarah Thompson',
    department: 'Claims Review',
    verified: true
  },
  {
    id: 'LOOP2024ADV002',
    name: 'Michael Rodriguez',
    department: 'Medical Policy',
    verified: true
  },
  {
    id: 'LOOP2024ADV003',
    name: 'Priya Kapoor',
    department: 'Quality Assurance',
    verified: true
  },
  {
    id: 'LOOP2024ADV004',
    name: 'David Chen',
    department: 'Fraud Detection',
    verified: true
  },
  {
    id: 'LOOP2024ADV005',
    name: 'Emma Williams',
    department: 'Patient Relations',
    verified: true
  }
];

// Function to verify advisor ID
export const verifyAdvisorID = (id) => {
  const advisor = registeredAdvisors.find(adv => adv.id === id.toUpperCase());
  return advisor ? { valid: true, advisor } : { valid: false, advisor: null };
};
