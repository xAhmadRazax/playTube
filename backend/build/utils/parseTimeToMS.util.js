export const parseTimeToMs = (time) => {
    const match = /^(\d+)([smhd])$/.exec(time);
    if (!match) {
        throw new Error(`Invalid time format: ${time}`);
    }
    const value = +match[1];
    const unit = match[2];
    const multiplier = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };
    return value * multiplier[unit];
};
