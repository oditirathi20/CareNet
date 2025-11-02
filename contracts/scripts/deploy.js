const hre = require("hardhat");

async function main() {
  console.log("Deploying HealthcareRegistry contract...");

  const HealthcareRegistry = await hre.ethers.getContractFactory("HealthcareRegistry");
  const healthcareRegistry = await HealthcareRegistry.deploy();

  await healthcareRegistry.waitForDeployment();
  const address = await healthcareRegistry.getAddress();

  console.log("HealthcareRegistry deployed to:", address);
  
  // Save the contract address for frontend use
  const fs = require('fs');
  const contractsDir = __dirname + "/../../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ HealthcareRegistry: address }, undefined, 2)
  );

  // Copy ABI to frontend
  const HealthcareRegistryArtifact = await hre.artifacts.readArtifact("HealthcareRegistry");

  fs.writeFileSync(
    contractsDir + "/HealthcareRegistry.json",
    JSON.stringify(HealthcareRegistryArtifact, null, 2)
  );

  console.log("Contract address and ABI saved to frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
