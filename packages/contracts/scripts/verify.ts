import { run } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Verify a deployed contract on BaseScan
 *
 * Usage:
 *   npx hardhat run scripts/verify.ts --network baseSepolia
 *
 * Requirements:
 * 1. Set BASESCAN_API_KEY in your .env file
 * 2. Update CONTRACT_ADDRESS below with your deployed address
 */

const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";

async function main() {
    if (CONTRACT_ADDRESS === "0xYOUR_DEPLOYED_CONTRACT_ADDRESS") {
        console.error("Error: Please update CONTRACT_ADDRESS in scripts/verify.ts");
        process.exit(1);
    }

    console.log("Verifying contract on BaseScan...");
    console.log("Address:", CONTRACT_ADDRESS);

    try {
        await run("verify:verify", {
            address: CONTRACT_ADDRESS,
            constructorArguments: [],
        });

        console.log("Contract verified successfully!");
        console.log(`View on BaseScan: https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`);
    } catch (error: any) {
        if (error.message.includes("Already Verified")) {
            console.log("Contract is already verified.");
        } else {
            console.error("Verification failed:", error.message);
            process.exit(1);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
