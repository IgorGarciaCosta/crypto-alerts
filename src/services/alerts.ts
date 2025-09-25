import {
  doc,
  collection,
  getDoc,
  setDoc,
  deleteDoc,
  FieldValue,
  serverTimestamp
} from "firebase/firestore";
      
import {db} from "./firebase";       // exporte 'db' do firebase.ts

export type AlertData = {
  coinId: string;
  direction: "above" | "below";
  currency: string;
  targetPrice: number;
    triggered?: boolean;          
  createdAt?: FieldValue;       
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
  const ref = doc(collection(db, "users", uid, "alerts"), id);


  //verifica existencia
  const snap = await getDoc(ref);
  if(snap.exists()){
      console.log("Alerta já existe");
      return { duplicate: true };
  }

  //grava
  await setDoc(ref, {
    ...data,
    triggered : false,
    createdAt : serverTimestamp()
  });
  return { duplicate: false };


  console.log(`Tentando salvar alerta com ID: ${id}`);
  
  
}
