import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import '../App.css';
import { post } from '../api/axios';


export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '' });
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await post(
        "/users/sign_in",
        { user: { email: formData.email, password: formData.password } }
      );

      if (res.redirect_url) {

        window.location.href = res.redirect_url;
      } else {
        login({
          email: res.user.email,
          role: res.user.role,
          first_name: res.user.first_name,
          last_name: res.user.last_name
        }, res.token);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.error || "Invalid password or email"));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const data = await post(
        "/users",
        {
          user: {
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password,
            first_name: formData.first_name
          }
        }
      );

      login({
        email: data.user.email,
        role: data.user.role,
        first_name: data.user.first_name || data.user.email.split('@')[0]
      }, data.token);

    } catch (err) {
      console.error(err.response?.data);
      alert("Signup failed: " + (err.response?.data?.errors?.join(", ") || " "));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      if (isLogin) {
        handleLogin(e);
      } else {
        handleSignup(e);
      }
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <ShoppingBag size={48} color="rgba(2, 150, 176, 1)" />
          </div>
          <h1>
            {isLogin ? 'Welcome Back Stage' : 'Create Account Stage'}
          </h1>
          <p className="auth-sublogin">
            {isLogin ? 'Log In' : 'Sign Up'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="auth-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="auth-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="auth-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-action">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          <button onClick={() => setIsLogin(!isLogin)} className="link-button" type="button">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};