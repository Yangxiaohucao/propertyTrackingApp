import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import { centsToAUD } from "../lib/money";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreatePropertySchema = z.object({ name: z.string().min(1), address: z.string().min(1) });
type CreateProperty = z.infer<typeof CreatePropertySchema>;

type ListItem = {
  id: number; name: string; address: string;
  latestValuationCents: number | null; latestValuedAt: string | null; pctChange: number | null;
}

export default function PropertyList() {
  const qc = useQueryClient();

  const propsQuery = useQuery({
    queryKey: ["properties"],
    queryFn: async () => (await api.get<ListItem[]>("/properties")).data
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProperty>();
  const createMutation = useMutation({
    mutationFn: async (data: CreateProperty) => {
      const parsed = CreatePropertySchema.safeParse(data);
      if (!parsed.success) throw parsed.error;
      return (await api.post("/properties", parsed.data)).data;
    },
    onSuccess: () => { reset(); qc.invalidateQueries({ queryKey: ["properties"] }); }
  });

  return (
    <>
      <div className="card">
        <h3>Add a property</h3>
        <form className="row" onSubmit={handleSubmit((d) => createMutation.mutate(d))}>
          <input placeholder="Name (eg. Springfield Lakes House)" {...register("name", { required: true })} />
          <input placeholder="Address" {...register("address", { required: true })} style={{minWidth:300}} />
          <button type="submit">Save</button>
          {createMutation.isError && <div className="error">Failed to save.</div>}
        </form>
        {(errors.name || errors.address) && <div className="error small">Name & address are required.</div>}
      </div>

      <div className="card">
        <h3>Properties</h3>
        {propsQuery.isLoading ? "Loading..." : null}
        {propsQuery.error ? <div className="error">Failed to load.</div> : null}
        {!propsQuery.isLoading && !propsQuery.error && (
          <table>
            <thead>
              <tr><th>Name</th><th>Address</th><th>Latest valuation</th><th>% since last</th></tr>
            </thead>
            <tbody>
              {propsQuery.data!.map(p => {
                const pct = p.pctChange == null ? "—" : `${p.pctChange >= 0 ? "+" : ""}${p.pctChange.toFixed(1)}%`;
                return (
                  <tr key={p.id}>
                    <td><Link to={`/properties/${p.id}`}>{p.name}</Link></td>
                    <td>{p.address}</td>
                    <td>{p.latestValuationCents ? centsToAUD(p.latestValuationCents) : <span className="small">None yet</span>}</td>
                    <td>{p.pctChange == null ? <span className="small">n/a</span> : pct}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
