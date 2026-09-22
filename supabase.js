/* Put only your Supabase project URL and anon/publishable key here. Never use service_role. */
window.VELIX_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY"
};
window.supabaseClient = null;

window.initSupabase = function () {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.VELIX_CONFIG;
  if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_PROJECT") || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("YOUR_")) return false;
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return true;
};
