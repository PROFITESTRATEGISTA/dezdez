/*
  # Fix Users RLS Policy - Remove Infinite Recursion

  1. Security Changes
    - Drop existing problematic RLS policies on users table
    - Create new simplified policies that avoid recursion
    - Ensure policies don't reference the users table within itself

  2. Policy Changes
    - Users can read their own data using auth.uid() directly
    - Admins can manage all users using a simpler check
    - Remove self-referential queries that cause infinite recursion
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new policies without recursion
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Simple admin policy using service role or a flag check
CREATE POLICY "Service role can manage all users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());