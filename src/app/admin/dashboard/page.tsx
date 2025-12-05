'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, CreditCard, TrendingUp, CheckCircle, Clock, XCircle, Eye, Mail, Package, Loader, Users, Edit } from 'lucide-react';

// Plan name mapping
const planNames: { [key: string]: string } = {
  'baslangic': 'Başlangıç Paketi',
  'icerik': 'İçerik Üreticisi',
  'profesyonel': 'Profesyonel',
  'kurumsal': 'Kurumsal'
};

// Plan configurations with credits and limits
const planConfigs = {
  'baslangic': { credits: 10000, characterLimit: 10000, voiceCloningLimit: 1 },
  'icerik': { credits: 50000, characterLimit: 50000, voiceCloningLimit: 3 },
  'profesyonel': { credits: 100000, characterLimit: 100000, voiceCloningLimit: 5 },
  'kurumsal': { credits: 500000, characterLimit: 500000, voiceCloningLimit: 20 }
};

interface PaymentNotification {
  id: string;
  customerName: string;
  email: string;
  plan: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<PaymentNotification | null>(null);
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'users'>('payments');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    // Check admin authentication
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    try {
      const session = JSON.parse(adminSession);
      if (session.email === '061968@yankitr.com') {
        setIsAuthenticated(true);
        if (activeTab === 'payments') {
          fetchNotifications();
        } else {
          fetchUsers();
        }
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/payment-notifications', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data || []);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  const updateNotificationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/payment-notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ id, status })
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id
              ? { ...notification, status }
              : notification
          )
        );
        setSelectedNotification(null);
        
        // Refresh data
        await fetchNotifications();
      } else {
        alert('Durum güncellenemedi');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      alert('Bir hata oluştu');
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const config = planConfigs[newPlan as keyof typeof planConfigs];
      if (!config) {
        alert('Geçersiz plan seçimi');
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({
          plan: newPlan,
          credits: config.credits,
          characterLimit: config.characterLimit,
          voiceCloningLimit: config.voiceCloningLimit
        })
      });

      if (response.ok) {
        // Update local user state
        setUsers(prev =>
          prev.map(user =>
            user.id === userId
              ? { ...user, plan: newPlan, credits: config.credits }
              : user
          )
        );
        
        // Update selected user if it's the same user
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, plan: newPlan, credits: config.credits });
        }
        
        alert(`Plan başarıyla ${planNames[newPlan]} olarak güncellendi!`);
      } else {
        alert('Plan güncellenemedi');
      }
    } catch (error) {
      console.error('Error updating user plan:', error);
      alert('Bir hata oluştu');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: notifications.length,
    pending: notifications.filter(n => n.status === 'pending').length,
    approved: notifications.filter(n => n.status === 'approved').length,
    rejected: notifications.filter(n => n.status === 'rejected').length,
    totalRevenue: notifications
      .filter(n => n.status === 'approved')
      .reduce((sum, n) => sum + n.amount, 0)
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <div className="text-white font-bold">Y</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-600 text-sm">Yankı AI Yönetim Sistemi</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={18} />
            Çıkış
          </button>
        </div>
      </header>

      <div className="p-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Toplam Bildirim</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Onaylanan</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Reddedilen</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Toplam Gelir</p>
                <p className="text-2xl font-bold text-green-600">₺{stats.totalRevenue.toLocaleString('tr-TR')}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 mb-8">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab('payments');
                fetchNotifications();
              }}
              className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'payments'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell size={18} />
              Ödeme Bildirimleri
            </button>
            <button
              onClick={() => {
                setActiveTab('users');
                fetchUsers();
              }}
              className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={18} />
              Kullanıcı Yönetimi
            </button>
          </div>
        </div>

        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Notifications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Ödeme Bildirimleri</h2>
                  <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status === 'all' ? 'Tümü' : 
                         status === 'pending' ? 'Bekleyen' :
                         status === 'approved' ? 'Onaylı' : 'Reddedilen'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-slate-600">Yükleniyor...</span>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    Henüz bildirim bulunmuyor
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedNotification(notification)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{notification.customerName}</p>
                            <p className="text-sm text-slate-600">{planNames[notification.plan] || notification.plan}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₺{notification.amount.toLocaleString('tr-TR')}</p>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(notification.status)}`}>
                            {getStatusIcon(notification.status)}
                            {notification.status === 'pending' ? 'Bekliyor' :
                             notification.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Notification Detail Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              {selectedNotification ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">Bildirim Detayı</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Adı</label>
                      <p className="text-slate-900 font-medium">{selectedNotification.customerName}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <p className="text-slate-700">{selectedNotification.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Seçilen Paket</label>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <p className="text-slate-700">{planNames[selectedNotification.plan] || selectedNotification.plan}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ödeme Tutarı</label>
                      <p className="text-2xl font-bold text-green-600">₺{selectedNotification.amount.toLocaleString('tr-TR')}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                      <p className="text-slate-700">
                        {new Date(selectedNotification.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(selectedNotification.status)}`}>
                        {getStatusIcon(selectedNotification.status)}
                        {selectedNotification.status === 'pending' ? 'Bekliyor' :
                         selectedNotification.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                      </div>
                    </div>

                    {selectedNotification.status === 'pending' && (
                      <div className="pt-4 space-y-3">
                        <button
                          onClick={() => updateNotificationStatus(selectedNotification.id, 'approved')}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => updateNotificationStatus(selectedNotification.id, 'rejected')}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-12">
                  <Eye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p>Detay görüntülemek için bir bildirim seçin</p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Users List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Kullanıcı Listesi</h2>
                </div>

                {/* Users List */}
                <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-slate-600">Yükleniyor...</span>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      Henüz kullanıcı bulunmuyor
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{user.name || 'Adı Belirtilmemiş'}</p>
                              <p className="text-sm text-slate-600">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-slate-900 capitalize">{planNames[user.plan] || user.plan}</p>
                            <p className="text-sm text-slate-500">{user.credits} kredi</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* User Detail Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                {selectedUser ? (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Edit className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-bold text-slate-900">Kullanıcı Düzenle</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
                        <p className="text-slate-900 font-medium">{selectedUser.name || 'Adı Belirtilmemiş'}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <p className="text-slate-700">{selectedUser.email}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mevcut Plan</label>
                        <p className="text-slate-700 font-medium">{planNames[selectedUser.plan] || selectedUser.plan}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Krediler</label>
                        <p className="text-2xl font-bold text-green-600">{selectedUser.credits.toLocaleString('tr-TR')}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kayıt Tarihi</label>
                        <p className="text-slate-700">
                          {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="pt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Hızlı Plan Değişikliği</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => updateUserPlan(selectedUser.id, 'baslangic')}
                              disabled={selectedUser.plan === 'baslangic'}
                              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                                selectedUser.plan === 'baslangic'
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              Başlangıç
                            </button>
                            <button
                              onClick={() => updateUserPlan(selectedUser.id, 'icerik')}
                              disabled={selectedUser.plan === 'icerik'}
                              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                                selectedUser.plan === 'icerik'
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              İçerik
                            </button>
                            <button
                              onClick={() => updateUserPlan(selectedUser.id, 'profesyonel')}
                              disabled={selectedUser.plan === 'profesyonel'}
                              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                                selectedUser.plan === 'profesyonel'
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
                              Profesyonel
                            </button>
                            <button
                              onClick={() => updateUserPlan(selectedUser.id, 'kurumsal')}
                              disabled={selectedUser.plan === 'kurumsal'}
                              className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                                selectedUser.plan === 'kurumsal'
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              }`}
                            >
                              Kurumsal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-12">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p>Düzenlemek için bir kullanıcı seçin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}