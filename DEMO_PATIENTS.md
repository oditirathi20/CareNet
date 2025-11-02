# Demo Patients for AI Validation Testing

## Three Pre-Configured Patients with Treatment Plans

These patients have been specifically created to showcase different AI validation scenarios. They already have treatment plans that the AI will analyze.

---

### 🔴 PAT009 - Rajesh Kumar (UNDER-TREATMENT)
**Condition:** Type 2 Diabetes with Hypertension  
**Age:** 52, Male  
**Treatment Cost:** ₹2,500 (Very Low)

**What's Wrong:**
- Patient has high blood sugar (180 mg/dL) but NO diabetes medication prescribed
- Only continuing BP medication
- Advised "lifestyle changes only" - insufficient for diabetes management
- Skipping first-line Metformin therapy

**Expected AI Analysis:**
- ❌ Should flag as INAPPROPRIATE
- Will cite NLEM 2022 and CGHS guidelines requiring Metformin as first-line
- Will note danger of under-treating diabetes
- Will recommend immediate diabetes medication

---

### ✅ PAT010 - Priya Sharma (APPROPRIATE TREATMENT)
**Condition:** Mild Hypertension  
**Age:** 38, Female  
**Treatment Cost:** ₹8,500 (Standard)

**What's Right:**
- Stage 1 hypertension treated with lifestyle changes + low-dose ACE inhibitor (Enalapril)
- DASH diet and sodium restriction recommended
- Evidence-based first-line treatment per guidelines
- Appropriate BP monitoring

**Expected AI Analysis:**
- ✅ Should approve as APPROPRIATE
- Will cite CGHS and Standard Treatment Guidelines
- Will note alignment with evidence-based protocols
- High confidence rating

---

### 🔴 PAT011 - Amit Patel (OVER-TREATMENT)
**Condition:** Type 2 Diabetes - Early Stage  
**Age:** 48, Male  
**Treatment Cost:** ₹45,000 (Very Expensive)

**What's Wrong:**
- Newly diagnosed (2 months) but immediately prescribed expensive GLP-1 (Semaglutide/Wegovy)
- Skips first-line Metformin + lifestyle changes
- Includes unnecessary "executive wellness program"
- Continuous Glucose Monitor for uncomplicated diabetes
- Private dietitian, bi-weekly consultations - excessive for new diagnosis
- Cost is 5-6x higher than standard treatment

**Expected AI Analysis:**
- ❌ Should flag as INAPPROPRIATE/OVER-TREATMENT
- Will cite NLEM showing Wegovy not first-line
- Will note cost inflation (₹45,000 vs ₹8,000-10,000 standard)
- Will recommend starting with Metformin + lifestyle changes
- Will question "executive wellness program" necessity

---

## How to Use for Demo:

1. **Login as Loop Advisor**
2. **Select each patient one by one:**
   - PAT009 (Rajesh) - Shows UNDER-treatment detection
   - PAT010 (Priya) - Shows APPROPRIATE treatment approval
   - PAT011 (Amit) - Shows OVER-treatment/fraud detection

3. **Click "Analyze with AI"** for each

4. **Show the AI report** highlighting:
   - Treatment Status verdict
   - Cited medical guidelines (CGHS, NLEM, ICMR)
   - Cost analysis
   - Recommendations

---

## Demo Script Suggestions:

**For PAT009 (Under-treatment):**
"Notice how the AI caught that this patient with diabetes isn't getting any diabetes medication. It's citing NLEM 2022 which requires Metformin as first-line therapy. This protects patients from inadequate care."

**For PAT010 (Appropriate):**
"Here's a properly treated case. The AI validates that this Stage 1 hypertension treatment follows CGHS protocols exactly - lifestyle changes plus first-line ACE inhibitor. High confidence rating."

**For PAT011 (Over-treatment):**
"This is where our fraud detection shines. A newly diagnosed diabetic is immediately put on expensive Wegovy injections and a ₹45,000 'executive wellness program'. The AI flags this as over-treatment, citing that NLEM recommends starting with affordable Metformin. This is exactly the kind of cost inflation insurers need to catch."

---

## Key Points for Video:

✅ **Three different scenarios** show AI isn't biased - it catches under-treatment AND over-treatment  
✅ **Real guidelines cited** - not generic AI responses  
✅ **Cost analysis** - AI understands when treatment is suspiciously cheap or expensive  
✅ **Actionable recommendations** - tells advisors exactly what to ask doctors  

This demonstrates **trustworthy, explainable AI** that protects patients AND insurers! 🎯
