import { generateMetaTags } from '@/lib/seo';
import Link from 'next/link';
import { Shield, Lock, Eye, Users, FileText, Globe, Mail, Calendar } from 'lucide-react';

export const metadata = generateMetaTags({
  title: 'Gizlilik Politikası - Yanki AI',
  description: 'Yanki AI gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgi.',
  keywords: 'gizlilik politikası, KVKK, kişisel veri koruma, veri güvenliği, Yanki AI',
  canonicalUrl: 'https://yankitr.com/privacy-policy'
});

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'genel-bilgiler',
      title: 'Genel Bilgiler',
      icon: <FileText className="w-6 h-6" />,
      content: `Bu Gizlilik Politikası, Yanki AI platformunu kullanırken kişisel verilerinizin nasıl toplandığı, 
      kullanıldığı, saklandığı ve korunduğu hakkında detaylı bilgi vermektedir. 6698 sayılı Kişisel Verilerin 
      Korunması Kanunu (KVKK) hükümlerine uygun olarak hazırlanmıştır.`
    },
    {
      id: 'toplanan-veriler',
      title: 'Toplanan Kişisel Veriler',
      icon: <Users className="w-6 h-6" />,
      content: `
        <strong>Hesap Bilgileri:</strong> Ad, soyad, e-posta adresi, şifre<br/>
        <strong>Profil Bilgileri:</strong> Kullanıcı adı, profil fotoğrafı, tercih ayarları<br/>
        <strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası (isteğe bağlı)<br/>
        <strong>Ses Verileri:</strong> Yüklediğiniz ses dosyaları ve üretilen ses çıktıları<br/>
        <strong>Kullanım Verileri:</strong> Platform etkileşim geçmişi, özellik kullanım istatistikleri<br/>
        <strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgisi, cihaz özellikleri
      `
    },
    {
      id: 'veri-kullanim-amaclari',
      title: 'Veri Kullanım Amaçları',
      icon: <Eye className="w-6 h-6" />,
      content: `
        • Hizmet sunumu ve platform işlevselliğinin sağlanması<br/>
        • Kullanıcı hesabı yönetimi ve kimlik doğrulama<br/>
        • Ses işleme ve yapay zeka hizmetlerinin sunulması<br/>
        • Platform güvenliğinin sağlanması ve kötüye kullanımın önlenmesi<br/>
        • Müşteri destek hizmetlerinin verilmesi<br/>
        • Yasal yükümlülüklerin yerine getirilmesi<br/>
        • Hizmet kalitesinin artırılması ve yeni özellik geliştirilmesi
      `
    },
    {
      id: 'veri-paylaşimi',
      title: 'Veri Paylaşımı',
      icon: <Globe className="w-6 h-6" />,
      content: `Kişisel verileriniz, açık rızanız olmaksızın üçüncü taraflarla paylaşılmaz. 
      Yalnızca aşağıdaki durumlarda sınırlı veri paylaşımı gerçekleştirilir:<br/><br/>
        • Yasal yükümlülükler çerçevesinde resmi makamlarla<br/>
        • Hizmet sağlayıcıları ile (sunucu, ödeme, analitik hizmetleri)<br/>
        • Açık rızanızın bulunduğu durumlarda<br/>
        • Platform güvenliğinin sağlanması için gerekli hallerde
      `
    },
    {
      id: 'veri-güvenliği',
      title: 'Veri Güvenliği',
      icon: <Lock className="w-6 h-6" />,
      content: `Kişisel verilerinizin güvenliği için endüstri standardı güvenlik önlemleri alınmaktadır:<br/><br/>
        • SSL/TLS şifrelemesi ile güvenli veri transferi<br/>
        • Güvenli sunucu altyapısı ve düzenli güvenlik güncellemeleri<br/>
        • Erişim kontrolü ve yetkilendirme sistemleri<br/>
        • Düzenli güvenlik denetimleri ve risk değerlendirmeleri<br/>
        • Veri yedekleme ve kayıp önleme sistemleri<br/>
        • Yetkisiz erişim ve veri ihlali tespit sistemleri
      `
    },
    {
      id: 'veri-saklama',
      title: 'Veri Saklama Süresi',
      icon: <Calendar className="w-6 h-6" />,
      content: `Kişisel verileriniz, işleme amaçları doğrultusunda gerekli olan süre boyunca saklanır:<br/><br/>
        • <strong>Hesap Bilgileri:</strong> Hesap aktif olduğu süre boyunca<br/>
        • <strong>Ses Verileri:</strong> Kullanıcı tarafından silinene kadar veya hesap kapanmasından itibaren 30 gün<br/>
        • <strong>İşlem Geçmişi:</strong> Yasal gereklilikler doğrultusunda 10 yıl<br/>
        • <strong>İletişim Kayıtları:</strong> 3 yıl<br/>
        • <strong>Log Kayıtları:</strong> 2 yıl
      `
    },
    {
      id: 'kullanici-haklari',
      title: 'Kullanıcı Hakları',
      icon: <Shield className="w-6 h-6" />,
      content: `KVKK kapsamında sahip olduğunuz haklar:<br/><br/>
        • Kişisel verilerinizin işlenip işlenmediğini öğrenme<br/>
        • İşlenen kişisel verileriniz hakkında bilgi talep etme<br/>
        • İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme<br/>
        • Yurt içinde veya yurt dışında aktar verilerinizin aktarıldığı tarafları bilme<br/>
        • Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme<br/>
        • Belirtilen şartlar çerçevesinde kişisel verilerinizin silinmesini isteme<br/>
        • Yapılan işlemlerden üçüncü kişilere bildirilmesini isteme<br/>
        • İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi sonucu aleyhte bir sonuçla karşılaştığında buna itiraz etme<br/>
        • Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-16 px-6 font-['Inter']">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Gizlilik Politikası
              </h1>
              <p className="text-xl text-gray-600">
                Son güncellenme: 5 Aralık 2024
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Yanki AI olarak, kişisel verilerinizin gizliliği ve güvenliği konusunda en yüksek standartları 
            benimsiyoruz. Bu politika, verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında 
            şeffaf bilgi sunmaktadır.
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
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group"
              >
                <div className="text-gray-500 group-hover:text-blue-600 transition-colors">
                  {section.icon}
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
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
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-blue-600">
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

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mt-16 text-center text-white">
          <Mail className="w-12 h-12 mx-auto mb-4 text-blue-100" />
          <h3 className="text-2xl font-bold mb-4">Sorularınız mı var?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Gizlilik politikamız veya kişisel verileriniz hakkında herhangi bir sorunuz varsa, 
            bizimle iletişime geçmekten çekinmeyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              İletişime Geç
            </Link>
            <span className="text-blue-200">
              E-posta: privacy@yankitr.com
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
              Ana Sayfa
            </Link>
            <Link href="/terms-of-service" className="hover:text-blue-600 transition-colors font-medium">
              Kullanım Şartları
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors font-medium">
              İletişim
            </Link>
            <Link href="/help" className="hover:text-blue-600 transition-colors font-medium">
              Yardım
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}