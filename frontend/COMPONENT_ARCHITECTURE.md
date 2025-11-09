# Component Architecture - Visual Reference

Visual map of the luxury form component structure and data flow.

---

## Component Hierarchy

```
LuxurySubmissionForm (Main Container)
│
├─► StepIndicator
│   └─► Progress visualization
│       ├─► Circles (completed/active/upcoming)
│       ├─► Progress bar
│       └─► Step labels
│
├─► Step 1: VIN Entry
│   ├─► VIN input field
│   ├─► Trust indicators (3 badges)
│   └─► Continue button
│       └─► Triggers VIN decode API
│
├─► Step 2: Vehicle Details
│   ├─► VehiclePreviewCard
│   │   ├─► Brand badge (luxury/performance)
│   │   ├─► Year/Make/Model display
│   │   └─► Verification indicator
│   │
│   ├─► Form fields
│   │   ├─► Mileage input
│   │   ├─► Condition select
│   │   └─► Notes textarea
│   │
│   ├─► ValueEstimateDisplay (conditional)
│   │   ├─► Three-tier pricing
│   │   ├─► Confidence badge
│   │   ├─► Range visualization
│   │   └─► Educational content
│   │
│   └─► Navigation buttons
│       ├─► Back button
│       └─► Continue button
│
├─► Step 3: Photography
│   ├─► PremiumMediaUpload
│   │   ├─► Photography guide (collapsible)
│   │   │   ├─► Do's and Don'ts
│   │   │   └─► Pro tips
│   │   │
│   │   ├─► Upload zone
│   │   │   ├─► Drag & drop area
│   │   │   └─► File picker trigger
│   │   │
│   │   ├─► File assignment interface
│   │   │   ├─► Image previews
│   │   │   ├─► Category dropdowns
│   │   │   └─► Remove buttons
│   │   │
│   │   └─► Progress tracker
│   │       ├─► Progress bar
│   │       ├─► Category checklist
│   │       └─► Video status
│   │
│   └─► Navigation buttons
│       ├─► Back button
│       └─► Continue button
│
├─► Step 4: Contact Information
│   ├─► Form fields
│   │   ├─► Name input
│   │   ├─► Email input
│   │   └─► Phone input
│   │
│   ├─► Privacy assurance card
│   │   ├─► Shield icon
│   │   └─► Guarantee message
│   │
│   └─► Navigation buttons
│       ├─► Back button
│       └─► Submit button
│           └─► Triggers submission + upload APIs
│
├─► Step 5: Success
│   └─► LuxurySuccessModal
│       ├─► Success icon (animated)
│       ├─► Ticket number (copy to clipboard)
│       ├─► Vehicle info card
│       ├─► Timeline (4 steps)
│       ├─► Contact options
│       │   ├─► Email badge
│       │   └─► SMS badge
│       ├─► Concierge contact
│       │   ├─► Phone button
│       │   └─► Email button
│       ├─► Social sharing
│       │   ├─► Copy link
│       │   └─► Share on X
│       └─► Submit another button
│
└─► Concierge Button (floating)
    └─► Concierge Modal
        ├─► Close button
        ├─► Service description
        ├─► Phone button
        ├─► Email button
        └─► Available hours
```

---

## Data Flow

```
User Actions → Component State → API Calls → Backend
     │              │                │           │
     │              │                │           └─► Database
     │              │                │
     │              │                └─► Response
     │              │                      │
     │              └──────────────────────┘
     │                       │
     └───────────────────────┴─► UI Updates
```

### Detailed Data Flow

**1. VIN Entry Flow**
```
User enters VIN
   ↓
setValue('vin', value.toUpperCase())
   ↓
User clicks "Continue"
   ↓
handleVINDecode()
   ↓
decodeVIN(vin) API call
   ↓
Response: { year, make, model, trim }
   ↓
setVehicleInfo(response.data)
   ↓
setStep(2) with 600ms delay
   ↓
VehiclePreviewCard renders
```

**2. Details Submission Flow**
```
User fills mileage + condition
   ↓
watch() triggers value updates
   ↓
getEstimatedValue() calculates
   ↓
ValueEstimateDisplay renders
   ↓
User clicks "Continue"
   ↓
onSubmitDetails()
   ↓
setStep(4) [Skip to contact, photos later]
```

**3. Photo Upload Flow**
```
User drag-drops files
   ↓
handleBulkDrop()
   ↓
Create preview URLs
   ↓
setUploadedFiles([...files])
   ↓
User assigns categories
   ↓
assignFile(index, category)
   ↓
setMediaFiles({ [category]: file })
   ↓
Progress tracker updates
```

**4. Final Submission Flow**
```
User fills contact info
   ↓
User clicks "Submit"
   ↓
onSubmitFinal()
   ↓
createSubmission() mutation
   ↓
Response: { submissionId, ticketNumber }
   ↓
setSubmissionId + setTicketNumber
   ↓
setStep(3) [Back to photos for upload]
   ↓
User clicks "Continue"
   ↓
handleMediaSubmit()
   ↓
uploadMedia(submissionId, formData)
   ↓
setStep(5) [Success]
   ↓
LuxurySuccessModal renders
```

---

## State Management

### Component State (useState)

```typescript
// LuxurySubmissionForm.tsx

const [step, setStep] = useState<number>(1);
// Current step: 1-5

const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
// Decoded VIN data: { year, make, model, trim }

const [submissionId, setSubmissionId] = useState<string | null>(null);
// Backend-generated submission ID

const [ticketNumber, setTicketNumber] = useState<string | null>(null);
// User-facing ticket number

const [isDecodingVIN, setIsDecodingVIN] = useState<boolean>(false);
// Loading state for VIN decode

const [vinError, setVinError] = useState<string | null>(null);
// VIN validation error message

const [mediaFiles, setMediaFiles] = useState<Record<string, File>>({});
// Uploaded photos: { front: File, rear: File, ... }

const [showConcierge, setShowConcierge] = useState<boolean>(false);
// Concierge modal visibility
```

### Form State (react-hook-form)

```typescript
const {
  register,      // Register input fields
  handleSubmit,  // Handle form submission
  formState: { errors },  // Validation errors
  getValues,     // Get current values
  setValue,      // Set field value programmatically
  watch,         // Watch field changes
} = useForm<SubmissionFormData>();

// Form fields:
// - vin: string
// - mileage: number
// - condition: string
// - email: string
// - phone: string
// - name: string
// - notes?: string
```

### Server State (TanStack Query)

```typescript
// Mutation for submission creation
const submissionMutation = useMutation({
  mutationFn: createSubmission,
  onSuccess: (data) => {
    setSubmissionId(data.submissionId);
    setTicketNumber(data.ticketNumber);
    setStep(3);
  },
  onError: (error) => {
    console.error('Submission error:', error);
  },
});

// Mutation for media upload
const mediaMutation = useMutation({
  mutationFn: ({ id, formData }) => uploadMedia(id, formData),
  onSuccess: () => {
    setStep(5);
  },
});
```

---

## Props Interface Reference

### StepIndicator

```typescript
interface Step {
  number: number;    // 1-5
  title: string;     // "VIN Entry"
  subtitle: string;  // "Vehicle Identification"
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}
```

### VehiclePreviewCard

```typescript
interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
}

interface VehiclePreviewCardProps {
  vehicleInfo: VehicleInfo;
}
```

### ValueEstimateDisplay

```typescript
interface ValueEstimate {
  low: number;       // Conservative estimate
  high: number;      // Optimistic estimate
  confidence: 'high' | 'medium' | 'low';
}

interface ValueEstimateDisplayProps {
  estimate: ValueEstimate | null;
}
```

### PremiumMediaUpload

```typescript
interface MediaUploadProps {
  mediaFiles: Record<string, File>;
  setMediaFiles: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  requiredPhotos: string[];  // ['front', 'rear', ...]
}
```

### LuxurySuccessModal

```typescript
interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
}

interface LuxurySuccessModalProps {
  ticketNumber: string;
  vehicleInfo: VehicleInfo | null;
}
```

---

## API Integration Points

### 1. VIN Decode

**Endpoint:** `POST /api/decode-vin`

**Request:**
```json
{
  "vin": "1HGBH41JXMN109186"
}
```

**Response:**
```json
{
  "data": {
    "year": 2022,
    "make": "Ford",
    "model": "F-150 Raptor R",
    "trim": "SuperCrew"
  }
}
```

**Used in:** Step 1 (VIN Entry)

---

### 2. Create Submission

**Endpoint:** `POST /api/submissions`

**Request:**
```json
{
  "vin": "1HGBH41JXMN109186",
  "mileage": 15000,
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "submissionId": "sub_abc123xyz",
  "ticketNumber": "DT-2024-001234"
}
```

**Used in:** Step 4 (Contact Info submission)

---

### 3. Upload Media

**Endpoint:** `POST /api/submissions/:id/media`

**Request:** `multipart/form-data`
```
front: File
rear: File
driver_side: File
passenger_side: File
steering_wheel: File
front_seat: File
back_seat: File
video: File (optional)
```

**Response:**
```json
{
  "success": true
}
```

**Used in:** After Step 4, before Step 5

---

## Event Flow Diagram

```
Page Load
    │
    ▼
LuxurySubmissionForm Mounted
    │
    ├─► StepIndicator renders (step 1)
    │
    └─► Step 1 Content renders
            │
            ▼
        User enters VIN
            │
            ▼
        Clicks "Continue"
            │
            ▼
        Loading state (setIsDecodingVIN)
            │
            ▼
        API: decodeVIN()
            │
            ├─► Success
            │   ├─► setVehicleInfo()
            │   └─► setStep(2) after 600ms
            │
            └─► Error
                └─► setVinError()
                    └─► Show error message

Step 2 Renders
    │
    ├─► VehiclePreviewCard
    │
    ├─► Form fields
    │
    └─► Watch mileage + condition
            │
            ▼
        Values change
            │
            ▼
        getEstimatedValue() recalculates
            │
            ▼
        ValueEstimateDisplay updates
            │
            ▼
        User clicks "Continue"
            │
            ▼
        setStep(4) [Skip photos for now]

Step 4 Renders
    │
    ├─► Contact form
    │
    └─► Privacy assurance
            │
            ▼
        User fills info
            │
            ▼
        Clicks "Submit"
            │
            ▼
        Loading state (isPending)
            │
            ▼
        API: createSubmission()
            │
            ├─► Success
            │   ├─► setSubmissionId()
            │   ├─► setTicketNumber()
            │   └─► setStep(3) [Now upload photos]
            │
            └─► Error
                └─► Show error banner

Step 3 Renders
    │
    └─► PremiumMediaUpload
            │
            ▼
        User uploads photos
            │
            ▼
        Assigns categories
            │
            ▼
        All required uploaded
            │
            ▼
        Clicks "Continue"
            │
            ▼
        Loading state (isPending)
            │
            ▼
        API: uploadMedia()
            │
            ├─► Success
            │   └─► setStep(5)
            │
            └─► Error
                └─► Show error message

Step 5 Renders
    │
    └─► LuxurySuccessModal
            │
            ├─► Animated success icon
            ├─► Display ticketNumber
            ├─► Show timeline
            └─► Contact options
```

---

## Responsive Behavior

### Mobile (< 640px)

```
LuxurySubmissionForm
│
├─► max-w-full (full width)
├─► p-4 (reduced padding)
│
├─► StepIndicator
│   ├─► Smaller circles (w-12 h-12 → w-10 h-10)
│   └─► Hide subtitles
│
├─► luxury-card
│   └─► p-6 (instead of p-10)
│
└─► Form fields
    └─► Stack vertically (grid-cols-1)
```

### Tablet (640px - 1024px)

```
LuxurySubmissionForm
│
├─► max-w-4xl (limited width)
├─► p-6 (medium padding)
│
├─► StepIndicator
│   ├─► Standard circles (w-16 h-16)
│   └─► Show subtitles
│
└─► Form fields
    └─► 2-column grid where appropriate
```

### Desktop (> 1024px)

```
LuxurySubmissionForm
│
├─► max-w-5xl (comfortable width)
├─► p-8 (full padding)
│
├─► StepIndicator
│   ├─► Full size (w-16 h-16)
│   └─► Show all details
│
└─► Form fields
    └─► Optimal multi-column layouts
```

---

## Styling Cascade

### CSS Class Priority

```
Global Styles (index.css)
    │
    ├─► CSS Variables
    │   └─► --luxury-charcoal, --luxury-gold, etc.
    │
    ├─► Base Styles (@layer base)
    │   ├─► body: font-family, colors
    │   └─► headings: font-family
    │
    ├─► Component Classes (@layer components)
    │   ├─► .luxury-card
    │   ├─► .luxury-button-primary
    │   ├─► .luxury-button-secondary
    │   ├─► .luxury-input
    │   └─► .luxury-label
    │
    └─► Utility Classes (@layer utilities)
        ├─► .bg-luxury-charcoal
        ├─► .text-luxury-platinum
        ├─► .animate-fade-in
        └─► etc.

Component Inline Classes (Tailwind)
    │
    └─► Utility-first approach
        ├─► Layout: flex, grid, space-y-6
        ├─► Sizing: w-full, h-16, max-w-4xl
        ├─► Colors: bg-luxury-gold, text-luxury-platinum
        ├─► Effects: shadow-2xl, backdrop-blur-sm
        └─► Responsive: md:p-10, sm:grid-cols-2
```

---

## Performance Optimizations

### Component Level

```typescript
// Memoization for expensive calculations
const estimatedValue = useMemo(() => {
  return getEstimatedValue();
}, [vehicleInfo, watchedMileage, watchedCondition]);

// Callback memoization
const handleVINDecode = useCallback(async () => {
  // ... VIN decode logic
}, [getValues]);

// Debounced inputs (if needed)
const debouncedMileage = useDebounce(watchedMileage, 300);
```

### Asset Loading

```typescript
// Lazy loading images
<img
  src={vehicleImage}
  loading="lazy"
  alt="Vehicle"
/>

// Preload critical assets
<link rel="preload" href="/fonts/inter-400.woff2" as="font" />

// Code splitting (if needed)
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Animation Performance

```css
/* Use transform and opacity (GPU accelerated) */
.animate-fade-in {
  animation: fade-in 0.5s ease;
}

/* Avoid animating layout properties */
/* ✓ Good: transform, opacity */
/* ✗ Bad: width, height, margin */

/* Use will-change for complex animations */
.luxury-card:hover {
  will-change: transform, box-shadow;
}
```

---

## Error Boundaries

### Recommended Implementation

```typescript
// ErrorBoundary.tsx
class LuxuryFormErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Form error:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="luxury-card text-center">
          <h2>Something went wrong</h2>
          <p>Please refresh and try again</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<LuxuryFormErrorBoundary>
  <LuxurySubmissionForm />
</LuxuryFormErrorBoundary>
```

---

## Testing Strategy

### Unit Tests

```typescript
// StepIndicator.test.tsx
describe('StepIndicator', () => {
  it('renders all steps', () => {
    const steps = [/* ... */];
    render(<StepIndicator steps={steps} currentStep={1} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('highlights current step', () => {
    render(<StepIndicator steps={steps} currentStep={2} />);
    const activeStep = screen.getByText('Details');
    expect(activeStep).toHaveClass('text-luxury-platinum');
  });
});
```

### Integration Tests

```typescript
// LuxurySubmissionForm.test.tsx
describe('Form Flow', () => {
  it('completes full submission', async () => {
    render(<LuxurySubmissionForm />);

    // Step 1: VIN
    const vinInput = screen.getByPlaceholderText(/1HGBH41/);
    fireEvent.change(vinInput, { target: { value: 'TESTVIN123456789' } });
    fireEvent.click(screen.getByText('Continue'));

    // Wait for decode
    await waitFor(() => {
      expect(screen.getByText('Vehicle Details')).toBeInTheDocument();
    });

    // Step 2: Details
    // ... continue testing flow
  });
});
```

### E2E Tests (Cypress/Playwright)

```typescript
// luxury-form.spec.ts
describe('Luxury Form E2E', () => {
  it('submits vehicle successfully', () => {
    cy.visit('/');

    // VIN Entry
    cy.get('[placeholder*="1HGBH41"]').type('TESTVIN123456789');
    cy.contains('Continue').click();

    // Vehicle Details
    cy.get('[placeholder*="50000"]').type('25000');
    cy.get('select').select('excellent');
    cy.contains('Continue').click();

    // ... continue through all steps
  });
});
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All components render correctly
- [ ] API integrations tested
- [ ] Form validation works
- [ ] Error states handled
- [ ] Success flow complete
- [ ] Mobile responsive verified
- [ ] Accessibility tested
- [ ] Performance optimized
- [ ] Browser compatibility checked
- [ ] Documentation reviewed

### Deployment

- [ ] Environment variables set
- [ ] API endpoints configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring active
- [ ] Staging deployment successful
- [ ] Production deployment ready
- [ ] Rollback plan prepared
- [ ] Team notified

### Post-Deployment

- [ ] Monitor error rates
- [ ] Track completion rates
- [ ] Collect user feedback
- [ ] Review analytics
- [ ] Plan iterations

---

## Quick Reference

### File Locations

```
Components:       /frontend/src/components/
Styles:           /frontend/src/index.css
API Functions:    /frontend/src/lib/api.ts
Documentation:    /frontend/*.md
```

### Key Commands

```bash
npm run dev       # Start development
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Check errors
```

### Important Classes

```css
.luxury-card                 # Premium card container
.luxury-button-primary       # Gold CTA button
.luxury-button-secondary     # Charcoal button
.luxury-input                # Form input
.luxury-label                # Input label
.animate-fade-in             # Fade animation
```

---

*Reference this diagram when implementing or debugging the luxury form.*
