/* =========================
   API FETCH WRAPPER
========================= */

export async function apiFetch(

  url,

  options = {}
) {

  const config = {

    credentials: "include",

    headers: {

      "Content-Type":
        "application/json",

      ...(options.headers || {}),
    },

    ...options,
  };

  const response =
    await fetch(url, config);

  return response;
}