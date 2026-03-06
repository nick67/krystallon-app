import { getStore } from '@netlify/blobs';

const ADMIN_PASS = 'krystallon2024!';
const STORE_NAME = 'krystallon';
const KEY        = 'content';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-pass',
    'Content-Type': 'application/json',
  };

  // CORS preflight
  if(req.method === 'OPTIONS'){
    return new Response('', { status: 204, headers });
  }

  const store = getStore({ name: STORE_NAME, consistency: 'strong' });

  // ── GET — διάβασε δεδομένα (χωρίς authentication)
  if(req.method === 'GET'){
    try{
      const data = await store.get(KEY, { type: 'json' });
      return new Response(JSON.stringify(data || {}), { status: 200, headers });
    } catch(e){
      return new Response(JSON.stringify({}), { status: 200, headers });
    }
  }

  // ── POST — αποθήκευσε δεδομένα (απαιτεί κωδικό)
  if(req.method === 'POST'){
    const pass = req.headers.get('x-admin-pass');
    if(pass !== ADMIN_PASS){
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }
    try{
      const body = await req.json();
      await store.setJSON(KEY, { ...body, updated: new Date().toISOString() });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch(e){
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }

  return new Response('Method not allowed', { status: 405, headers });
};

export const config = { path: '/api/data' };
