export function getClientIp(request: Request | { headers: Headers }): string {
  const headers = request.headers;

  const realIp = headers.get("x-real-ip");
  if (realIp?.trim()) {
    return realIp.trim().split(",")[0].trim();
  }

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor?.trim()) {
    return forwardedFor.trim().split(",")[0].trim();
  }

  return "127.0.0.1";
}
