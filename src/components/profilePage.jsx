import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import api from '../api/axios';  // Import custom axios instance
import '../App.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});
  setMessage({ type: '', text: '' });

  const newErrors = {};
  if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
  if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
  if (!formData.current_password) {
    newErrors.current_password = 'Current password is required to save changes';
  }

  if (formData.password || formData.password_confirmation) {
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false);
    return;
  }

  try {
    const dataToSend = {
      email: user.email,
      current_password: formData.current_password,
      first_name: formData.first_name,
      last_name: formData.last_name
    };

    if (formData.password) {
      dataToSend.password = formData.password;
      dataToSend.password_confirmation = formData.password_confirmation;
    }

    const response = await api.put('/users', { user: dataToSend });

    const updatedUser = {
      ...response.data.user,
      first_name: response.data.user.first_name,
      last_name: response.data.user.last_name
    };

    if (setUser) {
      setUser(updatedUser);
    }
    
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setIsEditing(false);

    setFormData(prev => ({
      ...prev,
      first_name: response.data.user.first_name,
      last_name: response.data.user.last_name,
      current_password: '',
      password: '',
      password_confirmation: ''
    }));
    
  } catch (error) {
    if (error.response?.data?.errors) {
      if (typeof error.response.data.errors === 'object') {
        setErrors(error.response.data.errors);
      } else {
        setMessage({ 
          type: 'error', 
          text: error.response.data.errors.join(', ') 
        });
      }
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
    }
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      current_password: '',
      password: '',
      password_confirmation: ''
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="container-md">
      <h1 className="profile-header">My Profile</h1>

      <div className="profile-card">
        <div className="profile-header-section">
          <div className="profile-avatar">
            {user?.first_name?.charAt(0).toUpperCase() || ''}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">
              {formData.first_name} {formData.last_name}
            </h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-fields">
          <div className="profile-group">
            <label className="profile-label">First Name *</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              disabled={!isEditing}
              className="profile-input"
            />
            {errors.first_name && (
              <span className="error-text">{errors.first_name}</span>
            )}
          </div>

          <div className="profile-group">
            <label className="profile-label">Last Name *</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              disabled={!isEditing}
              className="profile-input"
            />
            {errors.last_name && (
              <span className="error-text">{errors.last_name}</span>
            )}
          </div>

          <div className="profile-group">
            <label className="profile-label">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="profile-input"
            />
            <small className="profile-text">Email cannot be changed</small>
          </div>

          {isEditing && (
            <>
              <hr />
              <h3>Change Password (Optional)</h3>

              <div className="profile-group">
                <label className="profile-label">New Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="profile-input"
                  placeholder="Leave blank to keep current password"
                />
                {errors.password && (
                  <span className="error-text">{errors.password} </span>
                )}
              </div>

              <div className="profile-group">
                <label className="profile-label">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="profile-input"
                />
                {errors.password_confirmation && (
                  <span className="error-text">{errors.password_confirmation} </span>
                )}
              </div>

              <hr />

              <div className="profile-group">
                <label className="profile-label">Current Password *</label>
                <input
                  type="password"
                  value={formData.current_password}
                  onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                  className="profile-input"
                  placeholder="Required to save changes"
                  required
                />
                {errors.current_password && (
                  <span className="error-text">{errors.current_password} </span>
                )}
                <small className="profile-text">
                  Enter your current password to confirm changes
                </small>
              </div>
            </>
          )}

          <div className="profile-group" style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {!isEditing ? (
              <button 
                type="button"
                onClick={() => setIsEditing(true)} 
                className="btn-action btn"
                style = {{ width: '50%', margin: '0 auto' }}

              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  type="submit" 
                  className="btn"
                  disabled={loading}
                  style = {{backgroundColor: '#19733a'}}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button"
                  onClick={handleCancel} 
                  className="btn-cancel btn"
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export { ProfilePage };