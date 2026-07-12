import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice.js';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address format';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Welcome back to Shree G!');
      navigate('/mart');
    } else {
      toast.error(resultAction.payload || 'Invalid credentials or account locked.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold tracking-wider text-xs mx-auto mb-2">
            SG
          </div>
          <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Console Login</span>
          <h2 className="text-xl font-light tracking-[0.2em] text-black uppercase">Welcome Back</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="ENTER YOUR EMAIL"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="ENTER YOUR PASSWORD"
            required
          />

          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-[9px] tracking-widest text-zinc-400 hover:text-black uppercase font-light"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full pt-3"
          >
            SIGN IN
          </Button>
        </form>

        {/* Footer split */}
        <div className="text-center pt-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-light">
            DON'T HAVE AN ACCOUNT?{' '}
            <Link 
              to="/signup" 
              className="text-black font-semibold uppercase hover:underline"
            >
              CREATE ONE
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
};

export default Login;
