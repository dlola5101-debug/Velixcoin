window.Auth = (() => {
  let mode = "login";

  const forms = {
    login: () => `
      <div class="auth-heading"><span class="eyebrow">WELCOME BACK</span><h1>Enter VelixCoin</h1><p>Sign in to your virtual gaming workspace.</p></div>
      <form id="loginForm" class="stack">
        <label>Email<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>
        <label>Password<input name="password" type="password" required autocomplete="current-password" placeholder="••••••••"></label>
        <button class="primary wide" type="submit">Sign in</button>
        <button class="link-btn" type="button" data-auth="forgot">Forgot password?</button>
        <p class="switch">New here? <button type="button" class="link-btn" data-auth="register">Create account</button></p>
      </form>`,
    register: () => `
      <div class="auth-heading"><span class="eyebrow">CREATE ACCOUNT</span><h1>Build your profile</h1><p>Choose a username for your VelixCoin identity.</p></div>
      <form id="registerForm" class="stack">
        <label>Display name<input name="displayName" required maxlength="40" placeholder="Your name"></label>
        <label>Username<input name="username" required maxlength="24" pattern="[A-Za-z0-9_]{3,24}" placeholder="jorka"></label>
        <label>Email<input name="email" type="email" required autocomplete="email"></label>
        <label>Password<input name="password" type="password" required minlength="8" autocomplete="new-password"></label>
        <button class="primary wide" type="submit">Create account</button>
        <p class="switch">Already have an account? <button type="button" class="link-btn" data-auth="login">Sign in</button></p>
      </form>`,
    forgot: () => `
      <div class="auth-heading"><span class="eyebrow">RECOVER ACCESS</span><h1>Reset password</h1><p>We'll send a secure reset link to your email.</p></div>
      <form id="forgotForm" class="stack">
        <label>Email<input name="email" type="email" required></label>
        <button class="primary wide" type="submit">Send reset link</button>
        <button class="link-btn" type="button" data-auth="login">Back to sign in</button>
      </form>`
  };

  function render(next = mode) {
    mode = next;
    document.getElementById("authForms").innerHTML = forms[mode]();
    document.querySelectorAll("[data-auth]").forEach(b => b.onclick = () => render(b.dataset.auth));
    document.getElementById("loginForm")?.addEventListener("submit", login);
    document.getElementById("registerForm")?.addEventListener("submit", register);
    document.getElementById("forgotForm")?.addEventListener("submit", forgot);
  }

  async function login(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await UI.busy(e.currentTarget.querySelector("button[type=submit]"), async () => {
      const { error } = await supabaseClient.auth.signInWithPassword({ email: f.get("email"), password: f.get("password") });
      if (error) throw error;
    });
  }

  async function register(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const username = String(f.get("username")).trim().toLowerCase();
    await UI.busy(e.currentTarget.querySelector("button[type=submit]"), async () => {
      const { data, error } = await supabaseClient.auth.signUp({
        email: f.get("email"), password: f.get("password"),
        options: { data: { username, display_name: f.get("displayName") } }
      });
      if (error) throw error;
      if (data.user) {
        const { error: pErr } = await supabaseClient.from("profiles").upsert({
          id: data.user.id, username, display_name: f.get("displayName")
        }, { onConflict: "id" });
        if (pErr) throw pErr;
        await supabaseClient.from("wallets").upsert({ user_id: data.user.id, balance: 0 }, { onConflict: "user_id" });
      }
      UI.toast("Account created. Check your email if confirmation is enabled.", "success");
    });
  }

  async function forgot(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await UI.busy(e.currentTarget.querySelector("button[type=submit]"), async () => {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(f.get("email"), { redirectTo: location.href });
      if (error) throw error;
      UI.toast("Password reset email sent.", "success");
    });
  }

  async function logout() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) UI.toast(error.message, "error");
  }

  return { render, logout };
})();
