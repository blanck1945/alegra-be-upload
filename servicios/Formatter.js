class Formatter {
  static formatProviderToCreate(provider, companyDoc, companyId) {
    return {
      doc_proveedor: provider.providerDoc.toString(),
      nombre_proveedor: provider.providerName,
      tipo_doc_proveedor: provider.providerTypeDoc,
      nit_empresa: companyDoc,
      data_empresa: companyId,
      has_nit_placeholder: provider.hasNitPlaceholder,
      banco: provider.bank,
      numero_cuenta: provider.accountNumber,
      tipo_cuenta: provider.accountType,
    };
  }

  static formatInvoicesToCreate(invoices, providersIds, companyDoc, companyId) {
    let string = "";
    invoices.forEach((invoice) => {
      const providerId = providersIds[invoice.providerName].id;
      const doc_proveedor = providersIds[invoice.providerName].doc_proveedor;
      const formattedInvoices = {
        numero_factura: invoice.invoiceNumber,
        monto_total: invoice.total,
        monto_factura: invoice.total,
        doc_proveedor: doc_proveedor,
        data_empresa: companyId,
        nit_empresa: companyDoc,
        estado: "Por pagar",
        nombre_proveedor: invoice.providerName,
        tipo_doc_proveedor: invoice.providerTypeDoc,
        origen: "alegra",
        en_siigo: true,
        ...(invoice.expirationDate
          ? { fecha_vencimiento: invoice.expirationDate }
          : {}),
        ...(invoice.emisionDate ? { fecha_emision: invoice.emisionDate } : {}),
        ...(providerId ? { data_proveedor: providerId } : {}),
      };
      string += JSON.stringify(formattedInvoices) + "\n";
    });
    return string;
  }
}

module.exports = Formatter;
