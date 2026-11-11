
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
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  GraduationCap,
  Menu,
  Pause,
  Play,
  Users,
  Video,
  X,
} from "lucide-react";

import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================
   CONFIGURATION
========================================================== */

const REGISTRATION_URL =
  import.meta.env.VITE_ZOOM_REGISTRATION_URL?.trim();

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Speakers", href: "#speakers" },
  { label: "Agenda", href: "#agenda" },
];

const HERO_IMAGES = [
  "/images/Hero-Image-1.png",
  "/images/Hero-Image-1.jpg",
  "/images/Hero-Image-1.jpeg",
  "/images/Hero-Image-1.webp",
  "/images/Hero-Image-1.avif",
];

/* ==========================================================
   SPEAKER DATA

   Replace with the official speaker details.
   Images go in public/images/speakers/
========================================================== */

const SPEAKERS = [
  {
    id: "01",
    name: "SPEAKER ONE",
    role: "ZOOM EDUCATION EXPERT",
    organization: "Zoom",
    bio: "Discover the opportunities for transforming teaching and learning through connected technology.",
    image: "",
  },
  {
    id: "02",
    name: "SPEAKER TWO",
    role: "EDUCATION TECHNOLOGY SPECIALIST",
    organization: "To be announced",
    bio: "Explore practical approaches to creating more engaging virtual and blended classrooms.",
    image: "",
  },
  {
    id: "03",
    name: "SPEAKER THREE",
    role: "INSTITUTIONAL COLLABORATION EXPERT",
    organization: "To be announced",
    bio: "Learn how educational institutions can improve communication across teams, departments and campuses.",
    image: "",
  },
  {
    id: "04",
    name: "SPEAKER FOUR",
    role: "DIGITAL LEARNING STRATEGIST",
    organization: "To be announced",
    bio: "Explore new possibilities for modern, connected and inclusive learning environments.",
    image: "",
  },
  {
    id: "05",
    name: "SPEAKER FIVE",
    role: "NEXT-IT SERVICES REPRESENTATIVE",
    organization: "NEXT-IT Services",
    bio: "Discover how NEXT-IT can help Nigerian institutions explore modern communication and collaboration solutions.",
    image: "",
  },
];

/* ==========================================================
   AGENDA DATA
========================================================== */

const AGENDA = [
  {
    number: "01",
    category: "WELCOME",
    title: "THE FUTURE OF LEARNING",
    detail:
      "Opening remarks and an introduction to the Zoom × NEXT-IT education webinar.",
  },
  {
    number: "02",
    category: "DISCOVER",
    title: "CLASSROOMS, REIMAGINED",
    detail:
      "Explore approaches to engaging virtual and blended learning environments.",
  },
  {
    number: "03",
    category: "CONNECT",
    title: "ONE CONNECTED CAMPUS",
    detail:
      "Ideas for improving communication between educators, administrators and students.",
  },
  {
    number: "04",
    category: "EXPLORE",
    title: "SMARTER DIGITAL WORKFLOWS",
    detail:
      "An introduction to secure, scalable and AI-assisted collaboration possibilities.",
  },
  {
    number: "05",
    category: "ASK",
    title: "LIVE QUESTIONS & NEXT STEPS",
    detail:
      "Bring your questions for the presenters and discover how to continue the conversation.",
  },
];

const BENEFITS = [
  {
    n: "01",
    title: "ENGAGING\nCLASSROOMS",
    copy:
      "Make digital learning more interactive, inclusive and accessible.",
    Icon: GraduationCap,
  },
  {
    n: "02",
    title: "CONNECTED\nINSTITUTIONS",
    copy:
      "Bring educators, teams and departments into the same conversation.",
    Icon: Users,
  },
  {
    n: "03",
    title: "SMARTER\nWORKFLOWS",
    copy:
      "Explore scalable, secure and AI-assisted ways to collaborate.",
    Icon: Video,
  },
];

/* ==========================================================
   CUSTOM HOOKS
========================================================== */

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const handleChange = (event) => {
      setReducedMotion(event.matches);
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
}

function useHeroImage() {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let image = null;

    const tryImage = (index) => {
      if (cancelled || index >= HERO_IMAGES.length) {
        return;
      }

      image = new Image();

      image.onload = () => {
        if (!cancelled) {
          setImageUrl(HERO_IMAGES[index]);
        }
      };

      image.onerror = () => {
        tryImage(index + 1);
      };

      image.src = HERO_IMAGES[index];
    };

    tryImage(0);

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

/* ==========================================================
   BRAND
========================================================== */

function Brand() {
  return (
    <a
      href="#home"
      className="brand"
      aria-label="Zoom and NEXT-IT Services"
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

/* ==========================================================
   LOADING SCREEN
========================================================== */

function Loader({ onFinish, reducedMotion }) {
  const overlayRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) {
      onFinish();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onFinish,
      });

      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.15,
          ease: "power2.inOut",
        }
      ).to(
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
      ref={overlayRef}
      className="loader"
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
            ref={progressRef}
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

/* ==========================================================
   REGISTRATION BUTTON
========================================================== */

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

  return REGISTRATION_URL ? (
    <a
      className={className}
      href={REGISTRATION_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  ) : (
    <button
      className={className}
      type="button"
      onClick={onMissing}
    >
      {content}
    </button>
  );
}

/* ==========================================================
   NAVIGATION
========================================================== */

function Navbar({ onMissing }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" id="home">
      <div className="site-header__inner layout-width">
        <Brand />

        <nav
          id="main-navigation"
          className={open ? "nav nav--open" : "nav"}
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
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

/* ==========================================================
   01 — HERO
========================================================== */

function Hero({ onMissing }) {
  const heroImage = useHeroImage();

  return (
    <section
      className="hero section-light"
      aria-labelledby="hero-heading"
    >
      <div
        className={`hero__background ${
          heroImage ? "hero__background--loaded" : ""
        }`}
        style={
          heroImage
            ? {
                backgroundImage: `url("${heroImage}")`,
              }
            : undefined
        }
        aria-hidden="true"
      />

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
            Discover how Zoom and NEXT-IT can help
            educational institutions across Nigeria
            create more connected, engaging learning
            experiences.
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

        <div className="hero__art" aria-hidden="true" />
      </div>

      <div className="hero__scroll">
        SCROLL TO EXPLORE
        <ArrowDown size={16} />
      </div>
    </section>
  );
}

/* ==========================================================
   DECORATIVE ARROWS
========================================================== */

function ArrowSwoosh({
  direction = "right",
  className = "",
}) {
  return (
    <svg
      className={`swoosh ${className}`}
      viewBox="0 0 260 180"
      fill="none"
      aria-hidden="true"
      style={
        direction === "left"
          ? { transform: "scaleX(-1) rotate(26deg)" }
          : undefined
      }
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

/* ==========================================================
   02 — EDUCATION
========================================================== */

function Education({ onMissing }) {
  return (
    <section
      id="education"
      className="education section-grid"
      aria-labelledby="education-heading"
    >
      <div className="layout-width education__inner">
        <div id="about" className="section-marker">
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
              alt="Graduates celebrating"
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
            Zoom's communication platform brings
            teaching, collaboration and institutional
            operations closer together — with NEXT-IT
            helping Nigerian schools explore what's
            possible.
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

/* ==========================================================
   03 — IMMERSIVE EXPERIENCE
========================================================== */

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
            From virtual classrooms to faculty
            collaboration, discover how connected
            technology can strengthen education
            across Nigeria.
          </p>
        </div>

        <div
          className="experience__scene"
          aria-label="A layered showcase of connected learning"
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
          {BENEFITS.map(({ n, title, copy, Icon }) => (
            <article key={n} className="benefit">
              <div className="benefit__top">
                <span>{n} / 03</span>
                <Icon size={28} strokeWidth={1.5} />
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

/* ==========================================================
   04 — SPEAKER PORTRAIT
========================================================== */

function SpeakerPortrait({ speaker }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [speaker.image]);

  return (
    <div className="speaker__portrait">
      {speaker.image && !imageFailed ? (
        <img
          src={speaker.image}
          alt={`Portrait of ${speaker.name}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="speaker__portrait-placeholder"
          aria-label="Portrait to be announced"
        >
          <span className="speaker__portrait-number">
            {speaker.id}
          </span>

          <div
            className="speaker__silhouette"
            aria-hidden="true"
          />

          <span className="speaker__portrait-note">
            PORTRAIT COMING SOON
          </span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   04 — SPEAKERS CAROUSEL
========================================================== */

function Speakers({ reducedMotion }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const rootRef = useRef(null);
  const apertureRef = useRef(null);
  const progressRef = useRef(null);

  const speaker = SPEAKERS[activeIndex];

  const goTo = useCallback((index) => {
    setActiveIndex(
      (index + SPEAKERS.length) % SPEAKERS.length
    );
  }, []);

  useEffect(() => {
    const aperture = apertureRef.current;
    const progress = progressRef.current;

    if (!aperture || !progress) return;

    if (reducedMotion || paused) {
      gsap.set(aperture, {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
      });

      gsap.set(progress, {
        scaleX: 1,
      });

      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          setActiveIndex(
            (index) =>
              (index + 1) % SPEAKERS.length
          );
        },
      });

      timeline
        .set(aperture, {
          clipPath: "inset(0% 100% 0% 0%)",
          opacity: 1,
        })

        .set(progress, {
          scaleX: 0,
          transformOrigin: "left center",
        })

        .to(aperture, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          ease: "power3.inOut",
        })

        .to(
          progress,
          {
            scaleX: 1,
            duration: 4.2,
            ease: "none",
          },
          "<"
        )

        .to({}, { duration: 2.2 })

        .to(aperture, {
          clipPath: "inset(0% 0% 0% 100%)",
          duration: 0.85,
          ease: "power3.inOut",
        });
    }, rootRef);

    return () => ctx.revert();
  }, [activeIndex, paused, reducedMotion]);

  return (
    <section
      id="speakers"
      className="speakers"
      ref={rootRef}
      aria-labelledby="speakers-heading"
    >
      <div className="layout-width speakers__top">
        <div className="section-marker section-marker--on-blue">
          <span>04 / THE PEOPLE</span>
          <span>VOICES SHAPING WHAT'S NEXT</span>
        </div>

        <div className="speakers__heading-row">
          <h2
            id="speakers-heading"
            className="speakers__headline"
          >
            MEET THE
            <br />
            <em>SPEAKERS.</em>
          </h2>

          <p>
            Ideas from the people helping institutions
            think differently about connected education.
          </p>
        </div>
      </div>

      <div
        className="speakers__window-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(
              event.relatedTarget
            )
          ) {
            setPaused(false);
          }
        }}
      >
        <div
          ref={apertureRef}
          className="speakers__window"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="speakers__window-inner layout-width"
            key={speaker.id}
          >
            <SpeakerPortrait speaker={speaker} />

            <div className="speaker__details">
              <span className="speaker__eyebrow">
                FEATURED VOICE / {speaker.id} — 05
              </span>

              <h3>{speaker.name}</h3>

              <p className="speaker__role">
                {speaker.role}
              </p>

              <p className="speaker__organization">
                {speaker.organization}
              </p>

              <p className="speaker__bio">
                {speaker.bio}
              </p>

              <span className="speaker__annotation">
                ZOOM × NEXT-IT / EDUCATION WEBINAR
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="layout-width speakers__bottom">
        <div className="speakers__counter">
          <strong>{speaker.id}</strong>
          <span>/ 05</span>
        </div>

        <div
          className="speakers__timeline"
          aria-hidden="true"
        >
          <span ref={progressRef} />
        </div>

        <div
          className="speakers__controls"
          aria-label="Speaker carousel controls"
        >
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous speaker"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() =>
              setPaused((value) => !value)
            }
            aria-label={
              paused
                ? "Resume speaker carousel"
                : "Pause speaker carousel"
            }
            aria-pressed={paused}
          >
            {paused ? (
              <Play size={18} />
            ) : (
              <Pause size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next speaker"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>

      <div className="layout-width speakers__footnote">
        SPEAKER LINEUP TO BE CONFIRMED
      </div>
    </section>
  );
}

/* ==========================================================
   05 — WEBINAR AGENDA
========================================================== */

function Agenda({ onMissing }) {
  const [expanded, setExpanded] = useState(0);

  return (
    <section
      id="agenda"
      className="agenda section-grid"
      aria-labelledby="agenda-heading"
    >
      <div className="layout-width">
        <div className="section-marker">
          <span>05 / THE PROGRAMME</span>
          <span>WEBINAR AGENDA</span>
        </div>

        <div className="agenda__grid">
          <div className="agenda__intro">
            <div className="eyebrow">
              <span className="eyebrow__dash" />
              WHAT TO EXPECT
            </div>

            <h2
              id="agenda-heading"
              className="agenda__headline reveal"
            >
              LET'S
              <br />
              TALK
              <br />
              <span>EDUCATION.</span>
            </h2>

            <p>
              Practical conversations, forward-thinking
              ideas and a chance to hear from the people
              behind the technology.
            </p>

            <RegisterAction
              className="button button--blue"
              onMissing={onMissing}
            >
              Reserve your spot
            </RegisterAction>

            <span className="agenda__note">
              AGENDA PREVIEW — FINAL SESSION ORDER
              AND TIMES TO BE CONFIRMED.
            </span>
          </div>

          <div className="agenda__items">
            {AGENDA.map((item, index) => {
              const isOpen = expanded === index;

              return (
                <article
                  key={item.number}
                  className={`agenda__item ${
                    isOpen ? "agenda__item--open" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="agenda__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`agenda-details-${index}`}
                    onClick={() =>
                      setExpanded((current) =>
                        current === index ? -1 : index
                      )
                    }
                  >
                    <span className="agenda__number">
                      {item.number}
                    </span>

                    <span className="agenda__item-titles">
                      <small>{item.category}</small>
                      <strong>{item.title}</strong>
                    </span>

                    <span
                      className="agenda__plus"
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    id={`agenda-details-${index}`}
                    className="agenda__details"
                    hidden={!isOpen}
                  >
                    <p>{item.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="agenda__end">
          <span>
            CONNECT. TEACH. COLLABORATE. ANYWHERE.
          </span>

          <ArrowUpRight size={26} />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   REGISTRATION MODAL
========================================================== */

function RegistrationNotice({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
          Add the official Zoom webinar registration URL
          as <code>VITE_ZOOM_REGISTRATION_URL</code> in
          your <code>.env</code> file to activate the
          registration buttons.
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

/* ==========================================================
   MAIN APPLICATION
========================================================== */

export default function App() {
  const [loaderDone, setLoaderDone] =
    useState(false);

  const [noticeOpen, setNoticeOpen] =
    useState(false);

  const reducedMotion = useReducedMotion();
  const appRef = useRef(null);

  const finishLoader = useCallback(() => {
    setLoaderDone(true);
  }, []);

  const openNotice = useCallback(() => {
    setNoticeOpen(true);
  }, []);

  const closeNotice = useCallback(() => {
    setNoticeOpen(false);
  }, []);

  /* ========================================================
     GSAP ANIMATIONS
  ======================================================== */

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

      // Headline reveals
      gsap.utils
        .toArray(
          ".education__headline, .experience__headline, .agenda__headline"
        )
        .forEach((element) => {
          gsap.fromTo(
            element,
            {
              y: 60,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              ease: "power3.out",
              duration: 1.05,
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

      // Education photos
      gsap.fromTo(
        ".education__photo",
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".education__stage",
            start: "top 72%",
            once: true,
          },
        }
      );

      // Benefit reveals
      gsap.fromTo(
        ".benefit",
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".benefits",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Experience parallax
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

      // Agenda item reveals
      gsap.fromTo(
        ".agenda__item",
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".agenda__items",
            start: "top 82%",
            once: true,
          },
        }
      );
    }, appRef);

    return () => ctx.revert();
  }, [loaderDone, reducedMotion]);

  return (
    <div className="app" ref={appRef}>
      {!loaderDone && (
        <Loader
          onFinish={finishLoader}
          reducedMotion={reducedMotion}
        />
      )}

      <Navbar onMissing={openNotice} />

      <main>
        <Hero onMissing={openNotice} />

        <Education onMissing={openNotice} />

        <Experience onMissing={openNotice} />

        <Speakers reducedMotion={reducedMotion} />

        <Agenda onMissing={openNotice} />
      </main>

      <footer className="site-footer">
        <div className="layout-width">
          <Brand />

          <p>
            Future-ready education, powered by connection.
          </p>

          <a href="#home">BACK TO TOP ↑</a>
        </div>
      </footer>

      {noticeOpen && (
        <RegistrationNotice onClose={closeNotice} />
      )}
    </div>
  );
}
