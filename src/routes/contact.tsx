import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/design-system/code-companions-0f8a99";
import { SiteChrome } from "@/components/SiteChrome";
import { PILOT_CONTENT } from "@/data/pilotContent";
import { savePilotRequest } from "@/lib/storage";
import type { PilotRequest } from "@/types/domain";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Request a pilot review — Hologram Learning" },
      {
        name: "description",
        content:
          "Tell us about your school or district and what you want to evaluate. Requests are saved locally in this demonstration build.",
      },
      { property: "og:title", content: "Request a pilot review — Hologram Learning" },
      {
        property: "og:description",
        content: "Start a conversation about evaluating a standards-based evidence workflow.",
      },
    ],
  }),
  component: ContactPage,
});

type Errors = Partial<Record<keyof PilotRequest, string>>;

function ContactPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const get = (name: string) => String(form.get(name) ?? "").trim();

    const request: PilotRequest = {
      fullName: get("fullName"),
      workEmail: get("workEmail"),
      organization: get("organization"),
      role: get("role"),
      region: get("region"),
      scale: get("scale"),
      goals: get("goals"),
      currentLms: get("currentLms"),
      workflow: get("workflow"),
      timeline: get("timeline"),
      additional: get("additional"),
      submittedOn: new Date().toISOString(),
    };

    const next: Errors = {};
    if (!request.fullName) next.fullName = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.workEmail)) next.workEmail = "Enter a valid work email.";
    if (!request.organization) next.organization = "Enter your school or district.";
    if (!request.role) next.role = "Select your role.";
    if (!request.region) next.region = "Enter your state or region.";
    if (!request.scale) next.scale = "Select an approximate scale.";
    if (request.goals.length < 20) next.goals = "Tell us a little more — at least a sentence.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    savePilotRequest(request);
    navigate({ to: "/thank-you" });
  }

  return (
    <SiteChrome>
      <div className="section">
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Request pilot access" }]}
          title={PILOT_CONTENT.primaryCta}
          subtitle={PILOT_CONTENT.cohortScopeStatement}
        />

        <Alert tone="info" title="Demonstration form" className="mt-6">
          This request is saved in your browser only. Nothing is emailed or transmitted.
        </Alert>

        <form onSubmit={handleSubmit} className="housing" style={{ marginTop: "var(--s-24)", maxWidth: "760px" }} noValidate>
          <div className="housing-inner stack-16" style={{ padding: "var(--s-24)" }}>
            <Field label="Full name" htmlFor="fullName" required error={errors.fullName}>
              <Input id="fullName" name="fullName" autoComplete="name" invalid={!!errors.fullName} />
            </Field>
            <Field label="Work email" htmlFor="workEmail" required error={errors.workEmail}>
              <Input id="workEmail" name="workEmail" type="email" autoComplete="email" invalid={!!errors.workEmail} />
            </Field>
            <Field label="School or district" htmlFor="organization" required error={errors.organization}>
              <Input id="organization" name="organization" invalid={!!errors.organization} />
            </Field>
            <Field label="Your role" htmlFor="role" required error={errors.role}>
              <Select id="role" name="role" defaultValue="" invalid={!!errors.role}>
                <option value="" disabled>
                  Select a role
                </option>
                <option>Teacher</option>
                <option>Instructional coach</option>
                <option>School leader</option>
                <option>District administrator</option>
                <option>Technology lead</option>
              </Select>
            </Field>
            <Field label="State or region" htmlFor="region" required error={errors.region}>
              <Input id="region" name="region" invalid={!!errors.region} />
            </Field>
            <Field label="Approximate scale" htmlFor="scale" required error={errors.scale}>
              <Select id="scale" name="scale" defaultValue="" invalid={!!errors.scale}>
                <option value="" disabled>
                  Select a scale
                </option>
                <option>One classroom</option>
                <option>One grade level</option>
                <option>One school</option>
                <option>Multiple schools</option>
              </Select>
            </Field>
            <Field label="Current LMS" htmlFor="currentLms" help="Optional. Helps us describe the pilot launch model accurately.">
              <Input id="currentLms" name="currentLms" />
            </Field>
            <Field
              label="What would you want to evaluate?"
              htmlFor="goals"
              required
              error={errors.goals}
              help="A sentence or two is plenty."
            >
              <Textarea id="goals" name="goals" rows={4} invalid={!!errors.goals} />
            </Field>
            <Field label="How does standards-based grading work for you today?" htmlFor="workflow">
              <Textarea id="workflow" name="workflow" rows={3} />
            </Field>
            <Field label="Timeline you have in mind" htmlFor="timeline" help={PILOT_CONTENT.timelineLabel}>
              <Input id="timeline" name="timeline" />
            </Field>
            <Field label="Anything else" htmlFor="additional">
              <Textarea id="additional" name="additional" rows={3} />
            </Field>
            <div className="row-16">
              <Button type="submit" variant="primary" loading={submitting}>
                Send pilot request
              </Button>
              <span className="micro-label">{PILOT_CONTENT.noCommitment}</span>
            </div>
          </div>
        </form>
      </div>
    </SiteChrome>
  );
}
