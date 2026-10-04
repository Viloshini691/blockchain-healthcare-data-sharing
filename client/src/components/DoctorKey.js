import React, { useState } from "react";

export default function DoctorKey() {
  const [pubKey, setPubKey] = useState("");

  const getMyPublicKey = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask required");
      const [acct] = await window.ethereum.request({ method: "eth_requestAccounts" });
      // This opens a MetaMask prompt; doctor approves to reveal encryption public key
      const key = await window.ethereum.request({
        method: "eth_getEncryptionPublicKey",
        params: [acct],
      });
      setPubKey(key);
    } catch (err) {
      console.error(err);
      alert("Failed to get public key from MetaMask (ensure MetaMask supports eth_getEncryptionPublicKey).");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h5>Doctor: Export Encryption Public Key</h5>
      <button className="btn btn-outline-primary mb-2" onClick={getMyPublicKey}>
        Get My Encryption Public Key
      </button>
      {pubKey && (
        <>
          <div className="small">Share this base64 public key with the patient:</div>
          <textarea className="form-control" rows={3} readOnly value={pubKey} onFocus={(e)=>e.target.select()} />
        </>
      )}
    </div>
  );
}
