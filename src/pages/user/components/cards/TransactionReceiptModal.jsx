import { useState, useEffect } from "react";
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

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

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

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 print:bg-white print:p-0 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Centered Responsive Card with scrollable content */}
      <div
        id="receipt-area"
        className="bg-white w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-xl shadow-lg overflow-hidden print:w-full print:rounded-none print:shadow-none max-h-[90vh] flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b bg-gray-50 print:border-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">Transaction Receipt</h2>
              <p className="text-gray-500 text-xs md:text-sm">PayPal Official Record</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 md:gap-2 print:hidden">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="px-2 md:px-3 py-1 md:py-2 border rounded-lg flex items-center gap-1 md:gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{loading ? "..." : "Download"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2 md:px-3 py-1 md:py-2 border rounded-lg flex items-center gap-1 md:gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition text-sm"
            >
              <Printer className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 md:p-2 text-gray-400 hover:text-gray-700 ml-1"
              aria-label="Close"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 text-gray-800">
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-100 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full border flex items-center justify-center shrink-0">
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
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} shrink-0 self-start sm:self-center`}
            >
              {transaction.status.toUpperCase()}
            </span>
          </div>

          {/* Amount */}
          <div className="text-center border-b pb-4 md:pb-5">
            <p className="text-sm text-gray-500">TOTAL AMOUNT</p>
            <p className={`text-3xl md:text-4xl font-bold ${getAmountColor()}`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-base md:text-lg">Transaction Information</h4>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium text-sm md:text-base">{formatDate(transaction.created_at)}</p>

              <p className="text-sm text-gray-600 mt-3">Transaction ID</p>
              <p className="font-mono text-sm md:text-base break-all">{transaction.id}</p>
            </div>

            <div className="mt-4 md:mt-0">
              <h4 className="font-semibold mb-2 text-base md:text-lg">Parties Involved</h4>
              {transaction.sender && (
                <>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-medium text-sm md:text-base">{transaction.sender.name}</p>
                  <p className="text-sm text-gray-600 break-all">{transaction.sender.email}</p>
                </>
              )}
              {transaction.receiver && (
                <>
                  <p className="text-sm text-gray-600 mt-3">To</p>
                  <p className="font-medium text-sm md:text-base">{transaction.receiver.name}</p>
                  <p className="text-sm text-gray-600 break-all">{transaction.receiver.email}</p>
                </>
              )}
            </div>
          </div>

          {transaction.description && (
            <div>
              <h4 className="font-semibold mb-2 text-base md:text-lg">Description</h4>
              <p className="bg-gray-50 p-3 md:p-4 rounded-lg border text-gray-700 text-sm md:text-base">
                {transaction.description}
              </p>
            </div>
          )}

          {transaction.note && (
            <div>
              <h4 className="font-semibold mb-2 text-base md:text-lg">Note</h4>
              <p className="bg-yellow-50 p-3 md:p-4 rounded-lg border border-yellow-200 text-gray-700 text-sm md:text-base">
                {transaction.note}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center border-t pt-4 md:pt-5">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <Building className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-semibold text-sm md:text-base">PayPal Secure Transaction</span>
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
              max-height: none !important;
              overflow: visible !important;
            }
          }
        `}
      </style>
    </div>
  );
}