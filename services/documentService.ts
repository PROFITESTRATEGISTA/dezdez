import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  userId: string;
  documentType: 'rg' | 'cnh';
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
  updatedAt?: string;
}

export class DocumentService {
  // Obter todos os documentos do usuário
  static async getUserDocuments(userId: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      
      // Converter para o formato da interface Document
      return (data || []).map(doc => ({
        id: doc.id,
        userId: doc.user_id,
        documentType: doc.document_type as 'rg' | 'cnh',
        fileName: doc.file_name,
        fileUrl: doc.file_url,
        fileSize: doc.file_size,
        mimeType: doc.mime_type,
        status: doc.status as 'pending' | 'approved' | 'rejected',
        rejectionReason: doc.rejection_reason,
        uploadedAt: doc.uploaded_at,
        updatedAt: doc.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      return [];
    }
  }

  // Obter documento específico
  static async getDocument(documentId: string): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        userId: data.user_id,
        documentType: data.document_type as 'rg' | 'cnh',
        fileName: data.file_name,
        fileUrl: data.file_url,
        fileSize: data.file_size,
        mimeType: data.mime_type,
        status: data.status as 'pending' | 'approved' | 'rejected',
        rejectionReason: data.rejection_reason,
        uploadedAt: data.uploaded_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      return null;
    }
  }

  // Fazer upload de documento
  static async uploadDocument(
    userId: string,
    file: File,
    documentType: 'rg' | 'cnh'
  ): Promise<Document | null> {
    try {
      // 1. Fazer upload do arquivo para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `documents/${userId}/${documentType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obter URL pública do arquivo
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      // 3. Salvar referência no banco de dados
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          file_name: file.name,
          file_url: fileUrl,
          file_size: file.size,
          mime_type: file.type,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        documentType: data.document_type,
        fileName: data.file_name,
        fileUrl: data.file_url,
        fileSize: data.file_size,
        mimeType: data.mime_type,
        status: data.status,
        uploadedAt: data.uploaded_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao fazer upload de documento:', error);
      return null;
    }
  }

  // Excluir documento
  static async deleteDocument(documentId: string): Promise<boolean> {
    try {
      // 1. Obter informações do documento
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Extrair o caminho do arquivo da URL
      const fileUrl = document.file_url;
      const storageUrl = supabase.storage.url('');
      const filePath = fileUrl.replace(storageUrl, '');
      
      // Remover o prefixo do bucket se existir
      const pathParts = filePath.split('/');
      const bucketName = pathParts[0];
      const actualPath = pathParts.slice(1).join('/');

      // 3. Excluir o arquivo do storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([actualPath]);

      if (storageError) {
        console.warn('Erro ao excluir arquivo do storage:', storageError);
        // Continuar mesmo se falhar a exclusão do storage
      }

      // 4. Excluir o registro do banco de dados
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;
      return true;
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      return false;
    }
  }
}