// backend/controllers/webhookController.js
const { prisma } = require("../config/database");
const paystackService = require("../services/paystackService");
const crypto = require("crypto");

const handlePaystackWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  const hash = req.headers["x-paystack-signature"];

  if (!hash) return res.status(400).send("No signature header");

  const expectedHash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (expectedHash !== hash) return res.status(400).send("Invalid signature");

  const event = req.body;

  try {
    switch (event.event) {
      case "charge.success":
        const { reference, metadata } = event.data;
        const investmentId = metadata?.investmentId;

        if (!investmentId) {
          console.error("Webhook: Missing investmentId in metadata");
          return res.status(400).send("Missing investmentId");
        }

        const investment = await prisma.investment.findUnique({
          where: { id: parseInt(investmentId) }
        });

        if (!investment) {
          console.error(`Webhook: Investment not found (ID: ${investmentId})`);
          return res.status(404).send("Investment not found");
        }

        const verification = await paystackService.verifyPayment(reference);

        const paidAmount = verification.amount / 100; // Convert kobo to NGN
        const amountExpected = parseFloat(investment.amount);

        if (verification.status === "success" && paidAmount === amountExpected) {
          await prisma.$transaction([
            prisma.investment.update({
              where: { id: investment.id },
              data: {
                status: "completed",
                paymentReference: reference,
                returnDate: new Date(),
                actualReturn: amountExpected * 1.15
              }
            }),
            prisma.project.update({
              where: { id: investment.projectId },
              data: {
                currentFunding: {
                  increment: amountExpected
                },
                status: investment.projectId && {
                  set: await isProjectFunded(investment.projectId, amountExpected)
                    ? "funded"
                    : undefined
                }
              }
            })
          ]);

          console.log(`Webhook: Investment ${investmentId} completed successfully.`);
        } else {
          await prisma.investment.update({
            where: { id: investment.id },
            data: {
              status: "failed",
              paymentReference: reference
            }
          });
          console.warn(`Webhook: Verification failed or amount mismatch for ${investmentId}`);
        }
        break;

      case "transfer.success":
        console.log("Webhook: Transfer successful", event.data);
        break;

      case "transfer.failed":
        console.log("Webhook: Transfer failed", event.data);
        break;

      default:
        console.log(`Webhook: Unhandled event type: ${event.event}`);
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error handling Paystack webhook:", error);
    res.status(500).send("Internal server error");
  }
};

async function isProjectFunded(projectId, incomingAmount) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  const current = parseFloat(project.currentFunding);
  const goal = parseFloat(project.fundingGoal);
  return current + incomingAmount >= goal;
}

module.exports = { handlePaystackWebhook };
