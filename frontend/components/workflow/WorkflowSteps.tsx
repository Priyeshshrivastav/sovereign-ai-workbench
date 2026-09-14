import { AgentWorkflowStep } from "@/lib/types";

export default function WorkflowSteps({
  steps
}: {
  steps: AgentWorkflowStep[];
}) {
  return (
    <div>
      <h3>Workflow</h3>

      <ol>
        {steps.map((step, index) => (
          <li key={`${step.step}-${index}`}>
            <strong>{step.step}</strong>{" "}
            — {step.status}
            {step.detail ? ` — ${step.detail}` : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}