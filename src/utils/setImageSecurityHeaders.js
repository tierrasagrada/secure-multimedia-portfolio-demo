export function setImageSecurityHeaders(res, contentType) {
  res.setHeader("Content-Type", contentType);

  res.setHeader("Cache-Control", "private, max-age=300");

  res.setHeader("X-Content-Type-Options", "nosniff");

  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  res.setHeader("Referrer-Policy", "no-referrer");

  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; img-src 'self';",
  );
}