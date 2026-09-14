import { AgentQueryResponse } from "@/lib/types";
import WorkflowSteps from "./WorkflowSteps";

export default function AgentResult({
  result
}: {
  result: AgentQueryResponse;
}) {
  return (
    <div>
      <h2>Agent Result</h2>

      <div>
        <p>
          <strong>Machine Status:</strong>{" "}
          {result.machine_status ?? "N/A"}
        </p>

        <p>
          <strong>Risk Level:</strong>{" "}
          {result.risk_level ?? "N/A"}
        </p>

        <p>
          <strong>Confidence:</strong>{" "}
          {(result.confidence * 100).toFixed(1)}%
        </p>

        <p>
          <strong>Recommended Action:</strong>{" "}
          {result.recommended_action}
        </p>
      </div>

      <div>
        <h3>Evidence</h3>

        {result.evidence.length === 0 ? (
          <p>No evidence returned.</p>
        ) : (
          <ul>
            {result.evidence.map((item, index) => (
              <li key={index}>
                <strong>{item.source}:</strong>{" "}
                {item.detail}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Citations</h3>

        {result.citations.length === 0 ? (
          <p>No citations returned.</p>
        ) : (
          <ul>
            {result.citations.map((citation, index) => (
              <li key={index}>
                Document {citation.document_id}, page{" "}
                {citation.page}
              </li>
            ))}
          </ul>
        )}
      </div>

      <WorkflowSteps steps={result.workflow_steps} />
    </div>
  );
}