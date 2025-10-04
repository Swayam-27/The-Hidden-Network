import React from 'react';

export const caseData = {
  'project-raven': {
    title: 'Project Raven',
    description: 'Inside the UAE’s secret hacking program.',
    category: 'cyber-warfare', // This was missing
    meta: 'Year: 2009-2019',
    imgSrc: '/assets/project-raven.png',
    overview: (
      <>
        <p>Project Raven was a clandestine offensive cyber operations unit in the United Arab Emirates...</p>
        <p>Operating under the cover of a legitimate cybersecurity firm, the Raven team employed a range of espionage techniques...</p>
      </>
    ),
    timeline: (
      <ul>
        <li><strong>2009:</strong> Project Raven is created to monitor militants and threats...</li>
        <li><strong>2014:</strong> DarkMatter is founded; Raven begins transitioning...</li>
        <li><strong>2016:</strong> The “Karma” iPhone exploit is deployed...</li>
        <li><strong>2017:</strong> Operations target journalists, activists, and political figures...</li>
        <li><strong>2018–2019:</strong> Reuters exposes Project Raven...</li>
        <li><strong>2021:</strong> Former U.S. operatives admit in court to hacking U.S. networks...</li>
      </ul>
    ),
    resources: [
        { name: 'Reuters Investigation Report', url: 'https://www.reuters.com/investigates/special-report/usa-spying-raven/' }
    ]
  },
  'cambridge-analytica': {
    title: 'Cambridge Analytica',
    description: 'Data, democracy, and manipulation.',
    category: 'data-privacy', // This was missing
    meta: 'Year: 2014-2018 // Status: Defunct',
    imgSrc: '/assets/ca.png',
    overview: (
        <>
            <p>Cambridge Analytica was a British political consulting firm that harvested the personal data of millions of Facebook users...</p>
            <p>The firm claimed to have created psychographic profiles to predict and influence voter behavior...</p>
        </>
    ),
    timeline: (
        <ul>
            <li><strong>2014:</strong> The app "This Is Your Digital Life" is launched...</li>
            <li><strong>2015:</strong> The Guardian reports on the firm's involvement with the Ted Cruz campaign...</li>
            <li><strong>2018:</strong> Whistleblower <span className="redacted">Christopher Wylie</span> reveals the scale of the data breach...</li>
            <li><strong>2018:</strong> Cambridge Analytica and its parent company SCL Group declare bankruptcy...</li>
        </ul>
    ),
    resources: [
        { name: 'The Guardian/Observer Investigation', url: '#' }
    ]
  },
  'panama-papers': {
    title: 'Panama Papers',
    description: 'The world’s largest financial leak.',
    category: 'financial-crime', // This was missing
    meta: 'Year: 2016 // Status: Public',
    imgSrc: '/assets/panama-papers.png',
    overview: (
        <>
            <p>The Panama Papers case involved the unprecedented leak of 11.5 million confidential documents...</p>
            <p>The leak was given to German newspaper Süddeutsche Zeitung by an anonymous source...</p>
        </>
    ),
    timeline: (
        <ul>
            <li><strong>2015:</strong> An anonymous source leaks the documents to German journalists...</li>
            <li><strong>April 3, 2016:</strong> The ICIJ and its partner news outlets publish the first stories...</li>
            <li><strong>April 5, 2016:</strong> The Prime Minister of Iceland, Sigmundur Gunnlaugsson, resigns...</li>
            <li><strong>2017-Present:</strong> Governments worldwide have recouped more than $1.3 billion...</li>
        </ul>
    ),
    resources: [
        { name: 'ICIJ Investigation Portal', url: '#' }
    ]
  }
};