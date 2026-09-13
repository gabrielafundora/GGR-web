"use client";

export function ConfirmDeleteButton({
  action,
  confirmMessage = "¿Eliminar este elemento? Esta acción no se puede deshacer.",
  label = "Eliminar",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-accent hover:text-accent-hover"
      >
        {label}
      </button>
    </form>
  );
}
