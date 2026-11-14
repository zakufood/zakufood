# ZAKU — Classic Premium Spice E-Commerce Platform

A complete, classic, premium e-commerce website for the Bangladeshi spice brand **ZAKU**, built strictly according to the original branding, reference designs, product jar images, and layout screenshots.

---

## 🌶️ Key Brand & Design Specifications
- **Brand Name**: ZAKU (*Zest in Every Bite*)
- **Primary Color**: Deep Wine Red / Maroon (`#7A1F1F`)
- **Background**: Classic White (`#FFFFFF`) and Warm Off-White (`#FAF8F5`)
- **Prices, Currency Symbol (`৳`), Buttons**: Deep Maroon (`#7A1F1F`)
- **Authentic Assets**: Preserves original ZAKU logo, original hero banner with Bengali slogan (*প্রতিটি পদে স্বাদের ছোঁয়া*), and original glass jar photography.
- **Customer Accounts**: Strictly removed (NO Sign In or Sign Up buttons for customers; instantaneous guest checkout with Cash on Delivery).

---

## 🚀 Key Functional Modules

### 1. Two-Row Classic E-Commerce Header
- **Top Row (Maroon `#7A1F1F`)**:
  - Original ZAKU logo (left)
  - Centered live search bar with real-time dropdown product preview
  - Live Cart icon with real-time item count badge
  - No Sign In/Sign Up buttons anywhere
- **Second Row**:
  - `Products` (Catalog link)
  - `Offers` (with animated red `HOT` badge)
  - `About ZAKU`
  - `Contact`
  - `Track Order`

### 2. Homepage Hero Section
- **Left**: Functional *Shop by Category* sidebar with 4 categories:
  1. *All Products*
  2. *Whole Spices*
  3. *Spice Mixes*
  4. *Seasonings*
- **Right**: Preserved original ZAKU hero banner (*প্রতিটি পদে স্বাদের ছোঁয়া*).

### 3. "Our Collection" Carousel (5 Classic Cards in a Row)
- Featured Products:
  1. **Whole Spices** — 90 gm — ৳299
  2. **Shahi Spice Mix** — 140 gm — ৳499
  3. **Peri Peri Spice Mix** — 100 gm — ৳199
  4. **Chicken Fry Seasoning** — 100 gm — ৳199
  5. **BBQ Seasoning** — 100 gm — ৳199
- Interactive Carousel: Desktop navigation arrows, pagination dots, mobile touch-swipe support.
- Interactive Cards: Working Add to Cart buttons, subtle card lift and shadow on hover, Quick View modal, and deep-link product detail page.

### 4. Full-Featured Shopping Cart & Slide-Out Drawer
- Slide-out cart drawer opening immediately upon clicking the cart icon.
- Displays thumbnail, weight, unit price, quantity increment/decrement, and removal.
- Calculates subtotal and grand total in BDT (`৳`).
- Persists cart items across page reloads using `localStorage`.

### 5. Guest Checkout & Database-Backed Order System
- No login or registration required.
- Checkout fields: Customer Name, 11-digit Phone number, Delivery address, District selector (*Inside Dhaka ৳60*, *Outside Dhaka ৳120*), Optional order note.
- Generates unique order ID (`ZAKU-2026-XXXX`).
- Saves order permanently to backend database (`server/data/db.json`).
- Automatically decrements inventory stock.
- Order confirmation page with timeline, itemized receipt, and printable invoice.

### 6. Order Tracking Tool (`/track-order`)
- Customers or support agents can look up any Order ID to view real-time fulfillment timeline, delivery destination, and item breakdown.

### 7. Administrative Store Management Portal (`/admin`)
- Secure login credentials:
  - **Username**: `admin`
  - **Password**: `zaku2026`
- **Dashboard KPI Metrics**: Total Revenue, Total Orders, Delivered Orders, Low Stock Alerts.
- **Order Management**: View customer information, ordered items, and update order status (*Pending*, *Confirmed*, *Processing*, *Shipped*, *Delivered*, *Cancelled*) with instant database persistence.
- **Product & Inventory Management**: Add new spice products, edit prices/weights/descriptions, update jar images, adjust stock count, and delete products.

---

## 🛠️ Project Structure

```
c:\Users\USER\Zaku new folder/
├── client/                      # React 18 + Vite + Tailwind CSS frontend
│   ├── public/assets/           # High-resolution jars, banners, logos
│   │   ├── hero_banner.png      # Original Bengali slogan banner
│   │   ├── zaku_header_logo.png # Crisp header logo
│   │   ├── zaku_footer_logo.png # Footer logo
│   │   ├── whole_spices_jar.png # Collection Card 1
│   │   ├── shahi_spice_mix_jar.png # Collection Card 2
│   │   ├── peri_peri_spice_mix_jar.png # Collection Card 3
│   │   ├── chicken_fry_seasoning_jar.png # Collection Card 4
│   │   └── bbq_seasoning_jar.png # Collection Card 5
│   └── src/
│       ├── components/          # Header, HeroSection, CollectionSection, ProductCard, CartDrawer, etc.
│       ├── context/             # CartContext with localStorage persistence
│       └── pages/               # Home, Products, Detail, Offers, About, Contact, Checkout, OrderSuccess, Tracking, Admin
├── server/                      # Express full-stack API and server
│   ├── data/db.json             # Persistent file-based database
│   ├── db.js                    # Database driver & CRUD operations
│   └── index.js                 # API routes & static client serving
└── package.json                 # Unified startup scripts
```

---

## 🏃‍♂️ How to Run

### Start the Full-Stack Server:
```bash
npm start
```
The application will be live at:
**http://localhost:5000**

### Dev Server with Hot Reloading:
```bash
# Terminal 1: API Server
npm run server

# Terminal 2: Vite Client
npm run client
```
Access the client dev server at **http://localhost:3000** (proxied to API at port 5000).

