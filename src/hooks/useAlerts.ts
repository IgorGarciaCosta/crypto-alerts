import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../services/firebase";

import { deleteAlert as del } from "../services/alerts";


export type AlertDoc = {
  id: string;              // id do documento
  coinId: string;
  direction: "above" | "below";
  currency: string;
  targetPrice: number;
};

export default function useAlerts(uid?: string | null) {

    const [alerts, setAlerts] = useState<AlertDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(!uid) {
            setAlerts([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "users", uid, "alerts"),
            orderBy("coinId")
        );
        const unsub = onSnapshot(
            q,
            (snap) => {
                const list: AlertDoc[] = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as DocumentData),
                })) as AlertDoc[];
                setAlerts(list);
                setLoading(false);
             },
            (err) => {
                console.error("Firestore listen error:", err);
                setLoading(false);
            }

        );
    return unsub;


    }, [uid]);
    return {alerts, loading, deleteAlert:(id:string)=>del(uid!, id)};
}