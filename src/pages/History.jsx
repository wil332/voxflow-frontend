import DashboardLayout from "../components/DashboardLayout";
import EpisodesTable from "../components/EpisodesTable";
import { usePipeline } from "../context/usePipeline";

export default function History() {
  const { history } = usePipeline();

  const formattedEpisodes = history.map((item) => ({
    id: `EP-${String(item.id).padStart(3, "0")}`,
    rawId: item.id,
    title: item.keyword,
    status: item.status,
    progress: item.status === "completed" ? 100 : item.status === "failed" ? 0 : 50,
    startedAt: item.created_at ? new Date(item.created_at).toLocaleString() : "--",
    videoFilename: item.video_filename,
  }));

  return (
    <DashboardLayout title="Generation History" breadcrumb="All Episodes">
      <EpisodesTable episodes={formattedEpisodes} />
    </DashboardLayout>
  );
}