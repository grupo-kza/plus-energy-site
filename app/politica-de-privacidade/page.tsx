import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Plus Energy",
  description: "Política de privacidade e tratamento de dados da Plus Energy.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <main className="bg-white">
      <section className="bg-pe-green-950 pt-36 pb-16 px-4 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-white">Política de Privacidade</h1>
        <p className="text-white/40 mt-3">Atualizada em novembro de 2026</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 prose prose-slate prose-headings:font-heading prose-headings:font-bold prose-a:text-pe-green-600">
        <h2>1. Quem trata os dados</h2>
        <p>A Plus Energy (CNPJ 51.181.561/0001-75, Marcelino Ramos/RS) é a controladora dos dados pessoais coletados neste site e nas páginas de simulação.</p>

        <h2>2. Quais dados coletamos</h2>
        <p>Nos formulários: nome, telefone (WhatsApp), e-mail quando informado, valor aproximado da conta de luz e distribuidora. Na navegação: páginas visitadas, origem da visita (campanha, anúncio ou link) e dados técnicos do navegador, por cookies, conforme a sua escolha no aviso de cookies.</p>

        <h2>3. Para que usamos</h2>
        <p>Para: (a) fazer e enviar a simulação de economia; (b) falar com você pelo WhatsApp sobre a simulação e a contratação; (c) formalizar e executar o contrato de assinatura de energia; (d) enviar a Conta Única e comunicações sobre o serviço; (e) medir os resultados das campanhas e mostrar anúncios a quem já visitou o site, quando você aceita esses cookies.</p>

        <h2>4. Base legal</h2>
        <p>Procedimentos preliminares e execução do contrato (art. 7º, V, da LGPD) para a simulação, o contato e o serviço; cumprimento de obrigação legal ou regulatória quando exigido; e consentimento (art. 7º, I) para os cookies de medição e anúncios, que você pode retirar a qualquer momento pelo aviso de cookies.</p>

        <h2>5. Com quem compartilhamos</h2>
        <p>A Plus Energy não vende seus dados. Eles são compartilhados só com quem ajuda a prestar o serviço: o SiteUP CRM, onde ficam os contatos e as conversas; o WhatsApp, para as mensagens; a distribuidora RGE e os processadores de pagamento, para executar o contrato; e, quando você aceita os cookies de medição e anúncios, o Google (Tag Manager, Analytics e Ads) e a Meta (Facebook e Instagram), que recebem dados de navegação e, no envio do formulário, o telefone, para medir as campanhas. Alguns desses serviços guardam dados fora do Brasil, com as garantias do art. 33 da LGPD.</p>

        <h2>6. Por quanto tempo guardamos</h2>
        <p>Pelo tempo necessário para as finalidades acima e, depois disso, pelo prazo que a lei exigir. Contato que não virou cliente pode pedir a exclusão a qualquer momento.</p>

        <h2>7. Seus direitos</h2>
        <p>Você pode pedir confirmação, acesso, correção, portabilidade, anonimização ou exclusão dos seus dados, saber com quem foram compartilhados e retirar o consentimento. Peça pelo e-mail <a href="mailto:contato@plusenergy.com.br">contato@plusenergy.com.br</a> ou pelo WhatsApp da Plus.</p>

        <h2>8. Cookies</h2>
        <p>Os cookies necessários fazem o site funcionar. Nas páginas de simulação, os de medição e anúncios só são usados se você aceitar no aviso de cookies, e a escolha pode ser mudada a qualquer momento. Você também pode apagar ou bloquear cookies nas configurações do navegador.</p>

        <h2>9. Contato</h2>
        <p>Dúvidas sobre esta política: <a href="mailto:contato@plusenergy.com.br">contato@plusenergy.com.br</a> · Plus Energy · CNPJ 51.181.561/0001-75 · Marcelino Ramos/RS.</p>
      </section>
    </main>
  );
}
