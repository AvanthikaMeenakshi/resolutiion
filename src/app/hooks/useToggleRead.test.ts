import { renderHook, act } from "@testing-library/react";
import { useToggleRead } from "./useToggleRead";
import { toggleRead } from "@/server/books/actions";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/server/books/actions", () => ({
  toggleRead: jest.fn(),
}));

describe("useToggleRead", () => {
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });
  });

  it("calls toggleRead and refreshes router on success", async () => {
    jest.mocked(toggleRead).mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useToggleRead(123));

    await act(async () => {
      await result.current.toggle();
    });

    expect(toggleRead).toHaveBeenCalledWith(123);
    expect(mockRefresh).toHaveBeenCalled();
    expect(result.current.error).toBe(null);
  });

  it("sets error if toggleRead fails", async () => {
    jest.mocked(toggleRead).mockResolvedValue({
      ok: false,
      error: "Update failed",
    });

    const { result } = renderHook(() => useToggleRead(123));

    await act(async () => {
      await result.current.toggle();
    });

    expect(toggleRead).toHaveBeenCalledWith(123);
    expect(result.current.error).toBe("Update failed");
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("clears previous error before retry", async () => {
    jest
      .mocked(toggleRead)
      .mockResolvedValueOnce({ ok: false, error: "Update failed" })
      .mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useToggleRead(123));

    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.error).toBe("Update failed");

    await act(async () => {
      await result.current.toggle();
    });
    expect(result.current.error).toBe(null);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
