# ⛓️ Blockchain-Based Secure Healthcare Data Sharing Platform

A secure healthcare data-sharing platform that combines **Blockchain, Smart Contracts, IPFS, AES Encryption, MetaMask, and Role-Based Access Control (RBAC)** to protect sensitive healthcare records.

This project was developed as a Final Year Project to demonstrate how decentralized technologies can improve the **confidentiality, integrity, access control, and traceability** of healthcare data.

---

## 📌 Project Overview

Traditional healthcare data-sharing systems often depend on centralized databases, which may create risks such as:

- Unauthorized access
- Data tampering
- Single points of failure
- Limited transparency
- Weak auditability

This project provides a decentralized approach where:

- Medical files are encrypted before being uploaded.
- Encrypted files are stored using IPFS.
- Blockchain stores the file reference and access-control information.
- Smart contracts control who can access records.
- MetaMask is used for blockchain account interaction.
- Patients control which doctors can access their records.
- Blockchain events provide an immutable record of important activities.

---

## 🎯 Project Objectives

The main objectives of the project are:

1. To provide secure healthcare data sharing using blockchain technology.
2. To protect medical records using client-side encryption.
3. To implement role-based access control for administrators, patients, and doctors.
4. To store encrypted healthcare files using decentralized storage.
5. To provide transparent and tamper-resistant access records.

---

## 🚀 Key Features

- Blockchain-based healthcare record management
- Ethereum smart contracts
- MetaMask wallet integration
- Role-Based Access Control
- Admin, Patient, and Doctor roles
- AES file encryption
- IPFS decentralized file storage
- Pinata integration
- Patient-controlled doctor authorization
- Secure record retrieval
- Immutable blockchain records
- Web3 integration
- React-based user interface

---

## 👥 User Roles

### 👨‍💼 Admin

The administrator manages user roles within the system.

Responsibilities include:

- Assigning blockchain users their system roles
- Registering patients
- Registering doctors
- Managing role assignments

---

### 👤 Patient

Patients maintain control over their own healthcare records.

Patients can:

- Upload healthcare records
- Encrypt files before storage
- Store encrypted files on IPFS
- Store IPFS references on blockchain
- View their records
- Grant doctors access to selected records

---

### 🩺 Doctor

Doctors can access healthcare information only when permission has been granted by a patient.

Doctors can:

- Connect using MetaMask
- View records they are authorized to access
- Retrieve the encrypted record from IPFS
- Decrypt authorized records using the required key

Doctors cannot automatically access every patient's data.

---

## 🏗️ System Architecture

```text
                     ┌─────────────────────┐
                     │        USER         │
                     │ Admin/Patient/Doctor│
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   React Frontend    │
                     └──────────┬──────────┘
                                │
                       Web3 / MetaMask
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
     ┌─────────────────────┐        ┌──────────────────────┐
     │ Ethereum Blockchain │        │        IPFS          │
     │                     │        │      / Pinata        │
     │ HealthcareData.sol  │        │                      │
     │                     │        │ Encrypted Healthcare │
     │ • Roles             │        │       Records        │
     │ • Record Metadata   │        └──────────────────────┘
     │ • Authorization     │
     │ • Audit Events      │
     └─────────────────────┘

🔐 Security Architecture
The project combines several security mechanisms.
1. AES Encryption
Healthcare files are encrypted on the client side before they are uploaded.
Original Medical File
        ↓
   AES Encryption
        ↓
Encrypted Medical File
        ↓
      IPFS

The blockchain does not directly store the medical document itself.
2. Decentralized Storage
Encrypted records are stored using IPFS.
After the file is uploaded, IPFS generates a unique content identifier:
CID

The CID is then referenced by the smart contract.
This avoids storing large medical files directly on the blockchain.
3. Blockchain Integrity
The blockchain provides a tamper-resistant ledger for healthcare record references and authorization information.
Blockchain technology helps protect:
- Record integrity
- Access authorization
- Data references
- Transaction history
4. Role-Based Access Control
The smart contract uses roles to restrict user capabilities.
Example role structure:
ADMIN   = 1
PATIENT = 2
DOCTOR  = 3

Each user can perform only the functions permitted by their assigned role.
5. MetaMask Authentication
Users connect their Ethereum wallet using MetaMask.
Their blockchain wallet address acts as their identity when interacting with the smart contract.

🔄 Healthcare Record Workflow
Patient Selects Medical File
            ↓
      Generate AES Key
            ↓
        Encrypt File
            ↓
 Upload Encrypted File to IPFS
            ↓
       Receive IPFS CID
            ↓
 Store CID in Smart Contract
            ↓
       Record ID Generated
            ↓
Patient Grants Doctor Access
            ↓
Doctor Requests Authorized Record
            ↓
Smart Contract Checks Permission
            ↓
Retrieve Encrypted File from IPFS
            ↓
       AES Decryption
            ↓
      Medical File Viewed

📜 Smart Contract
The main smart contract is:
contracts/HealthcareData.sol

Important functionality includes healthcare record management and user authorization.
Example core operations include:
uploadRecord()
authorizeUser()
getRecordHash()
setUserRole()

These functions allow the blockchain to manage:
- User roles
- Healthcare records
- Patient authorization
- Record retrieval permissions

📁 Project Structure
healthcare-blockchain/
│
├── contracts/
│   ├── HealthcareData.sol
│   └── TestSimple.sol
│
├── migrations/
│   ├── 2_deploy_healthcare.js
│   └── 3_deploy_test_simple.js
│
├── build/
│   └── contracts/
│
├── client/
│   │
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Authorize.js
│   │   │   ├── DoctorKey.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── UploadRecord.js
│   │   │   └── ViewRecord.js
│   │   │
│   │   ├── contracts/
│   │   │   └── HealthcareData.json
│   │   │
│   │   ├── App.js
│   │   ├── MainApp.js
│   │   └── hospital-theme.css
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── config-overrides.js
│
├── test/
├── truffle-config.js
├── .gitignore
└── README.md

🛠️ Technologies Used
Blockchain
- Ethereum
- Solidity
- Truffle
- Ganache
- Web3.js
- MetaMask
Frontend
- React.js
- JavaScript
- HTML
- CSS
Security
- AES Encryption
- Role-Based Access Control
- Blockchain-based authorization
Storage
- IPFS
- Pinata
Development Tools
- Visual Studio Code
- Git
- GitHub
⚙️ Prerequisites
Before running the project, install:
- Node.js
- npm
- Truffle
- Ganache
- MetaMask
- Git
You will also need a Pinata account for IPFS file storage.

▶️ Installation
Clone the repository:
git clone https://github.com/YOUR-USERNAME/blockchain-healthcare-data-sharing.git

Enter the project folder:
cd blockchain-healthcare-data-sharing

📦 Install Blockchain Dependencies
Install Truffle if necessary:
npm install -g truffle

Start Ganache and ensure the blockchain RPC is available.
Example local configuration:
RPC URL:
http://127.0.0.1:7545

Chain ID:
1337

Compile the smart contracts:
truffle compile

Deploy them:
truffle migrate --reset

💻 Install Frontend Dependencies
Move to the client folder:
cd client

Install dependencies:
npm install

🔑 Environment Configuration
Create a .env file inside:
client/

Use .env.example as the template.
Example:
REACT_APP_PINATA_JWT=your_pinata_jwt_here

Do not upload your real .env file or API credentials to GitHub.

🌐 Run the Application
Inside the client folder:
npm start

The React application will normally open at:
http://localhost:3000

🦊 MetaMask Setup
Connect MetaMask to your local Ganache blockchain.
Example configuration:
Network Name:
Ganache Local

RPC URL:
http://127.0.0.1:7545

Chain ID:
1337

Import one or more Ganache accounts into MetaMask for testing.

🧪 Example System Flow
Patient
Connect MetaMask
      ↓
Login as Patient
      ↓
Select Healthcare File
      ↓
Encrypt Record
      ↓
Upload to IPFS
      ↓
Save CID to Blockchain
      ↓
Receive Record ID
      ↓
Grant Doctor Permission

Doctor
Connect MetaMask
      ↓
Login as Doctor
      ↓
Enter Authorized Record ID
      ↓
Smart Contract Checks Access
      ↓
Retrieve IPFS CID
      ↓
Download Encrypted Record
      ↓
Decrypt Record

🔒 Security Considerations
The application demonstrates several security principles:
- Sensitive files are encrypted before being uploaded.
- Healthcare files are not directly stored on blockchain.
- Blockchain provides tamper resistance for record references.
- Smart contracts enforce access permissions.
- Patients control doctor authorization.
- Wallet addresses are used for blockchain identity.
- Secret API credentials are excluded from the repository.

⚠️ Important Security Notice
This project is an educational prototype and should not be used directly in a real healthcare environment without additional security controls.
A production deployment should include:
- Secure secret-management infrastructure
- HTTPS/TLS
- Strong identity verification
- Multi-factor authentication
- Smart-contract security auditing
- Secure key management
- Production blockchain infrastructure
- Healthcare regulatory compliance
- Backend access controls
- IPFS privacy controls
- Comprehensive penetration testing

🚧 Project Scope
This project focuses on demonstrating:
- Blockchain-based record integrity
- Secure data sharing
- Role-based authorization
- Client-side encryption
- Decentralized storage
- Blockchain auditability
The project does not currently include direct integration with hospital databases or emergency access mechanisms.

📚 Skills Demonstrated
- Blockchain development
- Solidity smart contracts
- Ethereum
- React development
- Web3 integration
- MetaMask integration
- IPFS
- AES encryption
- Role-Based Access Control
- Secure data sharing
- Smart contract deployment
- Decentralized application development
- Cybersecurity fundamentals
- Git and GitHub

👩‍💻 Author
Viloshini Peragasam
AI & Cybersecurity Student