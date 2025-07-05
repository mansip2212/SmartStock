# 📦 Smart Stock – AI-Powered Inventory Management System

**Smart Stock** is an intelligent inventory management platform designed to help businesses track stock levels, automate reordering, and gain real-time insights into inventory health. Built with modern web technologies and Firebase, the system is optimized for scalability, accuracy, and ease of use.

---

## 🚀 Features

- **Dynamic Inventory Dashboard**  
  Add, update, and monitor products by category with a clean, intuitive UI. Supports category-specific views and reorder alerts.

- **Smart Ordering System**  
  Automatically detects duplicate products using Product ID. If matched, it verifies all fields or updates using weighted average pricing for accuracy.

- **Real-Time Firestore Integration**  
  Syncs data instantly using Firebase Firestore streams. Supports user-specific UUIDs to manage personalized inventories securely.

- **Flexible Category Handling**  
  Offers predefined categories with an “Other” option that dynamically enables custom entry.

- **Cloud Function API Layer**  
  Secure backend functions handle data validation, analytics triggers, and reorder automation.

- **Low Stock Alerts & Analytics**  
  Tracks stock health and generates alerts or insights when quantities fall below thresholds.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, React Hooks  
- **Backend:** Firebase Firestore, Firebase Cloud Functions  
- **Authentication & Storage:** Firebase Auth, Firebase Storage  
- **Deployment:** Vercel / Firebase Hosting

---

## 📈 Use Cases

- Small to mid-size retailers managing product stock  
- Warehouse or multi-location inventory tracking  
- Businesses looking to avoid overstocking/understocking scenarios with smart alerts

---

## 🔐 Authentication

Each user gets a unique UUID stored in Firebase, ensuring that inventory data is securely scoped per account.

---

## 📌 Future Improvements

- Role-based access control (admin/staff)  
- CSV import/export of products  
- Advanced analytics dashboard (monthly trends, wastage, etc.)

---

## 📄 License

This project is for educational/demo purposes. Please contact the author for production use or contributions.


