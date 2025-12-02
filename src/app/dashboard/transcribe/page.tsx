'use client';

import { useState, useRef, useEffect } from 'react';
import { FileAudio, Upload, FileText, Loader2, Download, Copy, CheckCircle, AlertCircle, Eye, EyeOff, Zap, Play, Pause } from 'lucide-react';

export default function TranscribePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [language, setLanguage] = useState('auto');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [transcriptionResult, setTranscriptionResult] = useState<{
    transcription: string;
    chunks?: any[];
    language: string;
    duration_minutes: number;
    credits_used: number;
    remaining_credits: number;
  } | null>(null);

  const [showFullTranscription, setShowFullTranscription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Eski URL'leri temizle
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Kredi hesaplama (Süreye göre kesin hesap)
  const calculateEstimatedCredits = () => {
    if (!selectedFile) return 0;
    
    // Eğer süre yüklendiyse kesin hesap yap
    if (audioDuration > 0) {
        // Her başlayan dakika için ücret al veya tam dakika hesabı (Min 1 dk)
        const minutes = Math.max(1, Math.ceil(audioDuration / 60));
        return minutes * 500;
    }

    // Süre henüz yüklenmediyse dosya boyutundan tahmini hesap (Fallback)
    const estimatedMinutes = Math.ceil(selectedFile.size / (1024 * 1024)); 
    return estimatedMinutes * 500;
  };

  const validateAndSetFile = (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      setError('Dosya boyutu 25MB\'dan büyük olamaz.');
      return false;
    }
    
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      setError('Desteklenen formatlar: WAV, MP3, OGG, FLAC, M4A');
      return false;
    }
    
    // Önceki URL'i temizle
    if (audioUrl) URL.revokeObjectURL(audioUrl);

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setSelectedFile(file);
    setAudioDuration(0); // Süreyi sıfırla, onLoadedMetadata ile dolacak
    setError('');
    setTranscriptionResult(null);
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

  const handleDurationChange = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    setAudioDuration(e.currentTarget.duration);
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError('Lütfen ses dosyası seçin.');
      return;
    }

    setIsTranscribing(true);
    setError('');
    setSuccess('');
    setTranscriptionProgress(0);
    setTranscriptionResult(null);

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('language', language);

      const progressInterval = setInterval(() => {
        setTranscriptionProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 5;
        });
      }, 800);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
            setError(`Yetersiz kredi! ${data.error}`);
        } else {
            setError(data.error || 'Deşifre sırasında hata oluştu.');
        }
        setTranscriptionProgress(0);
        return;
      }

      if (data.success) {
        setTranscriptionProgress(100);
        setTranscriptionResult(data.data);
        setSuccess(`Deşifre tamamlandı! ${data.data.credits_used} kredi kullanıldı.`);
      } else {
        setError(data.error || 'Beklenmeyen hata.');
        setTranscriptionProgress(0);
      }

    } catch (error) {
      console.error('Transcription error:', error);
      setError('Sunucu hatası oluştu.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Metin panoya kopyalandı!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError('Kopyalama başarısız.');
    }
  };

  const downloadTranscription = () => {
    if (!transcriptionResult) return;
    const blob = new Blob([transcriptionResult.transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcription-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'Hesaplanıyor...';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Yankı Ses Deşifresi</h1>
            <p className="text-slate-600">Ses kayıtlarınızı anında metne dönüştürün</p>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-full">
          <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-orange-700 font-semibold text-sm">Tarife: Dakikası 500 Kredi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Ses Dosyası</h2>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all ${
                 selectedFile ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-full w-fit mx-auto mb-4">
                {selectedFile ? (
                  <FileAudio className="w-8 h-8 text-blue-600" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400" />
                )}
              </div>
              
              {selectedFile ? (
                <div>
                  <h3 className="font-semibold text-slate-700 mb-1">{selectedFile.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{formatFileSize(selectedFile.size)}</p>
                  <button onClick={() => fileInputRef.current?.click()} className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Dosyayı değiştir
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Dosyayı sürükleyin</h3>
                  <p className="text-slate-500 text-sm mb-4">veya bilgisayarınızdan seçin</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-sm"
                  >
                    Dosya Seç
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Audio Preview & Duration Info */}
            {selectedFile && audioUrl && (
                <div className="mb-6">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Önizleme</span>
                            <span className="text-xs font-mono text-slate-500">{formatDuration(audioDuration)}</span>
                        </div>
                        <audio 
                            ref={audioRef}
                            controls 
                            src={audioUrl} 
                            onLoadedMetadata={handleDurationChange}
                            className="w-full h-8" 
                        />
                    </div>
                </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Konuşma Dili
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="auto">Otomatik Algıla</option>
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
                <option value="es">İspanyolca</option>
                <option value="de">Almanca</option>
                <option value="fr">Fransızca</option>
              </select>
            </div>

            {selectedFile && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800 font-medium">Hesaplanan Maliyet:</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {calculateEstimatedCredits()} Kredi
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  * {audioDuration > 0 ? `${formatDuration(audioDuration)} uzunluğunda ses için.` : 'Dosya boyutuna göre tahmini hesap.'}
                </div>
              </div>
            )}

            {isTranscribing && (
              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold text-blue-600 mb-2">
                  <span>İŞLENİYOR</span>
                  <span>{Math.round(transcriptionProgress)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${transcriptionProgress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>{error}</div>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-xl flex gap-3 text-green-700 text-sm">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>{success}</div>
              </div>
            )}

            <button
              onClick={handleTranscribe}
              disabled={!selectedFile || isTranscribing}
              className="w-full py-3.5 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99]"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deşifre Ediliyor...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Deşifreyi Başlat
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          {transcriptionResult ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Sonuçlar</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(transcriptionResult.transcription)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Kopyala"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadTranscription}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="İndir"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Ses Süresi</div>
                  <div className="font-bold text-slate-800">{transcriptionResult.duration_minutes} dk</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">Harcanan</div>
                  <div className="font-bold text-slate-800">{transcriptionResult.credits_used} kredi</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 flex-1 overflow-hidden flex flex-col border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-700 text-sm">Metin İçeriği</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                        {transcriptionResult.transcription}
                    </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm h-full flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Sonuçlar Burada Görünecek</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Dosyanızı yükleyip işlemi başlattığınızda deşifre edilmiş metin burada belirecektir.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}</style>
    </div>
  );
}