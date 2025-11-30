'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Mic, Upload, Sparkles, Lock, Star, Clock, Play, Pause, Square,
  Trash2, Download, AlertCircle, CheckCircle, FileAudio, Loader2, 
  Zap, Globe, Settings, ChevronDown, StopCircle, Volume2
} from 'lucide-react';

interface ClonedVoice {
  id: string;
  voiceId: string;
  name: string;
  accuracy: string;
  originalFileName: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

export default function CloningPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('clone');
  const [inputType, setInputType] = useState<'upload' | 'record'>('upload');
  
  // File & Recording States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Form States
  const [voiceName, setVoiceName] = useState('');
  const [accuracy, setAccuracy] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState<'speech-2.6-hd' | 'speech-2.6-hd-turbo'>('speech-2.6-hd');
  const [noiseReduction, setNoiseReduction] = useState(false);
  const [volumeNormalization, setVolumeNormalization] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Status States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [clonedVoices, setClonedVoices] = useState<ClonedVoice[]>([]);
  const [userData, setUserData] = useState<{id: string, credits: number, plan: string, voiceCloningLimit: number} | null>(null);
  
  // Polling States
  const [isPolling, setIsPolling] = useState(false);
  const [pollingMessage, setPollingMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  // --- LOGIC & HELPERS ---

  const calculateRequiredCredits = () => {
    const baseCost = 50000;
    const multiplier = selectedModel === 'speech-2.6-hd-turbo' ? 0.4 : 1.0;
    return Math.ceil(baseCost * multiplier);
  };

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) setUserData(data.user);
      }
    } catch (error) {
      console.error('Kullanıcı verisi alınamadı:', error);
    }
  };

  const loadClonedVoices = async () => {
    setIsLoadingVoices(true);
    try {
      const response = await fetch('/api/voice-cloning');
      if (response.ok) {
        const data = await response.json();
        if (data.success) setClonedVoices(data.data.cloned_voices || []);
      }
    } catch (error) {
      console.error('Klonlanmış sesler yüklenemedi:', error);
    } finally {
      setIsLoadingVoices(false);
    }
  };

  useEffect(() => {
    loadUserData();
    if (activeTab === 'voices') loadClonedVoices();
    return () => {
      // Cleanup preview URL on unmount
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [activeTab]);

  // --- RECORDING LOGIC ---

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Dosya ismini tarihle oluştur
        const fileName = `kayit_${new Date().getTime()}.webm`;
        const file = new File([blob], fileName, { type: 'audio/webm' });
        
        validateAndSetFile(file);
        
        // Stream tracks kapat
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
      
      // Timer başlat
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError('Mikrofona erişilemedi. Lütfen izinleri kontrol edin.');
      console.error('Mic error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- FILE HANDLING ---

  const validateAndSetFile = (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError('Dosya boyutu 20MB\'dan büyük olamaz.');
      return false;
    }
    
    // Geçici bir URL oluşturip ses süresini kontrol et
    const objectUrl = URL.createObjectURL(file);
    const audioElement = document.createElement('audio');
    audioElement.src = objectUrl;
    
    audioElement.addEventListener('loadedmetadata', () => {
      const duration = audioElement.duration;
      if (duration < 10 || duration > 300) {
        setError('Ses süresi 10 saniye ile 5 dakika arasında olmalıdır.');
        URL.revokeObjectURL(objectUrl);
        return;
      }
      
      // Validasyon başarılı
      setError('');
      setSelectedFile(file);
      setPreviewUrl(objectUrl);
    });
    
    audioElement.addEventListener('error', () => {
      setError('Ses dosyası okunamadı. Geçerli bir format seçin.');
      URL.revokeObjectURL(objectUrl);
    });

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setRecordingDuration(0);
  };

  // --- POLLING SYSTEM ---

  const pollCloneStatus = async (requestId: string) => {
    setIsPolling(true);
    setPollingMessage('Ses klonlama işlemi başlatıldı...');
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/voice-cloning/status?requestId=${requestId}`);
        const data = await response.json();
        
        if (data.success) {
          const { status, progress, message } = data.data;
          
          switch (status) {
            case 'starting':
              setPollingMessage('Ses klonlama başlatılıyor...');
              break;
            case 'processing':
              setPollingMessage(`İşleniyor... ${progress ? `(${progress}%)` : ''}`);
              break;
            case 'completed':
              clearInterval(pollInterval);
              setIsPolling(false);
              setIsUploading(false);
              setSuccess(`Başarılı! "${voiceName}" ses klonunuz hazır. Stüdyoda kullanabilirsiniz.`);
              clearSelection();
              setVoiceName('');
              setSelectedModel('speech-2.6-hd');
              setUploadProgress(0);
              if (activeTab === 'voices') loadClonedVoices();
              break;
            case 'failed':
              clearInterval(pollInterval);
              setIsPolling(false);
              setIsUploading(false);
              setError(message || 'Ses klonlama işlemi başarısız oldu.');
              break;
            default:
              setPollingMessage('Durum kontrol ediliyor...');
          }
        } else {
          // API'dan hata gelirse polling'i durdur
          clearInterval(pollInterval);
          setIsPolling(false);
          setIsUploading(false);
          setError(data.error || 'Durum kontrol edilemedi.');
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Ağ hatası varsa polling'i durdurma, tekrar denemeye devam et
        setPollingMessage('Durum kontrol ediliyor...');
      }
    }, 5000); // 5 saniyede bir kontrol et

    // 10 dakika sonra timeout
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isPolling) {
        setIsPolling(false);
        setIsUploading(false);
        setError('İşlem zaman aşımına uğradı. Lütfen "Klonlanmış Sesler" sekmesinden durumu kontrol edin.');
      }
    }, 600000); // 10 dakika
  };

  // --- API SUBMISSION ---

  const handleCloneVoice = async () => {
    if (!selectedFile || !voiceName.trim()) {
      setError('Lütfen ses dosyası ve ses ismi girin.');
      return;
    }

    if (voiceName.length < 2 || voiceName.length > 50) {
      setError('Ses ismi 2-50 karakter arasında olmalıdır.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('voice_name', voiceName.trim());
      formData.append('accuracy', accuracy.toString());
      formData.append('model', selectedModel);
      formData.append('noise_reduction', noiseReduction.toString());
      formData.append('volume_normalization', volumeNormalization.toString());

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + Math.random() * 20, 90));
      }, 500);

      const response = await fetch('/api/voice-cloning', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setError(`Yetersiz kredi! Gerekli: ${data.requiredCredits}, Mevcut: ${data.availableCredits}`);
        } else {
          setError(data.error || 'Ses klonlama sırasında hata oluştu.');
        }
        setIsUploading(false);
        return;
      }

      if (data.success && data.data.requestId) {
        // Polling başlat
        pollCloneStatus(data.data.requestId);
      } else {
        setIsUploading(false);
        setError(data.error || 'Beklenmeyen bir hata oluştu.');
      }

    } catch (error) {
      console.error('Voice cloning error:', error);
      setIsUploading(false);
      setError('Bağlantı hatası oluştu.');
    }
  };

  // --- HELPERS ---
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getBadgeMessage = () => {
    if (!userData) return "Kredi ile kullanılabilir";
    const { plan, voiceCloningLimit = 0 } = userData;
    
    if (plan === 'free') {
      return "Kredi ile kullanım";
    }
    
    if (voiceCloningLimit && voiceCloningLimit > 0) {
      return `${voiceCloningLimit} hak • Kredi ile kullanım`;
    }
    
    return "Kredi ile kullanım";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ses Klonlama Stüdyosu</h1>
              <p className="text-slate-500 font-medium">Yapay zeka ile kendi sesinizi dijitalleştirin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${userData?.plan === 'free' ? 'bg-orange-500' : 'bg-green-500'}`} />
            <span className="text-sm font-semibold text-slate-700">
              {getBadgeMessage()}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-white rounded-xl border border-slate-200 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab('clone')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'clone'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Yeni Ses Klonla
          </button>
          <button
            onClick={() => setActiveTab('voices')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'voices'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Klonlanmış Sesler
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'clone' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Panel: Instructions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6">İşlem Adımları</h2>
                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {[
                    { title: "Kaynak Ses", desc: "Sesi yükleyin veya kaydedin", icon: Upload },
                    { title: "AI Analizi", desc: "Ses karakteristiğiniz işlenir", icon: Zap },
                    { title: "Tamamlandı", desc: "Metinleri kendi sesinizle okutun", icon: CheckCircle }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="relative z-10 w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                        <step.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                        <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm mb-1">En İyi Sonuç İçin</h3>
                    <ul className="text-blue-800/80 text-xs space-y-1.5 font-medium">
                      <li className="flex items-center gap-2">• Gürültüsüz ortamda kayıt alın</li>
                      <li className="flex items-center gap-2">• Doğal konuşma tonunuzu kullanın</li>
                      <li className="flex items-center gap-2">• En az 30 saniyelik veri sağlayın</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Action Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Ses Kaynağı</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Input Type Toggle */}
                  <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-fit mb-4">
                    <button
                      onClick={() => { setInputType('upload'); clearSelection(); setError(''); }}
                      className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${
                        inputType === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Dosya Yükle
                    </button>
                    <button
                      onClick={() => { setInputType('record'); clearSelection(); setError(''); }}
                      className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${
                        inputType === 'record' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Mikrofon ile Kaydet
                    </button>
                  </div>

                  {/* Upload / Record Area */}
                  {!selectedFile ? (
                    inputType === 'upload' ? (
                      <div
                        className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center transition-all hover:border-blue-400 hover:bg-blue-50/30 group cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-slate-900 font-semibold mb-2">Ses dosyasını buraya sürükleyin</h3>
                        <p className="text-slate-500 text-sm mb-6">veya bilgisayarınızdan seçmek için tıklayın</p>
                        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 uppercase tracking-wider font-medium">
                          <span>MP3</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>WAV</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>M4A</span>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center bg-slate-50/50">
                        {isRecording ? (
                          <div className="space-y-6">
                            <div className="animate-pulse">
                              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-50">
                                <Mic className="w-10 h-10 text-red-600" />
                              </div>
                            </div>
                            <div>
                              <div className="text-3xl font-mono font-bold text-slate-800 mb-2">
                                {formatDuration(recordingDuration)}
                              </div>
                              <p className="text-red-600 text-sm font-medium animate-pulse">Kayıt yapılıyor...</p>
                            </div>
                            <button
                              onClick={stopRecording}
                              className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center gap-2 mx-auto"
                            >
                              <Square className="w-4 h-4 fill-current" />
                              Kaydı Bitir
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                              <Mic className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-slate-900 font-semibold">Mikrofonla kayıt başlatın</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                              En az 10 saniye konuşarak sesinizi klonlayın.
                            </p>
                            <button
                              onClick={startRecording}
                              className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                            >
                              Kaydı Başlat
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileAudio className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm truncate max-w-[200px]">
                              {selectedFile.name}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={clearSelection}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {previewUrl && (
                        <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-sm">
                          <audio ref={audioPlayerRef} controls src={previewUrl} className="w-full h-8" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Settings Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Ses İsmi</label>
                        <input
                          type="text"
                          value={voiceName}
                          onChange={(e) => setVoiceName(e.target.value)}
                          placeholder="Örn: Benim Sesim v1"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          maxLength={50}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-sm font-medium text-slate-700">Benzerlik Oranı</label>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                            {Math.round(accuracy * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={accuracy}
                          onChange={(e) => setAccuracy(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">Model Seçimi</label>
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          onClick={() => setSelectedModel('speech-2.6-hd')}
                          className={`relative p-3 rounded-xl border text-left transition-all ${
                            selectedModel === 'speech-2.6-hd'
                              ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">HD Kalite</p>
                              <p className="text-xs text-slate-500 mt-0.5">Profesyonel sonuçlar</p>
                            </div>
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">50K Kredi</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setSelectedModel('speech-2.6-hd-turbo')}
                          className={`relative p-3 rounded-xl border text-left transition-all ${
                            selectedModel === 'speech-2.6-hd-turbo'
                              ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">Turbo Model</p>
                              <p className="text-xs text-slate-500 mt-0.5">Hızlı ve ekonomik</p>
                            </div>
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">20K Kredi</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Advanced Settings Toggle */}
                  <div className="pt-2">
                    <button 
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Gelişmiş Ayarlar
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAdvanced && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                          <input type="checkbox" checked={noiseReduction} onChange={(e) => setNoiseReduction(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                          <span className="text-sm text-slate-700">Gürültü Azaltma</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                          <input type="checkbox" checked={volumeNormalization} onChange={(e) => setVolumeNormalization(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                          <span className="text-sm text-slate-700">Ses Normalizasyonu</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-800 font-medium">{success}</p>
                    </div>
                  )}

                  {/* Submit Area */}
                  <div className="pt-4 border-t border-slate-100">
                    {isUploading || isPolling ? (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium text-slate-600">
                          <span>{isPolling ? pollingMessage : 'İşleniyor...'}</span>
                          <span>{isPolling ? '' : `${Math.round(uploadProgress)}%`}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          {isPolling ? (
                            <div className="bg-blue-600 h-full rounded-full animate-pulse" />
                          ) : (
                            <div 
                              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out" 
                              style={{ width: `${uploadProgress}%` }} 
                            />
                          )}
                        </div>
                        <p className="text-center text-xs text-slate-400">
                          {isPolling 
                            ? 'Ses klonlama işlemi devam ediyor, lütfen sayfayı kapatmayın.'
                            : 'Bu işlem birkaç dakika sürebilir, lütfen sayfayı kapatmayın.'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-xl">
                        <div className="text-sm">
                          <span className="text-slate-500">Tahmini Maliyet:</span>
                          <div className="font-bold text-slate-900 text-lg">
                            {calculateRequiredCredits().toLocaleString()} <span className="text-sm font-normal text-slate-500">Kredi</span>
                          </div>
                        </div>
                        <button
                          onClick={handleCloneVoice}
                          disabled={!selectedFile || !voiceName.trim() || isUploading || isPolling}
                          className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Klonlamayı Başlat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voices List Tab */}
        {activeTab === 'voices' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Klonlanmış Sesler</h2>
              <p className="text-slate-500 text-sm">Oluşturduğunuz tüm ses modelleri</p>
            </div>
            
            <div className="p-6">
              {isLoadingVoices ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                  <p>Sesler yükleniyor...</p>
                </div>
              ) : clonedVoices.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Henüz ses klonlamadınız</h3>
                  <p className="text-slate-500 text-sm mb-6">İlk ses modelinizi oluşturmak için başlayın.</p>
                  <button
                    onClick={() => setActiveTab('clone')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Yeni Ses Klonla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {clonedVoices.map((voice) => (
                    <div key={voice.id} className="group border border-slate-200 hover:border-blue-300 bg-white hover:shadow-md transition-all rounded-xl p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {voice.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{voice.name}</h3>
                            <p className="text-xs text-slate-400 font-mono">{voice.voiceId.substring(0, 8)}...</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          voice.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' : 
                          voice.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 
                          'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {voice.status === 'completed' ? 'Hazır' : voice.status === 'processing' ? 'İşleniyor' : 'Hata'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-5">
                        <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                          <span className="text-slate-500">Tarih</span>
                          <span className="font-medium text-slate-700">{formatDate(voice.createdAt)}</span>
                        </div>
                        <div className="flex justify-between text-xs py-1 border-b border-slate-50">
                          <span className="text-slate-500">Boyut</span>
                          <span className="font-medium text-slate-700">{formatFileSize(voice.fileSize)}</span>
                        </div>
                        <div className="flex justify-between text-xs py-1">
                          <span className="text-slate-500">Kalite</span>
                          <span className="font-medium text-slate-700 capitalize">{voice.accuracy}</span>
                        </div>
                      </div>

                      {voice.status === 'completed' && (
                        <button
                          onClick={() => window.location.href = `/dashboard/studio?voice=${voice.voiceId}`}
                          className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-200/50"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Stüdyoda Kullan
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
