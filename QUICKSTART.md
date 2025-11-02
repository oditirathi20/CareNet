# ⚡ Quick Start Guide

## Get Running in 10 Minutes!

### Step 1: Install Dependencies (2 minutes)
```powershell
# Run the setup script
.\setup.ps1
```

**OR manually:**
```powershell
cd contracts; npm install; cd ..
cd server; npm install; cd ..
cd frontend; npm install; cd ..
```

### Step 2: Configure OpenAI API (1 minute)
```powershell
# Copy the environment template
cd server
copy .env.example .env
```

**Edit `server/.env`:**
```
OPENAI_API_KEY=sk-your-actual-openai-key-here
PORT=5000
```

💡 Get your API key from: https://platform.openai.com/api-keys

### Step 3: Start Blockchain (2 minutes)

**Terminal 1:**
```powershell
cd contracts
npx hardhat node
```

Keep this running! You'll see test accounts with private keys.

### Step 4: Deploy Smart Contract (1 minute)

**Terminal 2:**
```powershell
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

You should see: "Contract deployed to: 0x..."

### Step 5: Start AI Backend (1 minute)

**Terminal 3:**
```powershell
cd server
npm start
```

You should see: "AI Analysis Server running on port 5000"

### Step 6: Start Frontend (1 minute)

**Terminal 4:**
```powershell
cd frontend
npm start
```

Browser will auto-open to http://localhost:3000

### Step 7: Configure MetaMask (2 minutes)

1. **Install MetaMask** (if not already installed)

2. **Add Local Network:**
   - Click network dropdown
   - "Add Network"
   - Fill in:
     - Network Name: `Localhost 8545`
     - RPC URL: `http://127.0.0.1:8545`
     - Chain ID: `1337`
     - Currency Symbol: `ETH`

3. **Import Test Accounts:**
   - Look at Terminal 1 (Hardhat node)
   - Copy "Private Key" from Account #0
   - MetaMask > Import Account > Paste Private Key
   - Repeat for Account #1 and #2

### Step 8: Test the Application

#### First Login (Account #0 - Loop Advisor):
1. Connect MetaMask
2. You're automatically a Loop Advisor!
3. **Assign Roles:**
   - Copy address of Account #1
   - Use "Assign Role to User" form
   - Select "Doctor" (role 2)
   - Submit
   - Repeat for Account #2 as "Patient" (role 1)

#### As Patient (Account #2):
1. Switch to Account #2 in MetaMask
2. Refresh browser
3. Register medical information:
   - Name: John Doe
   - Age: 45
   - Gender: Male
   - Medical History: Type 2 Diabetes, Hypertension
   - Insurance: Loop Insurance, Policy #12345
   - Test Reports: HbA1c 7.5%, Blood Pressure 145/95
4. Submit

#### As Loop Advisor - Assign Doctor:
1. Switch back to Account #0 (Advisor)
2. Use "Assign Doctor to Patient" form:
   - Doctor Address: [Account #1 address]
   - Patient Address: [Account #2 address]
3. Submit

#### As Doctor (Account #1):
1. Switch to Account #1 in MetaMask
2. Refresh browser
3. See patient in list
4. Click on patient
5. Create treatment plan:
   - Diagnosis: Uncontrolled Type 2 Diabetes with Hypertension
   - Treatment Details: Initiate insulin therapy, dietary counseling, blood pressure management. Weekly monitoring for first month.
   - Prescribed Medication: Metformin 500mg twice daily, Lisinopril 10mg once daily, Insulin glargine 10 units at bedtime
   - Estimated Cost: 5000
6. Submit

#### As Loop Advisor - AI Analysis:
1. Switch to Account #0 (Advisor)
2. Refresh browser
3. Add Patient Address (Account #2) to patient list
4. Click on patient
5. **Click "Analyze Treatment Plan with AI"**
6. Wait 10-20 seconds
7. See AI analysis! 🎉

---

## ✅ Success Checklist

You should now have:
- ✅ Hardhat blockchain running
- ✅ Smart contract deployed
- ✅ AI backend running
- ✅ React frontend running
- ✅ 3 MetaMask accounts with roles:
  - Account 0: Loop Advisor
  - Account 1: Doctor
  - Account 2: Patient
- ✅ Patient registered
- ✅ Doctor assigned
- ✅ Treatment plan created
- ✅ AI analysis working

---

## 🎯 Quick Demo Flow

For judges/stakeholders:

1. **Show Patient Dashboard** (30 sec)
   - Registered medical info
   - Note: No treatment plan visible

2. **Show Doctor Dashboard** (60 sec)
   - Patient list
   - View patient details
   - Treatment plan creation

3. **Show Advisor Dashboard** (90 sec)
   - Role assignment
   - Doctor-patient assignment
   - Full data access
   - **AI ANALYSIS** ⭐ (the wow moment!)

---

## 🚨 If Something Goes Wrong

### Quick Fixes:

**Contract errors:**
```powershell
cd contracts
npx hardhat clean
# Restart Hardhat node and redeploy
```

**MetaMask issues:**
```
Settings > Advanced > Reset Account
```

**Port conflicts:**
```powershell
# Frontend (3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Backend (5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Blockchain (8545)
netstat -ano | findstr :8545
taskkill /PID <PID> /F
```

**Full reset:**
```powershell
# Stop all terminals (Ctrl+C)
# Delete node_modules in all folders
cd contracts; Remove-Item -Recurse -Force node_modules; npm install
cd ../server; Remove-Item -Recurse -Force node_modules; npm install
cd ../frontend; Remove-Item -Recurse -Force node_modules; npm install
# Start over from Step 3
```

---

## 📚 Next Steps

- Read `README.md` for detailed documentation
- Check `OVERVIEW.md` for architecture details
- Review `TROUBLESHOOTING.md` if you hit issues
- Study `DEMO_GUIDE.md` for presentation tips

---

## 🎉 That's It!

You now have a fully functional healthcare DApp with:
- ✨ Blockchain-based role management
- 🤖 AI-powered treatment validation
- 🔒 Privacy-preserving access control
- 💼 Complete patient-doctor-advisor workflow

**Happy hacking! 🚀**
