import nodemailer from 'nodemailer';

function getTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) {
    console.warn('SMTP_HOST not set — emails will be logged to console.');
    return null;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: user && pass ? { user, pass } : undefined });
  return transport;
}

export async function sendEmail({ to, subject, text, html }) {
  const transport = getTransport();
  const from = process.env.EMAIL_FROM || 'no-reply@ecoalert.local';
  if (!transport) {
    console.log('--- EMAIL (simulated) ---');
    console.log('From:', from);
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    if (html) console.log('HTML:', html);
    console.log('--- END EMAIL ---');
    return;
  }

  await transport.sendMail({ from, to, subject, text, html });
}
