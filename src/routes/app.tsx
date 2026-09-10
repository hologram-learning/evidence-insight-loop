import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Pilot workspace — Hologram Learning" },
      {
        name: "description",
        content: "The Hologram standards-based workspace running on seeded demo data.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
