import { screen } from "@testing-library/react";
import { renderApp } from "../../__tests__/App.test";

describe("Scoreboard tests", () => {
    test("has 10 frames", () => {
        renderApp();

        expect(screen.getAllByTestId("frame").length).toBe(10);
    });

    // test("game over shows if game is over", () => {
    //     renderApp();
    // });
});
