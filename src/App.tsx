import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import generatePDF from "react-to-pdf";
import type { InvoiceData } from "./types";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import { Sun, Moon, Printer, Download, FileText, Package } from "lucide-react";


const initialData: InvoiceData = {
  reverseCharge: "No",
  invoiceNo: "283",
  invoiceDate: new Date().toISOString().split("T")[0],
  state: "RAJASTHAN",
  stateCode: "08",
  transportMode: "",
  vehicleNo: "",
  dateOfSupply: "",
  placeOfSupply: "",
  billedTo: { name: "", address: "", gstin: "", state: "", stateCode: "" },
  shippedTo: { name: "", address: "", gstin: "", state: "", stateCode: "" },
  items: [{ id: "1", detail: "", hsn: "", qty: 1, rate: 0, discount: 0, cgstRate: 0, sgstRate: 0, igstRate: 0 }]
};

function App() {
  const [data, setData] = useState<InvoiceData>(initialData);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const totalAfterTax = useMemo(() => {
    return data.items.reduce((sum, item) => {
      const amount = item.qty * item.rate;
      const taxableValue = amount - item.discount;
      const cgstAmount = (taxableValue * item.cgstRate) / 100;
      const sgstAmount = (taxableValue * item.sgstRate) / 100;
      const igstAmount = (taxableValue * item.igstRate) / 100;
      return sum + taxableValue + cgstAmount + sgstAmount + igstAmount;
    }, 0);
  }, [data.items]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (invoiceRef.current) {
         generatePDF(invoiceRef, { filename: `Invoice_${data.invoiceNo}.pdf` });
    }
  };

  return (
    <div className="min-h-screen app-shell">
      <div className="app-atmosphere" />

      <header className="no-print sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-[1700px] flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Jaipur Craft</p>
            <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Billing Console</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatPill icon={<FileText size={15} />} label="Invoice" value={data.invoiceNo || "Draft"} />
            <StatPill icon={<Package size={15} />} label="Items" value={`${data.items.length}`} />
            <StatPill icon={<span className="text-xs font-semibold">Rs</span>} label="Total" value={totalAfterTax.toFixed(2)} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-900/60"
            >
              <Printer size={16} /> Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-[1700px] grid-cols-1 gap-6 px-4 py-5 lg:grid-cols-12 lg:px-8 print:block print:max-w-none print:p-0">
        <section className="no-print lg:col-span-5">
          <div className="max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
            <InvoiceForm data={data} setData={setData} />
          </div>
        </section>

        <section className="lg:col-span-7 print:w-full">
          <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-2 shadow-xl shadow-slate-900/5 dark:border-slate-800/80 dark:bg-slate-900/40 print:border-0 print:bg-white print:p-0 print:shadow-none">
            <div className="overflow-auto rounded-xl bg-[radial-gradient(circle_at_20%_20%,#f8fafc_0%,#f1f5f9_45%,#e2e8f0_100%)] p-4 dark:bg-[radial-gradient(circle_at_20%_20%,#0f172a_0%,#111827_45%,#020617_100%)] print:bg-white print:p-0">
              <div className="mx-auto w-fit rounded-md shadow-2xl shadow-slate-900/20 print:rounded-none print:shadow-none">
                <div ref={invoiceRef} className="pdf-capture-root">
                  <InvoicePreview data={data} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <span className="text-slate-500 dark:text-slate-400">{icon}</span>
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

export default App;

