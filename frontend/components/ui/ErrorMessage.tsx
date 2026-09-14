export default function ErrorMessage({
  message
}: {
  message: string;
}) {
  return (
    <div role="alert">
      <strong>Error:</strong> {message}
    </div>
  );
}