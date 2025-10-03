exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('jobs').del();
  
  // Inserts seed entries
  return knex('jobs').insert([
    {
      id: 1,
      title: 'Software Developer - React/Node.js',
      description: 'We are looking for a skilled software developer with experience in React and Node.js. The ideal candidate should have 2+ years of experience in full-stack development.',
      category: 'Technology',
      location: 'Mumbai, Maharashtra',
      language: 'English',
      created_by: 1
    },
    {
      id: 2,
      title: 'मार्केटिंग मैनेजर - मराठी भाषा',
      description: 'मराठी भाषा में काम करने वाले मार्केटिंग मैनेजर की आवश्यकता है। उम्मीदवार को डिजिटल मार्केटिंग का अनुभव होना चाहिए।',
      category: 'Marketing',
      location: 'Pune, Maharashtra',
      language: 'Marathi',
      created_by: 1
    },
    {
      id: 3,
      title: 'Sales Executive - Hindi Speaking',
      description: 'हिंदी भाषा में बातचीत करने वाले सेल्स एक्जीक्यूटिव की आवश्यकता है। फील्ड सेल्स का अनुभव आवश्यक है।',
      category: 'Sales',
      location: 'Delhi, NCR',
      language: 'Hindi',
      created_by: 2
    },
    {
      id: 4,
      title: 'Content Writer - Multilingual',
      description: 'We need a content writer who can write in English, Hindi, and Marathi. Experience in digital content creation is required.',
      category: 'Content Writing',
      location: 'Bangalore, Karnataka',
      language: 'English',
      created_by: 3
    },
    {
      id: 5,
      title: 'वरहाडी भाषा में कस्टमर सपोर्ट',
      description: 'वरहाडी भाषा में ग्राहक सहायता प्रदान करने वाले कर्मचारी की आवश्यकता है।',
      category: 'Customer Support',
      location: 'Nagpur, Maharashtra',
      language: 'Varhadi',
      created_by: 4
    }
  ]);
};
