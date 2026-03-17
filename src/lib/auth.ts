import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins/username";
import { prisma } from "./prisma";

const trustedOrigins = [
    "http://localhost:3000",
    "https://prefeco-eniep.vercel.app",
    "https://eniep.prefecomelchorocampo.edu.mx",
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.BETTER_AUTH_URL,
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
]
    .filter((value): value is string => Boolean(value && value.trim()))
    .map((value) => value.trim());

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins,
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }, request) => {
            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');
            await resend.emails.send({
                from: 'ENIEP <no-reply@eniep.prefecomelchorocampo.edu.mx>',
                to: user.email,
                subject: 'Restablecer Contraseña - ENIEP',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                    <h2 style="color: #0b697d; text-align: center;">Restablecer Contraseña</h2>
                    <p style="font-size: 16px; color: #333;">Hola,</p>
                    <p style="font-size: 16px; color: #333;">Hemos recibido una solicitud para restablecer tu contraseña en la plataforma ENIEP. Haz clic en el botón de abajo para continuar:</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="background-color: #0b697d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Restablecer mi contraseña</a>
                    </div>
                    <p style="font-size: 14px; color: #666;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    <hr style="border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <div style="text-align: center;">
                      <p style="font-size: 12px; color: #999;">ENIEP 2026 - Preparatorias Federales por Cooperación</p>
                    </div>
                  </div>
                `,
            });
        }
    },
    plugins: [
        username()
    ],
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    }
});
