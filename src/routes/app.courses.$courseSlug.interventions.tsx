import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/courses/$courseSlug/interventions")({
  component: () => <Outlet />,
});
