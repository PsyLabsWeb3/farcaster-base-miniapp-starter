// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Guestbook {
    // Event emitted when a new signature is added
    event NewSignature(address indexed signer, string message, uint256 timestamp);

    struct Entry {
        address signer;
        string message;
        uint256 timestamp;
    }

    // Array to store all guestbook entries
    Entry[] public entries;

    // Function to sign the guestbook
    function signBook(string memory _message) public {
        // Basic validation: message cannot be empty
        require(bytes(_message).length > 0, "Message cannot be empty");
        
        // Create the entry
        Entry memory newEntry = Entry({
            signer: msg.sender,
            message: _message,
            timestamp: block.timestamp
        });

        // Add to storage
        entries.push(newEntry);

        // Emit event for frontend updates
        emit NewSignature(msg.sender, _message, block.timestamp);
    }

    // Function to get the total number of signatures
    function getTotalSignatures() public view returns (uint256) {
        return entries.length;
    }

    // Function to get the last N signatures (pagination helper)
    function getLastSignatures(uint256 _limit) public view returns (Entry[] memory) {
        uint256 total = entries.length;
        if (total == 0) {
            return new Entry[](0);
        }

        uint256 count = _limit;
        if (count > total) {
            count = total;
        }

        Entry[] memory lastEntries = new Entry[](count);
        for (uint256 i = 0; i < count; i++) {
            lastEntries[i] = entries[total - 1 - i];
        }

        return lastEntries;
    }
}
