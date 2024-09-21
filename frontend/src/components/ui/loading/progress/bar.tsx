import { useProgress } from "@frontend/hooks/useProgress";

export function ProgressBar() {
  const { downloadProgress, uploadProgress } = useProgress();

  return (
    <progress value={uploadProgress + downloadProgress} max={100}></progress>
  );
}
