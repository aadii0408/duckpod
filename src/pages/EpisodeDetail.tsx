import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

const EpisodeDetail = () => {
  const { id } = useParams();

  // Placeholder — will load from Supabase later
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/episodes"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">Episode Detail</h1>
        </div>

        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card/40 p-6">
          <p className="text-muted-foreground">Episode ID: {id}</p>
          <p className="text-sm text-muted-foreground">
            Full episode details will appear here once connected to the backend — including audio player, transcript, show notes, and download options.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <Download className="h-3.5 w-3.5" />
              Download MP3
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <Hash className="h-3.5 w-3.5" />
              Download Transcript
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetail;
