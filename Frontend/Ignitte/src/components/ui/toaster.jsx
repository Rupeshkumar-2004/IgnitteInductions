import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className={`p-4 min-w-[300px] max-w-[420px] rounded-md shadow-lg border pointer-events-auto transition-all ${
            t.variant === 'destructive' 
              ? 'bg-destructive text-destructive-foreground border-destructive' 
              : 'bg-background text-foreground border-border'
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              {t.title && <h4 className="font-semibold text-sm">{t.title}</h4>}
              {t.description && <p className="text-sm opacity-90">{t.description}</p>}
            </div>
            <button 
              onClick={() => dismiss(t.id)} 
              className="opacity-50 hover:opacity-100 transition-opacity focus:outline-none shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
