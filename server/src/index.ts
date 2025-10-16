import express from "express";
import cors from "cors";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PropertyInput = z.object({
  name: z.string().min(1),
  address: z.string().min(1)
});

const ValuationInput = z.object({
  amount: z.number().int().positive(), 
  valuedAt: z.string().datetime()      
});


app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/properties", async (_req, res) => {
  const props = await prisma.property.findMany({
    include: {
      valuations: { orderBy: { valuedAt: "desc" }, take: 2 }
    },
    orderBy: { createdAt: "desc" }
  });

const shaped = props.map((p: {
  id: number;
  name: string;
  address: string;
  valuations: { amount: number; valuedAt: Date }[];
}) => {
  const [latest, previous] = p.valuations;
  const latestAmount = latest?.amount ?? null;
  const pctChange = (latest && previous)
    ? Number(((latest.amount - previous.amount) / previous.amount) * 100)
    : null;

  return {
    id: p.id,
    name: p.name,
    address: p.address,
    latestValuationCents: latestAmount,
    latestValuedAt: latest?.valuedAt ?? null,
    pctChange
  };
});

  res.json(shaped);
});


app.post("/api/properties", async (req, res) => {
  const parsed = PropertyInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const created = await prisma.property.create({ data: parsed.data });
  res.status(201).json(created);
});


app.get("/api/properties/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const property = await prisma.property.findUnique({
    where: { id },
    include: { valuations: { orderBy: { valuedAt: "asc" } } }
  });

  if (!property) return res.status(404).json({ error: "Not found" });
  res.json(property);
});


app.post("/api/properties/:id/valuations", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = ValuationInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const created = await prisma.valuation.create({
      data: {
        propertyId: id,
        amount: parsed.data.amount,
        valuedAt: new Date(parsed.data.valuedAt)
      }
    });
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Unable to create valuation" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server on :${PORT}`));
