import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// onboarding@resend.dev only delivers to the Resend account owner; set EMAIL_FROM
// to an address on a verified domain to email anyone.
const FROM = process.env.EMAIL_FROM ?? "Bookwise <onboarding@resend.dev>";

const sendLinkEmail = async (options: {
  to: string;
  link: string;
  subject: string;
  intro: string;
  linkText: string;
  outro: string;
}) => {
  const { to, link, subject, intro, linkText, outro } = options;
  if (!resend) {
    console.log(`RESEND_API_KEY not set. "${subject}" link for ${to}: ${link}`);
    return;
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    text: `${intro}\n\n${link}\n\n${outro}`,
    html: `<p>${intro}</p><p><a href="${link}">${linkText}</a></p><p>${outro}</p>`,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
};

export const sendPasswordResetEmail = (to: string, link: string) =>
  sendLinkEmail({
    to,
    link,
    subject: "Reset your Bookwise password",
    intro: "Use the link below to choose a new password. It expires in 1 hour.",
    linkText: "Reset your password",
    outro: "If you didn't request this, you can ignore this email.",
  });

export const sendVerificationEmail = (to: string, link: string) =>
  sendLinkEmail({
    to,
    link,
    subject: "Verify your Bookwise email",
    intro: "Welcome to Bookwise! Use the link below to verify your email address. It expires in 24 hours.",
    linkText: "Verify your email",
    outro: "If you didn't create an account, you can ignore this email.",
  });
