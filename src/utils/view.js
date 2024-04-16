export const shortView = (number) => {
    if (number >= 1000000000) {
        return Math.floor(number / 1000000000) + 'T';
    } else if (number >= 1000000) {
        return Math.floor(number / 1000000) + 'M';
    } else if (number >= 1000) {
        return Math.floor(number / 1000) + 'N';
    } else {
        return String(number);
    }
}
