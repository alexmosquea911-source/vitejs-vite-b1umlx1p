import { useState, useEffect, useRef } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#07090F",
  surface: "#0D1117",
  card: "#111827",
  border: "#1E3A5F",
  borderGlow: "#3B82F6",
  accent: "#3B82F6",
  accentDark: "#1D4ED8",
  accentGlow: "rgba(59,130,246,0.15)",
  text: "#F1F5F9",
  muted: "#64748B",
  subtle: "#1E293B",
  danger: "#EF4444",
  success: "#22C55E",
};

// ─── STORAGE HELPERS (simulated real DB with localStorage) ────────────────────
const db = {
  get: (key) => { try { return JSON.parse(localStorage.getItem("ps_" + key) || "null"); } catch { return null; } },
  set: (key, val) => localStorage.setItem("ps_" + key, JSON.stringify(val)),
  users: () => db.get("users") || {},
  saveUsers: (u) => db.set("users", u),
  posts: () => db.get("posts") || [],
  savePosts: (p) => db.set("posts", p),
  messages: () => db.get("messages") || {},
  saveMessages: (m) => db.set("messages", m),
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = {
  home: (a) => <svg width="22" height="22" fill={a?"#3B82F6":"none"} stroke={a?"#3B82F6":"#64748B"} strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: (a) => <svg width="22" height="22" fill="none" stroke={a?"#3B82F6":"#64748B"} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus: () => <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  chat: (a) => <svg width="22" height="22" fill={a?"#3B82F6":"none"} stroke={a?"#3B82F6":"#64748B"} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  user: (a) => <svg width="22" height="22" fill={a?"#3B82F6":"none"} stroke={a?"#3B82F6":"#64748B"} strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  heart: (f) => <svg width="22" height="22" fill={f?"#EF4444":"none"} stroke={f?"#EF4444":"#64748B"} strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  comment: () => <svg width="22" height="22" fill="none" stroke="#64748B" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  send: () => <svg width="20" height="20" fill="none" stroke="#64748B" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  back: () => <svg width="22" height="22" fill="none" stroke="#F1F5F9" strokeWidth="2" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  eye: (show) => show
    ? <svg width="18" height="18" fill="none" stroke="#64748B" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="18" height="18" fill="none" stroke="#64748B" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  image: () => <svg width="40" height="40" fill="none" stroke="#3B82F6" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  logout: () => <svg width="20" height="20" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  grid: () => <svg width="20" height="20" fill="#64748B" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  more: () => <svg width="18" height="18" fill="#64748B" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  check: () => <svg width="16" height="16" fill="none" stroke="#22C55E" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── AVATAR COMPONENT ─────────────────────────────────────────────────────────
function Avatar({ username, size = 36, ring = false }) {
  const colors = ["#3B82F6","#8B5CF6","#EC4899","#F59E0B","#10B981","#EF4444"];
  const color = colors[(username?.charCodeAt(0) || 0) % colors.length];
  const letter = (username || "?")[0].toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
      border: ring ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontWeight: 800, color: "#fff",
      flexShrink: 0,
    }}>
      {letter}
    </div>
  );
}

// ─── TIME HELPER ──────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "ahora";
  if (s < 3600) return Math.floor(s/60) + "m";
  if (s < 86400) return Math.floor(s/3600) + "h";
  return Math.floor(s/86400) + "d";
}

// ─── INPUT COMPONENT ──────────────────────────────────────────────────────────
function Input({ label, type="text", value, onChange, placeholder, showToggle }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ color: C.muted, fontSize: 12, marginBottom: 6, fontWeight: 600, letterSpacing: .5 }}>{label}</div>}
      <div style={{ position: "relative" }}>
        <input
          type={showToggle ? (show ? "text" : "password") : type}
          value={value} onChange={onChange} placeholder={placeholder}
          style={{
            width: "100%", boxSizing: "border-box",
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 12, color: C.text, fontSize: 15,
            padding: showToggle ? "13px 44px 13px 16px" : "13px 16px",
            outline: "none", transition: "border .2s",
            fontFamily: "inherit",
          }}
          onFocus={e => e.target.style.borderColor = C.accent}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        {showToggle && (
          <button onClick={() => setShow(!show)} style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>{Icon.eye(show)}</button>
        )}
      </div>
    </div>
  );
}

// ─── BTN COMPONENT ────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", style={}, disabled=false }) {
  const styles = {
    primary: { background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: "#fff", boxShadow: `0 4px 20px ${C.accent}44` },
    outline: { background: "transparent", border: `1.5px solid ${C.accent}`, color: C.accent },
    ghost: { background: C.subtle, color: C.text },
    danger: { background: "transparent", border: `1.5px solid ${C.danger}`, color: C.danger },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      border: "none", borderRadius: 12, padding: "13px 20px",
      fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
      width: "100%", transition: "opacity .2s, transform .1s",
      opacity: disabled ? .5 : 1, fontFamily: "inherit",
      ...styles[variant], ...style,
    }}
    onMouseDown={e => { if(!disabled) e.currentTarget.style.transform="scale(.98)"; }}
    onMouseUp={e => { e.currentTarget.style.transform="scale(1)"; }}
    >{children}</button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleAuth = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const users = db.users();
      if (mode === "register") {
        if (!form.username || !form.name || !form.email || !form.password)
          return setError("Completa todos los campos");
        if (form.username.includes(" "))
          return setError("El usuario no puede tener espacios");
        if (users[form.username])
          return setError("Ese usuario ya existe");
        const newUser = {
          username: form.username.toLowerCase(),
          name: form.name,
          email: form.email,
          password: form.password,
          bio: "",
          followers: [],
          following: [],
          createdAt: Date.now(),
        };
        users[form.username.toLowerCase()] = newUser;
        db.saveUsers(users);
        onLogin(newUser);
      } else {
        if (!form.username || !form.password)
          return setError("Completa usuario y contraseña");
        const u = users[form.username.toLowerCase()];
        if (!u) return setError("Usuario no encontrado");
        if (u.password !== form.password) return setError("Contraseña incorrecta");
        onLogin(u);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 16px",
            background: `linear-gradient(135deg, ${C.accent}, #1D4ED8)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 40px ${C.accent}44`,
          }}>
            <svg width="38" height="38" fill="none" stroke="#fff" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="5"/>
              <circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 900, margin: 0,
            background: `linear-gradient(135deg, #fff 30%, ${C.accent})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: -1,
          }}>PicShare</h1>
          <p style={{ color: C.muted, margin: "6px 0 0", fontSize: 14 }}>
            {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta gratis"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: C.card, borderRadius: 20,
          border: `1.5px solid ${C.border}`, padding: 28,
          boxShadow: `0 20px 60px #000a`,
        }}>
          {mode === "register" && (
            <>
              <Input label="NOMBRE COMPLETO" value={form.name} onChange={f("name")} placeholder="Tu nombre" />
              <Input label="USUARIO" value={form.username} onChange={f("username")} placeholder="@usuario" />
              <Input label="EMAIL" type="email" value={form.email} onChange={f("email")} placeholder="email@ejemplo.com" />
            </>
          )}
          {mode === "login" && (
            <Input label="USUARIO" value={form.username} onChange={f("username")} placeholder="@usuario" />
          )}
          <Input label="CONTRASEÑA" value={form.password} onChange={f("password")} placeholder="••••••••" showToggle />

          {error && (
            <div style={{
              background: "#EF444422", border: "1px solid #EF444444",
              borderRadius: 10, padding: "10px 14px", marginBottom: 14,
              color: C.danger, fontSize: 13,
            }}>{error}</div>
          )}

          <Btn onClick={handleAuth} disabled={loading}>
            {loading ? "Cargando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </Btn>

          <div style={{
            textAlign: "center", marginTop: 20, color: C.muted, fontSize: 14,
          }}>
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <span
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setForm({ username: "", name: "", email: "", password: "" }); }}
              style={{ color: C.accent, fontWeight: 700, cursor: "pointer" }}
            >
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FEED SCREEN ──────────────────────────────────────────────────────────────
function FeedScreen({ me, onUserClick }) {
  const [posts, setPosts] = useState([]);
  const [commentModal, setCommentModal] = useState(null);
  const [commentText, setCommentText] = useState("");

  const refresh = () => setPosts(db.posts().slice().reverse());
  useEffect(() => { refresh(); }, []);

  const toggleLike = (postId) => {
    const all = db.posts();
    const idx = all.findIndex(p => p.id === postId);
    if (idx === -1) return;
    const p = all[idx];
    const liked = p.likes.includes(me.username);
    all[idx] = { ...p, likes: liked ? p.likes.filter(u => u !== me.username) : [...p.likes, me.username] };
    db.savePosts(all);
    refresh();
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const all = db.posts();
    const idx = all.findIndex(p => p.id === commentModal.id);
    const comment = { id: Date.now(), user: me.username, text: commentText, ts: Date.now() };
    all[idx].comments = [...(all[idx].comments || []), comment];
    db.savePosts(all);
    setCommentText("");
    setCommentModal({ ...all[idx] });
    refresh();
  };

  if (posts.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: C.accentGlow, border: `2px dashed ${C.borderGlow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{Icon.image()}</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Sin publicaciones aún</div>
          <div style={{ color: C.muted, fontSize: 14 }}>Sigue personas o publica tu primera foto</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
      {posts.map(post => {
        const liked = post.likes.includes(me.username);
        return (
          <div key={post.id} style={{ borderBottom: `1px solid ${C.border}22`, marginBottom: 4 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
              <div onClick={() => onUserClick(post.author)} style={{ cursor: "pointer" }}>
                <Avatar username={post.author} size={38} ring />
              </div>
              <div style={{ flex: 1 }} onClick={() => onUserClick(post.author)} style={{ cursor: "pointer" }}>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{post.author}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>{timeAgo(post.ts)}</div>
              </div>
            </div>
            {/* Image */}
            {post.imageUrl && (
              <img src={post.imageUrl} alt="" style={{ width: "100%", maxHeight: 360, objectFit: "cover", display: "block" }} />
            )}
            {/* Caption only */}
            {!post.imageUrl && post.caption && (
              <div style={{
                margin: "0 14px 10px",
                background: C.subtle, borderRadius: 14, padding: 16,
                color: C.text, fontSize: 15, lineHeight: 1.6,
                border: `1px solid ${C.border}`,
              }}>{post.caption}</div>
            )}
            {/* Actions */}
            <div style={{ padding: "8px 14px 12px" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 8 }}>
                <button onClick={() => toggleLike(post.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0 }}>
                  {Icon.heart(liked)}
                  <span style={{ color: liked ? C.danger : C.muted, fontSize: 13 }}>{post.likes.length}</span>
                </button>
                <button onClick={() => setCommentModal(post)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: 0 }}>
                  {Icon.comment()}
                  <span style={{ color: C.muted, fontSize: 13 }}>{(post.comments||[]).length}</span>
                </button>
              </div>
              {post.imageUrl && post.caption && (
                <p style={{ color: C.text, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700 }}>{post.author} </span>{post.caption}
                </p>
              )}
              {(post.comments || []).length > 0 && (
                <button onClick={() => setCommentModal(post)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, padding: "4px 0 0", display: "block" }}>
                  Ver {post.comments.length} comentario{post.comments.length !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Comment Modal */}
      {commentModal && (
        <div style={{
          position: "fixed", inset: 0, background: "#000b", zIndex: 100,
          display: "flex", alignItems: "flex-end",
        }} onClick={() => setCommentModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.card, borderRadius: "20px 20px 0 0",
            border: `1.5px solid ${C.border}`, borderBottom: "none",
            width: "100%", maxHeight: "75vh", display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${C.border}33` }}>
              <div style={{ width: 40, height: 4, background: C.border, borderRadius: 4, margin: "0 auto 12px" }} />
              <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Comentarios</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {(commentModal.comments || []).length === 0 ? (
                <div style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: "24px 0" }}>No hay comentarios aún. ¡Sé el primero!</div>
              ) : (
                commentModal.comments.map(c => (
                  <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <Avatar username={c.user} size={30} />
                    <div style={{ flex: 1 }}>
                      <span style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{c.user} </span>
                      <span style={{ color: C.text, fontSize: 13 }}>{c.text}</span>
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{timeAgo(c.ts)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}33`, display: "flex", gap: 10 }}>
              <Avatar username={me.username} size={32} />
              <input
                value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="Agrega un comentario..."
                onKeyDown={e => e.key === "Enter" && addComment()}
                style={{
                  flex: 1, background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 20, color: C.text, fontSize: 14, padding: "8px 16px",
                  outline: "none", fontFamily: "inherit",
                }}
              />
              <button onClick={addComment} style={{
                background: C.accent, border: "none", borderRadius: 20,
                padding: "8px 16px", color: "#fff", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
              }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SEARCH SCREEN ────────────────────────────────────────────────────────────
function SearchScreen({ me, onUserClick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const users = db.users();

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const found = Object.values(users).filter(u =>
      u.username !== me.username &&
      (u.username.includes(q) || u.name.toLowerCase().includes(q))
    );
    setResults(found);
  }, [query]);

  const allUsers = Object.values(users).filter(u => u.username !== me.username);

  const toggleFollow = (targetUsername) => {
    const all = db.users();
    const myData = all[me.username];
    const target = all[targetUsername];
    if (!myData || !target) return;
    const isFollowing = myData.following.includes(targetUsername);
    myData.following = isFollowing
      ? myData.following.filter(u => u !== targetUsername)
      : [...myData.following, targetUsername];
    target.followers = isFollowing
      ? target.followers.filter(u => u !== me.username)
      : [...target.followers, me.username];
    all[me.username] = myData;
    all[targetUsername] = target;
    db.saveUsers(all);
  };

  const isFollowing = (username) => {
    const myData = db.users()[me.username];
    return myData?.following?.includes(username);
  };

  const display = query.trim() ? results : allUsers;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: C.surface, borderRadius: 14,
        border: `1.5px solid ${C.border}`, padding: "11px 16px",
        marginBottom: 20,
      }}>
        {Icon.search(false)}
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Buscar personas..."
          style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 15, flex: 1, fontFamily: "inherit" }}
        />
      </div>
      {display.length === 0 ? (
        <div style={{ textAlign: "center", color: C.muted, padding: "40px 0", fontSize: 14 }}>
          {query ? "No se encontraron usuarios" : "Aún no hay otros usuarios registrados"}
        </div>
      ) : (
        display.map(u => (
          <div key={u.username} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0", borderBottom: `1px solid ${C.border}22`,
          }}>
            <div onClick={() => onUserClick(u.username)} style={{ cursor: "pointer" }}>
              <Avatar username={u.username} size={46} ring />
            </div>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onUserClick(u.username)}>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{u.name}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>@{u.username}</div>
            </div>
            <button onClick={() => { toggleFollow(u.username); setQuery(q => q); }} style={{
              background: isFollowing(u.username) ? "transparent" : `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              border: isFollowing(u.username) ? `1.5px solid ${C.border}` : "none",
              borderRadius: 10, padding: "8px 16px",
              color: isFollowing(u.username) ? C.muted : "#fff",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>
              {isFollowing(u.username) ? "Siguiendo" : "Seguir"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// ─── UPLOAD SCREEN ────────────────────────────────────────────────────────────
function UploadScreen({ me, onSuccess }) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePost = () => {
    if (!caption.trim() && !imageUrl.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const all = db.posts();
      const newPost = {
        id: Date.now(),
        author: me.username,
        caption: caption.trim(),
        imageUrl: imageUrl.trim(),
        likes: [],
        comments: [],
        ts: Date.now(),
      };
      db.savePosts([...all, newPost]);
      setLoading(false);
      setSuccess(true);
      setCaption(""); setImageUrl("");
      setTimeout(() => { setSuccess(false); onSuccess(); }, 1200);
    }, 700);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <div style={{ color: C.text, fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Nueva publicación</div>

      {/* Image URL */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, letterSpacing: .5, marginBottom: 8 }}>URL DE IMAGEN (opcional)</div>
        <div style={{
          border: imageUrl ? `1.5px solid ${C.accent}` : `2px dashed ${C.border}`,
          borderRadius: 16, overflow: "hidden", marginBottom: 8,
          transition: "border .2s",
        }}>
          {imageUrl ? (
            <img src={imageUrl} alt="" style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }} onError={() => setImageUrl("")} />
          ) : (
            <div style={{
              height: 160, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              background: C.accentGlow,
            }}>
              {Icon.image()}
              <span style={{ color: C.muted, fontSize: 13 }}>Pega una URL de imagen abajo</span>
            </div>
          )}
        </div>
        <input
          value={imageUrl} onChange={e => setImageUrl(e.target.value)}
          placeholder="https://ejemplo.com/foto.jpg"
          style={{
            width: "100%", boxSizing: "border-box",
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 12, color: C.text, fontSize: 13,
            padding: "11px 14px", outline: "none", fontFamily: "inherit",
          }}
        />
      </div>

      {/* Caption */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, letterSpacing: .5, marginBottom: 8 }}>DESCRIPCIÓN</div>
        <textarea
          value={caption} onChange={e => setCaption(e.target.value)}
          placeholder="Escribe algo..."
          rows={4}
          style={{
            width: "100%", boxSizing: "border-box",
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 12, color: C.text, fontSize: 15,
            padding: 14, outline: "none", resize: "none", fontFamily: "inherit",
          }}
        />
      </div>

      {success ? (
        <div style={{
          background: "#22C55E22", border: "1px solid #22C55E44",
          borderRadius: 12, padding: 14, textAlign: "center",
          color: C.success, fontWeight: 700, fontSize: 16, display: "flex",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {Icon.check()} ¡Publicado!
        </div>
      ) : (
        <Btn onClick={handlePost} disabled={loading || (!caption.trim() && !imageUrl.trim())}>
          {loading ? "Publicando..." : "Publicar"}
        </Btn>
      )}
    </div>
  );
}

// ─── MESSAGES LIST SCREEN ─────────────────────────────────────────────────────
function MessagesScreen({ me, onOpenChat }) {
  const users = db.users();
  const messages = db.messages();
  const myData = users[me.username] || {};
  const following = myData.following || [];

  const chats = Object.keys(messages).filter(key => key.includes(me.username)).map(key => {
    const [u1, u2] = key.split("__");
    const other = u1 === me.username ? u2 : u1;
    const thread = messages[key];
    const last = thread[thread.length - 1];
    return { other, last, key };
  }).filter(c => c.last);

  const contactList = [...new Set([...following, ...chats.map(c => c.other)])];

  if (contactList.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 14 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: C.accentGlow, border: `2px dashed ${C.borderGlow}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{Icon.chat(true)}</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Sin mensajes</div>
          <div style={{ color: C.muted, fontSize: 14 }}>Sigue personas para enviarles mensajes</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
      {contactList.map(username => {
        const user = users[username];
        if (!user) return null;
        const chatKey = [me.username, username].sort().join("__");
        const thread = messages[chatKey] || [];
        const last = thread[thread.length - 1];
        return (
          <div key={username} onClick={() => onOpenChat(username)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 16px", cursor: "pointer",
            borderBottom: `1px solid ${C.border}22`,
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.subtle}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Avatar username={username} size={50} ring />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{user.name}</div>
              <div style={{ color: C.muted, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {last ? last.text : "Envía un mensaje"}
              </div>
            </div>
            {last && <div style={{ color: C.muted, fontSize: 11, flexShrink: 0 }}>{timeAgo(last.ts)}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── CHAT SCREEN ──────────────────────────────────────────────────────────────
function ChatScreen({ me, otherUsername, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();
  const chatKey = [me.username, otherUsername].sort().join("__");
  const other = db.users()[otherUsername] || {};

  const refresh = () => {
    const all = db.messages();
    setMessages(all[chatKey] || []);
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const all = db.messages();
    const thread = all[chatKey] || [];
    const msg = { id: Date.now(), from: me.username, text: text.trim(), ts: Date.now() };
    all[chatKey] = [...thread, msg];
    db.saveMessages(all);
    setText("");
    refresh();
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Chat header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderBottom: `1px solid ${C.border}33`,
        background: C.surface,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {Icon.back()}
        </button>
        <Avatar username={otherUsername} size={36} ring />
        <div>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{other.name || otherUsername}</div>
          <div style={{ color: C.muted, fontSize: 12 }}>@{otherUsername}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: C.muted, fontSize: 14, margin: "auto" }}>
            ¡Empieza la conversación con {other.name || otherUsername}!
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.from === me.username;
          return (
            <div key={msg.id} style={{
              display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "75%",
                background: isMe ? `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` : C.card,
                border: isMe ? "none" : `1px solid ${C.border}`,
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px",
                color: C.text, fontSize: 14, lineHeight: 1.5,
              }}>
                <div>{msg.text}</div>
                <div style={{ color: isMe ? "rgba(255,255,255,.5)" : C.muted, fontSize: 11, marginTop: 3, textAlign: "right" }}>
                  {timeAgo(msg.ts)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "10px 14px 14px", borderTop: `1px solid ${C.border}33`,
        display: "flex", gap: 10, alignItems: "flex-end",
      }}>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Escribe un mensaje..."
          rows={1}
          style={{
            flex: 1, background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 20, color: C.text, fontSize: 15, padding: "10px 16px",
            outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.5,
          }}
        />
        <button onClick={send} style={{
          width: 42, height: 42, borderRadius: "50%",
          background: text.trim() ? `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` : C.subtle,
          border: "none", cursor: text.trim() ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {Icon.send()}
        </button>
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ me, viewUsername, onBack, onOpenChat }) {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const isSelf = !viewUsername || viewUsername === me.username;

  const refresh = () => {
    const uname = viewUsername || me.username;
    const users = db.users();
    const u = users[uname];
    setUserData(u);
    setUserPosts(db.posts().filter(p => p.author === uname).reverse());
    const myData = users[me.username];
    setFollowing(myData?.following?.includes(uname) || false);
  };

  useEffect(() => { refresh(); }, [viewUsername]);

  const toggleFollow = () => {
    const all = db.users();
    const myData = all[me.username];
    const target = all[viewUsername];
    if (!myData || !target) return;
    const isF = myData.following.includes(viewUsername);
    myData.following = isF ? myData.following.filter(u => u !== viewUsername) : [...myData.following, viewUsername];
    target.followers = isF ? target.followers.filter(u => u !== me.username) : [...target.followers, me.username];
    all[me.username] = myData;
    all[viewUsername] = target;
    db.saveUsers(all);
    refresh();
  };

  if (!userData) return null;

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {!isSelf && (
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 8,
          color: C.text, fontWeight: 600, fontSize: 15,
        }}>
          {Icon.back()} Volver
        </button>
      )}
      {/* Profile header */}
      <div style={{ padding: "20px 20px 0", background: `linear-gradient(to bottom, ${C.accent}11, transparent)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
          <Avatar username={userData.username} size={80} ring />
          <div style={{ display: "flex", gap: 20 }}>
            {[
              ["Fotos", userPosts.length],
              ["Seguidores", (userData.followers||[]).length],
              ["Siguiendo", (userData.following||[]).length],
            ].map(([label, val]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ color: C.text, fontWeight: 800, fontSize: 20 }}>{val}</div>
                <div style={{ color: C.muted, fontSize: 12 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.text, fontWeight: 700, fontSize: 17 }}>{userData.name}</div>
          <div style={{ color: C.muted, fontSize: 13 }}>@{userData.username}</div>
          {userData.bio && <div style={{ color: C.text, fontSize: 14, marginTop: 6 }}>{userData.bio}</div>}
        </div>
        {!isSelf && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button onClick={toggleFollow} style={{
              flex: 1, padding: "10px 0",
              background: following ? "transparent" : `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              border: following ? `1.5px solid ${C.border}` : "none",
              borderRadius: 12, color: following ? C.muted : "#fff",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              {following ? "Siguiendo" : "Seguir"}
            </button>
            <button onClick={() => onOpenChat(userData.username)} style={{
              flex: 1, padding: "10px 0",
              background: "transparent", border: `1.5px solid ${C.border}`,
              borderRadius: 12, color: C.text, fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              Mensaje
            </button>
          </div>
        )}
      </div>
      {/* Posts grid */}
      {userPosts.length === 0 ? (
        <div style={{ textAlign: "center", color: C.muted, padding: "40px 0", fontSize: 14 }}>
          Sin publicaciones aún
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, padding: "0 2px" }}>
          {userPosts.map(p => (
            <div key={p.id} style={{ aspectRatio: "1", background: C.card, overflow: "hidden" }}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%", background: C.subtle,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 8, boxSizing: "border-box",
                }}>
                  <span style={{ color: C.muted, fontSize: 11, textAlign: "center", lineHeight: 1.4 }}>
                    {p.caption.slice(0, 40)}{p.caption.length > 40 ? "..." : ""}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function PicShare() {
  const [user, setUser] = useState(() => db.get("session"));
  const [tab, setTab] = useState("feed");
  const [chatUser, setChatUser] = useState(null);
  const [viewProfile, setViewProfile] = useState(null);

  const login = (u) => { db.set("session", u); setUser(u); };
  const logout = () => { db.set("session", null); setUser(null); setTab("feed"); };

  const openChat = (username) => { setChatUser(username); setTab("messages"); };
  const openProfile = (username) => { setViewProfile(username); setTab("profile"); };

  if (!user) return <AuthScreen onLogin={login} />;

  const navItems = [
    { id: "feed", icon: Icon.home },
    { id: "search", icon: Icon.search },
    { id: "upload", icon: Icon.plus },
    { id: "messages", icon: Icon.chat },
    { id: "profile", icon: Icon.user },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#000",
      display: "flex", justifyContent: "center", alignItems: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "20px 0",
    }}>
      {/* Phone shell */}
      <div style={{
        width: "min(390px, 100vw)",
        height: "min(844px, 100vh)",
        background: C.bg,
        borderRadius: "clamp(0px, 4vw, 44px)",
        border: `1.5px solid ${C.border}`,
        boxShadow: `0 0 80px ${C.accent}1A, 0 40px 100px #000`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 24px 0", color: C.text, fontSize: 12, fontWeight: 700 }}>
          <span>9:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ fontSize: 10 }}>●●●●</span>
            <span>WiFi</span>
            <span>⚡</span>
          </div>
        </div>

        {/* App bar */}
        {!(tab === "messages" && chatUser) && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 18px 10px",
            borderBottom: `1px solid ${C.border}33`,
          }}>
            {tab === "profile" && viewProfile && viewProfile !== user.username ? (
              <button onClick={() => { setViewProfile(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {Icon.back()}
              </button>
            ) : (
              <span style={{
                fontSize: 24, fontWeight: 900, letterSpacing: -1,
                background: `linear-gradient(135deg, #fff 30%, ${C.accent})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>PicShare</span>
            )}
            <button onClick={logout} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              color: C.danger, fontSize: 13, fontWeight: 600, padding: 0,
            }}>
              {Icon.logout()} Salir
            </button>
          </div>
        )}

        {/* Screen content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {tab === "feed" && <FeedScreen me={user} onUserClick={openProfile} />}
          {tab === "search" && <SearchScreen me={user} onUserClick={openProfile} />}
          {tab === "upload" && <UploadScreen me={user} onSuccess={() => setTab("feed")} />}
          {tab === "messages" && !chatUser && <MessagesScreen me={user} onOpenChat={openChat} />}
          {tab === "messages" && chatUser && (
            <ChatScreen me={user} otherUsername={chatUser} onBack={() => setChatUser(null)} />
          )}
          {tab === "profile" && (
            <ProfileScreen
              me={user}
              viewUsername={viewProfile || user.username}
              onBack={() => setViewProfile(null)}
              onOpenChat={openChat}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: "6px 8px 18px",
          background: C.surface,
          borderTop: `1px solid ${C.border}33`,
          gap: 4,
        }}>
          {navItems.map(item => {
            const isActive = tab === item.id;
            const isUpload = item.id === "upload";
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  if (item.id !== "messages") setChatUser(null);
                  if (item.id !== "profile") setViewProfile(null);
                }}
                style={{
                  flex: 1, background: isUpload
                    ? `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`
                    : "none",
                  border: "none", cursor: "pointer",
                  padding: isUpload ? "10px 0" : "10px 0",
                  borderRadius: isUpload ? 14 : 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isUpload ? `0 4px 18px ${C.accent}44` : "none",
                  position: "relative",
                }}
              >
                {item.icon(isActive)}
                {isActive && !isUpload && (
                  <div style={{
                    position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
                    width: 4, height: 4, borderRadius: "50%", background: C.accent,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
