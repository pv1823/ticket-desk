import type { Config } from "@netlify/functions";

const tickets = [
  { id: 1, title: "Login page slow", status: "open", priority: "high" },
  { id: 2, title: "Export CSV broken", status: "in_progress", priority: "medium" },
  { id: 3, title: "Update footer links", status: "closed", priority: "low" },
];

export default async (req: Request) => {
  const status = new URL(req.url).searchParams.get("status");
  const result = status ? tickets.filter(t => t.status === status) : tickets;

  return Response.json({
    env: process.env.APP_ENV ?? "not set",
    tickets: result,
  });
};

export const config: Config = { path: "/api/tickets" };
