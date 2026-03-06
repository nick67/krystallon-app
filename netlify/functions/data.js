const { getStore } = require('@netlify/blobs');

const ADMIN_PASS = 'krystallon2024!';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-pass',
    'Content-Type': 'application/json',
  };

  if(event.httpMethod === 'OPTIONS'){
    return { statusCode: 204, headers, body: '' };
  }

  const store = getStore('krystallon');

  if(event.httpMethod === 'GET'){
    try{
      const data = await store.get('content', { type: 'json' });
      return { statusCode: 200, headers, body: JSON.stringify(data || {}) };
    } catch(e){
      return { statusCode: 200, headers, body: JSON.stringify({}) };
    }
  }

  if(event.httpMethod === 'POST'){
    if(event.headers['x-admin-pass'] !== ADMIN_PASS){
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
    try{
      const body = JSON.parse(event.body);
      await store.setJSON('content', { ...body, updated: new Date().toISOString() });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch(e){
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: 'Method not allowed' };
};
