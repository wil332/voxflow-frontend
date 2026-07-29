import { useContext } from "react";
import { PipelineContext } from "./PipelineContext"; // Pastikan path & nama file sesuai

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error("usePipeline harus dipakai di dalam <PipelineProvider>");
  }
  return context;
}