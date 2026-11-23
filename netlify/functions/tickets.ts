import type { Config } from "@netlify/functions";

const tickets = [
  { id: 1, title: "Login page slow", status: "open", priority: "high" },
  { id: 2, title: "Export CSV broken", status: "in_progress", priority: "medium" },
  { id: 3, title: "Update footer links", status: "closed", priority: "low" },
];

export default async (req: Request) => {
  const params = new URL(req.url).searchParams;
  const status = params.get("status");
  const priority = params.get("priority");
  const result = tickets.filter(
    t => (!status || t.status === status) && (!priority || t.priority === priority)
  );

  return Response.json({
    env: process.env.APP_ENV ?? "not set",
    tickets: result,
  });
};

export const config: Config = { path: "/api/tickets" };
