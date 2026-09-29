const OPEN_TO_CLOSE = { '(': ')', '[': ']', '{': '}' };

function tagRanges(text) {
    const ranges = [];
    const stack = [];
    let start = 0;

    function addRange(end) {
        let left = start;
        let right = end;
        while (left < right && /[ \t]/.test(text[left])) left++;
        while (right > left && /[ \t]/.test(text[right - 1])) right--;
        if (left < right) ranges.push({ start: left, end: right, rawStart: start, rawEnd: end });
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '\n' || char === '\r') {
            addRange(i);
            start = i + 1;
            stack.length = 0;
        } else if (OPEN_TO_CLOSE[char]) {
            stack.push(OPEN_TO_CLOSE[char]);
        } else if (char === stack[stack.length - 1]) {
            stack.pop();
        } else if (char === ',' && stack.length === 0) {
            addRange(i);
            start = i + 1;
        }
    }
    addRange(text.length);
    return ranges;
}

function outerParenthesesCover(text) {
    if (!text.startsWith('(') || !text.endsWith(')')) return false;
    let depth = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') depth++;
        else if (text[i] === ')') depth--;
        if (depth === 0 && i < text.length - 1) return false;
        if (depth < 0) return false;
    }
    return depth === 0;
}

function weightedBody(text) {
    if (!outerParenthesesCover(text)) return null;
    if (/(?:^|\s)\d{1,2}:\d{2}$/.test(text.slice(1, -1))) return null;
    const match = text.match(/^\(([\s\S]*):([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\)$/);
    if (!match) return null;
    return { body: match[1], weight: Number(match[2]) };
}

export function adjustCommaWeight(text, selectionStart, selectionEnd, direction, delta) {
    const ranges = tagRanges(text);
    if (!ranges.length) return null;

    let chosen;
    if (selectionStart === selectionEnd) {
        chosen = ranges.filter(({ rawStart, rawEnd }) =>
            rawStart <= selectionStart && selectionStart <= rawEnd);
        if (!chosen.length) return null;
        chosen = [chosen[0]];
    } else {
        chosen = ranges.filter(({ start, end }) =>
            start < selectionEnd && end > selectionStart);
        if (!chosen.length) return null;
    }

    const start = chosen[0].start;
    const end = chosen[chosen.length - 1].end;
    const selected = text.slice(start, end);
    const existing = weightedBody(selected);
    const body = existing ? existing.body : selected;
    const weight = existing ? existing.weight : 1;
    const next = Number((weight + direction * delta).toFixed(10));
    const replacement = next === 1 ? body : `(${body}:${next})`;
    return { start, end, replacement };
}
