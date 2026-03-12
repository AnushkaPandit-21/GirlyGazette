# The Girly Gazette

A personal AI-powered news reader app built with React Native (Expo) and Google Gemini AI. Think Barbie meets Vogue — news explained by your super smart bestie.

## Features

- **AI-Powered Summaries** — Gemini 2.0 Flash rewrites news in a fun, bubbly tone
- **5 News Categories** — Finance, Geopolitics, Tech/AI, Gossip/Lifestyle, Software Dev
- **Category-Specific AI Prompts** — Each category gets a tailored explanation style
- **Multi-Language** — English, Hindi, or Hinglish summaries
- **Offline Support** — Cached articles and AI summaries work without internet
- **Pull-to-Refresh** — Fresh news on demand
- **Pretty Pink UI** — Hot pink, gold accents, Pacifico + Nunito fonts

## Getting Started

### 1. Get a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

### 2. Set Up the Project

```bash
# Clone the repo
git clone https://github.com/AnushkaPandit-21/GirlyGazette.git
cd GirlyGazette

# Install dependencies
npm install

# Add your Gemini API key
# Edit the .env file and paste your key:
echo "EXPO_PUBLIC_GEMINI_KEY=your_key_here" > .env
```

You can also add/change your API key inside the app via **Settings > Gemini API Key**.

### 3. Run Locally

```bash
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press `a` to open in Android emulator.

### 4. Build APK for Android

#### Option A: Cloud Build (Recommended)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account (free)
eas login

# Build APK
eas build --platform android --profile apk
```

The build takes ~10-15 minutes. You'll get a download link for the `.apk` file.

#### Option B: Local Build

```bash
# Requires Android SDK installed locally
eas build --platform android --profile apk --local
```

### 5. Install APK on Your Phone

1. **Transfer the APK** to your Android phone:
   - Email it to yourself and download it
   - Upload to Google Drive and download on phone
   - Transfer via USB cable
   - Use AirDrop alternatives like Nearby Share

2. **Enable Unknown Sources** (required for sideloading):
   - Go to **Settings > Apps > Special app access > Install unknown apps**
   - Enable it for your file manager or browser
   - On older Android: **Settings > Security > Unknown sources**

3. **Tap the APK file** to install it

4. Open **The Girly Gazette** and enjoy your personalized news!

## Tech Stack

- **Frontend**: React Native (Expo)
- **AI**: Google Gemini 2.0 Flash (free tier)
- **News**: Public RSS feeds (no scraping)
- **Storage**: AsyncStorage (local caching)
- **Navigation**: React Navigation (bottom tabs + stack)
- **Fonts**: Pacifico + Nunito (Google Fonts)

## RSS Sources

| Category | Sources |
|----------|---------|
| Finance | LiveMint Markets, Economic Times |
| Geopolitics | Times of India World |
| Tech/AI | TechCrunch, The Verge |
| Gossip | Times of India Lifestyle |
| Software Dev | Dev.to, Hacker News |

## Project Structure

```
src/
  config/
    feeds.js          # RSS feed URLs by category
  services/
    geminiService.js  # Gemini AI with category prompts + caching
    rssService.js     # RSS fetching + offline caching
  screens/
    HomeScreen.js     # Main feed with category books
    CategoryScreen.js # Category-specific article list
    SettingsScreen.js # Preferences, language, API key
  components/
    ArticleCard.js    # News article card
    ArticleSheet.js   # Bottom sheet with AI summary
    ShimmerCard.js    # Loading skeleton
    SparkleSpinner.js # Sparkle loading animation
  context/
    SettingsContext.js # App-wide settings state
  theme/
    colors.js         # Color palette
```

## License

Personal project. Use it however you like.
