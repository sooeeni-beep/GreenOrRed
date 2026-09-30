import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAdminIdentity } from '../server/identity.mjs';
import { handleApi } from '../server/api.mjs';
const req = (path, headers) => new Request('https://example.test'+path,{headers});
const env = {SITE_OWNER_EMAIL:'owner@example.test',DB:{prepare(sql){return {bind(){return {async first(){return sql.includes('admin_owner') ? {user_id:'existing-owner'} : null},async run(){return {}}}}}}}};
test('both management endpoints accept verified owner email-only session without changing owner',async()=>{
 for(const path of ['/api/admin/home','/api/admin/indicators','/api/admin/experts']){
  const r=req(path,{'oai-authenticated-user-email':'owner@example.test'});
  assert.equal((await handleApi(r,env.DB,await resolveAdminIdentity(r,env))).status,200);
 }
});
test('missing identity and other email are rejected; stable ID remains authoritative',async()=>{
 for(const headers of [{},{'oai-authenticated-user-email':'other@example.test'}]) assert.equal(await resolveAdminIdentity(req('/api/admin/home',headers),env),null);
 assert.equal(await resolveAdminIdentity(req('/',{'oai-authenticated-user-id':'different-id','oai-authenticated-user-email':'owner@example.test'}),env),'different-id');
 assert.equal(await resolveAdminIdentity(req('/',{'oai-authenticated-user-email':'owner@example.test'}),{...env,SITE_OWNER_EMAIL:undefined}),null);
});
