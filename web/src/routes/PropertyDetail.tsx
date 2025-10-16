import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { centsToAUD } from "../lib/money";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const AddValuationSchema = z.object({
  amount: z.string().min(1),       
  valuedAt: z.string().min(1)     
});
type AddValuation = z.infer<typeof AddValuationSchema>;

type PropertyDetailType = {
  id: number; name: string; address: string;
  valuations: { id: number; amount: number; valuedAt: string }[];
}

export default function PropertyDetail() {
  const { id } = useParams();
  const pid = Number(id);
  const qc = useQueryClient();

  const propQuery = useQuery({
    queryKey: ["property", pid],
    queryFn: async () => (await api.get<PropertyDetailType>(`/properties/${pid}`)).data,
    enabled: Number.isFinite(pid)
  });

  const { register, handleSubmit, reset } = useForm<AddValuation>();
  const createVal = useMutation({
    mutationFn: async (data: AddValuation) => {
      const parsed = AddValuationSchema.safeParse(data);
      if (!parsed.success) throw parsed.error;
      const cents = Math.round(Number(parsed.data.amount.replace(/,/g, "")) * 100);
      const iso = new Date(parsed.data.valuedAt + "T00:00:00").toISOString();
      return (await api.post(`/properties/${pid}/valuations`, { amount: cents, valuedAt: iso })).data;
    },
    onSuccess: () => { reset(); qc.invalidateQueries({ queryKey: ["property", pid] }); }
  });

  if (Number.isNaN(pid)) return <div className="container">Invalid id</div>;
  if (propQuery.isLoading) return <div className="container">Loading…</div>;
  if (propQuery.error) return <div className="container"><div className="error">Failed to load.</div></div>;
  const p = propQuery.data!;

  const chartData = p.valuations.map(v => ({
    date: new Date(v.valuedAt).toISOString().slice(0,10),
    amountAUD: v.amount / 100
  }));

  return (
    <>
      <div className="row" style={{justifyContent:'space-between', marginBottom: 8}}>
        <h3>{p.name}</h3>
        <Link to="/" className="small">← Back</Link>
      </div>
      <div className="card">
        <div className="small">{p.address}</div>
      </div>

      <div className="card">
        <h4>Equity over time</h4>
        {chartData.length === 0 ? <div className="small">No valuations yet.</div> : (
          <div style={{width: '100%', height: 300}}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(val: any) => [`$${Number(val).toLocaleString("en-AU")}`, "Valuation"]} />
                <Line type="monotone" dataKey="amountAUD" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card">
        <h4>Add valuation</h4>
        <form className="row" onSubmit={handleSubmit(d => createVal.mutate(d))}>
          <input placeholder="Amount (AUD)" {...register("amount", { required: true })} inputMode="decimal" />
          <input type="date" {...register("valuedAt", { required: true })} />
          <button type="submit">Save</button>
          {createVal.isError && <div className="error">Could not add valuation. (Check date duplicate?)</div>}
        </form>
      </div>

      <div className="card">
        <h4>All valuations</h4>
        {p.valuations.length === 0 ? <div className="small">None yet.</div> : (
          <table>
            <thead><tr><th>Date</th><th>Amount</th></tr></thead>
            <tbody>
              {p.valuations.slice().reverse().map(v =>
                <tr key={v.id}>
                  <td>{new Date(v.valuedAt).toLocaleDateString()}</td>
                  <td>{centsToAUD(v.amount)}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
