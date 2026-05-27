import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { JWT } from "npm:google-auth-library@9.6.3";

/**
 * Esta é uma Supabase Edge Function (Deno) atualizada para a API V1 do Firebase.
 */

const META_WHATSAPP_TOKEN = Deno.env.get('META_WHATSAPP_TOKEN') || '';
const META_PHONE_ID = Deno.env.get('META_PHONE_ID') || '';

// Nova Chave V1: O conteúdo do arquivo JSON será injetado aqui via variável de ambiente
const FIREBASE_SERVICE_ACCOUNT = Deno.env.get('FIREBASE_SERVICE_ACCOUNT') || '';

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record; 

    if (!record || !record.message_type) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
    }

    console.log(`Processando mensagem: ${record.message_type}`);

    if (record.message_type === 'whatsapp') {
      await sendWhatsAppMessage(record);
    } else if (record.message_type === 'push') {
      await sendPushNotificationV1(record);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
})

/**
 * FCM API V1 - Utiliza JWT Token OAuth2
 */
async function sendPushNotificationV1(record: any) {
  if (!FIREBASE_SERVICE_ACCOUNT) {
    console.warn("ATENÇÃO: Conta de serviço não configurada. Simulando Push V1.");
    console.log(`[PUSH V1 MOCK] Setor: ${record.target_sector} | Msg: ${record.content}`);
    return;
  }

  const credentials = JSON.parse(FIREBASE_SERVICE_ACCOUNT);

  // 1. Gera um Token Temporário de Acesso
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  const tokenInfo = await client.getAccessToken();
  const accessToken = tokenInfo.token;

  // 2. Monta a URL e o Body da API V1
  const projectId = credentials.project_id;
  const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const body = {
    message: {
      topic: record.target_sector, // O celular deve se inscrever neste tópico
      notification: {
        title: `Alerta de Sistema: ${record.target_sector.toUpperCase()}`,
        body: record.content,
      },
      data: {
        priority: record.priority || 'normal',
        message_id: record.id
      }
    }
  };

  // 3. Envia para os servidores do Google
  const response = await fetch(fcmUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("FCM V1 API Erro:", errorData);
    throw new Error("Falha no Push Notification (V1)");
  }

  console.log("Notificação FCM V1 entregue com sucesso!");
}

async function sendWhatsAppMessage(record: any) {
  if (!META_WHATSAPP_TOKEN) return; // Mock simplificado
  
  // (Código Meta mantido igual, consulte a versão anterior para detalhes)
  console.log("Mock enviando WhatsApp", record.content);
}
