import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDemo } from "@/lib/demo-state";
import { ROLE_HOME } from "@/lib/permissions";

export const Route = createFileRoute("/app/")({
  component: AppIndex,
});

function AppIndex() {
  const { role, hydrated } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated) navigate({ to: ROLE_HOME[role], replace: true });
  }, [hydrated, role, navigate]);

  return <p className="micro-label">Opening your workspace…</p>;
}
