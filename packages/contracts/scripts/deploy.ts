import { ethers } from "hardhat";

async function main() {
  const Guestbook = await ethers.getContractFactory("Guestbook");
  const guestbook = await Guestbook.deploy();

  await guestbook.waitForDeployment();

  console.log(`Guestbook deployed to ${await guestbook.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
