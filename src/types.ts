export interface InvoiceItem {
  id: string;
  detail: string;
  hsn: string;
  qty: number;
  rate: number;
  discount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
}

export interface PartyDetails {
  name: string;
  address: string;
  gstin: string;
  state: string;
  stateCode: string;
}

export interface InvoiceData {
  reverseCharge: string;
  invoiceNo: string;
  invoiceDate: string;
  state: string;
  stateCode: string;
  transportMode: string;
  vehicleNo: string;
  dateOfSupply: string;
  placeOfSupply: string;
  billedTo: PartyDetails;
  shippedTo: PartyDetails;
  items: InvoiceItem[];
}

