/*
  # Configuração de RLS para documentos

  1. Novas Tabelas
    - `user_documents` - Armazena documentos enviados pelos usuários
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência para users)
      - `document_type` (text)
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (integer)
      - `mime_type` (text)
      - `status` (text)
      - `uploaded_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `user_documents` table
    - Add policies for authenticated users to manage their own documents
    - Add policies for service role to have full access
*/

-- Tabela de documentos do usuário
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  status text DEFAULT 'pending',
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Trigger para atualizar o timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_documents_updated_at
BEFORE UPDATE ON user_documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Políticas de RLS
-- Usuários autenticados podem ver seus próprios documentos
CREATE POLICY "Users can view their own documents"
ON user_documents
FOR SELECT
TO authenticated
USING (user_id IN (
  SELECT id FROM users WHERE auth_user_id = auth.uid()
));

-- Usuários autenticados podem inserir seus próprios documentos
CREATE POLICY "Users can insert their own documents"
ON user_documents
FOR INSERT
TO authenticated
WITH CHECK (user_id IN (
  SELECT id FROM users WHERE auth_user_id = auth.uid()
));

-- Usuários autenticados podem atualizar seus próprios documentos
CREATE POLICY "Users can update their own documents"
ON user_documents
FOR UPDATE
TO authenticated
USING (user_id IN (
  SELECT id FROM users WHERE auth_user_id = auth.uid()
))
WITH CHECK (user_id IN (
  SELECT id FROM users WHERE auth_user_id = auth.uid()
));

-- Usuários autenticados podem excluir seus próprios documentos
CREATE POLICY "Users can delete their own documents"
ON user_documents
FOR DELETE
TO authenticated
USING (user_id IN (
  SELECT id FROM users WHERE auth_user_id = auth.uid()
));

-- Acesso completo para o service role
CREATE POLICY "Service role has full access to documents"
ON user_documents
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Índices para melhorar performance
CREATE INDEX idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX idx_user_documents_status ON user_documents(status);
CREATE INDEX idx_user_documents_document_type ON user_documents(document_type);