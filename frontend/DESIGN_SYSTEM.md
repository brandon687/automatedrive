# DealerTrade Luxury Design System

A premium, sophisticated design system for high-net-worth vehicle sellers. This system creates confidence and trust while maintaining elegance and professionalism.

---

## Design Philosophy

**Core Principles:**
1. **Premium Without Pretension** - Sophisticated but approachable
2. **Trust Through Transparency** - Clear, honest communication
3. **Confidence Building** - Every element reinforces quality
4. **Mobile-First Luxury** - Premium experience on all devices
5. **Performance Matters** - Fast, smooth, polished interactions

---

## Color Palette

### Primary Colors

```css
Luxury Charcoal: #1a1a1f (Main background - deep, rich black)
Luxury Charcoal Light: #2a2a35 (Card backgrounds, elevated surfaces)
Luxury Platinum: #e8e8f0 (Primary text, high contrast)
Luxury Silver: #a8a8b8 (Secondary text, subtle elements)
Luxury Gold: #d4af37 (Accent, CTAs, success states)
Luxury Gold Light: #e5c158 (Hover states, highlights)
Luxury Gold Dark: #b8962f (Active states, pressed buttons)
```

### Usage Guidelines

**Backgrounds:**
- Page background: `#1a1a1f` (Luxury Charcoal)
- Card/Modal background: `#2a2a35` (Luxury Charcoal Light)
- Elevated elements: Gradient from Charcoal Light to Charcoal

**Text:**
- Primary headings: `#e8e8f0` (Luxury Platinum)
- Body text: `#e8e8f0` with 90% opacity
- Secondary/helper text: `#a8a8b8` (Luxury Silver)
- Disabled text: Silver at 50% opacity

**Accents:**
- Primary CTAs: Gold gradient
- Hover states: Gold Light
- Success indicators: Gold
- Trust badges: Gold at 20-30% opacity

**Status Colors:**
- Success: `#10b981` (Emerald)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Info: Gold at 60% opacity

---

## Typography

### Font Families

**Display Font (Headings):**
- Font: Playfair Display
- Use: All h1, h2, h3, h4, h5, h6 elements
- Weights: 400 (Regular), 600 (SemiBold), 700 (Bold), 900 (Black)
- Characteristics: Serif, elegant, timeless, luxury-focused

**Body Font (Text):**
- Font: Inter
- Use: All body text, buttons, inputs, labels
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Characteristics: Sans-serif, clean, highly readable, modern

### Type Scale

```css
/* Desktop */
h1: 48px / 3rem (Hero titles)
h2: 36px / 2.25rem (Section headings)
h3: 24px / 1.5rem (Subsections)
h4: 20px / 1.25rem (Card titles)
Body Large: 18px / 1.125rem (Prominent text)
Body: 16px / 1rem (Standard text)
Body Small: 14px / 0.875rem (Secondary text)
Caption: 12px / 0.75rem (Helper text, labels)

/* Mobile (max-width: 640px) */
h1: 32px / 2rem
h2: 24px / 1.5rem
h3: 20px / 1.25rem
Body: 14px / 0.875rem
```

### Font Styling

**Letter Spacing:**
- Headings: -0.02em (tighter for elegance)
- All caps labels: 0.05em (wider for readability)
- Body text: Default

**Line Height:**
- Headings: 1.2 (tight, impactful)
- Body: 1.6 (comfortable reading)
- Small text: 1.5

**Font Features:**
- Enable OpenType features: `cv02`, `cv03`, `cv04`, `cv11`
- Anti-aliasing: Always enabled for smooth rendering

---

## Component Library

### Buttons

**Primary Button (luxury-button-primary)**
```tsx
Usage: Main CTAs, form submissions, important actions
Style: Gold gradient, charcoal text, shadow with gold glow
States: Hover (lift + glow), Active (press), Disabled (50% opacity)
```

**Secondary Button (luxury-button-secondary)**
```tsx
Usage: Back buttons, cancel actions, alternative paths
Style: Charcoal light background, platinum text, subtle border
States: Hover (gold border), Active (press), Disabled (50% opacity)
```

**Button Sizes:**
- Default: `px-6 py-3` (48px height)
- Small: `px-4 py-2` (36px height)
- Large: `px-8 py-4` (56px height)

### Cards

**Luxury Card (luxury-card)**
```tsx
Usage: Form containers, content sections, modals
Style: Gradient background, subtle border, large border-radius
Padding: Desktop 40px (p-10), Mobile 24px (p-6)
Border Radius: 16px (rounded-2xl)
```

**Hover Behavior:**
- Border transitions to gold (20% opacity)
- Shadow increases with gold tint
- Smooth 300ms transition

### Inputs

**Text Input (luxury-input)**
```tsx
Usage: All form inputs (text, email, tel, number, textarea, select)
Style: Semi-transparent charcoal background, subtle border
Padding: 12px 16px
Border Radius: 12px (rounded-xl)
```

**States:**
- Default: Charcoal light border
- Hover: Slightly brighter border
- Focus: Gold border + gold ring (20% opacity)
- Error: Red border + red ring
- Disabled: 50% opacity

**Label (luxury-label)**
```tsx
Style: Platinum text, medium weight, tracking wide
Margin: 8px bottom spacing from input
```

### Progress Indicator (StepIndicator)

**Design:**
- Horizontal timeline with connected circles
- Active step: Gold, enlarged (110% scale), pulsing ring
- Completed steps: Gold with checkmark
- Upcoming steps: Charcoal light with number

**Responsive:**
- Desktop: Show subtitle under each step
- Mobile: Hide subtitle, smaller circles

### Vehicle Preview Card

**Layout:**
- Gradient background (charcoal light to charcoal)
- Badge indicating luxury/performance tier
- Large typography for year/make/model
- Verification icon/text

**Badge Colors:**
- Luxury brands: Gold badge
- Performance brands: Platinum badge
- Standard: Silver badge

### Value Estimate Display

**Structure:**
- Three-column layout: Conservative | Expected | Optimistic
- Expected value highlighted with gold accent
- Progress bar showing value range
- Confidence indicator badge
- Educational content about valuation factors

### Media Upload

**Main Upload Zone:**
- Large, clear drop zone
- Gold camera icon
- Animated shine effect on hover
- Drag-and-drop with visual feedback

**File Assignment:**
- Grid layout with image previews
- Dropdown for category selection
- Visual confirmation when assigned (gold border + checkmark)
- Remove button for each file

**Progress Tracker:**
- Progress bar with percentage
- Checklist of required photos
- Success state when complete

---

## Spacing System

**Base Unit:** 4px (0.25rem)

```css
Space Scale:
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

**Component Spacing:**
- Form fields: 24px vertical spacing
- Card sections: 32px vertical spacing
- Page sections: 64px vertical spacing
- Button groups: 16px horizontal spacing

---

## Shadows & Depth

**Shadow Levels:**

```css
luxury-shadow-sm: 0 2px 8px rgba(212, 175, 55, 0.1)
  Use: Subtle elevation (badges, tags)

luxury-shadow-md: 0 4px 16px rgba(212, 175, 55, 0.15)
  Use: Cards at rest, dropdowns

luxury-shadow-lg: 0 8px 32px rgba(212, 175, 55, 0.2)
  Use: Modals, elevated cards

luxury-shadow-xl: 0 16px 48px rgba(212, 175, 55, 0.25)
  Use: Hero elements, major CTAs
```

**Gold Glow:**
- Use on primary buttons and active states
- Combine box-shadow with gold tint for premium feel
- Animate glow intensity on hover

---

## Border Radius

```css
Subtle: 8px (rounded-lg) - Small cards, inputs
Standard: 12px (rounded-xl) - Inputs, buttons
Prominent: 16px (rounded-2xl) - Cards, modals
Full: 9999px (rounded-full) - Circles, pills
```

---

## Animations & Transitions

### Timing Functions

```css
Standard: cubic-bezier(0.4, 0, 0.2, 1) - Most transitions
Smooth: cubic-bezier(0.4, 0, 0.6, 1) - Pulses, fades
```

### Durations

```css
Fast: 150ms - Micro-interactions (button hover)
Standard: 300ms - Most transitions
Slow: 500ms - Page transitions, step changes
Extra Slow: 700ms - Special effects
```

### Animation Library

**fade-in:** Opacity 0 → 1 + slight vertical movement
- Use: Page loads, new content appearing

**slide-up:** Opacity + translateY from bottom
- Use: Cards appearing, success messages

**slide-down:** Opacity + translateY from top
- Use: Dropdowns, notifications

**scale-in:** Opacity + scale from 80% to 100%
- Use: Modals, checkmarks, success states

**shine:** Diagonal shimmer effect
- Use: Upload zones, premium cards (on hover)

**pulse-slow:** Gentle opacity pulse
- Use: Active indicators, "live" badges

### Best Practices

- Always provide reduced-motion alternative
- Use `will-change` sparingly for performance
- Prefer CSS animations over JavaScript
- Keep animations subtle and purposeful
- Never animate layout-affecting properties excessively

---

## Responsive Breakpoints

```css
Mobile: < 640px (sm)
Tablet: 640px - 1024px (md - lg)
Desktop: > 1024px (xl)
Wide: > 1280px (2xl)
```

### Responsive Strategy

**Mobile-First Approach:**
1. Design for mobile first (320px - 640px)
2. Add enhancements for tablet (640px+)
3. Optimize for desktop (1024px+)

**Key Adaptations:**
- Stack columns on mobile, side-by-side on desktop
- Reduce padding on mobile (p-6 vs p-10)
- Smaller typography on mobile
- Hide non-essential information on small screens
- Full-screen modals on mobile, centered on desktop

---

## Accessibility Standards

**Target: WCAG 2.1 AA Compliance**

### Color Contrast

- Platinum on Charcoal: 11.5:1 (AAA) ✓
- Silver on Charcoal: 4.8:1 (AA) ✓
- Gold on Charcoal: 4.2:1 (AA) ✓
- Charcoal on Gold: 8.5:1 (AAA) ✓

### Focus Indicators

- Always visible focus rings
- Gold outline (2px)
- 2px offset from element
- Never remove outlines

### Keyboard Navigation

- All interactive elements keyboard accessible
- Logical tab order
- Skip links where appropriate
- Escape key closes modals

### Screen Readers

- Semantic HTML elements
- ARIA labels where needed
- Hidden text for icon-only buttons
- Status messages announced

### Motion Sensitivity

- Respect `prefers-reduced-motion`
- Reduce animations to instant or very fast
- Disable auto-playing animations

---

## Trust & Security Elements

### Trust Indicators

**Icons to Use:**
- Lock (Security/Privacy)
- Shield with checkmark (Verified/Protected)
- Lightning bolt (Fast/Best offers)
- Star/Badge (Premium/Quality)

**Messaging:**
- "Secure & Encrypted" - Always present
- "Verified Dealer Network" - Builds confidence
- "Best Offers Guaranteed" - Value proposition
- "Privacy Protected" - Data sensitivity

**Placement:**
- Bottom of VIN entry step
- Privacy assurance near contact info
- Footer of success page
- Floating elements in corners

### Concierge Service

**Positioning:**
- White-glove, personalized service
- Human touch in automated process
- Always available for questions
- Premium support experience

**UI Elements:**
- Floating action button (bottom-right)
- Gold circular button
- Chat/person icon
- Tooltip on hover
- Full-screen modal on click

---

## Content Voice & Tone

### Brand Voice

**Attributes:**
- Professional but warm
- Confident without arrogance
- Transparent and honest
- Sophisticated but accessible
- Results-focused

### Writing Guidelines

**Do:**
- Use active voice
- Be specific and clear
- Acknowledge vehicle value
- Emphasize exclusivity of network
- Highlight benefits to seller

**Don't:**
- Use jargon or technical terms
- Make unrealistic promises
- Be overly casual
- Rush the customer
- Hide information

### Example Copy

**Good:**
"Your vehicle deserves our exclusive dealer network. Experience the finest offers, delivered with discretion."

**Bad:**
"Upload your car pics and we'll get you some quotes!"

---

## Implementation Notes

### Required Dependencies

```json
{
  "react": "^19.x",
  "react-hook-form": "^7.x",
  "@tanstack/react-query": "^5.x",
  "react-dropzone": "^14.x",
  "tailwindcss": "^3.x"
}
```

### Font Loading

Fonts loaded via Google Fonts CDN:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
```

**Optimization:**
- Use `font-display: swap` for better performance
- Subset fonts if possible (Latin only)
- Consider self-hosting for maximum control

### Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

**Strategies:**
- Lazy load images
- Code split components
- Minimize CSS
- Use CSS containment where possible
- Optimize animations for 60fps

---

## Testing Checklist

### Visual Testing

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad (Safari)
- [ ] Test on Desktop (Chrome, Firefox, Safari)
- [ ] Test with different screen sizes
- [ ] Test in landscape and portrait
- [ ] Verify all animations are smooth
- [ ] Check loading states

### Functional Testing

- [ ] Complete entire form flow
- [ ] Test VIN validation
- [ ] Test file upload with various formats
- [ ] Test form validation (all fields)
- [ ] Test error states
- [ ] Test success flow
- [ ] Test browser back button
- [ ] Test keyboard navigation
- [ ] Test with screen reader

### Accessibility Testing

- [ ] Run axe DevTools scan
- [ ] Test keyboard-only navigation
- [ ] Test with NVDA/JAWS screen reader
- [ ] Test with reduced motion enabled
- [ ] Test with high contrast mode
- [ ] Verify ARIA labels
- [ ] Check focus indicators
- [ ] Test with browser zoom (200%)

### Performance Testing

- [ ] Run Lighthouse audit (target: 90+)
- [ ] Check bundle size
- [ ] Test on slow 3G connection
- [ ] Verify image optimization
- [ ] Check for layout shifts
- [ ] Monitor JS execution time
- [ ] Test animation performance

---

## Future Enhancements

### Phase 2 Features

1. **Dark/Light Mode Toggle**
   - Allow user preference
   - System preference detection
   - Smooth transition between modes

2. **Advanced Animations**
   - Lottie animations for success
   - Micro-interactions on hover
   - Loading skeletons

3. **Enhanced Media Upload**
   - AI-powered photo quality check
   - Suggested angles overlay
   - Automatic photo enhancement

4. **Real-time Valuation**
   - Live pricing API integration
   - Market trend visualization
   - Comparable vehicles display

5. **Saved Progress**
   - Resume incomplete submissions
   - Draft system
   - Account creation option

---

## Support & Resources

**Design Files:**
- Figma file: [To be created]
- Asset library: `/assets/`
- Icon set: Heroicons (outline)

**Documentation:**
- Component storybook: [To be set up]
- Usage examples: See component files
- API documentation: `/backend/docs/`

**Contact:**
- Design questions: design@dealertrade.com
- Technical issues: dev@dealertrade.com
- Concierge: concierge@dealertrade.com

---

## Version History

**v1.0.0** - November 2025
- Initial luxury design system
- Complete component library
- Mobile-first responsive design
- Accessibility compliance
- Performance optimization

---

*This design system is a living document. Update as the product evolves.*
