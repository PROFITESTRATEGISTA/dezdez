/*
  # Conceder acesso de administrador

  1. Alterações
     - Atualiza o usuário pedropardal04@gmail.com para ter permissões de administrador
     - Define o campo is_admin como true para este usuário
     - Adiciona o role 'ADMIN' para este usuário
*/

-- Atualiza o usuário para ter permissões de administrador
UPDATE public.users
SET is_admin = true
WHERE email = 'pedropardal04@gmail.com';

-- Adiciona um registro na tabela de roles (se existir)
DO $$
BEGIN
    -- Verifica se a tabela user_roles existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        -- Verifica se o usuário já tem o role ADMIN
        IF NOT EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.users u ON ur.user_id = u.id
            WHERE u.email = 'pedropardal04@gmail.com' AND ur.role = 'ADMIN'
        ) THEN
            -- Adiciona o role ADMIN para o usuário
            INSERT INTO public.user_roles (user_id, role)
            SELECT id, 'ADMIN' FROM public.users WHERE email = 'pedropardal04@gmail.com';
        END IF;
    END IF;
END $$;

-- Cria uma função para verificar se um usuário é administrador
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = user_id AND is_admin = true
    );
END;
$$;

-- Cria uma função para verificar se o usuário autenticado é administrador
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    current_user_id uuid;
BEGIN
    -- Obtém o ID do usuário autenticado
    SELECT auth.uid() INTO current_user_id;
    
    -- Verifica se o usuário é administrador
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE auth_user_id = current_user_id AND is_admin = true
    );
END;
$$;

-- Adiciona uma política para permitir que administradores acessem todos os dados
DO $$
BEGIN
    -- Verifica se a política já existe para a tabela users
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Admins can access all users'
    ) THEN
        CREATE POLICY "Admins can access all users" 
        ON public.users
        FOR ALL
        TO authenticated
        USING (is_current_user_admin());
    END IF;
END $$;