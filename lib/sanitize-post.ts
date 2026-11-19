import sanitizeHtml from "sanitize-html";

/**
 * PUB-01 (tarefa #994): o conteúdo do blog vem do banco e vai ao HTML da página.
 * Só passa o que um artigo usa: texto, títulos, listas, tabelas, imagens e links http(s).
 * Script, iframe, evento (onerror, onclick...), style e javascript: são removidos.
 */
const OPCOES: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s",
    "blockquote", "code", "pre", "ul", "ol", "li", "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "span", "div", "sup", "sub", "mark",
  ],
  allowedAttributes: {
    // id só nos títulos (o sumário usa); class só no link (o link interno usa).
    h1: ["id"], h2: ["id"], h3: ["id"], h4: ["id"], h5: ["id"], h6: ["id"],
    a: ["href", "title", "target", "rel", "class"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    div: ["data-mid-cta"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href", "src"],
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) =>
      attribs.target === "_blank"
        ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
        : { tagName, attribs },
  },
};

export function sanitizePostHtml(html: string | null | undefined): string {
  return html ? sanitizeHtml(html, OPCOES) : "";
}

/** JSON-LD dentro de <script>: escapa o que fecharia a tag ou quebraria o script. */
export function jsonLdSeguro(dados: unknown): string {
  return JSON.stringify(dados)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
