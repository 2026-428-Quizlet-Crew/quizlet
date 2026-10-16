import { act, renderHook } from "@testing-library/react";
import { AuthService, DeckService } from "@/service";
import { useStorageLocations } from "./useStorageLocations";

describe("useStorageLocations", () => {
  test("re-renders when the user logs in and out", () => {
    const auth = AuthService.resetForTests();
    DeckService.resetForTests({ auth });
    const { result } = renderHook(() => useStorageLocations());

    expect(result.current).toEqual(["local"]);

    act(() => auth.setUser({ id: "user-1", name: "Test User" }));
    expect(result.current).toEqual(["local", "cloud"]);

    act(() => auth.setUser(null));
    expect(result.current).toEqual(["local"]);
  });
});
