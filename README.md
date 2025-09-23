# 🛒 E-Commerce Product Showcase

## 📖 Project Title
E-Commerce Product Showcase

## ❓ Problem Statement
Small businesses need an online product display without complex backends. This project creates a simple, attractive product gallery with filtering and modal views. It helps businesses highlight their offerings clearly and attractively.

## 🛠️ Tools & Tech
- HTML
- CSS
- JavaScript
- (Optional: Swiper.js)

## 🔗 Upgrade
In this version, we integrate a free E-Commerce API (Fake Store API / DummyJSON API) to fetch products dynamically instead of hardcoding them.

## 🚀 Features
- Fetch and display products dynamically from API.
- Product cards with image, title, price, and category.
- Product details in modal/dedicated view.
- Filter products by category.
- Sort products by price (low→high, high→low).
- Search products by name/keyword.
- Add to Cart / Remove from Cart functionality.
- Cart persists using Local Storage.
- Responsive and mobile-friendly UI.

## 🌐 APIs Used
- [Fake Store API](https://fakestoreapi.com/) (beginner-friendly)
- or [DummyJSON API](https://dummyjson.com/) (supports search & pagination)

## 🎨 Color Palette
Our carefully chosen color scheme creates a warm, professional, and user-friendly shopping experience:

### **Primary Colors:**
- **#A2AF9B (Muted Green)** - ACTION COLOR
  - Use for: All important buttons (Add to Cart, Buy Now, Checkout)
  - Also for: Sale tags, announcement bars, important icons
  - Goal: This color should scream "click me!"

- **#FAF9EE (Light Cream)** - MAIN BACKGROUND
  - Use for: The overall background of the site
  - Goal: Makes products the main focus. Clean, warm, and easy on the eyes

- **#DCCFC0 (Soft Beige)** - SECTIONS & HIGHLIGHTS
  - Use for: Backgrounds of specific sections for separation
  - Examples: Footer, customer reviews block, order summary in cart, filters sidebar
  - Goal: Creates visual structure and hierarchy

- **#EEEEEE (Very Light Gray)** - UI DETAILS
  - Use for: Subtle UI elements
  - Examples: Borders around product images, dividers between items, input field borders
  - Goal: Adds clean, professional finish without distraction

### **Text Color:**
- **#333333 (Dark Gray)** - Primary text color for highest readability on light backgrounds

## 📂 Project Structure (suggested)
```
Ecommerce-Showcase/
│── index.html        # Main entry point
│── style.css         # Stylesheet
│── script.js         # Core JS logic
│── /assets           # Images/icons (if needed)
│── /components       # Optional: reusable UI parts
└── README.md         # Project documentation
```

## ⚙️ Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/swapnilsanap7/ecommerce-showcase.git
   cd ecommerce-showcase
   ```
2. Open `index.html` in your browser.
3. Make sure you are connected to the internet (for API fetch).

## 💡 Future Enhancements
- Wishlist feature.
- Product reviews (stored in Local Storage).
- Pagination / infinite scroll.
- Dark mode toggle.