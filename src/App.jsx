
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Menu,
  X,
  Video,
  Users,
  GraduationCap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   CONFIGURATION
========================================================= */

const REGISTRATION_URL =
  import.meta.env.VITE_ZOOM_REGISTRATION_URL?.trim();

const navItems = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Why attend", href: "#why-attend" },
];

const HERO_IMAGE_CANDIDATES = [
  "/images/Hero-Image-1.png",
  "/images/Hero-Image-1.jpg",
  "/images/Hero-Image-1.jpeg",
  "/images/Hero-Image-1.webp",
  "/images/Hero-Image-1.avif",
];

/* =========================================================
   HOOKS
========================================================= */

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;

    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const listener = (event) => {
      setReducedMotion(event.matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, []);

  return reducedMotion;
}

function useHeroImage() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let image = null;

    const findImage = (index) => {
      if (cancelled || index >= HERO_IMAGE_CANDIDATES.length) {
        return;
      }

      const source = HERO_IMAGE_CANDIDATES[index];

      image = new Image();

      image.onload = () => {
        if (!cancelled) {
          setImageUrl(source);
        }
      };

      image.onerror = () => {
        findImage(index + 1);
      };

      image.src = source;
    };

    findImage(0);

    return () => {
      cancelled = true;

      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, []);

  return imageUrl;
}

/* =========================================================
   BRAND
========================================================= */

function Brand() {
  return (
    <a
      href="#home"
      className="brand"
      aria-label="Zoom and NEXT-IT Services, back to top"
    >
      <span className="zoom-wordmark">zoom</span>

      <span className="brand-cross" aria-hidden="true">
        ×
      </span>

      <img
        src="/images/nextit-logo.jpg"
        alt="NEXT-IT Services"
        className="nextit-logo"
      />
    </a>
  );
}

/* =========================================================
   LOADER
========================================================= */

function Loader({ onFinish, reducedMotion }) {
  const trackRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      onFinish();
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: onFinish,
      });

      timeline
        .fromTo(
          trackRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.15,
            ease: "power2.inOut",
          }
        )
        .to(
          overlayRef.current,
          {
            yPercent: -101,
            duration: 0.9,
            ease: "power4.inOut",
          },
          "+=0.15"
        );
    }, overlayRef);

    return () => ctx.revert();
  }, [onFinish, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="loader"
      ref={overlayRef}
      role="status"
      aria-label="Loading webinar experience"
    >
      <div className="loader__inner">
        <div className="loader__title">
          <span>ZOOM</span>
          <em>×</em>
          <span>NEXT-IT</span>
        </div>

        <p>THE LEARNING EXPERIENCE</p>

        <div className="loader__track">
          <div
            ref={trackRef}
            className="loader__progress"
          />
        </div>
      </div>

      <span className="loader__foot">
        NIGERIA / EDUCATION / 2026
      </span>
    </div>
  );
}

/* =========================================================
   REGISTRATION BUTTON
========================================================= */

function RegisterAction({
  className = "",
  children = "Register now",
  onMissing,
}) {
  const content = (
    <>
      <span>{children}</span>

      <ArrowUpRight
        size={20}
        strokeWidth={1.9}
        aria-hidden="true"
      />
    </>
  );

  if (REGISTRATION_URL) {
    return (
      <a
        className={className}
        href={REGISTRATION_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={className}
      type="button"
      onClick={onMissing}
    >
      {content}
    </button>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

function Navbar({ onMissing }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" id="home">
      <div className="site-header__inner layout-width">
        <Brand />

        <nav
          className={open ? "nav nav--open" : "nav"}
          aria-label="Main navigation"
          id="main-navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <RegisterAction
            className="button button--blue nav-mobile-cta"
            onMissing={() => {
              setOpen(false);
              onMissing();
            }}
          />
        </nav>

        <RegisterAction
          className="button button--blue nav-desktop-cta"
          onMissing={onMissing}
        />

        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   HERO SECTION

   Uses:
   public/images/Hero-Image-1.*

   No OrbScene or Three.js required in this section.
========================================================= */

function Hero({ onMissing }) {
  const heroImage = useHeroImage();

  return (
    <section
      className="hero section-light"
      aria-labelledby="hero-heading"
    >
      {/* Background visual */}
      <div
        className={`hero__background ${
          heroImage ? "hero__background--loaded" : ""
        }`}
        style={
          heroImage
            ? { backgroundImage: `url("${heroImage}")` }
            : undefined
        }
        aria-hidden="true"
      />

      {/* Subtle overlay for text readability */}
      <div
        className="hero__background-overlay"
        aria-hidden="true"
      />

      <div className="layout-width hero__grid">
        <div className="hero__copy">
          <div className="eyebrow">
            <span className="eyebrow__dash" />
            EXCLUSIVE EDUCATION WEBINAR
          </div>

          <h1
            id="hero-heading"
            className="hero__title reveal"
          >
            THE FUTURE
            <br />
            OF LEARNING
            <br />
            <span>IS LIVE.</span>
          </h1>

          <p className="hero__description">
            Discover how Zoom and NEXT-IT can help educational
            institutions across Nigeria create more connected,
            engaging learning experiences.
          </p>

          <div className="hero__actions">
            <RegisterAction
              className="button button--blue button--large"
              onMissing={onMissing}
            >
              Join the webinar
            </RegisterAction>

            <a className="text-link" href="#education">
              Explore the experience
              <ArrowDown size={18} />
            </a>
          </div>

          <div
            className="hero__language"
            aria-label="Learning in three Nigerian languages"
          >
            <span>
              Ẹ̀kọ́
              <small>Yorùbá</small>
            </span>

            <span>
              Mmụta
              <small>Igbo</small>
            </span>

            <span>
              Ilimi
              <small>Hausa</small>
            </span>
          </div>
        </div>

        {/* Intentionally empty.
            Background image provides the laptop visual. */}
        <div className="hero__art" aria-hidden="true" />
      </div>

      <div className="hero__scroll">
        SCROLL TO EXPLORE
        <ArrowDown size={16} />
      </div>
    </section>
  );
}

/* =========================================================
   DECORATIVE 3D-STYLE ARROW
========================================================= */

function ArrowSwoosh({
  direction = "right",
  className = "",
}) {
  return (
    <svg
      className={`swoosh ${className} ${
        direction === "left" ? "swoosh--left" : ""
      }`}
      viewBox="0 0 260 180"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 155C72 154 35 38 126 39C169 39 173 91 229 51"
        stroke="currentColor"
        strokeWidth="19"
        strokeLinecap="round"
      />

      <path
        d="M187 47L238 42L219 91"
        stroke="currentColor"
        strokeWidth="19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 155C72 154 35 38 126 39C169 39 173 91 229 51"
        stroke="#9cc8ff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  );
}

/* =========================================================
   PAGE 2 — ZOOM EDUCATION
========================================================= */

function Education({ onMissing }) {
  return (
    <section
      id="education"
      className="education section-grid"
      aria-labelledby="education-heading"
    >
      <div className="layout-width education__inner">
        <div
          id="about"
          className="section-marker"
        >
          <span>02 / THE IDEA</span>
          <span>ZOOM FOR EDUCATION</span>
        </div>

        <div className="education__stage">
          <h2
            id="education-heading"
            className="education__headline reveal"
          >
            SMARTER
            <br />
            CLASSROOMS.
            <br />
            <span>STRONGER</span>
            <br />
            <span>CAMPUSES.</span>
          </h2>

          <div className="education__photo education__photo--left">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=650&q=85"
              alt="Students collaborating around a table"
              loading="lazy"
            />
          </div>

          <div className="education__photo education__photo--right">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=620&q=85"
              alt="Graduates celebrating together"
              loading="lazy"
            />
          </div>

          <ArrowSwoosh
            className="education__arrow education__arrow--top"
          />

          <ArrowSwoosh
            direction="left"
            className="education__arrow education__arrow--bottom"
          />

          <div className="education__sticker">
            <Video size={23} />

            <span>
              LEARNING
              <br />
              WITHOUT
              <br />
              LIMITS
            </span>
          </div>

          <span
            className="education__asterisk"
            aria-hidden="true"
          >
            ✳
          </span>
        </div>

        <div className="education__footer">
          <p>
            Zoom's communication platform brings teaching,
            collaboration and institutional operations closer
            together — with NEXT-IT helping Nigerian schools
            explore what's possible.
          </p>

          <RegisterAction
            className="button button--dark"
            onMissing={onMissing}
          >
            Save your seat
          </RegisterAction>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PAGE 3 — IMMERSIVE EXPERIENCE
========================================================= */

const benefits = [
  {
    n: "01",
    title: "ENGAGING\nCLASSROOMS",
    copy: "Make digital learning more interactive, inclusive and accessible.",
    Icon: GraduationCap,
  },
  {
    n: "02",
    title: "CONNECTED\nINSTITUTIONS",
    copy: "Bring educators, teams and departments into the same conversation.",
    Icon: Users,
  },
  {
    n: "03",
    title: "SMARTER\nWORKFLOWS",
    copy: "Explore scalable, secure and AI-assisted ways to collaborate.",
    Icon: Video,
  },
];

function Experience({ onMissing }) {
  return (
    <section
      id="experience"
      className="experience"
      aria-labelledby="experience-heading"
    >
      <div className="layout-width experience__layout">
        <div className="section-marker section-marker--light">
          <span>03 / THE EXPERIENCE</span>
          <span>EXPLORE WHAT'S POSSIBLE</span>
        </div>

        <div className="experience__intro">
          <div>
            <div className="eyebrow eyebrow--light">
              <span className="eyebrow__dash" />
              BEYOND THE CLASSROOM
            </div>

            <h2
              id="experience-heading"
              className="experience__headline reveal"
            >
              LEARN.
              <br />
              CONNECT.
              <br />
              <span>GO FURTHER.</span>
            </h2>
          </div>

          <p>
            From virtual classrooms to faculty collaboration,
            discover how connected technology can strengthen
            education across Nigeria.
          </p>
        </div>

        <div
          className="experience__scene"
          aria-label="A layered spatial showcase of connected learning"
        >
          <div className="experience__plane experience__plane--back">
            <span>CONNECTED LEARNING / 2026</span>
          </div>

          <div className="experience__plane experience__plane--image">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1450&q=85"
              alt="People collaborating in a modern classroom"
              loading="lazy"
            />
          </div>

          <div className="experience__plane experience__plane--front">
            <span className="mini-label">
              A NEW WAY TO LEARN
            </span>

            <strong>
              YOUR
              <br />
              CLASSROOM.
              <br />
              <i>REIMAGINED.</i>
            </strong>

            <ArrowUpRight size={32} />
          </div>

          <div
            className="experience__scene-orbit"
            aria-hidden="true"
          />

          <span className="experience__scene-index">
            NIGERIA / ANYWHERE
          </span>
        </div>

        <div id="why-attend" className="benefits">
          {benefits.map(({ n, title, copy, Icon }) => (
            <article key={n} className="benefit">
              <div className="benefit__top">
                <span>{n} / 03</span>

                <Icon
                  size={28}
                  strokeWidth={1.5}
                />
              </div>

              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>

        <div className="experience__closing">
          <span>
            READY TO EXPLORE WHAT'S NEXT?
          </span>

          <RegisterAction
            className="button button--white"
            onMissing={onMissing}
          >
            Register for the webinar
          </RegisterAction>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REGISTRATION NOTICE
========================================================= */

function RegistrationNotice({ onClose }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close registration notice"
        >
          <X />
        </button>

        <span className="eyebrow">
          ZOOM × NEXT-IT WEBINAR
        </span>

        <h2 id="modal-title">
          REGISTRATION
          <br />
          <span>COMING SOON.</span>
        </h2>

        <p>
          The registration link has not been configured yet.
          Add your official Zoom webinar registration URL to{" "}
          <code>VITE_ZOOM_REGISTRATION_URL</code> in your{" "}
          <code>.env</code> file to activate every registration
          button.
        </p>

        <button
          className="button button--blue"
          type="button"
          onClick={onClose}
        >
          Got it
          <Check size={18} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const reducedMotion = useReducedMotion();

  const appRef = useRef(null);

  const handleLoaderFinish = useCallback(() => {
    setLoaderDone(true);
  }, []);

  const openNotice = useCallback(() => {
    setNoticeOpen(true);
  }, []);

  const closeNotice = useCallback(() => {
    setNoticeOpen(false);
  }, []);

  /* -------------------------------------------------------
     GSAP ANIMATIONS
  --------------------------------------------------------- */

  useEffect(() => {
    if (!loaderDone || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        ".hero__copy > *",
        {
          opacity: 0,
          y: 36,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      // Hero background reveal
      gsap.fromTo(
        ".hero__background",
        {
          opacity: 0,
          scale: 1.055,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        }
      );

      // Section headlines
      gsap.utils
        .toArray(
          ".education__headline, .experience__headline"
        )
        .forEach((element) => {
          gsap.fromTo(
            element,
            {
              y: 65,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              ease: "power3.out",
              duration: 1.1,
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

      // Education photography
      gsap.fromTo(
        ".education__photo",
        {
          y: 65,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".education__stage",
            start: "top 65%",
            once: true,
          },
        }
      );

      // Benefits entrance
      gsap.fromTo(
        ".benefit",
        {
          y: 45,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.14,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".benefits",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Immersive scene parallax
      gsap.to(".experience__plane--image", {
        y: -45,
        ease: "none",
        scrollTrigger: {
          trigger: ".experience__scene",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, appRef);

    return () => ctx.revert();
  }, [loaderDone, reducedMotion]);

  return (
    <div ref={appRef} className="app">
      {!loaderDone && (
        <Loader
          onFinish={handleLoaderFinish}
          reducedMotion={reducedMotion}
        />
      )}

      <Navbar onMissing={openNotice} />

      <main>
        <Hero onMissing={openNotice} />

        <Education onMissing={openNotice} />

        <Experience onMissing={openNotice} />
      </main>

      <footer className="site-footer">
        <div className="layout-width">
          <Brand />

          <p>
            Future-ready education, powered by connection.
          </p>

          <a href="#home">
            BACK TO TOP ↑
          </a>
        </div>
      </footer>

      {noticeOpen && (
        <RegistrationNotice onClose={closeNotice} />
      )}
    </div>
  );
}
