import { XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  open: boolean;
  onClose: () => void;
  width?: string;
  children: React.ReactNode;
};

export default function Drawer({
  open,
  onClose,
  width = "w-64",
  children,
}: Props) {
  return (
    <>
      {/* Overlay escuro */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Painel */}
      <aside
        className={[
          "fixed inset-y-0 right-0 z-50 border-l border-slate-800 bg-slate-900",
          width,
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* botão X */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* conteúdo */}
        <div className="p-6 pt-12">{children}</div>
      </aside>
    </>
  );
}
