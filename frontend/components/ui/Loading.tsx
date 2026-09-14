export default function Loading({
  message = "Loading..."
}: {
  message?: string;
}) {
  return <p>{message}</p>;
}