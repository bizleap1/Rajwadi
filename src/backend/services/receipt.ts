/**
 * Professional Royal Receipt / Tax Invoice Generator for Rajwadi Rajputi Poshak
 * Generates an ultra-luxurious, printable and downloadable PDF/HTML invoice.
 */

export interface ReceiptOrderData {
  orderNumber?: string;
  id?: string;
  createdAt?: string;
  guestEmail?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  subtotalInPaise?: number;
  stitchingInPaise?: number;
  shippingInPaise?: number;
  totalInPaise?: number;
  subtotalFormatted?: string;
  stitchingFormatted?: string;
  shippingFormatted?: string;
  totalFormatted?: string;
  shippingAddress?: any;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: Array<{
    id?: string;
    productName?: string;
    category?: string;
    stitchingSelected?: boolean;
    stitchingPriceInPaise?: number;
    unitPriceInPaise?: number;
    unitPriceFormatted?: string;
    quantity?: number;
    totalInPaise?: number;
    totalFormatted?: string;
  }>;
}

export function generateReceiptHtml(order: ReceiptOrderData): string {
  // Parse shipping address safely (supports Object or JSON string)
  let addr: any = {};
  if (order.shippingAddress) {
    if (typeof order.shippingAddress === "string") {
      try {
        addr = JSON.parse(order.shippingAddress);
      } catch {
        addr = {};
      }
    } else if (typeof order.shippingAddress === "object") {
      addr = order.shippingAddress;
    }
  }

  const patronName = addr.fullName || addr.name || order.user?.name || "Valued Patron";
  const patronPhone = addr.phone || addr.mobile || order.user?.phone || "N/A";
  const patronAddress = addr.address || addr.street || "Address on Record";
  const patronCity = addr.city || "";
  const patronState = addr.state || "Maharashtra";
  const patronPincode = addr.pincode || addr.pin || "";
  const patronEmail = order.guestEmail || addr.email || order.user?.email || "Registered Patron";

  const orderNum = order.orderNumber || order.id || "N/A";
  const invoiceNo = `INV-RW-${String(orderNum).replace(/[^0-9A-Z]/gi, "")}`;

  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  // Calculate safe financials
  const subtotalPaise = order.subtotalInPaise || order.totalInPaise || 0;
  const stitchingPaise = order.stitchingInPaise || 0;
  const shippingPaise = order.shippingInPaise || 0;
  const totalPaise = order.totalInPaise || subtotalPaise + stitchingPaise + shippingPaise;

  const subtotalStr =
    order.subtotalFormatted ||
    `₹ ${(subtotalPaise / 100).toLocaleString("en-IN")}`;

  const stitchingStr =
    order.stitchingFormatted ||
    `₹ ${(stitchingPaise / 100).toLocaleString("en-IN")}`;

  const shippingStr =
    order.shippingFormatted ||
    (shippingPaise === 0 ? "FREE" : `₹ ${(shippingPaise / 100).toLocaleString("en-IN")}`);

  const totalStr =
    order.totalFormatted ||
    `₹ ${(totalPaise / 100).toLocaleString("en-IN")}`;

  const logoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/logo%20without%20bg.png`
      : "/logo%20without%20bg.png";

  const itemsHtml = (order.items || [])
    .map((item, idx) => {
      const pName = item.productName || "Rajwadi Poshak";
      const pCategory = item.category || "Traditional Rajputi Poshak";
      const qty = item.quantity || 1;
      const unitRate =
        item.unitPriceFormatted ||
        (item.unitPriceInPaise ? `₹ ${(item.unitPriceInPaise / 100).toLocaleString("en-IN")}` : "—");
      const lineTotal =
        item.totalFormatted ||
        (item.totalInPaise
          ? `₹ ${(item.totalInPaise / 100).toLocaleString("en-IN")}`
          : item.unitPriceFormatted || "—");

      return `
      <tr style="border-bottom: 1px solid #EBD9C8;">
        <td style="padding: 12px 10px; font-family: monospace; color: #6B5E55; text-align: center;">${idx + 1}</td>
        <td style="padding: 12px 10px;">
          <div style="font-weight: 600; font-family: 'Cinzel', serif, Georgia; color: #171717; font-size: 13px;">${pName}</div>
          <div style="color: #8A796B; font-size: 11px; margin-top: 2px;">
            ${pCategory}
            ${item.stitchingSelected ? " &bull; <span style='color: #855D25; font-weight: 600;'>Bespoke Stitching Included</span>" : " &bull; <span>Traditional Unstitched Set</span>"}
          </div>
        </td>
        <td style="padding: 12px 10px; text-align: center; color: #4A3E37; font-size: 12px; font-family: monospace;">${qty}</td>
        <td style="padding: 12px 10px; text-align: right; color: #4A3E37; font-size: 12px; font-family: monospace;">${unitRate}</td>
        <td style="padding: 12px 10px; text-align: right; font-weight: 600; color: #171717; font-size: 13px; font-family: monospace;">${lineTotal}</td>
      </tr>
    `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rajwadi Rajputi Poshak - Receipt #${orderNum}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #FAF5EE;
      color: #171717;
      padding: 30px 20px;
      line-height: 1.5;
    }

    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 2px solid #855D25;
      padding: 40px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      position: relative;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: 'Cinzel', serif;
      font-size: 70px;
      font-weight: 700;
      color: rgba(133, 93, 37, 0.04);
      letter-spacing: 15px;
      pointer-events: none;
      white-space: nowrap;
      text-transform: uppercase;
    }

    .header-border {
      border-bottom: 2px solid #6D1A2A;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand-title {
      font-family: 'Cinzel', serif, Georgia;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #6D1A2A;
      text-transform: uppercase;
    }

    .brand-subtitle {
      font-size: 10px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #855D25;
      font-weight: 600;
      margin-top: 3px;
    }

    .store-info {
      font-size: 11px;
      color: #4A423B;
      text-align: right;
      line-height: 1.45;
      max-width: 380px;
    }

    .invoice-badge {
      display: inline-block;
      background-color: #6D1A2A;
      color: #FFFFFF;
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 2px;
      padding: 4px 14px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 2px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background-color: #FCFAF6;
      border: 1px solid #EBD9C8;
      padding: 16px 20px;
      border-radius: 4px;
      margin-bottom: 24px;
      font-size: 12px;
    }

    .meta-item {
      margin-bottom: 6px;
    }

    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #855D25;
      font-weight: 600;
      display: block;
    }

    .meta-val {
      color: #171717;
      font-weight: 500;
    }

    .party-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
      font-size: 12px;
    }

    .party-box {
      border: 1px solid #EBD9C8;
      padding: 16px;
      border-radius: 4px;
      background-color: #FFFFFF;
    }

    .party-title {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #6D1A2A;
      border-bottom: 1px solid #F0E5D8;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }

    .items-table th {
      background-color: #FAF5EE;
      color: #6D1A2A;
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 10px;
      border-top: 1px solid #EBD9C8;
      border-bottom: 1px solid #EBD9C8;
      font-weight: 700;
    }

    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }

    .summary-box {
      width: 320px;
      border: 1px solid #EBD9C8;
      background-color: #FAF5EE;
      padding: 16px;
      border-radius: 4px;
      font-size: 12px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #6B5E55;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      border-top: 2px solid #855D25;
      padding-top: 10px;
      margin-top: 10px;
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 700;
      color: #6D1A2A;
    }

    .guarantee-footer {
      border-top: 1px dashed #D9C4B0;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #6B5E55;
    }

    .seal-box {
      text-align: center;
      border: 2px solid #855D25;
      padding: 8px 14px;
      border-radius: 50px;
      color: #855D25;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      background-color: #FAF5EE;
    }

    @media print {
      body {
        background-color: #FFFFFF;
        padding: 0;
      }
      .receipt-container {
        border: 1px solid #999;
        box-shadow: none;
        padding: 20px;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="watermark">RAJWADI</div>

    <!-- Official Brand & Store Location Header -->
    <div class="header-border">
      <div style="display: flex; align-items: center; gap: 16px;">
        <img
          src="${logoUrl}"
          alt="Rajwadi Rajputi Poshak"
          style="width: 68px; height: 68px; object-fit: contain; flex-shrink: 0;"
          onerror="this.style.display='none'"
        />
        <div>
          <div class="brand-title">Rajwadi Rajputi Poshak</div>
          <div class="brand-subtitle">Authentic Rajputi Heritage &bull; Bespoke Bridal Atelier</div>
          <div style="font-size: 11px; color: #855D25; margin-top: 4px; font-weight: 600;">
            GSTIN: 27AABCR9876Q1Z2 &bull; CIN: U17299MH2024PTC123456
          </div>
        </div>
      </div>
      <div class="store-info">
        <strong style="color: #171717; font-size: 12px;">Rajwadi Rajputi Poshak Store</strong><br>
        EWS 41, near Maheshwari Bhawan, Hiwari Layout,<br>
        Uday Nagar, Padole Nagar, Nagpur, Maharashtra &ndash; 440008<br>
        <strong>Phone / WhatsApp:</strong> +91 8766667101<br>
        <strong>Email:</strong> care@rajwadirajputiposhak.com
      </div>
    </div>

    <!-- Verification Badges -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <span class="invoice-badge">Official Tax Invoice &amp; Order Receipt</span>
      <span style="font-size: 11.5px; font-weight: 600; color: #047857; background: #ECFDF5; border: 1px solid #A7F3D0; padding: 4px 12px; border-radius: 3px; display: inline-flex; align-items: center; gap: 4px;">
        &#10003; PAYMENT ${order.paymentStatus === "VERIFICATION_PENDING" ? "SUBMITTED &bull; VERIFICATION IN PROGRESS" : "VERIFIED &bull; OFFICIAL RECEIPT"}
      </span>
    </div>

    <!-- Meta Details Grid -->
    <div class="meta-grid">
      <div>
        <div class="meta-item">
          <span class="meta-label">Invoice Number</span>
          <span class="meta-val" style="font-family: monospace; font-weight: 600;">${invoiceNo}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Order Reference</span>
          <span class="meta-val" style="font-family: monospace; font-weight: 700; color: #6D1A2A;">#${orderNum}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Order Date &amp; Time</span>
          <span class="meta-val">${dateFormatted}</span>
        </div>
      </div>
      <div>
        <div class="meta-item">
          <span class="meta-label">Payment Method</span>
          <span class="meta-val">${order.paymentMethod === "UPI_SCANNER" ? "UPI QR Payment" : order.paymentMethod || "Razorpay Secure"}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Payment Status</span>
          <span class="meta-val" style="color: #047857; font-weight: 700;">${order.paymentStatus || "PAID"}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Customer Email</span>
          <span class="meta-val">${patronEmail}</span>
        </div>
      </div>
    </div>

    <!-- Patron & Shipping Destination Details -->
    <div class="party-grid">
      <div class="party-box">
        <div class="party-title">Billed &amp; Shipped To (Patron)</div>
        <div style="font-weight: 700; color: #171717; font-size: 13px;">${patronName}</div>
        <div style="color: #4A3E37; margin-top: 4px; line-height: 1.45;">
          ${patronAddress}<br>
          ${patronCity ? `${patronCity}, ` : ""}${patronState}${patronPincode ? ` &ndash; ${patronPincode}` : ""}<br>
          <strong>Mobile:</strong> ${patronPhone}
        </div>
      </div>
      <div class="party-box">
        <div class="party-title">Atelier Dispatch &amp; Assurance</div>
        <div style="color: #4A3E37; line-height: 1.45;">
          <strong>Dispatch Atelier:</strong> Rajwadi Central Studio &amp; Boutique<br>
          <strong>Packaging:</strong> Tamper-Evident Royal Hard Box Packaging<br>
          <strong>Transit Insurance:</strong> 100% Fully Insured Doorstep Delivery<br>
          <strong>Doorstep Support:</strong> Direct WhatsApp (+91 8766667101)
        </div>
      </div>
    </div>

    <!-- Ordered Pieces Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 40px; text-align: center;">#</th>
          <th style="text-align: left;">Handcrafted Ensemble</th>
          <th style="width: 70px; text-align: center;">Qty</th>
          <th style="width: 120px; text-align: right;">Unit Price</th>
          <th style="width: 130px; text-align: right;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Financial Summary -->
    <div class="summary-section">
      <div class="summary-box">
        <div class="summary-row">
          <span>Items Subtotal:</span>
          <span style="font-weight: 600; color: #171717; font-family: monospace;">${subtotalStr}</span>
        </div>
        ${
          stitchingPaise > 0
            ? `
        <div class="summary-row">
          <span>Bespoke Tailoring:</span>
          <span style="font-weight: 600; color: #171717; font-family: monospace;">${stitchingStr}</span>
        </div>`
            : ""
        }
        <div class="summary-row">
          <span>Insured Express Courier:</span>
          <span style="font-weight: 600; color: #047857; font-family: monospace;">${shippingStr}</span>
        </div>
        <div class="summary-total">
          <span>Grand Total:</span>
          <span style="font-family: monospace;">${totalStr}</span>
        </div>
      </div>
    </div>

    <!-- Guarantee Seal & Sign -->
    <div class="guarantee-footer">
      <div style="max-width: 500px;">
        <div style="font-family: 'Cinzel', serif; font-weight: 700; color: #855D25; margin-bottom: 3px;">
          Certified Master Karigar Authenticity
        </div>
        <p style="font-size: 10.5px; line-height: 1.4; color: #6B5E55;">
          This document certifies that your poshak has been handcrafted using authentic heritage textiles and artisan embroidery techniques. Thank you for patronizing Rajwadi Rajputi Poshak.
        </p>
      </div>

      <div class="seal-box" style="display: flex; align-items: center; gap: 8px;">
        <img
          src="${logoUrl}"
          alt="Rajwadi Seal"
          style="width: 28px; height: 28px; object-fit: contain;"
          onerror="this.style.display='none'"
        />
        <div>
          &bull; RAJWADI &bull;<br>
          <span style="font-size: 8.5px; font-weight: 600;">AUTHENTIC POSHAK</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Downloads the professional receipt directly as an HTML/PDF printable file
 * or opens the high-resolution browser print dialog.
 */
export function downloadReceipt(order: ReceiptOrderData) {
  const htmlContent = generateReceiptHtml(order);

  // Open in an iframe or dedicated window and trigger print
  const printWindow = window.open("", "_blank", "width=850,height=900");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Trigger print/save as PDF once rendered
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 350);
    };
  } else {
    // Fallback: trigger HTML file download if popups are blocked
    const orderRef = order.orderNumber || order.id || "Order";
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rajwadi_Receipt_${orderRef}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
