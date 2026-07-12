import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password updated successfully! Please login with your new credentials.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 space-y-8 relative z-10 text-left">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold tracking-wider text-xs mx-auto mb-2">
            SG
          </div>
          <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Set New Password</span>
          <h2 className="text-xl font-light tracking-[0.2em] text-black uppercase">Reset Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-xs text-zinc-500 font-light leading-relaxed text-center">
            Set your new credentials. Please ensure it is different from your previous password.
          </p>

          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="CREATE NEW PASSWORD"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="CONFIRM NEW PASSWORD"
            required
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full pt-3"
          >
            UPDATE PASSWORD
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link 
            to="/login" 
            className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase font-semibold transition-all"
          >
            Back To Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
