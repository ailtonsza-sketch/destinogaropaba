import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { nome, telefone, email, mensagem, estabelecimento } = await request.json();

    await resend.emails.send({
      from: "Destino Garopaba <fale@destinogaropaba.com.br>",
      to: "fale@destinogaropaba.com.br",
      subject: `Correção de informação - ${estabelecimento}`,
      html: `
        <h2>Solicitação de correção</h2>
        <p><strong>Estabelecimento:</strong> ${estabelecimento}</p>
        <hr/>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr/>
        <p><strong>Correção solicitada:</strong></p>
        <p>${mensagem}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 });
  }
}