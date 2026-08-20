export function getAdminSecret() {
  return process.env.CRON_SECRET || process.env.ADMIN_SECRET || "";
}

export function isAuthorizedAdmin(request: Request) {
  const secret = getAdminSecret();
  if (!secret) {
    return false;
  }

  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) {
    return true;
  }

  const url = new URL(request.url);
  return url.searchParams.get("key") === secret;
}
