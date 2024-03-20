import { supabase } from "./supabaseClient";

const client = supabase;

export const getIdToken = async () => {
  const session = await client.auth.getSession();

  if (session?.data?.session) {
    const token = session.data.session.access_token;
    return token;
  }

  console.error("Invalid session.");
  return "";
};

export const getValidImageLinks = async () => {
  const links = JSON.parse(localStorage.getItem("imageLinks")) || [];

  const validLinks = await Promise.all(
    links.map((link) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = link;

        img.onload = async () => {
          resolve(link);
        };

        img.onerror = () => {
          console.log(`Error loading image: ${link}`);
          resolve(null);
        };
      });
    })
  );

  const filteredLinks = validLinks.filter(Boolean);
  localStorage.setItem("imageLinks", JSON.stringify(filteredLinks));

  return filteredLinks;
};
