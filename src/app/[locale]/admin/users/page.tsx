"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Users, 
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import adminService from '@/services/adminService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  status: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'STUDENT' | 'TUTOR'>('STUDENT');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(role);
      setUsers(data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage all platform users and their roles</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden p-1 shadow-sm">
          <div className="flex items-center px-4 gap-2 text-slate-400">
             <Search className="w-4 h-4" />
             <input 
               type="text" 
               placeholder="Search users..." 
               className="border-none outline-none text-sm w-64 text-slate-800 placeholder-slate-400 py-2"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
      </div>

      {/* Role Selection Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setRole('STUDENT')}
            className={cn(
              "flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all",
              role === 'STUDENT' 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <UserIcon className="w-4 h-4" />
            Students
          </button>
          <button
            onClick={() => setRole('TUTOR')}
            className={cn(
              "flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all",
              role === 'TUTOR' 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Shield className="w-4 h-4" />
            Tutors
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <Users className="w-5 h-5 text-indigo-500" />
               {role === 'STUDENT' ? 'Student' : 'Tutor'} List
               <span className="bg-slate-100 text-slate-600 py-0.5 px-3 rounded-full text-xs font-bold ml-2">
                 {filteredUsers.length}
               </span>
            </h3>
         </div>

         {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
               <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
               <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Loading users...</p>
            </div>
         ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                  <AlertCircle className="w-10 h-10" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-2">No Users Found</h4>
               <p className="text-slate-500 text-sm max-w-sm font-medium">There are no {role.toLowerCase()}s matching your search.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                     <tr>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">User</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Contact</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Status</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px]">Joined Date</th>
                        <th className="px-8 py-5 uppercase tracking-wider text-[10px] text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                    {user.avatarUrl ? (
                                       <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold">
                                          {user.username.substring(0, 2).toUpperCase()}
                                       </div>
                                    )}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">{user.fullName || user.username}</span>
                                    <span className="text-[11px] text-slate-400 font-medium">@{user.username}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-slate-600">
                                 <Mail className="w-3.5 h-3.5 text-slate-400" />
                                 <span className="font-medium">{user.email || 'N/A'}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                user.status === 'ACTIVE' 
                                  ? "bg-green-50 text-green-700 border-green-100" 
                                  : "bg-red-50 text-red-700 border-red-100"
                              )}>
                                {user.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {user.status || 'ACTIVE'}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="font-medium text-slate-600">
                                {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs border-slate-200 hover:bg-slate-50">
                                Details
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
}
