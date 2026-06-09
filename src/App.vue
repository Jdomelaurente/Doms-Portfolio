<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCollection } from 'vuefire'
import { collection, doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore'
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
    description: 'A web-based Point of Sale (POS) and administrative management system for coffee shop operations, featuring interactive menu grids, live carts, detailed audit logs, and customizable frontend security and admin privileges.',
    image: '/image/Projects/coffee_shop.png',
    tech: ['PHP', 'MySQL', 'Vanilla JS'],
    links: { demo: 'https://kalinga-coffee-shop.lovestoblog.com/', code: '#' }
  },
  {
    id: 2,
    type: 'WEB',
    category: 'E-COMMERCE',
    title: 'Flower Shop System',
    description: 'An online flower shop website with product catalog, add-to-cart feature, and GCash integration through Paymongo.',
    image: '/image/Projects/e-commerce.png',
    tech: ['PHP', 'Paymongo', 'Tailwind CSS'],
    links: { demo: 'https://flowershop-maison-des-fleurs.onrender.com/', code: '#' }
  },
  {
    id: 3,
    type: 'WEB',
    category: 'WEB SYSTEM',
    title: 'COMLAB Inventory System',
    description: 'A school-based web application for managing computer laboratory inventory, including real-time borrowing, returning, and tracking of assets.',
    image: '/image/Projects/inventory.png',
    tech: ['PHP', 'MySQL', 'Bootstrap'],
    links: { demo: '#', code: '#' }
  },
  {
    id: 4,
    type: 'WEB',
    category: 'PYTHON APP',
    title: 'Python Rich POS System',
    description: 'A terminal-based point-of-sale system using Python and Rich library for interactive UI, including receipt generation and daily sales.',
    image: '/image/Projects/rich.png',
    tech: ['Python', 'SQLAlchemy', 'JSON'],
    links: { demo: '#', code: '#' }
  },
  {
    id: 5,
    type: 'LOGO',
    category: 'LOGO DESIGN',
    title: 'Nong Doms Identity',
    description: 'A fastfood-style eatery brand identity. The logo reflects a casual and welcoming vibe for local "tuway pastel" meals.',
    image: '/image/Logos/Nongdoms.png',
    tech: ['Adobe Illustrator', 'Logo Design'],
    links: { demo: '/image/Logos/Nongdoms.png', code: '#' }
  }
]

const certificates = [
  {
    id: 1,
    title: 'Java Programming Essentials',
    issuer: 'CARAGA STATE UNIVERSITY - CBR',
    image: '/image/Certificates/JAVA PROGRAMMING ESSENTIALS - CSU - CBR (1)-16(isigned)_signed.png',
    date: '2024'
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
  }
]

const activeFilter = ref('ALL')
const isNavActive = ref(false)
const isScrolled = ref(false)
const visitorCount = ref(0)
const isLoading = ref(true)

const filteredWorks = computed(() => {
  if (activeFilter.value === 'ALL') return unifiedWorks
  return unifiedWorks.filter(work => work.type === activeFilter.value)
})

const toggleNav = () => {
  isNavActive.value = !isNavActive.value
}

const closeNav = () => {
  isNavActive.value = false
}

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

const launchArcade = () => {
  window.open('/arcade/index.html', '_blank', 'width=800,height=600,noopener,noreferrer')
}
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
          <li><a href="#certificates" @click="closeNav">Certificates</a></li>
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
                <div style="margin-top: 2rem;">
                   <button @click="launchArcade" class="btn">LAUNCH ARCADE TEST</button>
                </div>
             </div>
          </div>

          <div v-for="(work, index) in filteredWorks" :key="work.id" 
               class="project-tile" 
               data-aos="fade-up">
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
              <div class="tile-footer">
                <a :href="work.links.demo" class="tile-button" target="_blank">
                   <span>PREVIEW</span>
                   <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certificates Section -->
    <section id="certificates">
      <div class="container">
        <div class="section-indicator">03</div>
        <div class="project-header">
           <h2 class="creative-title">PROVEN <br> <span>EXPERTISE</span></h2>
           <p class="section-tagline">CERTIFICATES & ACHIEVEMENTS</p>
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
              <a href="tel:09272308675" class="contact-block mail" data-aos="flip-up" data-aos-delay="100">
                 <i class="fas fa-phone-alt"></i>
                 <div class="block-info">
                    <span>PHONE</span>
                    <p>09272308675</p>
                 </div>
              </a>
              <a href="https://www.instagram.com/laurentejunedominic" target="_blank" class="contact-block ig" data-aos="flip-up" data-aos-delay="200">
                 <i class="fab fa-instagram"></i>
                 <div class="block-info">
                    <span>INSTAGRAM</span>
                    <p>Visual Journal</p>
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
  </main>

  <footer>
    <div class="container footer-creative">
      <div class="footer-top">
         <div class="footer-logo">JUNE DOMINIC</div>
         <nav class="footer-nav">
           <a href="#home">HOME</a>
           <a href="#about">ABOUT</a>
           <a href="#projects">PROJECTS</a>
           <a href="#certificates">CERTIFICATES</a>
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
</template>

<style>
/* Global styles are imported in main.js */
</style>
