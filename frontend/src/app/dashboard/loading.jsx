import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={24} className="animate-spin text-[#037338]" />
    </div>
  );
}
