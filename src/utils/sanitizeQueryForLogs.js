export function sanitizeQueryForLogs(url) {
  if (!url) {
    return url;
  }

  try {
    const parsedUrl = new URL(url, "http://localhost");

    if (parsedUrl.searchParams.has("token")) {
      const token = parsedUrl.searchParams.get("token");

      const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

      if (jwtPattern.test(token)) {
        parsedUrl.searchParams.set(
          "token",
          "[JWT_REDACTED]",
        );
      } else {
        const safePreview = token.replace(/[\r\n\t]/g, "").slice(0, 50);

        parsedUrl.searchParams.set(
          "token",
          `[INVALID_TOKEN:${safePreview}]`,
        );
      }
    }

    return parsedUrl.pathname + parsedUrl.search;
  } catch {
    return "[INVALID_URL]";
  }
}