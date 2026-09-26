/**
 * Official Premium Tax Invoice & Couture Receipt Generator for Rajwadi Rajputi Poshak
 * Modeled precisely on luxury haute couture atelier invoice standards (Miraya template)
 */

export interface ReceiptOrderData {
  orderNumber?: string;
  id?: string;
  createdAt?: string;
  guestEmail?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  utrNumber?: string;
  subtotalInPaise?: number;
  stitchingInPaise?: number;
  shippingInPaise?: number;
  discountInPaise?: number;
  totalInPaise?: number;
  subtotalFormatted?: string;
  stitchingFormatted?: string;
  shippingFormatted?: string;
  discountFormatted?: string;
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
    size?: string;
    stitchingSelected?: boolean;
    stitchingPriceInPaise?: number;
    unitPriceInPaise?: number;
    unitPriceFormatted?: string;
    quantity?: number;
    totalInPaise?: number;
    totalFormatted?: string;
  }>;
}

const STATE_CODES: Record<string, string> = {
  "rajasthan": "08",
  "maharashtra": "27",
  "gujarat": "24",
  "delhi": "07",
  "uttar pradesh": "09",
  "madhya pradesh": "23",
  "haryana": "06",
  "punjab": "03",
  "karnataka": "29",
  "telangana": "36",
  "tamil nadu": "33",
  "west bengal": "19",
  "bihar": "10",
  "assam": "18",
  "kerala": "32",
  "odisha": "21",
  "jharkhand": "20",
  "chhattisgarh": "22",
  "uttarakhand": "05",
  "himachal pradesh": "02",
  "goa": "30",
  "jammu & kashmir": "01",
  "jammu and kashmir": "01",
  "andhra pradesh": "37",
  "chandigarh": "04",
};

export function generateReceiptHtml(order: ReceiptOrderData): string {
  // Parse shipping address safely
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

  const patronName = addr.fullName || addr.name || order.user?.name || "Valued Client";
  const patronPhone = addr.phone || addr.mobile || order.user?.phone || "+91";
  const patronAddress = addr.address || addr.street || "Address on Record";
  const patronCity = addr.city || "Nagpur";
  const patronState = addr.state || "Rajasthan";
  const patronPincode = addr.pincode || addr.pin || "";
  const patronEmail = order.guestEmail || addr.email || order.user?.email || "N/A";

  const cleanStateKey = patronState.trim().toLowerCase();
  const stateCode = STATE_CODES[cleanStateKey] || "08";
  const isIntraState = stateCode === "08";

  const orderNum = order.orderNumber || order.id || "ORD-9999";
  const cleanOrderNum = String(orderNum).replace(/[^0-9A-Z]/gi, "");
  const invoiceNo = `INV-RW-${cleanOrderNum.slice(-5).padStart(5, "0")}`;

  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  // Calculate safe financials
  const subtotalPaise = order.subtotalInPaise || order.totalInPaise || 0;
  const stitchingPaise = order.stitchingInPaise || 0;
  const shippingPaise = order.shippingInPaise || 0;
  const discountPaise = order.discountInPaise || 0;
  const totalPaise =
    order.totalInPaise != null
      ? order.totalInPaise
      : Math.max(0, subtotalPaise + stitchingPaise + shippingPaise - discountPaise);

  const totalInRupees = totalPaise / 100;
  const stitchingInRupees = stitchingPaise / 100;
  const discountInRupees = discountPaise / 100;

  // 18% Inclusive GST breakdown
  const taxableBase = Math.round((totalInRupees / 1.18) * 100) / 100;
  const totalGst = Math.round((totalInRupees - taxableBase) * 100) / 100;
  const halfGst = Math.round((totalGst / 2) * 100) / 100;

  // Items rows
  const items = order.items && order.items.length > 0 ? order.items : [
    {
      productName: "Royal Rajputi Poshak Ensemble",
      category: "Pure Georgette Traditional Poshak",
      size: "M",
      quantity: 1,
      totalInPaise: totalPaise,
      unitPriceInPaise: totalPaise,
    },
  ];

  const totalItemsCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  const itemsHtml = items.map((item, idx) => {
    const pName = item.productName || "Handcrafted Rajputi Poshak";
    const pCategory = item.category || "Traditional Poshak";
    const size = item.size || "M";
    const qty = item.quantity || 1;
    const itemTotalInPaise = item.totalInPaise || (item.unitPriceInPaise ? item.unitPriceInPaise * qty : totalPaise);
    const unitPriceInPaise = item.unitPriceInPaise || Math.round(itemTotalInPaise / qty);

    const unitPriceStr = `Rs. ${(unitPriceInPaise / 100).toLocaleString("en-IN")}`;
    const amountStr = `Rs. ${(itemTotalInPaise / 100).toLocaleString("en-IN")}`;

    return `
      <tr style="border-bottom: 1px solid #EBD9C8; font-size: 11px;">
        <td style="padding: 10px 8px; text-align: center; color: #5A524C; font-weight: 500;">${idx + 1}</td>
        <td style="padding: 10px 10px;">
          <div style="font-weight: 700; color: #171717; font-size: 12px; font-family: 'Playfair Display', Georgia, serif;">
            ${pName}
          </div>
          <div style="font-size: 10px; color: #8A796B; margin-top: 1.5px;">
            ${pCategory}${item.stitchingSelected ? " &bull; <span style='color: #855D25; font-weight: 600;'>Bespoke Stitching Included</span>" : ""}
          </div>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-family: monospace; font-size: 11px; color: #5A524C;">6204</td>
        <td style="padding: 10px 8px; text-align: center; font-size: 11px; color: #171717; font-weight: 600;">${size}</td>
        <td style="padding: 10px 8px; text-align: center; font-family: monospace; font-size: 11px; color: #171717;">${qty}</td>
        <td style="padding: 10px 10px; text-align: right; font-family: monospace; font-size: 11px; color: #171717;">${unitPriceStr}</td>
        <td style="padding: 10px 10px; text-align: right; font-family: monospace; font-size: 11.5px; font-weight: 700; color: #171717;">${amountStr}</td>
      </tr>
    `;
  }).join("");

  const isPaid = order.paymentStatus === "PAID" || order.paymentStatus === "CONFIRMED";
  const paymentMethodLabel = order.paymentMethod === "RAZORPAY"
    ? "Razorpay Online (Prepaid)"
    : order.paymentMethod === "UPI"
    ? "Direct UPI Scan (Prepaid)"
    : "Prepaid Online";

  const paymentRefLabel = order.utrNumber
    ? `UTR: ${order.utrNumber}`
    : order.razorpayPaymentId
    ? `Ref: ${order.razorpayPaymentId}`
    : "PREPAID";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice ${invoiceNo} — Rajwadi Haute Couture</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Montserrat:wght@400;500;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #FFFFFF;
      color: #171717;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .invoice-wrapper {
      max-width: 820px;
      margin: 0 auto;
      padding: 8px 12px;
      position: relative;
    }

    /* Subtle Faint Watermark at bottom */
    .watermark-emblem {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 72px;
      font-weight: 800;
      letter-spacing: 0.25em;
      color: rgba(133, 93, 37, 0.035);
      pointer-events: none;
      white-space: nowrap;
      text-transform: uppercase;
      z-index: 0;
    }

    /* Print control toolbar (hidden in print) */
    .no-print {
      background: #FAF6F0;
      border: 1px solid #EBD9C8;
      border-radius: 4px;
      padding: 8px 14px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Header Section */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      padding-bottom: 12px;
    }

    .brand-logo-cell {
      width: 65px;
      vertical-align: top;
      padding-right: 12px;
    }

    .brand-monogram {
      width: 58px;
      height: 58px;
      border: 1.5px solid #855D25;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #FAF6F0;
    }

    .brand-monogram-initials {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 700;
      line-height: 1;
      color: #581522;
      letter-spacing: 1px;
    }

    .brand-monogram-tag {
      font-size: 6.5px;
      font-weight: 700;
      color: #855D25;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .brand-info-cell {
      vertical-align: top;
    }

    .brand-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #581522;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .brand-sub {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #8E6D38;
      text-transform: uppercase;
      margin-top: 3px;
      margin-bottom: 5px;
    }

    .brand-address {
      font-size: 9.5px;
      color: #5A524C;
      line-height: 1.4;
    }

    .meta-cell {
      vertical-align: top;
      text-align: right;
      width: 260px;
    }

    .tax-badge {
      background: #581522;
      color: #FFFFFF;
      border-radius: 9999px;
      padding: 4px 18px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      display: inline-block;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .meta-details {
      font-size: 10.5px;
      color: #4A423B;
      line-height: 1.55;
    }

    .meta-details strong {
      color: #171717;
    }

    .gold-divider {
      width: 100%;
      height: 1.5px;
      background: #C8A462;
      margin-top: 10px;
      margin-bottom: 12px;
    }

    /* Client Details Grid */
    .client-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 14px;
    }

    .client-card {
      display: table-cell;
      width: 50%;
      background: #FAF8F5;
      border: 1px solid #E6D9C8;
      border-radius: 3px;
      padding: 10px 14px;
      vertical-align: top;
    }

    .client-card-spacer {
      display: table-cell;
      width: 12px;
    }

    .card-label {
      color: #8E6D38;
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .client-name {
      font-size: 13px;
      font-weight: 700;
      color: #171717;
      margin-bottom: 3px;
      font-family: 'Playfair Display', Georgia, serif;
    }

    .client-text {
      font-size: 10px;
      color: #5A524C;
      line-height: 1.45;
    }

    /* Items Table */
    .table-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .table-title {
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #171717;
      text-transform: uppercase;
    }

    .items-count-tag {
      font-size: 9.5px;
      font-weight: 600;
      color: #8A796B;
      text-transform: uppercase;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }

    .items-table th {
      background: #581522;
      color: #FFFFFF;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 7px 8px;
      border: none;
    }

    /* Financial & Payment Grid */
    .summary-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 14px;
    }

    .summary-card {
      display: table-cell;
      width: 50%;
      background: #FAF8F5;
      border: 1px solid #E6D9C8;
      border-radius: 3px;
      padding: 12px 14px;
      vertical-align: top;
    }

    .status-badge-green {
      background: #0D7A53;
      color: #FFFFFF;
      border-radius: 9999px;
      padding: 3px 12px;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: inline-block;
      margin-bottom: 8px;
    }

    .status-badge-amber {
      background: #B45309;
      color: #FFFFFF;
      border-radius: 9999px;
      padding: 3px 12px;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: inline-block;
      margin-bottom: 8px;
    }

    .status-line {
      font-size: 10.5px;
      color: #4A423B;
      line-height: 1.5;
    }

    .status-line strong {
      color: #171717;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #4A423B;
      padding: 2.5px 0;
    }

    .summary-row.bold {
      font-weight: 700;
      color: #171717;
    }

    .total-banner {
      background: #581522;
      color: #FFFFFF;
      padding: 7px 10px;
      border-radius: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .total-banner-val {
      font-family: monospace;
      font-size: 13.5px;
      font-weight: 800;
    }

    /* Terms & Seal Grid */
    .terms-grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 12px;
      margin-top: 6px;
    }

    .terms-cell {
      display: table-cell;
      width: 62%;
      vertical-align: top;
      padding-right: 14px;
    }

    .seal-cell {
      display: table-cell;
      width: 38%;
      vertical-align: top;
      background: #FFFFFF;
      border: 1px solid #E6D9C8;
      border-radius: 3px;
      padding: 10px 12px;
      text-align: center;
    }

    .terms-title {
      font-size: 9.5px;
      font-weight: 800;
      color: #171717;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }

    .terms-list {
      font-size: 9px;
      color: #5A524C;
      line-height: 1.45;
      padding-left: 14px;
    }

    .terms-list li {
      margin-bottom: 3px;
    }

    .seal-title {
      font-size: 9.5px;
      font-weight: 800;
      color: #581522;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .seal-sub {
      font-size: 8.5px;
      color: #8E6D38;
      font-style: italic;
      margin-top: 1px;
    }

    .seal-stamp-box {
      border: 1px dashed #C8A462;
      padding: 5px 8px;
      margin-top: 6px;
      font-size: 8px;
      font-weight: 700;
      color: #855D25;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      background: #FAF8F5;
      display: inline-block;
      width: 100%;
    }

    /* Footer */
    .footer-bar {
      border-top: 1.5px solid #C8A462;
      padding-top: 8px;
      margin-top: 10px;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #171717;
      display: flex;
      justify-content: space-between;
      font-weight: 600;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .invoice-wrapper {
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="watermark-emblem">RAJWADI</div>

    <!-- Onscreen Print Button Toolbar (Hidden in print/pdf) -->
    <div class="no-print">
      <div style="font-size: 11.5px; font-weight: 600; color: #581522;">
        👑 Official Tax Invoice &bull; #${orderNum}
      </div>
      <div>
        <button onclick="window.print()" style="padding: 5px 14px; background: #581522; color: #FFFFFF; border: none; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px; cursor: pointer;">
          Print / Save PDF
        </button>
        <button onclick="window.close()" style="margin-left: 8px; padding: 5px 12px; background: #FFFFFF; color: #4A3E37; border: 1px solid #D9C4B0; font-size: 10.5px; border-radius: 2px; cursor: pointer;">
          Close
        </button>
      </div>
    </div>

    <!-- 1. HEADER SECTION -->
    <table class="header-table">
      <tr>
        <td class="brand-logo-cell">
          <div class="brand-monogram">
            <div class="brand-monogram-initials">RW</div>
            <div class="brand-monogram-tag">ATELIER</div>
          </div>
        </td>
        <td class="brand-info-cell">
          <div class="brand-title">RAJWADI</div>
          <div class="brand-sub">HAUTE COUTURE &amp; LUXURY RAJPUTI ATELIER</div>
          <div class="brand-address">
            Flagship Atelier: Johari Bazaar, Pink City, Jaipur, Rajasthan 302001<br>
            GSTIN: 08AAACR1234F1Z8 | State: 08 (Rajasthan) | Ph: +91 98290 00000<br>
            Web: www.rajwadirajputiposhak.com | Email: royal@rajwadirajputiposhak.com
          </div>
        </td>
        <td class="meta-cell">
          <div class="tax-badge">OFFICIAL TAX INVOICE</div>
          <div class="meta-details">
            <strong>Invoice No:</strong> ${invoiceNo}<br>
            <strong>Invoice Date:</strong> ${dateFormatted}<br>
            <strong>Order Reference:</strong> #${orderNum}<br>
            <strong>Payment Ref:</strong> ${paymentRefLabel}
          </div>
        </td>
      </tr>
    </table>

    <div class="gold-divider"></div>

    <!-- 2. BILLED TO & SHIPPED TO CARDS -->
    <div class="client-grid">
      <div class="client-card">
        <div class="card-label">BILLED TO (TAX INVOICE DETAILS)</div>
        <div class="client-name">${patronName}</div>
        <div class="client-text">
          ${patronAddress}<br>
          Email: ${patronEmail}<br>
          Phone: ${patronPhone} | Place of Supply: ${patronState} (State Code: ${stateCode})
        </div>
      </div>

      <div class="client-card-spacer"></div>

      <div class="client-card">
        <div class="card-label">SHIPPED TO (DELIVERY DESTINATION)</div>
        <div class="client-name">${patronName}</div>
        <div class="client-text">
          ${patronAddress}<br>
          ${patronCity}, ${patronState} ${patronPincode}<br>
          Delivery Contact: ${patronPhone}
        </div>
      </div>
    </div>

    <!-- 3. ITEMS & DESIGN SPECIFICATION TABLE -->
    <div class="table-header-bar">
      <div class="table-title">ITEMS &amp; DESIGN SPECIFICATION</div>
      <div class="items-count-tag">${totalItemsCount} ${totalItemsCount === 1 ? "ITEM" : "ITEMS"}</div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 38px; text-align: center;">S.NO</th>
          <th style="text-align: left;">ITEM &amp; DESIGN SPECIFICATION</th>
          <th style="width: 55px; text-align: center;">HSN</th>
          <th style="width: 75px; text-align: center;">SIZE / SKU</th>
          <th style="width: 45px; text-align: center;">QTY</th>
          <th style="width: 85px; text-align: right;">RATE (INR)</th>
          <th style="width: 95px; text-align: right;">AMOUNT (INR)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- 4. FINANCIAL & PAYMENT SUMMARY -->
    <div class="summary-grid">
      <div class="summary-card">
        ${isPaid
          ? `<div class="status-badge-green">PAYMENT CONFIRMED</div>`
          : `<div class="status-badge-amber">VERIFICATION IN PROGRESS</div>`
        }
        <div class="status-line"><strong>${paymentMethodLabel}</strong></div>
        <div class="status-line">Transaction Ref: <strong>${paymentRefLabel}</strong></div>
        <div class="status-line">GST Compliance: 18% Inclusive Tax Included</div>
        <div class="status-line">Order Status: <strong>PROCESSING</strong></div>
        <div class="status-line">Authenticity: <strong>100% Handcrafted Atelier Certified</strong></div>
      </div>

      <div class="client-card-spacer"></div>

      <div class="summary-card">
        <div class="card-label">INVOICE SUMMARY</div>
        <div class="summary-row">
          <span>Taxable Base Value (Net Excl. Tax):</span>
          <span style="font-family: monospace;">Rs. ${taxableBase.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        ${isIntraState
          ? `
            <div class="summary-row">
              <span>CGST (9% Central GST - RJ):</span>
              <span style="font-family: monospace;">Rs. ${halfGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="summary-row">
              <span>SGST (9% State GST - RJ):</span>
              <span style="font-family: monospace;">Rs. ${halfGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          `
          : `
            <div class="summary-row">
              <span>IGST (18% Integrated GST):</span>
              <span style="font-family: monospace;">Rs. ${totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          `
        }

        <div class="summary-row">
          <span>Total 18% GST (Included in Price):</span>
          <span style="font-family: monospace;">Rs. ${totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        ${stitchingInRupees > 0
          ? `
            <div class="summary-row">
              <span>Bespoke Atelier Stitching:</span>
              <span style="font-family: monospace;">Rs. ${stitchingInRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          `
          : ""
        }

        ${discountInRupees > 0
          ? `
            <div class="summary-row" style="color: #065F46;">
              <span>Promotional Discount:</span>
              <span style="font-family: monospace;">-Rs. ${discountInRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          `
          : ""
        }

        <div class="summary-row">
          <span>Couture Packaging &amp; Shipping:</span>
          <span style="color: #065F46; font-weight: 600;">COMPLIMENTARY</span>
        </div>

        <div class="total-banner">
          <span>TOTAL INVOICE VALUE (INR)</span>
          <span class="total-banner-val">Rs. ${totalInRupees.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <!-- 5. TERMS & DIGITAL ATELIER SEAL -->
    <div class="terms-grid">
      <div class="terms-cell">
        <div class="terms-title">BOUTIQUE TERMS &amp; CARE INSTRUCTIONS</div>
        <ol class="terms-list">
          <li>All handcrafted couture ensembles are tailored with bespoke artistry. Strictly Professional Dry Clean Only.</li>
          <li>Alteration and fitment requests are honored within 7 days of delivery at our Jaipur atelier.</li>
          <li>This document serves as an authentic Computer-Generated Tax Invoice under Indian GST regulations.</li>
        </ol>
      </div>

      <div class="seal-cell">
        <div class="seal-title">FOR RAJWADI BY ATELIER</div>
        <div class="seal-sub">Digitally Certified &amp; Approved</div>
        <div class="seal-stamp-box">
          OFFICIAL DIGITAL ATELIER SEAL
        </div>
      </div>
    </div>

    <!-- 6. FOOTER -->
    <div class="footer-bar">
      <div>RAJWADI BY ATELIER</div>
      <div>www.rajwadirajputiposhak.com</div>
      <div>JAIPUR | RAJASTHAN</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Downloads the professional luxury tax invoice directly as an HTML/PDF printable file
 * or opens the high-resolution browser print dialog.
 */
export function downloadReceipt(order: ReceiptOrderData) {
  const htmlContent = generateReceiptHtml(order);

  // Open in a dedicated window and trigger print
  const printWindow = window.open("", "_blank", "width=880,height=920");
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
    a.download = `Rajwadi_Tax_Invoice_${orderRef}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
