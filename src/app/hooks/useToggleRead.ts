"use client";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleRead } from "@/server/books/actions";

export function useToggleRead(id: number): {
  toggle: () => Promise<void>;
  isPending: boolean;
  error: string | null;
} {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggle = async () => {
    setError(null);
    const res = await toggleRead(id);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  return { toggle, isPending, error };
}
