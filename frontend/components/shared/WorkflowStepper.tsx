interface WorkflowStep {
  step: string;
  status: "done" | "running" | "pending";
  detail: string;
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
}

export default function WorkflowStepper({
  steps,
}: WorkflowStepperProps) {
  return (
    <div className="space-y-2">
      {steps.map((item, index) => (
        <div
          key={`${item.step}-${index}`}
          className="flex gap-3 rounded-md border border-slate-800 bg-slate-950 p-3"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-700 text-xs text-slate-400">
            {index + 1}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-slate-200">
                {item.step.replaceAll("_", " ")}
              </p>

              <span className="rounded border border-slate-700 px-2 py-0.5 text-[10px] uppercase text-slate-500">
                {item.status}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {item.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}