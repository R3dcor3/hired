// supabase.js
// Drop this file in your src/ folder
// npm install @supabase/supabase-js

import { createClient } from "@supabase/supabase-js";

// ─── Replace these with your project values ───────────────────────────────
// Supabase Dashboard > Project Settings > API
const SUPABASE_URL  = "https://jxhcaubftgidxzqnarhj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aGNhdWJmdGdpZHh6cW5hcmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NjYzMTIsImV4cCI6MjA5NjA0MjMxMn0.1EO3k2f5aG4zKt3Rj_mdwzlWW7PWGoJ66iTsw5k0iac";
// ──────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
  },
});

// ============================================================
//  AUTH
// ============================================================

export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const onAuthChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
};

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
};

// ============================================================
//  PROFILE
// ============================================================

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const uploadAvatar = async (userId, file) => {
  const ext  = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  await updateProfile(userId, { avatar_url: data.publicUrl });
  return data.publicUrl;
};

export const uploadBanner = async (userId, file) => {
  const ext  = file.name.split(".").pop();
  const path = `${userId}/banner.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("banners")
    .upload(path, file, { upsert: true });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from("banners").getPublicUrl(path);
  await updateProfile(userId, { banner_url: data.publicUrl });
  return data.publicUrl;
};

// ============================================================
//  POSTS
// ============================================================

export const getPosts = async ({ search="", category="All", type="all", workType="all", maxBudget=10000, availOnly=false, page=1, pageSize=12 } = {}) => {
  let q = supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_user_id_fkey(id, name, avatar_url, country, is_verified, rating, review_count, response_rate, reply_time, availability)
    `, { count: "exact" })
    .eq("is_active", true)
    .lte("budget_num", maxBudget)
    .gt("expires_at", new Date().toISOString())
    .order("is_featured", { ascending: false })
    .order("created_at",  { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (category !== "All") q = q.eq("category", category);
  if (type !== "all")     q = q.eq("type", type);
  if (workType !== "all") q = q.eq("work_type", workType);
  if (availOnly)          q = q.eq("type", "offer");

  if (search.trim()) {
    q = q.textSearch("title || ' ' || summary || ' ' || category", search.trim(), {
      type: "websearch", config: "english",
    });
  }

  const { data, error, count } = await q;
  if (error) throw error;
  return { posts: data || [], total: count || 0 };
};

export const getPost = async (postId) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`*, author:profiles!posts_user_id_fkey(*)`)
    .eq("id", postId)
    .single();
  if (error) throw error;
  // Increment view count (fire and forget)
  supabase.from("posts").update({ views: (data.views || 0) + 1 }).eq("id", postId);
  return data;
};

export const getUserPosts = async (userId) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createPost = async (userId, postData) => {
  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: userId, ...postData })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updatePost = async (postId, updates) => {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", postId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePost = async (postId) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
};

export const renewPost = async (postId) => {
  return updatePost(postId, {
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  });
};

// ============================================================
//  SAVED POSTS
// ============================================================

export const getSavedPostIds = async (userId) => {
  const { data, error } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("user_id", userId);
  if (error) throw error;
  return (data || []).map(r => r.post_id);
};

export const savePost = async (userId, postId) => {
  const { error } = await supabase
    .from("saved_posts")
    .insert({ user_id: userId, post_id: postId });
  if (error && error.code !== "23505") throw error; // ignore duplicate
};

export const unsavePost = async (userId, postId) => {
  const { error } = await supabase
    .from("saved_posts")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);
  if (error) throw error;
};

export const getSavedPosts = async (userId) => {
  const { data, error } = await supabase
    .from("saved_posts")
    .select(`post:posts(*, author:profiles!posts_user_id_fkey(id,name,avatar_url,is_verified,rating,response_rate,reply_time))`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(r => r.post).filter(Boolean);
};

// ============================================================
//  CONVERSATIONS & MESSAGES
// ============================================================

export const getOrCreateConversation = async (myId, theirId, postId = null) => {
  // Check existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .or(`and(participant_a.eq.${myId},participant_b.eq.${theirId}),and(participant_a.eq.${theirId},participant_b.eq.${myId})`)
    .eq("post_id", postId || "00000000-0000-0000-0000-000000000000")
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ participant_a: myId, participant_b: theirId, post_id: postId })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getConversations = async (userId) => {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      participant_a_profile:profiles!conversations_participant_a_fkey(id,name,avatar_url,is_verified),
      participant_b_profile:profiles!conversations_participant_b_fkey(id,name,avatar_url,is_verified),
      post:posts(id,title)
    `)
    .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
    .order("last_msg_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getMessages = async (conversationId) => {
  const { data, error } = await supabase
    .from("messages")
    .select(`*, sender:profiles!messages_sender_id_fkey(id,name,avatar_url)`)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const sendMessage = async (conversationId, senderId, body) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const markMessagesRead = async (conversationId, userId) => {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId);

  // Reset unread counter
  const { data: convo } = await supabase
    .from("conversations")
    .select("participant_a")
    .eq("id", conversationId)
    .single();

  if (convo) {
    const field = convo.participant_a === userId ? "unread_a" : "unread_b";
    await supabase.from("conversations").update({ [field]: 0 }).eq("id", conversationId);
  }
};

// Realtime subscription for new messages in a conversation
export const subscribeToMessages = (conversationId, callback) => {
  return supabase
    .channel(`messages:${conversationId}`)
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `conversation_id=eq.${conversationId}`,
    }, payload => callback(payload.new))
    .subscribe();
};

// Realtime subscription for conversation list updates
export const subscribeToConversations = (userId, callback) => {
  return supabase
    .channel(`convos:${userId}`)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "conversations",
      filter: `participant_a=eq.${userId}`,
    }, callback)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "conversations",
      filter: `participant_b=eq.${userId}`,
    }, callback)
    .subscribe();
};

// ============================================================
//  NOTIFICATIONS
// ============================================================

export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
};

export const markNotifRead = async (notifId) => {
  await supabase.from("notifications").update({ is_read: true }).eq("id", notifId);
};

export const markAllNotifsRead = async (userId) => {
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
};

export const createNotification = async (userId, type, title, body="", link="") => {
  await supabase.from("notifications").insert({ user_id: userId, type, title, body, link });
};

export const subscribeToNotifications = (userId, callback) => {
  return supabase
    .channel(`notifs:${userId}`)
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${userId}`,
    }, payload => callback(payload.new))
    .subscribe();
};

// ============================================================
//  PROPOSALS
// ============================================================

export const submitProposal = async (postId, senderId, receiverId, message) => {
  const { data, error } = await supabase
    .from("proposals")
    .insert({ post_id: postId, sender_id: senderId, receiver_id: receiverId, message })
    .select()
    .single();
  if (error) throw error;

  // Auto-notify the receiver
  await createNotification(
    receiverId, "proposal",
    "New proposal on your post",
    message.slice(0, 120),
    postId
  );

  // Increment post applicant count
  await supabase.rpc("increment_applicants", { post_id: postId });

  return data;
};

export const getProposalsForUser = async (userId) => {
  const { data, error } = await supabase
    .from("proposals")
    .select(`*, post:posts(id,title), sender:profiles!proposals_sender_id_fkey(id,name,avatar_url,is_verified)`)
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getSentProposals = async (userId) => {
  const { data, error } = await supabase
    .from("proposals")
    .select(`*, post:posts(id,title), receiver:profiles!proposals_receiver_id_fkey(id,name,avatar_url)`)
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const updateProposalStatus = async (proposalId, status) => {
  const { data, error } = await supabase
    .from("proposals")
    .update({ status })
    .eq("id", proposalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ============================================================
//  UNLOCKS / CREDITS
// ============================================================

export const hasUnlocked = async (userId, postId) => {
  const { data } = await supabase
    .from("unlocks")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();
  return !!data;
};

export const unlockPost = async (userId, postId) => {
  const profile = await getProfile(userId);
  if (!profile.is_paid && profile.credits < 1) throw new Error("No credits remaining");

  await supabase.from("unlocks").insert({ user_id: userId, post_id: postId });

  if (!profile.is_paid) {
    await updateProfile(userId, { credits: profile.credits - 1 });
  }
};

export const getUnlockedPostIds = async (userId) => {
  const { data } = await supabase
    .from("unlocks")
    .select("post_id")
    .eq("user_id", userId);
  return (data || []).map(r => r.post_id);
};

// ============================================================
//  PORTFOLIO
// ============================================================

export const getPortfolio = async (userId) => {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addPortfolioItem = async (userId, item, imageFile = null) => {
  let image_url = item.image_url || null;

  if (imageFile) {
    const ext  = imageFile.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio")
      .upload(path, imageFile);
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    image_url = data.publicUrl;
  }

  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({ user_id: userId, ...item, image_url })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePortfolioItem = async (itemId) => {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", itemId);
  if (error) throw error;
};

// ============================================================
//  NOTE: Run this in Supabase SQL Editor:
//
//  create or replace function increment_applicants(post_id uuid)
//  returns void language sql security definer as $$
//    update public.posts set applicants = applicants + 1 where id = post_id;
//  $$;
// ============================================================
