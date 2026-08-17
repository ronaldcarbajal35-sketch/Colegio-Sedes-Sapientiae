// Edge Function: enviar-whatsapp (Deno)
// Envío de notificaciones de comunicados y recordatorios de pago vía WhatsApp Business Cloud API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tipo, comunicado_id, pago_id, telefono_destinatario, mensaje_personalizado } = await req.json();

    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN') ?? 'MOCK_TOKEN';
    const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') ?? 'MOCK_PHONE_ID';

    let textoEnvio = mensaje_personalizado || '';
    let destinatario = telefono_destinatario || '';

    // Si es un comunicado, buscar el texto y los apoderados correspondientes
    if (tipo === 'comunicado' && comunicado_id) {
      const { data: com, error: comErr } = await supabaseClient
        .from('comunicados')
        .select('*')
        .eq('id', comunicado_id)
        .single();

      if (comErr) throw comErr;

      textoEnvio = `📢 *COLEGIO SEDES SAPIENTIAE*\n\n*${com.titulo}*\n\n${com.contenido}\n\n_Categoría: ${com.categoria}_`;
    }

    // Si es recordatorio de pago
    if (tipo === 'recordatorio_pago' && pago_id) {
      const { data: pago, error: pagoErr } = await supabaseClient
        .from('pagos')
        .select('*, alumnos(nombres, apellidos, apoderados(perfiles(nombre, telefono)))')
        .eq('id', pago_id)
        .single();

      if (pagoErr) throw pagoErr;

      const alumnoNom = `${pago.alumnos?.nombres} ${pago.alumnos?.apellidos}`;
      const apoderadoTel = pago.alumnos?.apoderados?.perfiles?.telefono;
      if (apoderadoTel) destinatario = apoderadoTel;

      textoEnvio = `💳 *RECORDATORIO DE PAGO - SEDES SAPIENTIAE*\n\nEstimado apoderado de *${alumnoNom}*:\nLe recordamos que el concepto *${pago.concepto}* por un monto de *S/ ${pago.monto}* vence el *${pago.fecha_vencimiento}*.\n\nPuede abonar de manera segura desde la plataforma escolar.`;
    }

    // Simulación / Llamada real a WhatsApp Graph API
    let metaResponse = { simulated: true, success: true };
    if (WHATSAPP_TOKEN !== 'MOCK_TOKEN' && destinatario) {
      const formattedPhone = destinatario.replace(/\D/g, '');
      const phoneWithCountry = formattedPhone.startsWith('51') ? formattedPhone : `51${formattedPhone}`;

      const res = await fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneWithCountry,
          type: 'text',
          text: { body: textoEnvio },
        }),
      });
      metaResponse = await res.json();
    }

    return new Response(
      JSON.stringify({ success: true, message: 'WhatsApp procesado', meta: metaResponse, preview: textoEnvio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
