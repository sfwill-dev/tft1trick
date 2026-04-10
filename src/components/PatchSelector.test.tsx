import { fireEvent, render, screen } from "@testing-library/react";
import { PatchSelector } from "@/components/PatchSelector";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("PatchSelector", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it("renders selected patch as default", () => {
    render(<PatchSelector patches={["16.8", "16.7"]} selectedPatch="16.8" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("16.8");
  });

  it("falls back to first patch when selected patch is null", () => {
    render(<PatchSelector patches={["16.8", "16.7"]} selectedPatch={null} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("16.8");
  });

  it("navigates to the selected patch page when user changes patch", () => {
    render(<PatchSelector patches={["16.8", "16.7"]} selectedPatch="16.8" />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16.7" } });

    expect(pushMock).toHaveBeenCalledWith("/patches/16.7");
  });
});
