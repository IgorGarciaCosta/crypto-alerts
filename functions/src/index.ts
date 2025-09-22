/*  functions/src/index.ts  (v1 – Spark)  */
import * as functions from "firebase-functions/v1";
import * as admin     from "firebase-admin";
import fetch          from "node-fetch";

admin.initializeApp();
const db = admin.firestore();

/* ========= Config / util ========= */
const TELE_TOKEN = functions.config().telegram?.token;
const TG_API = `https://api.telegram.org/bot${TELE_TOKEN}`;

async function sendTG(chatId: number, text: string): Promise<void> {
  if (!TELE_TOKEN) return;
  const resp = await fetch(`${TG_API}/sendMessage`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ chat_id: chatId, text }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Telegram error ${resp.status} → ${body}`);
  }
}

/* ─────────── Webhook ─────────── */
export const telegramWebhook = functions
  .region("us-central1")
  .https.onRequest(async (req, res): Promise<void> => {   // *** Promise<void>
    try {
      const update = req.body;
      if (!update?.message) {
        res.sendStatus(200);                              // ***
        return;                                           // ***
      }

      const msg  = update.message;
      const chat = msg.chat;
      const text = msg.text ?? "";

      if (text.startsWith("/start")) {
        const parts = text.split(" ");
        if (parts.length === 2) {
          const uid = parts[1].trim();
          await db.doc(`users/${uid}`).set(
            { telegramChatId: chat.id },
            { merge: true }
          );
          await sendTG(chat.id, "✅ Telegram conectado! Você receberá alertas aqui.");
        } else {
          await sendTG(chat.id, "Envie /start <código-do-app>.");
        }
      }
      res.sendStatus(200);                                // ***
    } catch (e) {
      console.error(e);
      res.sendStatus(500);                                // ***
    }
  });                                                     // *** não retorna nada

/* ─────────── Scheduler ─────────── */
export const checkAlerts = functions
  .region("us-central1")
  .pubsub.schedule("every 5 minutes")
  .onRun(async (): Promise<void> => {                     // *** Promise<void>

    const snap = await db.collectionGroup("alerts")
                         .where("triggered", "==", false)
                         .get();
    if (snap.empty) return;

    const ids = new Set<string>();
    const vs  = new Set<string>();
    snap.docs.forEach(d => {
      const a = d.data() as any;
      ids.add(a.coinId);
      vs.add(a.currency);
    });

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${[...ids].join(",")}&vs_currencies=${[...vs].join(",")}`;

    type Prices = Record<string, Record<string, number>>;
    const prices = await fetch(url).then(r => r.json()) as Prices;   // ***

    const batch = db.batch();
    for (const doc of snap.docs) {
      const a = doc.data() as any;
      const current = prices[a.coinId]?.[a.currency];
      if (current == null) continue;

      const hit =
        (a.direction === "above" && current >= a.targetPrice) ||
        (a.direction === "below" && current <= a.targetPrice);
      if (!hit) continue;

      const uid     = doc.ref.path.split("/")[1];
      const userDoc = await db.doc(`users/${uid}`).get();
      const chatId  = userDoc.get("telegramChatId");
      if (!chatId) continue;

      const msg = `⏰ ${a.coinId.toUpperCase()} está ${a.direction} ${a.targetPrice} ${a.currency}\nPreço atual: ${current} ${a.currency}`;
      await sendTG(chatId, msg);

      batch.update(doc.ref, {
        triggered  : true,
        triggeredAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
  });
