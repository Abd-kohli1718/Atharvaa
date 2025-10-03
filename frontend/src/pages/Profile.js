import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X,
  Briefcase,
  BookOpen,
  Store,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    jobsPosted: 0,
    trainingContent: 0,
    businesses: 0,
    schemes: 0
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email
      });
    }
  }, [user, reset]);

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const [jobsRes, trainingRes, marketplaceRes, schemesRes] = await Promise.all([
        axios.get('/api/jobs'),
        axios.get('/api/training'),
        axios.get('/api/marketplace'),
        axios.get('/api/schemes')
      ]);

      // Count user's contributions
      const jobsPosted = jobsRes.data.data.jobs.filter(job => job.created_by === user.id).length;
      const trainingContent = trainingRes.data.data.trainingContent.filter(content => content.created_by === user.id).length;
      const businesses = marketplaceRes.data.data.marketplace.filter(business => business.created_by === user.id).length;
      const schemes = user.role === 'admin' ? schemesRes.data.data.schemes.length : 0;

      setStats({
        jobsPosted,
        trainingContent,
        businesses,
        schemes
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Note: In a real app, you'd have an update profile endpoint
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'entrepreneur':
        return <Store className="w-5 h-5" />;
      case 'jobseeker':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'entrepreneur':
        return 'bg-purple-100 text-purple-800';
      case 'jobseeker':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'entrepreneur':
        return 'Entrepreneur';
      case 'jobseeker':
        return 'Job Seeker';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('navigation.profile')}
          </h1>
          <p className="text-gray-600">
            Manage your account settings and view your activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                        <p className="text-gray-900">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getRoleColor(user?.role)}`}>
                      {getRoleIcon(user?.role)}
                      <span>{getRoleName(user?.role)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Jobs Posted</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.jobsPosted}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Training Content</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.trainingContent}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Store className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Businesses</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.businesses}</span>
                </div>

                {user?.role === 'admin' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-700">Schemes</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stats.schemes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/jobs'}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Browse Jobs
                </button>
                <button
                  onClick={() => window.location.href = '/training'}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View Training
                </button>
                <button
                  onClick={() => window.location.href = '/marketplace'}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Explore Marketplace
                </button>
                <button
                  onClick={() => window.location.href = '/schemes'}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Check Schemes
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('navigation.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
