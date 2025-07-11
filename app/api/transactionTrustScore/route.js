import { db } from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { customerId, sellerId } = await req.json();

    if (!customerId || !sellerId) {
      return Response.json({ error: "customerId and sellerId are required" }, { status: 400 });
    }

    const transaction = await db.transaction.findFirst({
      where: {
        customerId,
        sellerId,
      },
    });

    if (!transaction) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    // 🧹 Build ML payload
const payload = {
  TransactionID: Math.floor(Math.random() * 1000),
  // seller_id: transaction.sellerId.trim(),
  // customer_id: transaction.customerId.trim(),

  TransactionAmt: transaction.transactionAmt ?? 0,
  ProductCD: transaction.productCD ?? "",
  card_id: transaction.card_id ? Number(transaction.card_id) : 0,
  issuer_bank_code: transaction.issuer_bank_code ?? 0,
  card_network: transaction.card_network ?? "",
  card_bin: transaction.card_bin ?? 0,
  card_type: transaction.card_type ?? "",

  addr1: transaction.addr1 ? Number(transaction.addr1) : 0,
  addr2: transaction.addr2 ? Number(transaction.addr2) : 0,
  dist1: transaction.dist1 ?? 0,
  dist2: transaction.dist2 ?? 0,

  P_emaildomain: transaction.P_emaildomain ?? "",
  R_emaildomain: transaction.R_emaildomain ?? "",

  Operating_system: transaction.operating_system ?? "",
  Browser_type: transaction.browser_type ?? "",
  DeviceType: transaction.deviceType ?? "",
  DeviceInfo: transaction.deviceInfo ?? "",
  TransactionDT:86400,

  // created_at: new Date(transaction.createdAt).toISOString()
};




    // 🎯 Call ML API
    const mlResponse = await fetch("https://onlinefrauddetection.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const mlResult = await mlResponse.json();
 

    const fraudPrediction = mlResult.fraud_prediction;

    const fraudProbability = mlResult.fraud_probability;

    const trustScore = Math.round((1 - fraudProbability) * 100);

    // 💾 Save trust score to this transaction
    const updatedTransaction = await db.transaction.update({
      where: { transactionID: transaction.transactionID },
      data: { trustScore: trustScore },
    });

    // 🧮 Compute avg trust score for all transactions of this customer & seller
    const transactions = await db.transaction.findMany({
      where: {
        customerId,
        sellerId,
        isFraud: { not: null },
      },
      select: { isFraud: true },
    });

    const avgTrustScore =
      transactions.reduce((sum, t) => sum + Number(t.isFraud), 0) /
      transactions.length;

    // 💾 Save avgTrustScore in customer
    await db.customer.update({
      where: { id: customerId },
      data: { avgTrustScore: Math.round(avgTrustScore) },
    });

    return Response.json(
      {
        transactionID: updatedTransaction.transactionID,
        sellerId: updatedTransaction.sellerId,
        customerId: updatedTransaction.customerId,
        fraudPrediction,
        fraudProbability,
        trustScore,
        avgTrustScore: Math.round(avgTrustScore),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
