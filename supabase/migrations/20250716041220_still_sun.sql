/*
  # Funções para gerenciamento de contratos
  
  1. Novas Funções
    - `get_pending_contracts` - Retorna contratos pendentes ou filtrados por status
    - `send_contract_to_user` - Envia contrato para assinatura do usuário
  
  2. Segurança
    - Todas as funções são SECURITY DEFINER para contornar RLS
    - Verificações de permissão para garantir que apenas admins possam executar
*/

-- Função para obter contratos pendentes ou filtrados por status
CREATE OR REPLACE FUNCTION get_pending_contracts(status_filter text DEFAULT NULL)
RETURNS SETOF user_plans
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem acessar esta função';
  END IF;

  -- Retornar contratos filtrados por status
  RETURN QUERY
  SELECT up.*
  FROM user_plans up
  JOIN users u ON up.user_id = u.id
  LEFT JOIN plans p ON up.plan_id = p.id
  WHERE 
    (status_filter IS NULL OR 
     (CASE 
        WHEN status_filter = 'pending' THEN up.contract_signed_at IS NULL AND up.contract_url IS NULL
        WHEN status_filter = 'sent' THEN up.contract_signed_at IS NULL AND up.contract_url IS NOT NULL
        WHEN status_filter = 'signed' THEN up.contract_signed_at IS NOT NULL
        ELSE TRUE
      END))
  ORDER BY 
    CASE 
      WHEN up.contract_signed_at IS NULL AND up.contract_url IS NULL THEN 1 -- Pendentes primeiro
      WHEN up.contract_signed_at IS NULL AND up.contract_url IS NOT NULL THEN 2 -- Enviados depois
      ELSE 3 -- Assinados por último
    END,
    up.created_at DESC;
END;
$$;

-- Função para enviar contrato para assinatura
CREATE OR REPLACE FUNCTION send_contract_to_user(contract_id uuid, admin_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  contract_exists boolean;
  user_email text;
  contract_url text;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Apenas administradores podem enviar contratos';
  END IF;

  -- Verificar se o contrato existe
  SELECT EXISTS (
    SELECT 1 FROM user_plans WHERE id = contract_id
  ) INTO contract_exists;

  IF NOT contract_exists THEN
    RAISE EXCEPTION 'Contrato não encontrado';
  END IF;

  -- Obter email do usuário
  SELECT u.email 
  FROM user_plans up
  JOIN users u ON up.user_id = u.id
  WHERE up.id = contract_id
  INTO user_email;

  -- Gerar URL do contrato (em produção, isso seria integrado com um serviço de assinatura digital)
  contract_url := 'https://example.com/contracts/' || contract_id;

  -- Atualizar contrato com URL e marcar como enviado
  UPDATE user_plans
  SET 
    contract_url = contract_url,
    updated_at = now()
  WHERE id = contract_id;

  -- Em produção, aqui enviaria um email para o usuário com o link para assinatura
  
  RETURN TRUE;
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