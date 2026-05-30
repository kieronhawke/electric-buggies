import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getInventoryItem } from "@/lib/inventory-data";
import { labelForBand, type FeeLine } from "@/lib/costing";
import { vehicleImage } from "@/lib/vehicle-image";
import { gbpFromPence, formatDate } from "@/lib/format";
import { ProfitBadge } from "@/components/portal/profit-badge";
import { InventoryCostEditor } from "@/components/portal/inventory-cost-editor";
import { InventorySpecs } from "@/components/portal/inventory-specs";
import { InventoryPhotos } from "@/components/portal/inventory-photos";
import { InventoryStock } from "@/components/portal/inventory-stock";
import { InventorySuppliers } from "@/components/portal/inventory-suppliers";
import { InventoryStatus } from "@/components/portal/inventory-status";
import { cn } from "@/lib/utils";

const ST_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-paper text-ink-2 border-line-2",
  archived: "bg-rose-50 text-rose-700 border-rose-200",
};

export default async function InventoryDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["admin", "finance"]);
  const { id } = await params;
  const data = await getInventoryItem(id);
  if (!data) notFound();

  const { item, stack, rrp, profit, units, pos, priceLog, supplier, suppliers } = data;
  const specs = (item.specs as Record<string, string>) ?? {};
  const photos = (item.photos as { url: string; primary?: boolean }[]) ?? [];
  const otherFees = (item.otherFees as FeeLine[]) ?? [];

  return (
    <div>
      <Link href="/admin/inventory" className="text-[.8rem] font-medium text-ink-2 hover:text-ink">&larr; Inventory</Link>

      {/* Header */}
      <div className="mt-3 grid gap-4 rounded-lg border border-line bg-white p-5 sm:p-6 lg:grid-cols-[auto_1fr_320px] lg:items-center">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-paper">
          <Image src={vehicleImage(item.modelSlug)} alt={item.name} fill sizes="112px" className="object-contain p-1.5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[clamp(1.3rem,3vw,1.8rem)] font-semibold tracking-[-0.02em]">{item.name}</h1>
            <span className={cn("rounded-full border px-2.5 py-1 text-[.62rem] font-semibold uppercase tracking-[.06em]", ST_STYLE[item.status] ?? ST_STYLE.draft)}>{item.status}</span>
          </div>
          <div className="mt-1 text-[.82rem] text-ink-2 tabular-nums">{item.sku}</div>
          <div className="mt-2 flex flex-wrap gap-4 text-[.85rem] text-ink-2">
            <span>Cost <span className="font-semibold text-ink tabular-nums">{gbpFromPence(stack.totalCost)}</span></span>
            <span>RRP <span className="font-semibold text-ink tabular-nums">{rrp ? gbpFromPence(rrp) : "-"}</span></span>
            <span>{labelForBand[profit.band]}</span>
          </div>
        </div>
        <ProfitBadge profit={profit.profit} marginPct={profit.marginPct} band={profit.band} variant="standout" />
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <InventoryCostEditor
          item={{
            id: item.id,
            factoryFob: item.factoryFob,
            freightInsurance: item.freightInsurance,
            dutyPct: item.dutyPct,
            antiDumping: item.antiDumping,
            vatPct: item.vatPct,
            vatReclaimable: item.vatReclaimable,
            otherFees,
            ukDelivery: item.ukDelivery,
            pdi: item.pdi,
            branding: item.branding,
            warrantyReserve: item.warrantyReserve,
            rrp: item.rrp,
            targetMarginPct: item.targetMarginPct,
            autoPrice: item.autoPrice,
          }}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <InventorySpecs id={item.id} specs={specs} />
          <InventoryPhotos id={item.id} photos={photos} />
        </div>

        <InventoryStock
          id={item.id}
          stockOnHand={item.stockOnHand}
          stockOnOrder={item.stockOnOrder}
          stockAllocated={item.stockAllocated}
          reorderPoint={item.reorderPoint}
          location={item.location}
          units={units.map((u) => ({ id: u.id, vin: u.vin, status: u.status, location: u.location, createdAt: u.createdAt }))}
        />

        <InventorySuppliers
          itemId={item.id}
          supplierId={item.supplierId}
          supplier={supplier ? { id: supplier.id, name: supplier.name, country: supplier.country, contactName: supplier.contactName, contactEmail: supplier.contactEmail, leadTimeDays: supplier.leadTimeDays } : null}
          suppliers={suppliers.map((s) => ({ id: s.id, name: s.name, country: s.country, contactName: s.contactName, contactEmail: s.contactEmail, leadTimeDays: s.leadTimeDays }))}
          pos={pos.map((p) => ({ id: p.id, reference: p.reference, status: p.status, quantity: p.quantity, unitCost: p.unitCost, expectedAt: p.expectedAt }))}
        />

        {/* Price-change log */}
        <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[.74rem] font-semibold uppercase tracking-[.12em] text-ink-2">Price-change log</h2>
          {priceLog.length === 0 ? (
            <p className="mt-2 text-[.82rem] text-ink-2">No changes recorded yet.</p>
          ) : (
            <div className="mt-2 overflow-x-auto rounded-lg border border-line">
              <table className="w-full min-w-[480px] border-collapse text-[.85rem]">
                <thead><tr className="border-b border-line bg-paper text-left text-[.62rem] font-semibold uppercase tracking-[.1em] text-ink-2"><th className="p-2.5">Field</th><th className="p-2.5">Change</th><th className="p-2.5">By</th><th className="p-2.5">When</th></tr></thead>
                <tbody>
                  {priceLog.map((l) => (
                    <tr key={l.id} className="border-b border-line last:border-0">
                      <td className="p-2.5 font-medium">{l.field}</td>
                      <td className="p-2.5 tabular-nums text-ink-2">{l.oldValue ?? "-"} &rarr; <span className="text-ink">{l.newValue ?? "-"}</span></td>
                      <td className="p-2.5 text-ink-2">{l.actorName ?? "-"}</td>
                      <td className="p-2.5 text-ink-2">{formatDate(l.createdAt) ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <InventoryStatus id={item.id} status={item.status} />
      </div>
    </div>
  );
}
