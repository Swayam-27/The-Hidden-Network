import React from "react";

export const caseData = {
  // == CASE FILE: PROJECT RAVEN
  "project-raven": {
    title: "Project Raven",
    description: "Inside the UAE’s secret hacking program.",
    category: "cyber-warfare",
    difficulty: "Easy",
    meta: "Year: 2009-2019",
    imgSrc: "/assets/project-raven.png",

    totalAudioDurationMs: 607000,

    intro: {
      type: "audio",
      audioSrc: "/assets/raven-intro.mp3",
    },
    overview: (
      <>
        <p>
          Project Raven involved a secret cyber-espionage operation where
          American ex-NSA operatives were recruited by the United Arab Emirates
          to build a sophisticated hacking unit. Operating from a mansion in Abu
          Dhabi, these former U.S. intelligence officers used advanced
          zero-click iPhone exploits to target dissidents, journalists, and
          eventually American citizens, crossing ethical and legal boundaries in
          service of an authoritarian regime.
        </p>
        <p>
          Operating under the cover of a legitimate American cybersecurity firm,{" "}
          <strong>CyberPoint International</strong>, the Raven team employed a
          range of espionage techniques to monitor, surveil, and compromise
          devices.
        </p>
      </>
    ),
    timeline: (
      <ul>
        <li>
          <strong>2008:</strong> Richard Clarke becomes UAE consultant;
          establishes DREAD (Development Research Exploitation and Analysis
          Department) as precursor to Project Raven.
        </li>
        <li>
          <strong>2009:</strong> Project Raven officially launched; UAE
          contracts CyberPoint International to build cyber capabilities using
          ex-NSA operatives at "The Villa" in Abu Dhabi.
        </li>
        <li>
          <strong>2014:</strong> Lori Stroud (who recruited Edward Snowden)
          leaves NSA, joins Project Raven; Purple/Black briefing system
          established for new recruits.
        </li>
        <li>
          <strong>2016:</strong> UAE transfers Project Raven from CyberPoint to
          DarkMatter; purchases "Karma" zero-click iPhone exploit; begins
          targeting Americans including journalists, activists.
        </li>
        <li>
          <strong>2019 January:</strong> Reuters publishes explosive
          investigation exposing Project Raven; Ex-NSA operatives given choice
          to leave; Villa cleared out, operation officially terminated.
        </li>
        <li>
          <strong>2021 September:</strong> DOJ charges Marc Baier, Ryan Adams,
          and Daniel Gericke; $1.685 million in fines, lifetime security
          clearance bans; operations transferred to Digital14.
        </li>
      </ul>
    ),

    firstPuzzle: {
      type: "text",
      prompt:
        "The timeline indicates a key exploit was deployed in a specific year. Enter the 4-digit year to begin the debriefing.",
      answer: "2016",
    },

    episodes: [
      {
        title: "EPISODE 1 — THE MIRAGE OF PROTECTION",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep1.mp3",
        content: (
          <p>
            This debriefing details how Project Raven recruited former U.S.
            intelligence operatives. On paper, they were hired by an American
            company, <strong>CyberPoint International</strong>, but their true
            offensive mission was revealed in a secret orientation called the{" "}
            <strong>Black Meeting</strong>.
          </p>
        ),
        puzzle: {
          type: "redaction",
          documentText:
            "This employment agreement is made between the contractor and the company, [REDACTED], for services related to national security consultation...",
          prompt:
            "The initial briefing identified the front company used for recruitment. De-redact the document to proceed.",
          answer: "CYBERPOINT INTERNATIONAL",
        },
      },
      {
        title: "EPISODE 2 — INSIDE THE VILLA",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep2.mp3",
        content: (
          <p>
            The operation was run from a mansion in Abu Dhabi known as 'The
            Villa.' The team acquired a powerful 'zero-click' exploit that could
            break into iPhones without any user interaction. This tool was
            codenamed <strong>KARMA</strong>.
          </p>
        ),
        puzzle: {
          type: "text",
          prompt:
            'The team used a powerful "zero-click" exploit to compromise devices. What was its codename?',
          answer: "KARMA",
        },
      },
      {
        title: "EPISODE 3 — THE TURN",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep3.mp3",
        content: (
          <p>
            The mission's focus shifted from counter-terrorism to political
            espionage. The entire operation was exposed to the public in a
            massive investigation published by the news agency{" "}
            <strong>REUTERS</strong> in January 2019.
          </p>
        ),
        puzzle: {
          type: "keyword",
          documentText:
            "INTERNAL MEMO: URGENT. The leak is confirmed. The reporting heavily relies on testimony provided to Reuters. We need to initiate damage control immediately.",
          prompt:
            "Scan the internal memo and identify the news agency that broke the story and tap on it.",
          answer: "REUTERS",
        },
      },
      {
        title: "EPISODE 4 — AFTERMATH & LEGACY",
        type: "audio-debrief",
        audioSrc: "/assets/raven-ep4.mp3",
        content: (
          <p>
            After being exposed, Project Raven was absorbed into a UAE-based
            company called <strong>DarkMatter</strong>. In 2021, three American
            managers were charged by the U.S. Department of Justice, setting a
            precedent for the 'hacking-for-hire' industry.
          </p>
        ),
        puzzle: null,
      },
    ],
    conclusion: {
      type: "text",
      content:
        "Good work, Agent. You've pieced together the fragments and brought the truth to light. The full file on Project Raven is now declassified. Mission accomplished.",
    },
  },

  // == CASE FILE: CAMBRIDGE ANALYTICA
  "cambridge-analytica": {
    title: "Cambridge Analytica",
    description: "Data, democracy, and manipulation.",
    category: "data-privacy",
    difficulty: "Medium",
    meta: "Year: 2014-2018 // Status: Defunct",
    imgSrc: "/assets/ca.png",

    totalAudioDurationMs: 1647000,

    intro: {
      type: "audio",
      audioSrc: "/assets/ca-intro.mp3",
      content: (
        <p>
          "This file is about a ghost in the machine... This is the story of
          Cambridge Analytica."
        </p>
      ),
    },
    overview: (
      <>
        <p>
          The Cambridge Analytica scandal exposed how a political consulting
          firm harvested personal data from 87 million Facebook users without
          consent, using psychological profiling techniques to manipulate voter
          behavior during the 2016 U.S. presidential election and Brexit
          referendum. The case revealed how social media platforms could be
          weaponized to influence democratic processes through targeted
          psychological manipulation and micro-advertising.
        </p>
        <p>
          The data was harvested by an academic,{" "}
          <strong>Aleksandr Kogan</strong>, through a seemingly harmless quiz
          app.
        </p>
      </>
    ),
    timeline: (
      <ul>
        <li>
          <strong>2013:</strong> Cambridge Analytica founded by Steve Bannon and
          Robert Mercer as American arm of British military contractor SCL
          Group.
        </li>
        <li>
          <strong>2014:</strong> Aleksandr Kogan creates "This Is Your Digital
          Life" Facebook app; harvests data from 87 million users through
          270,000 quiz takers; Christopher Wylie develops OCEAN psychological
          profiling system then leaves company.
        </li>
        <li>
          <strong>2016:</strong> Cambridge Analytica deploys psychographic
          targeting in Trump presidential campaign and Brexit referendum; uses
          behavioral manipulation based on personality profiles.
        </li>
        <li>
          <strong>2018 March:</strong> Guardian/Observer/NYT publish explosive
          exposé; Channel 4 airs undercover videos of{" "}
          <strong>Alexander Nix</strong> boasting about dirty tricks; Facebook
          stock crashes.
        </li>
        <li>
          <strong>2018 April:</strong> Mark Zuckerberg testifies before Congress
          about data breach; admits Facebook failed to protect users.
        </li>
        <li>
          <strong>2018 May:</strong> Cambridge Analytica declares bankruptcy and
          shuts down operations; Alexander Nix banned from running UK companies;
          Facebook faces $5 billion FTC fine.
        </li>
      </ul>
    ),

    firstPuzzle: {
      type: "social-graph",
      prompt:
        "The 'Case Overview' identifies the academic who created the data-harvesting app. Identify his node in the social graph to begin the investigation.",
      nodes: [
        { id: 1, name: "C. Wylie", x: 100, y: 200 },
        { id: 2, name: "S. Bannon", x: 250, y: 100 },
        { id: 3, name: "A. Kogan", x: 400, y: 200 },
        { id: 4, name: "R. Mercer", x: 250, y: 300 },
        { id: 5, name: "A. Nix", x: 550, y: 100 },
      ],
      answer: "A. Kogan",
    },
    episodes: [
      {
        title: "EPISODE 1 — THE PSYCHOLOGY WEAPON",
        type: "audio-debrief",
        audioSrc: "/assets/ca-ep1.mp3",
        content: (
          <p>
            This debriefing explains the 'OCEAN model' of personality traits
            (Openness, Conscientiousness, Extroversion, Agreeableness,
            Neuroticism) that Cambridge Analytica used to build psychological
            profiles from Facebook likes. For example, people high in
            Neuroticism respond to messages of fear.
          </p>
        ),
        puzzle: {
          type: "personality-profile",
          prompt:
            "Based on the target's profile, which psychological trait is being exploited to manipulate them?",
          profile: {
            likes: [
              "Secure Borders",
              "Home Security Systems",
              "24-Hour News Alerts",
            ],
          },
          options: [
            "Openness",
            "Conscientiousness",
            "Extroversion",
            "Agreeableness",
            "Neuroticism",
          ],
          answer: "Neuroticism",
        },
      },
      {
        title: "EPISODE 2 — THE MANIPULATION MACHINE",
        type: "audio-debrief",
        audioSrc: "/assets/ca-ep2.mp3",
        content: (
          <p>
            This episode details how the firm used psychographic profiles to
            target voters in the Trump and Brexit campaigns, quoting the CEO's
            boastful and unethical methods captured on undercover video.
          </p>
        ),
        puzzle: {
          type: "redaction",
          documentText: `TRANSCRIPT SNIPPET: "We don't need facts. It's all about emotion," stated [REDACTED], the CEO of Cambridge Analytica.`,
          prompt:
            "The 'Key Events Timeline' identifies the executive exposed in undercover videos. De-redact the transcript to reveal his name.",
          answer: "ALEXANDER NIX",
        },
      },
      {
        title: "EPISODE 3 — THE WHISTLEBLOWER",
        type: "audio-debrief",
        audioSrc: "/assets/ca-ep3.mp3",
        content: (
          <p>
            This episode covers the timeline of the scandal breaking, from the
            initial whistleblower story to the CEO's exposé, the subsequent
            congressional testimony, and the company's eventual collapse.
          </p>
        ),
        puzzle: {
          type: "timeline-anomaly",
          prompt:
            "The final phase of the scandal unfolded in a specific sequence. Drag and drop the events into the correct chronological order.",
          events: [
            "Christopher Wylie's story is published in The Guardian.",
            "Alexander Nix is exposed on Channel 4 News.",
            "Mark Zuckerberg testifies before Congress.",
            "Cambridge Analytica declares bankruptcy.",
          ],
          answer: "CORRECT_SEQUENCE",
        },
      },
      {
        title: "EPISODE 4 — THE LEGACY OF MANIPULATION",
        type: "audio-debrief",
        audioSrc: "/assets/ca-ep4.mp3",
        content: (
          <p>
            This final debriefing covers the aftermath, including the fines
            levied against Facebook and the new laws like GDPR that were created
            in response to the scandal.
          </p>
        ),
        puzzle: null,
      },
    ],
    conclusion: {
      type: "text",
      content:
        "The ghost in the machine has been identified. Case file on Cambridge Analytica is now complete. Well done.",
    },
  },

  // == CASE FILE: PANAMA PAPERS
  "panama-papers": {
    title: "Panama Papers",
    description: "The world’s largest financial leak.",
    category: "financial-crime",
    difficulty: "Hard",
    meta: "Year: 2016 // Status: Public",
    imgSrc: "/assets/panama-papers.png",

    totalAudioDurationMs: 736000,

    intro: {
      type: "audio",
      audioSrc: "/assets/pp-intro.mp3",
      content: (
        <p>
          "This file is different. It's about a leak... They called them the
          Panama Papers."
        </p>
      ),
    },
    overview: (
      <>
        <p>
          The Panama Papers case involved the unprecedented leak of 11.5 million
          confidential documents from the Panamanian law firm Mossack Fonseca.
          The leak exposed a global system of offshore shell corporations used
          by the world's elite to hide wealth, evade taxes, and conduct illicit
          activities.
        </p>
        <p>
          The firm specialized in tools for anonymity, such as creating{" "}
          <strong>shell companies</strong> to own assets and providing{" "}
          <strong>nominee directors</strong>—fake owners who sign paperwork—to
          keep the client's name out of public records.
        </p>
      </>
    ),
    timeline: (
      <ul>
        <li>
          <strong>1977:</strong> Jürgen Mossack establishes law firm in Panama
          City, specializing in offshore corporate structures and tax avoidance
          services.
        </li>
        <li>
          <strong>1986:</strong> Ramón Fonseca joins firm; Mossack Fonseca
          begins massive expansion, eventually creating over 210,000 shell
          companies worldwide.
        </li>
        <li>
          <strong>2015:</strong> Anonymous whistleblower "John Doe" contacts
          German journalist Bastian Obermayer, offering 11.5 million
          confidential documents from Mossack Fonseca.
        </li>
        <li>
          <strong>2016 April:</strong> International Consortium of Investigative
          Journalists (ICIJ) publishes Panama Papers exposé; reveals offshore
          holdings of world leaders, celebrities, and criminals; Iceland's PM
          resigns within days.
        </li>
        <li>
          <strong>2017 October:</strong> Maltese journalist Daphne Caruana
          Galizia assassinated by car bomb after investigating Panama Papers
          connections to Malta's government.
        </li>
        <li>
          <strong>2018 March:</strong> Mossack Fonseca announces closure due to
          "economic and reputational damage"; founders arrested but later
          acquitted in 2022; global tax reforms implemented worldwide.
        </li>
      </ul>
    ),

    firstPuzzle: {
      type: "social-graph",
      prompt:
        "The 'Case Overview' explained how Mossack Fonseca used 'nominee directors' to hide a client's identity. Click the node that represents the FAKE owner used to sign the paperwork.",
      nodes: [
        { id: 1, name: "The Client (Beneficial Owner)", x: 150, y: 100 },
        { id: 2, name: "Mossack Fonseca (Law Firm)", x: 325, y: 200 },
        { id: 3, name: "Nominee Director (Fake Owner)", x: 500, y: 100 },
        { id: 4, name: "Panamanian Shell Co.", x: 325, y: 300 },
        { id: 5, name: "Asset", x: 325, y: 80 },
      ],
      answer: "Nominee Director (Fake Owner)",
    },

    episodes: [
      {
        title: "EPISODE 1 — THE SHADOW ECONOMY",
        type: "audio-debrief",
        audioSrc: "/assets/pp-ep1.mp3",
        content: (
          <p>
            This debriefing explains how Mossack Fonseca built its empire by
            specializing in offshore services like shell companies and nominee
            directors, effectively providing anonymity for its clients.
          </p>
        ),
        puzzle: {
          type: "redaction",
          documentText:
            "[INCOMING MESSAGE — UNKNOWN SOURCE]\nHello. This is [REDACTED]. Interested in data?\n> More than Cablegate...",
          prompt:
            "A nameless signal reached Germany. The 'Key Events Timeline' identifies the codename of the one who started the largest leak in history. De-redact the transmission log.",
          answer: "JOHN DOE",
        },
      },
      {
        title: "EPISODE 2 — THE WHISTLEBLOWER",
        type: "audio-debrief",
        audioSrc: "/assets/pp-ep2.mp3",
        content: (
          <p>
            In 2015, 'John Doe' contacted Süddeutsche Zeitung. Facing 2.6TB of
            data, they partnered with the ICIJ, leading to a secret global
            investigation and the explosive publication in April 2016 that
            triggered immediate political fallout.
          </p>
        ),
        puzzle: {
          type: "timeline-anomaly",
          prompt:
            "The leak triggered the firm's collapse over several years. Arrange the fallout in the correct chronological order using clues from the 'Key Events Timeline'.",
          events: [
            "Global investigations are launched by tax authorities after the ICIJ exposé.",
            "Mossack Fonseca announces the firm is shutting down due to reputational damage.",
            "Founders Jürgen Mossack and Ramón Fonseca are arrested on money laundering charges.",
            "A Panamanian judge acquits the founders, citing insufficient evidence.",
          ],
          answer: "CORRECT_SEQUENCE",
        },
      },
      {
        title: "EPISODE 3 — THE RECKONING",
        type: "audio-debrief",
        audioSrc: "/assets/pp-ep3.mp3",
        content: (
          <p>
            The consequences were severe, including the assassination of Maltese
            journalist Daphne Caruana Galizia in 2017. While Mossack Fonseca
            eventually shut down, its founders were ultimately acquitted, though
            the scandal forced global financial reforms.
          </p>
        ),
        puzzle: null,
      },
    ],
    conclusion: {
      type: "text",
      content:
        "The paper trail has been followed to its end. The Panama Papers file is now fully accessible. Your work here is done.",
    },
  },
  // CASE FILE: STUXNET

  stuxnet: {
    title: "Stuxnet",
    description: "The world's first digital weapon.",
    category: "cyber-warfare",
    difficulty: "In Preparation",
    meta: "Status: // FILE IN PREPARATION //",
    imgSrc: "/assets/stux.jpg",

    totalAudioDurationMs: 0,

    intro: {
      type: "audio",
      audioSrc: null,
      content: null,
    },
    overview: (
      <>
        <p>
          The Stuxnet case represents the world's first known act of
          cyberwarfare—a digital weapon designed by the United States and Israel
          to sabotage Iran's nuclear enrichment program. The operation,
          codenamed "Olympic Games," involved deploying a highly sophisticated
          computer worm that physically destroyed approximately 1,000 uranium
          enrichment centrifuges at Iran's Natanz nuclear facility between 2009
          and 2010.
        </p>
      </>
    ),
    timeline: (
      <ul>
        <li>
          <strong>2005-2006:</strong> President Bush authorizes NSA and Israeli
          Unit 8200 to develop Operation Olympic Games as a "third option"
          between diplomacy and military strikes against Iran's nuclear program.
        </li>
        <li>
          <strong>2007-2009:</strong> Stuxnet development and testing phase;
          U.S. Department of Energy builds secret replica of Natanz facility;
          weapon designed to spread via USB drives and target Siemens industrial
          control systems.
        </li>
        <li>
          <strong>Late 2009-Early 2010:</strong> Stuxnet successfully
          infiltrates Natanz facility; manipulates IR-1 centrifuge speeds
          (increasing to 1,410 Hz, then decreasing dramatically), destroying
          approximately 1,000 centrifuges while sending fake "normal" readings
          to operators.
        </li>
        <li>
          <strong>Mid-2010:</strong> Programming error causes Stuxnet to spread
          beyond Natanz onto the global internet; worm begins infecting
          computers worldwide but remains dormant on non-target systems.
        </li>
      </ul>
    ),
    firstPuzzle: null,
    episodes: [],
    conclusion: null,
  },
};
