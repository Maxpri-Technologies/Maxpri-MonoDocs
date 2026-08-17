# Maxpri MonoDocs

Official Documentation and Systems Architecture for **Maxpri Technologies** Products, Platforms, and Engineering Standards.

---

## 1. Executive Overview

**Maxpri Technologies** engineers scalable, high-performance software systems designed for long-term reliability, minimal technical debt, and growth. We believe in building systems, not just software—prioritizing clean code, modular architecture, security, and intelligent automation.

### Key Metrics & Highlights
- **50+ Apps & Systems Shipped**
- **2–5 Day Delivery** for initial project prototypes
- **99% Uptime Average** across deployed infrastructure
- **Systems-First Mindset** with security embedded at every tier
- **Direct Engineer Access** for clients and stakeholders

---

## 2. Product Ecosystem & Suite Architecture

Maxpri operates a multi-tiered ecosystem consisting of business suites, personal productivity tools, autonomous browser agents, and specialized apps.

```
                    ┌─────────────────────────────────────────┐
                    │           MAXPRI ECOSYSTEM             │
                    └────────────────────┬────────────────────┘
                                         │
        ┌───────────────────┬────────────┴───────┬────────────────────┐
        │                   │                    │                    │
┌───────▼─────────┐ ┌───────▼─────────┐ ┌────────▼────────┐ ┌─────────▼────────┐
│  Maxpri Valley  │ │   Maxpri Base   │ │  Voyager Agent  │ │    ThinkNote    │
│ (Business Suite)│ │ (Personal Suite)│ │(Browser Automation)│ (Note Engine)  │
└───────┬─────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
        │
   ┌────┴──────────────────────────────────────────┐
   │ Write | Pulse | Vault | Orbit | Colleague | Access│
   └───────────────────────────────────────────────┘
```

### 2.1 Maxpri Valley (Business Operating Suite)
Maxpri Valley is an all-in-one digital operating suite for modern teams, enabling structured knowledge management, secure storage, AI automation, and team coordination.
- **Write** (`https://write.maxpri.workers.dev`): Structured workspace documentation, collaborative notes, knowledge base publishing.
- **Pulse** (`https://pulse.maxpri.workers.dev`): AI-powered intelligence engine providing multi-model chat, automated document summaries, workspace search, and natural language query resolution.
- **Vault** (`https://vault.maxpri.workers.dev`): Secure cloud storage for enterprise files, digital assets, and encrypted uploads.
- **Orbit** (`https://orbit.maxpri.workers.dev`): Workspace scheduling, task management, event reminders, and team calendars.
- **Colleague** (`https://colleague.maxpri.workers.dev`): Member access control, team directory, role delegation, and organizational structure.
- **Access** (`https://maxpritech.com/auth`): Unified single sign-on (SSO), identity provider, and security account manager.

### 2.2 Maxpri Base (Personal Digital Environment)
A streamlined productivity suite designed for individuals needing fast knowledge capture, AI assistance, and personal organization.
- Includes personalized instances of **Write**, **Pulse**, **Vault**, and **Orbit**.

### 2.3 Voyager — Intelligent Browser Agent
**Voyager** (`/voyager`) is an AI-powered agentic browser extension that automates complex web workflows directly inside the user's active browser session.
- **Context-Aware DOM Parsing**: Interprets live DOM structure and accessibility trees rather than relying on brittle CSS selectors.
- **Native Session Execution**: Runs within user browser profiles, maintaining active authentication, cookies, and local session states without API overhead.
- **Traceable Reasoning**: Displays live execution logs (`STEP_XX_EXECUTION`) showing parsed elements, action decisions, and status tracking.
- **Human-in-the-Loop Safeguards**: Automatically pauses and requests explicit user validation for high-risk actions (such as financial transactions or data deletion).
- **Local Privacy**: Page parsing and execution reasoning run locally to prevent leaks of sensitive browsing data.

### 2.4 ThinkNote
**ThinkNote** (`/apps/thinknote`) is a fast, distraction-free web application for note-taking, draft management, and rapid thought capture.

---

## 3. Engineering & Client Service Tiers

Maxpri Technologies offers three primary tiers of custom software engineering, system architecture, and modernization services:

| Feature / Tier | Starter ($170 / $500) | Professional ($360 / $720) | Enterprise ($800 / $1,200) |
| :--- | :--- | :--- | :--- |
| **Scope** | Custom single-page app / landing portal | Full-stack web application | Multi-platform system / Microservices |
| **Backend & DB** | Standard API integration | Custom API & database architecture | Real-time microservices & cloud infra |
| **Security** | Standard SSL & basic auth | Admin dashboard & secure auth | Enterprise RBAC, encryption & audit logs |
| **Delivery Time** | 1–2 Weeks | 1–3 Weeks | Custom / Accelerated timeline |
| **Included Support** | 1 Month Support | 6 Months Support | 12 Months Dedicated Support |

Orders can be submitted directly via the online portal (`https://order.maxpri.workers.dev`).

---

## 4. Systems Architecture & Tech Stack

Maxpri products are built for ultra-fast response times, edge performance, and zero server management overhead.

- **Edge Runtime**: Deployed globally on [Cloudflare Workers](https://workers.cloudflare.com/) utilizing serverless edge computing (`wrangler.jsonc`, `worker-redirect.js`).
- **Frontend Core**: Vanilla HTML5, modern CSS3 (CSS custom properties, CSS Grid, Flexbox, glassmorphism UI design system), and lightweight Vanilla JS for maximum speed and zero heavy framework overhead.
- **AI Integration Layer**:
  - **Claude AI (Anthropic)**: Powers conversational support and deep reasoning in the Maxpri Assistant widget.
  - **Gemini API Proxy** (`https://geminiapi.maxpri.workers.dev`): Handles real-time system facts, package advice, and customer query routing.
- **Data & Auth Storage**: Browser `localStorage` for localized client state, combined with centralized auth APIs via Maxpri Access (`/auth`).

---

## 5. Repository Structure

```
Maxpri-MonoDocs/
├── README.md                      # Master Documentation Hub (this file)
├── index.html                     # Maxpri Main Portal & Service Showcase
├── wrangler.jsonc                 # Cloudflare Workers configuration
├── worker-redirect.js             # Edge routing & URL redirection worker
├── robots.txt                     # Search engine indexing rules
├── sitemap.xml                    # Site map and priority indexing
├── logo.png / favicons/           # Brand assets & favicons
├── css/
│   └── styles.css                 # Global design system & theme tokens
├── js/
│   └── script.js                  # Global interactive UI, modal & chat logic
├── apps/
│   ├── index.html                 # Ecosystem App Launcher & Hub
│   ├── projectvoyager2.svg        # Product graphics
│   └── thinknote/
│       └── index.html             # ThinkNote Web App
├── auth/
│   └── index.html                 # Maxpri Access Portal (Unified Auth)
├── voyager/
│   ├── index.html                 # Voyager Landing & Product Showcase
│   ├── style.css                  # Voyager visual theme
│   ├── worker.js                  # Voyager Edge Worker
│   ├── wrangler.jsonc             # Voyager Cloudflare config
│   └── plans/
│       └── index.html             # Voyager Pro Pricing & Tier Selector
├── Join The Maxpri Team/          # Engineering Onboarding & Technical Guides
│   └── Engineer/
│       ├── Welcome!               # Engineering Welcome Guide
│       ├── section2               # Software Principles & Development Guidelines
│       └── Setup/                 # Tooling Setup (GitHub, IDEs)
└── Othersites/                    # Legacy & Dedicated Sub-site templates
    ├── Order form/                # Standalone order pages (starter, professional, enterprise)
    └── Products page/             # Alternative product showcases
```

---

## 6. Developer Workflows & Onboarding

### 6.1 Recommended Local Environment Setup
1. **IDE**: [Visual Studio Code](https://code.visualstudio.com/) is recommended due to native Git integration, integrated terminal, and extension support.
2. **Local Preview**:
   - Serve static files using Python, Node.js, or Bun:
     ```bash
     python3 -m http.server 8000
     # or
     npx serve .
     ```
   - For Cloudflare Worker testing:
     ```bash
     npx wrangler dev
     ```

### 6.2 Git & Development Guidelines
- Always work in descriptive feature branches (`feature/...` or `bugfix/...`).
- Keep commit messages concise, following standard conventions (50 characters max subject line).
- Ensure all HTML, CSS, and JS files pass code validation before pushing to main branches.
- Consult additional engineering setup guides in `Join The Maxpri Team/Engineer/Setup/`.

---

## 7. Contact & Support Channels

For questions regarding Maxpri products, enterprise deployments, or custom software projects:

- **Email**: [maxpri.tech@gmail.com](mailto:maxpri.tech@gmail.com)
- **Phone**: +1 (330) 305-2588 *(Mon – Fri, 9am – 6pm EST)*
- **Website**: [https://maxpritech.com](https://maxpritech.com)
- **Order Desk**: [https://order.maxpri.workers.dev](https://order.maxpri.workers.dev)
