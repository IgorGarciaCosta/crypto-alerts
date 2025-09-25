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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAlerts = exports.sendEmail = void 0;
/*  functions/src/index.ts  ——  versão “e-mail”  */
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const nodemailer_1 = __importDefault(require("nodemailer"));
admin.initializeApp();
const db = admin.firestore();
/* ---------- SMTP transporter ---------- */
const mailUser = functions.config().mail.user;
const mailPass = functions.config().mail.pass;
const mailFrom = functions.config().mail.from; // "Cripto Alerts" <xyz@gmail.com>
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // troque se usar SendGrid, Mailgun, etc.
    auth: { user: mailUser, pass: mailPass },
});
/* util */
async function sendMail(to, subject, text) {
    await transporter.sendMail({ from: mailFrom, to, subject, text });
}
/* ========== callable opcional p/ testes ==========
*/
exports.sendEmail = functions.region("us-central1")
    .https.onCall(async (data) => {
    const { to, subject, text } = data;
    if (!to || !subject || !text)
        throw new functions.https.HttpsError("invalid-argument", "Missing fields");
    await sendMail(to, subject, text);
    return { ok: true };
});
/* ========== job que verifica alertas a cada 5 min ========== */
exports.checkAlerts = functions.region("us-central1")
    .pubsub.schedule("every 5 minutes").onRun(async () => {
    var _a;
    try {
        const snap = await db.collectionGroup("alerts")
            .where("triggered", "==", false)
            .get();
        if (snap.empty) {
            console.log("checkAlerts: Nenhum alerta pendente encontrado.");
            return;
        }
        try {
            console.log("Tentando ler dados do Firestore...");
            const snapshot = await db.collection("alerts").get();
            console.log(`Encontrados ${snapshot.size} documentos.`);
        }
        catch (error) {
            console.error("Erro ao acessar Firestore:", error);
        }
        const ids = new Set();
        const vs = new Set();
        snap.docs.forEach(d => {
            const a = d.data();
            ids.add(a.coinId);
            vs.add(a.currency);
        });
        console.log(`checkAlerts: Encontrados alertas para moedas: ${[...ids].join(", ")}`);
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${[...ids].join(",")}&vs_currencies=${[...vs].join(",")}`;
        const prices = await fetch(url).then(r => r.json());
        const batch = db.batch();
        for (const doc of snap.docs) {
            const a = doc.data();
            const current = (_a = prices[a.coinId]) === null || _a === void 0 ? void 0 : _a[a.currency];
            if (current == null) {
                console.warn(`Preço atual não encontrado para ${a.coinId} em ${a.currency}`);
                continue;
            }
            const hit = (a.direction === "above" && current >= a.targetPrice) ||
                (a.direction === "below" && current <= a.targetPrice);
            if (!hit)
                continue;
            try {
                const uid = doc.ref.path.split("/")[1];
                const user = await admin.auth().getUser(uid);
                const to = user.email;
                if (!to) {
                    console.warn(`Usuário ${uid} não tem e-mail cadastrado.`);
                    continue;
                }
                const subject = `⏰ ${a.coinId.toUpperCase()} hit your alert`;
                const text = [
                    `Hi, I'm reaching out to let you know that ${a.coinId} is now ${a.direction} your target price of ${a.targetPrice} ${a.currency}. The current price is ${current} ${a.currency}.`,
                    "",
                    "",
                    `Currency : ${a.coinId}`,
                    `Direction: ${a.direction}`,
                    `Target Price   : ${a.targetPrice} ${a.currency}`,
                    `Current Price  : ${current} ${a.currency}`,
                    "",
                    "Automatically generated by CriptoTracker",
                ].join("\n");
                await sendMail(to, subject, text);
                console.log(`E-mail enviado para ${to} - Assunto: ${subject}`);
                batch.update(doc.ref, {
                    triggered: true,
                    triggeredAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
            catch (error) {
                console.error(`Erro no processamento do alerta para doc ${doc.id}:`, error);
            }
        }
        await batch.commit();
        console.log("checkAlerts: Batch commit realizado com sucesso.");
    }
    catch (error) {
        console.error("Erro geral na função checkAlerts:", error);
    }
});
//# sourceMappingURL=index.js.map