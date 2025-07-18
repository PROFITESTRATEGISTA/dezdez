/*
  # Fix infinite recursion in users RLS policies

  1. Security Changes
    - Drop all existing RLS policies on users table that cause recursion
    - Create new simplified policies that don't reference the users table in their conditions
    - Use auth.uid() directly instead of subqueries to users table

  2. Policy Changes
    - Users can read their own data using auth.uid() = auth_user_id
    - Users can update their own data using the same condition
    - Service role has full access
    - Remove admin policies that cause recursion by checking is_admin in users table
*/

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

-- Create simple, non-recursive policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role full access"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert their own profile during registration
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());