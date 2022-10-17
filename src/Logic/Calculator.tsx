export interface Frame {
    rolls: number[];
    isFrameComplete: boolean;
    isFinalFrame: boolean;
}

let frames: Frame[];
let currentFrameIndex: number;

export function startGame() {
    currentFrameIndex = 0;
    frames = [];
    for (let i = 0; i < 9; i++) {
        frames.push({ rolls: [], isFrameComplete: false, isFinalFrame: false });
    }

    frames.push({ rolls: [], isFrameComplete: false, isFinalFrame: true });
}

export function getFrame(frameNumber: number) {
    return frames[frameNumber];
}

export function getFrameScore(frameNumber: number) {
    let nextFrame = getFrame(frameNumber + 1);
    let afterNextFrame = getFrame(frameNumber + 2);

    return calculateFrameScore(getFrame(frameNumber), nextFrame, afterNextFrame);
}

export function getCurrentFrameIndex() {
    if (currentFrameIndex > 9) {
        throw Error("game over");
    }
    return currentFrameIndex;
}

export function getTotalScore(): number {
    if (frames[0].rolls.length == 0) return 0;

    let sum = 0;
    for (let i = 0; i < frames.length; i++) {
        let frameScore = getFrameScore(i);

        if (frameScore >= 0) {
            sum += frameScore;
        }
    }

    return sum;
}

export function roll(numberOfPins: number) {
    if (currentFrameIndex > 9) {
        throw Error("game over");
    }
    const frame = frames[currentFrameIndex];
    frame.rolls.push(numberOfPins);

    if (
        (frame.isFinalFrame && isFinalFrameOver(frame)) ||
        (!frame.isFinalFrame && frame.rolls.length == 1 && frame.rolls[0] == 10) ||
        (!frame.isFinalFrame && frame.rolls.length == 2)
    ) {
        frame.isFrameComplete = true;
        currentFrameIndex++;
    }
}

function calculateFrameScore(frame: Frame, nextFrame: Frame | null, afterNextFrame: Frame | null): number {
    if (frame?.rolls?.length <= 0) {
        return NaN;
    }

    let frameScore = frame.rolls.reduce((accumulator, current) => accumulator + current, 0);

    // Both spares and strikes will be 10 pins knocked down
    if (frameScore == 10) {
        if (frame.rolls.length == 1) {
            if (nextFrame && nextFrame.rolls?.length >= 2) {
                frameScore += nextFrame.rolls[0];
                frameScore += nextFrame.rolls[1];
            } else if (nextFrame && nextFrame.rolls?.length == 1 && frame.isFrameComplete && afterNextFrame && afterNextFrame.rolls?.length >= 1) {
                frameScore += nextFrame.rolls[0];
                frameScore += afterNextFrame.rolls[0];
            } else {
                return NaN;
            }
        }
        if (frame.rolls.length == 2) {
            if (nextFrame && nextFrame.rolls?.length > 0) {
                frameScore += nextFrame.rolls[0];
            } else {
                return NaN;
            }
        }
    }

    return frameScore;
}

function isFinalFrameOver(frame: Frame) {
    if (frame?.isFinalFrame != true) {
        throw Error("not a final frame");
    }

    if (frame.rolls.length <= 1) return false;
    if (frame.rolls.length == 2) return frame.rolls[0] + frame.rolls[1] < 10;

    return true;
}
