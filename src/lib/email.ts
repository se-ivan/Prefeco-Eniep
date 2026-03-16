import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

interface SendVerificationEmailParams {
  to: string;
  code: string;
}

export async function sendVerificationEmail({ to, code }: SendVerificationEmailParams) {
  const { data, error } = await resend.emails.send({
    from: 'ENIEP <no-reply@eniep.prefecomelchorocampo.edu.mx>', 
    to: [to],
    subject: 'Código de Verificación - ENIEP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #0b697d; text-align: center;">Código de Verificación</h2>
        <p style="font-size: 16px; color: #333;">Hola,</p>
        <p style="font-size: 16px; color: #333;">Utiliza el siguiente código para verificar el correo electrónico de tu institución en la plataforma ENIEP.</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffa52d;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #666;">Este código expirará en 15 minutos.</p>
        <p style="font-size: 14px; color: #666;">Si no solicitaste este código, por favor ignora este correo.</p>
        <hr style="border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <div style="text-align: center;">
          <img src="https://eniep.prefecomelchorocampo.edu.mx/logo-eniep.png" alt="ENIEP Logo" style="width: 80px; height: auto;" />
          <p style="font-size: 12px; color: #999;">ENIEP 2026 - Preparatorias Federales por Cooperación</p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
