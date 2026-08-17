// Edge Function: culqi-webhook (Deno)
// Recibe eventos de pago de Culqi, valida la autenticidad y actualiza pagos.estado = 'pagado'

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-culqi-signature',
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

    const body = await req.json();
    const { type, data } = body;

    // Manejar evento de cargo exitoso (charge.succeeded)
    if (type === 'charge.succeeded' || data?.object === 'charge') {
      const chargeId = data.id;
      const amount = data.amount / 100; // Culqi envía montos en céntimos
      const email = data.email;
      const metadata = data.metadata || {};
      const pagoId = metadata.pago_id;

      if (pagoId) {
        const { error } = await supabaseClient
          .from('pagos')
          .update({
            estado: 'pagado',
            fecha_pago: new Date().toISOString(),
            metodo_pago: 'culqi',
            culqi_charge_id: chargeId,
          })
          .eq('id', pagoId);

        if (error) throw error;
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Pago procesado exitosamente', chargeId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ received: true, ignored: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
