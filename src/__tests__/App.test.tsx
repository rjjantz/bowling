import { render, screen } from "@testing-library/react";
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

    test("can start game", () => {
        renderApp();

        const button = screen.queryByRole("button", { name: "Start Game" });
        expect(button).toBeInTheDocument();
    });
});
