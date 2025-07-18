/*
  # Atualização das funções de gerenciamento de documentos
  
  1. Novas Funções
    - `get_pending_documents_with_details` - Retorna apenas documentos pendentes com detalhes
  
  2. Segurança
    - Todas as funções são SECURITY DEFINER para contornar RLS
    - Verificações de permissão para garantir que apenas admins possam executar
*/

-- Função para obter apenas documentos pendentes com detalhes
CREATE OR REPLACE FUNCTION get_pending_documents_with_details(status_filter text DEFAULT 'pending')
RETURNS SETOF documents
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem acessar esta função';
  END IF;

  -- Retornar documentos pendentes com detalhes
  RETURN QUERY
  SELECT d.*
  FROM documents d
  LEFT JOIN users u ON d.user_id = u.id
  LEFT JOIN beneficiaries b ON d.beneficiary_id = b.id
  WHERE 
    d.status = status_filter
  ORDER BY d.uploaded_at DESC;
END;
$$;

-- Função para verificar se o usuário atual é admin (caso ainda não exista)
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT u.is_admin INTO is_admin
  FROM users u
  WHERE u.auth_user_id = auth.uid();
  
  RETURN COALESCE(is_admin, false);
END;
$$;