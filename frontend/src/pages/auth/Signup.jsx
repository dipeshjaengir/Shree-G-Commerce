import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/slices/authSlice.js';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    if (!name) tempErrors.name = 'Full Name is required';
    
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address format';
    }

    if (!phone) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      tempErrors.phone = 'Invalid Indian mobile number (10 digits)';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters long';
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

    const resultAction = await dispatch(signupUser({ name, email, phone, password }));
    if (signupUser.fulfilled.match(resultAction)) {
      toast.success('Account created successfully! Welcome to Shree G.');
      navigate('/mart');
    } else {
      toast.error(resultAction.payload || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold tracking-wider text-xs mx-auto mb-2">
            SG
          </div>
          <span className="text-[10px] tracking-[0.4em] text-zinc-400 uppercase font-light">Create Account</span>
          <h2 className="text-xl font-light tracking-[0.2em] text-black uppercase">Join Shree G</h2>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="ENTER YOUR FULL NAME"
            required
          />

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
            label="Mobile Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="ENTER YOUR 10 DIGIT NUMBER"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="CREATE A PASSWORD"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="CONFIRM YOUR PASSWORD"
            required
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full pt-3"
          >
            CREATE ACCOUNT
          </Button>
        </form>

        {/* Footer split */}
        <div className="text-center pt-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-light">
            ALREADY HAVE AN ACCOUNT?{' '}
            <Link 
              to="/login" 
              className="text-black font-semibold uppercase hover:underline"
            >
              SIGN IN
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
};

export default Signup;
