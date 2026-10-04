// client/src/components/Authorize.js
import React, { useState } from "react";
import Web3 from "web3";
import nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util";
import contractJSON from "../contracts/HealthcareData.json";

// =======================
//  CONFIG: Pinata JWT
// =======================
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

// ==========================================================
//  Helper: Encrypt AES key for MetaMask (doctor public key)
//  Produces a Base64-encoded JSON envelope compatible with
//  MetaMask `eth_decrypt` (x25519-xsalsa20-poly1305).
//  Inputs:  doctorPubKeyBase64 (string), plaintext (string)
// ==========================================================
function encryptForMetaMask(doctorPubKeyBase64, plaintext) {
  // Decode doctor's base64 pubkey -> Uint8Array (32 bytes)
  const theirPublicKey = naclUtil.decodeBase64(doctorPubKeyBase64);

  // Generate ephemeral key pair
  const ephem = nacl.box.keyPair();

  // Nonce: 24 random bytes
  const nonce = nacl.randomBytes(24);

  // Convert plaintext -> Uint8Array
  const msgUint8 = naclUtil.decodeUTF8(plaintext);

  // Encrypt with nacl.box (x25519-xsalsa20-poly1305)
  const cipher = nacl.box(msgUint8, nonce, theirPublicKey, ephem.secretKey);

  // Build MetaMask-compatible envelope
 const envelope = {
    version: "x25519-xsalsa20-poly1305",
    nonce: naclUtil.encodeBase64(nonce),
    ephemPublicKey: naclUtil.encodeBase64(ephem.publicKey),
    ciphertext: naclUtil.encodeBase64(cipher),
  };

  // 🔴 IMPORTANT: MetaMask eth_decrypt expects the *JSON string* of this envelope,
  // not a base64 wrapper.
  const json = JSON.stringify(envelope);
  return json;          // <-- return plain JSON string
}

export default function Authorize() {
  const [recordId, setRecordId] = useState("");
  const [doctorAddr, setDoctorAddr] = useState("");
  const [aesKey, setAesKey] = useState("");
  const [doctorPubKeyB64, setDoctorPubKeyB64] = useState("");
  const [busy, setBusy] = useState(false);

  const handleAuthorize = async () => {
    try {
      if (!recordId || !doctorAddr || !aesKey || !doctorPubKeyB64) {
        alert("Please fill in Record ID, Doctor Address, AES Key, and Doctor Public Key (Base64).");
        return;
      }

      if (!window.ethereum) {
        alert("MetaMask is required.");
        return;
      }

      setBusy(true);

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const [from] = await web3.eth.getAccounts();

      // Attach to deployed contract
      const networkId = await web3.eth.net.getId();
      const deployed = contractJSON.networks[networkId];
      if (!deployed) {
        alert("HealthcareData contract is not deployed on this network.");
        setBusy(false);
        return;
      }
      const contract = new web3.eth.Contract(contractJSON.abi, deployed.address);
      const id = Number(recordId);
      // 1) Build MetaMask-compatible envelope for AES key
      const envelopeJson = encryptForMetaMask(
  doctorPubKeyB64.trim(),
  aesKey.trim()
);


      // 2) Pin the wrapped envelope to Pinata (so doctor can fetch)
      const pinRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${PINATA_JWT}`,
  },
  body: JSON.stringify({
    pinataContent: {
      enc: envelopeJson,         // JSON string, not base64
      wrappedFor: doctorAddr.trim(),
      recordId: recordId,
    },
    pinataMetadata: {
      name: `wrapped-key-record-${recordId}`,
    },
  }),
});


      if (!pinRes.ok) {
        const t = await pinRes.text();
        console.error("Pinata error:", t);
        alert("Failed to upload wrapped key to Pinata.");
        setBusy(false);
        return;
      }

      const pinData = await pinRes.json();
      const wrappedCid = pinData.IpfsHash;
      console.log("Wrapped key CID:", wrappedCid);

      // 3) Store the wrapped key CID on-chain
      //    Choose the function that exists in your contract.
      //    If you have `authorize(recordId, doctor, wrappedCid)` use that:
      // await contract.methods
      //   .authorize(recordId, doctorAddr.trim(), wrappedCid)
      //   .send({ from });

      //    Or if your contract uses a simpler setter (as used in your ViewRecord.js):
      await contract.methods
  .authorize(id, doctorAddr, wrappedCid)
  .send({ from });


      alert("Doctor authorized and wrapped key uploaded!");
    } catch (err) {
      console.error(err);
      alert("Authorization failed. Check console for details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-3">
      <h5>Patient: Authorize Doctor</h5>

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
          placeholder="Doctor Ethereum Address (0x...)"
          value={doctorAddr}
          onChange={(e) => setDoctorAddr(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <input
          className="form-control"
          placeholder="AES Key (from upload)"
          value={aesKey}
          onChange={(e) => setAesKey(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <textarea
          className="form-control"
          rows={3}
          placeholder="Doctor Public Key (Base64) — doctor gets this from Doctor tab using 'Get My Encryption Public Key'"
          value={doctorPubKeyB64}
          onChange={(e) => setDoctorPubKeyB64(e.target.value)}
        />
      </div>

      <button
        className="btn btn-warning w-100"
        onClick={handleAuthorize}
        disabled={busy}
      >
        {busy ? "Authorizing..." : "Authorize Doctor"}
      </button>
    </div>
  );
}
