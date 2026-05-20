# ShopSync

![Node.js](https://img.shields.io/badge/Node.js-Backend-brightgreen)
![Express](https://img.shields.io/badge/Express-Server-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![React](https://img.shields.io/badge/React-Frontend-blue)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-green)
![Puppeteer](https://img.shields.io/badge/Puppeteer-Web%20Scraping-green)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

ShopSync is an e-commerce platform that combines a seller dashboard (inventory + order management), Razorpay checkout, and on-demand product comparison sourced via Puppeteer-based scraping from **Amazon** and **Flipkart**.

## Demo

[![ShopSync Demo Thumbnail](https://gjgngvgeodcchvlqdbui.supabase.co/storage/v1/object/public/pixlai-assets/Gemini_Generated_Image_9o5lw79o5lw79o5l.png)](https://youtu.be/a7xxQn6nqOE)

> Click the thumbnail above to watch the full demo on YouTube.

## 1. Project Overview

ShopSync targets two roles:

- **Buyers**: browse and search products, compare locally listed items against scraped Amazon/Flipkart results, and checkout using Razorpay.
- **Sellers (vendors)**: manage an inventory/catalog, view customer orders, and update order + payment statuses.

The main problem it addresses:

- Help buyers make better purchasing decisions by comparing products and prices across multiple sources (local seller inventory + scraped marketplace listings).
- Provide sellers an operational dashboard to manage inventory and fulfill orders.

## 2. Key Features

- **Multi-vendor e-commerce** backed by a `vendor` relationship on products (`product.vendor` → `user`).
- **Seller dashboard** for:
  - creating products (with image uploads to Cloudinary),
  - editing/updating product inventory,
  - deleting products,
  - tracking orders placed by buyers,
  - updating `orderStatus` and `paymentStatus`.
- **Real-time product comparison across Amazon & Flipkart**:
  - On search, the backend runs Puppeteer scrapers for Amazon + Flipkart and returns `amazonProducts` and `flipkartProducts`.
  - The UI renders these results in dedicated sections.
- **Razorpay payment integration**:
  - Create Razorpay orders on the backend.
  - Verify payment signatures server-side.
  - Buyer flow uses Razorpay Checkout JS loaded in the browser.
- **Secure authentication (JWT + httpOnly cookie)**:
  - Login returns a JWT stored in a cookie named `token`.
  - Protected routes require `token` and validate the JWT via `JWT_SECRET`.
  - Vendor-only routes additionally require `req.user.isVendor`.
- **Responsive UI**:
  - React UI uses Bootstrap / react-bootstrap components.
- **Notifications (basic retrieval support)**:
  - The backend includes a `Notification` model and authenticated GET endpoints for listing a vendor’s unseen notifications and viewing a single notification.
  - Note: notification creation is implemented in the backend (`createNotification`) but is only referenced in a commented-out block in product search in the current codebase.

## 3. Tech Stack

### Frontend

- React (`react-scripts`)
- Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- React Router (`react-router-dom`)
- React Bootstrap / Bootstrap
- axios, react-toastify
- Razorpay Checkout JS (`https://checkout.razorpay.com/v1/checkout.js`)

Key frontend dependencies (from `client/package.json`):

- `react`, `react-dom`
- `react-router-dom`
- `react-redux`, `@reduxjs/toolkit`
- `axios`
- `bootstrap`, `react-bootstrap`
- `react-toastify`
- `react-select`, `react-slick`, `slick-carousel`
- `react-spinners`

### Backend

- Node.js + Express
- JWT authentication stored in cookies (`jsonwebtoken`)
- MongoDB with Mongoose
- Puppeteer for web scraping
- Razorpay SDK
- Nodemailer (Gmail) for password reset emails
- Cloudinary for product image uploads
- Multer for file upload handling

Key backend dependencies (from `server/package.json`):

- `express`, `cors`, `cookie-parser`, `dotenv`
- `mongoose`
- `jsonwebtoken`, `bcrypt`
- `puppeteer`
- `razorpay`, `crypto` (Node core)
- `nodemailer`
- `cloudinary`, `multer`
- `passport` (present in dependencies; not used by the mounted routes in the current codebase)

### Database

- MongoDB + Mongoose models:
  - `user`, `Product`, `Order`, `notification`

## 4. System Architecture

End-to-end flow (buyer):

1. **User** enters a search query and optional price range.
2. Frontend calls the backend search endpoint (`GET /api/v1/products/all`) via Redux thunk.
3. Backend executes:
   - **Local DB search** for matching products (filters and vendor population),
   - **Scraping engine (Puppeteer)** for **Amazon** (`testAmazonScrapper.js`) and **Flipkart** (`flipkartScrapper.js`).
4. Backend returns:
   - `products` (local sellers),
   - `amazonProducts`,
   - `flipkartProducts`.
5. Frontend renders a comparison view (local + scraped sections).
6. Buyer adds **local** products to cart and proceeds to checkout.
7. Checkout:
   - Buyer requests Razorpay order creation (`POST /api/v1/payment/order`),
   - After payment, frontend calls payment verification (`POST /api/v1/payment/verify`),
   - Buyer places an order (`POST /api/v1/order/new`).
8. Seller updates fulfillment:
   - Vendor fetches orders (`GET /api/v1/order/vendor/all`)
   - Vendor updates `orderStatus` (`POST /api/v1/order/status/:id`)
   - Vendor updates `paymentStatus` (`POST /api/v1/order/status/payment/:id`)

## 5. Web Scraping Implementation

ShopSync uses **Puppeteer** to scrape product listings from third-party sites:

- **Amazon scraper**:
  - Implemented in `server/utils/testAmazonScrapper.js` and used by the search controller.
  - Launches Puppeteer in `headless: true` mode, sets a desktop user agent, navigates to `https://www.amazon.in/s?...`, and extracts product cards via DOM selectors in `page.evaluate()`.
- **Flipkart scraper**:
  - Implemented in `server/utils/flipkartScrapper.js`.
  - Launches Puppeteer with `--no-sandbox` / `--disable-setuid-sandbox`, navigates to `https://www.flipkart.com/search?...` (includes price range facets), then extracts data using `page.evaluate()`.

Backend orchestration:

- In `server/controller/product.controller.js`, the search endpoint `getSearchedProduct` calls both scrapers and returns results as JSON.

Limitations & performance considerations (based on the current implementation):

- **No caching**: each search triggers new Puppeteer sessions.
- **Fragile selectors**: scraping relies on CSS selectors that may change on the target websites.
- **Potential browser lifecycle issue**:
  - `server/utils/amazonScrapper.js` returns scraped results but has `await browser.close()` after `return` (unreachable). However, the active search path uses `testAmazonScrapper.js`, which closes the browser.

## 6. Seller Dashboard

The seller experience is implemented in the React app under routes like:

- `/vendor/dashboard`
- `/vendor/products`
- `/vendor/orders`
- `/vendor/notifications`
- `/vendor/order/details/:id`
- `/vendor/product/create`, `/vendor/product/edit/:id`, `/vendor/product/view/:id`

Seller capabilities (backed by API routes):

- **Inventory management**
  - Create products: `POST /api/v1/product/new` (auth + vendor-only, multipart upload with images)
  - Edit products: `PUT /api/v1/product/:id` (auth + vendor-only)
  - Delete products: `DELETE /api/v1/product/:id` (auth + vendor-only)
  - View seller catalog: `GET /api/v1/product/vendor/all`
- **Order handling**
  - Fetch vendor orders: `GET /api/v1/order/vendor/all` (populates `buyer` and `product`)
  - Update fulfillment status: `POST /api/v1/order/status/:id` with `orderStatus`
  - Update payment status: `POST /api/v1/order/status/payment/:id` with `paymentStatus`
  - Fetch order details by id: `GET /api/v1/order/:id`
- **Notifications**
  - Seller can list unseen notifications and view a notification detail:
    - `GET /api/v1/notifications`
    - `GET /api/v1/notification/:id`

Authentication/authorization:

- Backend role guard `authorizeRole` requires `req.user.isVendor === true`.

## 7. API Endpoints

Base path: `/api/v1`

### Auth

| Method  | Route                   | Purpose                                                         |
| ------- | ----------------------- | --------------------------------------------------------------- |
| `POST`  | `/login`                | Authenticate user and set JWT cookie (`token`)                  |
| `POST`  | `/register`             | Register buyer or vendor (`isVendor` + optional `businessName`) |
| `GET`   | `/me`                   | Return current user profile (requires auth cookie)              |
| `POST`  | `/logout`               | Clear auth cookie                                               |
| `PATCH` | `/update-password`      | Update password (requires old password validation)              |
| `POST`  | `/forgot-password`      | Send password reset email with a JWT-based reset token          |
| `PUT`   | `/resetPassword/:token` | Reset password using token                                      |

### Products / Search / Reviews

| Method   | Route                 | Purpose                                                                         |
| -------- | --------------------- | ------------------------------------------------------------------------------- |
| `POST`   | `/product/new`        | Create product (vendor-only) with cover + images uploaded to Cloudinary         |
| `GET`    | `/product/all`        | List all locally stored products                                                |
| `GET`    | `/products/all`       | Search local products and return scraped Amazon/Flipkart results for comparison |
| `GET`    | `/product/vendor/all` | List products belonging to the authenticated vendor                             |
| `GET`    | `/product/:id`        | Vendor-only: fetch a single product by id                                       |
| `PUT`    | `/product/:id`        | Vendor-only: edit product fields and upload updated images                      |
| `DELETE` | `/product/:id`        | Vendor-only: delete a product                                                   |
| `POST`   | `/review`             | Add/update a review entry inside `product.reviews`                              |

### Orders

| Method | Route                       | Purpose                                                                            |
| ------ | --------------------------- | ---------------------------------------------------------------------------------- |
| `POST` | `/order/new`                | Place an order: validates items, decrements product stock, creates order documents |
| `GET`  | `/user/orders`              | Buyer: list orders populated with product fields                                   |
| `GET`  | `/order/vendor/all`         | Vendor: list orders for that vendor (populates buyer/product)                      |
| `GET`  | `/order/:id`                | Vendor-only: fetch order by id                                                     |
| `POST` | `/order/status/:id`         | Vendor-only: update `orderStatus`                                                  |
| `POST` | `/order/status/payment/:id` | Vendor-only: update `paymentStatus`                                                |

### Payments (Razorpay)

| Method | Route             | Purpose                                                   |
| ------ | ----------------- | --------------------------------------------------------- |
| `POST` | `/payment/order`  | Create a Razorpay order (amount in INR, paise conversion) |
| `POST` | `/payment/verify` | Verify Razorpay signature with HMAC-SHA256                |

### Notifications

| Method | Route               | Purpose                                                          |
| ------ | ------------------- | ---------------------------------------------------------------- |
| `GET`  | `/notifications`    | List unseen notifications (`seen: false`) for authenticated user |
| `GET`  | `/notification/:id` | Fetch a notification detail and populate referenced user/product |

## 8. Database Design

MongoDB schemas (Mongoose models):

- **`user`**
  - Fields: `name`, `email` (unique), `password` (hashed + not selected by default), `country`, `state`, `district`
  - Role: `isVendor` (boolean), `businessName` (optional)
  - Relationships:
    - `product.vendor` references `user`
    - `order.buyer` references `user`
    - `order.vendor` references `user`
    - `notification.to` references `user`
- **`Product`**
  - Fields: `name`, `description`, `price`, `category`, `brand`, `stock`, `rating`, `numOfReviews`, `reviews[]`
  - Media: `coverImage`, `images[]`
  - Source: `source` and `productUrl` (used for scraped/local context)
  - Relationships:
    - `vendor` references `user`
    - `reviews[].user` references `user`
- **`Order`**
  - Fields: `buyer`, `product`, `quantity`, `price`, `totalPrice`
  - Shipping: `shippingAddress` object with street/city/state/postalCode/country
  - Status:
    - `paymentStatus`: `Pending`, `Paid`, `Failed`, `Refunded`
    - `orderStatus`: `Processing`, `Shipped`, `Delivered`, `Cancelled`
  - Vendor association: `vendor` references `user`
- **`notification`**
  - Fields: `title`, `content.user` (ref `user`), `content.product` (ref `Product`), `to` (ref `user`), `seen` boolean

## 9. Environment Variables

These environment variables are read in the backend (`server/.env`):

| Variable              | Used by                                   | Purpose                                                        |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `PORT`                | `server/index.js`                         | Server listening port                                          |
| `MONGODB_URL`         | `server/db/connection.js`                 | MongoDB connection string                                      |
| `JWT_SECRET`          | JWT verification/signing                  | Secret used for JWT tokens (auth + password reset)             |
| `JWT_EXPIRY`          | `server/models/user.model.js`             | JWT expiration used for login token                            |
| `NODEMAILER_EMAIL`    | `server/utils/sendEmail.js`               | Gmail sender email for password reset                          |
| `NODEMAILER_PASSWORD` | `server/utils/sendEmail.js`               | Gmail app password for Nodemailer                              |
| `RAZORPAY_KEY_ID`     | `server/controller/payment.controller.js` | Razorpay API key id                                            |
| `RAZORPAY_KEY_SECRET` | `server/controller/payment.controller.js` | Razorpay API key secret (also used for signature verification) |

Note: Cloudinary credentials are currently configured in `server/utils/cloudinary.js` as hardcoded values, not via environment variables.

## 10. Project Structure

Key folders:

```text
.
├─ client/                 # React frontend
└─ server/                 # Express + MongoDB backend
```

Backend (`server/`) layout:

```text
server/
├─ index.js                # Express app + route mounting
├─ controller/            # Request handlers
├─ routes/                # Express routers mounted under /api/v1
├─ models/                # Mongoose schemas
├─ utils/                 # Scrapers, email, Cloudinary upload helper
├─ middleware/            # Auth guard + multer upload config
└─ db/                    # Mongo connection
```

Frontend (`client/`) layout:

```text
client/src/
├─ pages/                 # Buyer + vendor pages
├─ components/           # UI components (ShopList, ScrappedShopList, ProductCard, etc.)
└─ app/features/         # Redux slices/thunks (auth, cart, search, vendor operations)
```

## 11. Setup & Local Development

### Prerequisites

- Node.js + npm
- MongoDB Atlas (or MongoDB instance) with a connection string
- Razorpay account (test/live keys)
- Gmail credentials for password reset email (via Nodemailer)
- Cloudinary account (used for uploading product images)

### Installation

1. Install backend dependencies:

   ```bash
   cd server
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Environment setup (backend)

1. Create `server/.env` with the variables listed in the **Environment Variables** section.
2. Ensure `uploads/` directory exists (multer stores temporary uploads in `server/uploads`).

### Running locally

1. Start the backend:

   ```bash
   cd server
   npm run dev
   ```

   The server uses `PORT` from `.env` (the provided value is `8080`).

2. Start the frontend:
   ```bash
   cd client
   npm start
   ```
   The React app runs on `http://localhost:3000` and proxies API calls to `http://localhost:8080/` (see `client/src/utils/url.js` and `client/package.json` proxy).

### Default ports

- Backend: `8080` (from `server/.env` via `PORT`)
- Frontend: `3000` (Create React App default)

## 12. How It Works (User Journey)

### Buyer journey

1. **Register / login**
   - Buyer registers with `POST /api/v1/register` (sends `isVendor` as false unless set explicitly).
   - Buyer logs in with `POST /api/v1/login`. The backend sets a cookie `token` (JWT).
2. **Search & comparison**
   - Buyer uses the search bar on the `/shop` page.
   - The frontend dispatches `getSearchedProducts`, which calls `GET /api/v1/products/all?page=...&searchQuery=...&minPrice=...&maxPrice=...`.
   - Backend returns:
     - `products` (local DB matches, with vendor populated based on buyer district where available),
     - `amazonProducts` (Puppeteer-scraped),
     - `flipkartProducts` (Puppeteer-scraped).
   - UI renders local items via `ProductCard` and scraped items via `ScrapperProductCard`.
   - Scraped cards show external links and do not currently add scraped items to cart.
3. **Cart**
   - Local products can be added to cart (`addToCart` Redux slice).
4. **Checkout (Shipping Address)**
   - Buyer enters shipping address in `/checkout`, which is stored in Redux/localStorage.
5. **Payment (Razorpay) + Order placement**
   - On `/order-summary`, frontend:
     - calls `POST /api/v1/payment/order` to create a Razorpay order,
     - opens Razorpay Checkout,
     - calls `POST /api/v1/payment/verify` with signature data,
     - places the order via `POST /api/v1/order/new` using cart `items` and `shippingAddress`.
   - After order placement, cart items are removed and the user navigates home.
6. **Order tracking**
   - Buyer views orders on `/order` using `GET /api/v1/user/orders`.

### Seller journey

1. **Login and access control**
   - Backend protects vendor routes with `isAuthenticated` + `authorizeRole` (requires `req.user.isVendor`).
   - Frontend gate `AdminAuthenticator` checks `state.user.isVendor` and `state.user.isLogin`.
2. **Manage inventory**
   - Create/edit/view/delete products through vendor pages.
   - Product media is uploaded using multer + Cloudinary helper.
3. **Fulfill orders**
   - Seller sees incoming orders using `GET /api/v1/order/vendor/all`.
   - Seller updates:
     - `orderStatus` (`POST /api/v1/order/status/:id`)
     - `paymentStatus` (`POST /api/v1/order/status/payment/:id`)
4. **Notifications**
   - Seller can view unseen notifications (`GET /api/v1/notifications`) and notification detail pages.
