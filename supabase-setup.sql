-- Create waitlist table
CREATE TABLE public.waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anonymous users to insert their email (for waitlist signup)
CREATE POLICY "Allow anonymous inserts" ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all waitlist entries (for admin purposes)
CREATE POLICY "Allow authenticated users to view all" ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anonymous users to count waitlist entries (for social proof)
CREATE POLICY "Allow anonymous count" ON public.waitlist
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to delete entries (for admin cleanup if needed)
CREATE POLICY "Allow authenticated users to delete" ON public.waitlist
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster email lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at DESC);