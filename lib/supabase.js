import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseAnonKey.includes("your-supabase-anon-key")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Membuat room live baru di Supabase
 */
export async function createLiveRoom(hostName, roomSlug) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error("Supabase belum dikonfigurasi di .env.local"),
    };
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .insert([
        {
          host_name: hostName,
          room_slug: roomSlug,
          is_active: true,
          allow_submissions: true,
        },
      ])
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Mengambil detail room berdasarkan ID (UID)
 */
export async function getRoom(roomId) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error("Supabase belum dikonfigurasi di .env.local"),
    };
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Memperbarui status room (buka/tutup penerimaan URL)
 */
export async function toggleRoomSubmissions(roomId, allowSubmissions) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error("Supabase belum dikonfigurasi di .env.local"),
    };
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .update({ allow_submissions: allowSubmissions, updated_at: new Date().toISOString() })
      .eq("id", roomId)
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Menutup room secara permanen
 */
export async function closeRoom(roomId) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error("Supabase belum dikonfigurasi di .env.local"),
    };
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .update({ is_active: false, allow_submissions: false, updated_at: new Date().toISOString() })
      .eq("id", roomId)
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Menghapus room dan seluruh data antrean terkait dari Supabase secara permanen
 */
export async function deleteRoom(roomId) {
  if (!isSupabaseConfigured || !supabase || !roomId) {
    return { data: null, error: null };
  }

  try {
    // Bersihkan antrean terkait terlebih dahulu
    await supabase.from("queue_submissions").delete().eq("room_id", roomId);

    // Hapus data room
    const { data, error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", roomId);

    return { data, error };
  } catch (err) {
    console.error("[WebRev] Gagal menghapus room dari Supabase:", err);
    return { data: null, error: err };
  }
}

/**
 * Menghapus seluruh sesi room dan data UID milik host dari Supabase saat Logout
 */
export async function deleteHostRooms(hostName) {
  if (!isSupabaseConfigured || !supabase || !hostName) {
    return { data: null, error: null };
  }

  try {
    const cleanName = hostName.trim();
    const slug = `@${cleanName}`;

    // Cari semua room milik host ini
    const { data: hostRooms } = await supabase
      .from("rooms")
      .select("id")
      .or(`host_name.ilike.${cleanName},room_slug.ilike.${slug}`);

    if (hostRooms && hostRooms.length > 0) {
      const roomIds = hostRooms.map((r) => r.id);

      // Bersihkan antrean yang terhubung dengan room-room ini
      await supabase
        .from("queue_submissions")
        .delete()
        .in("room_id", roomIds);

      // Hapus data room milik host
      const { data, error } = await supabase
        .from("rooms")
        .delete()
        .in("id", roomIds);

      return { data, error };
    }

    return { data: null, error: null };
  } catch (err) {
    console.error("[WebRev] Gagal membersihkan sesi host dari Supabase:", err);
    return { data: null, error: err };
  }
}

/**
 * Penonton mengirimkan website ke room
 */
export async function submitWebsiteToRoom({ roomId, submitterName, url, note }) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      data: null,
      error: new Error("Supabase belum dikonfigurasi di .env.local"),
    };
  }

  try {
    const { data, error } = await supabase
      .from("queue_submissions")
      .insert([
        {
          room_id: roomId,
          submitter_name: submitterName.trim(),
          url: url.trim(),
          note: (note || "").trim(),
          status: "pending",
        },
      ])
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Menghitung jumlah antrean yang sudah masuk di room
 */
export async function getRoomQueueCount(roomId) {
  if (!isSupabaseConfigured || !supabase) {
    return { count: 0, error: null };
  }

  try {
    const { count, error } = await supabase
      .from("queue_submissions")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId);

    return { count: count || 0, error };
  } catch (err) {
    return { count: 0, error: err };
  }
}
