import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  ExternalLink, 
  CheckCircle,
  Edit,
  Trash2,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import axios from 'axios';

const Schemes = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { isOnline, saveOfflineData, getOfflineData } = useOffline();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    language: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Load schemes from API or offline storage
  const loadSchemes = async (page = 1) => {
    try {
      setLoading(true);
      
      // Try to load from API if online
      if (isOnline) {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(searchTerm && { search: searchTerm }),
          ...(filters.category && { category: filters.category }),
          ...(filters.language && { language: filters.language })
        });

        const response = await axios.get(`/api/schemes?${params}`);
        const data = response.data.data;
        
        setSchemes(data.schemes);
        setPagination(data.pagination);
        
        // Save to offline storage
        saveOfflineData('schemes', data.schemes);
      } else {
        // Load from offline storage
        const offlineSchemes = getOfflineData('schemes') || [];
        setSchemes(offlineSchemes);
      }
    } catch (error) {
      console.error('Error loading schemes:', error);
      if (isOnline) {
        toast.error('Failed to load schemes');
      } else {
        const offlineSchemes = getOfflineData('schemes') || [];
        setSchemes(offlineSchemes);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, [searchTerm, filters, isOnline]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteScheme = async (schemeId) => {
    if (!isOnline) {
      toast.error('Cannot delete scheme while offline');
      return;
    }

    if (user?.role !== 'admin') {
      toast.error('Only admins can delete schemes');
      return;
    }

    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await axios.delete(`/api/schemes/${schemeId}`);
        toast.success('Scheme deleted successfully');
        loadSchemes(pagination.currentPage);
      } catch (error) {
        toast.error('Failed to delete scheme');
      }
    }
  };

  const getLanguageClass = (language) => {
    if (language === 'Hindi' || language === 'Marathi' || language === 'Varhadi') {
      return 'hindi-text';
    }
    return '';
  };

  const categories = ['Finance', 'Startup', 'Technology', 'Regional', 'Education', 'Healthcare'];
  const languages = ['English', 'Hindi', 'Marathi', 'Varhadi'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('schemes.title')}
          </h1>
          <p className="text-gray-600">
            Explore government schemes and benefits for entrepreneurs and job seekers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('schemes.searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('schemes.allCategories')}</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('jobs.allLanguages')}</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Scheme Button (Admin only) */}
        {isAuthenticated && user?.role === 'admin' && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t('schemes.addScheme')}</span>
            </button>
          </div>
        )}

        {/* Schemes List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('schemes.noSchemes')}
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {schemes.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${getLanguageClass(scheme.language)}`}>
                      {scheme.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      {scheme.category && (
                        <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                          {scheme.category}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {scheme.language}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Active
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons (Admin only) */}
                  {isAuthenticated && user?.role === 'admin' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingScheme(scheme)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title="Edit Scheme"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteScheme(scheme.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Scheme"
                        disabled={!isOnline}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                  <p className={`text-gray-700 ${getLanguageClass(scheme.language)}`}>
                    {scheme.description}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Eligibility:</h4>
                  <p className={`text-gray-700 ${getLanguageClass(scheme.language)}`}>
                    {scheme.eligibility}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  {scheme.link ? (
                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Official Link</span>
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">No official link available</span>
                  )}
                  <span className="text-sm text-gray-500">
                    ID: {scheme.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => loadSchemes(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => loadSchemes(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    page === pagination.currentPage
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => loadSchemes(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;
