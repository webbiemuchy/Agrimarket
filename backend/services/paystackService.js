// backend/services/paystackService.js
const axios = require("axios");

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseURL = "https://api.paystack.co";
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async initializePayment(email, amount, reference, metadata = {}) {
    try {
      const response = await this.client.post("/transaction/initialize", {
        email,
        amount: amount * 100, 
        reference,
        metadata,
        callback_url: process.env.FRONTEND_URL + "/payment-success", 
      });
      return response.data.data;
    } catch (error) {
      console.error("Paystack initialization error:", error.response?.data || error.message);
      throw new Error("Failed to initialize payment with Paystack");
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await this.client.get(`/transaction/verify/${reference}`);
      return response.data.data;
    } catch (error) {
      console.error("Paystack verification error:", error.response?.data || error.message);
      throw new Error("Failed to verify payment with Paystack");
    }
  }

  async createTransferRecipient(name, type, account_number, bank_code, currency = "NGN") {
    try {
      const response = await this.client.post("/transferrecipient", {
        name,
        type,
        account_number,
        bank_code,
        currency,
      });
      return response.data.data;
    } catch (error) {
      console.error("Paystack create recipient error:", error.response?.data || error.message);
      throw new Error("Failed to create transfer recipient");
    }
  }

  async initiateTransfer(recipient, amount, reason, reference) {
    try {
      const response = await this.client.post("/transfer", {
        source: "balance",
        reason,
        amount: amount * 100, 
        recipient,
        reference,
      });
      return response.data.data;
    } catch (error) {
      console.error("Paystack initiate transfer error:", error.response?.data || error.message);
      throw new Error("Failed to initiate transfer");
    }
  }

  async verifyTransfer(reference) {
    try {
      const response = await this.client.get(`/transfer/verify/${reference}`);
      return response.data.data;
    } catch (error) {
      console.error("Paystack verify transfer error:", error.response?.data || error.message);
      throw new Error("Failed to verify transfer");
    }
  }

  async listBanks() {
    try {
      const response = await this.client.get("/bank");
      return response.data.data;
    } catch (error) {
      console.error("Paystack list banks error:", error.response?.data || error.message);
      throw new Error("Failed to retrieve bank list");
    }
  }
}

module.exports = new PaystackService();


