import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { portfolio } from "./src/data/portfolio";
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "portfolio-metadata",
      transformIndexHtml: (html) =>
        html
          .replace(/__TITLE__/g, escapeHtml(portfolio.seo.title))
          .replace(/__DESCRIPTION__/g, escapeHtml(portfolio.seo.description)),
    },
  ],
});
