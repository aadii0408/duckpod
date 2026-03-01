import AvatarSVG from "./AvatarSVG";
import { AVATARS, BACKGROUND_PRESETS, RAJ_HOST } from "@/lib/constants";

interface StudioPreviewProps {
  guestAvatarId: string;
  backgroundId: string;
}

const StudioPreview = ({ guestAvatarId, backgroundId }: StudioPreviewProps) => {
  const guestAvatar = AVATARS.find((a) => a.id === guestAvatarId);
  const bg = BACKGROUND_PRESETS.find((b) => b.id === backgroundId);

  const guestVariant = parseInt(guestAvatarId.split("-").pop() || "0", 10);

  return (
    <div
      className="flex items-center justify-center gap-8 rounded-2xl border border-border p-8"
      style={{ background: bg?.gradient ?? "hsl(225, 25%, 8%)" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-2xl border border-border/30 bg-background/30 p-4 backdrop-blur-sm">
          <AvatarSVG
            variant={RAJ_HOST.avatarVariant}
            size={96}
            colors={RAJ_HOST.colors}
          />
        </div>
        <span className="text-xs font-semibold uppercase text-muted-foreground">Host</span>
        <span className="text-sm font-medium text-foreground">{RAJ_HOST.name}</span>
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
