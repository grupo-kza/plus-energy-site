import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Plus Energy",
  description: "Termos e condições de uso dos serviços da Plus Energy.",
};

export default function TermosUsoPage() {
  return (
    <main className="bg-white">
      <section className="bg-pe-green-950 pt-36 pb-16 px-4 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-white">Termos de Uso</h1>
        <p className="text-white/40 mt-3">Atualizado em novembro de 2026</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 prose prose-slate prose-headings:font-heading prose-headings:font-bold prose-a:text-pe-green-600">
        <h2>1. Sobre o serviço</h2>
        <p>A Plus Energy oferece serviço de energia solar por assinatura. A energia gerada pela usina é lançada como crédito na conta do cliente pela distribuidora RGE, pelo sistema de compensação de energia elétrica. O serviço é disponibilizado para unidades consumidoras atendidas pela RGE no Rio Grande do Sul.</p>

        <h2>2. Elegibilidade</h2>
        <p>Podem contratar o serviço pessoas físicas (CPF) ou jurídicas (CNPJ) que sejam titulares de conta de energia elétrica ativa junto à RGE, com consumo mínimo de R$ 150,00 mensais.</p>

        <h2>3. Desconto e cobrança</h2>
        <p>O desconto de até 25% é aplicado sobre o valor da tarifa de energia (TUSD + TE), conforme previsto em contrato. A cobrança é realizada mensalmente via Conta Única digital, enviada por WhatsApp e e-mail. A conta da distribuidora RGE é paga automaticamente pela Plus Energy.</p>

        <h2>4. Cancelamento</h2>
        <p>O contrato tem prazo de 3 meses e renova automaticamente ao fim de cada período. Para encerrar, o cliente avisa com 90 dias de antecedência. Quem encerra antes do fim do contrato paga o saldo de créditos de energia que ainda aparece na fatura.</p>
        <p>Contratação feita pela internet ou pelo celular pode ser desfeita em até 7 dias, contados da assinatura, sem custo nenhum (art. 49 do Código de Defesa do Consumidor). Basta avisar pelo WhatsApp ou pelo e-mail abaixo.</p>

        <h2>5. Responsabilidades</h2>
        <p>A Plus Energy não é responsável por falhas na distribuição de energia elétrica, que são de responsabilidade da distribuidora RGE. O serviço não altera a qualidade ou continuidade do fornecimento de energia.</p>

        <h2>6. Foro</h2>
        <p>Fica eleito o foro da Comarca de Marcelino Ramos/RS para dirimir eventuais controvérsias decorrentes deste contrato.</p>

        <h2>7. Contato</h2>
        <p>Dúvidas sobre estes termos? <a href="mailto:contato@plusenergy.com.br">contato@plusenergy.com.br</a> · Plus Energy · CNPJ 51.181.561/0001-75.</p>
      </section>
    </main>
  );
}
