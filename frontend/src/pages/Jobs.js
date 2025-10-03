import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  User, 
  Briefcase,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import axios from 'axios';

const Jobs = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { isOnline, saveOfflineData, getOfflineData } = useOffline();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    language: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Load jobs from API or offline storage
  const loadJobs = async (page = 1) => {
    try {
      setLoading(true);
      
      // Try to load from API if online
      if (isOnline) {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(searchTerm && { search: searchTerm }),
          ...(filters.category && { category: filters.category }),
          ...(filters.location && { location: filters.location }),
          ...(filters.language && { language: filters.language })
        });

        const response = await axios.get(`/api/jobs?${params}`);
        const data = response.data.data;
        
        setJobs(data.jobs);
        setPagination(data.pagination);
        
        // Save to offline storage
        saveOfflineData('jobs', data.jobs);
      } else {
        // Load from offline storage
        const offlineJobs = getOfflineData('jobs') || [];
        setJobs(offlineJobs);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      if (isOnline) {
        toast.error('Failed to load jobs');
      } else {
        const offlineJobs = getOfflineData('jobs') || [];
        setJobs(offlineJobs);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [searchTerm, filters, isOnline]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteJob = async (jobId) => {
    if (!isOnline) {
      toast.error('Cannot delete jobs while offline');
      return;
    }

    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/jobs/${jobId}`);
        toast.success('Job deleted successfully');
        loadJobs(pagination.currentPage);
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const getLanguageClass = (language) => {
    if (language === 'Hindi' || language === 'Marathi' || language === 'Varhadi') {
      return 'hindi-text';
    }
    return '';
  };

  const categories = ['Technology', 'Marketing', 'Sales', 'Content Writing', 'Customer Support'];
  const languages = ['English', 'Hindi', 'Marathi', 'Varhadi'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('jobs.title')}
          </h1>
          <p className="text-gray-600">
            Find job opportunities in your preferred language
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('jobs.searchPlaceholder')}
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
              <option value="">{t('jobs.allCategories')}</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

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
              <option value="">{t('jobs.allLanguages')}</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Job Button */}
        {isAuthenticated && (user?.role === 'admin' || user?.role === 'entrepreneur') && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{t('jobs.addJob')}</span>
            </button>
          </div>
        )}

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('jobs.noJobs')}
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${getLanguageClass(job.language)}`}>
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{job.created_by_name}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                        {job.category}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {job.language}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {isAuthenticated && (user?.role === 'admin' || user?.id === job.created_by) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingJob(job)}
                        className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Job"
                        disabled={!isOnline}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className={`text-gray-700 mb-4 ${getLanguageClass(job.language)}`}>
                  {job.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <button className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    ID: {job.id}
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
                onClick={() => loadJobs(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => loadJobs(page)}
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
                onClick={() => loadJobs(pagination.currentPage + 1)}
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

export default Jobs;
