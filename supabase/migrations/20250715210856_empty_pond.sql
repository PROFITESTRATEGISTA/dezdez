/*
  # Fix Row Level Security Policies

  1. New Policies
    - Proper user isolation for all tables
    - Service role access for admin operations
    - Simplified policies using auth.uid() directly
  
  2. Security
    - Remove recursive policies
    - Ensure proper data isolation
    - Add admin access via service_role
*/

-- First, drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can manage own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins can manage all emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Users can manage own emergency contacts" ON public.emergency_contacts;
DROP POLICY IF EXISTS "Admins can manage all beneficiaries" ON public.beneficiaries;
DROP POLICY IF EXISTS "Users can manage own beneficiaries" ON public.beneficiaries;
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documents;
DROP POLICY IF EXISTS "Users can manage own documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can manage all medical history" ON public.medical_history;
DROP POLICY IF EXISTS "Users can manage own medical history" ON public.medical_history;
DROP POLICY IF EXISTS "Admins can manage plans" ON public.plans;
DROP POLICY IF EXISTS "Anyone can read active plans" ON public.plans;
DROP POLICY IF EXISTS "Admins can manage all user plans" ON public.user_plans;
DROP POLICY IF EXISTS "Users can read own plans" ON public.user_plans;
DROP POLICY IF EXISTS "Admins can manage all billing" ON public.billing;
DROP POLICY IF EXISTS "Users can read own billing" ON public.billing;
DROP POLICY IF EXISTS "Admins can manage all questionnaire responses" ON public.questionnaire_responses;
DROP POLICY IF EXISTS "Users can insert own questionnaire responses" ON public.questionnaire_responses;
DROP POLICY IF EXISTS "Users can read own questionnaire responses" ON public.questionnaire_responses;

-- Make sure RLS is enabled on all tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Service role full access" ON public.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- User profiles policies
CREATE POLICY "Service role full access" ON public.user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage own profile" ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Addresses policies
CREATE POLICY "Service role full access" ON public.addresses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage own addresses" ON public.addresses
  FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Emergency contacts policies
CREATE POLICY "Service role full access" ON public.emergency_contacts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage own emergency contacts" ON public.emergency_contacts
  FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Beneficiaries policies
CREATE POLICY "Service role full access" ON public.beneficiaries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage own beneficiaries" ON public.beneficiaries
  FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Documents policies
CREATE POLICY "Service role full access" ON public.documents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage own documents" ON public.documents
  FOR ALL
  TO authenticated
  USING (
    (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())) OR 
    (beneficiary_id IN (
      SELECT b.id 
      FROM public.beneficiaries b 
      JOIN public.users u ON b.user_id = u.id 
      WHERE u.auth_user_id = auth.uid()
    ))
  )
  WITH CHECK (
    (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())) OR 
    (beneficiary_id IN (
      SELECT b.id 
      FROM public.beneficiaries b 
      JOIN public.users u ON b.user_id = u.id 
      WHERE u.auth_user_id = auth.uid()
    ))
  );

-- Medical history policies
CREATE POLICY "Service role full access" ON public.medical_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage own medical history" ON public.medical_history
  FOR ALL
  TO authenticated
  USING (
    (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())) OR 
    (beneficiary_id IN (
      SELECT b.id 
      FROM public.beneficiaries b 
      JOIN public.users u ON b.user_id = u.id 
      WHERE u.auth_user_id = auth.uid()
    ))
  )
  WITH CHECK (
    (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())) OR 
    (beneficiary_id IN (
      SELECT b.id 
      FROM public.beneficiaries b 
      JOIN public.users u ON b.user_id = u.id 
      WHERE u.auth_user_id = auth.uid()
    ))
  );

-- Plans policies
CREATE POLICY "Service role full access" ON public.plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read active plans" ON public.plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User plans policies
CREATE POLICY "Service role full access" ON public.user_plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own plans" ON public.user_plans
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Billing policies
CREATE POLICY "Service role full access" ON public.billing
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own billing" ON public.billing
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Questionnaire responses policies
CREATE POLICY "Service role full access" ON public.questionnaire_responses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can insert own questionnaire responses" ON public.questionnaire_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read own questionnaire responses" ON public.questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Create a trigger function to automatically create empty profile for new users
CREATE OR REPLACE FUNCTION create_empty_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
DROP TRIGGER IF EXISTS create_empty_user_profile_trigger ON public.users;
CREATE TRIGGER create_empty_user_profile_trigger
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION create_empty_user_profile();

-- Create update timestamp triggers for all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addresses_updated_at ON public.addresses;
CREATE TRIGGER update_addresses_updated_at
BEFORE UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_emergency_contacts_updated_at ON public.emergency_contacts;
CREATE TRIGGER update_emergency_contacts_updated_at
BEFORE UPDATE ON public.emergency_contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_beneficiaries_updated_at ON public.beneficiaries;
CREATE TRIGGER update_beneficiaries_updated_at
BEFORE UPDATE ON public.beneficiaries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_medical_history_updated_at ON public.medical_history;
CREATE TRIGGER update_medical_history_updated_at
BEFORE UPDATE ON public.medical_history
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_plans_updated_at ON public.plans;
CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_plans_updated_at ON public.user_plans;
CREATE TRIGGER update_user_plans_updated_at
BEFORE UPDATE ON public.user_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_updated_at ON public.billing;
CREATE TRIGGER update_billing_updated_at
BEFORE UPDATE ON public.billing
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questionnaire_responses_updated_at ON public.questionnaire_responses;
CREATE TRIGGER update_questionnaire_responses_updated_at
BEFORE UPDATE ON public.questionnaire_responses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();