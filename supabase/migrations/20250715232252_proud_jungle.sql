/*
  # Sistema de Documentos em Produção
  
  1. Nova Tabela
    - `documents` - Armazena documentos dos usuários com separação por tipo (RG/CNH)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `document_type` (text) - 'rg' ou 'cnh'
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (integer)
      - `mime_type` (text)
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `rejection_reason` (text, nullable)
      - `uploaded_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `documents` table
    - Add policy for authenticated users to manage their own documents
    - Add policy for service role to have full access
*/

-- Criar tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('rg', 'cnh')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- Habilitar RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados gerenciarem seus próprios documentos
CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  );

-- Política para o service role ter acesso completo
CREATE POLICY "Service role has full access to documents"
  ON documents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_documents_updated_at();