# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Contract Deployment Issues

#### Error: "Cannot find module 'hardhat'"
**Solution:**
```powershell
cd contracts
npm install
```

#### Error: "Error HH108: Cannot connect to the network localhost"
**Solution:**
1. Make sure Hardhat node is running:
```powershell
cd contracts
npx hardhat node
```
2. Keep this terminal open
3. Deploy in a NEW terminal:
```powershell
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

#### Error: Contract deployment succeeds but frontend can't find contract
**Solution:**
1. Check that `frontend/src/contracts/` directory was created
2. Verify files exist:
   - `frontend/src/contracts/contract-address.json`
   - `frontend/src/contracts/HealthcareRegistry.json`
3. If missing, re-run deployment script

---

### 🔴 MetaMask Issues

#### MetaMask not connecting
**Solution:**
1. Open MetaMask
2. Go to Settings > Advanced > Reset Account
3. Try connecting again

#### Wrong network selected
**Solution:**
1. Click network dropdown in MetaMask
2. Select "Localhost 8545"
3. If not available, add it:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

#### "Nonce too high" error
**Solution:**
1. MetaMask > Settings > Advanced > Reset Account
2. This resets transaction history
3. Try transaction again

#### Insufficient funds for gas
**Solution:**
1. Make sure you're using a Hardhat test account
2. These accounts have 10,000 ETH by default
3. If using a custom account, it won't have funds

---

### 🔴 Frontend Issues

#### Error: "Cannot find module 'react-router-dom'"
**Solution:**
```powershell
cd frontend
npm install
```

#### Frontend shows "No Role Assigned"
**Solution:**
1. You need to assign a role first
2. Connect with the FIRST account (contract deployer = advisor automatically)
3. Use the Advisor dashboard to assign roles to other addresses

#### Cannot read properties of undefined (reading 'getMyRole')
**Solution:**
1. Contract not initialized properly
2. Make sure:
   - Hardhat node is running
   - Contract is deployed
   - Contract artifacts exist in `frontend/src/contracts/`
   - MetaMask is connected to correct network

#### Page blank or white screen
**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Common fixes:
   - Clear browser cache
   - Restart React dev server
   - Check all dependencies installed

---

### 🔴 AI Backend Issues

#### Error: "OPENAI_API_KEY not set"
**Solution:**
1. Create `server/.env` file:
```powershell
cd server
copy .env.example .env
```
2. Edit `.env` and add your actual API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
```
3. Restart server

#### Error: "Failed to fetch" when clicking Analyze button
**Solution:**
1. Check backend is running on port 5000
2. Open http://localhost:5000/api/health in browser
3. Should see: `{"status":"OK",...}`
4. If not, restart backend:
```powershell
cd server
npm start
```

#### CORS error in browser console
**Solution:**
1. Backend should already have CORS enabled
2. If issue persists, check `server/index.js`:
```javascript
app.use(cors());
```
3. Restart backend server

#### AI analysis takes too long
**Solution:**
1. Normal - OpenAI API can take 10-30 seconds
2. Check network connectivity
3. Try using GPT-3.5 instead of GPT-4 (faster):
   - In `server/index.js`, change model to `'gpt-3.5-turbo'`

---

### 🔴 Role & Access Issues

#### "Unauthorized: Incorrect role" error
**Solution:**
1. Check your current role:
   - Patient = 1
   - Doctor = 2
   - Loop Advisor = 3
2. Only Loop Advisor can assign roles
3. First deployed account is automatically advisor

#### Doctor can't see patients
**Solution:**
1. Patients must be ASSIGNED to doctor first
2. Use Loop Advisor account
3. Go to "Assign Doctor to Patient" form
4. Enter doctor address and patient address
5. Submit transaction

#### Patient can't register data
**Solution:**
1. Make sure account has "Patient" role (role = 1)
2. Only Loop Advisor can assign roles
3. Fill all required fields in registration form

---

### 🔴 Transaction Issues

#### Transaction stuck as "Pending"
**Solution:**
1. Wait 10-15 seconds (Hardhat needs time)
2. If still stuck, check Hardhat node terminal for errors
3. Try resetting MetaMask account

#### "Transaction reverted" error
**Solution:**
1. Check browser console for specific error
2. Common causes:
   - Trying to access data without permission
   - Patient data doesn't exist
   - Doctor not assigned to patient
   - Insufficient gas (shouldn't happen on local)

#### Gas estimation failed
**Solution:**
1. The transaction will likely fail
2. Check:
   - Correct role for the action
   - All prerequisites met (e.g., patient registered)
   - Smart contract function exists

---

### 🔴 Development Issues

#### Changes not reflecting in frontend
**Solution:**
1. Hard refresh browser (Ctrl + Shift + R)
2. Clear browser cache
3. Restart React dev server

#### Changes to contract not working
**Solution:**
1. After changing contract:
```powershell
cd contracts
npx hardhat clean
```
2. Stop Hardhat node (Ctrl+C)
3. Restart Hardhat node
4. Redeploy contract
5. Restart frontend
6. Reset MetaMask accounts

#### Port already in use
**Solution:**

For React (port 3000):
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

For Backend (port 5000):
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

For Hardhat (port 8545):
```powershell
netstat -ano | findstr :8545
taskkill /PID <PID> /F
```

---

### 🔴 Data Issues

#### Patient list empty in Doctor/Advisor dashboard
**Solution:**

For Doctors:
- No patients assigned yet
- Loop Advisor must assign patients

For Advisors:
- Need to manually add patient addresses
- Use the "Add patient address" input
- Paste patient wallet address

#### Treatment plan not showing
**Solution:**
1. Check if doctor has created treatment plan
2. Doctor must be assigned to patient first
3. Treatment plan must be submitted via doctor dashboard

---

### 🟡 Performance Issues

#### Frontend slow to load
**Solution:**
1. Blockchain calls can be slow
2. Add loading indicators (already implemented)
3. Consider caching frequently accessed data

#### Too many transactions failing
**Solution:**
1. Check Hardhat node console for errors
2. Restart Hardhat node if it's been running long
3. Reset MetaMask accounts

---

## 🆘 Emergency Reset

If nothing works, try this complete reset:

```powershell
# 1. Stop all running processes
# Press Ctrl+C in all terminals

# 2. Clean contract artifacts
cd contracts
npx hardhat clean
Remove-Item -Recurse -Force node_modules, cache, artifacts -ErrorAction SilentlyContinue

# 3. Clean frontend
cd ../frontend
Remove-Item -Recurse -Force node_modules, build, src/contracts -ErrorAction SilentlyContinue

# 4. Clean backend
cd ../server
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# 5. Reinstall everything
cd ../contracts
npm install

cd ../server
npm install

cd ../frontend
npm install

# 6. Restart services
cd ../contracts
npx hardhat node
# (In new terminal)
npx hardhat run scripts/deploy.js --network localhost

# (In new terminal)
cd ../server
npm start

# (In new terminal)
cd ../frontend
npm start

# 7. Reset MetaMask
# Settings > Advanced > Reset Account (for each account)
```

---

## 📞 Still Stuck?

### Check These Files:
1. `README.md` - Setup instructions
2. `OVERVIEW.md` - Architecture details
3. Browser console (F12) - Error messages
4. Hardhat node terminal - Contract errors
5. Backend terminal - API errors

### Debugging Checklist:
- [ ] Hardhat node running?
- [ ] Contract deployed successfully?
- [ ] Contract artifacts in `frontend/src/contracts/`?
- [ ] MetaMask on localhost:8545 network?
- [ ] MetaMask account imported from Hardhat?
- [ ] Backend server running on port 5000?
- [ ] OPENAI_API_KEY set in `server/.env`?
- [ ] All npm dependencies installed?
- [ ] Browser console showing errors?

### Quick Test Commands:

Test backend:
```powershell
curl http://localhost:5000/api/health
```

Test Hardhat node:
```powershell
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545
```

---

**Good luck! You've got this! 🚀**
