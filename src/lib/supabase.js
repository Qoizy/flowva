import { createClient } from "@supabase/supabase-js";

// SUPABASE CLIENT CONFIGURATION

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

// AUTHENTICATION HELPERS

export const authHelpers = {
  /**
   * Sign up a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {object} metadata - Optional user metadata (full_name, etc.)
   * @param {string} referralCode - Optional referral code
   */
  signUp: async (email, password, metadata = {}, referralCode = null) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Process referral if code provided
      if (referralCode && data.user) {
        await dbHelpers.processReferral(data.user.id, referralCode);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Sign in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  },

  /**
   * Get the current user
   */
  getUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  /**
   * Reset password - sends email with reset link
   * @param {string} email - User's email
   */
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Update user password
   * @param {string} newPassword - New password
   */
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Update user metadata
   * @param {object} metadata - User metadata to update
   */
  updateUserMetadata: async (metadata) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Subscribe to auth state changes
   * @param {function} callback - Callback function for auth changes
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// DATABASE HELPERS

export const dbHelpers = {
  /**
   * Get complete user dashboard data
   * @param {string} userId - User's UUID
   */
  getUserDashboard: async (userId) => {
    try {
      const { data, error } = await supabase.rpc("get_user_dashboard_data", {
        p_user_id: userId,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user dashboard:", error);
      return { data: null, error };
    }
  },

  /**
   * Handle daily check-in
   * @param {string} userId - User's UUID
   */
  checkIn: async (userId) => {
    try {
      const { data, error } = await supabase.rpc("handle_daily_checkin", {
        p_user_id: userId,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error checking in:", error);
      return { data: null, error };
    }
  },

  /**
   * Complete a task
   * @param {string} userId - User's UUID
   * @param {string} taskId - Task UUID
   */
  completeTask: async (userId, taskId) => {
    try {
      const { data, error } = await supabase.rpc("complete_task", {
        p_user_id: userId,
        p_task_id: taskId,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error completing task:", error);
      return { data: null, error };
    }
  },

  /**
   * Claim a reward
   * @param {string} userId - User's UUID
   * @param {string} rewardId - Reward UUID
   */
  claimReward: async (userId, rewardId) => {
    try {
      const { data, error } = await supabase.rpc("claim_reward", {
        p_user_id: userId,
        p_reward_id: rewardId,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error claiming reward:", error);
      return { data: null, error };
    }
  },

  /**
   * Process referral on signup
   * @param {string} newUserId - New user's UUID
   * @param {string} referralCode - Referral code
   */
  processReferral: async (newUserId, referralCode) => {
    try {
      const { data, error } = await supabase.rpc("process_referral_signup", {
        p_new_user_id: newUserId,
        p_referral_code: referralCode,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error processing referral:", error);
      return { data: null, error };
    }
  },

  /**
   * Get all active rewards
   */
  getRewards: async () => {
    try {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("is_active", true)
        .order("points_required", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching rewards:", error);
      return { data: null, error };
    }
  },

  /**
   * Get all active tasks
   */
  getTasks: async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_active", true)
        .order("points_reward", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return { data: null, error };
    }
  },

  /**
   * Get featured tools
   */
  getFeaturedTools: async () => {
    try {
      const { data, error } = await supabase
        .from("featured_tools")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching featured tools:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user's claimed rewards
   * @param {string} userId - User's UUID
   */
  getClaimedRewards: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_claimed_rewards")
        .select(
          `
          *,
          rewards (
            id,
            title,
            description,
            points_required,
            reward_type,
            reward_value
          )
        `
        )
        .eq("user_id", userId)
        .order("claimed_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user's completed tasks
   * @param {string} userId - User's UUID
   */
  getCompletedTasks: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_completed_tasks")
        .select(
          `
          *,
          tasks (
            id,
            title,
            description,
            task_type
          )
        `
        )
        .eq("user_id", userId)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user's check-in history for the past week
   * @param {string} userId - User's UUID
   */
  getCheckInHistory: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("check_in_history")
        .select("*")
        .eq("user_id", userId)
        .gte(
          "check_in_date",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        )
        .order("check_in_date", { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching check-in history:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user's points transactions
   * @param {string} userId - User's UUID
   * @param {number} limit - Number of transactions to fetch
   */
  getPointsTransactions: async (userId, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from("points_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching points transactions:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user profile
   * @param {string} userId - User's UUID
   */
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return { data: null, error };
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User's UUID
   * @param {object} updates - Profile updates
   */
  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user rewards data (points, streak, etc.)
   * @param {string} userId - User's UUID
   */
  getUserRewards: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      return { data: null, error };
    }
  },

  /**
   * Get user's referrals
   * @param {string} userId - User's UUID
   */
  getUserReferrals: async (userId) => {
    return supabase.from("referrals").select("*").eq("referrer_id", userId);
  },
};

// STORAGE HELPERS (for future use with avatars)

export const storageHelpers = {
  /**
   * Upload user avatar
   * @param {string} userId - User's UUID
   * @param {File} file - Image file
   */
  uploadAvatar: async (userId, file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      return { data: { path: data.path, url: publicUrl }, error: null };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return { data: null, error };
    }
  },

  /**
   * Get avatar URL
   * @param {string} path - Storage path
   */
  getAvatarUrl: (path) => {
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  },
};

// REALTIME HELPERS (for future real-time features)

export const realtimeHelpers = {
  /**
   * Subscribe to user rewards changes
   * @param {string} userId - User's UUID
   * @param {function} callback - Callback function
   */
  subscribeToUserRewards: (userId, callback) => {
    return supabase
      .channel(`user_rewards:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_rewards",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  /**
   * Subscribe to points transactions
   * @param {string} userId - User's UUID
   * @param {function} callback - Callback function
   */
  subscribeToTransactions: (userId, callback) => {
    return supabase
      .channel(`points_transactions:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "points_transactions",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

// UTILITY HELPERS

export const utils = {
  /**
   * Format points with commas
   * @param {number} points - Points to format
   */
  formatPoints: (points) => {
    return points.toLocaleString();
  },

  /**
   * Get days of week for check-in calendar
   */
  getWeekDays: () => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const today = new Date();
    const weekDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      weekDays.push({
        day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        date: date.toISOString().split("T")[0],
        isToday: i === 0,
      });
    }

    return weekDays;
  },

  /**
   * Calculate progress to next level
   * @param {number} totalPoints - User's total points
   */
  calculateLevelProgress: (totalPoints) => {
    const pointsPerLevel = 1000;
    const currentLevel = Math.floor(totalPoints / pointsPerLevel) + 1;
    const pointsInCurrentLevel = totalPoints % pointsPerLevel;
    const progressPercentage = (pointsInCurrentLevel / pointsPerLevel) * 100;
    const pointsToNextLevel = pointsPerLevel - pointsInCurrentLevel;

    return {
      currentLevel,
      pointsInCurrentLevel,
      progressPercentage,
      pointsToNextLevel,
      nextLevel: currentLevel + 1,
    };
  },

  /**
   * Generate referral link
   * @param {string} referralCode - Referral code
   */
  generateReferralLink: (referralCode) => {
    return `${window.location.origin}/signup?ref=${referralCode}`;
  },
};

export default supabase;
