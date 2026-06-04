"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  const router = useRouter();
  
  // Company Info
  const [companyName, setCompanyName] = useState("Your Company Name");
  const [companyEmail, setCompanyEmail] = useState("contact@company.com");
  const [companyPhone, setCompanyPhone] = useState("+92 300 1234567");
  const [companyAddress, setCompanyAddress] = useState("123 Business Street, City, Country");
  
  // Client Info
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  
  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState(() => `INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState("Thank you for your business!");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Web Development Service", quantity: 1, rate: 500 },
    { id: "2", description: "UI/UX Design", quantity: 1, rate: 300 },
  ]);
  
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100;
  };

  const calculateDiscountAmount = () => {
    return (calculateSubtotal() * discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscountAmount();
  };

  const generateInvoice = () => {
    if (!clientName) {
      setError("Please enter client name");
      return;
    }
    if (items.length === 0 || items.some(item => !item.description || item.quantity <= 0 || item.rate <= 0)) {
      setError("Please add at least one valid invoice item");
      return;
    }

    setLoading(true);
    setError("");
    setShowPreview(true);
    setLoading(false);
    setSuccessMsg("✨ Invoice generated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const downloadInvoice = () => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #f0f0f0; }
          .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
          .company h2 { color: #667eea; margin: 0; }
          .title { text-align: right; }
          .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
          .client-section, .details-section { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #667eea; color: white; padding: 12px; text-align: left; }
          td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
          .totals { text-align: right; margin-top: 20px; }
          .total-row { font-size: 18px; font-weight: bold; color: #667eea; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
          @media print { body { background: white; padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="company">
              <h2>${companyName}</h2>
              <p>${companyEmail}<br>${companyPhone}<br>${companyAddress}</p>
            </div>
            <div class="title">
              <div class="invoice-title">INVOICE</div>
              <p>#${invoiceNumber}</p>
            </div>
          </div>
          
          <div class="client-section">
            <h3>Bill To:</h3>
            <p><strong>${clientName}</strong><br>${clientEmail}<br>${clientAddress}</p>
          </div>
          
          <div class="details-section">
            <table style="width: 100%;">
              <tr><td style="width: 50%;"><strong>Invoice Date:</strong> ${invoiceDate}</td><td><strong>Due Date:</strong> ${dueDate}</td></tr>
            </table>
          </div>
          
          <table>
            <thead><tr><th>Description</th><th>Quantity</th><th>Rate</th><th>Total</th></tr></thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${currency} ${item.rate.toFixed(2)}</td>
                  <td>${currency} ${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Subtotal: ${currency} ${calculateSubtotal().toFixed(2)}</p>
            ${taxRate > 0 ? `<p>Tax (${taxRate}%): ${currency} ${calculateTax().toFixed(2)}</p>` : ''}
            ${discount > 0 ? `<p>Discount (${discount}%): -${currency} ${calculateDiscountAmount().toFixed(2)}</p>` : ''}
            <p class="total-row">Total: ${currency} ${calculateTotal().toFixed(2)}</p>
          </div>
          
          <div class="notes">
            <p><strong>Notes:</strong> ${notes}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">🖨️ Print / Save as PDF</button>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg("💾 Invoice downloaded!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const resetForm = () => {
    setClientName("");
    setClientEmail("");
    setClientAddress("");
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 15);
    setDueDate(newDueDate.toISOString().split('T')[0]);
    setItems([{ id: Date.now().toString(), description: "", quantity: 1, rate: 0 }]);
    setTaxRate(0);
    setDiscount(0);
    setShowPreview(false);
    setError("");
  };

  const loadExample = () => {
    setClientName("John Doe");
    setClientEmail("john.doe@example.com");
    setClientAddress("456 Client Street, New York, USA");
    setItems([
      { id: "1", description: "Web Development (10 hours)", quantity: 10, rate: 75 },
      { id: "2", description: "UI/UX Design (5 hours)", quantity: 5, rate: 60 },
      { id: "3", description: "Hosting (3 months)", quantity: 3, rate: 20 },
    ]);
    setTaxRate(10);
    setDiscount(0);
  };

  const currencies = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "SAR"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📄 Invoice Generator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Create professional invoices in seconds</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Left Panel - Form */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxHeight: "80vh", overflowY: "auto" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>🏢 Company Info</h3>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "0.5rem" }} />
          <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="Email" style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "0.5rem" }} />
          <input type="text" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="Phone" style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "0.5rem" }} />
          <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Address" style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "1rem" }} />

          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>👤 Client Info</h3>
          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client Name *" style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "0.5rem" }} />
          <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Client Email" style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "0.5rem" }} />
          <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Client Address" style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "1rem" }} />

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.7rem", color: "#666" }}>Invoice #</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.7rem", color: "#666" }}>Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0" }}>
                {currencies.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.7rem", color: "#666" }}>Invoice Date</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.7rem", color: "#666" }}>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0" }} />
            </div>
          </div>

          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>📦 Items</h3>
          {items.map((item) => (
            <div key={item.id} style={{ background: "#f5f5f5", borderRadius: 12, padding: "0.75rem", marginBottom: "0.5rem" }}>
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: 8, border: "1px solid #e0e0e0", marginBottom: "0.5rem" }} />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} style={{ width: "33%", padding: "0.5rem", borderRadius: 8, border: "1px solid #e0e0e0" }} />
                <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} style={{ width: "33%", padding: "0.5rem", borderRadius: 8, border: "1px solid #e0e0e0" }} />
                <button onClick={() => removeItem(item.id)} style={{ width: "34%", padding: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          ))}
          <button onClick={addItem} style={{ width: "100%", padding: "0.5rem", background: "#10b981", color: "white", border: "none", borderRadius: 12, cursor: "pointer", marginBottom: "1rem" }}>+ Add Item</button>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.7rem", color: "#666" }}>Tax Rate (%)</label>
              <input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.7rem", color: "#666" }}>Discount (%)</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0" }} />
            </div>
          </div>

          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows={2} style={{ width: "100%", padding: "0.5rem", borderRadius: 12, border: "1px solid #e0e0e0", marginBottom: "1rem" }} />

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button onClick={loadExample} style={{ flex: 1, padding: "0.5rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>📖 Example</button>
            <button onClick={resetForm} style={{ flex: 1, padding: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>🗑️ Reset</button>
          </div>

          <button onClick={generateInvoice} disabled={loading || !clientName} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: 40, fontSize: "1rem", fontWeight: 600, cursor: loading || !clientName ? "not-allowed" : "pointer", opacity: loading || !clientName ? 0.6 : 1 }}>{loading ? "⏳ Generating..." : "✨ Generate Invoice"}</button>
        </div>

        {/* Right Panel - Preview */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>📋 Invoice Preview</h3>
          
          {!showPreview ? (
            <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "3rem", textAlign: "center", border: "2px dashed #ccc" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📄</div>
              <p>Fill in the details and generate your invoice</p>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 16, padding: "1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "2px solid #667eea", paddingBottom: "1rem" }}>
                <div><strong>{companyName}</strong><br />{companyEmail}<br />{companyPhone}</div>
                <div style={{ textAlign: "right" }}><strong>INVOICE</strong><br />#{invoiceNumber}</div>
              </div>
              <div style={{ marginBottom: "1rem" }}><strong>Bill To:</strong><br />{clientName}<br />{clientEmail}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}><div>Date: {invoiceDate}</div><div>Due: {dueDate}</div></div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                <thead><tr style={{ background: "#667eea", color: "white" }}><th style={{ padding: "0.5rem", textAlign: "left" }}>Item</th><th style={{ padding: "0.5rem" }}>Qty</th><th style={{ padding: "0.5rem" }}>Rate</th><th style={{ padding: "0.5rem" }}>Total</th></tr></thead>
                <tbody>
                  {items.map(item => item.description && item.quantity > 0 && item.rate > 0 && (
                    <tr key={item.id}><td style={{ padding: "0.5rem", borderBottom: "1px solid #e0e0e0" }}>{item.description}</td><td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>{item.quantity}</td><td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>{currency} {item.rate}</td><td style={{ padding: "0.5rem", textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>{currency} {(item.quantity * item.rate).toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: "right" }}>
                <p>Subtotal: {currency} {calculateSubtotal().toFixed(2)}</p>
                {taxRate > 0 && <p>Tax ({taxRate}%): {currency} {calculateTax().toFixed(2)}</p>}
                {discount > 0 && <p>Discount ({discount}%): -{currency} {calculateDiscountAmount().toFixed(2)}</p>}
                <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#667eea" }}>Total: {currency} {calculateTotal().toFixed(2)}</p>
              </div>
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e0e0e0", textAlign: "center", fontSize: "0.7rem", color: "#999" }}>{notes}</div>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                <button onClick={downloadInvoice} style={{ padding: "0.5rem 1rem", background: "#10b981", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>💾 Download / Print</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}