'use client';

import { useState, useRef } from 'react';
import { FileAudio, Upload, FileText, Languages, Loader2, Download, Copy, CheckCircle, AlertCircle, Clock, Eye, EyeOff } from 'lucide-react';

export default function TranscribePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('auto');
  const [model, setModel] = useState<'meta-omnilingual-asr-3b' | 'subformer-turbo'>('meta-omnilingual-asr-3b');
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [includeSpeakerLabels, setIncludeSpeakerLabels] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState<{
    transcription: string;
    language: string;
    model: string;
    duration_minutes: number;
    credits_used: number;
    remaining_credits: number;
    timestamps?: any;
    speaker_labels?: any;
  } | null>(null);
  const [showFullTranscription, setShowFullTranscription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kredi hesaplama fonksiyonu
  const calculateEstimatedCredits = () => {
    if (!selectedFile) return 0;
    // Tahmini süre hesaplama (dosya boyutuna göre yaklaşık)
    const estimatedMinutes = Math.min(Math.ceil(selectedFile.size / (1024 * 1024)), 30);
    const baseCost = 5;
    const multiplier = model === 'subformer-turbo' ? 0.5 : 1.0;
    return Math.ceil(baseCost * estimatedMinutes * multiplier);
  };

  const validateAndSetFile = (file: File) => {
    // Dosya boyut kontrolü (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Dosya boyutu 50MB\'dan büyük olamaz.');
      return false;
    }
    
    // Dosya format kontrolü
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/m4a'];
    if (!allowedTypes.includes(file.type)) {
      setError('Desteklenen formatlar: WAV, MP3, OGG, FLAC, M4A');
      return false;
    }
    
    setSelectedFile(file);
    setError('');
    setTranscriptionResult(null);
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
      formData.append('model', model);
      formData.append('include_timestamps', includeTimestamps.toString());
      formData.append('include_speaker_labels', includeSpeakerLabels.toString());

      // Progress simulation
      const progressInterval = setInterval(() => {
        setTranscriptionProgress(prev => Math.min(prev + Math.random() * 15, 85));
      }, 1000);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setTranscriptionProgress(100);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setError(`Yetersiz kredi! Deşifre için ${data.requiredCredits} kredi gerekli. Mevcut krediniz: ${data.availableCredits}`);
        } else {
          setError(data.error || 'Deşifre sırasında hata oluştu.');
        }
        return;
      }

      if (data.success) {
        setTranscriptionResult(data.data);
        setSuccess(`Deşifre tamamlandı! ${data.data.duration_minutes} dakika süren ses için ${data.data.credits_used} kredi kullanıldı. Kalan krediniz: ${data.data.remaining_credits}`);
        setTranscriptionProgress(0);
      } else {
        setError(data.error || 'Beklenmeyen bir hata oluştu.');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      setError('Deşifre sırasında hata oluştu.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Metin panoya kopyalandı!');
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getPreviewText = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Ses Deşifresi</h1>
            <p className="text-slate-600">Ses kayıtlarınızı metne dönüştürün</p>
          </div>
        </div>
        
        {/* Active Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-green-700 font-semibold text-sm">Aktif! Dakika başına 2.5-5 kredi ile kullanılabilir</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Upload & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Ses Dosyası Yükleyin</h2>
            
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                {selectedFile ? (
                  <FileAudio className="w-8 h-8 text-green-600" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-600" />
                )}
              </div>
              
              {selectedFile ? (
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">{selectedFile.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{formatFileSize(selectedFile.size)}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Farklı Dosya Seç
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Ses dosyanızı buraya sürükleyin</h3>
                  <p className="text-slate-500 text-sm mb-4">Veya bilgisayarınızdan seçin</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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

            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dil Seçimi
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto">Otomatik Algıla</option>
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
                <option value="es">İspanyolca</option>
                <option value="de">Almanca</option>
                <option value="fr">Fransızca</option>
                <option value="it">İtalyanca</option>
                <option value="pt">Portekizce</option>
                <option value="ru">Rusça</option>
                <option value="ar">Arapça</option>
                <option value="zh">Çince</option>
                <option value="ja">Japonca</option>
                <option value="ko">Korece</option>
              </select>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Deşifre Modeli
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() => setModel('meta-omnilingual-asr-3b')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    model === 'meta-omnilingual-asr-3b'
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">Meta Omnilingual</h3>
                      <p className="text-sm text-slate-600">En yüksek doğruluk, çoklu dil desteği</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-800">5 kredi/dakika</div>
                      <div className="text-xs text-slate-500">Premium</div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setModel('subformer-turbo')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    model === 'subformer-turbo'
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">Subformer Turbo</h3>
                      <p className="text-sm text-slate-600">Hızlı ve ekonomik, iyi doğruluk</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-800">2.5 kredi/dakika</div>
                      <div className="text-xs text-green-600 font-medium">%50 tasarruf!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Gelişmiş Seçenekler
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTimestamps}
                    onChange={(e) => setIncludeTimestamps(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Zaman Damgaları</div>
                    <div className="text-sm text-slate-600">Her kelime için zaman bilgisi ekle</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSpeakerLabels}
                    onChange={(e) => setIncludeSpeakerLabels(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Konuşmacı Tanıma</div>
                    <div className="text-sm text-slate-600">Farklı konuşmacıları ayırt et</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Credit Info */}
            {selectedFile && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tahmini Kredi:</span>
                  <span className="font-semibold text-slate-800">{calculateEstimatedCredits()} kredi</span>
                </div>
                {model === 'subformer-turbo' && (
                  <div className="text-xs text-green-600 mt-1">
                    Turbo model ile yaklaşık %50 tasarruf ediyorsunuz!
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {isTranscribing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Deşifre ediliyor...</span>
                  <span>{Math.round(transcriptionProgress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${transcriptionProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleTranscribe}
              disabled={!selectedFile || isTranscribing}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deşifre Ediliyor...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Deşifreyi Başlat ({calculateEstimatedCredits()} Kredi)
                </>
              )}
            </button>
          </div>

          {/* File Requirements */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Desteklenen Formatlar</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Formatlar: WAV, MP3, OGG, FLAC, M4A</li>
                  <li>• Maksimum boyut: 50MB</li>
                  <li>• Maksimum süre: 30 dakika</li>
                  <li>• En iyi sonuç için net ses kalitesi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          {transcriptionResult ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Deşifre Sonucu</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(transcriptionResult.transcription)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Kopyala"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadTranscription}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="İndir"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Süre</div>
                  <div className="font-semibold text-slate-800">{transcriptionResult.duration_minutes} dakika</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Kullanılan Kredi</div>
                  <div className="font-semibold text-slate-800">{transcriptionResult.credits_used} kredi</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Dil</div>
                  <div className="font-semibold text-slate-800">{transcriptionResult.language}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Model</div>
                  <div className="font-semibold text-slate-800">
                    {transcriptionResult.model === 'meta-omnilingual-asr-3b' ? 'Meta Omnilingual' : 'Subformer Turbo'}
                  </div>
                </div>
              </div>

              {/* Transcription Text */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-800">Deşifre Edilen Metin</h3>
                  <button
                    onClick={() => setShowFullTranscription(!showFullTranscription)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-800 transition"
                  >
                    {showFullTranscription ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Kısalt
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        Tümünü Göster
                      </>
                    )}
                  </button>
                </div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {showFullTranscription 
                    ? transcriptionResult.transcription 
                    : getPreviewText(transcriptionResult.transcription)
                  }
                </div>
                {!showFullTranscription && transcriptionResult.transcription.length > 300 && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => setShowFullTranscription(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Devamını oku...
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="text-center py-12">
                <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2">Henüz deşifre yapılmadı</h3>
                <p className="text-slate-500 text-sm">Ses dosyanızı yükleyip deşifre işlemini başlatın</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}