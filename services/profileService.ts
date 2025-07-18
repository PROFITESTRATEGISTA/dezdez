import { supabase } from '../lib/supabase';

export interface UserProfileData {
  name?: string;
  fullName?: string;
  cpf: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export class ProfileService {
  // Obter perfil completo do usuário
  static async getUserProfile(userId: string): Promise<UserProfileData | null> {
    try {
      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name, phone, cpf')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      if (!userData) return null;

      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Buscar endereço principal
      const { data: addressData } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .single();

      // Buscar contato de emergência principal
      const { data: contactData } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .single();

      // Construir objeto de retorno
      return {
        fullName: userData.full_name || '',
        cpf: userData.cpf || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: {
          street: addressData?.street || '',
          number: addressData?.number || '',
          complement: addressData?.complement || '',
          neighborhood: addressData?.neighborhood || '',
          city: addressData?.city || '',
          state: addressData?.state || '',
          zipCode: addressData?.zip_code || ''
        },
        emergencyContact: {
          name: contactData?.name || '',
          phone: contactData?.phone || '',
          relationship: contactData?.relationship || ''
        }
      };
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  }

  // Atualizar perfil do usuário
  static async updateUserProfile(userId: string, profileData: UserProfileData): Promise<boolean> {
    try {
      console.log('Atualizando perfil para usuário:', userId);
      console.log('Dados recebidos:', profileData);
      
      // Atualizar dados básicos do usuário
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: profileData.fullName || profileData.name,
          phone: profileData.phone,
          cpf: profileData.cpf
        })
        .eq('id', userId);

      if (userError) {
        console.error('Erro ao atualizar usuário:', userError);
        throw userError;
      }

      // Verificar se já existe um perfil
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      // Atualizar ou inserir perfil
      if (existingProfile) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ date_of_birth: new Date().toISOString() })
          .eq('id', existingProfile.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
          throw profileError;
        }
      } else {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            date_of_birth: new Date().toISOString()
          });

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw profileError;
        }
      }

      // Verificar se já existe um endereço
      const { data: existingAddress } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .single();

      // Atualizar ou inserir endereço
      if (existingAddress) {
        const { error: addressError } = await supabase
          .from('addresses')
          .update({
            street: profileData.address.street,
            number: profileData.address.number,
            complement: profileData.address.complement,
            neighborhood: profileData.address.neighborhood,
            city: profileData.address.city,
            state: profileData.address.state,
            zip_code: profileData.address.zipCode
          })
          .eq('id', existingAddress.id);

        if (addressError) {
          console.error('Erro ao atualizar endereço:', addressError);
          throw addressError;
        }
      } else {
        const { error: addressError } = await supabase
          .from('addresses')
          .insert({
            user_id: userId,
            street: profileData.address.street,
            number: profileData.address.number,
            complement: profileData.address.complement,
            neighborhood: profileData.address.neighborhood,
            city: profileData.address.city,
            state: profileData.address.state,
            zip_code: profileData.address.zipCode,
            is_primary: true
          });

        if (addressError) {
          console.error('Erro ao criar endereço:', addressError);
          throw addressError;
        }
      }

      // Verificar se já existe um contato de emergência
      const { data: existingContact } = await supabase
        .from('emergency_contacts')
        .select('id')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .single();

      // Atualizar ou inserir contato de emergência
      if (existingContact) {
        const { error: contactError } = await supabase
          .from('emergency_contacts')
          .update({
            name: profileData.emergencyContact.name,
            phone: profileData.emergencyContact.phone,
            relationship: profileData.emergencyContact.relationship
          })
          .eq('id', existingContact.id);

        if (contactError) {
          console.error('Erro ao atualizar contato de emergência:', contactError);
          throw contactError;
        }
      } else {
        const { error: contactError } = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: userId,
            name: profileData.emergencyContact.name,
            phone: profileData.emergencyContact.phone,
            relationship: profileData.emergencyContact.relationship,
            is_primary: true
          });

        if (contactError) {
          console.error('Erro ao criar contato de emergência:', contactError);
          throw contactError;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      return false;
    }
  }

  // Obter o ID do usuário a partir do auth_user_id
  static async getUserIdFromAuth(authUserId: string): Promise<string | null> {
    try {
      console.log('Buscando ID do usuário para auth_user_id:', authUserId);
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.error('Erro ao buscar ID do usuário:', error);
        throw error;
      }
      
      console.log('ID do usuário encontrado:', data?.id);
      return data?.id || null;
    } catch (error) {
      console.error('Erro ao buscar ID do usuário:', error);
      return null;
    }
  }

  // Método alternativo para salvar perfil (usando dados mockados para demonstração)
  static async saveProfileMock(profileData: UserProfileData): Promise<boolean> {
    try {
      console.log('Salvando perfil (mock):', profileData);
      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salva no localStorage para persistir entre recarregamentos
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil (mock):', error);
      return false;
    }
  }

  // Método alternativo para carregar perfil (usando dados mockados para demonstração)
  static async loadProfileMock(): Promise<UserProfileData | null> {
    try {
      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Tenta carregar do localStorage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
      
      // Retorna perfil padrão se não houver dados salvos
      return null;
    } catch (error) {
      console.error('Erro ao carregar perfil (mock):', error);
      return null;
    }
  }
}