<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCollection } from 'vuefire'
import { collection, doc, getDoc, updateDoc, increment, setDoc, addDoc, serverTimestamp, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

// Firebase Collection for Projects (Optional usage)
// const projects = useCollection(collection(db, 'projects'))

// Local works for the vault
const unifiedWorks = [
  {
    id: 1,
    type: 'WEB',
    category: 'WEB SYSTEM',
    title: 'Kalinga Coffee Shop',
    description: 'A comprehensive PHP/MySQL management system featuring role-based dashboards (user, admin, superadmin), a dynamic POS interface with receipt printing, multi-step registration, security controls (temporary lockout & PHPMailer email verification), and auditable activity logging.',
    image: '/image/Projects/coffee_shop.png',
    tech: ['PHP', 'MySQL', 'Vanilla JS'],
    links: { demo: 'https://kalinga-coffee-shop.lovestoblog.com/', code: '#' },
    isSchoolProject: true
  },
  {
    id: 2,
    type: 'WEB',
    category: 'E-COMMERCE',
    title: 'Maison des Fleurs',
    description: 'A Flask-based commissioned flower shop system for Father Saturnino Urios University featuring authentication, product browsing, session-based cart flow, checkout, and admin management tools.',
    image: '/image/Projects/e-commerce.png',
    tech: ['Flask', 'SQLite', 'SQLAlchemy', 'Flask-Login', 'Bootstrap'],
    links: { demo: 'https://flowershop-maison-des-fleurs.onrender.com/', code: '#' },
    isSchoolProject: false,
    badge: 'COMMISSION',
    details: {
      subtitle: 'Commissioned Flower Shop Application',
      projectImage: '/image/Projects/e-commerce.png',
      certificateImage: '/image/Projects/mason_de_flora.jpg',
      overview: 'Maison des Fleurs is a Flask-based flower shop application commissioned for a student of Father Saturnino Urios University, Butuan City. It includes authentication, a customer storefront, session-based cart and purchase flow, and admin management tools for products, orders, and users. The project was built as a real commission and recognized as a first-place output in their school context.',
      architecture: {
        hardware: 'Not hardware-based; the system runs as a browser-based web application for customers and administrators.',
        backend: 'Built with Flask, SQLite, SQLAlchemy, Flask-Migrate, and Flask-Login. It manages authentication, product data, carts, orders, uploads, and admin workflows, with production deployment support through Gunicorn and environment-based secret keys.',
        frontend: 'Uses Bootstrap and custom CSS for a clean storefront, user dashboards, admin pages, cart views, checkout screens, and responsive product browsing.'
      },
      enhancements: [
        'Customer Support: Add a help or chatbot layer for order questions, payment guidance, and shipping concerns.',
        'Order Notifications: Send email or SMS updates for cart checkout, payment status, and order completion.',
        'Production Hardening: Replace the first-run admin defaults with secure setup flows and stronger deployment safeguards.'
      ]
    }
  },
  {
    id: 3,
    type: 'WEB',
    category: 'IoT / WEB SYSTEM',
    title: 'Cage Guard',
    description: 'An automated, low-cost IoT security monitoring system designed for poultry enclosures featuring "Slew-to-Cue" surveillance, automatically panning a camera to face active motion zones, and saving captures in real time.',
    image: '/image/Projects/cage_guard.png',
    tech: ['ESP32', 'Django REST', 'Vue.js', 'OpenCV', 'SQLite'],
    links: { demo: '#', code: '#' },
    isSchoolProject: true,
    details: {
      subtitle: 'A Low-Cost Smart Chicken Cage Monitoring System',
      overview: 'Cage Guard is an automated, internet-of-things (IoT) security monitoring system designed specifically for poultry enclosures, farm monitoring, and perimeter security. By combining low-cost microcontroller hardware with a powerful backend server and a modern web interface, Cage Guard provides real-time "Slew-to-Cue" surveillance—automatically panning a camera to face a zone immediately when motion is detected, capturing visual evidence, and updating a web dashboard in real time.',
      architecture: {
        hardware: 'The core firmware runs on an ESP32 DevKit board and uses four PIR motion sensors to divide the environment into four key zones (LEFT at 0°, FRONT at 90°, RIGHT at 180°, BACK at 270°). When motion is detected, the ESP32 calculates the corresponding angle for the SG90 Servo motor to pan the camera, waits 400ms, sends an HTTP POST JSON payload to the Django server, and implements a 5-second cooldown.',
        backend: 'The backend manages communication, database persistence, and camera control. Upon receiving an alert at /api/devices/logs/, it stores a log record and spawns an OpenCV capture thread. OpenCV warms up the webcam, auto-flips the frame 180° for upside-down mounts, encodes the image as a JPEG, and saves it to the media directory.',
        frontend: 'A responsive web application styled with a premium deep forest green scheme (#003d15). It includes an interactive Radar screen highlighting active zones with alert sounds, a Media Vault showing captured alert images with lightbox view, and a real-time Activity Log with pagination.'
      },
      enhancements: [
        'AI Face & Object Detection: Integrate YOLO or OpenCV Haar Cascades to analyze captured security photos and distinguish poultry, caretakers, and predators.',
        'Push Notifications: Integrate Firebase Cloud Messaging (FCM) or Telegram Bot API for instant mobile alerts.',
        'Night Vision Support: Switch to infrared (IR) night-vision capable camera module for 24/7 dark farm monitoring.'
      ]
    }
  },
  {
    id: 4,
    type: 'WEB',
    category: 'WEB SYSTEM',
    title: 'Lab Inventory System',
    description: 'A modern QR-based laboratory inventory system to track, borrow, and return equipment, samples, and reagents. Features dynamic QR code generation and auto-notifications.',
    image: '/image/Projects/inventory.png',
    tech: ['PHP', 'MySQL', 'Node.js', 'Nodemailer', 'Bootstrap 5'],
    links: { demo: '#', code: '#' },
    isSchoolProject: true,
    details: {
      subtitle: 'QR-Based Laboratory Inventory Management System',
      overview: 'A modern, responsive web application for laboratories to track, borrow, and return equipment, samples, and reagents using QR codes. It features a dashboard for key statistics, dynamic item entry with QR code generation, seamless scanning modules, automated notifications, and an admin panel.',
      architecture: {
        hardware: 'Uses standard client devices (PCs, laptops, tablets) equipped with standard cameras/webcams or dedicated scanners to capture generated QR codes for item tracking.',
        backend: 'Powered by PHP (PDO connection) compatible with local environments or production databases. Integrates a Node.js-based Nodemailer daemon to dispatch automated HTML email alerts on borrow/return events.',
        frontend: 'Built using HTML5, Bootstrap 5, SweetAlert2, and Vanilla JavaScript, styled with clean, dark-themed dashboard elements and modern Google Fonts (Inter & Outfit).'
      },
      enhancements: [
        'Dashboard: A sleek, dark-themed statistics panel showing item statuses and borrow metrics.',
        'Automated Email Alerts: SMTP-based alerts configured inside Nodemailer script for email delivery.',
        'Admin Controls: Inventory details modification, administrator credentials config, and QR code printing.'
      ]
    }
  },
  {
    id: 5,
    type: 'WEB',
    category: 'DOCUMENT SYSTEM',
    title: 'La Union Senior High School Document Request Management System',
    description: 'A document request management system for La Union Senior High School where students can submit and track document requests online, while staff and administrators handle processing, pickup scheduling, and document digitization.',
    image: '/image/Projects/launion.png',
    tech: ['Vue 3', 'Django 5.2', 'DRF', 'PostgreSQL', 'Tailwind CSS', 'Supabase', 'Render', 'Vercel'],
    links: { demo: 'https://mars-launion.vercel.app/', code: '#' },
    isSchoolProject: false,
    badge: 'COMMISSION',
    details: {
      subtitle: 'A Commissioned Document Request Management System',
      overview: 'A full-stack document request platform for La Union Senior High School. Students can submit and monitor requests using a unique passkey, while staff and administrators process documents, manage pickup slots, digitize records, and maintain audit visibility across the system.',
      architecture: {
        hardware: 'Not hardware-based; the system is designed as a web application accessible to students, staff, and administrators through desktop and mobile browsers.',
        backend: 'Built with Django 5.2 and Django REST Framework, secured with SimpleJWT and deployed with Gunicorn. It exposes public request submission endpoints, authenticated staff/admin routes, bulk status updates, audit logging, email notifications, and pickup slot management backed by PostgreSQL on Supabase.',
        frontend: 'Built with Vue 3 Composition API, Vite, Vue Router 5, Pinia, Tailwind CSS v4, Chart.js, and Axios. The interface supports public submission, passkey tracking, dashboard analytics, student directory management, and document upload workflows.'
      },
      enhancements: [
        'AI Chatbot Support: Add a chatbot that answers common request questions and helps students find the right document process.',
        'Customer Service Console: Let staff handle live inquiries, follow-ups, and request concerns from one support dashboard.',
        'Smart Help Center: Build an FAQ and guided assistant for pickup schedules, requirements, and request tracking.'
      ]
    }
  },
  {
    id: 6,
    type: 'LOGO',
    category: 'LOGO DESIGN',
    title: 'Nong Doms Identity',
    description: 'A fastfood-style eatery brand identity. The logo reflects a casual and welcoming vibe for local "tuway pastel" meals.',
    image: '/image/Logos/Nongdoms.png',
    tech: ['Adobe Illustrator', 'Logo Design'],
    links: { demo: '/image/Logos/Nongdoms.png', code: '#' }
  },
  {
    id: 7,
    type: 'WEB',
    category: 'WEB SYSTEM',
    title: 'Flight Booking Simulation Platform',
    description: 'A comprehensive smart flight booking simulation platform for CTHM-CSUCC featuring flight search with multi-step booking wizard, interactive seat maps, add-on selection, PDF itinerary and QR-coded boarding pass generation, DCS check-in simulation, ML-powered dynamic pricing, student and instructor portals, and an admin panel.',
    image: '/image/Projects/fbs.png',
    tech: ['Django 6.0', 'DRF', 'Vue 3', 'PostgreSQL', 'XGBoost', 'Tailwind CSS', 'PayMongo', 'Djoser', 'ReportLab'],
    links: { demo: 'https://flight-booking-django.vercel.app/', code: '#' },
    isSchoolProject: true,
    badge: 'CAPSTONE',
    details: {
      subtitle: 'A Capstone Flight Booking Simulation Platform for CTHM-CSUCC',
      overview: 'Flight Booking Simulation Platform (FBS) is a comprehensive smart flight booking simulation platform designed for CTHM-CSUCC (College of Tourism and Hospitality Management). This interactive training tool simulates a real-world airline booking system where students search flights, book tickets, select seats, and check in — all as part of graded academic activities. The platform features a multi-step booking wizard (Search → Passengers → Add-ons → Seats → Review → Payment), interactive seat maps with real-time availability, add-on selection (insurance, meals, baggage, assistance services), PDF itinerary/receipt and QR-coded boarding pass generation, and DCS (Departure Control System) check-in simulation. It also includes a student portal for viewing assigned activities and grades, an instructor portal for creating sections and grading activities, and an admin panel for flight operations, asset management, and dynamic pricing configuration.',
      architecture: {
        hardware: 'Not hardware-based; the system runs as a browser-based web application accessible to students, instructors, and administrators through desktop and mobile browsers.',
        backend: 'Built with Django 6.0 and Django REST Framework 3.16.1, backed by PostgreSQL 16. Authentication is handled by Djoser 2.3.3. An XGBoost model trained on historical flight data powers base fare prediction with a dynamic pricing engine using multipliers for demand, time, occupancy, loyalty, and randomization. ReportLab 4.4.9 generates PDF itineraries/receipts and QR-coded boarding passes. PayMongo handles payment processing. Bulk CSV import is supported for fleet, operations, and ancillaries.',
        frontend: 'Built with Vue 3 Composition API, Vite 7.3.0, Pinia 3.0.4 for state management, and Tailwind CSS 4.1.18 for styling. Axios 1.13.2 handles API communication, Chart.js 4.5.1 powers dashboard analytics, and Leaflet 1.9.4 provides interactive maps. The interface includes dedicated views for the booking flow, student dashboard, instructor portal, admin panels, and DCS check-in system.'
      },
      enhancements: [
        'AI Chatbot: Integrate a conversational assistant to help students navigate the booking process and answer common questions.',
        'Mobile App: Develop a companion mobile application for iOS and Android to allow booking and check-in on the go.',
        'Real-Time Notifications: Add WebSocket-based live updates for booking confirmations, check-in reminders, and grade notifications.',
        'Multi-Currency Support: Extend the payment system to support multiple currencies for international flight simulations.'
      ]
    }
  }
]

const certificates = [
  {
    id: 1,
    title: 'Java Programming Essentials',
    issuer: 'CARAGA STATE UNIVERSITY - CBR',
    image: '/image/Certificates/JAVA PROGRAMMING ESSENTIALS - CSU - CBR (1)-16(isigned)_signed.png',
    date: '2025'
  },
  {
    id: 2,
    title: 'Full Stack Web Development',
    issuer: 'SIMPLILEARN',
    image: '/image/Certificates/Simplilearn.png',
    date: '2025'
  },
  {
    id: 3,
    title: 'Professional Skill-up Web Development',
    issuer: 'UDEMY',
    image: '/image/Certificates/Udemy.png',
    date: '2025'
  },
  {
    id: 4,
    title: 'Online Career Starter Workshop',
    issuer: 'Codec',
    image: '/image/Certificates/Codec.png',
    date: '2026'
  }
]

const activeFilter = ref('ALL')
const isNavActive = ref(false)
const isScrolled = ref(false)
const visitorCount = ref(0)
const isLoading = ref(true)

const selectedProject = ref(null)
const isModalOpen = ref(false)

const isResumeModalOpen = ref(false)

const openResumeModal = () => {
  isResumeModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeResumeModal = () => {
  isResumeModalOpen.value = false
  document.body.style.overflow = ''
}

// Comments
const commentsQuery = query(collection(db, 'comments'), orderBy('createdAt', 'desc'))
const comments = useCollection(commentsQuery)
const commentName = ref('')
const commentMessage = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)

const submitComment = async () => {
  const name = commentName.value.trim()
  const message = commentMessage.value.trim()
  if (!name || !message) return
  isSubmitting.value = true
  try {
    await addDoc(collection(db, 'comments'), {
      name,
      message,
      createdAt: serverTimestamp()
    })
    commentName.value = ''
    commentMessage.value = ''
    submitSuccess.value = true
    setTimeout(() => { submitSuccess.value = false }, 3000)
  } catch (err) {
    console.error('Error submitting comment:', err)
  } finally {
    isSubmitting.value = false
  }
}

const openProjectModal = (project) => {
  selectedProject.value = project
  isModalOpen.value = true
  document.body.style.overflow = 'hidden' // prevent scrolling
}

const closeProjectModal = () => {
  isModalOpen.value = false
  selectedProject.value = null
  document.body.style.overflow = ''
}

const toggleNav = () => {
  isNavActive.value = !isNavActive.value
}

const closeNav = () => {
  isNavActive.value = false
}

const filteredWorks = computed(() => {
  if (activeFilter.value === 'ALL') return unifiedWorks
  return unifiedWorks.filter(work => work.type === activeFilter.value)
})

onMounted(async () => {
  // Visitor Counter Logic
  const statsRef = doc(db, 'stats', 'global')
  try {
    const statsSnap = await getDoc(statsRef)
    if (statsSnap.exists()) {
      await updateDoc(statsRef, {
        visitors: increment(1)
      })
      visitorCount.value = statsSnap.data().visitors + 1
    } else {
      await setDoc(statsRef, { visitors: 1 })
      visitorCount.value = 1
    }
  } catch (error) {
    console.error("Error updating visitor count:", error)
  }

  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
  }

  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 100
  })

  // Fade out loader
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>

<template>
  <!-- Preloader Screen -->
  <div class="preloader" :class="{ 'fade-out': !isLoading }">
    <div class="preloader-content">
       <div class="loader-box"></div>
       <div class="loader-text">LOADING...</div>
       <div class="loader-progress"></div>
    </div>
  </div>

  <header :class="{ 'scrolled': isScrolled }">
    <div class="container header-container">
      <div class="logo">
        <img src="/image/Logo.png" alt="Logo" class="logo-img">
        <span class="logo-text">Doms</span>
      </div>
      <nav>
        <div class="hamburger" @click="toggleNav">
          <i class="fas fa-bars"></i>
        </div>
        <ul class="nav-links" :class="{ 'active': isNavActive }">
          <li><a href="#home" @click="closeNav">Home</a></li>
          <li><a href="#about" @click="closeNav">About</a></li>
          <li><a href="#projects" @click="closeNav">Projects</a></li>
          <li><a href="#experience" @click="closeNav">Certificates</a></li>
          <li><a href="#contact" @click="closeNav">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section id="home">
      <div class="container hero-container-layout">
        <div class="hero-image-box" data-aos="fade-right">
             <img src="/image/kapi.png" alt="Dom Profile" class="hero-profile-img">
             <div class="hero-badge badge-1">Frontend</div>
             <div class="hero-badge badge-2">Backend</div>
             <div class="hero-badge badge-3">2026</div>
        </div>
        <div class="hero-content" data-aos="fade-left">
          <div class="hero-greeting">HELLO THERE!</div>
          <div class="hero-visitor-badge">
             <span class="visitor-pulse"></span>
             PEOPLE REACHED: <span>{{ visitorCount }}</span>
          </div>
          <h1 class="hero-title">I'M <span>DOM</span> LAURENTE</h1>
          <p class="hero-subtitle">MAPPING CREATIVITY INTO CODE</p>
          <div class="hero-btns">
            <a href="#projects" class="btn">PORTFOLIO</a>
            <button @click="openResumeModal" class="btn btn-secondary"><i class="fas fa-file-download" style="margin-right: 5px;"></i> RESUME</button>
            <a href="#contact" class="btn btn-secondary">HIRE ME</a>
          </div>
        </div>
      </div>
      
      <!-- Scrolling Marquee -->
      <div class="marquee-container">
        <div class="marquee-content">
           <span>VUE.JS</span>
           <span>DJANGO</span>
           <span>FLASK</span>
           <span>PHP</span>
           <span>FIREBASE</span>
           <span>MYSQL</span>
           <span>SUPABASE</span>
           <span>VERCEL</span>
           <span>RENDER</span>
           <span>FIGMA</span>
           <span>UI/UX DESIGN</span>
           <span>VUE.JS</span>
           <span>DJANGO</span>
           <span>FLASK</span>
           <span>PHP</span>
           <span>FIREBASE</span>
           <span>MYSQL</span>
           <span>SUPABASE</span>
           <span>VERCEL</span>
           <span>RENDER</span>
           <span>FIGMA</span>
           <span>UI/UX DESIGN</span>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about">
      <div class="container about-grid-layout">
        <div class="section-indicator">01</div>
        <div class="about-visual" data-aos="zoom-in">
          <div class="about-image-wrapper">
             <img src="/image/ako.jpg" alt="About Image" class="about-main-img">
             <div class="image-decorative-box"></div>
          </div>
        </div>
        <div class="about-text-content" data-aos="fade-left">
          <h2 class="creative-title">CRAFTING <br> DIGITAL <span>SOUL</span></h2>
          <p class="about-lead">I DON'T JUST BUILD WEBSITES. I CHARACTERIZE THEM.</p>
          <p>Highly motivated and creative Information Technology student and Full-Stack Developer with expertise in building scalable applications using <span>VUE.JS</span> and <span>DJANGO</span>. I specialize in modern cloud architectures, utilizing <span>VERCEL</span>, <span>SUPABASE</span>, and <span>RENDER</span> to deploy production-ready digital solutions.</p>
          
          <!-- Identity Card -->
          <div class="identity-card" data-aos="flip-up">
            <div class="id-row"><span>BORN:</span> JUNE 13, 2003 (22 Y/O)</div>
            <div class="id-row"><span>STATUS:</span> SINGLE | FILIPINO</div>
            <div class="id-row"><span>LOCATION:</span> AGUSAN DEL NORTE, PH</div>
          </div>


          <div class="skills-vault">
            <div class="skill-category">
              <h4>FRONTEND & DESIGN</h4>
              <div class="skill-labels">
                <span>VUE.JS</span> <span>REACT</span> <span>TAILWIND</span> <span>BOOTSTRAP</span> <span>FIGMA</span> <span>UI/UX</span>
              </div>
            </div>
            <div class="skill-category">
              <h4>BACKEND & DB</h4>
              <div class="skill-labels">
                <span>PHP</span> <span>FLASK</span> <span>DJANGO</span> <span>SQLALCHEMY</span> <span>MYSQL</span> <span>POSTGRESQL</span> <span>FIREBASE</span> <span>SUPABASE</span>
              </div>
            </div>
            <div class="skill-category">
              <h4>DEVELOPMENT TOOLS</h4>
              <div class="skill-labels">
                <span>GITHUB</span> <span>FIREBASE</span> <span>VERCEL</span> <span>RENDER</span> <span>ILLUSTRATOR</span> <span>FIGMA</span> <span>GIT</span>
              </div>
            </div>
            <div class="education-vault">
              <h4 class="vault-label">ACADEMIC JOURNEY</h4>
              <div class="timeline-grid">
                <div class="timeline-box">
                  <span class="timeline-year">2022 - PRESENT</span>
                  <h5>BSIT</h5>
                  <p>CARAGA STATE UNIVERSITY - CC</p>
                </div>
                <div class="timeline-box">
                  <span class="timeline-year">2020 - 2022</span>
                  <h5>SHS (ICT)</h5>
                  <p>MAGALLANES NATIONAL HS</p>
                </div>
                <div class="timeline-box">
                  <span class="timeline-year">2016 - 2020</span>
                  <h5>JUNIOR HS</h5>
                  <p>MAGALLANES NATIONAL HS</p>
                </div>
                <div class="timeline-box">
                  <span class="timeline-year">2016</span>
                  <h5>ELEMENTARY</h5>
                  <p>CALOC-AN MAGALLANES ES</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
      <div class="container">
        <div class="section-indicator light">02</div>
        <div class="project-header">
           <h2 class="creative-title light">THE <br> PROJECT <span>VAULT</span></h2>
           <p class="section-tagline">SELECT WORKS FROM 2024-2026</p>
           
           <!-- Filter Selection -->
           <div class="vault-filters">
              <button 
                class="filter-btn" 
                :class="{ active: activeFilter === 'ALL' }" 
                @click="activeFilter = 'ALL'">
                ALL WORKS
              </button>
              <button 
                class="filter-btn" 
                :class="{ active: activeFilter === 'WEB' }" 
                @click="activeFilter = 'WEB'">
                WEB SYSTEMS
              </button>
              <button 
                class="filter-btn" 
                :class="{ active: activeFilter === 'LOGO' }" 
                @click="activeFilter = 'LOGO'">
                LOGO DESIGNS
              </button>
              <button 
                class="filter-btn" 
                :class="{ active: activeFilter === 'GAME' }" 
                @click="activeFilter = 'GAME'">
                GAMES
              </button>
           </div>
        </div>

        <div class="project-creative-grid">
          <!-- Placeholder for categories with no projects yet (like GAMES) -->
          <div v-if="filteredWorks.length === 0" class="coming-soon-box" data-aos="zoom-in">
             <div class="coming-soon-content">
                <i class="fas fa-hammer"></i>
                <h3>DEVELOPER IS BUSY</h3>
                <p>I'm currently working on other big things, but hopefully this year I can make a wonderful game for you. I hope you will like it! :)</p>
                <div class="coming-soon-tag">COMING SOON</div>
             </div>
          </div>

          <div v-for="(work, index) in filteredWorks" :key="work.id" 
               class="project-tile" 
               data-aos="fade-up">
            <div
              v-if="work.isSchoolProject || work.badge"
              class="tile-badge-school"
              :class="{ commission: work.badge === 'COMMISSION' }"
            >
              {{ work.badge || 'SCHOOL PROJECT' }}
            </div>
            <div class="tile-category">{{ work.category }}</div>
            <div class="tile-img-container">
              <img :src="work.image" :alt="work.title">
              <div class="tile-number-overlay">#0{{ index + 1 }}</div>
            </div>
            <div class="tile-body">
              <h3>{{ work.title }}</h3>
              <p>{{ work.description }}</p>
              <div class="tile-tags">
                <span v-for="tech in work.tech" :key="tech">{{ tech }}</span>
              </div>
            </div>
            <div class="tile-footer" style="display: flex; border-top: var(--border-size) solid var(--black); width: 100%;">
              <button @click="openProjectModal(work)" class="tile-button" style="flex: 1; border: none;">
                 <span>DETAILS</span>
                 <i class="fas fa-info-circle"></i>
              </button>
              <a v-if="work.links.demo && work.links.demo !== '#'" :href="work.links.demo" class="tile-button" target="_blank" style="flex: 1; border-left: var(--border-size) solid var(--black); text-align: center;">
                 <span>PREVIEW</span>
                 <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience & Credentials Section -->
    <section id="experience">
      <div class="container">
        <div class="section-indicator light">03</div>
        <div class="project-header">
           <h2 class="creative-title"><span>CERTIFICATES</span></h2>
           <p class="section-tagline">OFFICIAL CREDENTIALS & CERTIFICATIONS</p>
        </div>

        <div class="certificates-grid">
           <div v-for="cert in certificates" :key="cert.id" class="cert-tile" data-aos="zoom-in">
              <div class="cert-img-container">
                 <img :src="cert.image" :alt="cert.title" class="cert-preview-img" oncontextmenu="return false;">
              </div>
              <div class="cert-body">
                 <div class="cert-date">{{ cert.date }}</div>
                 <h3>{{ cert.title }}</h3>
                 <p>{{ cert.issuer }}</p>
                 <div class="security-tag">
                    <i class="fas fa-lock"></i> VIEW-ONLY MODE
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
      <div class="container">
        <div class="section-indicator">04</div>
        <div class="contact-card-layout">
           <div class="contact-header" data-aos="fade-down">
              <h2 class="creative-title">READY TO <br> <span>COLLABORATE?</span></h2>
              <p>LET'S BUILD SOMETHING THAT BREAKS THE NORM.</p>
           </div>
           
           <div class="contact-grid">
              <a href="https://www.facebook.com/jdomelaurente" target="_blank" class="contact-block fb" data-aos="flip-up">
                 <i class="fab fa-facebook"></i>
                 <div class="block-info">
                    <span>FACEBOOK</span>
                    <p>@jdomelaurente</p>
                 </div>
              </a>

               <a href="https://github.com/Jdomelaurente" target="_blank" class="contact-block github" data-aos="flip-up" data-aos-delay="200">
                  <i class="fab fa-github"></i>
                  <div class="block-info">
                     <span>GITHUB</span>
                     <p>@Jdomelaurente</p>
                  </div>
               </a>
              <a href="https://www.linkedin.com/in/jdomelaurente" target="_blank" class="contact-block linkedin" data-aos="flip-up" data-aos-delay="250">
                  <i class="fab fa-linkedin"></i>
                  <div class="block-info">
                     <span>LINKEDIN</span>
                     <p>June Dominic Laurente</p>
                  </div>
               </a>
               <a href="mailto:jdomelaurente@gmail.com" class="contact-block mail" data-aos="flip-up" data-aos-delay="300">
                  <i class="fas fa-envelope"></i>
                  <div class="block-info">
                     <span>EMAIL</span>
                     <p>jdomelaurente@gmail.com</p>
                  </div>
               </a>
           </div>
        </div>
      </div>
    </section>
    <!-- Comments Section -->
    <section id="comments">
      <div class="container">
        <div class="section-indicator">05</div>
        <div class="comments-card">
          <div class="comments-header" data-aos="fade-down">
            <h2 class="creative-title">LEAVE A <span>FEEDBACK</span></h2>
            <p>HELP ME IMPROVE — DROP YOUR THOUGHTS BELOW</p>
          </div>

          <form class="comment-form" @submit.prevent="submitComment" data-aos="fade-up">
            <div class="form-group">
              <label for="commentName">NAME</label>
              <input id="commentName" v-model="commentName" type="text" placeholder="YOUR NAME" required maxlength="50">
            </div>
            <div class="form-group">
              <label for="commentMessage">MESSAGE</label>
              <textarea id="commentMessage" v-model="commentMessage" placeholder="YOUR FEEDBACK OR SUGGESTIONS..." required maxlength="500" rows="4"></textarea>
            </div>
            <button type="submit" class="btn submit-btn" :disabled="isSubmitting">
              <span v-if="isSubmitting">SENDING...</span>
              <span v-else>SEND FEEDBACK</span>
              <i class="fas fa-paper-plane"></i>
            </button>
            <p v-if="submitSuccess" class="success-msg">THANK YOU FOR YOUR FEEDBACK!</p>
          </form>

          <div class="comments-list" data-aos="fade-up">
            <h3><i class="fas fa-comments"></i> RECENT FEEDBACK</h3>
            <div v-if="comments.length === 0" class="no-comments">
              <p>NO FEEDBACK YET. BE THE FIRST!</p>
            </div>
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">{{ comment.name.charAt(0).toUpperCase() }}</div>
              <div class="comment-body">
                <div class="comment-meta">
                  <strong>{{ comment.name }}</strong>
                  <span v-if="comment.createdAt" class="comment-date">{{ comment.createdAt.toDate().toLocaleDateString() }}</span>
                </div>
                <p>{{ comment.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container footer-creative">
      <div class="footer-top">
         <div class="footer-logo">JUNE DOMINIC</div>
         <nav class="footer-nav">
           <a href="#home">HOME</a>
           <a href="#about">ABOUT</a>
           <a href="#projects">PROJECTS</a>
           <a href="#experience">CERTIFICATES</a>
           <a href="#contact">CONTACT</a>
         </nav>
      </div>
      <div class="footer-bottom">
        <p class="copyright">&copy; 2026 JUNE DOMINIC G. LAURENTE. ALL RIGHTS RESERVED.</p>
        <div class="footer-tags">
           <div class="footer-tag">BUILT WITH VUE + FIREBASE</div>
           <div class="footer-tag design-tag">DESIGN: NEO-BRUTALISM</div>
        </div>
      </div>
    </div>
  </footer>

  <!-- Resume Modal -->
  <div v-if="isResumeModalOpen" class="project-modal-overlay" @click.self="closeResumeModal">
    <div class="project-modal-content" style="max-width: 900px;">
      <button class="modal-close-btn" @click="closeResumeModal" aria-label="Close modal">
        <i class="fas fa-times"></i>
      </button>

      <div class="modal-header">
        <span class="modal-category">DOCUMENT</span>
        <h2 class="modal-title">RESUME</h2>
        <p class="modal-subtitle">JUNE DOMINIC G. LAURENTE</p>
      </div>

      <div class="modal-body" style="padding: 0;">
        <div style="width: 100%; height: 70vh; border: 3px solid var(--black);">
          <embed src="/documents/resume.pdf#toolbar=0&navpanes=0&scrollbar=0" style="width: 100%; height: 100%;" type="application/pdf">
        </div>
      </div>

      <div class="modal-footer" style="justify-content: center;">
        <a href="/documents/resume.pdf" download class="btn modal-btn">
          <span>DOWNLOAD PDF</span>
          <i class="fas fa-download"></i>
        </a>
        <a href="/documents/resume.docx" download class="btn btn-secondary modal-btn">
          <span>DOWNLOAD DOCX</span>
          <i class="fas fa-file-word"></i>
        </a>
        <button class="btn btn-secondary modal-btn" @click="closeResumeModal">CLOSE</button>
      </div>
    </div>
  </div>

  <!-- Project Details Modal -->
  <div v-if="isModalOpen && selectedProject" class="project-modal-overlay" @click.self="closeProjectModal">
    <div class="project-modal-content">
      <button class="modal-close-btn" @click="closeProjectModal" aria-label="Close modal">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="modal-header">
        <span
          class="modal-badge-school"
          v-if="selectedProject.isSchoolProject || selectedProject.badge"
          :class="{ commission: selectedProject.badge === 'COMMISSION' }"
        >
          {{ selectedProject.badge || 'SCHOOL PROJECT' }}
        </span>
        <span class="modal-category">{{ selectedProject.category }}</span>
        <h2 class="modal-title">{{ selectedProject.title }}</h2>
        <p class="modal-subtitle" v-if="selectedProject.details && selectedProject.details.subtitle">
          {{ selectedProject.details.subtitle }}
        </p>
      </div>

      <div class="modal-body">
        <div class="modal-img-container">
          <img :src="selectedProject.details?.projectImage || selectedProject.image" :alt="selectedProject.title" class="modal-hero-img">
        </div>

        <div class="modal-section certificate-section" v-if="selectedProject.details && selectedProject.details.certificateImage">
          <h3><i class="fas fa-certificate"></i> Certificate</h3>
        </div>

        <div class="modal-img-container" v-if="selectedProject.details && selectedProject.details.certificateImage">
          <div class="certificate-badge">CERTIFICATE</div>
          <img :src="selectedProject.details.certificateImage" :alt="`${selectedProject.title} certificate`" class="modal-hero-img">
        </div>

        <div class="modal-tech-stack">
          <h4>TECH STACK</h4>
          <div class="tech-tags">
            <span v-for="tech in selectedProject.tech" :key="tech">{{ tech }}</span>
          </div>
        </div>

        <div class="modal-section" v-if="selectedProject.details">
          <h3><i class="fas fa-eye"></i> System Overview</h3>
          <p>{{ selectedProject.details.overview }}</p>
        </div>
        <div class="modal-section" v-else>
          <h3><i class="fas fa-eye"></i> Overview</h3>
          <p>{{ selectedProject.description }}</p>
        </div>

        <div class="modal-section" v-if="selectedProject.details && selectedProject.details.architecture">
          <h3><i class="fas fa-cogs"></i> System Architecture & Components</h3>
          
          <div class="arch-grid">
            <div class="arch-card hw">
              <div class="arch-card-header">
                <i class="fas fa-microchip"></i>
                <h4>1. Hardware Layer</h4>
              </div>
              <p>{{ selectedProject.details.architecture.hardware }}</p>
            </div>

            <div class="arch-card backend">
              <div class="arch-card-header">
                <i class="fas fa-server"></i>
                <h4>2. Backend Layer</h4>
              </div>
              <p>{{ selectedProject.details.architecture.backend }}</p>
            </div>

            <div class="arch-card frontend">
              <div class="arch-card-header">
                <i class="fas fa-laptop-code"></i>
                <h4>3. Frontend Layer</h4>
              </div>
              <p>{{ selectedProject.details.architecture.frontend }}</p>
            </div>
          </div>
        </div>

        <div class="modal-section" v-if="selectedProject.details && selectedProject.details.enhancements">
          <h3><i class="fas fa-rocket"></i> Future Enhancements</h3>
          <ul class="enhancements-list">
            <li v-for="(item, idx) in selectedProject.details.enhancements" :key="idx">
              <i class="fas fa-chevron-right"></i> {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <div class="modal-footer">
        <a v-if="selectedProject.links.demo && selectedProject.links.demo !== '#'" :href="selectedProject.links.demo" target="_blank" class="btn modal-btn">
          <span>LIVE PREVIEW</span>
          <i class="fas fa-external-link-alt"></i>
        </a>
        <a v-if="selectedProject.links.code && selectedProject.links.code !== '#'" :href="selectedProject.links.code" target="_blank" class="btn btn-secondary modal-btn">
          <span>VIEW CODE</span>
          <i class="fab fa-github"></i>
        </a>
        <button class="btn btn-secondary modal-btn" @click="closeProjectModal">CLOSE</button>
      </div>
    </div>
  </div>
</template>

<style>
/* Global styles are imported in main.js */
</style>
