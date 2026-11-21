# WedPlan — Agent Context & Project Specification

## 1. Project Overview
**WedPlan** is a full-stack, role-based wedding planning marketplace connecting **Customers** (planning events) with **Vendors** (offering wedding services). Vendors operate under a freemium model (Free vs. Premium subscription via Stripe), while **Admins** moderate services, manage users, and audit platform transactions.

- **Repository Architecture:** Strictly separated into two repositories (`client` and `server`).
- **Commit Requirements:** Minimum 20 meaningful client commits and 12 meaningful server commits. Never push `.env` files.

---

## 2. Technology Stack
### Client (`client` repo)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript / JavaScript
- **UI & Styling:** ShadCN UI / HeroUI, Tailwind CSS
- **Animations:** Framer Motion / Motion
- **Notifications:** Toast notifications (strictly avoid native browser `alert()`)

### Server (`server` repo)
- **Runtime & Framework:** Node.js + Express.js
- **Database:** MongoDB (via Mongoose or native MongoDB driver)
- **Authentication:** Better Auth (Credential + Google OAuth) + JWT verification middleware on Express
- **Payments:** Stripe Checkout (Test Mode) & Stripe Webhooks
- **Image Hosting:** ImgBB API

---

## 3. Database Architecture (MongoDB)
Better Auth manages its internal auth tables/collections, extending the `users` collection. Beyond auth, **only three business collections** should be created with proper ObjectId/String references:

### `users` (Managed & Extended via Better Auth)
- `_id`: ObjectId / String
- `name`: String
- `email`: String (Unique)
- `image`: String (ImgBB URL)
- `role`: Enum `["customer", "vendor", "admin"]` (Default: `"customer"`; `"admin"` cannot be selected at public signup)
- `isBlocked`: Boolean (Default: `false`)
- `businessName`: String (Vendor-specific)
- `subscriptionPlan`: Enum `["free", "premium"]` (Default: `"free"`)
- `subscriptionExpiresAt`: Date | Null

### `services`
- `_id`: ObjectId
- `vendorId`: Reference -> `users._id`
- `serviceName`: String
- `category`: Enum `["Photography & Videography", "Wedding Venues", "Decoration & Florist", "Catering Services", "Makeup & Styling", "Wedding Fashion"]`
- `description`: String
- `price`: Number
- `location`: String
- `images`: Array of Strings (ImgBB URLs)
- `status`: Enum `["pending", "approved", "rejected", "inactive"]` (Default: `"pending"`)
- `createdAt`: Date

### `bookings`
- `_id`: ObjectId
- `serviceId`: Reference -> `services._id`
- `vendorId`: Reference -> `users._id`
- `customerId`: Reference -> `users._id`
- `eventDate`: Date
- `eventLocation`: String
- `message`: String
- `status`: Enum `["pending", "accepted", "rejected", "cancelled"]` (Default: `"pending"`)
- `createdAt`: Date

### `transactions`
- `_id`: ObjectId
- `vendorId`: Reference -> `users._id`
- `plan`: String (e.g., `"premium"`)
- `amount`: Number
- `currency`: String
- `stripeSessionId`: String
- `stripeSubscriptionId`: String
- `status`: Enum `["pending", "completed", "failed"]`
- `createdAt`: Date

---

## 4. Authentication, Authorization & Security Rules
Agents must enforce these strict security boundaries across frontend and backend:

1. **Authentication Flow:**
   - Implemented via **Better Auth** supporting Email/Password (min 6 chars, 1 uppercase, 1 lowercase) and Google OAuth.
   - Public registration only allows selecting `customer` or `vendor`. Admin accounts are seeded/assigned directly in the database.
   - Express backend must verify JWTs via dedicated auth middleware (`401 Unauthorized` for missing/invalid/expired tokens).
2. **Role-Based Access Control (RBAC):**
   - Implement Express middleware for `verifyAdmin`, `verifyVendor`, and `verifyCustomer` (`403 Forbidden` on role mismatch).
   - **Blocked Users:** If `user.isBlocked === true`, deny access to all protected routes and features.
   - **Ownership Checks:** Before updating/deleting any `service` or modifying a `booking`, verify on the server that the authenticated user owns the resource. Never trust `userId` or `role` sent in the request body.
3. **Stripe Payment Security:**
   - Never trust the client-side `/payment/success` redirect to upgrade a vendor.
   - Premium status (`subscriptionPlan: "premium"`) and transaction recording **must only** occur inside a verified **Stripe Webhook** endpoint (`stripe.webhooks.constructEvent`).

---

## 5. Business Logic & Validation Rules

### Services & Freemium Limits
- **Public Visibility:** Only services with `status === "approved"` (and active) appear on the Home page (minimum 6 featured) and Browse Services page.
- **Vendor Limits:**
  - `free` plan vendors can have a **maximum of 3 active/approved services**. Attempting to add/activate a 4th must prompt an upgrade to Premium.
  - `premium` plan vendors can publish **unlimited services** and receive a Premium Vendor Badge.
- **Creation Default:** Newly created services always default to `status: "pending"` until an Admin approves them.

### Booking Workflow
- **Eligibility:** Only authenticated `customer` accounts can book. `vendor` (including self-booking) and `admin` roles cannot submit bookings.
- **Duplicate Prevention:** Prevent duplicate active (`pending` or `accepted`) booking requests by the same customer for the same `serviceId` and `eventDate`.
- **State Transitions:**
  - `pending` $\rightarrow$ `accepted` or `rejected` (Vendor only; irreversible once processed).
  - `pending` $\rightarrow$ `cancelled` (Customer only; cannot cancel once `accepted` or `rejected`).

### User Profile Updates
- Users can update `name`, `image`, and profile metadata.
- Backend must strip/ignore any attempt to mutate `role`, `isBlocked`, or `subscriptionPlan` via profile update endpoints.

---

## 6. Routing & UI Architecture

### Public Routes
- `/` — **Home Page:** Hero banner, Featured Services ($\ge 6$ approved), Service Categories grid, "Why Choose WedPlan?", plus 1 additional section (e.g., How It Works / Testimonials) with Framer Motion animations.
- `/services` — **Browse Services:** Search by name, filter by category & location, sort by price (ascending/descending), loading skeletons, and empty states.
- `/sign-in` & `/sign-up` — Auth forms with role selector (Sign Up) and Google OAuth.

### Protected Routes (Redirect to `/sign-in` if unauthenticated)
- `/services/[id]` — **Service Details:** Image gallery, vendor info, booking form modal/section. Handle invalid IDs gracefully.
- `/payment/success` & `/payment/cancel` — Stripe Checkout return views.
- `/dashboard/*` — Role-locked sidebar layout:
  - **Customer (`/dashboard/customer`):** Overview stats, My Bookings (cancel pending), Profile Settings.
  - **Vendor (`/dashboard/vendor`):** Overview stats, My Services (CRUD + availability toggle), Add Service (ImgBB upload), Booking Requests (Accept/Reject), Subscription (Stripe Checkout trigger), Profile Settings.
  - **Admin (`/dashboard/admin`):** Overview stats, Manage Users (search, role filter, block/unblock), Manage Services (approve/reject/delete), Transactions (read-only audit log; admins cannot manually mark failed payments as paid).

---

## 7. Required Environment Variables

### Client (`.env.local`)
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Server (`.env`)
```env
PORT=5000
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
CLIENT_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=
IMGBB_API_KEY=
```

---

## 8. Agent Implementation Checklist
- [ ] Ensure zero CORS issues between Next.js client and Express server.
- [ ] Ensure dynamic routes and private dashboard routes handle hard page refreshes without 404s or auth-flicker redirects.
- [ ] Implement loading states for all async fetches, form submissions, and payment redirects.
- [ ] Use toast notifications exclusively for user feedback.
- [ ] Verify Stripe webhook signature handling works in both local (`stripe listen`) and production environments.