import { supabase } from '../lib/supabase';

export interface QuestionnaireResponse {
  userId: string;
  responses: Record<string, string | string[] | number | boolean>;
  completedAt: string;
}

export class QuestionnaireService {
  // Salvar respostas do questionário
  static async saveResponses(data: QuestionnaireResponse): Promise<{ success: boolean; error?: string }> {
    try {
      // Obter o ID do usuário a partir do auth_user_id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }
      
      // Buscar o ID do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();
      
      if (userError || !userData) {
        console.error('Erro ao buscar ID do usuário:', userError);
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      // Inserir as respostas do questionário
      const { error } = await supabase
        .from('medical_questionnaires')
        .insert({
          user_id: userData.id,
          responses: data.responses,
          completed_at: data.completedAt || new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar questionário:', error);
        return { success: false, error: error.message };
      }
      
      // Extrair e salvar condições médicas do questionário
      await this.extractAndSaveMedicalHistory(userData.id, data.responses);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar respostas do questionário:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  // Extrair e salvar histórico médico a partir das respostas do questionário
  private static async extractAndSaveMedicalHistory(
    userId: string, 
    responses: Record<string, any>
  ): Promise<void> {
    try {
      // Verificar se há condições crônicas selecionadas
      if (responses.chronic_conditions && Array.isArray(responses.chronic_conditions)) {
        for (const condition of responses.chronic_conditions) {
          if (condition !== 'Nenhuma das anteriores') {
            await supabase.from('medical_history').insert({
              user_id: userId,
              condition_name: condition,
              severity: 'medium',
              diagnosed_date: new Date().toISOString().split('T')[0],
              is_active: true
            });
          }
        }
      }
      
      // Verificar alergias
      if (responses.allergies === 'Sim' && responses.allergy_details) {
        await supabase.from('medical_history').insert({
          user_id: userId,
          condition_name: 'Alergias',
          description: responses.allergy_details,
          severity: 'medium',
          diagnosed_date: new Date().toISOString().split('T')[0],
          is_active: true
        });
      }
      
      // Verificar medicamentos
      if (responses.medications === 'Sim' && responses.medication_list) {
        await supabase.from('medical_history').insert({
          user_id: userId,
          condition_name: 'Uso de medicamentos',
          description: responses.medication_list,
          medications: [responses.medication_list],
          severity: 'low',
          diagnosed_date: new Date().toISOString().split('T')[0],
          is_active: true
        });
      }
      
    } catch (error) {
      console.error('Erro ao extrair e salvar histórico médico:', error);
    }
  }

  // Verificar se o usuário já preencheu o questionário
  static async getQuestionnaireStatus(userId: string): Promise<{ completed: boolean; completedAt: string | null }> {
    try {
      const { data, error } = await supabase
        .from('medical_questionnaires')
        .select('completed_at')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 é o erro "no rows returned"
        console.error('Erro ao verificar status do questionário:', error);
        throw error;
      }
      
      return { 
        completed: !!data,
        completedAt: data?.completed_at || null
      };
    } catch (error) {
      console.error('Erro ao verificar status do questionário:', error);
      return { completed: false, completedAt: null };
    }
  }

  // Obter o histórico de questionários do usuário
  static async getQuestionnaireHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('medical_questionnaires')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar histórico de questionários:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de questionários:', error);
      return [];
    }
  }

  // Método para salvar questionário em modo de demonstração (sem Supabase)
  static async saveQuestionnaireDemo(responses: Record<string, any>): Promise<boolean> {
    try {
      // Simular atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvar no localStorage para persistência entre recarregamentos
      const savedQuestionnaires = JSON.parse(localStorage.getItem('medical_questionnaires') || '[]');
      
      const newQuestionnaire = {
        id: `q-${Date.now()}`,
        responses,
        completedAt: new Date().toISOString()
      };
      
      // Adicionar no início da lista (mais recente primeiro)
      savedQuestionnaires.unshift(newQuestionnaire);
      
      localStorage.setItem('medical_questionnaires', JSON.stringify(savedQuestionnaires));
      
      // Extrair e salvar condições médicas para exibição no histórico
      const medicalConditions = this.extractMedicalConditionsDemo(responses);
      localStorage.setItem('medical_history', JSON.stringify(medicalConditions));
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar questionário (demo):', error);
      return false;
    }
  }
  
  // Extrair condições médicas para modo demo
  static extractMedicalConditionsDemo(responses: Record<string, any>): any[] {
    const conditions = [];
    
    // Verificar se há condições crônicas selecionadas
    if (responses.chronic_conditions && Array.isArray(responses.chronic_conditions)) {
      responses.chronic_conditions.forEach((condition: string, index: number) => {
        if (condition !== 'Nenhuma das anteriores') {
          conditions.push({
            id: `chronic-${index}`,
            condition: condition,
            diagnosedDate: new Date().toISOString().split('T')[0],
            severity: 'medium'
          });
        }
      });
    }
    
    // Verificar histórico familiar
    if (responses.family_history && Array.isArray(responses.family_history)) {
      responses.family_history.forEach((condition: string, index: number) => {
        if (condition !== 'Nenhuma das anteriores' && condition !== 'Não sei informar') {
          conditions.push({
            id: `family-${index}`,
            condition: `Histórico familiar: ${condition}`,
            diagnosedDate: new Date().toISOString().split('T')[0],
            severity: 'low',
            notes: 'Condição presente na família'
          });
        }
      });
    }
    
    // Verificar alergias
    if (responses.allergies === 'Sim' && responses.allergy_details) {
      conditions.push({
        id: `allergies`,
        condition: 'Alergias',
        diagnosedDate: new Date().toISOString().split('T')[0],
        severity: 'medium',
        notes: responses.allergy_details
      });
    }
    
    // Verificar medicamentos
    if (responses.medications === 'Sim' && responses.medication_list) {
      conditions.push({
        id: `medications`,
        condition: 'Uso de medicamentos',
        diagnosedDate: new Date().toISOString().split('T')[0],
        severity: 'low',
        notes: responses.medication_list
      });
    }
    
    // Adicionar informações adicionais se existirem
    if (responses.additional_info && typeof responses.additional_info === 'string' && responses.additional_info.trim()) {
      conditions.push({
        id: `additional-info`,
        condition: 'Informações adicionais',
        diagnosedDate: new Date().toISOString().split('T')[0],
        severity: 'medium',
        notes: responses.additional_info
      });
    }
    
    return conditions;
  }
}