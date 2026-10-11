
"use client";

import { useState } from "react";

type Comment = {
  id: number;
  name: string;
  text: string;
};

type Post = {
  id: number;
  name: string;
  handle: string;
  time: string;
  caption: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  art: string;
};

const startingPosts: Post[] = [
  {
    id: 1,
    name: "Shaheen",
    handle: "@shaheen",
    time: "2 hours ago",
    caption: "Welcome to Gallan Wali! Apni gallan, photos aur moments share karo. ❤️",
    likes: 24,
    liked: false,
    comments: [
      { id: 101, name: "Ali", text: "Zabardast! 🔥" },
      { id: 102, name: "Hamza", text: "Welcome everyone!" },
    ],
    art: "lion",
  },
  {
    id: 2,
    name: "Ali Khan",
    handle: "@alikhan",
    time: "4 hours ago",
    caption: "Good vibes only. Dosti aur gallan ka apna hi maza hai! 😎",
    likes: 18,
    liked: false,
    comments: [],
    art: "red",
  },
  {
    id: 3,
    name: "Sara",
    handle: "@sara",
    time: "6 hours ago",
    caption: "Har din kuch naya seekho aur muskurate raho. ✨",
    likes: 31,
    liked: false,
    comments: [],
    art: "dark",
  },
];

const menu = [
  ["⌂", "Home"],
  ["⌕", "Search"],
  ["◈", "Explore"],
  ["▷", "Reels"],
  ["✉", "Messages"],
  ["♡", "Notifications"],
  ["＋", "Create"],
  ["◎", "Profile"],
];

const suggestions = [
  { name: "Ali Khan", handle: "@alikhan" },
  { name: "Hamza Malik", handle: "@hamza" },
  { name: "Sara Noor", handle: "@sara" },
  { name: "Usman Shah", handle: "@usman" },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(startingPosts);
  const [activePage, setActivePage] = useState("Home");
  const [search, setSearch] = useState("");
  const [caption, setCaption] = useState("");
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [openComments, setOpenComments] = useState<number[]>([1]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [profileName, setProfileName] = useState("Shaheen");
  const [bio, setBio] = useState("Welcome to my Gallan Wali profile ❤️");
  const [notice, setNotice] = useState("");

  function navigate(page: string) {
    if (page === "Create") {
      setShowCreate(true);
      return;
    }
    setActivePage(page);
    setNotice("");
  }

  function toggleLike(id: number) {
    setPosts((old) =>
      old.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post
      )
    );
  }

  function toggleComments(id: number) {
    setOpenComments((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
    );
  }

  function addComment(id: number) {
    const text = (newComment[id] || "").trim();
    if (!text) return;

    setPosts((old) =>
      old.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  name: profileName.trim() || "You",
                  text,
                },
              ],
            }
          : post
      )
    );

    setNewComment((old) => ({ ...old, [id]: "" }));
    setOpenComments((old) => (old.includes(id) ? old : [...old, id]));
    setNotice("Comment added successfully!");
  }

  async function sharePost(post: Post) {
    const shareText = `${post.name} on Gallan Wali: ${post.caption}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Gallan Wali",
          text: shareText,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${shareText}\n${window.location.href}`
        );
        setNotice("Post link copied!");
      } else {
        window.prompt("Copy this post:", shareText);
      }
    } catch {
      // User cancelled sharing.
    }
  }

  function toggleFollow(handle: string) {
    setFollowed((old) =>
      old.includes(handle)
        ? old.filter((item) => item !== handle)
        : [...old, handle]
    );
  }

  function createPost() {
    const text = caption.trim();
    if (!text) return;

    const post: Post = {
      id: Date.now(),
      name: profileName.trim() || "Shaheen",
      handle: "@you",
      time: "Just now",
      caption: text,
      likes: 0,
      liked: false,
      comments: [],
      art: "red",
    };

    setPosts((old) => [post, ...old]);
    setCaption("");
    setShowCreate(false);
    setActivePage("Home");
    setNotice("Your post has been published!");
  }

  const visiblePosts = posts.filter((post) => {
    const matchesSearch =
      `${post.name} ${post.handle} ${post.caption}`
        .toLowerCase()
        .includes(search.toLowerCase());

    if (activePage === "Profile") {
      return post.name === profileName || post.handle === "@you";
    }

    if (activePage === "Reels") return false;
    return matchesSearch;
  });

  return (
    <main className="gw-app">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #080809;
          color: #f8f8f8;
          font-family: Arial, Helvetica, sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .gw-app {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 88% 20%, rgba(145, 0, 15, 0.34), transparent 38%),
            radial-gradient(ellipse at 12% 90%, rgba(95, 0, 12, 0.28), transparent 40%),
            linear-gradient(135deg, #080808 0%, #160609 48%, #080808 100%);
        }

        .gw-app::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.3;
          background:
            repeating-linear-gradient(125deg, transparent 0 100px, rgba(255, 25, 45, 0.08) 101px 103px, transparent 104px 190px),
            radial-gradient(ellipse at 90% 35%, rgba(255, 0, 25, 0.12), transparent 48%);
        }

        .gw-layout {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 230px minmax(320px, 650px) 270px;
          gap: 28px;
          max-width: 1440px;
          margin: auto;
          padding: 22px 24px;
        }

        .gw-sidebar {
          position: sticky;
          top: 20px;
          height: calc(100vh - 40px);
          min-height: 560px;
          padding: 22px 14px;
          border: 1px solid #3b171c;
          border-radius: 22px;
          background: rgba(12, 10, 11, 0.9);
          box-shadow: 0 0 30px rgba(150, 0, 20, 0.12);
          display: flex;
          flex-direction: column;
        }

        .gw-logo {
          font-size: 27px;
          font-weight: 900;
          letter-spacing: -1.2px;
          margin: 0 8px 8px;
          background: linear-gradient(90deg, #fff, #ff5362, #b30018);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .gw-tagline {
          margin: 0 8px 28px;
          color: #9f898c;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .gw-nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .gw-nav button {
          width: 100%;
          padding: 13px 12px;
          border: 1px solid transparent;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 13px;
          color: #d0c6c7;
          background: transparent;
          text-align: left;
          transition: 0.2s;
        }

        .gw-nav button:hover,
        .gw-nav button.selected {
          background: linear-gradient(90deg, rgba(180, 0, 25, 0.28), rgba(70, 0, 12, 0.12));
          border-color: #5a1a24;
          color: white;
        }

        .gw-nav-icon {
          width: 25px;
          text-align: center;
          font-size: 22px;
        }

        .gw-sidebar-bottom {
          margin-top: auto;
          border-top: 1px solid #33151a;
          padding: 17px 8px 0;
          color: #a99799;
          font-size: 12px;
        }

        .gw-main {
          min-width: 0;
        }

        .gw-topbar {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
        }

        .gw-search {
          width: 100%;
          padding: 13px 16px;
          border: 1px solid #442027;
          border-radius: 13px;
          outline: none;
          color: white;
          background: rgba(16, 13, 14, 0.92);
        }

        .gw-search:focus,
        .gw-input:focus,
        .gw-textarea:focus {
          border-color: #e1263d;
          box-shadow: 0 0 0 3px rgba(225, 38, 61, 0.12);
        }

        .gw-avatar {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 2px solid #f0394e;
          color: white;
          font-weight: 800;
          background: radial-gradient(circle at 30% 20%, #ff6877, #8b0014 60%, #1b080b);
        }

        .gw-stories {
          display: flex;
          gap: 17px;
          overflow-x: auto;
          padding: 17px 14px;
          margin-bottom: 20px;
          border: 1px solid #3b191f;
          border-radius: 18px;
          background: rgba(13, 10, 11, 0.85);
        }

        .gw-story {
          flex: 0 0 65px;
          text-align: center;
          color: #c9b9bb;
          font-size: 11px;
        }

        .gw-story-ring {
          width: 57px;
          height: 57px;
          margin: 0 auto 7px;
          padding: 3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffb347, #f21d3d, #7800a8);
        }

        .gw-story-ring .gw-avatar {
          width: 51px;
          height: 51px;
          border: 2px solid #0e0b0c;
        }

        .gw-section-title {
          margin: 0 0 16px;
          font-size: 22px;
        }

        .gw-notice {
          padding: 12px 15px;
          margin-bottom: 14px;
          border: 1px solid #6d222d;
          border-radius: 12px;
          color: #ffb8c0;
          background: #210c11;
          font-size: 13px;
        }

        .gw-post {
          overflow: hidden;
          margin-bottom: 23px;
          border: 1px solid #402027;
          border-radius: 19px;
          background: rgba(13, 11, 12, 0.96);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
        }

        .gw-post-head {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 15px;
        }

        .gw-post-user {
          min-width: 0;
          flex: 1;
        }

        .gw-post-user strong {
          display: block;
          font-size: 13px;
        }

        .gw-muted {
          display: block;
          margin-top: 4px;
          color: #9b898c;
          font-size: 11px;
        }

        .gw-dots {
          color: #e7d7d9;
          background: transparent;
          border: 0;
          font-size: 22px;
        }

        .gw-art {
          position: relative;
          display: grid;
          place-items: center;
          min-height: 280px;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 75% 50%, rgba(255, 0, 30, 0.32), transparent 38%),
            linear-gradient(135deg, #080808, #26050a 52%, #080808);
        }

        .gw-art::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: -30%;
          background: repeating-conic-gradient(from 0deg at 65% 50%, rgba(255, 20, 40, 0.13) 0deg 2deg, transparent 2deg 12deg);
          mask-image: radial-gradient(ellipse, black, transparent 67%);
        }

        .gw-art.lion::after {
          content: "♌";
          position: absolute;
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 36, 54, 0.09);
          font-size: clamp(160px, 25vw, 280px);
          line-height: 1;
          text-shadow: 0 0 45px rgba(255, 0, 30, 0.12);
        }

        .gw-lion-text {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 30px 16px;
          text-shadow: 0 0 25px rgba(255, 0, 25, 0.45);
        }

        .gw-lion-symbol {
          display: block;
          font-size: clamp(65px, 10vw, 105px);
          line-height: 1.2;
          filter: drop-shadow(0 0 22px rgba(255, 0, 20, 0.55));
        }

        .gw-lion-text strong {
          display: block;
          font-size: clamp(22px, 4vw, 35px);
          letter-spacing: 5px;
          color: #fff0f1;
        }

        .gw-lion-text span:last-child {
          display: block;
          margin-top: 8px;
          font-size: 10px;
          letter-spacing: 5px;
          color: #ff6676;
        }

        .gw-art.red {
          background:
            radial-gradient(circle at 50% 40%, rgba(255, 0, 30, 0.35), transparent 32%),
            linear-gradient(135deg, #14080a, #59000d, #100708);
        }

        .gw-art.dark {
          background:
            radial-gradient(ellipse at 35% 45%, rgba(175, 20, 40, 0.25), transparent 45%),
            linear-gradient(145deg, #050505, #201014, #080808);
        }

        .gw-art-label {
          font-size: clamp(36px, 7vw, 68px);
          font-weight: 900;
          letter-spacing: 4px;
          color: #ffe9ec;
          text-shadow: 0 0 28px rgba(255, 0, 35, 0.7);
        }

        .gw-caption {
          padding: 14px 16px 5px;
          color: #e8dfe0;
          font-size: 13px;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .gw-actions {
          display: flex;
          align-items: center;
          gap: 19px;
          padding: 12px 16px;
          border-bottom: 1px solid #28151a;
        }

        .gw-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0;
          border: 0;
          color: #e9dfe0;
          background: transparent;
          font-size: 13px;
        }

        .gw-action:hover {
          color: #ff5065;
        }

        .gw-action.liked {
          color: #ff4058;
        }

        .gw-comment-toggle {
          margin: 0 16px 12px;
          border: 0;
          color: #bba8ab;
          background: transparent;
          font-size: 12px;
        }

        .gw-comments {
          padding: 4px 16px 15px;
          border-top: 1px solid #28151a;
        }

        .gw-comment {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          font-size: 12px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .gw-comment strong {
          margin-right: 6px;
          color: #fff;
        }

        .gw-comment-form {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .gw-input,
        .gw-textarea {
          min-width: 0;
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #442027;
          border-radius: 10px;
          outline: none;
          color: white;
          background: #100d0e;
          font-size: 13px;
        }

        .gw-send,
        .gw-primary {
          border: 1px solid #f13a50;
          border-radius: 10px;
          padding: 10px 14px;
          color: white;
          background: linear-gradient(135deg, #d10b28, #800013);
          font-weight: 700;
          font-size: 12px;
        }

        .gw-send:hover,
        .gw-primary:hover {
          filter: brightness(1.2);
        }

        .gw-right {
          min-width: 0;
        }

        .gw-profile-card,
        .gw-suggest-card {
          margin-bottom: 18px;
          padding: 17px;
          border: 1px solid #3b191f;
          border-radius: 18px;
          background: rgba(13, 10, 11, 0.9);
        }

        .gw-profile-row,
        .gw-suggest-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 13px 0;
        }

        .gw-profile-row > div:nth-child(2),
        .gw-suggest-row > div:nth-child(2) {
          min-width: 0;
          flex: 1;
        }

        .gw-profile-row strong,
        .gw-suggest-row strong {
          display: block;
          font-size: 12px;
        }

        .gw-profile-row small,
        .gw-suggest-row small {
          display: block;
          margin-top: 4px;
          color: #a99498;
          font-size: 11px;
        }

        .gw-follow {
          border: 0;
          padding: 7px 9px;
          border-radius: 8px;
          color: #ff7180;
          background: #2a0d13;
          font-size: 11px;
          font-weight: 700;
        }

        .gw-follow.following {
          color: #d6c5c8;
          background: #292124;
        }

        .gw-small-heading {
          margin: 0;
          color: #cbbabd;
          font-size: 13px;
        }

        .gw-profile-form {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        .gw-modal-backdrop {
          position: fixed;
          z-index: 10;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(7px);
        }

        .gw-modal {
          width: min(100%, 480px);
          padding: 23px;
          border: 1px solid #70202c;
          border-radius: 20px;
          background: #100b0d;
          box-shadow: 0 0 50px rgba(180, 0, 25, 0.2);
        }

        .gw-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .gw-close {
          border: 0;
          color: #fff;
          background: transparent;
          font-size: 25px;
        }

        .gw-mobile-nav {
          display: none;
        }

        .gw-empty {
          padding: 38px 20px;
          text-align: center;
          color: #bda9ad;
          border: 1px solid #3b191f;
          border-radius: 18px;
          background: rgba(13, 10, 11, 0.88);
        }

        @media (max-width: 1120px) {
          .gw-layout {
            grid-template-columns: 205px minmax(300px, 1fr);
            gap: 20px;
          }

          .gw-right {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .gw-layout {
            display: block;
            padding: 12px 10px 82px;
          }

          .gw-sidebar {
            position: static;
            height: auto;
            min-height: 0;
            padding: 13px 14px;
            margin-bottom: 14px;
          }

          .gw-logo {
            margin-bottom: 3px;
            font-size: 25px;
          }

          .gw-tagline {
            margin-bottom: 12px;
          }

          .gw-nav {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 5px;
          }

          .gw-nav button {
            justify-content: center;
            flex-direction: column;
            gap: 3px;
            padding: 8px 3px;
            font-size: 10px;
          }

          .gw-nav-icon {
            font-size: 19px;
          }

          .gw-sidebar-bottom {
            display: none;
          }

          .gw-topbar {
            margin-bottom: 12px;
          }

          .gw-stories {
            gap: 12px;
            padding: 13px 9px;
          }

          .gw-art {
            min-height: 240px;
          }

          .gw-post {
            border-radius: 15px;
          }

          .gw-mobile-nav {
            position: fixed;
            z-index: 5;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: space-around;
            padding: 12px 5px calc(12px + env(safe-area-inset-bottom));
            border-top: 1px solid #4a1b23;
            background: rgba(10, 8, 9, 0.97);
            backdrop-filter: blur(10px);
          }

          .gw-mobile-nav button {
            border: 0;
            color: #f0dfe2;
            background: transparent;
            font-size: 21px;
          }
        }
      `}</style>

      <div className="gw-layout">
        <aside className="gw-sidebar">
          <div className="gw-logo">Gallan Wali</div>
          <p className="gw-tagline">Apni duniya, apni gallan</p>

          <nav className="gw-nav">
            {menu.map(([symbol, label]) => (
              <button
                key={label}
                type="button"
                className={activePage === label ? "selected" : ""}
                onClick={() => navigate(label)}
              >
                <span className="gw-nav-icon">{symbol}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="gw-sidebar-bottom">
            <strong style={{ color: "#f04a5e" }}>GALLAN WALI</strong>
            <p>Connect. Share. Belong.</p>
            <span>© 2026 Gallan Wali</span>
          </div>
        </aside>

        <section className="gw-main">
          <div className="gw-topbar">
            <input
              className="gw-search"
              aria-label="Search posts"
              placeholder="Search people and posts..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              type="button"
              className="gw-avatar"
              title="Open profile"
              onClick={() => navigate("Profile")}
            >
              {(profileName.trim()[0] || "S").toUpperCase()}
            </button>
          </div>

          {notice && (
            <div className="gw-notice" role="status">
              {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                style={{
                  float: "right",
                  border: 0,
                  color: "inherit",
                  background: "transparent",
                }}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          {activePage === "Home" && (
            <>
              <div className="gw-stories">
                {["Your story", "Ali", "Hamza", "Sara", "Usman", "Ayesha"].map(
                  (name, index) => (
                    <div className="gw-story" key={name}>
                      <div className="gw-story-ring">
                        <div className="gw-avatar">
                          {index === 0 ? "+" : name[0]}
                        </div>
                      </div>
                      <span>{name}</span>
                    </div>
                  )
                )}
              </div>
              <h1 className="gw-section-title">Your Feed</h1>
            </>
          )}

          {activePage === "Search" && (
            <h1 className="gw-section-title">Search Gallan Wali</h1>
          )}

          {activePage === "Explore" && (
            <h1 className="gw-section-title">Explore Posts</h1>
          )}

          {activePage === "Messages" && (
            <div className="gw-empty">
              <div style={{ fontSize: 38 }}>✉</div>
              <h2>Messages</h2>
              <p>Chat system ka agla step real messaging add karna hoga.</p>
            </div>
          )}

          {activePage === "Notifications" && (
            <div className="gw-empty">
              <div style={{ fontSize: 38 }}>♡</div>
              <h2>Notifications</h2>
              <p>Filhaal aapki notifications yahan show hongi jab system add hoga.</p>
            </div>
          )}

          {activePage === "Reels" && (
            <div className="gw-empty">
              <div style={{ fontSize: 38 }}>▷</div>
              <h2>Reels</h2>
              <p>Reels upload aur playback abhi implement nahi hua.</p>
            </div>
          )}

          {activePage === "Profile" && (
            <div className="gw-profile-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div className="gw-avatar" style={{ width: 65, height: 65 }}>
                  {(profileName.trim()[0] || "S").toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{profileName}</h2>
                  <p className="gw-muted">@you · Gallan Wali member</p>
                </div>
              </div>

              <p style={{ color: "#d5c5c8", fontSize: 13 }}>{bio}</p>
              <p className="gw-muted">{posts.filter((p) => p.name === profileName || p.handle === "@you").length} posts</p>

              <div className="gw-profile-form">
                <label>
                  <span className="gw-muted">Display name</span>
                  <input
                    className="gw-input"
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    maxLength={35}
                  />
                </label>
                <label>
                  <span className="gw-muted">Bio</span>
                  <textarea
                    className="gw-textarea"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    maxLength={160}
                    rows={3}
                  />
                </label>
              </div>
            </div>
          )}

          {activePage !== "Messages" &&
            activePage !== "Notifications" &&
            activePage !== "Reels" &&
            activePage !== "Profile" &&
            (visiblePosts.length ? (
              visiblePosts.map((post) => (
                <article className="gw-post" key={post.id}>
                  <div className="gw-post-head">
                    <div className="gw-avatar">
                      {(post.name[0] || "G").toUpperCase()}
                    </div>
                    <div className="gw-post-user">
                      <strong>{post.name}</strong>
                      <span className="gw-muted">
                        {post.handle} · {post.time}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="gw-dots"
                      aria-label="Post options"
                      onClick={() => setNotice("Gallan Wali post")}
                    >
                      •••
                    </button>
                  </div>

                  <div className={`gw-art ${post.art}`}>
                    {post.art === "lion" ? (
                      <div className="gw-lion-text">
                        <span className="gw-lion-symbol">♌</span>
                        <strong>GALLAN WALI</strong>
                        <span>APNI DUNIYA · APNI GALLAN</span>
                      </div>
                    ) : (
                      <div className="gw-art-label">
                        {post.art === "dark" ? "YOUR WORLD" : "GW ✦"}
                      </div>
                    )}
                  </div>

                  <div className="gw-caption">
                    <strong style={{ marginRight: 7 }}>{post.name}</strong>
                    {post.caption}
                  </div>

                  <div className="gw-actions">
                    <button
                      type="button"
                      className={`gw-action ${post.liked ? "liked" : ""}`}
                      onClick={() => toggleLike(post.id)}
                      aria-label={post.liked ? "Unlike post" : "Like post"}
                    >
                      <span style={{ fontSize: 22 }}>
                        {post.liked ? "♥" : "♡"}
                      </span>
                      {post.likes}
                    </button>

                    <button
                      type="button"
                      className="gw-action"
                      onClick={() => toggleComments(post.id)}
                      aria-expanded={openComments.includes(post.id)}
                    >
                      <span style={{ fontSize: 20 }}>▢</span>
                      Comments ({post.comments.length})
                    </button>

                    <button
                      type="button"
                      className="gw-action"
                      onClick={() => sharePost(post)}
                    >
                      <span style={{ fontSize: 19 }}>↗</span>
                      Share
                    </button>
                  </div>

                  <button
                    type="button"
                    className="gw-comment-toggle"
                    onClick={() => toggleComments(post.id)}
                  >
                    {openComments.includes(post.id)
                      ? "Hide comments"
                      : `View all ${post.comments.length} comments`}
                  </button>

                  {openComments.includes(post.id) && (
                    <div className="gw-comments">
                      {post.comments.length === 0 && (
                        <p className="gw-muted">
                          Abhi koi comment nahi. Pehla comment aap karein!
                        </p>
                      )}

                      {post.comments.map((comment) => (
                        <div className="gw-comment" key={comment.id}>
                          <span className="gw-avatar" style={{ width: 27, height: 27, flexBasis: 27, fontSize: 10 }}>
                            {(comment.name[0] || "U").toUpperCase()}
                          </span>
                          <div>
                            <strong>{comment.name}</strong>
                            <span>{comment.text}</span>
                          </div>
                        </div>
                      ))}

                      <form
                        className="gw-comment-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          addComment(post.id);
                        }}
                      >
                        <input
                          className="gw-input"
                          aria-label="Write a comment"
                          placeholder="Write a comment..."
                          value={newComment[post.id] || ""}
                          onChange={(event) =>
                            setNewComment((old) => ({
                              ...old,
                              [post.id]: event.target.value,
                            }))
                          }
                          maxLength={500}
                          required
                        />
                        <button className="gw-send" type="submit">
                          Send
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="gw-empty">
                <h2>No posts found</h2>
                <p>Search badal kar dekhein ya nayi post create karein.</p>
                <button
                  type="button"
                  className="gw-primary"
                  onClick={() => setShowCreate(true)}
                >
                  + Create Post
                </button>
              </div>
            ))}
        </section>

        <aside className="gw-right">
          <div className="gw-profile-card">
            <div className="gw-profile-row">
              <div className="gw-avatar" style={{ width: 52, height: 52 }}>
                {(profileName.trim()[0] || "S").toUpperCase()}
              </div>
              <div>
                <strong>{profileName}</strong>
                <small>@you</small>
              </div>
            </div>
            <p style={{ color: "#bca9ac", fontSize: 12, lineHeight: 1.6 }}>
              {bio}
            </p>
            <button
              type="button"
              className="gw-primary"
              style={{ width: "100%" }}
              onClick={() => navigate("Profile")}
            >
              Edit Profile
            </button>
          </div>

          <div className="gw-suggest-card">
            <h3 className="gw-small-heading">Suggested for you</h3>
            {suggestions.map((person) => (
              <div className="gw-suggest-row" key={person.handle}>
                <div className="gw-avatar">
                  {person.name[0]}
                </div>
                <div>
                  <strong>{person.name}</strong>
                  <small>{person.handle}</small>
                </div>
                <button
                  type="button"
                  className={`gw-follow ${followed.includes(person.handle) ? "following" : ""}`}
                  onClick={() => toggleFollow(person.handle)}
                >
                  {followed.includes(person.handle) ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

          <p className="gw-muted" style={{ lineHeight: 1.8, padding: "0 5px" }}>
            About · Help · Privacy · Terms
            <br />
            © 2026 GALLAN WALI
          </p>
        </aside>
      </div>

      <nav className="gw-mobile-nav">
        {[
          ["⌂", "Home"],
          ["⌕", "Search"],
          ["＋", "Create"],
          ["♡", "Notifications"],
          ["◎", "Profile"],
        ].map(([symbol, label]) => (
          <button
            type="button"
            key={label}
            aria-label={label}
            onClick={() => navigate(label)}
          >
            {symbol}
          </button>
        ))}
      </nav>

      {showCreate && (
        <div
          className="gw-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowCreate(false);
          }}
        >
          <div
            className="gw-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-heading"
          >
            <div className="gw-modal-head">
              <h2 id="create-heading" style={{ margin: 0 }}>
                Create a post
              </h2>
              <button
                type="button"
                className="gw-close"
                aria-label="Close"
                onClick={() => setShowCreate(false)}
              >
                ×
              </button>
            </div>

            <p className="gw-muted">Share your thoughts with Gallan Wali.</p>
            <textarea
              className="gw-textarea"
              rows={5}
              placeholder="Aaj ki gallan likhein..."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={2000}
              autoFocus
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginTop: 14,
              }}
            >
              <span className="gw-muted">{caption.length}/2000</span>
              <button
                type="button"
                className="gw-primary"
                onClick={createPost}
                disabled={!caption.trim()}
                style={{ opacity: caption.trim() ? 1 : 0.5 }}
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
