import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { 
  Search, 
  Filter, 
  Plus, 
  Play, 
  FileText, 
  Image, 
  Video,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import axios from 'axios';

const Training = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { isOnline, saveOfflineData, getOfflineData } = useOffline();
  const [trainingContent, setTrainingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    language: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Load training content from API or offline storage
  const loadTrainingContent = async (page = 1) => {
    try {
      setLoading(true);
      
      // Try to load from API if online
      if (isOnline) {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(searchTerm && { search: searchTerm }),
          ...(filters.type && { type: filters.type }),
          ...(filters.language && { language: filters.language })
        });

        const response = await axios.get(`/api/training?${params}`);
        const data = response.data.data;
        
        setTrainingContent(data.trainingContent);
        setPagination(data.pagination);
        
        // Save to offline storage
        saveOfflineData('training', data.trainingContent);
      } else {
        // Load from offline storage
        const offlineContent = getOfflineData('training') || [];
        setTrainingContent(offlineContent);
      }
    } catch (error) {
      console.error('Error loading training content:', error);
      if (isOnline) {
        toast.error('Failed to load training content');
      } else {
        const offlineContent = getOfflineData('training') || [];
        setTrainingContent(offlineContent);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainingContent();
  }, [searchTerm, filters, isOnline]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteContent = async (contentId) => {
    if (!isOnline) {
      toast.error('Cannot delete content while offline');
      return;
    }

    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await axios.delete(`/api/training/${contentId}`);
        toast.success('Content deleted successfully');
        loadTrainingContent(pagination.currentPage);
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'infographic':
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'pdf':
        return 'bg-blue-100 text-blue-800';
      case 'infographic':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageClass = (language) => {
    if (language === 'Hindi' || language === 'Marathi' || language === 'Varhadi') {
      return 'hindi-text';
    }
    return '';
  };

  const types = ['video', 'pdf', 'text', 'infographic'];
  const languages = ['English', 'Hindi', 'Marathi', 'Varhadi'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('training.title')}
          </h1>
          <p className="text-gray-600">
            Access training content for entrepreneurship and skill development
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
                placeholder={t('training.searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('training.allTypes')}</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
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

        {/* Add Content Button */}
        {isAuthenticated && (user?.role === 'entrepreneur' || user?.role === 'admin') && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t('training.addContent')}</span>
            </button>
          </div>
        )}

        {/* Training Content List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : trainingContent.length === 0 ? (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('training.noContent')}
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingContent.map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${getLanguageClass(content.language)}`}>
                      {content.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
                        {getTypeIcon(content.type)}
                        <span className="ml-1 capitalize">{content.type}</span>
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {content.language}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {isAuthenticated && (user?.role === 'admin' || user?.id === content.created_by) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingContent(content)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title="Edit Content"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContent(content.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Content"
                        disabled={!isOnline}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {content.description && (
                  <p className={`text-gray-600 text-sm mb-4 ${getLanguageClass(content.language)}`}>
                    {content.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Content</span>
                  </a>
                  <span className="text-xs text-gray-500">
                    by {content.created_by_name}
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
                onClick={() => loadTrainingContent(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => loadTrainingContent(page)}
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
                onClick={() => loadTrainingContent(pagination.currentPage + 1)}
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

export default Training;
