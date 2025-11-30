"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Type, Mic, Wand2, Play, Pause, ChevronDown, CheckCircle2, Loader2, Volume2 } from 'lucide-react';
import axios from 'axios';

// DEMO SESLERİ (Hazır mp3 dosyaları ile)
const VOICES = [
  {
    id: "1",
    name: "Mert - Belgesel",
    desc: "Sakin, Derin, Otoriter Ton",
    avatarLabel: "MB",
    color: "bg-slate-900",
    demoFile: "1.mp3",
    demoText: "Asırlar boyunca, antik medeniyetler büyük sırlar sakladı."
  },
  {
    id: "2",
    name: "Emel - Masalcı",
    desc: "Yumuşak, Akıcı, Heyecanlı",
    avatarLabel: "EM",
    color: "bg-purple-600",
    demoFile: "2.mp3",
    demoText: "Bir varmış bir yokmuş, uzak diyarlarda güzel bir prenses varmış."
  },
  {
    id: "3",
    name: "Aslı - Youtube",
    desc: "Enerjik, Hızlı, Viral Ton",
    avatarLabel: "AY",
    color: "bg-red-600",
    demoFile: "3.mp3",
    demoText: "Merhaba arkadaşlar! Bugün harika bir deneyim paylaşacağım."
  },
  {
    id: "4",
    name: "Merve - Çocuk",
    desc: "İnce, Naif, Çocuksu",
    avatarLabel: "MÇ",
    color: "bg-pink-500",
    demoFile: "4.mp3",
    demoText: "Selam! Ben Merve. Bugün birlikte oyun oynayalım!"
  }
];

// DUYGU SEÇENEKLERİ
const EMOTION_OPTIONS = [
  { value: 'happy', label: 'Mutlu', color: 'bg-yellow-100 text-yellow-700', icon: '😊' },
  { value: 'sad', label: 'Üzgün', color: 'bg-blue-100 text-blue-700', icon: '😢' },
  { value: 'neutral', label: 'Nötr', color: 'bg-gray-100 text-gray-700', icon: '😐' },
  { value: 'angry', label: 'Kızgın', color: 'bg-red-100 text-red-700', icon: '😠' },
  { value: 'fearful', label: 'Korkmuş', color: 'bg-purple-100 text-purple-700', icon: '😨' },
  { value: 'calm', label: 'Sakin', color: 'bg-green-100 text-green-700', icon: '😌' },
  { value: 'disgusted', label: 'İğrenmiş', color: 'bg-orange-100 text-orange-700', icon: '🤢' },
  { value: 'surprised', label: 'Şaşırmış', color: 'bg-pink-100 text-pink-700', icon: '😲' },
  { value: 'fluent', label: 'Akıcı', color: 'bg-indigo-100 text-indigo-700', icon: '🗣️' }
];

// DİL SEÇENEKLERİ
const LANGUAGE_OPTIONS = [
  { value: 'Turkish', label: 'Türkçe', flag: '🇹🇷' },
  { value: 'English', label: 'English', flag: '🇺🇸' }
];

// Demo Voice ID mapping fonksiyonu - Studio ile uyumlu
const getVoiceApiId = (voiceId: string) => {
  // Studio'da direkt olarak '1', '2', '3', '4' kullanıyoruz
  // Bu yüzden demo API'da da aynı ID'leri kullanacağız
  return voiceId; // Direkt voice ID'yi döndür
};

const DemoSection = () => {
  const [text, setText] = useState(VOICES[0].demoText);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState('happy');
  const [selectedLanguage, setSelectedLanguage] = useState('Turkish');
  
  // Audio State
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Demo Limit State
  const [demoRemaining, setDemoRemaining] = useState<number | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);

  // Ses seçimi değiştiğinde
  const handleVoiceSelect = (voice: typeof VOICES[0]) => {
    setSelectedVoice(voice);
    if (isDemoMode) {
      // Demo modunda hazır ses dosyasını kullan
      setText(voice.demoText);
      setAudioUrl(`/audio/${voice.demoFile}`);
      setIsPlaying(false);
    }
  };

  // Demo modunu değiştir
  const toggleDemoMode = (demoMode: boolean) => {
    setIsDemoMode(demoMode);
    if (demoMode) {
      setText(selectedVoice.demoText);
      setAudioUrl(`/audio/${selectedVoice.demoFile}`);
    } else {
      setText("");
      setAudioUrl(null);
    }
    setIsPlaying(false);
  };

  // Ses oluşturma fonksiyonu - Sadece custom metin için
  const handleGenerate = async () => {
    if (!text) return;
    
    // Demo modunda generate butonuna gerek yok, direk play edilebilir
    if (isDemoMode) {
      if (audioUrl && audioRef.current) {
        togglePlay();
      }
      return;
    }

    // Custom metin için TTS API çağrısı
    setLoading(true);
    setIsPlaying(false);
    setAudioUrl(null);

    try {
      // Demo API endpoint'ini kullan (IP sınırlaması var)
      console.log("🔊 Demo API çağrısı:", text.slice(0, 50) + "...", selectedEmotion, selectedLanguage);
      
      // Voice ID'yi API'ye uygun hale getir
      const voiceApiId = getVoiceApiId(selectedVoice.id);
      
      const response = await axios.post('/api/demo', {
        voiceId: voiceApiId,
        emotion: selectedEmotion,
        language: selectedLanguage
      });

      console.log("Demo API Response:", response.data);

      // Kalan demo sayısını güncelle
      if (response.data.remaining !== undefined) {
        setDemoRemaining(response.data.remaining);
      }

      setLimitError(null); // Başarılı olduğunda hata temizle

      if (response.data.success && response.data.output) {
        setAudioUrl(response.data.output);
        console.log("✅ Ses başarıyla oluşturuldu:", response.data.output);
        
        // Ses hazır olduğunda otomatik çal
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              console.log("🎵 Ses otomatik başlatıldı");
            }).catch(e => {
              console.error("Otomatik oynatma hatası:", e);
            });
          }
        }, 100); // Kısa gecikme ile ses dosyasının yüklenmesini bekle
      } else {
        throw new Error(response.data.error || 'Ses oluşturulamadı');
      }

    } catch (error: any) {
      console.error('Demo API Error:', error);
      setAudioUrl(null);
      
      // Limit hatası kontrolü
      if (error.response?.status === 429) {
        setLimitError(error.response.data.error + " " + error.response.data.details);
        setDemoRemaining(0);
      } else {
        const errorMsg = error.response?.data?.error || error.message || 'Ses üretimi başarısız. Lütfen tekrar deneyin.';
        setLimitError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Oynat/Duraklat
  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Oynatma hatası:", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Ses bitince butonu sıfırla
  const onAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <section id="demo" className="py-20 bg-slate-50/50 font-sans border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">

        {/* --- ÜST SEKMELER (TABS) - Demo/Custom Mode --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => toggleDemoMode(true)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-sm border font-semibold transition ${
              isDemoMode
                ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-500'
                : 'bg-transparent border-transparent text-slate-500 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Play size={18} />
            Demo Sesler
          </button>
          <button
            onClick={() => toggleDemoMode(false)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-sm border font-semibold transition ${
              !isDemoMode
                ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-500'
                : 'bg-transparent border-transparent text-slate-500 hover:bg-white hover:shadow-sm'
            }`}
          >
            <Type size={18} />
            Özel Metin
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-transparent rounded-full border border-transparent text-slate-500 font-medium hover:bg-white hover:shadow-sm transition opacity-50 cursor-not-allowed">
            <Mic size={18} />
            Ses Klonlama
            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full ml-1">Yakında</span>
          </button>
        </div>

        {/* --- ANA DEMO KARTI --- */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* SOL TARA: INPUT & AYARLAR */}
          <div className="lg:col-span-7 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
            
            {/* Metin Giriş Alanı */}
            <div className="mb-8 relative">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  {isDemoMode ? 'Demo Metni' : 'Özel Metniniz'}
                </label>
                <div className="flex items-center gap-2">
                  {/* Karakter Sayacı - Üst sağda */}
                  <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    text.length > 100
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {text.length}/100
                  </div>
                  {/* Emotion Badge */}
                  {(() => {
                    const emotion = EMOTION_OPTIONS.find(e => e.value === selectedEmotion);
                    return emotion ? (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${emotion.color} flex items-center gap-1`}>
                        <span>{emotion.icon}</span>
                        {emotion.label}
                      </div>
                    ) : null;
                  })()}
                  {/* Language Badge */}
                  {(() => {
                    const lang = LANGUAGE_OPTIONS.find(l => l.value === selectedLanguage);
                    return lang ? (
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
                        <span>{lang.flag}</span>
                        {lang.label}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
              <div className="relative group">
                <textarea
                  className={`w-full h-40 p-4 text-lg text-slate-700 font-medium bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition placeholder:text-slate-300 leading-relaxed ${
                    isDemoMode ? 'cursor-not-allowed bg-slate-100/50' : ''
                  }`}
                  placeholder={isDemoMode ? "Demo metni otomatik seçilir..." : "Buraya seslendirmek istediğiniz metni yazın..."}
                  value={text}
                  onChange={(e) => !isDemoMode && setText(e.target.value)}
                  readOnly={isDemoMode}
                ></textarea>
                
                {/* Generate Butonu (Textarea içinde sağ altta) */}
                <div className="absolute bottom-4 right-4">
                   {isDemoMode ? (
                     <button
                      onClick={handleGenerate}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 transform active:scale-95"
                     >
                        <Play size={14} />
                        Demo Dinle
                     </button>
                   ) : (
                     <>
                       <button
                        onClick={handleGenerate}
                        disabled={loading || !text || text.length > 100}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                       >
                          {loading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                          {loading ? 'Üretiliyor...' : 'Oluştur'}
                       </button>
                       {text.length > 100 && (
                         <div className="absolute -top-12 right-0 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 whitespace-nowrap">
                           <div className="font-medium">Daha uzun metinler için</div>
                           <div className="text-blue-600 underline cursor-pointer">Ücretsiz üye olun</div>
                         </div>
                       )}
                     </>
                   )}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 mb-6"></div>

            {/* Emotion ve Language Seçiciler - Sadece Custom modda */}
            {!isDemoMode && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                
                {/* Emotion Seçici */}
                <div>
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 block">Duygu Tonu</label>
                  <div className="relative">
                    <select
                      value={selectedEmotion}
                      onChange={(e) => setSelectedEmotion(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                    >
                      {EMOTION_OPTIONS.map(emotion => (
                        <option key={emotion.value} value={emotion.value}>
                          {emotion.icon} {emotion.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Language Seçici */}
                <div>
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 block">Dil</label>
                  <div className="relative">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                    >
                      {LANGUAGE_OPTIONS.map(lang => (
                        <option key={lang.value} value={lang.value}>
                          {lang.flag} {lang.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>
            )}

            {/* Ses Listesi - 4 ses grid layout */}
            <div className="flex-1">
               <label className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 block">
                 {isDemoMode ? 'Demo Sesler' : 'Hazır Sesler'}
               </label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {VOICES.map((voice) => (
                    <div
                        key={voice.id}
                        onClick={() => handleVoiceSelect(voice)}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${selectedVoice.id === voice.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' : 'border-transparent hover:bg-slate-50 hover:border-slate-100'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${voice.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                {voice.avatarLabel}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`text-sm font-bold ${selectedVoice.id === voice.id ? 'text-blue-900' : 'text-slate-900'}`}>
                                      {voice.name}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-500">{voice.desc}</p>
                                {isDemoMode && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                    "{voice.demoText}"
                                  </p>
                                )}
                            </div>
                        </div>
                        {selectedVoice.id === voice.id && (
                            <div className="bg-white rounded-full p-1 shadow-sm">
                                <CheckCircle2 size={20} className="text-blue-600" fill="currentColor" color="white" />
                            </div>
                        )}
                    </div>
                  ))}

               </div>
            </div>

          </div>

          {/* SAĞ TARAF: PREVIEW & PLAYER */}
          <div className="lg:col-span-5 bg-slate-50/50 p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden">
             
             {/* Arka plan efekti */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

             {/* Player Kartı */}
             <div className="w-full max-w-[300px] bg-white rounded-[2.5rem] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 relative z-10 transition-all duration-500 group">
                
                {/* Albüm Kapağı / Avatar */}
                <div className="w-full aspect-square bg-slate-900 rounded-[2rem] mb-6 relative overflow-hidden shadow-inner">
                   
                   {/* Dinamik Arka Plan Rengi */}
                   <div className={`absolute inset-0 ${selectedVoice.color} opacity-90 transition-colors duration-500`}></div>
                   
                   {/* Görsel */}
                   <img 
                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=388&auto=format&fit=crop" 
                    alt="Voice Avatar" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition duration-700"
                   />
                   
                   {/* Play Butonu Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center">
                      {loading ? (
                          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                              <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                      ) : audioUrl ? (
                          <button 
                            onClick={togglePlay}
                            className="w-16 h-16 bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition active:scale-95 group/play"
                          >
                             {isPlaying ? (
                               <Pause fill="currentColor" className="text-slate-900 w-6 h-6" />
                             ) : (
                               <Play fill="currentColor" className="text-slate-900 w-6 h-6 ml-1 group-hover/play:text-blue-600 transition" />
                             )}
                          </button>
                      ) : (
                          <div className="flex flex-col items-center gap-2 animate-fade-in">
                             <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Volume2 className="text-white w-6 h-6 opacity-70" />
                             </div>
                             <span className="text-white/80 text-xs font-medium px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm">
                                Ses Bekleniyor
                             </span>
                          </div>
                      )}
                   </div>

                   {/* Waveform Animasyonu (Sadece çalarken) */}
                   {isPlaying && (
                       <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 h-8 items-end px-8">
                          {[40, 70, 30, 80, 50, 90, 60, 40, 70, 30, 50, 80].map((h, i) => (
                             <div key={i} className="w-1.5 bg-white/90 rounded-full animate-pulse shadow-sm" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}></div>
                          ))}
                       </div>
                   )}
                </div>

                {/* İsim ve Kontrol */}
                <div className="text-center px-2 pb-2">
                   <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedVoice.name}</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Yapay Zeka Tutor</p>
                </div>
                
                {/* Hidden Audio Element - ÇÖZÜM: audioUrl yoksa hiç render etme */}
                {audioUrl && (
                    <audio 
                        ref={audioRef} 
                        src={audioUrl} 
                        onEnded={onAudioEnded}
                        className="hidden"
                    />
                )}

             </div>

             {/* Ses Üret Butonu - Custom Metin İçin */}
             {!isDemoMode && text.length > 0 && (
                <button
                  onClick={handleGenerate}
                  disabled={loading || text.length > 100}
                  className={`mt-6 w-full max-w-[300px] px-6 py-4 rounded-2xl font-bold text-white text-sm transition flex items-center justify-center gap-2 ${
                    loading || text.length > 100
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Ses Üretiliyor...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} />
                      Ses Üret
                    </>
                  )}
                </button>
             )}

             {/* Demo Limit Bilgisi */}
             <div className="mt-6 text-center">
               {/* Limit Hatası */}
               {limitError && (
                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                   {limitError}
                 </div>
               )}
               
               {/* Kalan Demo Sayısı */}
               {demoRemaining !== null && (
                 <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-700 text-xs font-medium">
                   Kalan demo hakkı: <strong>{demoRemaining}/3</strong>
                 </div>
               )}
               
               {/* Kayıt Olmama Uyarısı */}
               {!isDemoMode && (
                 <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
                   💡 Kayıt olmadan günde sadece 3 demo yapabilirsiniz
                 </div>
               )}
             </div>

             {/* Dil Seçimi (Alt Kısım - Süs) */}
             <div className="mt-8 flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition group">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                   <img src="https://flagcdn.com/tr.svg" alt="Turkish" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition">Turkish (TR)</span>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-500 transition" />
             </div>

          </div>

        </div>

        {/* Mobil Mini Player (Alttan Beliren) */}
        {audioUrl && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            <div className="px-4 py-3 flex items-center gap-3">
              
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : isPlaying ? (
                  <Pause fill="currentColor" className="text-white w-5 h-5" />
                ) : (
                  <Play fill="currentColor" className="text-white w-5 h-5 ml-0.5" />
                )}
              </button>

              {/* Voice Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${selectedVoice.color} animate-pulse`}></div>
                  <h4 className="text-sm font-semibold text-slate-800 truncate">
                    {selectedVoice.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {isDemoMode ? "Demo Ses" : "Özel Metin"}
                </p>
              </div>

              {/* Waveform Animation (Mobile) */}
              {isPlaying && (
                <div className="flex items-center gap-1 h-8">
                  {[20, 35, 15, 40, 25, 45, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.1}s`,
                        minHeight: '8px'
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                  }
                  setIsPlaying(false);
                  setAudioUrl(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            {audioRef.current && (
              <div className="h-1 bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-100"
                  style={{
                    width: audioRef.current.duration
                      ? `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%`
                      : '0%'
                  }}
                ></div>
              </div>
            )}

            {/* Hidden Audio Element for Mobile */}
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={onAudioEnded}
                onTimeUpdate={() => {
                  // Force re-render for progress bar
                  if (audioRef.current) {
                    const progress = audioRef.current.currentTime / audioRef.current.duration;
                    // Update progress state if needed
                  }
                }}
                className="hidden"
              />
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default DemoSection;