"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAlerts = exports.telegramWebhook = void 0;
/*  functions/src/index.ts  (v1 – Spark)  */
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const node_fetch_1 = __importDefault(require("node-fetch"));
admin.initializeApp();
const db = admin.firestore();
/* ========= Config / util ========= */
const TELE_TOKEN = (_a = functions.config().telegram) === null || _a === void 0 ? void 0 : _a.token;
const TG_API = `https://api.telegram.org/bot${TELE_TOKEN}`;
async function sendTG(chatId, text) {
    if (!TELE_TOKEN)
        return;
    const resp = await (0, node_fetch_1.default)(`${TG_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!resp.ok) {
        const body = await resp.text();
        throw new Error(`Telegram error ${resp.status} → ${body}`);
    }
}
/* ─────────── Webhook ─────────── */
exports.telegramWebhook = functions
    .region("us-central1")
    .https.onRequest(async (req, res) => {
    var _a;
    try {
        const update = req.body;
        if (!(update === null || update === void 0 ? void 0 : update.message)) {
            res.sendStatus(200); // ***
            return; // ***
        }
        const msg = update.message;
        const chat = msg.chat;
        const text = (_a = msg.text) !== null && _a !== void 0 ? _a : "";
        if (text.startsWith("/start")) {
            const parts = text.split(" ");
            if (parts.length === 2) {
                const uid = parts[1].trim();
                await db.doc(`users/${uid}`).set({ telegramChatId: chat.id }, { merge: true });
                await sendTG(chat.id, "✅ Telegram conectado! Você receberá alertas aqui.");
            }
            else {
                await sendTG(chat.id, "Envie /start <código-do-app>.");
            }
        }
        res.sendStatus(200); // ***
    }
    catch (e) {
        console.error(e);
        res.sendStatus(500); // ***
    }
}); // *** não retorna nada
/* ─────────── Scheduler ─────────── */
exports.checkAlerts = functions
    .region("us-central1")
    .pubsub.schedule("every 5 minutes")
    .onRun(async () => {
    var _a;
    const snap = await db.collectionGroup("alerts")
        .where("triggered", "==", false)
        .get();
    if (snap.empty)
        return;
    const ids = new Set();
    const vs = new Set();
    snap.docs.forEach(d => {
        const a = d.data();
        ids.add(a.coinId);
        vs.add(a.currency);
    });
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${[...ids].join(",")}&vs_currencies=${[...vs].join(",")}`;
    const prices = await (0, node_fetch_1.default)(url).then(r => r.json()); // ***
    const batch = db.batch();
    for (const doc of snap.docs) {
        const a = doc.data();
        const current = (_a = prices[a.coinId]) === null || _a === void 0 ? void 0 : _a[a.currency];
        if (current == null)
            continue;
        const hit = (a.direction === "above" && current >= a.targetPrice) ||
            (a.direction === "below" && current <= a.targetPrice);
        if (!hit)
            continue;
        const uid = doc.ref.path.split("/")[1];
        const userDoc = await db.doc(`users/${uid}`).get();
        const chatId = userDoc.get("telegramChatId");
        if (!chatId)
            continue;
        const msg = `⏰ ${a.coinId.toUpperCase()} está ${a.direction} ${a.targetPrice} ${a.currency}\nPreço atual: ${current} ${a.currency}`;
        await sendTG(chatId, msg);
        batch.update(doc.ref, {
            triggered: true,
            triggeredAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    await batch.commit();
});
//# sourceMappingURL=index.js.map