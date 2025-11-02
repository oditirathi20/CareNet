const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { loadKnowledgeBase, queryPDFsWithRAG } = require('./pdfProcessor');

const app = express();
const PORT = process.env.PORT || 5000;

// Global knowledge base - loaded once at startup
let knowledgeBase = [];

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Analysis Server is running' });
});

app.post('/api/analyze-treatment', async (req, res) => {
  try {
    const { age, gender, medicalHistory, currentTestReports, treatmentPlan } = req.body;

    if (!age || !gender || !medicalHistory || !treatmentPlan) {
      return res.status(400).json({ 
        error: 'Missing required fields: age, gender, medicalHistory, treatmentPlan' 
      });
    }

    // Parse treatment plan
    let parsedTreatment;
    try {
      parsedTreatment = typeof treatmentPlan === 'string' 
        ? JSON.parse(treatmentPlan) 
        : treatmentPlan;
    } catch (e) {
      parsedTreatment = { diagnosis: medicalHistory, details: treatmentPlan };
    }

    console.log('\n🔍 Starting RAG-based analysis...');
    console.log(`Patient: ${age}y ${gender}, Condition: ${medicalHistory}`);
    console.log(`Treatment: ${parsedTreatment.diagnosis || 'Unknown'}`);

    // **RAG: Query PDFs using Gemini File API**
    const ragResult = await queryPDFsWithRAG(
      medicalHistory,
      parsedTreatment.diagnosis || medicalHistory,
      currentTestReports || '',
      parsedTreatment
    );

    const contextText = ragResult.context;

    // **Enhanced prompt with retrieved context**
    const prompt = `You are a medical fraud detection expert working for Loop Health Insurance. You analyze treatment plans using TRUSTED MEDICAL GUIDELINES to detect over-treatment, unnecessary procedures, and ensure patient safety.

**RETRIEVED CONTEXT FROM MEDICAL GUIDELINES:**
${contextText}

**PATIENT INFORMATION:**
- Age: ${age} years
- Gender: ${gender}
- Medical History: ${medicalHistory}
- Current Symptoms/Tests: ${currentTestReports || 'Not provided'}

**DOCTOR'S PROPOSED TREATMENT PLAN:**
- Diagnosis: ${parsedTreatment.diagnosis || 'Not specified'}
- Treatment Details: ${parsedTreatment.treatmentDetails || 'Not specified'}
- Prescribed Medications: ${parsedTreatment.prescribedMedication || 'Not specified'}
- Estimated Cost: ₹${parsedTreatment.estimatedCost || 'Not specified'}

**YOUR TASK:**
Generate a professional medical validation report in the following format:

**CRITICAL FORMATTING RULES:**
- NO emojis anywhere in the output (no ❌, ✅, ⚠️, 🚩, 💡, 📊, etc.)
- Use clean numbered sections (1., 2., 3., 4.)
- Use consistent bullet points (•) for all sub-items
- No mixing of asterisks, bullets, and numbering
- Proper indentation and hierarchy
- Professional medical report style

SECTION 1: VALIDITY ASSESSMENT
Treatment Status: [Appropriate/Questionable/Inappropriate]

Key Findings:
• [First finding with guideline citation]
• [Second finding with guideline citation]
• [Third finding with guideline citation]

Detailed Analysis:
[Write 2-3 paragraphs analyzing the treatment appropriateness, citing specific guidelines like NLEM, CGHS, ICMR. Discuss whether medications are first-line treatments, if procedures are evidence-based, and overall alignment with standard protocols.]

---

SECTION 2: RED FLAGS AND OVER-TREATMENT CONCERNS

Identified Issues:
• [Issue 1 with specific concern]
• [Issue 2 with specific concern]
• [Issue 3 with specific concern]

Cost Analysis:
[Paragraph discussing whether the cost of ₹${parsedTreatment.estimatedCost || 'Not specified'} is justified compared to CGHS rates and standard treatment protocols.]

Medication Review:
[Paragraph comparing prescribed medications against NLEM essential medicines list and discussing any non-essential or expensive alternatives.]

---

SECTION 3: RECOMMENDATIONS FOR MEDICAL ADVISOR

Questions for Physician:
• [Question 1 referencing specific guideline]
• [Question 2 referencing specific guideline]
• [Question 3 referencing specific guideline]

Suggested Alternatives:
• [Alternative 1 with cost/benefit]
• [Alternative 2 with cost/benefit]

Patient Discussion Points:
• [Point 1 for transparency]
• [Point 2 for transparency]

Decision Recommendation:
[Clear recommendation: Approve/Request Revision/Reject with justification]

---

SECTION 4: CONFIDENCE AND SOURCES

Confidence Level: [High/Medium/Low]
Rationale: [Explain why this confidence level]

Guidelines Referenced:
• NLEM 2022
• CGHS Handbook
• ICMR Ethical Guidelines 2017
• IRDAI Regulations 2016
• Standard Treatment Guidelines

Limitations:
[Note any gaps requiring human expert review]

**IMPORTANT:** 
- Always cite the source document when making claims (e.g., "According to CGHS Handbook...")
- Be specific about what's guideline-compliant vs questionable
- Focus on detecting fraud/over-treatment while ensuring patient safety`;

    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY not set' 
      });
    }

    console.log('🤖 Calling Gemini API with RAG context...');

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': geminiApiKey
        }
      }
    );

    const analysis = response.data.candidates[0].content.parts[0].text;

    console.log('✅ RAG-based analysis completed\n');

    // Return with sources for transparency
    res.json({
      success: true,
      analysis: analysis,
      sources: ragResult.sources.map(src => ({
        document: src.name,
        filename: src.filename
      })),
      metadata: {
        documentsSearched: knowledgeBase.length,
        documentsUsed: ragResult.sources.length,
        timestamp: new Date().toISOString(),
        ragEnabled: true
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('API Error:', error.response.data);
      res.status(error.response.status).json({
        error: 'AI service error',
        details: error.response.data.error?.message || 'Unknown error'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
});

app.listen(PORT, async () => {
  console.log(`\n🚀 AI Server with RAG starting on port ${PORT}...`);
  console.log(`🤖 Using Google Gemini AI (gemini-2.0-flash-exp)`);
  
  // Load knowledge base at startup
  try {
    knowledgeBase = await loadKnowledgeBase();
    console.log(`✅ RAG System Ready! ${knowledgeBase.length} medical documents indexed`);
    console.log(`📚 Knowledge Base: CGHS, ICMR, NLEM, IRDAI, Treatment Guidelines`);
    console.log(`\n🎯 Server ready to detect medical fraud with explainable AI!\n`);
  } catch (error) {
    console.error('❌ Error loading knowledge base:', error.message);
    console.log('⚠️  Server running without RAG (will use general knowledge only)\n');
  }
});
