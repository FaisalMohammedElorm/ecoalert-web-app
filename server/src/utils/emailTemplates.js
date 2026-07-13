export function passwordResetText({ resetUrl }) {
  return `You requested a password reset for your EcoAlert account.

Use the link below to reset your password. This link expires in 1 hour.

${resetUrl}

If you did not request this, you can safely ignore this email.`;
}

export function passwordResetHtml({ resetUrl }) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
      <h2 style="color:#0b6f32;">EcoAlert Password Reset</h2>
      <p>You requested a password reset for your EcoAlert account.</p>
      <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="background:#0b6f32;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Password</a></p>
      <p>If the button does not work, paste this URL into your browser:</p>
      <p><a href="${resetUrl}" style="color:#0b6f32;">${resetUrl}</a></p>
      <p style="color:#555;font-size:14px;">If you did not request this reset, ignore this message.</p>
    </div>
  `;
}

export function emailVerificationText({ verifyUrl }) {
  return `Verify your EcoAlert email address by clicking the link below.

${verifyUrl}

If you did not create this account, ignore this message.`;
}

export function emailVerificationHtml({ verifyUrl }) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
      <h2 style="color:#0b6f32;">Verify Your EcoAlert Email</h2>
      <p>Click the button below to confirm your email address and unlock email notifications.</p>
      <p><a href="${verifyUrl}" style="background:#0b6f32;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Verify Email</a></p>
      <p>If the button does not work, paste this URL into your browser:</p>
      <p><a href="${verifyUrl}" style="color:#0b6f32;">${verifyUrl}</a></p>
      <p style="color:#555;font-size:14px;">If you did not create this account, ignore this message.</p>
    </div>
  `;
}
