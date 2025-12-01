// TransactionReceiptModal.jsx
import { useState } from "react";
import {
  Download,
  Printer,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Building,
} from "lucide-react";

export default function TransactionReceiptModal({ transaction, user, onClose }) {
  const [loading, setLoading] = useState(false);

  const getTransactionIcon = () => {
    if (transaction.type === "payment" || transaction.type === "send") {
      return <ArrowUpRight className="h-6 w-6 text-red-500" />;
    } else if (transaction.type === "request" || transaction.type === "receive") {
      return <ArrowDownLeft className="h-6 w-6 text-green-500" />;
    }
    return <User className="h-6 w-6 text-gray-500" />;
  };

  const getTransactionTypeLabel = () => {
    const types = {
      payment: "Payment Sent",
      send: "Money Sent",
      request: "Money Request",
      receive: "Money Received",
      admin_credit: "Admin Credit",
      admin_debit: "Admin Debit",
    };
    return types[transaction.type] || transaction.type;
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "completed":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "failed":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const formatCurrency = (amount) => {
    const symbol = user?.currency || "$";
    return `${symbol}${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getAmountPrefix = () => {
    if (["payment", "send"].includes(transaction.type)) return "-";
    if (["request", "receive"].includes(transaction.type)) return "+";
    return "";
  };

  const getAmountColor = () => {
    if (["payment", "send"].includes(transaction.type)) return "text-red-600";
    if (["request", "receive"].includes(transaction.type)) return "text-green-600";
    return "text-gray-800";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setLoading(true);

    const content = `
PAYPAL RECEIPT
=============================

Transaction: ${getTransactionTypeLabel()}
Reference: ${transaction.reference_id}
Date: ${formatDate(transaction.created_at)}
Status: ${transaction.status.toUpperCase()}

Amount: ${getAmountPrefix()}${formatCurrency(transaction.amount)}
${transaction.fee ? "Fee: " + formatCurrency(transaction.fee) : ""}
${transaction.net_amount ? "Net: " + formatCurrency(transaction.net_amount) : ""}

From: ${transaction.sender?.name || "N/A"} (${transaction.sender?.email || "N/A"})
To: ${transaction.receiver?.name || "N/A"} (${transaction.receiver?.email || "N/A"})

Description: ${transaction.description || "None"}
Note: ${transaction.note || "None"}

Generated: ${new Date().toLocaleDateString()}
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `paypal-receipt-${transaction.reference_id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 print:bg-white print:p-0">
      
      {/* Centered Responsive Card */}
      <div
        id="receipt-area"
        className="bg-white w-full max-w-xl md:max-w-2xl rounded-xl shadow-lg overflow-hidden print:w-full print:rounded-none print:shadow-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50 print:border-none">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Transaction Receipt</h2>
              <p className="text-gray-500 text-sm">PayPal Official Record</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleDownload}
              className="px-3 py-2 border rounded-lg flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition"
            >
              <Download className="h-4 w-4" />
              {loading ? "..." : "Download"}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 border rounded-lg flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-800">

          {/* Status Banner */}
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full border flex items-center justify-center">
                {getTransactionIcon()}
              </div>
              <div>
                <h3 className="font-semibold">{getTransactionTypeLabel()}</h3>
                <p className="text-gray-600 text-sm">
                  Reference: {transaction.reference_id}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
            >
              {transaction.status.toUpperCase()}
            </span>
          </div>

          {/* Amount */}
          <div className="text-center border-b pb-5">
            <p className="text-sm text-gray-500">TOTAL AMOUNT</p>
            <p className={`text-4xl font-bold ${getAmountColor()}`}>
              {getAmountPrefix()}
              {formatCurrency(transaction.amount)}
            </p>

            {transaction.fee > 0 && (
              <p className="text-gray-600 text-sm mt-2">
                Fee: {formatCurrency(transaction.fee)}
              </p>
            )}

            {transaction.net_amount && (
              <p className="text-gray-600 text-sm">
                Net Amount: {formatCurrency(transaction.net_amount)}
              </p>
            )}
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <h4 className="font-semibold mb-2">Transaction Information</h4>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{formatDate(transaction.created_at)}</p>

              <p className="text-sm text-gray-600 mt-3">Transaction ID</p>
              <p className="font-mono">{transaction.id}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Parties Involved</h4>
              {transaction.sender && (
                <>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-medium">{transaction.sender.name}</p>
                  <p className="text-sm text-gray-600">{transaction.sender.email}</p>
                </>
              )}
              {transaction.receiver && (
                <>
                  <p className="text-sm text-gray-600 mt-3">To</p>
                  <p className="font-medium">{transaction.receiver.name}</p>
                  <p className="text-sm text-gray-600">{transaction.receiver.email}</p>
                </>
              )}
            </div>
          </div>

          {transaction.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="bg-gray-50 p-4 rounded-lg border text-gray-700">
                {transaction.description}
              </p>
            </div>
          )}

          {transaction.note && (
            <div>
              <h4 className="font-semibold mb-2">Note</h4>
              <p className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-gray-700">
                {transaction.note}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center border-t pt-5">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Building className="h-5 w-5" />
              <span className="font-semibold">PayPal Secure Transaction</span>
            </div>

            <p className="text-xs text-gray-500">
              Receipt generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Print-Only Style */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #receipt-area, #receipt-area * {
              visibility: visible;
            }
            #receipt-area {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}
