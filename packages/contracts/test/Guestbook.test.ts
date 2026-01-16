import { expect } from "chai";
import { ethers } from "hardhat";

describe("Guestbook", function () {
    let guestbook: any;

    beforeEach(async function () {
        const GuestbookFactory = await ethers.getContractFactory("Guestbook");
        guestbook = await GuestbookFactory.deploy();
    });

    describe("signBook", function () {
        it("Should allow signing the guestbook with a message", async function () {
            const [signer] = await ethers.getSigners();

            await guestbook.signBook("Hello, Base!");

            const total = await guestbook.getTotalSignatures();
            expect(total).to.equal(1);

            const entries = await guestbook.getLastSignatures(1);
            expect(entries[0].signer).to.equal(signer.address);
            expect(entries[0].message).to.equal("Hello, Base!");
        });

        it("Should reject empty messages", async function () {
            await expect(guestbook.signBook("")).to.be.revertedWith("Message cannot be empty");
        });

        it("Should emit NewSignature event", async function () {
            const [signer] = await ethers.getSigners();

            // Just check event is emitted with correct signer and message
            await expect(guestbook.signBook("Test message"))
                .to.emit(guestbook, "NewSignature");

            // Verify the data is correct
            const entries = await guestbook.getLastSignatures(1);
            expect(entries[0].signer).to.equal(signer.address);
            expect(entries[0].message).to.equal("Test message");
        });

        it("Should allow multiple signatures from same address", async function () {
            await guestbook.signBook("First message");
            await guestbook.signBook("Second message");

            const total = await guestbook.getTotalSignatures();
            expect(total).to.equal(2);
        });

        it("Should allow signatures from different addresses", async function () {
            const [signer1, signer2] = await ethers.getSigners();

            await guestbook.connect(signer1).signBook("From signer 1");
            await guestbook.connect(signer2).signBook("From signer 2");

            const total = await guestbook.getTotalSignatures();
            expect(total).to.equal(2);
        });
    });

    describe("getTotalSignatures", function () {
        it("Should return 0 when no signatures exist", async function () {
            const total = await guestbook.getTotalSignatures();
            expect(total).to.equal(0);
        });

        it("Should return correct count after multiple signatures", async function () {
            await guestbook.signBook("One");
            await guestbook.signBook("Two");
            await guestbook.signBook("Three");

            const total = await guestbook.getTotalSignatures();
            expect(total).to.equal(3);
        });
    });

    describe("getLastSignatures", function () {
        it("Should return empty array when no signatures exist", async function () {
            const entries = await guestbook.getLastSignatures(10);
            expect(entries.length).to.equal(0);
        });

        it("Should return signatures in newest-first order", async function () {
            await guestbook.signBook("First");
            await guestbook.signBook("Second");
            await guestbook.signBook("Third");

            const entries = await guestbook.getLastSignatures(3);
            expect(entries[0].message).to.equal("Third");  // Newest first
            expect(entries[1].message).to.equal("Second");
            expect(entries[2].message).to.equal("First");  // Oldest last
        });

        it("Should limit results to requested count", async function () {
            await guestbook.signBook("One");
            await guestbook.signBook("Two");
            await guestbook.signBook("Three");
            await guestbook.signBook("Four");
            await guestbook.signBook("Five");

            const entries = await guestbook.getLastSignatures(3);
            expect(entries.length).to.equal(3);
            expect(entries[0].message).to.equal("Five");
        });

        it("Should return all if limit exceeds total", async function () {
            await guestbook.signBook("One");
            await guestbook.signBook("Two");

            const entries = await guestbook.getLastSignatures(100);
            expect(entries.length).to.equal(2);
        });
    });

    describe("entries", function () {
        it("Should store correct timestamp", async function () {
            await guestbook.signBook("Timestamped message");

            const entries = await guestbook.getLastSignatures(1);
            const blockTimestamp = await getBlockTimestamp();

            // Timestamp should be recent (within last few seconds)
            expect(entries[0].timestamp).to.be.closeTo(blockTimestamp, 5);
        });
    });
});

// Helper function to get current block timestamp
async function getBlockTimestamp(): Promise<bigint> {
    const block = await ethers.provider.getBlock("latest");
    return BigInt(block?.timestamp || 0);
}
