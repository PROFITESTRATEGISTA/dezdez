/*
  # Funções para gerenciamento de documentos com RLS
  
  1. Novas Funções
    - get_all_documents_with_details: Retorna todos os documentos com detalhes de usuários e beneficiários
    - approve_document: Aprova um documento
    - reject_document: Rejeita um documento com motivo
  
  2. Segurança
    - Funções com SECURITY DEFINER para contornar RLS quando necessário
    - Verificação de permissões administrativas
*/

-- Função para obter todos os documentos com detalhes
CREATE OR REPLACE FUNCTION get_all_documents_with_details()
RETURNS SETOF json AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem listar todos os documentos';
  END IF;
  
  RETURN QUERY
  SELECT json_build_object(
    'id', d.id,
    'document_type', d.document_type,
    'file_name', d.file_name,
    'file_url', d.file_url,
    'file_size', d.file_size,
    'mime_type', d.mime_type,
    'status', d.status,
    'rejection_reason', d.rejection_reason,
    'uploaded_at', d.uploaded_at,
    'reviewed_at', d.reviewed_at,
    'reviewed_by', d.reviewed_by,
    'user', CASE 
      WHEN d.user_id IS NOT NULL THEN (
        SELECT json_build_object(
          'id', u.id,
          'full_name', u.full_name,
          'email', u.email
        )
        FROM users u
        WHERE u.id = d.user_id
      )
      ELSE NULL
    END,
    'beneficiary', CASE
      WHEN d.beneficiary_id IS NOT NULL THEN (
        SELECT json_build_object(
          'id', b.id,
          'full_name', b.full_name,
          'user_id', b.user_id,
          'user', (
            SELECT json_build_object(
              'full_name', u.full_name
            )
            FROM users u
            WHERE u.id = b.user_id
          )
        )
        FROM beneficiaries b
        WHERE b.id = d.beneficiary_id
      )
      ELSE NULL
    END
  )
  FROM documents d
  ORDER BY d.uploaded_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aprovar um documento
CREATE OR REPLACE FUNCTION approve_document(
  document_id UUID,
  reviewer_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem aprovar documentos';
  END IF;
  
  UPDATE documents
  SET 
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = reviewer_id,
    rejection_reason = NULL
  WHERE id = document_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para rejeitar um documento
CREATE OR REPLACE FUNCTION reject_document(
  document_id UUID,
  reviewer_id UUID,
  reason TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem rejeitar documentos';
  END IF;
  
  UPDATE documents
  SET 
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = reviewer_id,
    rejection_reason = reason
  WHERE id = document_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;