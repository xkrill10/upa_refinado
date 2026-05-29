import { supabase } from './supabase';

export interface SendMessagePayload {
  targetSector: string;
  messageType: 'push' | 'sms' | 'whatsapp';
  content: string;
  priority?: 'normal' | 'high' | 'critical';
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  timestamp: string;
  error?: string;
}

/**
 * Insere a mensagem na tabela 'notifications' do Supabase.
 * A partir daqui, as Edge Functions/Triggers do Supabase 
 * assumem o disparo para os celulares.
 */
export const sendPushNotification = async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        { 
          target_sector: payload.targetSector, 
          message_type: payload.messageType, 
          content: payload.content,
          priority: payload.priority || 'normal',
          status: 'pending' // status inicial
        }
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      messageId: data?.[0]?.id,
      timestamp: new Date().toISOString(),
    };
  } catch (err: unknown) {
    console.error('Erro detalhado do Supabase:', err);
    throw new Error(err instanceof Error ? err.message : 'Falha ao registrar notificação no banco de dados. Verifique a conexão.');
  }
};
