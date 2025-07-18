/*
  # Sistema de Questionário Médico

  1. Nova Tabela
    - `medical_questionnaires`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key para users)
      - `responses` (jsonb, armazena as respostas do questionário)
      - `completed_at` (timestamp, quando o questionário foi concluído)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `medical_questionnaires` table
    - Add policy for authenticated users to read/write their own questionnaires
    - Add policy for service role to have full access
*/

-- Criar tabela de questionários médicos
CREATE TABLE IF NOT EXISTS medical_questionnaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  responses jsonb NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_medical_questionnaires_user_id ON medical_questionnaires(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_questionnaires_completed_at ON medical_questionnaires(completed_at);

-- Habilitar RLS
ALTER TABLE medical_questionnaires ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Usuários autenticados podem ler seus próprios questionários
CREATE POLICY "Users can read own questionnaires"
  ON medical_questionnaires
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Usuários autenticados podem inserir seus próprios questionários
CREATE POLICY "Users can insert own questionnaires"
  ON medical_questionnaires
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Usuários autenticados podem atualizar seus próprios questionários
CREATE POLICY "Users can update own questionnaires"
  ON medical_questionnaires
  FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Service role tem acesso completo
CREATE POLICY "Service role has full access to questionnaires"
  ON medical_questionnaires
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_medical_questionnaires_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medical_questionnaires_updated_at
BEFORE UPDATE ON medical_questionnaires
FOR EACH ROW
EXECUTE FUNCTION update_medical_questionnaires_updated_at();