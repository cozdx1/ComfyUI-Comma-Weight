import assert from 'node:assert/strict';
import test from 'node:test';
import { adjustCommaWeight } from '../web/weight-range.js';

function edit(text, selectionStart, selectionEnd = selectionStart, direction = 1, delta = 0.2) {
    const result = adjustCommaWeight(text, selectionStart, selectionEnd, direction, delta);
    assert.ok(result);
    return text.slice(0, result.start) + result.replacement + text.slice(result.end);
}

test('cursor inside a multiword or underscored tag selects the whole comma-delimited tag', () => {
    assert.equal(edit('looking at viewer, black hair', 12), '(looking at viewer:1.2), black hair');
    assert.equal(edit('looking_at_viewer, black hair', 8), '(looking_at_viewer:1.2), black hair');
});

test('rough selection across tags expands to both comma boundaries', () => {
    const text = 'blue eyes, black hair, long hair, smile';
    assert.equal(edit(text, text.indexOf('hair'), text.indexOf('long') + 2),
        'blue eyes, (black hair, long hair:1.2), smile');
});

test('repeated shortcuts adjust an existing group and unwrap at weight one', () => {
    const grouped = '(black hair, long hair:1.2), smile';
    assert.equal(edit(grouped, 8), '(black hair, long hair:1.4), smile');
    assert.equal(edit(grouped, 8, 8, -1), 'black hair, long hair, smile');
});

test('line breaks keep unrelated lines out of a selection', () => {
    const text = 'black hair, long hair\nblue eyes, smile';
    assert.equal(edit(text, 8, 17), '(black hair, long hair:1.2)\nblue eyes, smile');
});

test('commas inside parentheses remain part of one tag', () => {
    const text = '(red hair, blue eyes:1.2), smile';
    assert.equal(edit(text, 12), '(red hair, blue eyes:1.4), smile');
});

test('empty comma fields are ignored', () => {
    assert.equal(adjustCommaWeight('one, ,two', 5, 5, 1, 0.2), null);
});
