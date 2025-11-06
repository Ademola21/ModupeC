# Overview

CeniMax is a Next.js-based movie browsing and discovery platform with a premium dark-themed UI. This demonstration application showcases a modern, cinematic interface for exploring movies, viewing trailers, and downloading videos. The app features authentication flows, profile management, theme switching, a fully functional YouTube video downloader using yt-dlp and FFmpeg, and a sophisticated component architecture built with React, TypeScript, and Tailwind CSS.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Download Fix (November 6, 2025)
- **Fixed format detection bug** in download functionality
- **Updated download-progress.ts and stream-download.ts** to properly check format metadata before downloading
- **Implemented working script logic**:
  - Uses `yt-dlp -j -f <formatId>` to check if format includes audio
  - Examines `acodec` field to determine audio presence
  - Uses `${formatId}+bestaudio` for video-only formats (matching the working CLI script)
- **Fixed MPEG-TS playback issue in Chrome**:
  - Added `--remux-video mp4` for all combined video+audio formats
  - Uses FFmpeg to convert MPEG-TS streams to proper MP4 containers
  - Ensures files play correctly in Chrome, Firefox, and all modern browsers
  - Fixes "Format: MPEG-TS with .mp4 extension" issue from m3u8/HLS downloads
- **Eliminated format errors** caused by guessing format capabilities
- **Maintains cookie support** throughout the format check and download process
- Downloads now work reliably across all format types (audio-only, combined, video-only)

# System Architecture

## Frontend Framework
- **Next.js 14.2.3** with TypeScript for type safety and development efficiency
- **Pages Router** architecture for file-based routing
- **React 18** for component-based UI development
- **Server-side rendering (SSR)** capabilities via Next.js for improved SEO and initial load performance

## Styling and Design System
- **Tailwind CSS 3.4.1** for utility-first styling with custom dark theme configuration
- **Custom color palette** defined in `tailwind.config.ts` for consistent dark mode aesthetics (background-primary, background-secondary, text-primary, etc.)
- **CSS animations** defined in globals.css including aurora background effects and fade-in transitions
- **Responsive design** with mobile-first approach using Tailwind breakpoints
- **Dark mode by default** with light mode toggle capability using CSS classes

## State Management
- **React Context API** (`AppContext`) for global application state including:
  - Theme management (light/dark mode persistence via localStorage)
  - Authentication state (simulated, no backend)
  - User profile data
- **Local component state** using React hooks (useState, useEffect, useCallback) for UI interactions
- **localStorage** for client-side persistence of theme preferences and user session

## Component Architecture
- **Layout component** wrapping all pages with conditional Header/Footer rendering
- **Reusable UI components** following atomic design principles (buttons, inputs, cards, modals)
- **Icon components** as SVG wrappers for consistent styling and props
- **Presentation/Container separation** with smart components handling logic and dumb components for display
- **React.memo** optimization for expensive components like MovieCard and GenreFilter

## Routing and Navigation
- **File-based routing** using Next.js pages directory
- **Dynamic routes** for individual movie pages (`/movie/[id].tsx`)
- **Static pages** for legal/info content (privacy, terms, FAQ, etc.)
- **Authentication-aware routing** with redirects for protected pages like profile

## Data Layer
- **Mock data constants** in `constants.ts` and component files (no real backend)
- **TypeScript interfaces** in `types.ts` defining Movie, Comment, and UserProfile schemas
- **In-memory state** simulating data fetching and user interactions
- **Prepared for backend integration** with clear data type definitions

## User Experience Features
- **Toast notification system** via custom ToastProvider context for user feedback
- **Search overlay** with real-time filtering of mock movie data
- **Pagination** for large movie lists with smooth scrolling
- **Lazy loading** and intersection observer patterns for performance optimization
- **Keyboard navigation** support (Escape key handlers, focus management)
- **Accessibility considerations** with semantic HTML and ARIA labels
- **Video Downloader** - Full-featured YouTube video downloader with:
  - Real-time format detection and quality selection
  - Server-side download with progress tracking via SSE
  - Automatic browser download triggering
  - Support for video (144p-2160p) and audio formats
  - Smart format handling (combined vs. video-only with audio merging)
  - **Smart YouTube cookies support** for age-restricted or sign-in-required videos (Nov 2025 - Updated)
    - Automatically detects `youtube-cookies.txt` or `cookies.txt` in project root
    - **Always-on authentication**: When cookies exist, they are ALWAYS used from the start (not just on retry)
    - **Consistent auth flow**: Both format detection and download use identical authentication state
    - **Format compatibility**: video-info returns `requiresCookies` flag indicating cookie usage
    - **Download consistency**: stream-download honors `requiresCookies` flag for matching authentication
    - **Intelligent fallback**: If cookies cause issues, system retries without cookies automatically
    - **Prevents format mismatch**: Ensures downloads use same auth method as format detection
    - **Production tested**: Verified across all resolutions (144p-1080p) and audio formats
    - Solves bot detection, age restrictions, and private video access

## Authentication Flow
- **Simulated authentication** without actual backend validation
- **Login/Signup pages** collecting name and email only
- **Session management** via Context API and localStorage
- **Protected routes** checking authentication state before rendering
- **Profile management** with avatar selection from predefined options or upload simulation

## Performance Optimizations
- **Image optimization** with loading states and onLoad callbacks
- **Component memoization** using React.memo for frequently re-rendered components
- **Debouncing** potential in search functionality
- **IntersectionObserver** for lazy rendering movie cards on scroll
- **CSS animations** over JavaScript for better performance

# External Dependencies

## Core Framework Dependencies
- **next@14.2.3** - React framework for production with SSR/SSG capabilities
- **react@18** and **react-dom@18** - UI library and DOM renderer
- **typescript@5** - Static type checking for improved developer experience

## Styling Dependencies
- **tailwindcss@3.4.1** - Utility-first CSS framework
- **postcss@8** - CSS transformation tool required by Tailwind
- **autoprefixer@10.4.19** - PostCSS plugin for vendor prefixes

## Type Definitions
- **@types/node@20** - TypeScript definitions for Node.js APIs
- **@types/react@18** - TypeScript definitions for React
- **@types/react-dom@18** - TypeScript definitions for ReactDOM

## Third-Party Services & Binaries
- **Mock avatar service** using pravatar.cc for placeholder user avatars
- **External image hosting** (i.ytimg.com, i.ibb.co) for movie posters and thumbnails
- **YouTube embeds** for trailer playback (simulated, URLs stored in mock data)
- **yt-dlp** - Standalone binary (v2025.10.22) for YouTube video downloading with cookies support
- **FFmpeg** - yt-dlp optimized static builds for video/audio processing and merging
- **Setup script** (`npm run setup`) automatically downloads binaries from GitHub releases
- **Cookies file** (optional) - `youtube-cookies.txt` or `cookies.txt` for authenticated downloads (excluded from version control)

## Browser APIs
- **localStorage** for theme and session persistence
- **IntersectionObserver** for scroll-based lazy loading
- **MediaQuery API** for detecting system dark mode preference

## Future Integration Points
- Database layer ready for integration (type definitions suggest Drizzle ORM compatibility)
- API routes can be added in `/pages/api` directory
- Environment variables configured via `.env.local` (GEMINI_API_KEY placeholder)
- Backend service integration points clearly defined through TypeScript interfaces