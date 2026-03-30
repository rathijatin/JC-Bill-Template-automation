import type { InvoiceData } from "../types";
import { numberToWords } from "../utils";

interface Props {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: Props) {
  const getGstinArray = (gstin: string) => {
    const arr = gstin.split("");
    return Array.from({ length: 15 }).map((_, i) => arr[i] || "");
  };

  const calculatedItems = data.items.map((item) => {
    const amount = item.qty * item.rate;
    const taxableValue = amount - item.discount;
    const cgstAmount = (taxableValue * item.cgstRate) / 100;
    const sgstAmount = (taxableValue * item.sgstRate) / 100;
    const igstAmount = (taxableValue * item.igstRate) / 100;
    const total = taxableValue + cgstAmount + sgstAmount + igstAmount;

    return {
      item,
      amount,
      taxableValue,
      cgstAmount,
      sgstAmount,
      igstAmount,
      total,
    };
  });

  const totals = calculatedItems.reduce(
    (acc, line) => {
      return {
        taxableValue: acc.taxableValue + line.taxableValue,
        cgst: acc.cgst + line.cgstAmount,
        sgst: acc.sgst + line.sgstAmount,
        igst: acc.igst + line.igstAmount,
      };
    },
    { taxableValue: 0, cgst: 0, sgst: 0, igst: 0 }
  );

  const renderedItems = calculatedItems.map((line, index) => {
    const { item, amount, taxableValue, cgstAmount, sgstAmount, igstAmount, total } = line;

    return (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td className="left">{item.detail}</td>
        <td>{item.hsn}</td>
        <td>{item.qty}</td>
        <td>{item.rate.toFixed(2)}</td>
        <td>{amount.toFixed(2)}</td>
        <td>{item.discount.toFixed(2)}</td>
        <td>{taxableValue.toFixed(2)}</td>
        <td>{item.cgstRate}%</td>
        <td>{cgstAmount.toFixed(2)}</td>
        <td>{item.sgstRate}%</td>
        <td>{sgstAmount.toFixed(2)}</td>
        <td>{item.igstRate}%</td>
        <td>{igstAmount.toFixed(2)}</td>
        <td>{total.toFixed(2)}</td>
      </tr>
    );
  });

  const emptyRowsNeeded = 12 - data.items.length;
  for (let i = 0; i < emptyRowsNeeded; i++) {
    renderedItems.push(
      <tr key={`empty-${i}`}>
        <td className="empty"></td>
        <td className="left empty"></td>
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      </tr>
    );
  }

  const grandTotal = totals.taxableValue + totals.cgst + totals.sgst + totals.igst;

  return (
    <div className="invoice-wrapper">
      <div className="page" id="invoice-page">
        <div className="header">
          <div className="header-left">
            <div className="gstin">GSTIN : 08AJJPR2885G1ZP</div>
            <div className="logo-circle">
              <svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="34" fill="none" stroke="#cc1f1f" strokeWidth="2.5" />
                <circle cx="36" cy="36" r="29" fill="none" stroke="#cc1f1f" strokeWidth="1" strokeDasharray="3,2.5" />
                <text
                  x="36"
                  y="30"
                  textAnchor="middle"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontSize="15"
                  fill="#cc1f1f"
                  fontWeight="bold"
                >
                  JC
                </text>
                <path id="logoTopArc" d="M 9,36 A 27,27 0 0,1 63,36" fill="none" />
                <text fontFamily="Arial" fontSize="7" fill="#cc1f1f" fontWeight="bold" letterSpacing="1.2">
                  <textPath href="#logoTopArc" startOffset="6%">
                    JAIPUR CRAFT
                  </textPath>
                </text>
                <path id="logoBottomArc" d="M 14,42 A 24,24 0 0,0 58,42" fill="none" />
                <text fontFamily="Arial" fontSize="5.8" fill="#cc1f1f" letterSpacing="0.4">
                  <textPath href="#logoBottomArc" startOffset="8%">
                    HANDCRAFTED GIFTS
                  </textPath>
                </text>
                <circle cx="36" cy="55" r="1.8" fill="#cc1f1f" />
                <circle cx="29" cy="53.5" r="1.2" fill="#cc1f1f" />
                <circle cx="43" cy="53.5" r="1.2" fill="#cc1f1f" />
              </svg>
            </div>
          </div>
          <div className="header-center">
            <div className="brand">Jaipur Craft</div>
            <div className="mfr">Manufacturers &amp; Exporters of</div>
            <div className="gifts">INDIAN HANDCRAFTED GIFTS</div>
          </div>
          <div className="header-right">
            28, Bajrang Colony,<br />
            Near Shubham Hospital, Jhotwara,<br />
            Jaipur-302012 (Raj.) INDIA<br />
            Mob. : +91-98290-23084<br />
            Web. : www.jaipurcraft.com<br />
            Email : info@jaipurcraft.com
          </div>
        </div>

        <div className="title-row">
          <div className="title-main">INVOICE</div>
          <div className="title-copies">
            <div>Original for Receipient</div>
            <div>Duplicate for Supplier/ Transporter</div>
            <div>Triplicate for Supplier</div>
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-left">
            <div className="meta-line">
              <span className="meta-label">Reverse Charge</span><span>&nbsp;:&nbsp;{data.reverseCharge}</span>
            </div>
            <div className="meta-line">
              <span className="meta-label">Invoice No.</span><span>&nbsp;:&nbsp;</span><span className="inv-no">{data.invoiceNo}</span>
            </div>
            <div className="meta-line">
              <span className="meta-label">Invoice Date</span><span>&nbsp;:&nbsp;{data.invoiceDate}</span>
            </div>
            <div className="meta-line">
              <span className="meta-label">State</span>
              <span>&nbsp;:&nbsp;<strong>{data.state}</strong></span>
              &nbsp;&nbsp;
              <span>State Code</span><span className="state-code-box">{data.stateCode}</span>
            </div>
          </div>
          <div className="meta-right">
            <div className="meta-line"><span className="meta-label">Transportation Mode</span><span>&nbsp;:&nbsp;{data.transportMode}</span></div>
            <div className="meta-line"><span className="meta-label">Vehicle Number</span><span>&nbsp;:&nbsp;{data.vehicleNo}</span></div>
            <div className="meta-line"><span className="meta-label">Date of Supply</span><span>&nbsp;:&nbsp;{data.dateOfSupply}</span></div>
            <div className="meta-line"><span className="meta-label">Place of Supply</span><span>&nbsp;:&nbsp;{data.placeOfSupply}</span></div>
          </div>
        </div>

        <div className="party-row">
          <div className="party-box">
            <div className="party-title">Details of Receiver | Billed to :</div>
            <div className="dotted-line">
              <span className="field-label">Name</span>
              <span className="dot-underline">{data.billedTo.name}</span>
            </div>
            <div className="dotted-line">
              <span className="field-label">Address</span>
              <span className="dot-underline">{data.billedTo.address}</span>
            </div>
            <div className="dotted-line">
              <span style={{flex:1}} className="dot-underline"></span>
            </div>
            <div className="gstin-row">
              <span className="field-label">GSTIN</span>
              <div className="gstin-boxes">
                {getGstinArray(data.billedTo.gstin).map((char, i) => <span key={i} className="gstin-cell">{char}</span>)}
              </div>
            </div>
            <div className="state-row">
              <span>State</span>
              <span style={{flex:1, borderBottom:"1px dotted #aaa", minHeight:"16px", margin: "0 4px"}}>{data.billedTo.state}</span>
              <span style={{whiteSpace:"nowrap"}}>State Code</span>
              <span className="gstin-cell" style={{marginLeft:"4px"}}>{data.billedTo.stateCode?.charAt(0) || ""}</span>
              <span className="gstin-cell">{data.billedTo.stateCode?.charAt(1) || ""}</span>
            </div>
          </div>

          <div className="party-box">
            <div className="party-title">Details of Consignee | Shipped to :</div>
            <div className="dotted-line">
              <span className="field-label">Name</span>
              <span className="dot-underline">{data.shippedTo.name}</span>
            </div>
            <div className="dotted-line">
              <span className="field-label">Address</span>
              <span className="dot-underline">{data.shippedTo.address}</span>
            </div>
            <div className="dotted-line">
              <span style={{flex:1}} className="dot-underline"></span>
            </div>
            <div className="gstin-row">
              <span className="field-label">GSTIN</span>
              <div className="gstin-boxes">
                {getGstinArray(data.shippedTo.gstin).map((char, i) => <span key={i} className="gstin-cell">{char}</span>)}
              </div>
            </div>
            <div className="state-row">
              <span>State</span>
              <span style={{flex:1, borderBottom:"1px dotted #aaa", minHeight:"16px", margin: "0 4px"}}>{data.shippedTo.state}</span>
              <span style={{whiteSpace:"nowrap"}}>State Code</span>
              <span className="gstin-cell" style={{marginLeft:"4px"}}>{data.shippedTo.stateCode?.charAt(0) || ""}</span>
              <span className="gstin-cell">{data.shippedTo.stateCode?.charAt(1) || ""}</span>
            </div>
          </div>
        </div>

        <table className="items">
          <thead>
            <tr>
              <th rowSpan={2} style={{width:"28px"}}>Sr.<br/>No.</th>
              <th rowSpan={2} className="left" style={{minWidth:"110px"}}>Item Detail</th>
              <th rowSpan={2} style={{width:"45px"}}>HSN</th>
              <th rowSpan={2} style={{width:"35px"}}>Qty.</th>
              <th rowSpan={2} style={{width:"45px"}}>Rate</th>
              <th rowSpan={2} style={{width:"52px"}}>Amount</th>
              <th rowSpan={2} style={{width:"50px"}}>Less :<br/>Discount</th>
              <th rowSpan={2} style={{width:"52px"}}>Taxable<br/>Value</th>
              <th colSpan={2}>CGST</th>
              <th colSpan={2}>SGST</th>
              <th colSpan={2}>IGST</th>
              <th rowSpan={2} style={{width:"48px"}}>Total</th>
            </tr>
            <tr>
              <th style={{width:"30px"}}>Rate</th>
              <th style={{width:"46px"}}>Amount</th>
              <th style={{width:"30px"}}>Rate</th>
              <th style={{width:"46px"}}>Amount</th>
              <th style={{width:"30px"}}>Rate</th>
              <th style={{width:"46px"}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {renderedItems}
            <tr className="total-row">
              <td colSpan={3} style={{textAlign:"right", paddingRight:"6px"}}>Total</td>
              <td></td><td></td><td></td><td></td>
              <td>{totals.taxableValue.toFixed(2)}</td>
              <td></td>
              <td>{totals.cgst.toFixed(2)}</td>
              <td></td>
              <td>{totals.sgst.toFixed(2)}</td>
              <td></td>
              <td>{totals.igst.toFixed(2)}</td>
              <td>{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="footer">
          <div className="footer-left">
            <div className="words-label">Total Invoice Amount in Words :</div>
            <div className="words-line">&nbsp;{numberToWords(grandTotal)}</div>
            <br />
            <div>
              <strong>Bank Details :</strong>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <strong>BANK OF INDIA</strong>
            </div>
            <div><span className="bank-label-col">Bank Account Number</span> : 661920110000393</div>
            <div><span className="bank-label-col">Bank Branch IFSC</span> : BKID0006619</div>
            <div><span className="bank-label-col">Bank Branch Add.</span> : Jhotwara I.A.Br. - Jaipur</div>
            <br />
            <div>Terms &amp; Conditions :</div>
          </div>

          <div className="footer-right">
            <table className="summary">
              <tbody>
                <tr><td>Total Amount Before Tax</td><td>:</td><td>{totals.taxableValue.toFixed(2)}</td></tr>
                <tr><td>Add : CGST</td><td>:</td><td>{totals.cgst.toFixed(2)}</td></tr>
                <tr><td>Add : SGST</td><td>:</td><td>{totals.sgst.toFixed(2)}</td></tr>
                <tr><td>Add : IGST</td><td>:</td><td>{totals.igst.toFixed(2)}</td></tr>
                <tr><td>Tax Amount : GST</td><td>:</td><td>{(totals.cgst + totals.sgst + totals.igst).toFixed(2)}</td></tr>
                <tr><td><strong>Total Amount After Tax</strong></td><td>:</td><td><strong>{grandTotal.toFixed(2)}</strong></td></tr>
              </tbody>
            </table>
            <div className="cert-box">
              GST Payable on Reverse Charge :&nbsp;&nbsp;&nbsp;{data.reverseCharge}<br />
              Certified that the particulars given above are true and correct.
            </div>
          </div>
        </div>

        <div className="sign-row">
          <div className="sign-left">&nbsp;</div>
          <div className="sign-right">
            <div className="sign-for">For</div>
            <div className="sign-brand">Jaipur Craft</div>
            <div className="common-seal">(Common Seal)</div>
            <div style={{marginTop:"8px"}}>
              <span className="sign-line">Authorised Signatory</span>
            </div>
          </div>
        </div>

        <div className="footer-note">(E &amp; O.E.)</div>
      </div>
    </div>
  );
}

