import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginAction } from "@/lib/actions";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/admin");
  }

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card" style={{ padding: 24 }}>
        <h1>Admin Girişi</h1>
        <form action={loginAction} className="grid" style={{ gap: 12 }}>
          <input className="input" type="email" name="email" placeholder="E-posta" />
          <input className="input" type="password" name="password" placeholder="Şifre" />
          <button className="btn btn-primary" type="submit">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}
