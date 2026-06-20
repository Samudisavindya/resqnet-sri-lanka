# ResQNet Sri Lanka

**ශ්‍රී ලංකා ආපදා සහන සහ සම්බන්ධීකරණ පද්ධතිය**

A comprehensive disaster relief coordination and management system for Sri Lanka.

## Features

- **🔐 Authentication** - Login and Sign Up with Supabase
- **🌐 Bilingual Support** - English and Sinhala (සිංහල) language support
- **📊 Dashboard** - Live command center with metrics and charts
- **🗺️ Map Integration** - Interactive map for exact victim location tracking
- **🚨 Incidents Feed** - Track and filter incidents by priority, status, district
- **📝 Report Emergency** - NLP-powered auto-categorization in English and Sinhala
- **📦 Donor Hub** - Smart matching between supply and demand

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + Database)
- React Leaflet (Maps)
- Recharts (Charts)
- Lucide React (Icons)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

MIT
