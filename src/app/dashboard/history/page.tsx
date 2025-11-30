"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  Calendar,
  Clock,
  User,
  Heart,
  Volume2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface HistoryItem {
  id: string;
  text: string;
  voiceId: string;
  emotion: string;
  language: string;
  characterCount: number;
  audioUrl: string;
  status: string;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioRefs, setAudioRefs] = useState<{[key: string]: HTMLAudioElement}>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  // Ses karakteri adları
  const voiceNames: {[key: string]: string} = {
    '1': 'Ahmet (Erkek)',
    '2': 'Ayşe (Kadın)', 
    '3': 'Mehmet (Erkek)',
    '4': 'Zeynep (Kadın)'
  };

  // Duygu adları
  const emotionNames: {[key: string]: string} = {
    'neutral': 'Doğal',
    'happy': 'Mutlu',
    'sad': 'Üzgün',
    'angry': 'Kızgın',
    'fearful': 'Korkulu',
    'calm': 'Sakin',
    'disgusted': 'Tiksinmiş',
    'surprised': 'Şaşkın',
    'fluent': 'Akıcı'
  };

  useEffect(() => {
    fetchHistory();
  }, [pagination.page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/history?page=${pagination.page}&limit=${pagination.limit}`);
      
      if (response.ok) {
        const data = await response.json();
        setHistories(data.data.histories);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('History fetch hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (historyItem: HistoryItem) => {
    try {
      // Eğer başka bir ses çalıyorsa durdur
      if (playingId && playingId !== historyItem.id) {
        const currentAudio = audioRefs[playingId];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      // Eğer aynı ses çalıyorsa durdur
      if (playingId === historyItem.id) {
        const currentAudio = audioRefs[playingId];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        setPlayingId(null);
        return;
      }

      // Yeni ses oluştur veya mevcut olanı kullan
      let audio = audioRefs[historyItem.id];
      if (!audio) {
        audio = new Audio(historyItem.audioUrl);
        setAudioRefs(prev => ({ ...prev, [historyItem.id]: audio }));
        
        audio.onended = () => {
          setPlayingId(null);
        };
      }

      audio.play();
      setPlayingId(historyItem.id);
      
    } catch (error) {
      console.error('Ses oynatma hatası:', error);
    }
  };

  const handleDownload = (historyItem: HistoryItem) => {
    const link = document.createElement('a');
    link.href = historyItem.audioUrl;
    link.download = `yanki-ses-${historyItem.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (historyId: string) => {
    if (!confirm('Bu ses kaydını silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/history?id=${historyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Listeyi yenile
        fetchHistory();
      } else {
        alert('Kayıt silinemedi.');
      }
    } catch (error) {
      console.error('Delete hatası:', error);
      alert('Kayıt silinemedi.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-gray-600">Geçmiş yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-8 text-center">
            <Volume2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Henüz ses kaydınız yok
            </h2>
            <p className="text-gray-500 mb-6">
              İlk sesinizi oluşturmak için ana dashboard'a gidin
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Ses Oluştur
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Geçmiş Sesler</h1>
        <p className="text-gray-600">Oluşturduğunuz ses kayıtlarını görüntüleyin, oynatın ve indirin</p>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Volume2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
            <div className="text-sm text-gray-500">Toplam Ses</div>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {histories.reduce((sum, h) => sum + h.characterCount, 0)}
            </div>
            <div className="text-sm text-gray-500">Toplam Karakter</div>
          </div>
          <div className="text-center">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {histories.length > 0 ? formatDate(histories[0].createdAt).split(' ')[0] : '-'}
            </div>
            <div className="text-sm text-gray-500">Son Ses</div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {histories.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Text Preview */}
                <div className="mb-4">
                  <p className="text-gray-900 font-medium mb-2">
                    {item.text.length > 150 
                      ? `${item.text.substring(0, 150)}...` 
                      : item.text
                    }
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {voiceNames[item.voiceId] || `Voice ${item.voiceId}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {emotionNames[item.emotion] || item.emotion}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{item.characterCount}</span> karakter
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {item.status === 'completed' ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Tamamlandı
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handlePlay(item)}
                  className="flex items-center justify-center w-10 h-10 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg transition-colors"
                  title={playingId === item.id ? "Duraklat" : "Oynat"}
                >
                  {playingId === item.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => handleDownload(item)}
                  className="flex items-center justify-center w-10 h-10 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                  title="İndir"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Önceki
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 text-sm rounded-lg ${
                  pageNum === pagination.page
                    ? 'bg-cyan-400 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}