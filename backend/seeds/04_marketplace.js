exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('marketplace').del();
  
  // Inserts seed entries
  return knex('marketplace').insert([
    {
      id: 1,
      business_name: 'Rajesh Handicrafts',
      owner_name: 'Rajesh Kumar',
      product_service: 'Handmade wooden furniture and decorative items',
      contact: '+91-9876543210, rajesh.handicrafts@email.com',
      language: 'English',
      location: 'Mumbai, Maharashtra',
      description: 'Traditional Indian handicrafts made with love and precision.',
      created_by: 2
    },
    {
      id: 2,
      business_name: 'प्रिया की रसोई',
      owner_name: 'प्रिया शर्मा',
      product_service: 'घर का बना खाना और मिठाई',
      contact: '+91-9876543211, priya.kitchen@email.com',
      language: 'Hindi',
      location: 'Delhi, NCR',
      description: 'ताजा और स्वादिष्ट घर का बना खाना।',
      created_by: 3
    },
    {
      id: 3,
      business_name: 'मित्रा टेक्नोलॉजी',
      owner_name: 'अमित पटेल',
      product_service: 'वेबसाइट डिजाइन और डेवलपमेंट',
      contact: '+91-9876543212, amit.tech@email.com',
      language: 'Marathi',
      location: 'Pune, Maharashtra',
      description: 'छोटे व्यवसायों के लिए वेबसाइट और ऐप बनाने की सेवा।',
      created_by: 4
    },
    {
      id: 4,
      business_name: 'Sunita Organic Farm',
      owner_name: 'Sunita Devi',
      product_service: 'Organic vegetables and fruits',
      contact: '+91-9876543213, sunita.organic@email.com',
      language: 'English',
      location: 'Bangalore, Karnataka',
      description: 'Fresh organic produce grown without pesticides.',
      created_by: 5
    },
    {
      id: 5,
      business_name: 'वरहाडी क्राफ्ट्स',
      owner_name: 'रामेश्वर यादव',
      product_service: 'पारंपरिक वरहाडी हस्तशिल्प',
      contact: '+91-9876543214, rameshwar.crafts@email.com',
      language: 'Varhadi',
      location: 'Nagpur, Maharashtra',
      description: 'वरहाडी संस्कृति की पारंपरिक कलाकृतियां।',
      created_by: 2
    }
  ]);
};
