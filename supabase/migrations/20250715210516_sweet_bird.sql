/*
  # Fix RLS policies for users table

  1. Changes
    - Drop existing policies that might cause recursion issues
    - Create simplified policies for users table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Create new simplified policies
CREATE POLICY "Service role can manage all users"
ON public.users
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Admins can read all users
CREATE POLICY "Admins can read all users"
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_user_id = auth.uid() AND is_admin = true
  )
);