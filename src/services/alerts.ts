import {
  doc,
  collection,
  getDoc,
  setDoc,
  type DocumentReference,
  deleteDoc
} from "firebase/firestore";
      
import {db} from "./firebase";       // exporte 'db' do firebase.ts

export type AlertData = {
  coinId: string;
  direction: "above" | "below";
  currency: string;
  targetPrice: number;
};

function buildID(d:AlertData){
    return `${d.coinId}_${d.direction}_${d.currency}_${d.targetPrice.toFixed(2)}`.toLowerCase();
}

export async function deleteAlert(uid:string, alertId:string){
    const ref = doc(db, "users", uid, "alerts", alertId);
    await deleteDoc (ref);
}

/**
 * Salva um alerta; se já existir devolve { duplicate: true }.
 */
export async function saveAlert(uid: string, data: AlertData) {
  const id = buildID(data);
  const ref:DocumentReference = doc(collection(db, "users", uid, "alerts"), id);


//verifica existencia
const snap = await getDoc(ref);
if(snap.exists()){
    console.log("Alerta já existe");
    return { duplicate: true };
}

//grava
await setDoc(ref, data);
console.log("Alerta salvo com sucesso");
return { duplicate: false };


  console.log(`Tentando salvar alerta com ID: ${id}`);
  
  
}
