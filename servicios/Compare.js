class Compare {
  static compareProviders(providers, BUBBLE_providers) {
    const newProviders = [];
    let existingProviders = {};
    for (const provider of providers) {
      const bubbleProvider = BUBBLE_providers.find(
        (p) => p.nombre_proveedor === provider.providerName
      );
      if (!bubbleProvider) {
        newProviders.push(provider);
      } else {
        existingProviders = {
          ...existingProviders,
          [bubbleProvider.nombre_proveedor]: bubbleProvider._id,
        };
      }
    }
    return {
      newProviders,
      existingProviders,
    };
  }

  static compareInvoices(invoices, BUBBLE_invoices) {
    const invoicesToCreate = [];
    const invoicesToUpdate = [];
    for (const invoice of invoices) {
      const bubbleInvoice = BUBBLE_invoices.get(invoice.invoiceNumber);
      if (!bubbleInvoice) {
        invoicesToCreate.push(invoice);
      } else {
        if (bubbleInvoice.monto_total !== invoice.total) {
          invoicesToUpdate.push({
            id: bubbleInvoice._id,
            monto_total: invoice.total,
            monto_factura: invoice.total,
          });
        }
        BUBBLE_invoices.delete(invoice.invoiceNumber);
      }
    }

    return {
      invoicesToCreate,
      invoicesToUpdate,
      invoicesToDelete: BUBBLE_invoices,
    };
  }
}

// invoices_to_create = []
// invoices_to_delete = []
// invoices_to_update = []
// for invoice in invoices:
//     if str(invoice['invoice_number']) in API_invoices:
//         API_invoice = API_invoices[str(invoice['invoice_number'])]
//         if API_invoice['amount_total'] != invoice['amount']:
//             invoices_to_update.append({
//                 'id': API_invoice['id'],
//                 'amount': invoice['amount'],
//                 'amount_total': invoice['amount']
//             })
//         API_invoices.pop(str(invoice['invoice_number']), None)
//     else:
//         invoices_to_create.append(invoice)

// invoices_to_delete = API_invoices.values()

// return (invoices_to_create, invoices_to_update, invoices_to_delete)

module.exports = Compare;
