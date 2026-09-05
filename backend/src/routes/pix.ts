import { Router } from "express";
import type { Request, Response } from "express";
import { Payment } from "mercadopago";
import client from "../config/mercadoPago";
import { sendConfirmationEmail } from "../services/emailService";
import { createOrder } from "../services/orderService";

const router = Router();

interface Store {
  id: string;
  name: string;
  address: string;
}

type DeliveryMethod = "delivery" | "pickup";

interface PendingPayment {
  email: string;
  name: string;
  items: any[];
  address: any | null;
  total: number;
  deliveryMethod: DeliveryMethod;
  selectedStore: Store | null;
}

const pendingPayments = new Map<number, PendingPayment>();
const completedPayments = new Set<number>();

router.post(
  "/create",
  async (req: Request, res: Response) => {
    try {
      const {
        total,
        email,
        name,
        items,
        address,
        delivery_method,
        pickup_store,
      } = req.body || {};

      if (!total || !email) {
        return res.status(400).json({
          message: "Total e email são obrigatórios.",
        });
      }

      const deliveryMethod: DeliveryMethod =
        delivery_method === "pickup"
          ? "pickup"
          : "delivery";

      const selectedStore: Store | null =
        deliveryMethod === "pickup"
          ? pickup_store || null
          : null;

      const payment = new Payment(client);

      const response = await payment.create({
        body: {
          transaction_amount: Number(
            Number(total).toFixed(2)
          ),

          description: "Compra Trevo Supermercado",

          payment_method_id: "pix",

          payer: {
            email,
          },
        },
      });

      if (response.id) {
        pendingPayments.set(response.id, {
          email,

          name: name || "Cliente",

          items: items || [],

          address:
            deliveryMethod === "delivery"
              ? address || null
              : null,

          total: Number(total),

          deliveryMethod,

          selectedStore,
        });
      }

      return res.json({
        id: response.id,

        status: response.status,

        qrCode:
          response.point_of_interaction
            ?.transaction_data
            ?.qr_code,

        qrCodeBase64:
          response.point_of_interaction
            ?.transaction_data
            ?.qr_code_base64,
      });
    } catch (error: any) {
      return res.status(500).json({
        message:
          error?.message ||
          "Erro ao gerar PIX",
      });
    }
  }
);

router.get(
  "/status/:id",
  async (req: Request, res: Response) => {
    try {
      const payment = new Payment(client);

      const paymentId = Number(req.params.id);

      const response = await payment.get({
        id: paymentId,
      });

      if (response.status === "approved") {
        // Already completed
        if (completedPayments.has(paymentId)) {
          return res.json({
            status: response.status,
          });
        }

        const customer =
          pendingPayments.get(paymentId);

        if (!customer) {
          return res.json({
            status: response.status,
            message: "Customer data not found",
          });
        }

        // Lock immediately
        completedPayments.add(paymentId);

        await sendConfirmationEmail(
          customer.email,
          customer.name,
          customer.items,
          customer.address,
          customer.total,
          customer.deliveryMethod,
          customer.selectedStore
        );

  
        await createOrder({
          paymentId,

          total: customer.total,

          status: response.status,

          items: customer.items,

          address: customer.address,

          deliveryMethod:
            customer.deliveryMethod,

          selectedStore:
            customer.selectedStore,
        });

        pendingPayments.delete(paymentId);
      }

      return res.json({
        status: response.status,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          "Erro ao consultar pagamento PIX",
      });
    }
  }
);

export default router;