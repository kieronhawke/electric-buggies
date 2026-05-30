/** Email template registry: keys, names, subjects, preheaders, triggers. */
export type TemplateKey =
  | "order-confirmed" | "welcome-next-steps" | "contract-ready" | "payment-details"
  | "payment-received" | "order-update" | "ready-for-delivery" | "delivered"
  | "quote-received" | "enquiry-received" | "quote-abandoned";

export interface TemplateMeta {
  key: TemplateKey;
  name: string;
  purpose: string;
  trigger: string;
  subject: string;
  preheader: string;
}

export const TEMPLATES: TemplateMeta[] = [
  { key: "order-confirmed", name: "Order confirmed", purpose: "Confirms a new order", trigger: "Order placed / confirmed", subject: "Your order is confirmed, {{orderRef}}", preheader: "Thank you. Your {{model}} order is confirmed and underway." },
  { key: "welcome-next-steps", name: "Welcome & next steps", purpose: "New account welcome / verify", trigger: "Account created", subject: "Welcome to Electric Buggies", preheader: "Welcome aboard, {{firstName}}. Here is what happens next." },
  { key: "contract-ready", name: "Contract ready", purpose: "Contract issued to sign", trigger: "Stage: contract sent", subject: "Your contract is ready to sign", preheader: "Your order contract is ready to review and sign." },
  { key: "payment-details", name: "Payment details", purpose: "Bank details + payment reference", trigger: "Contract signed / payment requested", subject: "Payment details for order {{orderRef}}", preheader: "Your bank details and payment reference are ready." },
  { key: "payment-received", name: "Payment received", purpose: "Confirms payment, production begins", trigger: "Finance confirms payment", subject: "Payment received, production begins", preheader: "Thank you. We have confirmed your payment." },
  { key: "order-update", name: "Order update", purpose: "Reusable per stage change", trigger: "Stage change (production / quality / transit)", subject: "Update on your order {{orderRef}}", preheader: "Your {{model}} has reached a new stage." },
  { key: "ready-for-delivery", name: "Ready for delivery", purpose: "Prompts the customer to choose a date", trigger: "Stage: ready for delivery", subject: "Your {{model}} is ready for delivery", preheader: "Choose your preferred delivery date in your account." },
  { key: "delivered", name: "Delivered", purpose: "Warm delivery confirmation", trigger: "Stage: delivered", subject: "Your {{model}} has been delivered", preheader: "Enjoy every journey. Your vehicle is now in your fleet." },
  { key: "quote-received", name: "Quote received", purpose: "Issued quote, with savings + inclusions", trigger: "Admin issues a quote", subject: "Your Electric Buggies quote {{quoteRef}}", preheader: "Your tailored quote for the {{model}} is ready to view." },
  { key: "enquiry-received", name: "Enquiry received", purpose: "Auto-reply to a general enquiry", trigger: "Enquiry / quote request received", subject: "Thanks for getting in touch", preheader: "We have your enquiry and will be in touch shortly." },
  { key: "quote-abandoned", name: "Quote abandoned", purpose: "Recovery email for an incomplete quote", trigger: "Quote/hire/airport email entered, not submitted", subject: "Your Electric Buggies quote, still here when you are", preheader: "Pick up where you left off, or let us help." },
];

export const templateMeta = (key: string) => TEMPLATES.find((t) => t.key === key);

/** Merge fields offered as draggable chips in the editor. */
export const MERGE_FIELDS: { token: string; label: string }[] = [
  { token: "firstName", label: "First name" }, { token: "lastName", label: "Last name" },
  { token: "orderRef", label: "Order reference" }, { token: "model", label: "Model" },
  { token: "buildSummary", label: "Build summary" }, { token: "colour", label: "Colour" },
  { token: "wheels", label: "Wheels" }, { token: "interior", label: "Interior" }, { token: "branding", label: "Branding" },
  { token: "price", label: "Price" }, { token: "discount", label: "Discount" }, { token: "total", label: "Total" },
  { token: "bankName", label: "Bank account name" }, { token: "bankSort", label: "Sort code" }, { token: "bankAccount", label: "Account number" }, { token: "bankIban", label: "IBAN" },
  { token: "paymentRef", label: "Payment reference" }, { token: "stage", label: "Stage" }, { token: "stageHeadline", label: "Stage headline" },
  { token: "estDelivery", label: "Estimated delivery" }, { token: "deliveryDate", label: "Delivery date" }, { token: "warrantyStatus", label: "Warranty status" },
  { token: "quoteRef", label: "Quote reference" }, { token: "phone", label: "Phone" },
  { token: "accountLink", label: "Account link" }, { token: "ctaLink", label: "Primary button link" }, { token: "ctaLink2", label: "Secondary button link" },
];

/** Sample data for previews and test sends. */
export const SAMPLE_DATA: Record<string, string> = {
  firstName: "Olivia", lastName: "Hartwell", orderRef: "EB-2026-0001", model: "The Six",
  buildSummary: "British Racing Green, Noble wheels, Tan leather", colour: "British Racing Green",
  wheels: "18\" Machined Alloy", interior: "Tan Premium", branding: "Logo on front and both sides",
  price: "£31,000", discount: "8%", total: "£28,950", bankName: "Electric Buggies Ltd",
  bankSort: "00-00-00", bankAccount: "00000000", bankIban: "GB00 0000 0000 0000 00",
  paymentRef: "EB-PAY-0001", stage: "In production", stageHeadline: "Your buggy is in production",
  estDelivery: "September 2026", deliveryDate: "12 September 2026", warrantyStatus: "Active",
  quoteRef: "EB-Q-0001", phone: "+44 (0)20 3936 0000",
  accountLink: "#", privacyLink: "#", unsubscribeLink: "#", ctaLink: "#", ctaLink2: "#",
  _modelSlug: "the-six",
};
