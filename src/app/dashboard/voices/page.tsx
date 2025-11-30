'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Play, Heart, Download, Volume2, Sparkles, Search, Filter,
  Headphones, Mic, Music, Star, ArrowRight, Plus, X, Pause
} from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  avatar: string;
  initials: string;
  color: string;
  category: string;
  language: string;
  gender: string;
  age: string;
  useCase: string[];
  isFavorite?: boolean;
}

interface UserFavorite {
  id: string;
  voiceId: string;
  voiceName: string;
  createdAt: string;
}

export default function VoicesPage() {
  const { data: session } = useSession();
  const [voices] = useState<Voice[]>([
    // Türkçe Ana Sesler (1-4)
    {
      id: '1',
      name: 'Mert',
      description: 'Belgesel ve Anlatım',
      characteristics: ['Sakin', 'Derin', 'Otoriter'],
      avatar: '/avatars/mert.jpg',
      initials: 'MB',
      color: 'from-slate-500 to-slate-700',
      category: 'Belgesel',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Orta Yaş',
      useCase: ['Belgesel', 'Eğitim', 'Kurumsal Sunum']
    },
    {
      id: '2',
      name: 'Emel',
      description: 'Masal ve Hikaye',
      characteristics: ['Yumuşak', 'Akıcı', 'Heyecanlı'],
      avatar: '/avatars/emel.jpg',
      initials: 'EM',
      color: 'from-purple-500 to-purple-700',
      category: 'Masalcı',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['Masallar', 'Çocuk Kitapları', 'Hikaye Anlatımı']
    },
    {
      id: '3',
      name: 'Aslı',
      description: 'Youtube ve Sosyal Medya',
      characteristics: ['Enerjik', 'Modern', 'Sosyal'],
      avatar: '/avatars/asli.jpg',
      initials: 'AS',
      color: 'from-red-500 to-red-700',
      category: 'Youtube',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['Youtube', 'Sosyal Medya', 'Podcast', 'Reklam']
    },
    {
      id: '4',
      name: 'Merve',
      description: 'Çocuk ve Eğitim',
      characteristics: ['Tatlı', 'Nazik', 'Sevimli'],
      avatar: '/avatars/merve.jpg',
      initials: 'MV',
      color: 'from-pink-500 to-pink-700',
      category: 'Çocuk',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['Çocuk Eğitimi', 'Oyun', 'Çizgi Film']
    },
    
    // Premium Uluslararası Sesler (Türkçe İsimlerle)
    {
      id: 'Spanish_SophisticatedLady',
      name: 'Selin',
      description: 'Zarif Kadın',
      characteristics: ['Zarif', 'Sofistike', 'Şık'],
      avatar: '/avatars/selin.jpg',
      initials: 'SL',
      color: 'from-indigo-500 to-indigo-700',
      category: 'Premium',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Yetişkin',
      useCase: ['Lüks Marka', 'Kurumsal', 'Sanat']
    },
    {
      id: 'English_Trustworth_Man',
      name: 'Taner',
      description: 'Güvenilir Adam',
      characteristics: ['Güvenilir', 'Resonant', 'Samimi'],
      avatar: '/avatars/taner.jpg',
      initials: 'TN',
      color: 'from-blue-600 to-blue-800',
      category: 'İş Dünyası',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Kurumsal', 'Güvenilirlik', 'İş']
    },
    {
      id: 'English_CaptivatingStoryteller',
      name: 'Okan',
      description: 'Büyüleyici Anlatıcı',
      characteristics: ['Büyüleyici', 'Soğuk', 'Yaşlı'],
      avatar: '/avatars/okan.jpg',
      initials: 'OK',
      color: 'from-gray-600 to-gray-800',
      category: 'Anlatım',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yaşlı',
      useCase: ['Hikaye', 'Belgesel', 'Kitap']
    },
    {
      id: 'English_ManWithDeepVoice',
      name: 'Murat',
      description: 'Derin Sesli Adam',
      characteristics: ['Derin', 'Komutan', 'Güçlü'],
      avatar: '/avatars/murat.jpg',
      initials: 'MU',
      color: 'from-stone-600 to-stone-800',
      category: 'Güçlü',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Aksiyon', 'Otorite', 'Reklam']
    },
    {
      id: 'English_Graceful_Lady',
      name: 'Gül',
      description: 'Zarif Hanım',
      characteristics: ['Zarif', 'Orta Yaş', 'Şık'],
      avatar: '/avatars/gul.jpg',
      initials: 'GL',
      color: 'from-rose-500 to-rose-700',
      category: 'Zarif',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Orta Yaş',
      useCase: ['Lüks', 'Sanat', 'Kültür']
    },
    {
      id: 'English_Whispering_girl_v3',
      name: 'Fısıltı',
      description: 'Fısıldayan Kız',
      characteristics: ['Fısıltı', 'ASMR', 'Yumuşak'],
      avatar: '/avatars/fisiltı.jpg',
      initials: 'FI',
      color: 'from-pink-300 to-pink-500',
      category: 'ASMR',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['ASMR', 'Meditasyon', 'Rahatlama']
    },
    {
      id: 'English_patient_man_v1',
      name: 'Polat',
      description: 'Sabırlı Adam',
      characteristics: ['Sabırlı', 'Yumuşak', 'Sakin'],
      avatar: '/avatars/polat.jpg',
      initials: 'PL',
      color: 'from-green-600 to-green-800',
      category: 'Sakin',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Eğitim', 'Terapötik', 'Rehberlik']
    },
    {
      id: 'English_MatureBoss',
      name: 'Vildan',
      description: 'Otoriter Hanım',
      characteristics: ['Otoriter', 'Orta Yaş', 'Güçlü'],
      avatar: '/avatars/vildan.jpg',
      initials: 'VL',
      color: 'from-red-600 to-red-800',
      category: 'Otorite',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Orta Yaş',
      useCase: ['Yönetim', 'Otorite', 'İş']
    },
    {
      id: 'English_MaturePartner',
      name: 'Volkan',
      description: 'Olgun Partner',
      characteristics: ['Nazik', 'Orta Yaş', 'Sevgi Dolu'],
      avatar: '/avatars/volkan.jpg',
      initials: 'VK',
      color: 'from-emerald-600 to-emerald-800',
      category: 'Partner',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Orta Yaş',
      useCase: ['Romantik', 'Partner', 'Samimi']
    },
    {
      id: 'moss_audio_737a299c-734a-11f0-918f-4e0486034804',
      name: 'Kemal',
      description: 'Bilgi Hapı',
      characteristics: ['Canlı', 'Güvenilir', 'Genç'],
      avatar: '/avatars/kemal.jpg',
      initials: 'KM',
      color: 'from-cyan-500 to-cyan-700',
      category: 'Bilgi',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Genç',
      useCase: ['Eğitim', 'Bilgi', 'Tutorial']
    },
    {
      id: 'moss_audio_c12a59b9-7115-11f0-a447-9613c873494c',
      name: 'Elif',
      description: 'Etkileyici Kız',
      characteristics: ['Etkileyici', 'Genç', 'Canlı'],
      avatar: '/avatars/elif.jpg',
      initials: 'EL',
      color: 'from-orange-500 to-orange-700',
      category: 'Genç',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['Sosyal Medya', 'Pazarlama', 'Genç']
    },
    {
      id: 'English_CalmWoman',
      name: 'Seren',
      description: 'Sakin Kadın',
      characteristics: ['Sakin', 'Huzurlu', 'Dingin'],
      avatar: '/avatars/seren.jpg',
      initials: 'SR',
      color: 'from-blue-400 to-blue-600',
      category: 'Sakin',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Yetişkin',
      useCase: ['Meditasyon', 'Terapi', 'Sağlık']
    },
    {
      id: 'English_magnetic_voiced_man',
      name: 'Mehmet',
      description: 'Manyetik Sesli Erkek',
      characteristics: ['Manyetik', 'İkna Edici', 'Çekici'],
      avatar: '/avatars/mehmet.jpg',
      initials: 'MH',
      color: 'from-violet-600 to-violet-800',
      category: 'Çekici',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Satış', 'İkna', 'Pazarlama']
    },
    {
      id: 'English_UpsetGirl',
      name: 'Seda',
      description: 'Üzgün Kız',
      characteristics: ['Üzgün', 'Şık', 'Duygusal'],
      avatar: '/avatars/seda.jpg',
      initials: 'SD',
      color: 'from-gray-400 to-gray-600',
      category: 'Duygusal',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['Drama', 'Duygusal', 'Hikaye']
    },
    {
      id: 'English_captivating_female1',
      name: 'Ceyda',
      description: 'Büyüleyici Kadın',
      characteristics: ['Büyüleyici', 'Profesyonel', 'İdeal'],
      avatar: '/avatars/ceyda.jpg',
      initials: 'CY',
      color: 'from-teal-500 to-teal-700',
      category: 'Büyüleyici',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Yetişkin',
      useCase: ['Profesyonel', 'Sunucu', 'Haber']
    },
    {
      id: 'English_PlayfulGirl',
      name: 'Pınar',
      description: 'Oyuncu Kız',
      characteristics: ['Oyuncu', 'Neşeli', 'Eğlenceli'],
      avatar: '/avatars/pinar.jpg',
      initials: 'PN',
      color: 'from-yellow-500 to-yellow-700',
      category: 'Eğlenceli',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['Çocuk', 'Oyun', 'Eğlence']
    },
    {
      id: 'English_Gentle-voiced_man',
      name: 'Güneş',
      description: 'Nazik Sesli Adam',
      characteristics: ['Nazik', 'Resonant', 'Sevecen'],
      avatar: '/avatars/gunes.jpg',
      initials: 'GN',
      color: 'from-green-500 to-green-700',
      category: 'Nazik',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Nazik', 'Özen', 'Yardım']
    },
    {
      id: 'English_Upbeat_Woman',
      name: 'Berna',
      description: 'Neşeli Kadın',
      characteristics: ['Neşeli', 'Parlak', 'Pozitif'],
      avatar: '/avatars/berna.jpg',
      initials: 'BR',
      color: 'from-amber-500 to-amber-700',
      category: 'Neşeli',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Yetişkin',
      useCase: ['Pozitif', 'Motivasyon', 'Enerji']
    },
    {
      id: 'English_ReservedYoungMan',
      name: 'Rıza',
      description: 'Mesafeli Genç Adam',
      characteristics: ['Mesafeli', 'Soğuk', 'Ciddi'],
      avatar: '/avatars/riza.jpg',
      initials: 'RZ',
      color: 'from-slate-400 to-slate-600',
      category: 'Mesafeli',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Genç',
      useCase: ['Mesafeli', 'Ciddi', 'Soğuk']
    },
    {
      id: 'moss_audio_6dc281eb-713c-11f0-a447-9613c873494c',
      name: 'Büyükanne',
      description: 'Bilge Büyükanne',
      characteristics: ['Bilge', 'Sıcak', 'Yaşlı'],
      avatar: '/avatars/buyukanne.jpg',
      initials: 'BÜ',
      color: 'from-amber-600 to-amber-800',
      category: 'Bilge',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Yaşlı',
      useCase: ['Hikaye', 'Bilgelik', 'Aile']
    },
    {
      id: 'English_Diligent_Man',
      name: 'Deniz',
      description: 'Çalışkan Adam',
      characteristics: ['Çalışkan', 'Samimi', 'Güvenilir'],
      avatar: '/avatars/deniz.jpg',
      initials: 'DN',
      color: 'from-orange-600 to-orange-800',
      category: 'Çalışkan',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Dürüstlük', 'Çalışma', 'İş']
    },
    {
      id: 'English_expressive_narrator',
      name: 'Erdal',
      description: 'İfadeli Anlatıcı',
      characteristics: ['İfadeli', 'Şık', 'Sesli Kitap'],
      avatar: '/avatars/erdal.jpg',
      initials: 'ER',
      color: 'from-purple-600 to-purple-800',
      category: 'Anlatım',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Sesli Kitap', 'Anlatım', 'Kitap']
    },
    {
      id: 'English_radiant_girl',
      name: 'Rabia',
      description: 'Parlak Kız',
      characteristics: ['Parlak', 'Canlı', 'Pozitif'],
      avatar: '/avatars/rabia.jpg',
      initials: 'RB',
      color: 'from-pink-400 to-pink-600',
      category: 'Parlak',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Genç',
      useCase: ['Enerji', 'Parlaklık', 'Pozitif']
    },
    {
      id: 'moss_audio_a0d611da-737c-11f0-ad20-f2bc95e89150',
      name: 'Denizhan',
      description: 'Yaklaşılabilir Adam',
      characteristics: ['Yaklaşılabilir', 'Sıcak', 'Orta Yaş'],
      avatar: '/avatars/denizhan.jpg',
      initials: 'DH',
      color: 'from-blue-500 to-blue-700',
      category: 'Yaklaşılabilir',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Orta Yaş',
      useCase: ['Tanıtım', 'Karşılama', 'Sıcak']
    },
    {
      id: 'moss_audio_570551b1-735c-11f0-b236-0adeeecad052',
      name: 'Kenan',
      description: 'Karşıt Görüşlü',
      characteristics: ['Kendinden Emin', 'Güçlü', 'Küstah'],
      avatar: '/avatars/kenan.jpg',
      initials: 'KN',
      color: 'from-red-500 to-red-700',
      category: 'Karşıt',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Yetişkin',
      useCase: ['Tartışma', 'Karşıt Görüş', 'Güçlü']
    },
    {
      id: 'English_compelling_lady1',
      name: 'Canan',
      description: 'İkna Edici Hanım',
      characteristics: ['İkna Edici', 'Şık', 'Otoriter'],
      avatar: '/avatars/canan.jpg',
      initials: 'CN',
      color: 'from-indigo-600 to-indigo-800',
      category: 'İkna Edici',
      language: 'Türkçe',
      gender: 'Kadın',
      age: 'Yetişkin',
      useCase: ['Yayın', 'Resmi', 'Duyuru']
    },
    {
      id: 'moss_audio_4f4172f4-737b-11f0-9540-7ef9b4b62566',
      name: 'Can',
      description: 'Mütevazı Adam',
      characteristics: ['Mütevazı', 'Sessiz', 'Orta Yaş'],
      avatar: '/avatars/can.jpg',
      initials: 'CA',
      color: 'from-gray-500 to-gray-700',
      category: 'Mütevazı',
      language: 'Türkçe',
      gender: 'Erkek',
      age: 'Orta Yaş',
      useCase: ['Hobiler', 'Mütevazı', 'Sessiz']
    }
  ]);

  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  const categories = ['Tümü', 'Belgesel', 'Masalcı', 'Youtube', 'Çocuk', 'Premium', 'İş Dünyası', 'Anlatım', 'ASMR', 'Sakin', 'Zarif', 'Eğlenceli'];
  
  const demoTexts: { [key: string]: string } = {
    '1': 'İnsanlık tarihinde teknolojinin gelişimi, her zaman merak ve keşif duygusundan kaynaklanmıştır.',
    '2': 'Bir zamanlar uzak diyarlarda, bulutların arasında yaşayan küçük bir ejder vardı.',
    '3': 'Merhaba arkadaşlar! Bugün sizlerle harika bir deneyim paylaşacağım.',
    '4': 'Merhaba küçük dostlarım! Birlikte eğlenceli bir yolculuğa çıkıyoruz.',
    'English_CaptivatingStoryteller': 'In the depths of ancient forests, where shadows dance with moonlight...',
    'English_Trustworth_Man': 'Trust is the foundation of every successful business relationship.',
    'Spanish_SophisticatedLady': 'La elegancia y la sofisticación definen nuestra marca única.',
    'English_Whispering_girl_v3': 'Close your eyes and let the gentle whispers guide you to peace...'
  };

  // Favorileri getir
  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      console.log('Favorites response:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Favorites data:', data);
        setFavorites(data.favorites || []);
      } else {
        console.error('Failed to fetch favorites:', response.status);
      }
    } catch (error) {
      console.error('Favoriler alınamadı:', error);
    }
  };

  const toggleFavorite = async (voice: Voice) => {
    if (!session?.user?.id) {
      alert('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    const isFavorite = favorites.some(fav => fav.voiceId === voice.id);
    console.log('Toggle favorite:', voice.id, 'isFavorite:', isFavorite);
    
    try {
      if (isFavorite) {
        // Favorilerden çıkar
        const response = await fetch(`/api/favorites?voiceId=${voice.id}`, {
          method: 'DELETE'
        });
        
        console.log('Delete favorite response:', response.status);
        if (response.ok) {
          setFavorites(prev => prev.filter(fav => fav.voiceId !== voice.id));
        } else {
          const error = await response.text();
          console.error('Failed to delete favorite:', error);
        }
      } else {
        // Favorilere ekle
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voiceId: voice.id,
            voiceName: `${voice.name} - ${voice.description}`
          })
        });
        
        console.log('Add favorite response:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Added favorite data:', data);
          setFavorites(prev => [...prev, data.favorite]);
        } else {
          const error = await response.text();
          console.error('Failed to add favorite:', error);
        }
      }
    } catch (error) {
      console.error('Favori işlemi başarısız:', error);
      alert('Favori işlemi başarısız oldu');
    }
  };

  const playDemo = async (voiceId: string) => {
    const demoText = demoTexts[voiceId] || 'Hello, this is a sample text for voice demonstration.';
    
    setIsGenerating(voiceId);
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: demoText,
          voice_id: voiceId,
          emotion: 'neutral',
          language_boost: 'Turkish'
        })
      });

      const data = await response.json();
      if (data.success && data.audio_url) {
        setCurrentAudio(data.audio_url);
        setCurrentPlayingId(voiceId);
        
        // Ses dosyasını oynat
        const audio = new Audio(data.audio_url);
        audio.play();
        
        audio.onended = () => {
          setCurrentPlayingId(null);
        };
      } else {
        console.error('Demo üretimi başarısız:', data.error);
        alert('Demo üretimi başarısız: ' + data.error);
      }
    } catch (error) {
      console.error('Demo hatası:', error);
      alert('Demo hatası: ' + error);
    } finally {
      setIsGenerating(null);
    }
  };

  // Filtreleme
  const filteredVoices = voices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voice.characteristics.some(char => 
                           char.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'Tümü' || voice.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ses Kütüphanesi</h1>
          <p className="text-gray-600">Projeleriniz için mükemmel sesi keşfedin - {voices.length} ses mevcut</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {favorites.length} Favori
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ses ara..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-3 rounded-lg font-medium transition text-sm ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map(voice => {
          const isFavorite = favorites.some(fav => fav.voiceId === voice.id);
          const isPlaying = currentPlayingId === voice.id;
          const isGeneratingDemo = isGenerating === voice.id;
          
          return (
            <div key={voice.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${voice.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {voice.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{voice.name}</h3>
                    <p className="text-sm text-gray-500">{voice.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleFavorite(voice)}
                  className={`p-2 rounded-full transition ${
                    isFavorite 
                      ? 'text-red-500 hover:bg-red-50' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Characteristics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {voice.characteristics.map(char => (
                  <span key={char} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {char}
                  </span>
                ))}
              </div>

              {/* Voice Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Dil</p>
                  <p className="font-medium">{voice.language}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cinsiyet</p>
                  <p className="font-medium">{voice.gender}</p>
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Kullanım Alanları</p>
                <div className="flex flex-wrap gap-1">
                  {voice.useCase.map(useCase => (
                    <span key={useCase} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => playDemo(voice.id)}
                  disabled={isGeneratingDemo}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {isGeneratingDemo ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : isPlaying ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isGeneratingDemo ? 'Hazırlanıyor...' : isPlaying ? 'Oynatılıyor' : 'Demo Dinle'}
                  </span>
                </button>
                
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredVoices.length === 0 && (
        <div className="text-center py-16">
          <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ses bulunamadı</h3>
          <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mic className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">{voices.length} Ses</h3>
            <p className="text-sm text-gray-600">Çok dilli yüksek kaliteli kütüphane</p>
          </div>
          
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900">AI Destekli</h3>
            <p className="text-sm text-gray-600">Gelişmiş yapay zeka teknolojisi</p>
          </div>
          
          <div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Music className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">Premium Kalite</h3>
            <p className="text-sm text-gray-600">Stüdyo kalitesinde ses çıktısı</p>
          </div>
        </div>
      </div>
    </div>
  );
}