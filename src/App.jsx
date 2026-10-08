import { useEffect, useRef, useState } from "react";
import "./App.css";

const FRAME_COUNT = 64;

function App() {
  const canvasRef = useRef(null);

  const framesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const frames = [];

    // Load all 64 cropped frames
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const image = new Image();

      image.src = `/croppedframes/frame-${String(i).padStart(3, "0")}.png`;

      image.onload = () => {
        setLoaded((value) => value + 1);
      };

      image.onerror = () => {
        console.error(`Could not load frame ${i}`);
      };

      frames.push(image);
    }

    framesRef.current = frames;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Mouse position
    const mouse = {
      x: window.innerWidth * 0.78,
      y: window.innerHeight * 0.5,
    };

    // Smooth mouse movement
    const smoothMouse = {
      x: mouse.x,
      y: mouse.y,
    };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationId;

    const animate = () => {
      /*
       * Smooth mouse interpolation
       */
      smoothMouse.x +=
        (mouse.x - smoothMouse.x) * 0.08;

      smoothMouse.y +=
        (mouse.y - smoothMouse.y) * 0.08;

      /*
       * Character tracking center
       *
       * We use the character area rather than
       * the entire browser screen.
       */
      const centerX = window.innerWidth * 0.72;
      const centerY = window.innerHeight * 0.5;

      const dx = smoothMouse.x - centerX;
      const dy = smoothMouse.y - centerY;

      /*
       * Dead zone
       *
       * When the mouse is close to the character,
       * don't constantly change frames.
       */
      const distance = Math.sqrt(
        dx * dx + dy * dy
      );

      const deadZone = 70;

      if (distance > deadZone) {
        /*
         * Convert mouse direction to angle.
         */
        const angle = Math.atan2(dy, dx);

        /*
         * Convert angle to 0 → 1.
         */
        let normalized =
          (angle + Math.PI) /
          (Math.PI * 2);

        /*
         * Convert to frame number.
         */
        let target =
          normalized * FRAME_COUNT;

        target =
          Math.floor(target) % FRAME_COUNT;

        targetFrameRef.current = target;
      }

      /*
       * Current frame
       */
      const current =
        currentFrameRef.current;

      const target =
        targetFrameRef.current;

      /*
       * Find shortest route around the
       * circular 64-frame animation.
       */
      let difference = target - current;

      if (difference > FRAME_COUNT / 2) {
        difference -= FRAME_COUNT;
      }

      if (difference < -FRAME_COUNT / 2) {
        difference += FRAME_COUNT;
      }

      /*
       * Smooth frame interpolation.
       *
       * 0.08 = smooth cinematic movement.
       */
      currentFrameRef.current =
        (current +
          difference * 0.08 +
          FRAME_COUNT) %
        FRAME_COUNT;

      const frameIndex =
        Math.round(
          currentFrameRef.current
        ) % FRAME_COUNT;

      const image =
        framesRef.current[frameIndex];

      /*
       * Draw frame
       */
      if (
        image &&
        image.complete &&
        image.naturalWidth > 0
      ) {
        if (
          canvas.width !== image.naturalWidth ||
          canvas.height !== image.naturalHeight
        ) {
          canvas.width =
            image.naturalWidth;

          canvas.height =
            image.naturalHeight;
        }

        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        ctx.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      animationId =
        requestAnimationFrame(animate);
    };

    animate();

    /*
     * Cleanup
     */
    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      cancelAnimationFrame(
        animationId
      );
    };
  }, []);

  return (
    <div className="portfolio">

      {/* =========================
          BACKGROUND GLOW
      ========================= */}

      <div className="red-orb orb-one" />
      <div className="red-orb orb-two" />
      <div className="red-orb orb-three" />

      {/* =========================
          NAVIGATION
      ========================= */}

      <header className="navbar">

        <a
          href="#home"
          className="brand"
        >
          <span className="brand-mark">
            ◈
          </span>

          <span className="brand-name">
            SIMRAN
          </span>
        </a>

        <nav className="nav-links">

          <a
            href="#home"
            className="active"
          >
            Home
          </a>

          <a href="#about">
            About
          </a>

          <a href="#projects">
            Projects
          </a>

          <a href="#design">
            Design
          </a>

          <a href="#ai">
            AI
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>

        <a
          href="#contact"
          className="connect-button"
        >
          Let's Connect

          <span>
            →
          </span>
        </a>

      </header>

      {/* =========================
          HERO
      ========================= */}

      <main
        id="home"
        className="hero"
      >

        {/* LEFT CONTENT */}

        <section className="hero-left">

          <div className="eyebrow">

            DESIGN

            <span>•</span>

            TECH

            <span>•</span>

            AI

            <span>•</span>

            CREATIVE IDEAS

          </div>

          <h1>

            <span>
              Hi, I'm
            </span>

            <strong>
              Simran Singh.
            </strong>

          </h1>

          <h2>

            Turning ideas into real

            <br />

            <span>
              digital experiences.
            </span>

          </h2>

          <p className="hero-text">

            I design, develop and create using
            graphic design, web technologies,
            AI and creative tools. From dental
            clinic apps to custom software,
            I love turning ideas into real
            projects.

          </p>

          {/* BUTTONS */}

          <div className="hero-actions">

            <a
              href="#projects"
              className="primary-action"
            >
              Explore My Work

              <span>
                →
              </span>
            </a>

            <a
              href="#about"
              className="secondary-action"
            >
              About Me
            </a>

          </div>

          {/* FEATURE CARDS */}

          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                ◇
              </div>

              <div>

                <h3>
                  DESIGN
                </h3>

                <p>
                  Graphics & Visuals
                </p>

              </div>

            </div>

            <div className="feature-card">

              <div className="feature-icon code">
                &lt;/&gt;
              </div>

              <div>

                <h3>
                  DEVELOPMENT
                </h3>

                <p>
                  Web & App Projects
                </p>

              </div>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                ✦
              </div>

              <div>

                <h3>
                  AI & AUTOMATION
                </h3>

                <p>
                  Creative AI Solutions
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            CHARACTER
        ========================= */}

        <section className="hero-right">

          <div className="orbit orbit-one" />

          <div className="orbit orbit-two" />

          <div className="orbit orbit-three" />

          <div className="character-card">

            <canvas
              ref={canvasRef}
            />

            <div className="character-glow" />

          </div>

          {/* SIGNATURE */}

          <div className="signature">

            <div className="signature-mark">
              ◈
            </div>

            <div>

              <strong>
                SIMRAN SINGH
              </strong>

              <span>
                CREATE • DESIGN • BUILD
              </span>

            </div>

          </div>

        </section>

      </main>

      {/* =========================
          LOADING STATUS
      ========================= */}

      <div className="system-status">

        {loaded < FRAME_COUNT
          ? `LOADING ${loaded}/${FRAME_COUNT}`
          : "● SYSTEM READY"}

      </div>

    </div>
  );
}

export default App;