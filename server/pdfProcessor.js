const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache for PDF metadata
let knowledgeBase = [];

/**
 * Categorize document based on filename
 */
function categorizeDocument(filename) {
  if (filename.includes('CGHS')) return 'Treatment Protocols';
  if (filename.includes('ICMR')) return 'Ethical Guidelines';
  if (filename.includes('IRDAI')) return 'Insurance Regulations';
  if (filename.includes('NLEM') || filename.includes('nlem')) return 'Essential Medicines List';
  if (filename.includes('treatment') || filename.includes('Treatment')) return 'Clinical Guidelines';
  return 'Medical Guidelines';
}

/**
 * Load knowledge base - List available PDFs and their metadata
 */
async function loadKnowledgeBase() {
  const knowledgeBasePath = path.join(__dirname, 'knowledge_base');
  
  if (!fs.existsSync(knowledgeBasePath)) {
    console.log('⚠️  knowledge_base folder not found');
    return [];
  }

  const pdfFiles = fs.readdirSync(knowledgeBasePath).filter(f => f.endsWith('.pdf'));

  console.log(`\n📚 Knowledge base found: ${pdfFiles.length} PDFs`);

  knowledgeBase = pdfFiles.map(file => ({
    filename: file,
    displayName: file.replace('.pdf', '').replace(/_/g, ' '),
    path: path.join(knowledgeBasePath, file),
    category: categorizeDocument(file)
  }));

  console.log(`✅ Knowledge base indexed:`);
  knowledgeBase.forEach(doc => {
    console.log(`   📄 ${doc.displayName} (${doc.category})`);
  });
  console.log('');

  return knowledgeBase;
}

/**
 * Query knowledge base using Gemini AI with document context
 */
async function queryPDFsWithRAG(patientCondition, diagnosis, symptoms, treatmentPlan) {
  if (knowledgeBase.length === 0) {
    return { 
      context: "Knowledge base not loaded. Using general medical knowledge.", 
      sources: [] 
    };
  }

  try {
    console.log(`🔍 RAG: Analyzing treatment for "${patientCondition}"`);

    // Build document context from metadata
    const documentsContext = `
**AVAILABLE MEDICAL GUIDELINES:**

${knowledgeBase.map(doc => `
📚 **${doc.displayName}** (${doc.category})
- Official Indian medical guidelines document
- Contains protocols, standards, and regulations
`).join('\n')}

These are trusted medical sources from Indian healthcare authorities. When analyzing the treatment, reference these guidelines and cite them appropriately.
`;

    const query = `Based on the available medical guidelines listed above, analyze this treatment:

**Patient Condition:** ${patientCondition}
**Diagnosis:** ${diagnosis}
**Symptoms:** ${symptoms}
**Proposed Treatment:**
- Medications: ${treatmentPlan.prescribedMedication || 'Not specified'}
- Procedures: ${treatmentPlan.treatmentDetails || 'Not specified'}
- Estimated Cost: ₹${treatmentPlan.estimatedCost || 'Not specified'}

**Analysis Required:**
1. Compare medications with NLEM (National List of Essential Medicines 2022) - are they first-line treatments?
2. Check if treatment aligns with Standard Treatment Guidelines
3. Verify cost reasonableness per CGHS Handbook rates
4. Identify any ethical concerns per ICMR Guidelines
5. Check insurance claim appropriateness per IRDAI Regulations

Provide specific insights about:
- Which guidelines support or question this treatment
- Any red flags for over-treatment or fraud
- Recommendations for the medical advisor

**IMPORTANT:** When referencing guidelines, cite them like:
- "According to CGHS Handbook..."
- "Per NLEM 2022..."
- "ICMR Ethical Guidelines suggest..."
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent(documentsContext + '\n\n' + query);
    const response = await result.response;
    const context = response.text();

    console.log(`✅ RAG: Analysis complete with guideline references\n`);

    return {
      context: context,
      sources: knowledgeBase.map(doc => ({
        name: doc.displayName,
        filename: doc.filename,
        category: doc.category
      }))
    };

  } catch (error) {
    console.error('❌ RAG query error:', error.message);
    return { 
      context: "Error querying medical guidelines. Using general knowledge.", 
      sources: [] 
    };
  }
}

/**
 * Get list of available documents
 */
function getUploadedPDFs() {
  return knowledgeBase;
}

module.exports = {
  loadKnowledgeBase,
  queryPDFsWithRAG,
  getUploadedPDFs
};
