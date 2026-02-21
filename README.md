# InstaManager - Instagram Takipçi Düzenleyici

Bu proje, Instagram hesabınızdaki takipçileri ve takip ettiklerinizi yönetmenize yardımcı olan web tabanlı bir araçtır.

## Özellikler

- **Geri Takip Etmeyenler**: Siz takip ediyorsunuz ama onlar sizi etmiyor.
- **Hayranlar**: Onlar sizi takip ediyor ama siz onları etmiyorsunuz.
- **Karşılıklı Takip**: İki taraf da birbirini takip ediyor.
- **Hızlı İşlemler**: Tek tıkla takibi bırakma veya geri takip etme.
- **Premium Tasarım**: Karanlık mod ve modern cam (glassmorphism) tasarımı.

## Kurulum ve Çalıştırma

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Yerel geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. Tarayıcınızda `http://localhost:3000` adresine gidin.

## Ücretsiz Yayınlama (Deployment)

Bu projeyi ücretsiz olarak yayınlamak için en iyi seçenek **Vercel**'dir:

1. Bu kodları bir GitHub deposuna (repository) yükleyin.
2. [Vercel](https://vercel.com) hesabınıza giriş yapın.
3. "Add New Project" diyerek GitHub deponuzu seçin.
4. "Deploy" butonuna basın.

## Güvenlik Uyarısı

Bu araç Instagram'ın resmi API'sini değil, özel bir kütüphaneyi kullanır. 
- Hesabınızın güvenliği için iki faktörlü doğrulamayı (2FA) açık tutun.
- Instagram, farklı bir IP adresinden giriş yapıldığı için "Şüpheli Giriş Denemesi" uyarısı verebilir, bunu onaylamanız gerekebilir.
- Çok hızlı ve çok fazla işlem yapmak hesabınızın geçici olarak engellenmesine neden olabilir.
