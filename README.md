# Wow Browser

Wow Browser is a modern, privacy-focused web browser prototype built with **Next.js 14**, **Tailwind CSS**, and **ShadCN UI**. It features AI-powered capabilities driven by **Google Genkit**.

## 🚀 Key Features

- **Multi-Tab Interface:** Open and switch between multiple websites easily.
- **Incognito Mode:** Private browsing sessions that don't save to the simulated history.
- **AI Translation:** Built-in AI flow that can translate page content into multiple languages.
- **Ad & Tracker Analysis:** An AI-powered tool to analyze website source code for trackers.
- **Privacy Settings:** Manage simulated VPN, Proxy, and Site Permissions.
- **Full Management:** Dedicated views for Bookmarks, History, and Downloads.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Components:** ShadCN UI (Radix UI)
- **AI:** Google Genkit + Gemini 2.0 Flash
- **Localization:** next-intl (English, French, Hindi)

## 📖 How to Use

1. **Browsing:** Type a URL (e.g., `google.com`) or a search query in the address bar at the top.
2. **Tab Management:** 
   - Use the **+** button for a new standard tab.
   - Use the **Incognito** (hat & glasses) button for a private tab.
   - Click the **X** on any tab to close it.
3. **Sidebar:** Access your **Bookmarks**, **History**, and **Settings** from the left-hand navigation.
4. **AI Tools:** 
   - Click the **Globe/Language** icon in the address bar to translate the "current page."
   - Go to the **Ad-Blocker** section in the sidebar to analyze a specific URL for trackers.

## 📱 How to Build an APK

This project is a web application. To convert it into an Android APK, use **Capacitor**:

### 1. Build the Web Project
Ensure your project builds correctly:
```bash
npm run build
```

### 2. Install Capacitor
Add the Capacitor core and Android platform:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 3. Initialize Capacitor
Follow the prompts to set your app name and package ID (e.g., `com.wowbrowser.app`):
```bash
npx cap init
```

### 4. Add Android Platform
```bash
npx cap add android
```

### 5. Sync and Open
Sync your built `out` or `.next` folder (you may need to configure `webDir: "out"` in `capacitor.config.ts` after running `next export` if using static export):
```bash
npx cap copy
npx cap open android
```
This will open **Android Studio**. From there, you can select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## 📄 License

Prototype only. Built with Firebase Studio.
