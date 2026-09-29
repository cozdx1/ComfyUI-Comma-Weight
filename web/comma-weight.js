import { app } from '../../scripts/app.js';
import { adjustCommaWeight } from './weight-range.js';

app.registerExtension({
    name: 'cozdx1.CommaWeight',
    settings: [{
        id: 'cozdx1.CommaWeight.Enabled',
        name: 'Enable comma-based weight editing',
        type: 'boolean',
        defaultValue: true,
        category: ['Comma-Weight', 'General', 'Enable'],
        tooltip: 'Use Ctrl+Up/Down to adjust whole comma-separated tags, including loosely selected tags.',
    }],
    init() {
        window.addEventListener('keydown', (event) => {
            if ((event.key !== 'ArrowUp' && event.key !== 'ArrowDown') ||
                (!event.ctrlKey && !event.metaKey)) return;
            if (!app.ui.settings.getSettingValue('cozdx1.CommaWeight.Enabled', true)) return;

            const field = event.composedPath()[0];
            if (!(field instanceof HTMLTextAreaElement) || field.readOnly || field.disabled ||
                event.defaultPrevented || event.isComposing) return;

            const configuredDelta = Number(app.ui.settings.getSettingValue('Comfy.EditAttention.Delta', 0.05));
            const delta = configuredDelta > 0 ? configuredDelta : 0.05;
            const direction = event.key === 'ArrowUp' ? 1 : -1;
            const edit = adjustCommaWeight(
                field.value, field.selectionStart, field.selectionEnd, direction, delta);
            if (!edit) return;

            event.preventDefault();
            // Capture before autocomplete widgets and ComfyUI's built-in weight handler.
            event.stopImmediatePropagation();
            const previousValue = field.value;
            field.setSelectionRange(edit.start, edit.end);
            const inserted = document.execCommand('insertText', false, edit.replacement);
            if (!inserted && field.value === previousValue) {
                field.setRangeText(edit.replacement, edit.start, edit.end, 'select');
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
            field.setSelectionRange(edit.start, edit.start + edit.replacement.length);
        }, true);
    },
});
