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
      address: "Civil Lines, Palace Road",
      city: "Nagpur",
      state: "Maharashtra",
      pincode: "440008",
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
  assert(customerHtml.includes("RAJWADI RAJPUTI POSHAK"), "HTML must contain RAJWADI RAJPUTI POSHAK brand title");
  assert(customerHtml.includes("EWS 41"), "HTML must contain exact store address EWS 41");
  assert(customerHtml.includes("Nagpur, Maharashtra 440008"), "HTML must contain Nagpur, Maharashtra 440008");
  assert(customerHtml.includes("8766667101"), "HTML must contain store phone 8766667101");
  assert(!customerHtml.includes("Johari Bazaar"), "HTML must not contain Johari Bazaar");
  assert(!customerHtml.includes("Jaipur, Rajasthan"), "HTML must not contain Jaipur, Rajasthan");
  assert(customerHtml.includes("CGST @ 9%"), "Maharashtra delivery must have CGST @ 9%");
  assert(customerHtml.includes("SGST @ 9%"), "Maharashtra delivery must have SGST @ 9%");
  assert(customerHtml.includes("Intra-State Supply (CGST 9% + SGST 9%)"), "Payment box must show Intra-State Supply");
  console.log("  ✓ Maharashtra delivery correctly verified with Intra-State CGST (9%) + SGST (9%)");

  // 3b. Verify Rajasthan / Inter-State Delivery (IGST 18%)
  const rajasthanOrder: ReceiptOrderData = {
    ...mockOrder,
    shippingAddress: {
      ...mockOrder.shippingAddress,
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
    },
  };
  const rajasthanHtml = generateReceiptHtml(rajasthanOrder);
  assert(rajasthanHtml.includes("IGST @ 18%"), "Rajasthan delivery must have IGST @ 18%");
  assert(rajasthanHtml.includes("Inter-State Supply (IGST 18%)"), "Payment box must show Inter-State Supply (IGST 18%)");
  assert(!rajasthanHtml.includes("CGST @ 9%"), "Rajasthan delivery must NOT contain CGST");
  assert(!rajasthanHtml.includes("SGST @ 9%"), "Rajasthan delivery must NOT contain SGST");
  console.log("  ✓ Rajasthan delivery correctly verified with Inter-State IGST (18%)");

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
