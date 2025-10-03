exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('schemes').del();
  
  // Inserts seed entries
  return knex('schemes').insert([
    {
      id: 1,
      title: 'Pradhan Mantri Mudra Yojana',
      description: 'Micro Units Development and Refinance Agency (MUDRA) provides loans up to Rs. 10 lakh to non-corporate, non-farm small/micro enterprises.',
      eligibility: 'Any Indian citizen who has a business plan for a non-farm income generating activity such as manufacturing, processing, trading or service sector.',
      link: 'https://www.mudra.org.in/',
      language: 'English',
      category: 'Finance',
      is_active: true
    },
    {
      id: 2,
      title: 'प्रधानमंत्री मुद्रा योजना',
      description: 'मुद्रा योजना के तहत 10 लाख रुपये तक का लोन मिलता है। यह योजना छोटे और सूक्ष्म उद्यमों के लिए है।',
      eligibility: 'कोई भी भारतीय नागरिक जिसके पास गैर-कृषि आय सृजन गतिविधि के लिए व्यवसाय योजना है।',
      link: 'https://www.mudra.org.in/',
      language: 'Hindi',
      category: 'Finance',
      is_active: true
    },
    {
      id: 3,
      title: 'महाराष्ट्र स्टार्टअप पॉलिसी',
      description: 'महाराष्ट्र सरकार की स्टार्टअप पॉलिसी जो नए उद्यमियों को वित्तीय सहायता और मार्गदर्शन प्रदान करती है।',
      eligibility: 'महाराष्ट्र के निवासी जो नया व्यवसाय शुरू करना चाहते हैं।',
      link: 'https://www.maharashtrastartup.com/',
      language: 'Marathi',
      category: 'Startup',
      is_active: true
    },
    {
      id: 4,
      title: 'Stand Up India Scheme',
      description: 'Stand Up India scheme facilitates bank loans between Rs. 10 lakh and Rs. 1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.',
      eligibility: 'SC/ST and/or women entrepreneurs, above 18 years of age. Loans available for greenfield enterprises in manufacturing, services or trading sectors.',
      link: 'https://www.standupmitra.in/',
      language: 'English',
      category: 'Finance',
      is_active: true
    },
    {
      id: 5,
      title: 'वरहाडी उद्यमी योजना',
      description: 'वरहाडी क्षेत्र के उद्यमियों के लिए विशेष योजना जो व्यवसाय शुरू करने में मदद करती है।',
      eligibility: 'वरहाडी क्षेत्र के निवासी जो नया व्यवसाय शुरू करना चाहते हैं।',
      link: 'https://www.varhadi-udyam.com/',
      language: 'Varhadi',
      category: 'Regional',
      is_active: true
    },
    {
      id: 6,
      title: 'Digital India Programme',
      description: 'Digital India is a flagship programme of the Government of India with a vision to transform India into a digitally empowered society and knowledge economy.',
      eligibility: 'All Indian citizens and businesses can benefit from various digital services and infrastructure.',
      link: 'https://www.digitalindia.gov.in/',
      language: 'English',
      category: 'Technology',
      is_active: true
    }
  ]);
};
