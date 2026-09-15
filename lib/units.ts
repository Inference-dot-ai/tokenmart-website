// Unit labels for per-unit (media) prices. No dependencies, safe for client bundles.

export function unitLabel(metric: string): string {
  switch (metric) {
    case "video_seconds":
      return "per second of video";
    case "video_tokens":
      return "per 1M video tokens";
    case "image_count":
      return "per image";
    case "image_input_count":
      return "per input image";
    case "audio_seconds":
      return "per second of audio";
    default:
      return `per ${metric.replace(/_/g, " ")}`;
  }
}

/** Per-unit prices that are tiny (video tokens) are shown per 1M units. */
export function unitScale(metric: string): number {
  return metric === "video_tokens" ? 1_000_000 : 1;
}
