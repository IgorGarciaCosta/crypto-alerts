import ReturnButton from "../components/returnButton";
import { useAuth } from "../context/AuthContext";
import useAlerts from "../hooks/useAlerts";

export default function MyAlerts() {
  const { user, loading: authLoading } = useAuth();

  //bloqueio de rota simples
  if (authLoading) return null;

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4 text-lg">You must be logged in to view alerts</p>
        <ReturnButton path="" />
      </div>
    );
  }

  //busca de dadso
  const { alerts, loading } = useAlerts(user.uid);

  return (
    <>
      <div className="pt-10">
        <ReturnButton path="" />
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Alerts</h1>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : alerts.length === 0 ? (
          <p className="text-slate-400">No alerts created yet.</p>
        ) : (
          <table className="w-full text-sm border border-slate-700">
            <thead className="bg-slate-900/60 text-slate-400">
              <tr>
                <th className="p-2 text-left">Coin</th>
                <th>Direction</th>
                <th>Price</th>
                <th>Currency</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} className="border-t border-slate-800">
                  <td className="p-2">{a.coinId}</td>
                  <td className="text-center capitalize">{a.direction}</td>
                  <td className="text-right pr-2">
                    {a.targetPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="text-center uppercase">{a.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
