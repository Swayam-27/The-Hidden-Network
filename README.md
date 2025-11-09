# THE HIDDEN NETWORK
### An Interactive Thesis in Government Secrecy & Intelligence

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![GSAP](https://img.shields.io/badge/GSAP-88CE01?style=for-the-badge&logo=greensock&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

"The Hidden Network" is an **interactive intelligence platform** that presents a course thesis through gameplay instead of a traditional paper. The core argument: **To gain true intelligence (the "signal"), you must first cut through the "noise."**

By combining storytelling, game design, secure backend architecture, and educational goals, this project transforms learning about surveillance and intelligence into an **engaging, competitive experience**. Users don't just read about intelligence work; they **become agents**, solving puzzles, competing globally, and experiencing the challenge of analysis firsthand.

---

## 🌐 Live Demo & Access

**URL:** [https://thehiddennet.netlify.app](https://thehiddennet.netlify.app)

### Steps to Enter
1. Click the link and wait for the system to initialize.
2. Register your Agent Codename via the terminal interface.
3. Type `GOTO CASES` or `GOTO ABOUT` in the terminal and press Enter.
4. This unlocks the header navigation and grants full archive access.

<img width="1888" alt="The Hidden Network Homepage" src="https://github.com/user-attachments/assets/dcef8f52-1f4c-44ce-b07e-2152d76ffd6c" />

---

## 🎯 Project Highlights

### 🏆 Full-Stack Architecture
- **Frontend:** React.js with GSAP animations
- **Backend:** Netlify serverless functions + Supabase PostgreSQL
- **Authentication:** Secure agent registration with cipher key validation
- **Leaderboard:** Real-time global rankings with "first-attempt-only" integrity

### 📱 Mobile-First Design
- Fully responsive (Desktop, Tablet, Mobile)
- Touch-optimized interactions (tap-to-preview system)
- Mobile HUD toggle system for timer, leaderboard, mission log
- Adaptive asset loading (3D models disabled on mobile)

### 🎮 Gamification
- Real-time performance tracking (timer + error count)
- S/A/B/C-CLASS ranking system
- Global leaderboard per case
- Personal mission log with completion history

### 🔒 Security & Data Integrity
- Row-Level Security (RLS) policies in Supabase
- Serverless backend prevents client-side tampering
- One submission per agent per case (enforced server-side)
- Secure authentication with reserved codename validation

---

## 💡 Core Thesis

This project demonstrates three key intelligence concepts by making users **experience** them:

- **Secrecy is a barrier** - Access to knowledge must be earned through authentication and puzzle-solving
- **Intelligence requires work** - The "signal" is hidden in "noise" (answers scattered across documents)
- **Covert operations are layered** - Truth emerges progressively through sequential puzzle unlocks

---

## 📂 The Case Files

Users investigate four real-world intelligence operations:

| Case | Topic | Status |
|------|-------|--------|
| **Project Raven** | UAE spyware & NSO Group's Pegasus | ✅ Complete |
| **Cambridge Analytica** | Social media data weaponization | ✅ Complete |
| **Panama Papers** | Offshore tax havens & financial secrecy | ✅ Complete |
| **Stuxnet** | US/Israel digital warfare | 🔒 Declassification Pending |

All completed cases sync performance data to the **Global Archive (Leaderboard)**.

---

## 🎮 Core Gameplay & System Mechanics

### 1. Agent Registration & Authentication
- **Unique Codename:** 3-12 characters, globally unique
- **Cipher Key:** 4-character security protocol
- **Reserved Names:** System prevents impersonation (e.g., "CIPHER", "ADMIN")
- **Persistent Identity:** Saved to localStorage and Supabase for leaderboard tracking

### 2. The Puzzle System
Each case contains 3-4 interactive puzzles that progressively unlock content:

- **Text Entry:** Type exact answers (years, names, codenames)
- **Social Graph:** Click correct nodes in network diagrams
- **Redaction:** Reveal hidden text in blacked-out documents
- **Timeline:** Drag-and-drop events into chronological order
- **Keyword:** Find and click specific crucial words in documents
- **Personality Profile:** Identify psychological traits being exploited

### 3. Smart Difficulty Progression
Cases mirror an analyst's career path:

- **Easy (Project Raven):** Clues in the text you just read
- **Medium (Cambridge Analytica):** Requires scrolling back to timelines/overviews
- **Hard (Panama Papers):** Multi-source synthesis + conceptual understanding

### 4. Live Performance Tracking
- **Operational Timer:** Starts on case entry, pauses on tab switch, stops on completion
- **Real-time HUD:** Displays Time, Errors, Puzzles Solved
- **Smart Pausing:** Prevents cheating via tab-switching detection
- **Permanent Storage:** All metrics saved to localStorage

### 5. The 3-Strike Penalty System
Discourages guessing, encourages analysis:

- **1st Wrong Answer:** `INCORRECT. RECHECK THE INTEL.`
- **2nd Wrong Answer:** `SECOND FAILED ATTEMPT. ANALYZE CAREFULLY.`
- **3rd Wrong Answer:** `SYSTEM LOCKOUT (10 seconds)`

### 6. Performance Rankings
Upon case completion, agents receive ranks calculated via:

**Factors:**
- **Precision:** Total wrong attempts vs. total puzzles
- **Efficiency:** Average time per puzzle

**Rankings:**
- **S-CLASS: Ghost Protocol** 🥇 (0 errors + <1.5 min avg)
- **A-CLASS: Field Agent** 🥈 (High accuracy + <3 min avg)
- **B-CLASS: Analyst** 🥉 (Standard completion <5 min avg)
- **C-CLASS: Recruit** (Slow or many mistakes)

### 7. Global Leaderboard System
- **Real-time Rankings:** Top 10 agents per case displayed
- **First-Attempt Only:** Only initial completion counts (enforced server-side)
- **Secure Backend:** Netlify functions + Supabase RLS policies
- **Live Sync:** Automatic updates after case completion

### 8. Mission Log
Personal performance archive tracking:
- Agent codename
- All case completions
- Best rankings achieved
- Time & error metrics per case

### 9. Memory System (State Persistence)
Full progress saved permanently via localStorage:
- Agent authentication status
- Case completion markers
- Episode unlocks per case
- Performance times and rankings
- Mission log history

---

## 🎨 The User Experience Flow

1. **Entry (Preloader):** System initialization with "hacking" animation
2. **Registration:** Create unique Agent Codename + Cipher Key
3. **The Breach:** Terminal command unlocks main navigation
4. **The Vault:** Case archive with completion stamps and hover previews
5. **Investigation:** Read briefings, listen to audio, solve puzzle-episode loops
6. **Case Closed:** Timer stops, ranking calculated, global leaderboard displayed

---

## 🛠️ Technical Implementation

### Frontend Stack
- **React JS:** Component-based SPA architecture
- **GSAP:** High-performance animations (breach, cursor, transitions)
- **Context API:** Global state management (authentication, live case data)
- **Custom CSS:** Fully custom design system (no UI libraries)
- **React Router:** Client-side navigation

### Backend Stack
- **Netlify Functions:** Serverless API endpoints
  - `agent-auth.js` - Agent registration & login
  - `submit-score.js` - Secure score submission
- **Supabase PostgreSQL:** Production database
  - `global_scores` table with RLS policies
  - Unique constraints: (agent_name, case_id)
- **Environment Variables:** Separate client/server keys

### Data Architecture
- **`caseData.js`:** Centralized content database (puzzles, timelines, audio paths)
- **`localStorage`:** Persistent client-side state
- **Supabase:** Persistent server-side rankings

### Performance Optimizations
- **Audio Compression:** MP3 files optimized to ~96kbps
- **Conditional Asset Loading:** 3D models/videos disabled on mobile
- **Responsive Breakpoints:** Tablet (768px), Mobile (480px)
- **Code Splitting:** React.lazy for page-level components
- **Tab Visibility API:** Smart timer pausing

### Mobile Optimization
- **Mobile HUD Toggle:** Bottom-right floating buttons
  - Mission Log (always available)
  - Timer (case-specific)
  - Leaderboard (case-specific)
- **Tap-to-Preview:** First tap shows preview, second tap navigates
- **Touch-Friendly UI:** Larger hit targets, no hover dependencies
- **Scroll Lock:** Prevents background scrolling when HUDs open

---

## 🗂️ Project Structure
<img width="387" height="650" alt="image" src="https://github.com/user-attachments/assets/e6ad3ecd-84b5-4160-906f-af0d21101d2a" />

