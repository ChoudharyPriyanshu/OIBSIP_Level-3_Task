import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError } from '../../store/slices/authSlice';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import { ButtonLoader } from '../../components/Loader';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const result = await dispatch(updateProfile(formData));
      if (updateProfile.fulfilled.match(result)) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-blue-100">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  Administrator
                </span>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                      isEditing 
                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // Email should not be editable
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                      isEditing 
                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    rows={3}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-colors ${
                      isEditing 
                        ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? <ButtonLoader /> : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Orders Placed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">₹0</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Favorite Pizzas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;