# 🧠 BrainRush — AI-Powered Gamified Study Platform
 Open app: https://kinemator01.github.io/BrainRush/
BrainRush is a dynamic, full-stack web application designed to optimize exam preparation. The platform allows users to upload course modules in PDF format, uses **Google Gemini** to parse the text into interactive study card datasets, and translates them into live, multi-option games and formal assessments. Data state persistence is managed entirely via a synchronized **Firebase** cloud instance.

![HTML5](https://img.shields.io/badge/Language-HTML5%20%2F%20CSS3-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/Language-JavaScript%20(ES6%2B)-yellow?style=flat-square)
![Database](https://img.shields.io/badge/Backend-Firebase%20%2F%20Firestore-orange?style=flat-square)
![AI](https://img.shields.io/badge/AI%20Core-Google%20Gemini%20API-purple?style=flat-square)

---

## 🛠️ Application Ecosystem

* **Firebase Authentication & Firestore State:** Secure login profiles linked to atomic user document schemas tracking enrolled courses, live module arrays, mock friends lists, and historical test analytics.
* **Algorithmic Gameplay Engine:** Generates multiple-choice options on the fly by shuffling a module's correct `studyCard` answer token alongside automated wrong answer arrays pulled dynamically from the relative dataset.
* **Formal Testing Simulator:** Generates a custom-scaped, variable-count linear text test that matches typed string variables against database answer keys to return an instant performance grade.

---

## 🏗️ Team Engineering Contributions

This prototype was built during a high-velocity **Google Hackathon**. As a team, we synchronized our workflows to build out the full user interface while simultaneously integrating our generative AI backend data layers.

### 🎨 1. Frontend Architecture & UI/UX Engineering
* **Fluid Layout Navigation:** Handled our single-page application (SPA) viewport transitions using clean, native DOM style display management functions instead of adding heavy routing dependencies.
* **Component-Level Motion Dynamics:** Leveraged CSS3 structural perspective matrices to engineer responsive 3D flip-cards (`preserve-3d` / `backface-visibility`), complete with multi-phase animation decay timers (`jello-horizontal`) for dynamic user engagement.
* **Responsive Layouts:** Implemented automated CSS progress fills matching calculated floating-point percentages, matching them with full media query scaling boundaries to keep the UI clean across different screens.

### 🔌 2. Google Gemini API Integration & Async Processing
* Co-developed the asynchronous `fetch` pipeline targeting the `gemini-1.5-pro` model configuration payload.
* Collaborated on structural system prompting strategies to force the model into isolating raw text blocks and formatting them into clean, parsable JSON objects containing strict `question` and `answer` element string tokens.

---

## 🏁 Hackathon Post-Mortem & June Sprint Goals

> ⚠️ **Status Note:** While our core UI layout layers and state maps were fully compiled during the hackathon, we hit strict execution bottlenecks with our third-party PDF parsing pipeline (`/parse-pdf` backend connection loop), which prevented the API from running seamlessly before the submission timer expired. 

### 📅 The June Holiday Roadmap:
Rather than leaving this as a hackathon draft, we are finishing the project together over the upcoming winter break with the following engineering sprints:
1. **Local Node.js PDF Parse Gateway:** Strip out unpredictable mock endpoints and implement a local server-side middleware pipeline using `pdf-parse` or a secure Google Cloud Bucket system to parse string data smoothly.
2. **Strict JSON Ingestion Fixes:** Upgrade the generative completion call using Gemini's structured output config parameters (`responseMimeType: "application/json"`) to ensure zero text syntax failures during deep JSON validation loops.
3. **Hardened API Key Handling:** Migrate the hardcoded client-side API credentials directly into encrypted **Firebase Cloud Functions** environment variables to follow proper enterprise security principles.

---

## 💻 Technical Stack Overview

* **Frontend:** Semantic HTML5, CSS3 Grid/Flexbox architectures, Poppins Google Font variant scaling.
* **Logic Framework:** Vanilla JavaScript (ES6 asynchronous event management loops, intervals, and conditional DOM parsing layers).
* **Cloud Infrastructure:** Firebase SDK v10 (Authentication, Firestore cloud document structure fallback routing).
* **Generative AI Core:** Google Gemini REST API Interface endpoint configuration.
