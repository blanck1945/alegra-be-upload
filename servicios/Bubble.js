const MapService = require("./Map");
const Axios = require("./Axios");
const Formatter = require("./Formatter");
const chalk = require("chalk");

class BubbleService {
  static async getInvoices(companyDoc) {
    const {
      data: {
        response: { results, remaining },
      },
    } = await Axios.executeRequest({
      path: "/api/1.1/obj/FacturasPorPagar",
      companyDoc,
    });

    // Bubble Data API only brings 100 records in each request.
    // This is to retrieve all the data.
    if (remaining > 0) {
      const pages = Math.ceil(remaining / 100);
      for (let i = 0, multiplier = 1; i < pages; i++) {
        const currentCursor = multiplier * 100;
        const {
          data: { response },
        } = await Axios.executeRequest({
          path: "/api/1.1/obj/FacturasPorPagar",
          companyDoc,
          cursor: currentCursor,
        });
        results.push(...response.results);
      }
    }

    const onlyValidResults = results.filter((result) => {
      if (result.en_siigo === undefined || result.en_siigo) return result;
    });

    return MapService.createBubbleMap(onlyValidResults);
  }

  static async getProviders(companyDoc) {
    const {
      data: {
        response: { results, remaining },
      },
    } = await Axios.executeRequest({
      path: "/api/1.1/obj/Proveedores",
      companyDoc,
    });

    if (results.length === 0) return [];

    // Bubble Data API only brings 100 records in each request.
    // This is to retrieve all the data.
    if (remaining > 0) {
      const pages = Math.ceil(remaining / 100);
      for (let i = 1; i < pages; i++) {
        const currentCursor = i * 100;
        const {
          data: { response },
        } = await Axios.executeRequest({
          path: "/api/1.1/obj/Proveedores",
          companyDoc,
          cursor: currentCursor,
        });
        results.push(...response.results);
      }
    }

    return results;
  }

  static async createProviders(newProviders, companyDoc, companyId) {
    let newCreatedProvidersIds = {};

    for (const provider of newProviders) {
      const formattedProvider = Formatter.formatProviderToCreate(
        provider,
        companyDoc,
        companyId
      );
      const { data } = await Axios.executePostRequest({
        path: "/api/1.1/obj/Proveedores",
        companyDoc,
        data: formattedProvider,
      });
      newCreatedProvidersIds = {
        ...newCreatedProvidersIds,
        [provider.name]: data.id,
      };
    }

    return newCreatedProvidersIds;
  }

  static async createBulkInvoices(invoiceToCreateString) {
    if (invoiceToCreateString === "") {
      console.warn(
        chalk.yellow("8.5/11- Early return - No invoices to update")
      );
      return;
    }

    const { data } = await Axios.executePostRequest({
      path: "/api/1.1/obj/FacturasPorPagar/bulk",
      data: invoiceToCreateString,
      headers: {
        "Content-Type": "text/plain",
      },
    });
    return data;
  }

  static async updateInvoices(invoicesToUpdate) {
    if (invoicesToUpdate.length === 0) {
      console.warn(
        chalk.yellow("9.5/11- Early return - No invoices to update")
      );
      return;
    }

    invoicesToUpdate.forEach(async (invoice) => {
      await Axios.executePatchRequest({
        path: "/api/1.1/obj/FacturasPorPagar",
        fieldsToUpdate: {
          monto_total: invoice.monto_total,
          monto_factura: invoice.monto_factura,
        },
        id: invoice.id,
      });
    });
  }

  static async deleteInvoices(invoices, invoicesToDelete) {
    if (invoices.length === 200 || invoicesToDelete.length === 0) {
      console.warn(
        chalk.yellow(
          "10.5/11- Early return - Alegra send 200 invoices or no invoices to delete"
        )
      );
    }

    invoicesToDelete.forEach(async (invoiceToDelete) => {
      if (invoiceToDelete.estado === "Por pagar") {
        console.warn("Deleting invoice: ", invoiceToDelete._id);
        await Axios.executeDeleteRequest({
          path: "/api/1.1/obj/FacturasPorPagar",
          id: invoiceToDelete._id,
        });
      }
    });
  }
}

module.exports = BubbleService;
