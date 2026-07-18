# 🛡️ JS Guard: AI Security Auditor

JS Guard is a hyper-critical, AI-powered static analysis tool designed to scan JavaScript code, Express routes, and MongoDB schemas for critical architectural flaws. Built for developers who want to catch vulnerabilities before code hits production, JS Guard detects issues like Remote Code Execution (RCE), NoSQL Injections, Broken Object-Level Authorization (BOLA), and hardcoded secrets, offering real-time side-by-side secure code remediation.

Built as a submission for the **NamasteDev Hackathon**.

---

## 🚀 Features

*   🤖 **AI-Driven Static Analysis**: Leverages OpenAI's GPT-4o architecture to act as a paranoid, zero-tolerance Application Security Engineer.
*   ⚡ **Real-Time Diagnostics**: Instantly flags code vulnerabilities with specific flaw names, detailed explanations, and risk severity (High/Medium/Low).
*   📋 **One-Click Remediation**: Provides fully rewritten, production-ready secure code snippets with an integrated copy-to-clipboard button.
*   🎨 **Modern Interface**: Designed with a sleek, responsive dark-mode layout powered by the brand-new Tailwind CSS v4 engine.

---

## 🛠️ Tech Stack

### Frontend
*   **React** (Vite framework)
*   **Tailwind CSS v4** (Utility-first styling)
*   **Lucide React** (Modern, lightweight iconography)

### Backend
*   **Node.js & Express** (Server architecture)
*   **OpenAI SDK** (AI orchestration via GitHub Models Inference Engine)
*   **Dotenv** (Environment variable management)

---

## ⚙️ Architecture & Hackathon Compliance

To comply with the official hackathon criteria of utilizing OpenAI tech while maintaining a zero-cost development workflow, this application routes its OpenAI SDK requests through the **GitHub Models Free Inference Tier**. 

By redirecting the SDK client base URL to `https://models.github.ai/inference`, the application harnesses production-grade GPT-4o models entirely through a standard GitHub Personal Access Token, completely bypassing OpenAI API quota restrictions.

---

## 💻 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   A GitHub Personal Access Token (Classic) with standard read access.

### 1. Repository Setup
Clone the repository and navigate into the root directory:
```bash
git clone https://github.com/YOUR_USERNAME/js-security-auditor.git
cd js-security-auditor
```

### 2. Backend Configuration
Navigate to the backend directory, install dependencies, and configure environment variables:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
OPENAI_API_KEY=ghp_YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

Start the backend server:
```bash
node server.js
```
*The terminal should display: `Server running on port 5000`*

### 3. Frontend Configuration
Open a second terminal window, navigate to the frontend directory, install dependencies, and launch the development server:
```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:5173/` to launch the application interface.

---

## 🛡️ Sample Vulnerability Tests

To test the system's response handling, try pasting this high-severity Remote Code Execution (RCE) snippet into the auditor:

```javascript
app.get('/run-calculation', (req, res) => {
  const userInput = req.query.expression;
  
  // DANGEROUS: Arbitrary execution of untrusted user input
  const result = eval(userInput); 
  
  db.collection('logs').find({ query: "SELECT * FROM logs WHERE input = '" + userInput + "'" });
  res.send("Result: " + result);
});
```

---

## 📄 License
This project is open-source and available under the MIT License.
