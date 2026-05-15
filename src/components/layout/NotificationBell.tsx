"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Bell, Check, Loader2, MessageSquare, CreditCard, BookOpen, Settings, ExternalLink, Layout } from 'lucide-react';
import { notificationService, NotificationResponse } from '@/services/notificationService';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/routing';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useWebsocket } from '@/hooks/useWebsocket';
import { toast } from 'sonner';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Real-time notifications via WebSocket
  useWebsocket('/user/queue/notifications', (newNotification: NotificationResponse) => {
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Phát âm thanh báo hiệu hoặc hiển thị toast nhỏ
    toast.info(newNotification.title, {
      description: newNotification.message,
      action: newNotification.referenceUrl ? {
        label: 'Xem',
        onClick: () => router.push(newNotification.referenceUrl!)
      } : undefined
    });
  });

  useEffect(() => {
    fetchUnreadCount();
    // Poll for unread count every 30 seconds as a fallback
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch { /* Ignore */ }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(0, 5);
      setNotifications(data);
    } catch { /* Ignore */ }
    setLoading(false);
  };

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* Ignore */ }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* Ignore */ }
  };

  const handleNotificationClick = async (notification: NotificationResponse) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.referenceUrl) {
      router.push(notification.referenceUrl);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT': return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'ENROLLMENT': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'Q_AND_A': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'SYSTEM': return <Settings className="w-4 h-4 text-amber-500" />;
      case 'COURSE_UPDATE': return <ExternalLink className="w-4 h-4 text-purple-500" />;
      case 'COURSE_STATUS': return <Layout className="w-4 h-4 text-slate-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Thông báo</h3>
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Đánh dấu đã đọc tất cả
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <p className="text-xs text-slate-400">Đang tải thông báo...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Bell className="w-10 h-10 text-slate-100" />
                <p className="text-sm font-medium text-slate-400">Không có thông báo mới</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={cn(
                      "p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors relative group",
                      !n.isRead && "bg-indigo-50/30"
                    )}
                  >
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                        {getIcon(n.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm leading-snug", !n.isRead ? "font-bold text-slate-900" : "text-slate-600")}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                        </span>
                        {n.referenceUrl && (
                          <span className="text-[10px] text-indigo-500 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            Xem ngay <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded-full transition-all"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
            <button
              onClick={() => { setIsOpen(false); router.push('/notifications'); }}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
