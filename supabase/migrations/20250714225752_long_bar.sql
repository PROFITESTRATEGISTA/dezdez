/*
  # Create comprehensive user management system

  1. New Tables
    - `users` - Main user/client table with authentication and basic info
    - `user_profiles` - Extended profile information including medical history
    - `addresses` - User addresses with full details
    - `emergency_contacts` - Emergency contact information
    - `beneficiaries` - Dependents/beneficiaries linked to users
    - `documents` - Document management for users and beneficiaries
    - `plans` - Available insurance plans
    - `user_plans` - User plan subscriptions
    - `billing` - Billing and payment information
    - `medical_history` - Detailed medical history and health observations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Admin policies for management access
*/

-- Create enum types
CREATE TYPE user_status AS ENUM ('active', 'pending_documents', 'pending_signature', 'inactive');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected', 'missing');
CREATE TYPE document_type AS ENUM ('rg', 'cpf', 'proof_of_address', 'birth_certificate', 'other');
CREATE TYPE plan_type AS ENUM ('monthly', 'annual', 'biannual');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue', 'failed');
CREATE TYPE billing_method AS ENUM ('credit_card', 'debit_card', 'pix', 'bank_slip');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  cpf text UNIQUE,
  status user_status DEFAULT 'pending_documents',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles with extended information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth date,
  gender text,
  occupation text,
  marital_status text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  street text NOT NULL,
  number text NOT NULL,
  complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text DEFAULT 'Brasil',
  is_primary boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text NOT NULL,
  phone text NOT NULL,
  email text,
  is_primary boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Beneficiaries/Dependents
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  cpf text,
  date_of_birth date NOT NULL,
  relationship text NOT NULL,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents for users and beneficiaries
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  status document_status DEFAULT 'pending',
  rejection_reason text,
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  
  -- Ensure document belongs to either user or beneficiary, not both
  CONSTRAINT documents_owner_check CHECK (
    (user_id IS NOT NULL AND beneficiary_id IS NULL) OR 
    (user_id IS NULL AND beneficiary_id IS NOT NULL)
  )
);

-- Medical history and health information
CREATE TABLE IF NOT EXISTS medical_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  beneficiary_id uuid REFERENCES beneficiaries(id) ON DELETE CASCADE,
  condition_name text NOT NULL,
  description text,
  severity text,
  medications text[],
  allergies text[],
  limitations text,
  observations text,
  diagnosed_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure medical history belongs to either user or beneficiary
  CONSTRAINT medical_history_owner_check CHECK (
    (user_id IS NOT NULL AND beneficiary_id IS NULL) OR 
    (user_id IS NULL AND beneficiary_id IS NOT NULL)
  )
);

-- Available plans
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price decimal(10,2) NOT NULL,
  age_min integer DEFAULT 0,
  age_max integer DEFAULT 120,
  coverage_details jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User plan subscriptions
CREATE TABLE IF NOT EXISTS user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES plans(id),
  plan_type plan_type NOT NULL,
  monthly_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  auto_renewal boolean DEFAULT false,
  is_active boolean DEFAULT true,
  contract_signed_at timestamptz,
  contract_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Billing and payments
CREATE TABLE IF NOT EXISTS billing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  user_plan_id uuid REFERENCES user_plans(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'BRL',
  status payment_status DEFAULT 'pending',
  payment_method billing_method,
  due_date date NOT NULL,
  paid_at timestamptz,
  stripe_payment_intent_id text,
  failure_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id OR is_admin = true);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Admin policies for users
CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for addresses
CREATE POLICY "Users can manage own addresses"
  ON addresses
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all addresses"
  ON addresses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can manage own emergency contacts"
  ON emergency_contacts
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all emergency contacts"
  ON emergency_contacts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for beneficiaries
CREATE POLICY "Users can manage own beneficiaries"
  ON beneficiaries
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all beneficiaries"
  ON beneficiaries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can manage own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    ) OR
    beneficiary_id IN (
      SELECT b.id FROM beneficiaries b
      JOIN users u ON b.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for medical_history
CREATE POLICY "Users can manage own medical history"
  ON medical_history
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    ) OR
    beneficiary_id IN (
      SELECT b.id FROM beneficiaries b
      JOIN users u ON b.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all medical history"
  ON medical_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for plans (public read, admin write)
CREATE POLICY "Anyone can read active plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage plans"
  ON plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for user_plans
CREATE POLICY "Users can read own plans"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all user plans"
  ON user_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for billing
CREATE POLICY "Users can read own billing"
  ON billing
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all billing"
  ON billing
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() AND is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_user_id ON beneficiaries(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_beneficiary_id ON documents(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_medical_history_user_id ON medical_history(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_beneficiary_id ON medical_history(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_active ON user_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_billing_user_id ON billing(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_status ON billing(status);
CREATE INDEX IF NOT EXISTS idx_billing_stripe_customer ON billing(stripe_customer_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_history_updated_at BEFORE UPDATE ON medical_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON billing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();