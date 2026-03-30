import React from "react";
import type { InvoiceData, InvoiceItem } from "../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: InvoiceData;
  setData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}

export default function InvoiceForm({ data, setData }: Props) {
  const handleChange = (field: keyof InvoiceData | string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now().toString(), detail: "", hsn: "", qty: 1, rate: 0, discount: 0, cgstRate: 0, sgstRate: 0, igstRate: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    const newItems = [...data.items];
    newItems.splice(index, 1);
    setData((prev) => ({ ...prev, items: newItems }));
  };

  const copyBillingToShipping = () => {
    setData((prev) => ({
      ...prev,
      shippedTo: {
        ...prev.billedTo,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Billing Input</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-slate-900 dark:text-white">Create A Clean Invoice</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fill required details, review in the right panel, then print or export PDF.</p>
      </section>

      <SectionCard title="Invoice Meta">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Invoice No" value={data.invoiceNo} onChange={(e) => handleChange("invoiceNo", e.target.value)} />
          <Input label="Invoice Date" type="date" value={data.invoiceDate} onChange={(e) => handleChange("invoiceDate", e.target.value)} />
          <Select
            label="Reverse Charge"
            value={data.reverseCharge}
            onChange={(e) => handleChange("reverseCharge", e.target.value)}
            options={["No", "Yes"]}
          />
          <Input label="State" value={data.state} onChange={(e) => handleChange("state", e.target.value)} />
          <Input label="State Code" value={data.stateCode} onChange={(e) => handleChange("stateCode", e.target.value)} />
          <Input label="Transport Mode" value={data.transportMode} onChange={(e) => handleChange("transportMode", e.target.value)} />
          <Input label="Vehicle No" value={data.vehicleNo} onChange={(e) => handleChange("vehicleNo", e.target.value)} />
          <Input label="Date of Supply" value={data.dateOfSupply} onChange={(e) => handleChange("dateOfSupply", e.target.value)} />
          <div className="md:col-span-2">
            <Input label="Place of Supply" value={data.placeOfSupply} onChange={(e) => handleChange("placeOfSupply", e.target.value)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Party Details"
        action={
          <button
            onClick={copyBillingToShipping}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Copy Billed To to Shipped To
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Billed To (Receiver)</h3>
            <div className="space-y-3">
              <Input label="Name" value={data.billedTo.name} onChange={(e) => handleChange("billedTo.name", e.target.value)} />
              <Input label="Address" value={data.billedTo.address} onChange={(e) => handleChange("billedTo.address", e.target.value)} />
              <Input label="GSTIN" value={data.billedTo.gstin} onChange={(e) => handleChange("billedTo.gstin", e.target.value.toUpperCase())} maxLength={15} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="State" value={data.billedTo.state} onChange={(e) => handleChange("billedTo.state", e.target.value)} />
                <Input label="State Code" value={data.billedTo.stateCode} onChange={(e) => handleChange("billedTo.stateCode", e.target.value)} maxLength={2} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Shipped To (Consignee)</h3>
            <div className="space-y-3">
              <Input label="Name" value={data.shippedTo.name} onChange={(e) => handleChange("shippedTo.name", e.target.value)} />
              <Input label="Address" value={data.shippedTo.address} onChange={(e) => handleChange("shippedTo.address", e.target.value)} />
              <Input label="GSTIN" value={data.shippedTo.gstin} onChange={(e) => handleChange("shippedTo.gstin", e.target.value.toUpperCase())} maxLength={15} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="State" value={data.shippedTo.state} onChange={(e) => handleChange("shippedTo.state", e.target.value)} />
                <Input label="State Code" value={data.shippedTo.stateCode} onChange={(e) => handleChange("shippedTo.stateCode", e.target.value)} maxLength={2} />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Item Details"
        action={
          <button
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <Plus size={14} /> Add Item
          </button>
        }
      >
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <button
                onClick={() => removeItem(index)}
                className="absolute right-3 top-3 rounded-md p-1 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/20"
                aria-label="Remove item"
              >
                <Trash2 size={15} />
              </button>

              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Item #{index + 1}</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Input label="Detail / Name" value={item.detail} onChange={(e) => handleItemChange(index, "detail", e.target.value)} />
                </div>
                <Input label="HSN" value={item.hsn} onChange={(e) => handleItemChange(index, "hsn", e.target.value)} />
                <Input label="Qty" type="number" value={item.qty} onChange={(e) => handleItemChange(index, "qty", Number(e.target.value) || 0)} />
                <Input label="Rate" type="number" value={item.rate} onChange={(e) => handleItemChange(index, "rate", Number(e.target.value) || 0)} />
                <Input label="Discount" type="number" value={item.discount} onChange={(e) => handleItemChange(index, "discount", Number(e.target.value) || 0)} />
                <Input label="CGST (%)" type="number" value={item.cgstRate} onChange={(e) => handleItemChange(index, "cgstRate", Number(e.target.value) || 0)} />
                <Input label="SGST (%)" type="number" value={item.sgstRate} onChange={(e) => handleItemChange(index, "sgstRate", Number(e.target.value) || 0)} />
                <Input label="IGST (%)" type="number" value={item.igstRate} onChange={(e) => handleItemChange(index, "igstRate", Number(e.target.value) || 0)} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/30">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Input({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</label>
      <input
        className={`rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700 ${className}`}
        {...props}
      />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</label>
      <select
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

