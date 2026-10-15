import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// onboarding@resend.dev only delivers to the Resend account owner; set EMAIL_FROM
// to an address on a verified domain to email anyone.
const FROM = process.env.EMAIL_FROM ?? "Bookwise <onboarding@resend.dev>";

export const sendPasswordResetEmail = async (to: string, link: string) => {
  if (!resend) {
    console.log(`RESEND_API_KEY not set. Password reset link for ${to}: ${link}`);
    return;
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your Bookwise password",
    text: `Use the link below to choose a new password. It expires in 1 hour.\n\n${link}\n\nIf you didn't request this, you can ignore this email.`,
    html: `<p>Use the link below to choose a new password. It expires in 1 hour.</p><p><a href="${link}">Reset your password</a></p><p>If you didn't request this, you can ignore this email.</p>`,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
};
