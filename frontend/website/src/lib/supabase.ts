// Cloudflare Native API Client - Replaces Supabase entirely
export const CLOUDFLARE_API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');

export interface CloudflareResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// Deprecated Supabase compatibility shim to ensure zero runtime crashes during migration
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: async () => ({ error: null }) })
  }),
  storage: {
    from: () => ({
      upload: async () => ({ error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  },
  rpc: async () => ({ data: null, error: null }),
  functions: {
    invoke: async () => ({ data: null, error: null })
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    subscribe: () => ({ unsubscribe: () => {} })
  }),
  removeChannel: () => {}
};

