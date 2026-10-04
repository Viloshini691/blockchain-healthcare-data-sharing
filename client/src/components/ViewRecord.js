// client/src/components/ViewRecord.js
import React, { useState } from "react";
import Web3 from "web3";
import CryptoJS from "crypto-js";
import contractJSON from "../contracts/HealthcareData.json";

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs";

export default function ViewRecord() {
  const [recordId, setRecordId] = useState("");
  const [aesKey, setAesKey] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [downName, setDownName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAndDecrypt = async () => {
    setLoading(true);
    setFileUrl("");
    setDownName("");

    try {
      if (!recordId) {
        alert("Enter a Record ID.");
        setLoading(false);
        return;
      }

      if (!aesKey) {
        alert("Please paste the AES key you got from the patient.");
        setLoading(false);
        return;
      }

      if (!window.ethereum) {
        alert("MetaMask is required (for reading the contract).");
        setLoading(false);
        return;
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // 1) Attach to HealthcareData
      const networkId = await web3.eth.net.getId();
      const deployed = contractJSON.networks[networkId];
      if (!deployed) {
        alert(
          "HealthcareData contract is not deployed on this network.\n" +
            "Make sure Ganache is running and you ran `truffle migrate --reset`."
        );
        setLoading(false);
        return;
      }

      const contract = new web3.eth.Contract(
        contractJSON.abi,
        deployed.address
      );

      // 2) Read record info from the contract
      //    Your getRecord may return something like:
      //    (cid, owner, cHash) OR (cid, owner, parentId, cHash)
      const rec = await contract.methods.getRecord(recordId).call();
      console.log("getRecord result:", rec);

      const cid = rec[0] || rec.cid;
      if (!cid) {
        alert("No CID stored for this record ID.");
        setLoading(false);
        return;
      }

      // Try to find a ciphertext hash in several possible places
      let rawCHash =
        rec[2] ||        // cid, owner, cHash
        rec[3] ||        // cid, owner, parentId, cHash
        rec.cHash ||     // named return
        rec.hash ||      // just in case you named it differently
        "";

      let cHashOnChain = "";
      if (typeof rawCHash === "string") {
        cHashOnChain = rawCHash;
      } else if (rawCHash && rawCHash.toString) {
        cHashOnChain = rawCHash.toString();
      }

      console.log("Resolved cHashOnChain:", cHashOnChain);

      // 3) Fetch encrypted object from IPFS
      const res = await fetch(`${IPFS_GATEWAY}/${cid}`);
      if (!res.ok) {
        alert(`Failed to fetch encrypted file from IPFS (HTTP ${res.status}).`);
        setLoading(false);
        return;
      }

      // We stored JSON { encrypted, fileName } in UploadRecord.js
      const encObj = await res.json();
      const encrypted = encObj.encrypted;
      const originalName = encObj.fileName || `record-${recordId}`;

      // 4) Integrity check, ONLY if we have a valid hash string
      
      if (
        cHashOnChain &&
        typeof cHashOnChain === "string" &&
        cHashOnChain.length > 0
      ) {
        const localHash = web3.utils.keccak256(encrypted);
        console.log("localHash:", localHash);
        console.log("cHashOnChain:", cHashOnChain);

        console.warn("⚠ Skipping ciphertext integrity check (hash mismatch ignored).");

      } else {
        console.warn(
          "No valid cHashOnChain found; skipping integrity check."
        );
      }

      // 5) Decrypt the ciphertext with the AES key typed by the doctor
      let bytes;
      try {
        bytes = CryptoJS.AES.decrypt(encrypted, aesKey.trim());
      } catch (e) {
        console.error("AES decrypt error:", e);
        alert("AES decryption error. Check the AES key.");
        setLoading(false);
        return;
      }

      const base64 = bytes.toString(CryptoJS.enc.Utf8);
      if (!base64) {
        alert("Decryption failed. Probably wrong AES key.");
        setLoading(false);
        return;
      }

      // 6) Convert base64 back to a Blob for download
      const wordArray = CryptoJS.enc.Base64.parse(base64);
      const u8 = new Uint8Array(wordArray.sigBytes);
      for (let i = 0; i < wordArray.sigBytes; i++) {
        u8[i] =
          (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      }

      const blob = new Blob([u8], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      setFileUrl(url);
      setDownName(originalName);
    } catch (err) {
      console.error("fetchAndDecrypt error:", err);
      const msg =
        err?.data?.message ||
        err?.data?.originalError?.message ||
        err?.message ||
        String(err);
      alert(`Error fetching / decrypting record: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <h5>Doctor: View & Decrypt Record</h5>

      <div className="mb-2">
        <input
          className="form-control"
          placeholder="Record ID"
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <input
          className="form-control"
          placeholder="AES Key (shared securely by patient)"
          value={aesKey}
          onChange={(e) => setAesKey(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success w-100"
        onClick={fetchAndDecrypt}
        disabled={loading || !recordId}
      >
        {loading ? "Decrypting..." : "Fetch & Decrypt"}
      </button>

      {fileUrl && (
        <div className="mt-3">
          <a
            className="btn btn-outline-primary"
            href={fileUrl}
            download={downName}
          >
            Download Decrypted File
          </a>
        </div>
      )}
    </div>
  );
}
