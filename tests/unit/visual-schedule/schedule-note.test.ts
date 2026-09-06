import { describe, expect, it } from 'vitest';
import { parseScheduleNoteLink } from '../../../src/features/visual-schedule/components/schedule-note';

describe('schedule note links', () => {
    it('keeps ordinary notes as text', () => {
        expect(parseScheduleNoteLink('Mang máy tính vào buổi thực hành.')).toBeNull();
        expect(parseScheduleNoteLink('Tài liệu: https://drive.google.com/file/d/example')).toBeNull();
    });

    it('recognizes a Google Drive folder as an openable note', () => {
        expect(parseScheduleNoteLink('https://drive.google.com/drive/folders/1tlzyeVrfpSeHLNBYIzEcfUEdSbx')).toMatchObject({
            label: 'Mở thư mục Google Drive',
            host: 'drive.google.com',
        });
    });

    it('accepts ordinary https links but rejects unsafe protocols', () => {
        expect(parseScheduleNoteLink('https://example.edu.vn/course-materials')).toMatchObject({
            label: 'Mở liên kết',
            host: 'example.edu.vn',
        });
        expect(parseScheduleNoteLink('javascript:alert(1)')).toBeNull();
    });
});
