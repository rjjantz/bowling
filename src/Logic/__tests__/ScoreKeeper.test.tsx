import { startGame, getFrame, getTotalScore, getCurrentFrameIndex, getFrameScore, roll } from "../ScoreKeeper";

beforeEach(() => {
    startGame();
});

describe("Game structure", () => {
    test("Has 10 frames", () => {
        expect(getFrame(0)).toBeDefined();
        expect(getFrame(1)).toBeDefined();
        expect(getFrame(2)).toBeDefined();
        expect(getFrame(3)).toBeDefined();
        expect(getFrame(4)).toBeDefined();
        expect(getFrame(5)).toBeDefined();
        expect(getFrame(6)).toBeDefined();
    });

    test("game total start at zero", () => {
        expect(getTotalScore()).toBe(0);
    });

    test("tracks frames with normal rolls", () => {
        expect(getCurrentFrameIndex()).toBe(0);
        roll(0);
        roll(0);

        expect(getCurrentFrameIndex()).toBe(1);
        roll(0);
        roll(0);

        expect(getCurrentFrameIndex()).toBe(2);
    });

    test("Only 10 frames allowed", () => {
        rollZerosForNumberOfFrames(10);

        expect(() => getCurrentFrameIndex()).toThrowError("game over");
        expect(() => roll(0)).toThrowError("game over");
    });
});

describe("normal roll", () => {
    const singleRolls = [
        [0, 0],
        [1, 1],
        [2, 2],
        [7, 7],
    ];
    test.each(singleRolls)("roll %p gets %p", (firstRoll, expected) => {
        roll(firstRoll);

        expect(getTotalScore()).toBe(expected);
    });

    const doubleRolls = [
        [2, 2, 4],
        [1, 6, 7],
        [0, 9, 9],
        [0, 0, 0],
    ];

    test.each(doubleRolls)("roll %p and then roll %p gets %p", (firstRoll, secondRoll, expected) => {
        roll(firstRoll);
        roll(secondRoll);

        expect(getTotalScore()).toBe(expected);
    });

    const twoFrameRolls = [
        [1, 5, 7, 4, 17],
        [0, 5, 3, 4, 12],
    ];
    test.each(twoFrameRolls)("two frames with rolls: %p, %p, %p, %p should get %p", (firstRoll, secondRoll, thirdRoll, fourthRoll, expected) => {
        roll(firstRoll);
        roll(secondRoll);
        roll(thirdRoll);
        roll(fourthRoll);

        expect(getTotalScore()).toBe(expected);
    });
});

describe("spare rolls", () => {
    const spareRollsWithFrameTotal = [
        [2, 8, 5, 15],
        [5, 5, 7, 17],
        [0, 10, 3, 13],
    ];

    test.each(spareRollsWithFrameTotal)("a spare (%p, %p) with an extra roll (%p) gets %p for the frame", (firstRoll, secondRoll, thirdRoll, expected) => {
        roll(firstRoll);
        roll(secondRoll);
        roll(thirdRoll);

        expect(getFrameScore(0)).toBe(expected);
    });

    const spareRollsWithGameTotal = [
        [2, 8, 5, 20],
        [5, 5, 7, 24],
        [0, 10, 3, 16],
    ];

    test.each(spareRollsWithGameTotal)("a spare (%p, %p) with an extra roll (%p) gets %p for the game", (firstRoll, secondRoll, thirdRoll, expected) => {
        roll(firstRoll);
        roll(secondRoll);
        roll(thirdRoll);

        expect(getTotalScore()).toBe(expected);
    });

    test("spare with no third roll yet returns NaN", () => {
        roll(5);
        roll(5);

        expect(getFrameScore(0)).toBeNaN();
    });
});

describe("strike rolls", () => {
    test("if strike, skip second roll", () => {
        expect(getCurrentFrameIndex()).toBe(0);
        roll(10);

        expect(getCurrentFrameIndex()).toBe(1);
        expect(getFrame(0).rolls.length).toBe(1);
    });

    const strikeRollsWithFrameTotal = [
        [10, 2, 3, 15],
        [10, 7, 1, 18],
        [10, 0, 0, 10],
    ];

    test.each(strikeRollsWithFrameTotal)("a strike (%p, -) with an extra two rolls (%p, %p) gets %p for the frame", (firstRoll, secondRoll, thirdRoll, expected) => {
        roll(firstRoll);
        roll(secondRoll);
        roll(thirdRoll);

        expect(getFrameScore(0)).toBe(expected);
    });

    const strikeRollsWithGameTotal = [
        [10, 2, 3, 20],
        [10, 7, 1, 26],
        [10, 0, 0, 10],
    ];

    test.each(strikeRollsWithGameTotal)("a strike (%p, -) with an extra two rolls (%p, %p) gets %p for the game", (firstRoll, secondRoll, thirdRoll, expected) => {
        roll(firstRoll);
        roll(secondRoll);
        roll(thirdRoll);

        expect(getTotalScore()).toBe(expected);
    });

    test("strike with no second roll yet returns NaN", () => {
        roll(10);

        expect(getFrameScore(0)).toBeNaN();
    });

    test("strike with no third roll yet returns NaN", () => {
        roll(10);
        roll(1);

        expect(getFrameScore(0)).toBeNaN();
    });
});

describe("mixture of roll types", () => {
    test("spare and strike", () => {
        roll(5);
        roll(5); // End of Frame 1 -> Frame total should be 20

        roll(10); // End of Frame 2 -> Frame total should be 18
        roll(4);
        roll(4); // End of Frame 3 -> Frame total should be 8

        expect(getFrameScore(0)).toBe(20);
        expect(getFrameScore(1)).toBe(18);
        expect(getFrameScore(2)).toBe(8);

        expect(getTotalScore()).toBe(46);
    });

    test("strike and a strike", () => {
        roll(10); // End of Frame 1 -> Frame total should be 25
        roll(10); // End of Frame 2 -> Frame total should be 16
        roll(5);
        roll(1); // End of Frame 3 -> Frame total should be 6

        expect(getFrameScore(0)).toBe(25);
        expect(getFrameScore(1)).toBe(16);
        expect(getFrameScore(2)).toBe(6);

        expect(getTotalScore()).toBe(47);
    });

    test("three strikes in a row", () => {
        roll(10); // End of Frame 1 -> Frame total should be 30
        roll(10); // End of Frame 2 -> Frame total should be 25
        roll(10); // End of Frame 3 -> Frame total should be 17
        roll(5);
        roll(2); // End of Frame 4 -> Frame total should be 7

        expect(getFrameScore(0)).toBe(30);
        expect(getFrameScore(1)).toBe(25);
        expect(getFrameScore(2)).toBe(17);
        expect(getFrameScore(3)).toBe(7);

        expect(getTotalScore()).toBe(79);
    });
});

describe("last frame", () => {
    beforeEach(() => {
        rollZerosForNumberOfFrames(9);
        expect(getCurrentFrameIndex()).toBe(9);
    });

    test("last frame two regulars, no extra roll -> scores normal and frame is complete, and game over", () => {
        roll(1);
        roll(1);

        expect(getFrameScore(9)).toBe(2);
        expect(getFrame(9).isFrameComplete).toBe(true);
    });

    test("spare gets 1 extra roll -> frame score is sum of rolls, frame complete after 3", () => {
        roll(9);
        roll(1);
        expect(getFrame(9).isFrameComplete).toBe(false);

        roll(9);
        expect(getFrame(9).isFrameComplete).toBe(true);

        expect(getFrameScore(9)).toBe(19);
    });

    test("strike gets two extra rolls", () => {
        roll(10);
        expect(getFrame(9).isFrameComplete).toBe(false);

        roll(1);
        expect(getFrame(9).isFrameComplete).toBe(false);

        roll(8);
        expect(getFrame(9).isFrameComplete).toBe(true);

        expect(getFrameScore(9)).toBe(19);
    });

    test("three strikes equals 30", () => {
        roll(10);
        roll(10);
        roll(10);

        expect(getFrameScore(9)).toBe(30);
    });
});

describe("full games", () => {
    const fullGameRolls = [
        {
            rolls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            expectedFrameScores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            expectedGameScore: 0,
        },
        {
            rolls: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            expectedFrameScores: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            expectedGameScore: 20,
        },
        {
            rolls: [9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9, 1, 9],
            expectedFrameScores: [19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
            expectedGameScore: 190,
        },
        {
            rolls: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            expectedFrameScores: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            expectedGameScore: 300,
        },
        {
            rolls: [10, 10, 10, 7, 3, 10, 10, 10, 10, 10, 10, 0, 0],
            expectedFrameScores: [30, 27, 20, 20, 30, 30, 30, 30, 20, 10],
            expectedGameScore: 247,
        },
        {
            rolls: [2, 1, 4, 5, 10, 10, 1, 2, 9, 1, 10, 0, 3, 3, 3, 7, 1],
            expectedFrameScores: [3, 9, 21, 13, 3, 20, 13, 3, 6, 8],
            expectedGameScore: 99,
        },
        {
            rolls: [9, 1, 4, 6, 10, 10, 1, 2, 9, 1, 10, 7, 3, 3, 3, 7, 3, 10],
            expectedFrameScores: [14, 20, 21, 13, 3, 20, 20, 13, 6, 20],
            expectedGameScore: 150,
        },
        {
            rolls: [10, 10, 9, 1, 10, 2, 8, 7, 3, 9, 1, 10, 8, 2, 10, 10, 9],
            expectedFrameScores: [29, 20, 20, 20, 17, 19, 20, 20, 20, 29],
            expectedGameScore: 214,
        },
    ];

    test.each(fullGameRolls)("full game %p", (data) => {
        data.rolls.forEach((numberOfPins) => {
            roll(numberOfPins);
        });

        for (let i = 0; i < 10; i++) {
            expect(getFrameScore(i)).toBe(data.expectedFrameScores[i]);
        }

        expect(getTotalScore()).toBe(data.expectedGameScore);
    });
});

function rollZerosForNumberOfFrames(numberOfFrames: number) {
    for (let i = 0; i < numberOfFrames; i++) {
        roll(0);
        roll(0);
    }
}
