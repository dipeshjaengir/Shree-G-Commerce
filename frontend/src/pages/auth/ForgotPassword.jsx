import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Simulation recovery link written to backend log files.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch reset link.');
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
          <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Password Recovery</span>
          <h2 className="text-xl font-light tracking-[0.2em] text-black uppercase">Forgot Password</h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Enter the email address associated with your Shree G account. If it exists in our system, we will dispatch a reset link.
            </p>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR REGISTERED EMAIL"
              required
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full pt-3"
            >
              SEND RESET LINK
            </Button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              A secure password reset link was dispatched. Check your backend console/winston log streams to capture the generated URL link simulator.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="w-full pt-3"
            >
              BACK TO LOGIN
            </Button>
          </div>
        )}

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

export default ForgotPassword;
