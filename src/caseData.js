import React from "react";

export const caseData = {
  // =================================================================================
  // == CASE FILE: PROJECT RAVEN
  // =================================================================================
  "project-raven": {
    title: "Project Raven",
    description: "Inside the UAE’s secret hacking program.",
    category: "cyber-warfare",
    meta: "Year: 2009-2019",
    imgSrc: "/assets/project-raven.png",

    intro: {
      type: "audio",
      audioSrc: "/assets/raven-intro.mp3",
    },
    overview: (
      <>
        <p>
          Project Raven was a clandestine offensive cyber operations unit in the
          United Arab Emirates, primarily staffed by former U.S. intelligence
          operatives. Its mission was to provide the UAE with a sophisticated
          signals intelligence capability.
        </p>
        <p>
          Operating under the cover of a legitimate American cybersecurity firm, the
          Raven team employed a range of espionage techniques to monitor,
          surveil, and compromise the devices of state adversaries, terrorists,
          and, controversially, human rights activists and journalists.
        </p>
      </>
    ),
    timeline: (
      <ul>
        <li><strong>2009:</strong> Project Raven is created to monitor militants and threats.</li>
        <li><strong>2014:</strong> DarkMatter is founded; Raven begins transitioning.</li>
        <li><strong>2016:</strong> The “Karma” iPhone exploit is deployed.</li>
        <li><strong>2019:</strong> Reuters exposes Project Raven, leading to its shutdown.</li>
        <li><strong>2021:</strong> Former U.S. operatives admit in court to hacking U.S. networks.</li>
      </ul>
    ),

    firstPuzzle: {
      type: "text",
      prompt: "The timeline indicates a key exploit was deployed in a specific year. Enter the 4-digit year to begin the debriefing.",
      answer: "2016",
    },

    episodes: [
      {
        title: "EPISODE 1 — THE MIRAGE OF PROTECTION",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep1.mp3",
        content: (
          <p>This debriefing details how Project Raven recruited former U.S. intelligence operatives. On paper, they were hired by an American company, <strong>CyberPoint International</strong>, but their true offensive mission was revealed in a secret orientation called the{" "}<strong>Black Meeting</strong>.</p>
        ),
        puzzle: {
          type: "redaction",
          documentText: "This employment agreement is made between the contractor and the company, [REDACTED], for services related to national security consultation...",
          prompt: "The debriefing identified the front company used for recruitment. De-redact the document to proceed.",
          answer: "CYBERPOINT INTERNATIONAL",
        },
      },
      {
        title: "EPISODE 2 — INSIDE THE VILLA",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep2.mp3",
        content: (
          <p>The operation was run from a mansion in Abu Dhabi known as 'The Villa.' The team acquired a powerful 'zero-click' exploit that could break into iPhones without any user interaction. This tool was codenamed <strong>KARMA</strong>.</p>
        ),
        puzzle: {
          type: "text",
          prompt: 'The team used a powerful "zero-click" exploit to compromise devices. What was its codename?',
          answer: "KARMA",
        },
      },
      {
        title: "EPISODE 3 — THE TURN",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep3.mp3",
        content: (
          <p>The mission's focus shifted from counter-terrorism to political espionage. The entire operation was exposed to the public in a massive investigation published by the news agency{" "}<strong>REUTERS</strong> in January 2019.</p>
        ),
        puzzle: {
          type: "keyword",
          documentText: "INTERNAL MEMO: URGENT. The leak is confirmed. The reporting heavily relies on testimony provided to Reuters. We need to initiate damage control immediately.",
          prompt: "Scan the internal memo and identify the news agency that broke the story and tap on it.",
          answer: "REUTERS",
        },
      },
      {
        title: "EPISODE 4 — AFTERMATH & LEGACY",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep4.mp3",
        content: (
          <p>After being exposed, Project Raven was absorbed into a UAE-based company called <strong>DarkMatter</strong>. In 2021, three American managers were charged by the U.S. Department of Justice, setting a precedent for the 'hacking-for-hire' industry.</p>
        ),
        puzzle: null,
      },
    ],
    conclusion: {
        type: 'text',
        content: "Good work, Agent. You've pieced together the fragments and brought the truth to light. The full file on Project Raven is now declassified. Mission accomplished."
    }
  },

  // =================================================================================
  // == CASE FILE: CAMBRIDGE ANALYTICA (Remains the same)
  // =================================================================================
  "cambridge-analytica": {
    title: "Cambridge Analytica",
    description: "Data, democracy, and manipulation.",
    category: "data-privacy",
    meta: "Year: 2014-2018 // Status: Defunct",
    imgSrc: "/assets/ca.png",
    intro: {
      type: "audio",
      audioSrc: "/assets/ca-intro.mp3",
      content: ( <p>"This file is about a ghost in the machine... This is the story of Cambridge Analytica."</p> ),
    },
    overview: (
      <>
        <p>Cambridge Analytica was a British political consulting firm that harvested the personal data of millions of Facebook users without their consent and used it for political advertising purposes. The firm claimed to have created psychographic profiles to predict and influence voter behavior on a mass scale.</p>
      </>
    ),
    timeline: (
      <ul>
        <li><strong>2014:</strong> The app 'This Is Your Digital Life' is launched, beginning the data harvest.</li>
        <li><strong>2015:</strong> The Guardian reports on the firm's involvement with a U.S. political campaign.</li>
        <li><strong>2018:</strong> Whistleblower Christopher Wylie reveals the scale of the data breach.</li>
        <li><strong>2018:</strong> Cambridge Analytica and its parent company SCL Group declare bankruptcy.</li>
      </ul>
    ),
    firstPuzzle: {
      type: "text",
      prompt: "The timeline states the data harvest began in a specific year with the launch of an app. Enter the 4-digit year.",
      answer: "2014",
    },
    episodes: [
      {
        title: "EPISODE 1 — THE HARVEST",
        type: "audio-debrief",
        audioSrc: "/assets/ca-ep1.mp3",
        content: ( <p>The initial data harvest was conducted through a personality quiz app titled <strong>THIS IS YOUR DIGITAL LIFE</strong>, which scraped data from users and their friends lists.</p> ),
        puzzle: {
          type: "text",
          prompt: "What was the full name of the personality quiz app used to harvest user data?",
          answer: "THIS IS YOUR DIGITAL LIFE",
        },
      },
      {
        title: "EPISODE 2 — THE WHISTLEBLOWER",
        type: "audio-debrief",
        audioSrc: "/assets/ca-ep2.mp3",
        content: ( <p>The full scale of the operation remained secret until a former employee, <span className="redacted">Christopher Wylie</span>, came forward. As the director of research,He provided documents to journalists that exposed the inner workings of the firm.</p> ),
        puzzle: {
          type: "text",
          prompt: "The dossier credits one whistleblower with exposing the scandal. What is their full name?",
          answer: "CHRISTOPHER WYLIE",
        },
      },
      {
        title: "EPISODE 3 — THE FALLOUT",
        type: "dossier",
        audioSrc: null,
        content: (
          <>
            <h2>[CLASSIFIED] Dossier: Aftermath</h2>
            <p>Following the exposé, Cambridge Analytica and its parent company,{" "}<strong>SCL GROUP</strong>, faced intense scrutiny from governments worldwide. In May 2018, both companies declared bankruptcy and ceased operations.</p>
          </>
        ),
        puzzle: null,
      },
    ],
    conclusion: {
      type: 'text',
      content: "The ghost in the machine has been identified. Case file on Cambridge Analytica is now complete. Well done."
    }
  },

  // =================================================================================
  // == CASE FILE: PANAMA PAPERS (Remains the same)
  // =================================================================================
  "panama-papers": {
    title: "Panama Papers",
    description: "The world’s largest financial leak.",
    category: "financial-crime",
    meta: "Year: 2016 // Status: Public",
    imgSrc: "/assets/panama-papers.png",
    intro: {
      type: "audio",
      audioSrc: "/assets/panama-intro.mp3",
      content: ( <p>"This file is different. It's about a leak... They called them the Panama Papers."</p> ),
    },
    overview: (
      <>
        <p>The Panama Papers case involved the unprecedented leak of 11.5 million confidential documents from the Panamanian law firm Mossack Fonseca. The leak exposed a global system of offshore shell corporations used by the world's elite to hide wealth, evade taxes, and conduct illicit activities.</p>
      </>
    ),
    timeline: (
      <ul>
        <li><strong>2015:</strong> An anonymous source leaks the documents to German journalists.</li>
        <li><strong>April 3, 2016:</strong> The ICIJ and its partner news outlets publish the first stories.</li>
        <li><strong>April 5, 2016:</strong> The Prime Minister of Iceland resigns due to the fallout.</li>
        <li><strong>2017-Present:</strong> Governments worldwide have recouped more than $1.3 billion in taxes.</li>
      </ul>
    ),
    firstPuzzle: {
      type: "text",
      prompt: "The timeline shows the first stories were published on a specific date in 2016. Enter the date in the format MONTH DAY (e.g., APRIL 03).",
      answer: "APRIL 03",
    },
    episodes: [
      {
        title: "EPISODE 1 — THE SOURCE",
        type: "audio-debrief",
        audioSrc: "/assets/panama-ep1.mp3",
        content: ( <p>The 11.5 million documents were not stolen from a government, but from a single Panamanian law firm that specialized in offshore shell companies: <strong>MOSSACK FONSECA</strong>.</p> ),
        puzzle: {
          type: "text",
          prompt: "The debriefing identified the law firm at the heart of the leak. What was its name?",
          answer: "MOSSACK FONSECA",
        },
      },
      {
        title: "EPISODE 2 — THE ANONYMOUS HANDOFF",
        type: "dossier",
        audioSrc: null,
        content: (
          <>
            <h2>[CLASSIFIED] Dossier: The Handoff</h2>
            <p>The documents were provided to the German newspaper{" "}<strong>SÜDDEUTSCHE ZEITUNG</strong> by an anonymous source using the pseudonym 'John Doe.' The sheer volume of data was too large for a single newsroom to handle.</p>
          </>
        ),
        puzzle: {
          type: "text",
          prompt: "The anonymous source first leaked the documents to a specific German newspaper. What was its name?",
          answer: "SÜDDEUTSCHE ZEITUNG",
        },
      },
      {
        title: "EPISODE 3 — GLOBAL COLLABORATION",
        type: "audio-debrief",
        audioSrc: "/assets/panama-ep2.mp3",
        content: (
          <p>To analyze the documents, the newspaper collaborated with the{" "}<strong>INTERNATIONAL CONSORTIUM OF INVESTIGATIVE JOURNALISTS</strong>{" "}(ICIJ). The ICIJ coordinated a global network of hundreds of journalists to simultaneously investigate and report on the findings.</p>
        ),
        puzzle: null,
      },
    ],
    conclusion: {
      type: 'text',
      content: "The paper trail has been followed to its end. The Panama Papers file is now fully accessible. Your work here is done."
    }
  },
};