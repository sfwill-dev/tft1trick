import { fireEvent, render, screen } from "@testing-library/react";
import { PatchSelector } from "@/components/PatchSelector";

const pushMock = vi.fn();
const usePathnameMock = vi.fn();
const useSearchParamsMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => usePathnameMock(),
  useSearchParams: () => useSearchParamsMock(),
}));

describe("PatchSelector", () => {
  beforeEach(() => {
    pushMock.mockReset();
    usePathnameMock.mockReturnValue("/comps");
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
  });

  it("renders selected patch as default", () => {
    render(<PatchSelector patches={["16.8", "16.7"]} selectedPatch="16.8" />);

    const select = screen.getByLabelText("Patch");
    expect(select).toHaveValue("16.8");
  });

  it("falls back to first patch when selected patch is null", () => {
    render(<PatchSelector patches={["16.8", "16.7"]} selectedPatch={null} />);

    const select = screen.getByLabelText("Patch");
    expect(select).toHaveValue("16.8");
  });

  it("updates patch search param when user changes patch", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("foo=bar"));

    render(<PatchSelector patches={["16.8", "16.7"]} selectedPatch="16.8" />);

    fireEvent.change(screen.getByLabelText("Patch"), { target: { value: "16.7" } });

    expect(pushMock).toHaveBeenCalledWith("/comps?foo=bar&patch=16.7");
  });
});
