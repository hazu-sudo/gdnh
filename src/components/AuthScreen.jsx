import { useState } from "react";
import { APP_NAME } from "../data.js";
import { supabase } from "../cloud/supabaseClient.js";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMagicLink(event) {
    event.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    setMessage("");
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setMessage(error
      ? "ログイン用メールを送れませんでした。入力内容と通信環境をご確認ください。"
      : "ログイン用のリンクを送りました。メールからこのアプリを開いてください。");
    setSending(false);
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <span className="auth-bookmark" aria-hidden="true" />
        <p className="eyebrow">ACCOUNT</p>
        <h1>{APP_NAME}</h1>
        <p>PCとiPhoneで同じしおりを開くために、メールアドレスでログインします。</p>
        <form onSubmit={sendMagicLink}>
          <label>
            <span>メールアドレス</span>
            <input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>
          <button className="primary-button" disabled={sending} type="submit">
            {sending ? "送信しています" : "ログイン用リンクを受け取る"}
          </button>
        </form>
        {message && <p className="auth-message" role="status">{message}</p>}
        <small>同じメールアドレスでログインすると、どの端末でも同じデータを表示します。</small>
      </section>
    </main>
  );
}
