// Headers are supplied by the Sites authentication dispatcher, never by forms.
export async function resolveAdminIdentity(request, env) {
  const id = request.headers.get('oai-authenticated-user-id');
  if (id) return id;
  const email = request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
  const ownerEmail = env.SITE_OWNER_EMAIL?.trim().toLowerCase();
  if (!email || !ownerEmail || email !== ownerEmail || !env.DB) return null;
  // Compatibility with sessions forwarding email but no ID. Bind only the
  // verified Site owner to the existing owner record; never create/reset it.
  const owner = await env.DB.prepare('SELECT user_id FROM admin_owner WHERE id = ?').bind('owner').first();
  return owner?.user_id ?? null;
}
