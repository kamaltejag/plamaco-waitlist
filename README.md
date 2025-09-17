# Plamaco Waitlist

A beautiful waitlist page for Plamaco - the smart food management app that helps you decide what to cook with available pantry ingredients while reducing food waste.

## Features

- Clean, responsive design using Plamaco's brand colors
- Email collection with validation
- Supabase integration for data storage
- Success state after signup
- Built with React, TypeScript, and Tailwind CSS
- Shadcn/ui components for consistent design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor to create the required table and policies.

### 3. Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Database Schema

The waitlist uses a simple table structure:

```sql
CREATE TABLE public.waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Design System

The app follows Plamaco's "Warm Productivity" design philosophy with these colors:

- **Primary**: Sage Green (#87A96B)
- **Secondary**: Terracotta (#D2691E)
- **Accent**: Soft Blue (#4A90B8)
- **Background**: Cream (#FAF7F0)
- **Typography**: Inter font family

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Supabase** - Backend and database
- **Lucide React** - Icons
