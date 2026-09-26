export function parseDatePB(str) {
    if (!str) return '📅';
    const m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return '📅';
    return m[3] + '/' + m[2] + '/' + m[1];
}