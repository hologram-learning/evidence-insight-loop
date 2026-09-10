import { createFileRoute, redirect } from "@tanstack/react-router";

/** Kept so older pilot links keep working; Students is the canonical view. */
export const Route = createFileRoute("/app/courses/$courseSlug/roster")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/app/courses/$courseSlug/students",
      params: { courseSlug: params.courseSlug },
    });
  },
});
