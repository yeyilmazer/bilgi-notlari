import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Kurabiye (Cookie) tipini daha sağlam tanımlıyoruz
type CookieToSet = {
  name: string;
  value: string;
  options?: any; // Next.js cookie seçenekleri ile uyumluluk için any kullanmak en güvenlisi
};

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Hata veren kısım burasıydı, tipi açıkça belirttik
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Server Component'lerde kurabiye set etmek bazen kısıtlıdır, 
            // middleware bu durumu genelde çözer.
          }
        },
      },
    }
  );
}
