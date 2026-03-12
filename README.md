# Knowledge Site Production

Bu proje, not / kategori / etiket / dipnot mantığıyla çalışan üretim sürümüdür.

## Teknoloji

- Next.js App Router
- Supabase Auth
- Supabase Postgres
- Server Components + Route Handlers

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase kurulumu

1. Supabase projesi aç.
2. `supabase/schema.sql` dosyasını SQL Editor'de çalıştır.
3. Auth > Users bölümünden bir admin kullanıcı ekle.
4. `.env.local` içine anahtarları yaz.

## Giriş

- `/login` üzerinden admin girişi yapılır.
- `/admin` alanı auth korumalıdır.
- Public kullanıcılar sadece yayımlanan notları görür.

## Önemli sayfalar

- `/` anasayfa
- `/not/[slug]` not detay
- `/kategori/[slug]` kategori detay
- `/etiket/[slug]` etiket detay
- `/login` admin giriş
- `/admin` düzenleme alanı

## Dipnot mantığı

- Metinde `[1] [2] [3]` referansları saklanır.
- Dipnotlar veritabanında `sort_order` ile tutulur.
- Metindeki referansa tıklayınca dipnot satırı vurgulanır.
- Aşağıdaki dipnot numarasına tıklayınca metindeki yerine dönülür.

## Not

Bu proje burada paketlenmiş durumda. Supabase proje bilgilerini girdikten sonra doğrudan çalıştırılabilir.
