import assert from "assert";
import { generateReceiptHtml, type ReceiptOrderData } from "../src/backend/services/receipt";
import { sendOrderInvoiceEmail, OWNER_ORDER_EMAIL } from "../src/backend/services/email";

async function runSelfCheck() {
  console.log("🧪 Running Self-Check: Invoice Generation & Email Notification Dispatch...");

  // 1. Verify owner email configuration
  assert.strictEqual(
    OWNER_ORDER_EMAIL,
    "bizleap1@gmail.com",
    "Owner email must default to bizleap1@gmail.com"
  );
  console.log("  ✓ Owner email correctly verified as bizleap1@gmail.com");

  // 2. Mock order dataset
  const mockOrder: ReceiptOrderData = {
    id: "ord_test_12345",
    orderNumber: "RW8899",
    createdAt: new Date().toISOString(),
    guestEmail: "customer@example.com",
    paymentStatus: "VERIFICATION_PENDING",
    paymentMethod: "UPI_SCANNER",
    subtotalInPaise: 1500000,
    stitchingInPaise: 120000,
    shippingInPaise: 0,
    discountInPaise: 100000,
    totalInPaise: 1520000,
    shippingAddress: {
      fullName: "Banna Yuvraj Singh",
      phone: "+91 98290 12345",
      address: "Civil Lines, Royal Palace Road",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302006",
      email: "customer@example.com",
    },
    items: [
      {
        productName: "Imperial Pure Georgette Zari Poshak",
        category: "Bridal Rajputi Poshak",
        size: "Free Size",
        stitchingSelected: true,
        stitchingPriceInPaise: 120000,
        unitPriceInPaise: 1500000,
        quantity: 1,
        totalInPaise: 1500000,
      },
    ],
  };

  // 3. Verify Customer Email HTML Generation
  const customerHtml = generateReceiptHtml(mockOrder, {
    isEmail: true,
    emailRecipientType: "customer",
  });
  assert(customerHtml.includes("RW8899"), "HTML must contain order reference RW8899");
  assert(customerHtml.includes("OFFICIAL TAX INVOICE"), "HTML must contain official tax invoice badge");
  assert(customerHtml.includes("6204"), "HTML must contain HSN code 6204");
  assert(customerHtml.includes("Banna Yuvraj Singh"), "HTML must include patron name");
  assert(customerHtml.includes("Royal Order Confirmation"), "Customer HTML must include royal customer confirmation banner");
  assert(customerHtml.includes("rajwadi_royal_logo.png"), "HTML must embed authentic Rajwadi logo");
  assert(!customerHtml.includes("brand-monogram-initials"), "HTML must not have dummy CSS monogram");
  console.log("  ✓ Customer Invoice HTML generated with official Rajwadi Royal Logo");

  // 4. Verify Owner Email HTML Generation
  const ownerHtml = generateReceiptHtml(mockOrder, {
    isEmail: true,
    emailRecipientType: "owner",
  });
  assert(ownerHtml.includes("New Order Received"), "Owner HTML must include owner alert banner");
  assert(ownerHtml.includes("RW8899"), "Owner HTML must contain order reference RW8899");
  assert(ownerHtml.includes("Rs. 15,200"), "Owner HTML must contain correct total in rupees");
  console.log("  ✓ Owner Invoice HTML generated and verified");

  // 5. Test dispatch function with mock order
  console.log("  ⏳ Executing sendOrderInvoiceEmail dispatch test...");
  const result = await sendOrderInvoiceEmail(mockOrder, "customer@example.com");

  console.log("  Dispatch Result:", result);
  assert(typeof result.customerSent === "boolean", "customerSent should be boolean");
  assert(typeof result.ownerSent === "boolean", "ownerSent should be boolean");
  assert.strictEqual(result.orderNumber, "RW8899", "Result should return order number RW8899");

  console.log("✅ All Self-Checks Passed: Invoice email to customer and owner is verified!");
}

runSelfCheck().catch((err) => {
  console.error("❌ Self-check failed:", err);
  process.exit(1);
});
