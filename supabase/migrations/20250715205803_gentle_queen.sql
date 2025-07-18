/*
  # Fix Users RLS Policies

  1. Changes
    - Drop existing policies that cause infinite recursion
    - Create new simplified policies that don't cause recursion
    - Add service role policy for admin operations
    - Add insert policy for user profile creation
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;

-- Create new policies that don't cause recursion
-- Service role can do everything
CREATE POLICY "Service role can manage all users" 
ON public.users FOR ALL 
TO service_role
USING (true);

-- Users can read their own data
CREATE POLICY "Users can read own data" 
ON public.users FOR SELECT 
TO authenticated
USING (auth_user_id = auth.uid());

-- Users can update their own data
CREATE POLICY "Users can update own data" 
ON public.users FOR UPDATE 
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.users FOR INSERT 
TO authenticated
WITH CHECK (auth_user_id = auth.uid());