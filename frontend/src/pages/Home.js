import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Briefcase, 
  BookOpen, 
  Store, 
  FileText, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: t('navigation.jobs'),
      description: 'Find job opportunities in your preferred language',
      link: '/jobs',
      color: 'bg-blue-500'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: t('navigation.training'),
      description: 'Access training content for entrepreneurship',
      link: '/training',
      color: 'bg-green-500'
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: t('navigation.marketplace'),
      description: 'Connect with local businesses and entrepreneurs',
      link: '/marketplace',
      color: 'bg-purple-500'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: t('navigation.schemes'),
      description: 'Explore government schemes and benefits',
      link: '/schemes',
      color: 'bg-orange-500'
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'vah', name: 'वरहाडी', flag: '🇮🇳' }
  ];

  const stats = [
    { number: '1000+', label: 'Job Listings' },
    { number: '500+', label: 'Training Videos' },
    { number: '200+', label: 'Local Businesses' },
    { number: '50+', label: 'Government Schemes' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('app.name')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {t('app.tagline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Find Jobs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform for job seekers and entrepreneurs with multilingual support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-primary-300"
              >
                <div className={`${feature.color} text-white rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multilingual Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access content in your preferred language for better understanding and engagement
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {languages.map((language) => (
              <div
                key={language.code}
                className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{language.flag}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {language.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Growing Community
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Join thousands of users who are already benefiting from our platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join BhashaConnect today and take the first step towards your career or business goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
