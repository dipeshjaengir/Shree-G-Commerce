import React, { useState } from 'react';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import { toast } from 'react-hot-toast';

const AdminProfile = () => {
  const [name, setName] = useState('Admin Staff');
  const [email] = useState('admin@shreeg.com');
  const [phone, setPhone] = useState('9999999999');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setTimeout(() => {
      setProfileLoading(false);
      toast.success('Admin profile details updated!');
    }, 600);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      toast.success('Admin password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 600);
  };

  return (
    <div className="space-y-8 text-left max-w-2xl mx-auto">
      
      {/* Tab 1: Profile Details */}
      <form onSubmit={handleUpdateProfile} className="bg-white border border-zinc-200 p-8 space-y-4">
        <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
          Admin Profile Details
        </h3>
        
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NAME"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email Address"
            value={email}
            disabled
            placeholder="EMAIL"
          />
          <Input
            label="Phone Contact"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="PHONE"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={profileLoading}
          >
            Update Profile Info
          </Button>
        </div>
      </form>

      {/* Tab 2: Change Password */}
      <form onSubmit={handleChangePassword} className="bg-white border border-zinc-200 p-8 space-y-4">
        <h3 className="text-xs font-semibold tracking-widest uppercase border-b border-zinc-100 pb-2">
          Change Account Password
        </h3>
        
        <Input
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="CURRENT PASSWORD"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="NEW PASSWORD"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="CONFIRM NEW PASSWORD"
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={passwordLoading}
          >
            Change Password
          </Button>
        </div>
      </form>

    </div>
  );
};

export default AdminProfile;
