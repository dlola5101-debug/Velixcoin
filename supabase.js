window.VELIX_CONFIG = {
  SUPABASE_URL: "https://kzkmlwprdjotbguwaclp.supabase.co",
  SUPABASE_ANON_KEY: sb_publishable_r_KYRFaqP8P7pxT7tLuNCA_lMQia1t0
};

window.supabaseClient = null;

window.initSupabase = function () {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.VELIX_CONFIG;

  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_URL.includes(https://kzkmlwprdjotbguwaclp.supabase.co) ||
    SUPABASE_ANON_KEY.includes(sb_publishable_r_KYRFaqP8P7pxT7tLuNCA_lMQia1t0)
  ) {
    return false;
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  return true;
};
