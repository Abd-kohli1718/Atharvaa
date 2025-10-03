import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Store,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import axios from 'axios';

const Marketplace = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { isOnline, saveOfflineData, getOfflineData } = useOffline();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    language: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Load businesses from API or offline storage
  const loadBusinesses = async (page = 1) => {
    try {
      setLoading(true);
      
      // Try to load from API if online
      if (isOnline) {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(searchTerm && { search: searchTerm }),
          ...(filters.location && { location: filters.location }),
          ...(filters.language && { language: filters.language })
        });

        const response = await axios.get(`/api/marketplace?${params}`);
        const data = response.data.data;
        
        setBusinesses(data.marketplace);
        setPagination(data.pagination);
        
        // Save to offline storage
        saveOfflineData('marketplace', data.marketplace);
      } else {
        // Load from offline storage
        const offlineBusinesses = getOfflineData('marketplace') || [];
        setBusinesses(offlineBusinesses);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
      if (isOnline) {
        toast.error('Failed to load businesses');
      } else {
        const offlineBusinesses = getOfflineData('marketplace') || [];
        setBusinesses(offlineBusinesses);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [searchTerm, filters, isOnline]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteBusiness = async (businessId) => {
    if (!isOnline) {
      toast.error('Cannot delete business while offline');
      return;
    }

    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await axios.delete(`/api/marketplace/${businessId}`);
        toast.success('Business deleted successfully');
        loadBusinesses(pagination.currentPage);
      } catch (error) {
        toast.error('Failed to delete business');
      }
    }
  };

  const getLanguageClass = (language) => {
    if (language === 'Hindi' || language === 'Marathi' || language === 'Varhadi') {
      return 'hindi-text';
    }
    return '';
  };

  const languages = ['English', 'Hindi', 'Marathi', 'Varhadi'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('marketplace.title')}
          </h1>
          <p className="text-gray-600">
            Connect with local businesses and entrepreneurs
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
                placeholder={t('marketplace.searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Location Filter */}
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />

            {/* Language Filter */}
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('marketplace.allLocations')}</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Business Button */}
        {isAuthenticated && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t('marketplace.addBusiness')}</span>
            </button>
          </div>
        )}

        {/* Businesses List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('marketplace.noBusinesses')}
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${getLanguageClass(business.language)}`}>
                      {business.business_name}
                    </h3>
                    <p className={`text-gray-600 mb-3 ${getLanguageClass(business.language)}`}>
                      Owner: {business.owner_name}
                    </p>
                    <div className="flex items-center space-x-2 mb-3">
                      {business.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{business.location}</span>
                        </div>
                      )}
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {business.language}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {isAuthenticated && (user?.role === 'admin' || user?.id === business.created_by) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBusiness(business)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title="Edit Business"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBusiness(business.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Business"
                        disabled={!isOnline}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Products/Services:</h4>
                  <p className={`text-gray-700 ${getLanguageClass(business.language)}`}>
                    {business.product_service}
                  </p>
                </div>

                {business.description && (
                  <div className="mb-4">
                    <p className={`text-gray-600 text-sm ${getLanguageClass(business.language)}`}>
                      {business.description}
                    </p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{business.contact}</span>
                    </div>
                    {business.contact.includes('@') && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{business.contact}</span>
                      </div>
                    )}
                  </div>
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
                onClick={() => loadBusinesses(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => loadBusinesses(page)}
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
                onClick={() => loadBusinesses(pagination.currentPage + 1)}
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

export default Marketplace;
