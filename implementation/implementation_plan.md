# MS & P LLC Plumbing Landing Page - Implementation Plan

## Project Overview
A premium, fully responsive landing page for MS & P LLC, a plumbing services company in New Orleans, LA. The design emphasizes reliability, professionalism, and local expertise with a modern aesthetic using Patriot Blue and Liberty Red brand colors.

---

## Design System

### Color Palette
- **Primary**: Patriot Blue (#003D7A) - Trust, reliability, professionalism
- **Accent**: Liberty Red (#DA1F3D) - Energy, urgency, CTAs
- **Neutral**: Charcoal (#121212) - Text, depth
- **Background**: White (#FFFFFF) - Clean, modern
- **Light Gray**: #F5F5F5 - Subtle backgrounds, cards
- **Borders**: #E5E5E5 - Dividers, outlines

### Typography
- **Font Family**: Geist (sans-serif) for all text
- **Heading Styles**: 
  - H1: 48px bold (Hero title)
  - H2: 36px bold (Section headers)
  - H3: 24px semibold (Card titles)
- **Body**: 16px regular, line-height 1.6
- **Small Text**: 14px regular (descriptions)

### Spacing & Layout
- Use Tailwind's standard spacing scale (px-4, py-6, gap-4, etc.)
- Mobile-first design with responsive breakpoints: md (768px), lg (1024px)
- Container max-width: 1280px (lg)

---

## Component Architecture

### 1. **Navigation Bar** (Sticky Header)
- **File**: `components/Navigation.tsx`
- **Features**:
  - Logo on left
  - Desktop nav menu (right side)
  - Mobile hamburger menu (collapsible)
  - Sticky positioning on scroll
  - Brand colors: Blue background with white text
  - CTA button: "Book Service" (Liberty Red)
- **Animation**: Subtle fade-in on scroll, menu slide-down on mobile

### 2. **Hero Section**
- **File**: `components/Hero.tsx`
- **Features**:
  - Full-width background with split layout
  - Left: Large headline + subtext + 2 CTA buttons
  - Right: Professional plumber image
  - Headline: "Expert Plumbing Solutions for Your Peace of Mind"
  - Subheading: Service area callout
  - CTAs: "Get Service Now" (primary), "View Services" (secondary)
  - Mobile: Stacked layout, full-width image below text
- **Animation**: Fade-in with slight slide-up on page load

### 3. **Trust Bar / Social Proof**
- **File**: `components/TrustBar.tsx`
- **Features**:
  - Horizontal scrollable/grid bar showing key metrics
  - Items: "500+ Happy Customers", "20+ Years Experience", "24/7 Emergency Service", "Licensed & Insured"
  - Icons from Lucide React
  - Light gray background
  - Mobile: Scrollable horizontal list
- **Animation**: Staggered counter animations (0 → final number)

### 4. **Feature Cards / Bento Gallery**
- **File**: `components/BentoGallery.tsx`
- **Features**:
  - Grid layout (3 columns desktop, 2 mobile, 1 tablet)
  - 6 service cards:
    1. Emergency Repairs (icon: Zap)
    2. Pipe Installation (icon: Wrench)
    3. Leak Detection (icon: AlertCircle)
    4. Maintenance Plans (icon: Shield)
    5. Water Heater Service (icon: Droplets)
    6. Drain Cleaning (icon: Pipe)
  - Each card: Icon, title, description, subtle hover effect
  - Card hover: Lift effect (transform, shadow increase)
  - Blue accent bar on top of each card
- **Animation**: Staggered entrance on scroll (fade-in + slide-up)

### 5. **Transformation Slider (Before/After)**
- **File**: `components/TransformationSlider.tsx`
- **Features**:
  - Interactive before/after slider for bathroom/kitchen plumbing work
  - Dual images (before left, after right)
  - Draggable slider handle with smooth transitions
  - State: percentage-based position (0-100%)
  - Desktop slider visible, mobile: Toggle button between before/after
  - Text overlay on images
- **Animation**: Smooth drag interaction, image transitions

### 6. **Pricing Cards Section**
- **File**: `components/PricingCards.tsx`
- **Features**:
  - 4 pricing tiers: Basic, Standard, Premium, Emergency
  - Each card shows:
    - Service name
    - Price
    - Description (2-3 bullet points)
    - CTA button
  - Highlight "Standard" as recommended (slight elevation, red accent)
  - Mobile: Single column, cards full width
- **Animation**: Hover scale effect, shadow enhancement

### 7. **Social Proof / Testimonials**
- **File**: `components/Testimonials.tsx`
- **Features**:
  - Carousel of customer testimonials
  - 3-4 visible at once (desktop), 1 at a time (mobile)
  - Each testimonial: Star rating, quote, customer name, image
  - Navigation: Previous/Next arrows
  - Auto-rotate every 5 seconds (optional pause on hover)
- **Animation**: Smooth carousel transitions

### 8. **FAQ Accordion**
- **File**: `components/FAQAccordion.tsx`
- **Features**:
  - 6-8 common questions about plumbing services
  - Collapsible accordion items
  - Questions visible, answers expand on click
  - Blue text for question, dark gray for answer
  - Chevron icon rotates on expand
  - Mobile: Full-width, larger touch targets
- **Animation**: Smooth height transition on expand/collapse

### 9. **Guarantee Section**
- **File**: `components/GuaranteeSection.tsx`
- **Features**:
  - Bold headline about service guarantee
  - 3-4 guarantee points with icons
  - Badge/seal graphic (optional)
  - Liberty Red accent color
  - Centered text layout
- **Animation**: Icon animations on scroll (subtle bounce)

### 10. **Live Activity Footer Badge**
- **File**: `components/LiveActivityBadge.tsx`
- **Features**:
  - Rotating location names (New Orleans LA, specific neighborhoods)
  - Green dot indicator (live status)
  - Text: "Live in [Location]" or "Just completed [Service]"
  - Positioned in corner or footer
  - Refreshes every 10 seconds
- **Animation**: Fade in/out transitions between locations

### 11. **Footer**
- **File**: `components/Footer.tsx`
- **Features**:
  - Multiple columns:
    - Logo + About
    - Quick Links
    - Service Areas
    - Contact Info (phone, email, hours)
    - Social Media Icons
  - Dark background (charcoal or navy)
  - White text
  - CTA button in footer
  - Copyright text
- **Animation**: Hover effects on links

### 12. **Booking Modal / Sheet**
- **File**: `components/BookingModal.tsx`
- **Features**:
  - Centralized state managed in `page.tsx`
  - Form fields:
    - Full Name
    - Phone Number
    - Email
    - Service Type (dropdown)
    - Preferred Date/Time
    - Description of issue
  - Submit button (Liberty Red)
  - Modal: Dark overlay, card centered
  - Mobile: Full-screen sheet behavior
  - Close button (X or backdrop click)
- **Animation**: Smooth modal entrance (scale + fade), backdrop fade

---

## Page Structure (page.tsx)

```
<Layout>
  <Navigation /> (with booking modal trigger)
  <Hero /> (contains CTA button)
  <TrustBar />
  <BentoGallery /> (contains feature cards with info)
  <TransformationSlider />
  <PricingCards /> (cards with CTA buttons)
  <Testimonials />
  <FAQAccordion />
  <GuaranteeSection />
  <LiveActivityBadge />
  <Footer /> (contains CTA button + booking trigger)
  <BookingModal /> (global, state managed at page level)
</Layout>
```

---

## Mock Data Structure (data/mockData.ts)

### Services Array
```javascript
export const services = [
  { id: 1, name: "Emergency Repairs", description: "...", icon: "Zap" },
  { id: 2, name: "Pipe Installation", description: "...", icon: "Wrench" },
  // ... more services
];
```

### Pricing Tiers Array
```javascript
export const pricingTiers = [
  { id: 1, name: "Basic", price: "$99", features: [...], recommended: false },
  { id: 2, name: "Standard", price: "$199", features: [...], recommended: true },
  // ... more tiers
];
```

### Testimonials Array
```javascript
export const testimonials = [
  { id: 1, name: "John Doe", image: "/images/customer1.jpg", text: "...", rating: 5 },
  // ... more testimonials
];
```

### FAQ Array
```javascript
export const faqs = [
  { id: 1, question: "Do you offer emergency service?", answer: "..." },
  // ... more faqs
];
```

---

## Responsive Design Strategy

### Mobile (< 768px)
- Single column layouts
- Full-width cards and buttons
- Hamburger navigation menu (collapsible)
- Enlarged touch targets (min 44px)
- Before/After slider uses toggle buttons
- Carousel testimonials show 1 at a time
- Font sizes increase slightly for readability

### Tablet (768px - 1024px)
- 2-column grid layouts
- Navigation menu starts showing (optional sidebar or top)
- Balanced spacing

### Desktop (> 1024px)
- 3-column grids
- Full navigation bar visible
- Multi-column layouts
- Hover effects enabled

---

## Animations & Interactions

### Global Animations
1. **Fade-In on Scroll**: Sections fade in as they enter viewport
2. **Slide-Up**: Elements slide up slightly during entrance
3. **Stagger**: Multiple elements animate in sequence (e.g., cards)
4. **Hover Effects**: Cards lift, buttons darken, links underline

### Component-Specific Animations
- **Navigation**: Slide-down menu on mobile, hover color change
- **Hero**: Large entrance animation with delay
- **Transformation Slider**: Smooth drag, image transitions
- **Pricing Cards**: Scale on hover, shadow enhancement
- **Testimonials**: Carousel slide transitions
- **FAQ**: Height transition on expand/collapse
- **Live Badge**: Fade transitions between locations

---

## State Management

### Global State (page.tsx)
- `isBookingModalOpen`: boolean - Controls booking modal visibility
- `activeTestimonialIndex`: number - Current testimonial in carousel
- `mobileMenuOpen`: boolean - Mobile navigation state

### Component State
- **TransformationSlider**: `sliderPosition` (0-100)
- **FAQAccordion**: `expandedId` (tracks which FAQ is open)
- **BookingModal**: Form field values (name, phone, email, etc.)
- **Testimonials**: Carousel index, timer for auto-rotation

---

## CTA Button Placements (Minimum 3)

1. **Navigation Bar**: "Book Service" button (top right / hamburger menu)
2. **Hero Section**: "Get Service Now" primary button + "View Services" secondary
3. **Pricing Cards**: Individual "Get Started" button on each pricing card
4. **Footer**: "Schedule Now" button + contact info
5. **Live Activity Badge**: Optional micro-CTA click to book
6. **Guarantee Section**: "Lock in Your Guarantee" button

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Create Navigation component with mobile menu
- [ ] Create Hero section with static image
- [ ] Set up mock data file (data/mockData.ts)
- [ ] Create layout and page structure

### Phase 2: Core Sections
- [ ] Build TrustBar with counter animations
- [ ] Build BentoGallery with feature cards
- [ ] Build TransformationSlider (before/after)
- [ ] Create mock image pairs for slider

### Phase 3: Social Proof & Engagement
- [ ] Build Testimonials carousel
- [ ] Build FAQAccordion component
- [ ] Create GuaranteeSection
- [ ] Create LiveActivityBadge

### Phase 4: Conversion & Polish
- [ ] Build PricingCards section
- [ ] Create BookingModal/Sheet
- [ ] Create Footer with links
- [ ] Add global animations and transitions
- [ ] Test responsiveness across devices
- [ ] Optimize performance and accessibility

---

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + custom design tokens
- **UI Components**: shadcn/ui
- **Icons**: Lucide React (consistent stroke weight)
- **Animations**: Framer Motion (optional, for smooth transitions)
- **State Management**: React useState
- **Font**: Geist (via Next.js)
- **Images**: Next.js Image component

---

## Accessibility Considerations

- All buttons have clear labels and sufficient contrast (WCAG AA)
- Carousel has keyboard navigation (arrow keys)
- Accordion supports keyboard (Enter/Space to toggle)
- Form fields have associated labels
- Images have descriptive alt text
- Focus states visible on all interactive elements
- Mobile menu accessible via keyboard

---

## Performance Optimizations

- Image lazy loading
- Framer Motion for smooth, GPU-accelerated animations
- Component code splitting
- CSS-in-JS minimization
- Optimize font loading (Geist already optimized in Next.js)

---

## Next Steps

1. Review this plan for any adjustments
2. Approve the overall structure and approach
3. Begin implementation starting with Phase 1 (Foundation)
4. Test mobile responsiveness continuously during development
