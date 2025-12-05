import { generateMetaTags } from '@/lib/seo';
import Link from 'next/link';
import { Scale, FileText, User, CreditCard, Shield, AlertTriangle, CheckCircle, Mail } from 'lucide-react';

export const metadata = generateMetaTags({
  title: 'Kullanım Şartları - Yanki AI',
  description: 'Yanki AI platformu kullanım şartları ve koşulları. Hizmet kullanımı, ödeme koşulları ve yasal düzenlemeler hakkında detaylı bilgi.',
  keywords: 'kullanım şartları, hizmet şartları, yasal uyarılar, ödeme koşulları, Yanki AI',
  canonicalUrl: 'https://yankitr.com/terms-of-service'
});

export default function TermsOfServicePage() {
  const sections = [
    {
      id: 'kabul-onay',
      title: 'Kabul ve Onay',
      icon: <CheckCircle className="w-6 h-6" />,
      content: `Bu Kullanım Şartları ("Şartlar"), Yanki AI platformunu ("Platform", "Hizmet") kullanımınızı düzenleyen yasal bir sözleşmedir. 
      Platformu kullanarak bu şartları tamamen okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.<br/><br/>
      Bu şartları kabul etmiyorsanız, lütfen platformu kullanmayın. Yanki Teknoloji A.Ş. ("Yanki", "Biz", "Şirket") bu şartları 
      önceden bildirimde bulunarak değiştirme hakkını saklı tutar.`
    },
    {
      id: 'hizmet-tanimi',
      title: 'Hizmet Tanımı',
      icon: <FileText className="w-6 h-6" />,
      content: `
        <strong>Yanki AI aşağıdaki hizmetleri sunar:</strong><br/><br/>
        • <strong>AI Seslendirme (Text-to-Speech):</strong> Metinlerinizi 20+ farklı dilde profesyonel seslendirmeye çevirme<br/>
        • <strong>Ses Klonlama (Voice Cloning):</strong> Kişisel ses örneklerinizden yapay ses modeli oluşturma<br/>
        • <strong>Deşifre Hizmeti (Speech-to-Text):</strong> Ses dosyalarını ve canlı konuşmaları metne çevirme<br/>
        • <strong>Dashboard ve Yönetim Paneli:</strong> Projelerinizi yönetme ve takip etme araçları<br/><br/>
        Hizmetlerimiz sürekli geliştirilmekte ve yeni özellikler eklenebilmektedir.
      `
    },
    {
      id: 'kullanici-hesaplari',
      title: 'Kullanıcı Hesapları ve Güvenlik',
      icon: <User className="w-6 h-6" />,
      content: `
        <strong>Hesap Oluşturma:</strong><br/>
        • Platformu kullanmak için geçerli bir e-posta adresi ile hesap oluşturmanız gerekir<br/>
        • Doğru ve güncel bilgiler sağlamakla yükümlüsünüz<br/>
        • 18 yaşından küçükseniz, yasal veli onayı almalısınız<br/><br/>
        
        <strong>Hesap Güvenliği:</strong><br/>
        • Şifrenizi güvenli tutmaktan sorumlusunuz<br/>
        • Hesabınızın yetkisiz kullanımını derhal bildirmelisiniz<br/>
        • Hesabınızda gerçekleşen tüm aktivitelerden sorumlusunuz<br/>
        • Hesabınızı başkalarıyla paylaşamazsınız
      `
    },
    {
      id: 'kullanim-kurallari',
      title: 'Kullanım Kuralları ve Sınırlamaları',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: `
        <strong>Yasak Kullanımlar:</strong><br/>
        • Telif hakkı ihlali oluşturan içerik üretimi<br/>
        • Yanıltıcı, zararlı veya yasa dışı içerik oluşturma<br/>
        • Başkalarının sesini izinsiz klonlama<br/>
        • Dolandırıcılık, kimlik hırsızlığı veya sahtekarlık amaçlı kullanım<br/>
        • Nefret söylemi, ayrımcılık veya taciz içeren içerik<br/>
        • Sistemi hackleme, virüs yayma veya güvenlik ihlali girişimleri<br/><br/>
        
        <strong>Kullanım Sınırları:</strong><br/>
        • Paket limitlerini aşan kullanım ek ücrete tabidir<br/>
        • Fair use politikası kapsamında makul kullanım beklenir<br/>
        • Otomatik veya robot kullanımı yasaktır<br/>
        • Ticari kullanım için uygun lisans gereklidir
      `
    },
    {
      id: 'odeme-faturalandirma',
      title: 'Ödeme ve Faturalandırma',
      icon: <CreditCard className="w-6 h-6" />,
      content: `
        <strong>Ödeme Koşulları:</strong><br/>
        • Tüm fiyatlar Türk Lirası (₺) cinsindendir ve KDV dahildir<br/>
        • Ödemeler kredi kartı veya banka kartı ile gerçekleştirilir<br/>
        • Abonelik ödemeleri otomatik olarak yenilenir<br/>
        • Ödeme bilgileri güvenli şekilde işlenir ve saklanır<br/><br/>
        
        <strong>İade Politikası:</strong><br/>
        • Kullanılmamış kredi bakiyesi için 14 gün içinde iade talebinde bulunabilirsiniz<br/>
        • Teknik sorunlar nedeniyle kullanamadığınız krediler iade edilir<br/>
        • Abonelik ücretleri sadece hizmet alınamadığı durumda iade edilir<br/>
        • İade işlemleri 5-10 iş günü içinde tamamlanır
      `
    },
    {
      id: 'fikri-mulkiyet',
      title: 'Fikri Mülkiyet Hakları',
      icon: <Shield className="w-6 h-6" />,
      content: `
        <strong>Platform Hakları:</strong><br/>
        • Yanki AI platformu ve teknolojisi Yanki Teknoloji A.Ş.'ye aittir<br/>
        • Marka, logo ve tasarımlar telif hakkı koruması altındadır<br/>
        • Kaynak kodları ve algoritmalara erişim yasaktır<br/><br/>
        
        <strong>Kullanıcı İçeriği:</strong><br/>
        • Ürettiğiniz ses dosyalarının hakları size aittir<br/>
        • Yüklediğiniz içerik için gerekli izinlere sahip olmalısınız<br/>
        • Hizmet sunumu için içeriğinizi işleme hakkımız vardır<br/>
        • İçeriğinizi üçüncü taraflarla paylaşmayız<br/><br/>
        
        <strong>Ses Klonlama Hakları:</strong><br/>
        • Sadece kendi sesinizi veya izinli sesleri klonlayabilirsiniz<br/>
        • Üçüncü kişi seslerinin klonlanması yasaktır<br/>
        • Ünlü veya kamu figürlerinin seslerini klonlayamazsınız
      `
    },
    {
      id: 'hizmet-kesintileri',
      title: 'Hizmet Kesintileri ve Değişiklikler',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: `
        <strong>Planlı Bakım:</strong><br/>
        • Sistem güncellemeleri için kısa süreli kesintiler olabilir<br/>
        • Bakım çalışmaları önceden duyurulur<br/>
        • Kritik güncellemeler acil olarak yapılabilir<br/><br/>
        
        <strong>Hizmet Değişiklikleri:</strong><br/>
        • Yeni özellikler eklenebilir veya mevcut özellikler değiştirilebilir<br/>
        • Fiyat değişiklikleri 30 gün önceden duyurulur<br/>
        • Kullanım şartları güncellenebilir<br/>
        • Major değişiklikler e-posta ile bildirilir
      `
    },
    {
      id: 'sorumluluk-sinirlari',
      title: 'Sorumluluk Sınırlamaları',
      icon: <Scale className="w-6 h-6" />,
      content: `
        <strong>Hizmet Sınırlamaları:</strong><br/>
        • Hizmet "olduğu gibi" sunulur<br/>
        • %100 çalışma süresi garanti edilmez<br/>
        • AI teknolojilerinin doğruluğu garanti edilmez<br/>
        • Üçüncü taraf hizmet sağlayıcılarından kaynaklanan sorunlardan sorumlu değiliz<br/><br/>
        
        <strong>Zarar Sorumlulukları:</strong><br/>
        • Dolaylı veya sonuçsal zararlardan sorumlu değiliz<br/>
        • Maksimum sorumluluk, son 12 ayda ödediğiniz ücret ile sınırlıdır<br/>
        • İçerik telif hakkı ihlalleri kullanıcının sorumluluğundadır<br/>
        • Kayıp iş veya kâr için sorumluluk kabul etmeyiz
      `
    },
    {
      id: 'hesap-iptali',
      title: 'Hesap İptali ve Sonlandırma',
      icon: <User className="w-6 h-6" />,
      content: `
        <strong>Kullanıcı İptali:</strong><br/>
        • Hesabınızı istediğiniz zaman kapatabilirsiniz<br/>
        • İptal sonrası verileriniz 30 gün içinde silinir<br/>
        • Kullanılmamış krediler iade edilir<br/>
        • Abonelik otomatik olarak sonlandırılır<br/><br/>
        
        <strong>Şirket İptali:</strong><br/>
        • Şartları ihlal eden hesaplar askıya alınabilir<br/>
        • Uyarı sonrası düzeltme fırsatı verilir<br/>
        • Ciddi ihlallerde derhal sonlandırma yapılabilir<br/>
        • Hesap kapanması durumunda bakiye iade edilir
      `
    },
    {
      id: 'uyusmazlik-cozumu',
      title: 'Uyuşmazlık Çözümü',
      icon: <Scale className="w-6 h-6" />,
      content: `
        <strong>Öncelikli İletişim:</strong><br/>
        • Sorunları öncelikle müşteri destek ile çözmeye odaklanırız<br/>
        • 7/24 destek hattımız mevcuttur<br/>
        • Şikayetlerinizi ciddi şekilde değerlendiririz<br/><br/>
        
        <strong>Yasal Süreç:</strong><br/>
        • Türkiye Cumhuriyeti yasaları geçerlidir<br/>
        • İstanbul mahkemeleri yetkilidir<br/>
        • Tüketici hakları saklıdır<br/>
        • Arabuluculuk tercih edilir
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-16 px-6 font-['Inter']">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Kullanım Şartları
              </h1>
              <p className="text-xl text-gray-600">
                Son güncellenme: 5 Aralık 2024
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Bu kullanım şartları, Yanki AI platformunu kullanımınızı düzenleyen yasal çerçeveyi belirler. 
            Hizmetlerimizi kullanarak bu şartları kabul etmiş sayılırsınız.
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">İçerik</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors group"
              >
                <div className="text-gray-500 group-hover:text-orange-600 transition-colors">
                  {section.icon}
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-orange-600">
                    {section.icon}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>
              <div
                className="text-gray-700 leading-relaxed text-lg prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>

        {/* Agreement Box */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mt-16">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Şartları Kabul Ediyorum
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Yanki AI platformunu kullanarak yukarıdaki tüm kullanım şartlarını okuduğunuzu, 
              anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Hesap Oluştur
              </Link>
              <Link
                href="/login"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 mt-16 text-center text-white">
          <Mail className="w-12 h-12 mx-auto mb-4 text-orange-100" />
          <h3 className="text-2xl font-bold mb-4">Yasal Destek ve Bilgi</h3>
          <p className="text-orange-100 mb-6 text-lg">
            Kullanım şartları veya yasal konular hakkında sorularınız için bizimle iletişime geçin. 
            Hukuk danışmanımız size yardımcı olmaktan memnuniyet duyar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Hukuki Destek
            </Link>
            <span className="text-orange-200">
              E-posta: legal@yankitr.com
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors font-medium">
              Ana Sayfa
            </Link>
            <Link href="/privacy-policy" className="hover:text-orange-600 transition-colors font-medium">
              Gizlilik Politikası
            </Link>
            <Link href="/contact" className="hover:text-orange-600 transition-colors font-medium">
              İletişim
            </Link>
            <Link href="/help" className="hover:text-orange-600 transition-colors font-medium">
              Yardım
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}