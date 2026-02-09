# WhiteAura Web — Build Checklist

## Phase 1: Foundation ✅
- [x] Analyze reference websites (HQHR, Star Atlas, Dark Netflix)
- [x] Create WEB-DESIGN.md brain module
- [x] Set up project structure (HTML, CSS, JS)
- [x] Create SVG logo (diamond motif — nested diamonds + center dot)
- [x] Define CSS custom properties (full design token system)

## Phase 2: Core Layout ✅
- [x] Navbar — transparent → frosted glass morph, letter-spaced links, hamburger mobile
- [x] Hero section — full viewport, particle canvas, animated text reveal
- [x] Stats bar — counter animation on scroll (247 vulns, 59/59, 24/7, 100%)
- [x] About section — large typographic statement + team cards
- [x] Services section — scroll-triggered card grid with hover + accent border
- [x] Methodology section — timeline with numbered steps
- [x] Proof section — featured cards + terminal mock
- [x] Contact section — 2-column layout with form (FormSubmit)
- [x] Footer — dark contrast section with logo + links

## Phase 3: Particles & Animation ✅
- [x] Particle system — Canvas-based, 60 particles, mouse-reactive (color shift to accent)
- [x] Particle connections — lines between nearby particles
- [x] Scroll animations — IntersectionObserver, fade+translate reveals with stagger
- [x] Hero text reveal — line-by-line animation
- [x] Navbar morph — transparent to frosted glass (blur 20px)
- [x] Card hover effects — lift + shadow + accent bottom border
- [x] Stats counter — count-up animation with ease-out
- [x] Terminal typing effect — staggered line reveal
- [x] Smooth scroll — JS-based with offset

## Phase 4: Polish ✅
- [x] Loading screen — diamond logo pulse
- [x] Custom cursor — dot + trail ring, hover scale effect
- [x] prefers-reduced-motion support
- [x] Mobile responsive — 768px, 480px breakpoints
- [x] Particle count reduction on mobile (60 → 25)
- [x] Meta tags — OG, description, theme-color, favicon

## Phase 5: Pending
- [ ] Logo — waiting for proper brand logo (using diamond SVG placeholder)
- [ ] Team photos — waiting (using SVG avatar placeholders)
- [ ] OG image — needs to be created
- [ ] Deploy to GitHub Pages
- [ ] Lighthouse audit
- [ ] Professional email domain
- [ ] Cookie/privacy policy pages

## Design Specs
- **Background:** #FAF9F6 (warm off-white)
- **Accent:** #0055FF (electric blue)
- **Fonts:** Space Grotesk (display) + Inter (body) + JetBrains Mono (code)
- **Particles:** 60 on desktop, 25 on mobile, mouse-reactive color shift
