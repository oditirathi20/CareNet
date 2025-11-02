// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareRegistry {
    // Enum for user roles
    enum Role { None, Patient, Doctor, LoopAdvisor }
    
    // Struct for Patient Data
    struct PatientData {
        string name;
        uint256 age;
        string gender;
        string medicalHistory;
        string insuranceInfo;
        string currentTestReports;
        bool exists;
    }
    
    // Struct for Treatment Plan
    struct TreatmentPlan {
        string diagnosis;
        string treatmentDetails;
        string prescribedMedication;
        uint256 estimatedCost;
        address assignedDoctor;
        uint256 lastUpdated;
        bool exists;
    }
    
    // Mappings
    mapping(address => Role) public userRoles;
    mapping(address => PatientData) private patientDataStore;
    mapping(address => TreatmentPlan) private treatmentPlanStore;
    mapping(address => address[]) public doctorPatients; // Doctor -> list of patient addresses
    
    // Events
    event RoleAssigned(address indexed user, Role role);
    event PatientDataUpdated(address indexed patient);
    event TreatmentPlanUpdated(address indexed patient, address indexed doctor);
    event DoctorAssigned(address indexed doctor, address indexed patient);
    
    // Modifiers
    modifier onlyRole(Role _role) {
        require(userRoles[msg.sender] == _role, "Unauthorized: Incorrect role");
        _;
    }
    
    modifier onlyPatientOrAdvisor(address _patient) {
        require(
            msg.sender == _patient || userRoles[msg.sender] == Role.LoopAdvisor,
            "Unauthorized: Only patient or advisor can access"
        );
        _;
    }
    
    modifier onlyDoctorOrAdvisor(address _patient) {
        require(
            userRoles[msg.sender] == Role.Doctor || userRoles[msg.sender] == Role.LoopAdvisor,
            "Unauthorized: Only doctor or advisor can access"
        );
        _;
    }
    
    modifier onlyAssignedDoctorOrAdvisor(address _patient) {
        if (userRoles[msg.sender] == Role.Doctor) {
            require(
                treatmentPlanStore[_patient].assignedDoctor == msg.sender,
                "Unauthorized: Not assigned to this patient"
            );
        } else {
            require(
                userRoles[msg.sender] == Role.LoopAdvisor,
                "Unauthorized: Only assigned doctor or advisor can access"
            );
        }
        _;
    }
    
    // Constructor
    constructor() {
        // Assign contract deployer as Loop Advisor
        userRoles[msg.sender] = Role.LoopAdvisor;
        emit RoleAssigned(msg.sender, Role.LoopAdvisor);
    }
    
    // Function to assign roles (only Loop Advisor can assign roles)
    function assignRole(address _user, Role _role) external onlyRole(Role.LoopAdvisor) {
        require(_role != Role.None, "Invalid role");
        userRoles[_user] = _role;
        emit RoleAssigned(_user, _role);
    }
    
    // Function for patients to register their data
    function registerPatientData(
        string memory _name,
        uint256 _age,
        string memory _gender,
        string memory _medicalHistory,
        string memory _insuranceInfo,
        string memory _currentTestReports
    ) external onlyRole(Role.Patient) {
        patientDataStore[msg.sender] = PatientData({
            name: _name,
            age: _age,
            gender: _gender,
            medicalHistory: _medicalHistory,
            insuranceInfo: _insuranceInfo,
            currentTestReports: _currentTestReports,
            exists: true
        });
        emit PatientDataUpdated(msg.sender);
    }
    
    // Function to get patient data (Patient can view their own, Advisor can view any)
    function getPatientData(address _patient) 
        external 
        view 
        onlyPatientOrAdvisor(_patient)
        returns (PatientData memory) 
    {
        require(patientDataStore[_patient].exists, "Patient data does not exist");
        return patientDataStore[_patient];
    }
    
    // Function for doctors to view patient data (only assigned doctors)
    function getDoctorPatientData(address _patient) 
        external 
        view 
        onlyRole(Role.Doctor)
        returns (PatientData memory) 
    {
        require(patientDataStore[_patient].exists, "Patient data does not exist");
        require(
            treatmentPlanStore[_patient].assignedDoctor == msg.sender,
            "Not assigned to this patient"
        );
        return patientDataStore[_patient];
    }
    
    // Function to assign doctor to patient (only Loop Advisor)
    function assignDoctorToPatient(address _doctor, address _patient) 
        external 
        onlyRole(Role.LoopAdvisor) 
    {
        require(userRoles[_doctor] == Role.Doctor, "Address is not a doctor");
        require(patientDataStore[_patient].exists, "Patient does not exist");
        
        // Initialize treatment plan if it doesn't exist
        if (!treatmentPlanStore[_patient].exists) {
            treatmentPlanStore[_patient].exists = true;
        }
        
        treatmentPlanStore[_patient].assignedDoctor = _doctor;
        doctorPatients[_doctor].push(_patient);
        
        emit DoctorAssigned(_doctor, _patient);
    }
    
    // Function for doctors to update treatment plan
    function updateTreatmentPlan(
        address _patient,
        string memory _diagnosis,
        string memory _treatmentDetails,
        string memory _prescribedMedication,
        uint256 _estimatedCost
    ) external onlyRole(Role.Doctor) {
        require(patientDataStore[_patient].exists, "Patient does not exist");
        require(
            treatmentPlanStore[_patient].assignedDoctor == msg.sender,
            "Not assigned to this patient"
        );
        
        treatmentPlanStore[_patient] = TreatmentPlan({
            diagnosis: _diagnosis,
            treatmentDetails: _treatmentDetails,
            prescribedMedication: _prescribedMedication,
            estimatedCost: _estimatedCost,
            assignedDoctor: msg.sender,
            lastUpdated: block.timestamp,
            exists: true
        });
        
        emit TreatmentPlanUpdated(_patient, msg.sender);
    }
    
    // Function to get treatment plan (only assigned doctor or advisor, NOT patient)
    function getTreatmentPlan(address _patient) 
        external 
        view 
        onlyAssignedDoctorOrAdvisor(_patient)
        returns (TreatmentPlan memory) 
    {
        require(treatmentPlanStore[_patient].exists, "Treatment plan does not exist");
        return treatmentPlanStore[_patient];
    }
    
    // Function to get doctor's patient list
    function getDoctorPatients() external view onlyRole(Role.Doctor) returns (address[] memory) {
        return doctorPatients[msg.sender];
    }
    
    // Function for advisor to get all patients (for demo purposes - in production, use pagination)
    function getAllPatients() external view onlyRole(Role.LoopAdvisor) returns (address[] memory) {
        // Note: In a real implementation, you'd want to maintain a list of all patient addresses
        // For now, this is a placeholder that doctors can query their patients
        // In production, maintain a separate array of all patient addresses
        return new address[](0); // Placeholder - implement patient list tracking
    }
    
    // Helper function to check if user has a role
    function getMyRole() external view returns (Role) {
        return userRoles[msg.sender];
    }
}
