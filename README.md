🌾 AmaniYield: Climate Resilience & AgriTech Marketplace

**Bridging the Digital Divide in African Agriculture through Accessible Design**

## 📘 Overview

AmaniYield is a comprehensive agricultural platform designed to empower small-scale farmers with climate intelligence and fair market access. While the platform is powered by AI-driven yield predictions, its core design philosophy is **accessibility for all**, ensuring that essential climate and market data is available to users whether they have a high-end smartphone or a basic feature phone.

## 🎯 The User Problem

Agricultural digital tools often fail because they ignore the reality of the end-user’s environment.

* **The Small-Scale Farmer:** Often faces limited internet connectivity and varying levels of digital literacy. Complex, image-heavy apps are often unusable in remote areas.
* **The Market Gap:** Farmers lack real-time visibility into market pricing, leaving them vulnerable to predatory middlemen.
* **The Institutional Goal (NGOs/Government):** Organizations need data-driven insights to distribute aid and climate resources effectively, but struggle to collect accurate, real-time data from the field.

## 🧑‍💻 User Research & Discovery

To build a system that farmers would actually adopt, I conducted targeted research during the development cycle:

* **Connectivity Mapping:** Researched the mobile usage patterns of rural farmers to understand which devices were dominant.
* **Service Gap Analysis:** Interviewed early-stage users to discover that while they *wanted* climate data, they could not rely on constant 4G/5G data access.
* **Stakeholder Interviews:** Engaged with climate-focused NGOs to determine the critical data points they need to provide meaningful support to farmers.

## 🔄 How User Feedback Shaped the Interface

The final product architecture was directly molded by user feedback, shifting the design from a "standard app" to a "multi-modal platform":

1. **USSD Implementation (The Inclusivity Shift):**
* *Feedback:* During field interviews, it became clear that a Next.js web application alone would exclude a large percentage of farmers in low-connectivity areas.
* *UI Solution:* We pivoted to include a robust **USSD API integration**. This allows farmers to query market prices and receive weather alerts via simple text-based menus, ensuring the platform remained accessible without an internet connection.


2. **Simplified Dashboarding:**
* *Feedback:* Users found complex charts overwhelming. They needed actionable advice, not just raw data.
* *UI Solution:* We redesigned the dashboard to prioritize "Alerts and Next Steps." Instead of just showing a temperature chart, the UI translates that data into plain language: "Low rainfall expected—delay planting by 3 days."


3. **Marketplace Verification:**
* *Feedback:* Buyers and Farmers both expressed distrust in online marketplaces due to scam concerns.
* *UI Solution:* We implemented a "Product Scan & Verification" feature, which acts as a digital seal of trust, allowing users to verify crop quality and seller legitimacy directly in the app.



## 📊 Impact & Outcomes

* **Bridged the Connectivity Gap:** By integrating USSD with a modern web frontend, the system is usable across the entire digital literacy spectrum.
* **Data-Driven Climate Adaptation:** Empowers farmers to make planting decisions based on AI-backed climate predictions rather than guesswork.
* **Market Transparency:** Reduces dependence on informal middlemen by connecting farmers directly to wholesalers and NGOs.

## 🛠️ Technical Stack

* **Frontend:** Next.js 16 (React), Tailwind CSS (Mobile-first design)
* **Backend:** Express.js (Node.js), PostgreSQL (Prisma ORM)
* **Accessibility Layer:** USSD Session Management API
* **AI/Intelligence:** Integrated climate/yield prediction engine

## 🚀 Quick Start

```bash
# Clone and setup the monorepo
git clone <your-repo-url>
npm run setup
npm run dev

```

## 🔐 Security & Trust

As a platform handling financial and agricultural data, security is paramount:

* **JWT-based Authentication** for user accounts.
* **SQL Injection Prevention** via Prisma ORM.
* **Data Privacy:** USSD interactions ensure that farmers are not required to upload unnecessary sensitive data, keeping their digital footprint lightweight and secure.

---

*Developed as a climate-smart solution for African agriculture. Focused on user-centricity and accessibility.*
