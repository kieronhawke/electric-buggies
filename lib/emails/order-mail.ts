import "server-only";
import { sendTemplate, accountLinks } from "./send";
import { site } from "../site";
import { gbpFromPence, formatDate } from "../format";
import { STAGE_LABEL, type OrderStage } from "../orders";
import { BANK_DETAILS } from "../portal-ops";
import type { TemplateKey } from "./registry";

const STAGE_TEMPLATE: Partial<Record<OrderStage, TemplateKey>> = {
  contract_sent: "contract-ready",
  payment_pending: "payment-details",
  payment_received: "payment-received",
  in_production: "order-update",
  quality_check: "order-update",
  in_transit: "order-update",
  ready_for_delivery: "ready-for-delivery",
  delivered: "delivered",
};

type OrderRow = { id: string; reference: string; modelName: string; modelSlug: string; totalAmount: number; configuration: unknown; estDeliveryEnd: Date | null };
type CustomerRow = { name: string; email: string };

/** Send the branded email for a stage to the customer (email channel). */
export async function sendOrderStageEmail(order: OrderRow, customer: CustomerRow, stage: OrderStage, extra?: { paymentRef?: string }) {
  const key = STAGE_TEMPLATE[stage];
  if (!key) return;
  const config = (order.configuration ?? {}) as Record<string, string>;
  const link = `${site.url}/account/orders/${order.reference}`;
  const data: Record<string, string | undefined> = {
    firstName: customer.name.split(" ")[0],
    lastName: customer.name.split(" ").slice(1).join(" "),
    orderRef: order.reference,
    model: order.modelName,
    colour: config.colour, wheels: config.wheels, interior: config.interior, branding: config.branding,
    buildSummary: [config.colour, config.wheels, config.interior].filter(Boolean).join(", "),
    total: gbpFromPence(order.totalAmount),
    stage: STAGE_LABEL[stage],
    stageHeadline: `Your ${order.modelName} is now ${STAGE_LABEL[stage].toLowerCase()}`,
    estDelivery: formatDate(order.estDeliveryEnd) ?? "To be confirmed",
    warrantyStatus: "Active",
    _modelSlug: order.modelSlug,
    ...accountLinks({ ctaLink: link, contractLink: link, paymentLink: link, accountLink: link }),
  };
  if (stage === "payment_pending") {
    Object.assign(data, {
      bankName: BANK_DETAILS.accountName, bankSort: BANK_DETAILS.sortCode,
      bankAccount: BANK_DETAILS.accountNumber, bankIban: BANK_DETAILS.iban || "On request",
      paymentRef: extra?.paymentRef || order.reference,
    });
  }
  await sendTemplate(key, customer.email, data, { orderId: order.id });
}

/** Order-confirmed email when a new order is created. */
export async function sendOrderConfirmed(order: OrderRow, customer: CustomerRow) {
  const config = (order.configuration ?? {}) as Record<string, string>;
  const link = `${site.url}/account/orders/${order.reference}`;
  await sendTemplate("order-confirmed", customer.email, {
    firstName: customer.name.split(" ")[0], orderRef: order.reference, model: order.modelName,
    colour: config.colour, wheels: config.wheels, interior: config.interior, branding: config.branding,
    estDelivery: formatDate(order.estDeliveryEnd) ?? "To be confirmed", _modelSlug: order.modelSlug,
    ...accountLinks({ ctaLink: link }),
  }, { orderId: order.id });
}
