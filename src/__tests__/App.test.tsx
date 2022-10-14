import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

export function renderApp() {
    render(<App />);
}

test("renderApp works with no exceptions", () => {
    try {
        renderApp();
    } catch (e: any) {
        // If there is an issue, it'll fail
        fail(e);
    }
});
