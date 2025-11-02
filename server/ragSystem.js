const { GoogleGenerativeAI, GoogleAIFileManager } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class MedicalRAGSystem {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.fileManager = new GoogleAIFileManager(apiKey);
    this.uploadedFiles = [];
    this.knowledgeBasePath = path.join(__dirname, 'knowledge_base');
  }

  async initialize() {
    console.log('🔄 Initializing RAG system with medical PDFs...');
    
    try {
      // Get all PDF files from knowledge_base folder
      const files = fs.readdirSync(this.knowledgeBasePath)
        .filter(file => file.endsWith('.pdf'));

      console.log(`📚 Found ${files.length} PDF documents`);

      // Upload PDFs to Gemini File API
      for (const file of files) {
        const filePath = path.join(this.knowledgeBasePath, file);
        console.log(`📤 Uploading ${file}...`);
        
        try {
          const uploadResult = await this.fileManager.uploadFile(filePath, {
            mimeType: 'application/pdf',
            displayName: file
          });

          this.uploadedFiles.push({
            name: file,
            uri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType
          });

          console.log(`✅ Uploaded: ${file}`);
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${file}:`, uploadError.message);
        }
      }

      console.log(`✅ RAG system initialized with ${this.uploadedFiles.length} documents`);
      return true;
    } catch (error) {
      console.error('❌ Error initializing RAG system:', error);
      return false;
    }
  }

  async analyzeWithRAG(patientData, treatmentPlan) {
    console.log('🔍 Performing RAG-based analysis...');

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash'
      });

      // Build the RAG prompt with file context
      const prompt = `You are a medical domain expert and Loop Medical Advisor AI. You have access to official Indian medical guidelines and regulations.

**TASK:** Analyze the following case using the provided medical documents to detect potential fraud, over-treatment, or deviations from standard protocols.

**PATIENT DATA:**
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Medical History: ${patientData.medicalHistory}
- Current Symptoms: ${patientData.currentTestReports || 'Not provided'}

**PROPOSED TREATMENT PLAN:**
${JSON.stringify(treatmentPlan, null, 2)}

**ANALYSIS REQUIREMENTS:**

1. **Standard Protocol Verification:**
   - Compare the treatment plan against guidelines in the documents
   - Check if prescribed medications are in NLEM (National List of Essential Medicines)
   - Verify if the treatment follows CGHS or standard treatment guidelines

2. **Fraud Detection:**
   - Identify any unnecessary tests or procedures
   - Flag expensive medications when cheaper alternatives exist
   - Check for over-treatment or over-prescription
   - Verify cost appropriateness based on standard rates

3. **Regulatory Compliance:**
   - Check against IRDAI regulations for what should be covered
   - Verify ethical guidelines (ICMR) are followed
   - Flag any potential kickback indicators

4. **Evidence-Based Recommendations:**
   - Cite specific documents/guidelines when making claims
   - Provide exact section or regulation numbers when possible
   - Suggest cost-effective alternatives if available

5. **Actionable Output:**
   - Assign a risk score (Low/Medium/High)
   - List specific questions for the doctor
   - Provide transparency points for patient discussion

**IMPORTANT:** Always cite which document (CGHS, NLEM, IRDAI, ICMR, STG) you're referencing. Be specific about page numbers or sections if possible.`;

      // Call Gemini with the uploaded files as context
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: this.uploadedFiles[0].mimeType,
            fileUri: this.uploadedFiles[0].uri
          }
        },
        { text: prompt }
      ]);

      const response = await result.response;
      const analysis = response.text();

      console.log('✅ RAG analysis completed');

      return {
        success: true,
        analysis: analysis,
        sources: this.uploadedFiles.map(f => ({
          name: f.name.replace('.pdf', '').replace(/_/g, ' '),
          type: this.categorizeDocument(f.name)
        })),
        metadata: {
          documentsUsed: this.uploadedFiles.length,
          timestamp: new Date().toISOString(),
          model: 'gemini-1.5-flash-with-rag'
        }
      };

    } catch (error) {
      console.error('❌ RAG analysis error:', error);
      throw error;
    }
  }

  categorizeDocument(filename) {
    if (filename.includes('CGHS')) return 'Treatment Guidelines';
    if (filename.includes('NLEM') || filename.includes('nlem')) return 'Essential Medicines';
    if (filename.includes('IRDAI')) return 'Insurance Regulations';
    if (filename.includes('ICMR')) return 'Ethical Guidelines';
    if (filename.includes('standard-treatment')) return 'Clinical Protocols';
    return 'Medical Reference';
  }

  getUploadedFiles() {
    return this.uploadedFiles;
  }
}

module.exports = MedicalRAGSystem;
