"use client";

import { useEffect, useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const DEFAULT_RESTAURANT = {
  name: "YOUR RESTAURANT",
  welcome_en: "Welcome to our table",
  welcome_ar: "أهلاً وسهلاً بكم على مائدتنا",
  choose_language_en: "Choose your preferred language",
  choose_language_ar: "اختر اللغة التي تريحك",
  tagline: "A little taste of home, made with love.",
  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },
};

function OliveBranch({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 150 72" aria-hidden="true" fill="none">
      <path d="M12 62C43 48 70 30 135 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 51C21 39 15 28 17 19C28 25 35 36 32 51Z" fill="currentColor" opacity=".72" />
      <path d="M50 42C45 27 48 16 56 9C62 21 61 33 50 42Z" fill="currentColor" opacity=".82" />
      <path d="M69 35C68 23 74 13 85 8C87 20 80 30 69 35Z" fill="currentColor" opacity=".8" />
      <path d="M89 27C91 15 101 8 114 7C110 19 101 26 89 27Z" fill="currentColor" opacity=".7" />
      <path d="M36 50C44 59 55 62 66 58C60 48 48 46 36 50Z" fill="currentColor" opacity=".58" />
      <path d="M61 39C72 47 84 47 94 41C84 33 72 33 61 39Z" fill="currentColor" opacity=".64" />
      <path d="M88 27C101 34 113 30 122 22C110 17 98 19 88 27Z" fill="currentColor" opacity=".68" />
    </svg>
  );
}

function SocialIcon({ type }) {
  if (type === "facebook") {
    return <span className="social-glyph facebook-glyph" aria-hidden="true">f</span>;
  }
  if (type === "instagram") {
    return (
      <span className="social-glyph instagram-glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.7" cy="6.6" r="1.2" fill="currentColor"/></svg>
      </span>
    );
  }
  return (
    <span className="social-glyph tiktok-glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.2 3h-3.1v11.3a2.8 2.8 0 1 1-2.5-2.8v-3.2a6 6 0 1 0 5.6 6V8.5a8 8 0 0 0 4.3 1.3V6.6a4.8 4.8 0 0 1-4.3-3.6Z"/></svg>
    </span>
  );
}

export default function HomePage() {
  const [restaurant, setRestaurant] = useState(DEFAULT_RESTAURANT);
  const [apiOnline, setApiOnline] = useState(false);
  const [menuLanguage, setMenuLanguage] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/restaurant`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Restaurant API is unavailable");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setRestaurant({ ...DEFAULT_RESTAURANT, ...data, socials: { ...DEFAULT_RESTAURANT.socials, ...data.socials } });
          setApiOnline(true);
        }
      })
      .catch(() => {
        if (!cancelled) setApiOnline(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function openMenu(language) {
    setMenuLanguage(language);
    setMenuData(null);
    setLoadingMenu(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/menu/${language}`, { cache: "no-store" });
      if (!response.ok) throw new Error("The menu service returned an error.");
      setMenuData(await response.json());
      setApiOnline(true);
    } catch {
      setError(`Couldn't connect to the menu server. Please start the FastAPI backend at ${API_BASE} and try again.`);
    } finally {
      setLoadingMenu(false);
    }
  }

  function backToWelcome() {
    setMenuLanguage(null);
    setMenuData(null);
    setError("");
  }

  const isArabic = menuLanguage === "ar";

  return (
    <main className="page-wrap">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <section className="restaurant-card" aria-label="Restaurant welcome page">
        <div className="hero-photo">
          <div className="hero-shade" />
          <div className="hero-topline">
            <span className="brand-mark"><OliveBranch /></span>
            <span className="hero-kicker">GOOD FOOD · GOOD COMPANY</span>
          </div>
          <div className="photo-caption">
            <span className="caption-line" />
            <span>Fresh from our kitchen</span>
          </div>
        </div>

        <div className="paper-panel">
          <OliveBranch className="decor-leaf decor-leaf-left" />
          <OliveBranch className="decor-leaf decor-leaf-right" />

          {menuLanguage === null ? (
            <div className="welcome-content">
              <div className="brand-heading">
                <OliveBranch className="heading-branch" />
                <p className="restaurant-name">{restaurant.name}</p>
                <p className="restaurant-subtitle">MEDITERRANEAN · MADE WITH LOVE</p>
              </div>

              <div className="heading-rule"><span /></div>
              <h1>{restaurant.welcome_en}</h1>
              <p className="arabic-prompt" lang="ar" dir="rtl">{restaurant.choose_language_ar}</p>
              <p className="tagline">{restaurant.tagline}</p>

              <div className="language-actions">
                <button className="menu-button menu-button-en" onClick={() => openMenu("en")}>
                  <span className="flag-badge" aria-hidden="true">🇬🇧</span>
                  <span>English Menu</span>
                  <span className="button-arrow" aria-hidden="true">↗</span>
                </button>
                <button className="menu-button menu-button-ar" onClick={() => openMenu("ar")}>
                  <span className="arabic-badge" aria-hidden="true">ع</span>
                  <span lang="ar" dir="rtl">القائمة بالعربي</span>
                  <span className="button-arrow" aria-hidden="true">↗</span>
                </button>
              </div>
              {error && <p className="error-message" role="alert">{error}</p>}
              <div className="social-section">
                <div className="social-heading"><span /> <p>Follow our journey</p> <span /></div>
                <div className="social-links">
                  <a className="social-link" href={restaurant.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                    <SocialIcon type="facebook" /><span>Facebook</span>
                  </a>
                  <a className="social-link" href={restaurant.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <SocialIcon type="instagram" /><span>Instagram</span>
                  </a>
                  <a className="social-link" href={restaurant.socials.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                    <SocialIcon type="tiktok" /><span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className={`menu-content ${isArabic ? "menu-content-ar" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
              <button className="back-button" onClick={backToWelcome}>← <span>{isArabic ? "العودة" : "Back to welcome"}</span></button>
              <div className="menu-brand-mini"><OliveBranch className="heading-branch" /><p className="restaurant-name">{restaurant.name}</p></div>
              <h1>{isArabic ? "قائمتنا" : "Our Menu"}</h1>
              <p className="menu-intro">{isArabic ? "أطباق محضّرة بحب، ومكوّنات طازجة كل يوم." : "Thoughtful plates, fresh ingredients, and a little something for everyone."}</p>
              {loadingMenu ? (
                <div className="loading-state"><span className="spinner" /> {isArabic ? "جارٍ تحميل القائمة..." : "Loading the menu..."}</div>
              ) : menuData ? (
                <div className="menu-categories">
                  {(menuData.categories || []).map((category) => (
                    <section className="menu-category" key={category.id || category.name}>
                      <h2>{category.name}</h2>
                      {category.items.map((item) => (
                        <article className="menu-item" key={item.id || item.name}>
                          <div className="menu-item-text"><h3>{item.name}</h3><p>{item.description}</p></div>
                          <strong className="menu-price">{item.price}</strong>
                        </article>
                      ))}
                    </section>
                  ))}
                  <p className="menu-note">{isArabic ? "الأسعار بالجنيه المصري. يُرجى إبلاغ فريقنا بأي حساسية غذائية." : "Prices are in EGP. Please let our team know about any food allergies."}</p>
                </div>
              ) : error ? (
                <div className="error-panel" role="alert"><p>{error}</p><button className="retry-button" onClick={() => openMenu(menuLanguage)}>{isArabic ? "حاول مرة أخرى" : "Try again"}</button></div>
              ) : null}
              {error && loadingMenu === false && menuData && <p className="error-message" role="alert">{error}</p>}
              <div className="backend-status"><span className={apiOnline ? "status-dot online" : "status-dot"} />{apiOnline ? (isArabic ? "متصل بالخادم" : "Connected to FastAPI") : (isArabic ? "تعذّر الاتصال بالخادم" : "Backend not connected")}</div>
            </div>
          )}
        </div>
        <footer className="card-footer"><span>Gather · Share · Savor</span><span className="footer-dot">✦</span><span>Made with care</span></footer>
      </section>

      <p className="outside-note"><span className={apiOnline ? "status-dot online" : "status-dot"} />{apiOnline ? "Menu powered by FastAPI" : "Welcome · Menu service connects when FastAPI is running"}</p>
    </main>
  );
}
