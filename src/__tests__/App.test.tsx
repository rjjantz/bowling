import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

export function renderApp() {
    render(<App />);
}

describe("app tests", () => {
    test("renderApp works with no exceptions", () => {
        try {
            renderApp();
        } catch (e: any) {
            // If there is an issue, it'll fail
            fail(e);
        }
    });

    test("app has a title", () => {
        renderApp();

        expect(screen.getByTestId("title")).toBeInTheDocument();
    });

    test("app has a scoreboard", () => {
        renderApp();

        expect(screen.getByTestId("scoreBoard")).toBeInTheDocument();
    });

    test("has start game button", () => {
        renderApp();

        const button = screen.queryByRole("button", { name: "Start Game" });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });

    test("has abort game button", () => {
        renderApp();

        const button = screen.queryByRole("button", { name: "Abort Game" });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    test("start game button is disabled after click and abort game is enabled", async () => {
        renderApp();

        const startButton = screen.getByRole("button", { name: "Start Game" });
        const abortButton = screen.getByRole("button", { name: "Abort Game" });

        await userEvent.click(startButton);

        expect(startButton).toBeDisabled();
        expect(abortButton).not.toBeDisabled();
    });

    test("abort game button is disabled after click and abort game is enabled", async () => {
        renderApp();

        const startButton = screen.getByRole("button", { name: "Start Game" });
        const abortButton = screen.getByRole("button", { name: "Abort Game" });

        await userEvent.click(startButton);
        await userEvent.click(abortButton);

        expect(startButton).not.toBeDisabled();
        expect(abortButton).toBeDisabled();
    });
});
