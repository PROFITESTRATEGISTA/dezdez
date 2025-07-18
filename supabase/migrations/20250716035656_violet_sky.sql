/*
  # Funções para gerenciamento de usuários com RLS
  
  1. Novas Funções
    - get_all_users_with_beneficiaries: Retorna todos os usuários com seus beneficiários
    - update_user_role: Atualiza o papel de um usuário
    - update_user_status: Atualiza o status de um usuário
  
  2. Segurança
    - Funções com SECURITY DEFINER para contornar RLS quando necessário
    - Verificação de permissões administrativas
*/

-- Função para obter todos os usuários com seus beneficiários
CREATE OR REPLACE FUNCTION get_all_users_with_beneficiaries()
RETURNS SETOF json AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem listar todos os usuários';
  END IF;
  
  RETURN QUERY
  SELECT json_build_object(
    'id', u.id,
    'auth_user_id', u.auth_user_id,
    'email', u.email,
    'full_name', u.full_name,
    'phone', u.phone,
    'cpf', u.cpf,
    'status', u.status,
    'is_admin', u.is_admin,
    'role', u.role,
    'created_at', u.created_at,
    'updated_at', u.updated_at,
    'beneficiaries', (
      SELECT json_agg(b)
      FROM beneficiaries b
      WHERE b.user_id = u.id
    )
  )
  FROM users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar o papel de um usuário
CREATE OR REPLACE FUNCTION update_user_role(
  user_id UUID,
  new_role TEXT,
  is_admin_val BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem atualizar papéis de usuários';
  END IF;
  
  UPDATE users
  SET 
    role = new_role,
    is_admin = is_admin_val,
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar o status de um usuário
CREATE OR REPLACE FUNCTION update_user_status(
  user_id UUID,
  new_status TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_current_user_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem atualizar status de usuários';
  END IF;
  
  UPDATE users
  SET 
    status = new_status,
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;