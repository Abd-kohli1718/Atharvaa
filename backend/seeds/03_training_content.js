exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('training_content').del();
  
  // Inserts seed entries
  return knex('training_content').insert([
    {
      id: 1,
      title: 'Digital Marketing Basics - English',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example1',
      language: 'English',
      description: 'Learn the fundamentals of digital marketing including SEO, social media marketing, and email campaigns.',
      created_by: 3
    },
    {
      id: 2,
      title: 'छोटे व्यवसाय के लिए मार्केटिंग - हिंदी',
      type: 'pdf',
      url: 'https://example.com/small-business-marketing-hindi.pdf',
      language: 'Hindi',
      description: 'छोटे व्यवसायों के लिए मार्केटिंग रणनीतियों की पूरी गाइड।',
      created_by: 3
    },
    {
      id: 3,
      title: 'व्यवसाय सुरु करणे - मराठी',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example3',
      language: 'Marathi',
      description: 'नवीन व्यवसाय सुरु करण्यासाठी मार्गदर्शन आणि टिप्स।',
      created_by: 5
    },
    {
      id: 4,
      title: 'Financial Planning for Entrepreneurs',
      type: 'infographic',
      url: 'https://example.com/financial-planning-infographic.png',
      language: 'English',
      description: 'Visual guide to financial planning for new entrepreneurs.',
      created_by: 3
    },
    {
      id: 5,
      title: 'वरहाडी व्यापारीकरण',
      type: 'text',
      url: 'https://example.com/varhadi-business-guide.txt',
      language: 'Varhadi',
      description: 'वरहाडी भाषा में व्यापार शुरू करने की जानकारी।',
      created_by: 5
    }
  ]);
};
