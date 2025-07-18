/*
  # Create questionnaire_responses table

  1. New Tables
    - `questionnaire_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `responses` (jsonb)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `questionnaire_responses` table
    - Add policy for users to read their own responses
    - Add policy for admins to read all responses
*/

CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  responses jsonb NOT NULL,
  completed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Trigger for updating updated_at column
CREATE TRIGGER update_questionnaire_responses_updated_at
BEFORE UPDATE ON questionnaire_responses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Policy for users to read their own responses
CREATE POLICY "Users can read own questionnaire responses"
  ON questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Policy for users to insert their own responses
CREATE POLICY "Users can insert own questionnaire responses"
  ON questionnaire_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Policy for admins to manage all responses
CREATE POLICY "Admins can manage all questionnaire responses"
  ON questionnaire_responses
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND is_admin = true
  ));

-- Create index for faster lookups
CREATE INDEX idx_questionnaire_responses_user_id ON questionnaire_responses(user_id);