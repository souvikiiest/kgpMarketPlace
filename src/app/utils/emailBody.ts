// emailUtils.ts

export function generateEmailBody(
  productName: string,
  buyerEmail?: string,
  buyerPhone?: string
): string {
  return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Hello,</h2>
        <p>Someone is interested in buying your product: <strong>${productName}</strong>.</p>
        
        ${
          buyerEmail || buyerPhone
            ? `<p>The buyer's contact details are:</p>
              <ul>
                <li>Email: ${buyerEmail || "N/A"}</li>
                <li>Phone: ${buyerPhone || "N/A"}</li>
              </ul>`
            : "<p>Your contact details have been shared with the buyer. Please wait for their response.</p>"
        }
        
        <p>Best regards,<br>kgp MarketPlace</p>
      </div>
    `;
}
