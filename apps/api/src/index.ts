import express from "express";
import { createServiceSchema, type CreateServiceInput } from "@bookwise/shared";
import { validateBody } from "./middleware/validate";
import { authRouter } from "./routes/auth";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.post(
  "/api/orgs/:orgId/services",
  validateBody(createServiceSchema),
  (req, res, next) => {
    const input = req.body as CreateServiceInput; // already validated
    // later: save with Drizzle, scoped to req.params.orgId
    res.status(201).json({ ...input, id: crypto.randomUUID() });
  },
);

app.listen(3000, () => console.log("API on http://localhost:3000"));
