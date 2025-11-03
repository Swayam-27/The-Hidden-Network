# THE HIDDEN NETWORK
### An Interactive Thesis in Government Secrecy & Intelligence

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![GSAP](https://img.shields.io/badge/GSAP-88CE01?style=for-the-badge&logo=greensock&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

"The Hidden Network" is an interactive website that presents a course project through gameplay instead of a traditional paper. The core argument is: **To gain true intelligence (the "signal"), you must first cut through the "noise."**

By combining storytelling, game design, and educational goals, this project turns learning about surveillance and intelligence into an engaging, memorable experience. Users don't just read about intelligence work; they experience the challenge of finding clues firsthand.

---

## 🌐 Live Demo & Access

**URL:** `https://thehiddennet.netlify.app`

### Steps to Enter
1.  Click the link and wait for the system to boot.
2.  Scroll down, read the "Handler's" directive message, and use the console/terminal to breach the website.
3.  Type `GOTO CASES` or `GOTO ABOUT` in the terminal and press Enter.
4.  This unlocks the main header and grants full access to the site.


<img width="1888" height="872" alt="image" src="https://github.com/user-attachments/assets/dcef8f52-1f4c-44ce-b07e-2152d76ffd6c" />


---

## 💡 Principle of the Operation
This project is built to demonstrate three key concepts about intelligence and secrecy by making the user *experience* them:

* **Secrecy is a barrier** - Access to knowledge must be earned (you must solve puzzles to unlock information).
* **Intelligence requires work** - The "signal" is hidden in "noise" (answers are scattered across documents, requiring careful reading).
* **Covert operations are layered** - Truth emerges progressively (each puzzle reveals the next piece of the story).

---

## 📂 The Case Files
Users investigate four real-world intelligence operations, each with its own set of puzzles and documents:

* **Project Raven:** How the UAE used spyware to monitor dissidents.
* **Cambridge Analytica:** How social media data was weaponized for political manipulation.
* **Panama Papers:** How the world's elite hide money in offshore tax havens.
* **Stuxnet:** How the US/Israel created the world's first digital weapon (Coming Soon).

---

## 🎮 Core Gameplay & System Mechanics
This project is driven by a series of interconnected systems designed to create an immersive and challenging analytical experience.

### 1. The Puzzle System
Each case contains 3-4 interactive puzzles that progressively unlock content.
* **Text Entry Puzzles:** User types an answer (e.g., a year, a name, a code word).
* **Social Graph Puzzles:** User clicks the correct node in a visual network diagram.
* **Redaction Puzzles:** User must find and type the hidden text in a "blacked-out" document.
* **Timeline Puzzles:** User drag-and-drops events into the correct chronological order.
* **Keyword Puzzles:** User must find and click a specific, crucial word within a larger document.
* **Personality Profile Puzzles:** User analyzes a target's profile to determine which psychological trait is being exploited.

### 2. Smart Difficulty Progression
The cases are structured to mirror an analyst's career:
* **Easy Case (Project Raven):** Clues are found directly in the text you *just* read. (e.g., "The tool was called KARMA").
* **Medium Case (Cambridge Analytica):** Clues require scrolling back up to check the case overview or timeline.
* **Hard Case (Panama Papers):** Clues are scattered across *multiple* sections, requiring the user to synthesize information and understand core concepts (like "nominee director").

### 3. The Timer & Performance Tracking
* **How it Works:** A timer starts automatically when a case is opened.
* **Smart Features:** The timer intelligently **pauses** if you switch to another browser tab (to prevent cheating) and **resumes** when you return. It stops permanently when the final puzzle is solved and is saved to `localStorage`.
* **Why?** It measures analytical efficiency, a key skill in intelligence.

### 4. The 3-Strike Penalty System
To discourage random guessing and encourage careful analysis:
* **1st Wrong Answer:** `INCORRECT. RECHECK THE INTEL.`
* **2nd Wrong Answer:** `SECOND FAILED ATTEMPT. ANALYZE CAREFULLY.`
* **3rd Wrong Answer:** `SYSTEM LOCKOUT. Sloppy work, Agent. Analyze the intel carefully.` (This locks the user out for 10 seconds).

### 5. Performance Rankings
Upon completing a case, the user receives a rank from C to S, calculated based on **Accuracy** (wrong attempts) and **Speed** (average time per puzzle).
* **S-CLASS: Ghost Protocol** 🥇 (Flawless precision + Elite speed)
* **A-CLASS: Field Agent** 🥈 (High accuracy + Fast speed)
* **B-CLASS: Analyst** 🥉 (Standard completion)
* **C-CLASS: Recruit** (Slow or many mistakes)

### 6. Memory System (State Persistence)
The website has full "memory" and saves all progress permanently using `localStorage`. It remembers:
* If you've entered the `GOTO` breach command.
* Which cases you've completed.
* Which episodes you've unlocked.
* Your best completion times and wrong-attempt counts for each case.
* Your performance rankings.

---

## The User Experience (UX) Flow
1.  **Step 1: Entry (Preloader):** User sees a "system hacking" animation.
2.  **Step 2: The Homepage:** User is greeted by the "Handler" and must use the terminal to enter.
3.  **Step 3: The Breach:** Entering the command triggers an animation and unlocks the main navigation.
4.  **Step 4: The Vault (Cases Page):** User sees file folders for each case, with "COMPLETED" stamps on finished ones.
5.  **Step 5: Investigation (Case Detail):** User reads briefings, listens to audio, and solves the puzzle-unlock-episode loop.
6.  **Step 6: Case Closed:** Timer stops, a "CASE CLOSED" stamp appears, and the final ranking is displayed.

---

## 🛠️ Technical Implementation

### Build Stack
* **React JS:** The core framework for building this interactive, single-page application.
* **GSAP (GreenSock):** A high-performance animation library used for the breach sequence, preloader, and other UI effects.
* **Custom Design:** All styling is custom-written in CSS (no UI libraries).
* **Audio Integration:** A custom-built `AudioPlayer.jsx` component for case debriefings.

###  Data & Persistence
* **`localStorage`:** Used for all persistent state, ensuring user progress is never lost between sessions.
* **`caseData.js`:** A centralized JavaScript file that acts as a "database," storing all case text, puzzle questions, answers, and audio file paths.

### Performance Optimization
* **Audio Compression:** All `.mp3` files are compressed.
* **Asset Lazy-Loading:** Heavy assets (like the Spline 3D model and background video) are disabled on mobile viewports to ensure fast load times on cellular.
* **Responsive Breakpoints:** Fully responsive design for Tablet (768px) and Mobile (480px).

---

## 🗂️ Project & Component Architecture
The website is organized into the following pages and key React components:

* **Homepage:** Entry point with terminal.
* **Cases Page:** Archive of all case files.
* **Case Detail Pages:** Individual investigations.
* **About Page:** Project background and creator reveal.

### Key Component Architecture (React)
* **`DecryptionInterface.jsx`:** The "brain" of the puzzle system. This single component handles all 6 puzzle types, manages state, validates answers, and implements the 3-strike penalty system.
* **`CaseDetailPage.jsx`:** Manages the overall flow of a single case, including the timer, episode unlocking, and progression.
* **`Conclusion.jsx`:** Calculates the final S/A/B/C-CLASS ranking based on props (time and attempts) passed from `CaseDetailPage.jsx`.
* **`AudioPlayer.jsx`:** A custom-built audio player with play/pause and real-time progress tracking.
* **`BreachSequence.jsx`:** Manages the "breach" animation and saves the user's "insider" status to `localStorage`.
* **`Cursor.jsx`:** A GSAP-animated custom cursor (target reticle) that is disabled on touch devices.

---

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Swayam-27/The-Hidden-Network.git](https://github.com/Swayam-27/The-Hidden-Network.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd The-Hidden-Network
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The project will be available at `http://localhost:3000`.
