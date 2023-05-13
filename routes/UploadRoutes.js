const express = require("express");
const router = express.Router();
const Route = require("../core/Route");
const chalk = require("chalk");
const BubbleService = require("../servicios/Bubble");
const Compare = require("../servicios/Compare");
const Formatter = require("../servicios/Formatter");

router.post("/", async (req, res) => {
  const body = req.body;
  const { invoices, companyDoc, companyId } = body;

  console.log(
    `Starting the request with \nInvoices: ${invoices} \nCompanyId: ${companyId} \nCompanyDoc: ${companyDoc}`
  );

  return await Route.execute(req, res, async (_, res) => {
    console.warn(chalk.blue("1/11- Getting invoices from Bubble"));
    const BUBBLE_Map = await BubbleService.getInvoices(companyDoc);

    console.warn(chalk.blue("2/11- Getting providers from Bubble"));
    const BUBBLE_providers = await BubbleService.getProviders(companyDoc);

    console.warn(chalk.blue("3/11- Comparing providers"));
    const { newProviders, existingProviders } = Compare.compareProviders(
      invoices,
      BUBBLE_providers
    );

    console.warn(
      chalk.blue(
        `4/11- Creating Providers cantidad de proveedres: ${newProviders.length}`
      )
    );
    const createdProviders = await BubbleService.createProviders(
      newProviders,
      companyDoc,
      companyId
    );

    console.warn(chalk.blue("5/11- Merging existing providers with new ones"));
    const mergeProvidersObj = { ...existingProviders, ...createdProviders };

    console.warn(
      chalk.blue(
        "6/11- Comparing invoices to separate them in to create - to update - to delete"
      )
    );
    const { invoicesToCreate, invoicesToUpdate, invoicesToDelete } =
      Compare.compareInvoices(invoices, BUBBLE_Map);

    console.warn(chalk.blue("7/11- Formatting invoices to create"));
    const invoiceToCreateString = Formatter.formatInvoicesToCreate(
      invoicesToCreate,
      mergeProvidersObj,
      companyDoc,
      companyId
    );

    console.warn(
      chalk.blue(
        `8/11- Creating invoices (BULK) - cantidad de facturas: ${invoicesToCreate.length}`
      )
    );
    await BubbleService.createBulkInvoices(invoiceToCreateString, BUBBLE_Map);

    console.warn(chalk.blue("9/11- Updating invoices"));
    await BubbleService.updateInvoices(invoicesToUpdate);

    console.warn(chalk.blue("10/11- Check if we should delete invoices"));
    await BubbleService.deleteInvoices(invoices, invoicesToDelete);

    console.warn(chalk.green("11/11- Sending success response"));
    return res.status(200).send({
      status: "ok",
      message: "Facturas y proveedores creados con exito",
      service: "Bubble",
    });
  });
});

module.exports = router;
