// client/src/components/UploadRecord.js
import React, { useState } from "react";
import CryptoJS from "crypto-js";
import Web3 from "web3";
import contractJSON from "../contracts/HealthcareData.json";

// 🔐 Your Pinata JWT
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

// 🧑‍⚕️ Set this to the PATIENT MetaMask address
const PATIENT_ADDRESS = process.env.REACT_APP_PATIENT_ADDRESS;

// allowed mime types
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "text/plain",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadRecord() {
  const [file, setFile] = useState(null);
  const [aesKey, setAesKey] = useState("");
  const [recordId, setRecordId] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Generate random AES key
  function genAESKey() {
    return CryptoJS.lib.WordArray.random(16).toString();
  }

  const handleUpload = async () => {
    // === File validation section ===
    if (!file) {
      alert("Please select a file.");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only PDF, JPG, PNG, and TXT files are supported!");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("File is too large! Max 10MB allowed.");
      return;
    }
    // ================================

    try {
      //
      // 1) Check MetaMask & connected account
      //
      if (!window.ethereum) {
        alert("MetaMask not found. Please install it.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];

      // 🔒 Allow only the patient to upload
      if (from.toLowerCase() !== PATIENT_ADDRESS.toLowerCase()) {
        alert(
          "Only the patient is allowed to upload records.\n" +
            "Please switch MetaMask to the patient account."
        );
        return;
      }

      //
      // 2) Read file & encrypt with AES
      //
      const buffer = await file.arrayBuffer();
      const key = genAESKey();
      setAesKey(key);

      const wordArray = CryptoJS.lib.WordArray.create(buffer);
      const base64 = CryptoJS.enc.Base64.stringify(wordArray);
      const encrypted = CryptoJS.AES.encrypt(base64, key).toString();

      // 👉 Build the exact payload that will be stored on IPFS
      const payload = {
        encrypted,
        fileName: file.name,
      };

      // Stringify once and hash the whole JSON payload
      const payloadString = JSON.stringify(payload);
      const cHash = web3.utils.keccak256(payloadString);

      //
      // 3) Upload encrypted data JSON to Pinata
      //
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: JSON.stringify({
            pinataContent: payload, // same object we hashed above
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Pinata error:", res.status, text);
        alert(`Error uploading to Pinata: ${res.status}`);
        return;
      }

      const data = await res.json();
      const cid = data.IpfsHash;
      console.log("Pinned CID:", cid);

      //
      // 4) Write CID & hash to blockchain via HealthcareData.uploadRecord
      //
      const networkId = await web3.eth.net.getId();
      const deployed = contractJSON.networks[networkId];
      if (!deployed) {
        alert(
          "HealthcareData contract is not deployed on this network.\n" +
            "Make sure Ganache is running and you ran `truffle migrate --reset`."
        );
        return;
      }

      const contract = new web3.eth.Contract(
        contractJSON.abi,
        deployed.address
      );

      const tx = await contract.methods
        .uploadRecord(cid.toString(), cHash) // function must accept (string cid, bytes32 cHash)
        .send({ from });

      console.log("Tx receipt:", tx);

      // Read latest recordCount as Record ID
      const newRecordId = await contract.methods.recordCount().call();
      setRecordId(newRecordId);

      alert(
        `File uploaded!\n` +
          `Record ID: ${newRecordId}\n` +
          `AES Key (share with doctor): ${key}`
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during upload. Check the console for details.");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Patient: Upload & Encrypt Record</h5>

      <input
        type="file"
        onChange={onFileChange}
        className="form-control mb-1"
      />

      {/* 👇 This is the visible text you wanted */}
      <div style={{ fontSize: "12px", color: "#777", marginBottom: "8px" }}>
        Supported files: <strong>.pdf, .jpg, .jpeg, .png, .txt</strong> (Max 10MB)
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        Encrypt &amp; Upload
      </button>

      {aesKey && (
        <div className="mt-3 alert alert-info">
          <strong>AES Key (copy &amp; share securely):</strong>
          <div style={{ wordBreak: "break-all" }}>{aesKey}</div>
        </div>
      )}

      {recordId && (
        <div className="mt-2">
          <strong>Record ID:</strong> {recordId}
        </div>
      )}
    </div>
  );
}
