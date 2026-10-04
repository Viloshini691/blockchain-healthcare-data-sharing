// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareData {
    // ======================
    //  Record storage
    // ======================
    uint256 public recordCount;

    struct Record {
        uint256 id;        // Record ID
        string ipfsHash;   // Encrypted file CID on IPFS/Pinata
        address owner;     // Patient who uploaded
        bytes32 cHash;     // keccak256(ciphertext) for integrity
    }

    // recordId => Record
    mapping(uint256 => Record) public records;

    // recordId => doctor => wrapped AES key CID
    mapping(uint256 => mapping(address => string)) private wrappedKeys;

    // ======================
    //  Events
    // ======================
    event RecordUploaded(
        uint256 indexed recordId,
        string ipfsHash,
        address indexed owner,
        bytes32 cHash
    );

    event DoctorAuthorized(
        uint256 indexed recordId,
        address indexed doctor,
        string wrappedCid
    );

    // ======================
    //  Modifiers
    // ======================
    modifier validRecord(uint256 id) {
        require(id > 0 && id <= recordCount, "Invalid record id");
        _;
    }

    modifier onlyOwnerOf(uint256 id) {
        require(id > 0 && id <= recordCount, "Invalid record id");
        require(records[id].owner == msg.sender, "Not record owner");
        _;
    }

    // ======================
    //  Upload record
    //  (called from UploadRecord.js)
    // ======================
    function uploadRecord(string calldata ipfsHash, bytes32 cHash) external {
        require(bytes(ipfsHash).length > 0, "IPFS hash required");

        recordCount++;

        records[recordCount] = Record({
            id: recordCount,
            ipfsHash: ipfsHash,
            owner: msg.sender,
            cHash: cHash
        });

        emit RecordUploaded(recordCount, ipfsHash, msg.sender, cHash);
    }

    // ======================
    //  Get record
    //  (called from ViewRecord.js)
    //  Returns: (cid, owner, id, cHash)
    // ======================
    function getRecord(uint256 id)
        external
        view
        validRecord(id)
        returns (string memory, address, uint256, bytes32)
    {
        Record storage r = records[id];
        return (r.ipfsHash, r.owner, r.id, r.cHash);
    }

    // ======================
    //  Authorize doctor
    //  Saves wrapped key CID
    // ======================
    function authorize(
        uint256 id,
        address doctor,
        string calldata wrappedCid
    ) external onlyOwnerOf(id) {
        require(doctor != address(0), "Doctor address required");
        require(bytes(wrappedCid).length > 0, "Wrapped CID required");

        wrappedKeys[id][doctor] = wrappedCid;

        emit DoctorAuthorized(id, doctor, wrappedCid);
    }

    // ======================
    //  Doctor gets wrapped AES key
    // ======================
    function getWrappedKey(uint256 id)
        external
        view
        validRecord(id)
        returns (string memory)
    {
        return wrappedKeys[id][msg.sender];
    }

    // Optional log
    function ackAccess(uint256 id) external validRecord(id) {}

    // Helper
    function getRecordOwner(uint256 id)
        external
        view
        validRecord(id)
        returns (address)
    {
        return records[id].owner;
    }
}
