import React, { useState } from 'react';
import { DashboardLayout } from '@/src/pages/dashboard';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/state/store';
import { Settings, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/src/hooks/use-toast';

const SettingsPage = () => {
  const { user, profile, loading } = useSelector((state: RootState) => state.auth);
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "New password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      toast({ title: "Password changed successfully!", variant: "success" });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ title: err.message || "Failed to change password", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout loading={loading} profile={profile} user={user}>
      <div className="max-w-3xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] font-sora">Settings</h1>
        </div>

        <div className="bg-white border border-[#EAECF0] rounded-xl p-6 md:p-8 shadow-sm">
          <div className="mb-6 border-b border-[#EAECF0] pb-6">
            <h2 className="text-lg font-semibold text-[#111827] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0052FF]" />
              Change Password
            </h2>
            <p className="text-sm text-[#6E7C87] mt-1">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D0D5DD] focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] outline-none text-[#111827] text-sm pr-10"
                  required
                />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D0D5DD] focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] outline-none text-[#111827] text-sm pr-10"
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#344054] mb-1">Confirm New Password</label>
              <input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D0D5DD] focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] outline-none text-[#111827] text-sm"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0052FF] hover:bg-[#0040D0] text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
