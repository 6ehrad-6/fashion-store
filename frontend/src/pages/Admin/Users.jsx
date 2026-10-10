import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX } from 'lucide-react';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  // تغییر نقش کاربر
  const changeRole = async (userId, newRole) => {
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      alert('✅ نقش کاربر با موفقیت تغییر کرد!');
    } catch (error) {
      console.error('Error changing role:', error);
      alert('❌ خطا در تغییر نقش کاربر!');
    }
  };

  // حذف کاربر
  const deleteUser = async (userId) => {
    if (window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
      try {
        await api.delete(`/auth/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        alert('✅ کاربر با موفقیت حذف شد!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('❌ خطا در حذف کاربر!');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B51F4] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت کاربران</h1>
          <p className="text-white/60 text-sm mt-1">{users.length} کاربر</p>
        </div>
      </div>

      {/* جستجو */}
      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          placeholder="جستجوی کاربران..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4]"
        />
      </div>

      {/* لیست کاربران */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-right text-white/60 text-sm">#</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">نام</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">ایمیل</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">نقش</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">تاریخ ثبت‌نام</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-white/40">
                    کاربری یافت نشد
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-white/60 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-white text-sm">{user.fullName}</td>
                    <td className="px-4 py-3 text-white/60 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-[#0B51F4]/20 text-[#0B51F4]' : 'bg-white/10 text-white/60'
                      }`}>
                        {user.role === 'admin' ? 'ادمین' : 'کاربر'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <button
                            onClick={() => changeRole(user._id, 'user')}
                            className="p-2 hover:bg-yellow-500/20 rounded-lg transition text-yellow-400"
                            title="تبدیل به کاربر"
                          >
                            <UserX size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => changeRole(user._id, 'admin')}
                            className="p-2 hover:bg-[#0B51F4]/20 rounded-lg transition text-[#0B51F4]"
                            title="تبدیل به ادمین"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        {user._id !== JSON.parse(localStorage.getItem('user'))?.id && (
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                            title="حذف کاربر"
                          >
                            <UserX size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;