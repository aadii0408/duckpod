import AvatarSVG from "./AvatarSVG";
import { AVATARS, BACKGROUND_PRESETS } from "@/lib/constants";

interface StudioPreviewProps {
  hostAvatarId: string;
  guestAvatarId: string;
  backgroundId: string;
}

const StudioPreview = ({ hostAvatarId, guestAvatarId, backgroundId }: StudioPreviewProps) => {
  const hostAvatar = AVATARS.find((a) => a.id === hostAvatarId);
  const guestAvatar = AVATARS.find((a) => a.id === guestAvatarId);
  const bg = BACKGROUND_PRESETS.find((b) => b.id === backgroundId);

  const hostVariant = parseInt(hostAvatarId.split("-").pop() || "0", 10);
  const guestVariant = parseInt(guestAvatarId.split("-").pop() || "0", 10);

  return (
    <div
      className="flex items-center justify-center gap-8 rounded-2xl border border-border p-8"
      style={{ background: bg?.gradient ?? "hsl(225, 25%, 8%)" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-2xl border border-border/30 bg-background/30 p-4 backdrop-blur-sm">
          <AvatarSVG
            variant={hostVariant}
            size={96}
            colors={hostAvatar?.colors ?? { bg: "hsl(168,80%,50%)", skin: "hsl(30,60%,70%)", accent: "hsl(270,60%,60%)" }}
          />
        </div>
        <span className="text-xs font-semibold uppercase text-muted-foreground">Host</span>
        <span className="text-sm font-medium text-foreground">{hostAvatar?.label ?? "Host"}</span>
      </div>

      <div className="text-2xl text-muted-foreground/30">×</div>

      <div className="flex flex-col items-center gap-2">
        <div className="rounded-2xl border border-border/30 bg-background/30 p-4 backdrop-blur-sm">
          <AvatarSVG
            variant={guestVariant}
            size={96}
            colors={guestAvatar?.colors ?? { bg: "hsl(270,60%,55%)", skin: "hsl(25,55%,65%)", accent: "hsl(168,80%,50%)" }}
          />
        </div>
        <span className="text-xs font-semibold uppercase text-muted-foreground">Guest</span>
        <span className="text-sm font-medium text-foreground">{guestAvatar?.label ?? "Guest"}</span>
      </div>
    </div>
  );
};

export default StudioPreview;
