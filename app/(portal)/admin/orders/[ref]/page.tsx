import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getOrderAdmin } from "@/lib/admin-data";
import { STAGE_LABEL, gbpFromPence, formatDate, type OrderStage } from "@/lib/orders";
import { ADVANCE_ORDER, STAGE_NOTIFICATION, channelsForUser } from "@/lib/portal-ops";
import { StageAdvance } from "@/components/portal/stage-advance";
import { AdminNoteForm } from "@/components/portal/admin-note-form";

const BUTTON: Partial<Record<OrderStage, string>> = {
  contract_sent: "Send contract",
  payment_pending: "Request payment",
  payment_received: "Confirm payment received",
};

export default async function AdminOrderDetail({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const me = (await getCurrentUser())!;
  const data = await getOrderAdmin(ref);
  if (!data || !data.customer) notFound();
  const { order, customer, events, notes, contract, payment, notifications, audit } = data;

  const stage = order.stage as OrderStage;
  const idx = ADVANCE_ORDER.indexOf(stage);
  const nextStage = idx >= 0 && idx < ADVANCE_ORDER.length - 1 ? ADVANCE_ORDER[idx + 1] : null;
  const def = nextStage ? STAGE_NOTIFICATION[nextStage] ?? null : null;
  const eligible = def ? channelsForUser(customer, def.channels) : [];
  const financeOnly = nextStage === "payment_received";
  const canAdvance = nextStage && (!financeOnly || me.role === "finance");

  return (
    <div className="max-w-[900px]">
      <Link href="/admin/orders" className="text-[.8rem] font-medium text-ink-2 hover:text-ink">&larr; All orders</Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{order.reference}</div>
          <h1 className="mt-1 text-2xl font-semibold">{order.modelName} · {gbpFromPence(order.totalAmount)}</h1>
          <p className="mt-1 text-[.9rem] text-ink-2">{customer.name} · {customer.email}{customer.phone ? ` · ${customer.phone}` : ""}</p>
        </div>
        <span className="rounded-full bg-ink px-3.5 py-1.5 text-[.66rem] font-semibold uppercase tracking-[.1em] text-white">{STAGE_LABEL[stage]}</span>
      </div>

      {/* Stage advance */}
      <section className="mt-6 rounded-lg border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Stage</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {nextStage ? (
            canAdvance ? (
              <StageAdvance orderId={order.id} fromLabel={STAGE_LABEL[stage]} toStage={nextStage} toLabel={STAGE_LABEL[nextStage]} buttonLabel={BUTTON[nextStage] || `Advance to ${STAGE_LABEL[nextStage]}`} notification={def} eligibleChannels={eligible} />
            ) : (
              <p className="text-[.88rem] text-ink-2">Awaiting <b className="text-ink">finance</b> to confirm payment received.</p>
            )
          ) : (
            <p className="text-[.88rem] text-ink-2">This order is delivered. Lifecycle complete.</p>
          )}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Contract */}
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Contract</h2>
          {contract ? (
            <p className="mt-2 text-[.9rem]">
              Status: <b>{contract.status}</b>{contract.signedAt ? ` · signed ${formatDate(contract.signedAt)} by ${contract.signatureName}` : ""}<br />
              <span className="text-ink-2">Terms {contract.tncsVersion}</span>
            </p>
          ) : <p className="mt-2 text-[.88rem] text-ink-2">Not issued yet. Use "Send contract".</p>}
        </section>

        {/* Payment */}
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Payment</h2>
          {payment ? (
            <p className="mt-2 text-[.9rem]">
              {payment.reference} · {gbpFromPence(payment.amount)}<br />
              Status: <b>{payment.status}</b>{payment.markedSentAt && payment.status === "sent" ? " · customer marked sent" : ""}{payment.confirmedAt ? ` · confirmed ${formatDate(payment.confirmedAt)}` : ""}
            </p>
          ) : <p className="mt-2 text-[.88rem] text-ink-2">Not requested yet. Use "Request payment".</p>}
        </section>
      </div>

      {/* Notes */}
      <section className="mt-4 rounded-lg border border-line bg-white p-5 sm:p-6">
        <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Notes</h2>
        <AdminNoteForm orderId={order.id} />
        <ul className="mt-4 flex flex-col gap-3">
          {notes.length === 0 && <li className="text-[.88rem] text-ink-2">No notes yet.</li>}
          {notes.map((n) => (
            <li key={n.id} className="rounded-[4px] border border-line p-3">
              <div className="flex items-center justify-between gap-2 text-[.74rem] text-ink-2">
                <span>{n.authorName} · {formatDate(n.createdAt)}</span>
                <span className={`rounded-full px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-[.08em] ${n.customerVisible ? "bg-ink text-white" : "border border-line-2"}`}>{n.customerVisible ? "Customer-visible" : "Internal"}</span>
              </div>
              <p className="mt-1 text-[.92rem]">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Notifications + audit */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Notifications sent</h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-[.82rem]">
            {notifications.length === 0 && <li className="text-ink-2">None sent.</li>}
            {notifications.slice(0, 12).map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-2"><span>{n.event} · <span className="uppercase">{n.channel}</span></span><span className="text-ink-2">{formatDate(n.createdAt)}</span></li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.14em] text-ink-2">Audit log</h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-[.82rem]">
            {audit.length === 0 && <li className="text-ink-2">No entries.</li>}
            {audit.slice(0, 12).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2"><span>{a.action} · {a.actorName}</span><span className="text-ink-2">{formatDate(a.createdAt)}</span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
