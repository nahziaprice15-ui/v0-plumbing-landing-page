---
name: Website Enhancement Plan
overview: Comprehensive review and improvement plan for the MS & P LLC plumbing landing page covering SEO, performance, accessibility, UX, and technical enhancements.
todos:
  - id: seo-metadata
    content: Add Open Graph, Twitter Cards, and enhanced metadata to layout.tsx
    status: pending
  - id: structured-data
    content: Implement JSON-LD structured data for LocalBusiness schema in page.tsx
    status: pending
  - id: robots-sitemap
    content: Create robots.ts and sitemap.ts files for SEO
    status: pending
  - id: image-optimization
    content: Enable Next.js image optimization in next.config.mjs
    status: pending
  - id: form-submission
    content: Replace console.log with proper form submission handler and API route
    status: pending
  - id: form-validation
    content: Add comprehensive form validation using react-hook-form and Zod
    status: pending
  - id: accessibility-focus
    content: Add focus trap and ARIA live regions to BookingModal
    status: pending
  - id: phone-links
    content: "Ensure all phone numbers are properly formatted as clickable tel: links"
    status: pending
  - id: remove-console
    content: Remove console.log and clean up production code
    status: pending
  - id: loading-states
    content: Add loading states and error handling throughout the application
    status: pending
isProject: false
---

# Website Enhancement Plan

## Overview

This plan outlines improvements for the MS & P LLC plumbing landing page across SEO, performance, accessibility, user experience, and technical areas.

## Current State Analysis

**Strengths:**

- Modern Next.js 16 with React 19
- Comprehensive component structure
- Good use of Radix UI components
- Responsive design with Tailwind CSS
- Vercel Analytics integrated

**Areas for Improvement:**

- SEO metadata and structured data
- Image optimization (currently disabled)
- Form submission handling (console.log placeholder)
- Missing robots.txt and sitemap
- Accessibility enhancements needed
- Performance optimizations

## Improvement Categories

### 1. SEO Enhancements

**Files to modify:**

- `app/layout.tsx` - Add Open Graph, Twitter Cards, and additional metadata
- `app/robots.ts` - Create robots.txt file
- `app/sitemap.ts` - Create dynamic sitemap
- `app/page.tsx` - Add structured data (JSON-LD) for LocalBusiness schema

**Improvements:**

- Add Open Graph meta tags for social sharing
- Add Twitter Card meta tags
- Implement JSON-LD structured data for LocalBusiness (plumbing service)
- Create robots.txt to guide search engine crawlers
- Generate dynamic sitemap.xml
- Add canonical URLs
- Enhance meta descriptions with location-specific keywords
- Add FAQPage structured data schema

### 2. Performance Optimizations

**Files to modify:**

- `next.config.mjs` - Enable image optimization
- `components/Hero.tsx` - Add priority and loading strategies
- `components/BeforeAfterSlider.tsx` - Implement lazy loading for images
- `components/Testimonials.tsx` - Optimize image loading

**Improvements:**

- Enable Next.js Image Optimization (currently `unoptimized: true`)
- Add `loading="lazy"` for below-the-fold images
- Implement image preloading for critical hero image
- Add `fetchPriority="high"` for LCP image
- Consider adding WebP format support
- Implement font display optimization

### 3. Accessibility (A11y) Enhancements

**Files to modify:**

- `components/BookingModal.tsx` - Add focus trap and ARIA live regions
- `components/Navigation.tsx` - Improve keyboard navigation
- `components/LiveBadge.tsx` - Add ARIA announcements
- `app/page.tsx` - Add skip-to-content link

**Improvements:**

- Add focus trap to modal dialogs
- Implement ARIA live regions for dynamic content updates
- Add skip-to-content link for keyboard users
- Ensure all interactive elements are keyboard accessible
- Add proper focus management when modal opens/closes
- Add ARIA labels for icon-only buttons
- Ensure color contrast meets WCAG AA standards
- Add loading states with ARIA announcements

### 4. User Experience Improvements

**Files to modify:**

- `components/BookingModal.tsx` - Add form validation, error handling, and success states
- `components/Navigation.tsx` - Add smooth scroll behavior
- `components/Footer.tsx` - Format phone number as clickable link
- `components/Hero.tsx` - Add loading skeleton for hero image

**Improvements:**

- Implement proper form validation with react-hook-form (already installed)
- Add client-side validation feedback
- Create success/error states for form submission
- Add loading spinner during form submission
- Implement smooth scroll for anchor links
- Format phone numbers consistently as clickable `tel:` links
- Add loading skeletons for images
- Add error boundaries for better error handling
- Implement toast notifications for form submissions

### 5. Technical Improvements

**Files to modify:**

- `components/BookingModal.tsx` - Remove console.log, implement actual form submission
- `next.config.mjs` - Remove TypeScript ignoreBuildErrors
- `components/Footer.tsx` - Fix placeholder social media links
- `components/BeforeAfterSlider.tsx` - Use actual before/after images

**Improvements:**

- Remove `console.log` from production code
- Implement form submission handler (API route or form service)
- Remove `ignoreBuildErrors: true` from Next.js config
- Replace placeholder social media links with actual URLs or remove
- Add proper error handling for form submissions
- Add TypeScript strict mode compliance
- Implement proper image fallbacks

### 6. Content & Conversion Optimizations

**Files to modify:**

- `components/Footer.tsx` - Make phone number more prominent
- `components/Hero.tsx` - Add urgency indicators
- `components/Pricing.tsx` - Add comparison table or calculator
- `components/Testimonials.tsx` - Add review source attribution

**Improvements:**

- Make phone number more prominent in header (sticky CTA)
- Add real-time availability indicator
- Add service area map or visual representation
- Implement review aggregation from multiple sources
- Add trust badges (BBB, Angi, etc.)
- Add estimated response time display
- Create service-specific landing pages for better SEO

### 7. Additional Features

**New files to create:**

- `app/api/booking/route.ts` - API endpoint for form submissions
- `app/robots.ts` - Robots.txt generation
- `app/sitemap.ts` - Dynamic sitemap generation
- `lib/validations.ts` - Form validation schemas using Zod
- `components/PhoneButton.tsx` - Reusable click-to-call component

**Improvements:**

- Create API route for booking form submissions
- Add email notification system for new bookings
- Implement form data persistence (localStorage draft)
- Add Google Maps integration for service areas
- Create service area selector component
- Add chat widget integration option
- Implement A/B testing framework for CTAs

## Implementation Priority

**High Priority:**

1. SEO enhancements (structured data, meta tags)
2. Form submission handling (remove console.log, add API route)
3. Image optimization enablement
4. Accessibility improvements (focus management, ARIA)

**Medium Priority:**
5. Performance optimizations (lazy loading, preloading)
6. UX improvements (form validation, error handling)
7. Content enhancements (phone number formatting, trust badges)

**Low Priority:**
8. Additional features (maps, chat widget, A/B testing)

## Technical Considerations

- All changes maintain existing design system
- Ensure mobile responsiveness is preserved
- Test all form validations thoroughly
- Verify SEO changes with Google Search Console
- Run Lighthouse audits before/after changes
- Ensure WCAG 2.1 AA compliance
- Test with screen readers (NVDA/JAWS)

## Success Metrics

- Lighthouse Performance score > 90
- Lighthouse Accessibility score > 95
- Lighthouse SEO score > 95
- Form submission success rate > 95%
- Page load time < 2 seconds
- Time to Interactive < 3 seconds

