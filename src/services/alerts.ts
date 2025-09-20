import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { app } from "./firebase";      // exporte 'app' do firebase.ts
                                      
const db = getFirestore(app);

export type AlertData = {
  coinId: string;
  direction: "above" | "below";
  currency: string;
  targetPrice: number;
};

/**
 * Salva um alerta; se já existir devolve { duplicate: true }.
 */
export async function saveAlert(uid: string, data: AlertData) {
  // ID determinístico → impede duplicados
  const id =
    `${data.coinId}_${data.direction}_${data.currency}_${data.targetPrice.toFixed(2)}`.toLowerCase();

  const ref = doc(collection(db, "users", uid, "alerts"), id);

  try {
    await setDoc(ref, data); // cria o doc (falha se já existe)
    return { duplicate: false };
  } catch (e: unknown) {
  if (e instanceof Error && 'code' in e && typeof (e as { code: unknown }).code === 'string' && e.code === "already-exists") {
    return { duplicate: true };
  }
  throw e;
}
}
