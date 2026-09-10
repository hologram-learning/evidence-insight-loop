import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/launch" });
  },
  head: () => ({
    meta: [
      { title: "Hologram Learning — pilot workspace" },
      {
        name: "description",
        content: "Enter the Hologram standards-based pilot workspace running on seeded demo data.",
      },
      { property: "og:title", content: "Hologram Learning — pilot workspace" },
      {
        property: "og:description",
        content: "Enter the Hologram standards-based pilot workspace running on seeded demo data.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});
