class Compare {
  static compareProviders(providers, BUBBLE_providers) {
    const newProviders = [];
    const notUniqueProviders = [];
    let existingProviders = {};
    for (const provider of providers) {
      const bubbleProvider = BUBBLE_providers.find(
        (p) => p.nombre_proveedor === provider.providerName
      );
      if (!bubbleProvider) {
        const providerIsFlagged = notUniqueProviders.includes(
          provider.providerName
        );
        if (!providerIsFlagged) {
          newProviders.push(provider);
          notUniqueProviders.push(provider.providerName);
        }
      } else {
        existingProviders = {
          ...existingProviders,
          [bubbleProvider.nombre_proveedor]: {
            id: bubbleProvider._id,
            doc_proveedor: bubbleProvider.doc_proveedor,
          },
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

module.exports = Compare;
