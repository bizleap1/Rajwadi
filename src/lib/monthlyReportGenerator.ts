export interface MonthlyReportData {
  reportPeriod: {
    month: number;
    year: number;
    label: string;
    generatedAt: string;
    reportReference: string;
  };
  summary: {
    totalOrders: number;
    paidOrdersCount: number;
    pendingOrdersCount: number;
    cancelledOrdersCount: number;
    totalGrossInPaise: number;
    totalGrossInRupees: number;
    totalPaidInPaise: number;
    totalPaidInRupees: number;
    totalPendingInPaise: number;
    totalPendingInRupees: number;
    totalStitchingInPaise: number;
    totalStitchingInRupees: number;
    totalDiscountInPaise: number;
    totalDiscountInRupees: number;
    totalShippingInPaise: number;
    totalShippingInRupees: number;
    avgOrderValueInRupees: number;
    fulfilmentBreakdown: Record<string, number>;
  };
  topProducts: Array<{
    productName: string;
    quantity: number;
    totalInRupees: number;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    date: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    city: string;
    state: string;
    paymentStatus: string;
    fulfilmentStatus: string;
    paymentMethod: string;
    utrNumber?: string | null;
    subtotalInPaise: number;
    stitchingInPaise: number;
    discountInPaise: number;
    totalInPaise: number;
    itemsCount: number;
    items: Array<{
      productName: string;
      size?: string;
      quantity: number;
      stitchingSelected?: boolean;
      totalInPaise: number;
    }>;
  }>;
}

export function generateMonthlyReportHtml(data: MonthlyReportData): string {
  const { reportPeriod, summary, topProducts, orders } = data;
  const generatedDateStr = new Date(reportPeriod.generatedAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const orderRowsHtml = orders.map((o, idx) => {
    const oDate = new Date(o.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const isPaid = o.paymentStatus === "PAID";
    const paymentBadgeColor = isPaid
      ? "background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0;"
      : "background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A;";

    const itemsSummary = o.items
      .map(
        (it) =>
          `${it.productName}${it.size ? ` (${it.size})` : ""}${it.stitchingSelected ? " [+Stitch]" : ""} ×${it.quantity}`
      )
      .join("; ");

    return `
      <tr style="border-bottom: 1px solid #EBD9C8; font-size: 11px; page-break-inside: avoid;">
        <td style="padding: 8px 6px; font-family: monospace; font-weight: bold; color: #6D1A2A;">${o.orderNumber}</td>
        <td style="padding: 8px 6px; color: #4A3E37; white-space: nowrap;">${oDate}</td>
        <td style="padding: 8px 6px;">
          <strong style="color: #171717; display: block;">${o.customerName}</strong>
          <span style="color: #8A796B; font-size: 10px;">${o.city}, ${o.state}</span>
        </td>
        <td style="padding: 8px 6px; color: #372F29; font-size: 10.5px; max-width: 240px; word-break: break-word;">
          ${itemsSummary || "—"}
        </td>
        <td style="padding: 8px 6px; text-align: center;">
          <span style="display: inline-block; padding: 2px 6px; border-radius: 2px; font-size: 9.5px; font-weight: 600; text-transform: uppercase; ${paymentBadgeColor}">
            ${o.paymentStatus}
          </span>
        </td>
        <td style="padding: 8px 6px; text-align: center; color: #4A3E37; font-size: 10px; font-weight: 500;">
          ${(o.fulfilmentStatus || "PENDING").replace(/_/g, " ")}
        </td>
        <td style="padding: 8px 6px; text-align: right; font-family: monospace; font-weight: bold; color: #171717; white-space: nowrap;">
          ₹ ${(o.totalInPaise / 100).toLocaleString("en-IN")}
        </td>
      </tr>
    `;
  }).join("");

  const topProductsHtml = topProducts.map((p, idx) => `
    <tr style="border-bottom: 1px solid #F0E5D8; font-size: 11.5px;">
      <td style="padding: 6px 8px; font-weight: bold; color: #855D25;">#${idx + 1}</td>
      <td style="padding: 6px 8px; color: #171717; font-weight: 500;">${p.productName}</td>
      <td style="padding: 6px 8px; text-align: center; color: #4A3E37; font-weight: 600;">${p.quantity} units</td>
      <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #6D1A2A;">
        ₹ ${p.totalInRupees.toLocaleString("en-IN")}
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Rajwadi Monthly Report — ${reportPeriod.label}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #FFFFFF;
      color: #171717;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .report-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 10px;
    }
    .header-box {
      border-bottom: 2px solid #6D1A2A;
      padding-bottom: 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-family: "Georgia", "Garamond", serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #6D1A2A;
      margin: 0 0 2px 0;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: #855D25;
      font-weight: 600;
    }
    .report-meta {
      text-align: right;
      font-size: 11px;
      color: #6B5E55;
    }
    .statement-title {
      font-family: "Georgia", serif;
      font-size: 18px;
      font-weight: 600;
      color: #171717;
      margin: 14px 0 6px 0;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .metric-card {
      background: #FAF6F0;
      border: 1px solid #EBD9C8;
      border-radius: 4px;
      padding: 10px 12px;
    }
    .metric-card.highlight {
      background: #FAF0E1;
      border: 1.5px solid #855D25;
    }
    .metric-label {
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #855D25;
      font-weight: 700;
      display: block;
      margin-bottom: 4px;
    }
    .metric-value {
      font-family: "Georgia", "Courier New", monospace;
      font-size: 18px;
      font-weight: bold;
      color: #6D1A2A;
      line-height: 1.2;
    }
    .metric-sub {
      font-size: 10px;
      color: #8A796B;
      margin-top: 3px;
      display: block;
    }
    .section-title {
      font-family: "Georgia", serif;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #6D1A2A;
      border-bottom: 1px solid #EBD9C8;
      padding-bottom: 5px;
      margin: 18px 0 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #FAF5EE;
      color: #855D25;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      padding: 7px 6px;
      border-top: 1px solid #EBD9C8;
      border-bottom: 1.5px solid #D9C4B0;
      font-weight: 700;
    }
    .signoff-box {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #EBD9C8;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 10.5px;
      color: #6B5E55;
    }
    .seal-circle {
      width: 68px;
      height: 68px;
      border: 1.5px dashed #855D25;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 8px;
      color: #855D25;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 4px;
      box-sizing: border-box;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Top Action Toolbar (Hidden during print) -->
    <div class="no-print" style="background: #F3EBE1; border: 1px solid #EBD9C8; padding: 10px 16px; border-radius: 4px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div style="font-size: 12px; color: #6D1A2A; font-weight: 600;">
        👑 Official Executive Report — ${reportPeriod.label}
      </div>
      <div>
        <button onclick="window.print()" style="padding: 6px 14px; background: #6D1A2A; color: white; border: none; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px; cursor: pointer;">
          Print / Save PDF
        </button>
        <button onclick="window.close()" style="margin-left: 8px; padding: 6px 12px; background: white; color: #4A3E37; border: 1px solid #D9C4B0; font-size: 11px; border-radius: 2px; cursor: pointer;">
          Close
        </button>
      </div>
    </div>

    <!-- Header Box -->
    <div class="header-box">
      <div>
        <div class="brand-title">RAJWADI</div>
        <div class="brand-sub">AUTHENTIC RAJPUTI POSHAK ATELIER</div>
        <div style="font-size: 10px; color: #6B5E55; margin-top: 3px;">
          Jaipur, Rajasthan, India &bull; rajwadirajputiposhak.com
        </div>
      </div>
      <div class="report-meta">
        <div><strong>AUDIT REF:</strong> <span style="font-family: monospace;">${reportPeriod.reportReference}</span></div>
        <div><strong>STATEMENT PERIOD:</strong> ${reportPeriod.label}</div>
        <div><strong>GENERATED:</strong> ${generatedDateStr}</div>
      </div>
    </div>

    <div class="statement-title">Executive Performance &amp; Revenue Statement</div>
    <div style="font-size: 11px; color: #6B5E55; margin-bottom: 12px;">
      Financial ledger, craftsmanship summary, and dispatch statistics for the month of ${reportPeriod.label}.
    </div>

    <!-- 4 Key Metric Cards -->
    <div class="metric-grid">
      <div class="metric-card highlight">
        <span class="metric-label">Realized Net Revenue</span>
        <div class="metric-value">₹ ${summary.totalPaidInRupees.toLocaleString("en-IN")}</div>
        <span class="metric-sub">${summary.paidOrdersCount} Paid Orders</span>
      </div>

      <div class="metric-card">
        <span class="metric-label">Gross Order Value</span>
        <div class="metric-value">₹ ${summary.totalGrossInRupees.toLocaleString("en-IN")}</div>
        <span class="metric-sub">${summary.totalOrders} Orders Placed</span>
      </div>

      <div class="metric-card">
        <span class="metric-label">Average Order Value</span>
        <div class="metric-value">₹ ${summary.avgOrderValueInRupees.toLocaleString("en-IN")}</div>
        <span class="metric-sub">Per realized patron</span>
      </div>

      <div class="metric-card">
        <span class="metric-label">Custom Stitching</span>
        <div class="metric-value">₹ ${summary.totalStitchingInRupees.toLocaleString("en-IN")}</div>
        <span class="metric-sub">Bespoke atelier crafting</span>
      </div>
    </div>

    <!-- Secondary Metrics Bar -->
    <div style="background: #FAF6F0; border: 1px solid #EBD9C8; padding: 8px 12px; border-radius: 4px; display: flex; justify-content: space-around; font-size: 11px; margin-bottom: 16px;">
      <div><strong>Discounts Granted:</strong> ₹ ${summary.totalDiscountInRupees.toLocaleString("en-IN")}</div>
      <div><strong>Pending Orders:</strong> ${summary.pendingOrdersCount}</div>
      <div><strong>Delivered:</strong> ${summary.fulfilmentBreakdown["DELIVERED"] || 0}</div>
      <div><strong>In Atelier:</strong> ${summary.fulfilmentBreakdown["IN_ATELIER"] || 0}</div>
      <div><strong>Dispatched:</strong> ${summary.fulfilmentBreakdown["DISPATCHED"] || 0}</div>
    </div>

    <!-- Top Products Table (if any) -->
    ${topProducts.length > 0 ? `
      <div class="section-title">Top Performing Poshaks of the Month</div>
      <table style="margin-bottom: 16px;">
        <thead>
          <tr>
            <th style="width: 40px; text-align: left;">Rank</th>
            <th style="text-align: left;">Poshak Ensemble Name</th>
            <th style="text-align: center;">Total Units Crafted</th>
            <th style="text-align: right;">Realized Sales (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${topProductsHtml}
        </tbody>
      </table>
    ` : ""}

    <!-- Comprehensive Orders Ledger Table -->
    <div class="section-title">Monthly Orders Ledger (${orders.length} Records)</div>
    <table>
      <thead>
        <tr>
          <th style="text-align: left;">Order #</th>
          <th style="text-align: left;">Date</th>
          <th style="text-align: left;">Patron &amp; Location</th>
          <th style="text-align: left;">Ensemble Details</th>
          <th style="text-align: center;">Payment</th>
          <th style="text-align: center;">Fulfilment</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${orders.length > 0 ? orderRowsHtml : `
          <tr>
            <td colspan="7" style="padding: 24px; text-align: center; color: #8A796B; font-size: 12px;">
              No orders were recorded during this period.
            </td>
          </tr>
        `}
      </tbody>
    </table>

    <!-- Official Sign-off -->
    <div class="signoff-box">
      <div>
        <strong style="color: #171717;">Certified Official Statement</strong><br>
        This financial &amp; operational audit report is automatically synthesized from the Rajwadi Production &amp; Order database.<br>
        All amounts are in Indian National Rupees (INR).
      </div>
      <div class="seal-circle">
        RAJWADI<br>OFFICIAL<br>AUDIT
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers high-resolution browser print / Save as PDF for the monthly statement.
 */
export function downloadMonthlyReportPdf(data: MonthlyReportData) {
  const htmlContent = generateMonthlyReportHtml(data);
  const printWindow = window.open("", "_blank", "width=920,height=900");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 400);
    };
  } else {
    // Fallback if popup is blocked
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rajwadi_Monthly_Report_${data.reportPeriod.label.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/**
 * Exports clean, structured CSV for Excel / Accounting software.
 */
export function downloadMonthlyCsv(data: MonthlyReportData) {
  const headers = [
    "Order Number",
    "Date",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "City",
    "State",
    "Payment Method",
    "UTR Reference",
    "Payment Status",
    "Fulfilment Status",
    "Total Items",
    "Subtotal (INR)",
    "Stitching (INR)",
    "Discount (INR)",
    "Total Amount (INR)",
    "Items Breakdown",
  ];

  const rows = data.orders.map((o) => {
    const itemsText = o.items
      .map(
        (it) =>
          `${it.productName}${it.size ? ` (${it.size})` : ""}${it.stitchingSelected ? " [+Stitching]" : ""} x${it.quantity}`
      )
      .join("; ");

    return [
      `"${o.orderNumber}"`,
      `"${new Date(o.date).toISOString().slice(0, 10)}"`,
      `"${(o.customerName || "").replace(/"/g, '""')}"`,
      `"${(o.customerEmail || "").replace(/"/g, '""')}"`,
      `"${(o.customerPhone || "").replace(/"/g, '""')}"`,
      `"${(o.city || "").replace(/"/g, '""')}"`,
      `"${(o.state || "").replace(/"/g, '""')}"`,
      `"${o.paymentMethod || "UPI"}"`,
      `"${o.utrNumber || ""}"`,
      `"${o.paymentStatus}"`,
      `"${o.fulfilmentStatus}"`,
      o.itemsCount,
      (o.subtotalInPaise / 100).toFixed(2),
      (o.stitchingInPaise / 100).toFixed(2),
      (o.discountInPaise / 100).toFixed(2),
      (o.totalInPaise / 100).toFixed(2),
      `"${itemsText.replace(/"/g, '""')}"`,
    ].join(",");
  });

  // Include UTF-8 BOM so Excel opens non-ASCII characters cleanly
  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Rajwadi_Monthly_Report_${data.reportPeriod.label.replace(/\s+/g, "_")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
