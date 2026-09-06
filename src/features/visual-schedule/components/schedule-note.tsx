import { ExternalLink, FileText, FolderOpen, Link2, MessageSquare, type LucideIcon } from 'lucide-react';

export type ScheduleNoteLink = {
    href: string;
    label: string;
    host: string;
    icon: LucideIcon;
};

/** Only a note made entirely of one safe web URL becomes an external action. */
export function parseScheduleNoteLink(note: string): ScheduleNoteLink | null {
    const value = note.trim();
    if (!/^https?:\/\/\S+$/i.test(value)) return null;

    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

        const host = url.hostname.replace(/^www\./i, '');
        const path = url.pathname.toLowerCase();

        if (host === 'drive.google.com') {
            return {
                href: url.href,
                label: path.includes('/folders/') ? 'Mở thư mục Google Drive' : 'Mở tệp trên Google Drive',
                host,
                icon: path.includes('/folders/') ? FolderOpen : FileText,
            };
        }

        if (['docs.google.com', 'sheets.google.com', 'slides.google.com'].includes(host)) {
            return { href: url.href, label: 'Mở tài liệu Google', host, icon: FileText };
        }

        return { href: url.href, label: 'Mở liên kết', host, icon: Link2 };
    } catch {
        return null;
    }
}

export function ScheduleNote({ note }: { note: string }) {
    const link = parseScheduleNoteLink(note);

    if (!link) {
        return (
            <div className="ustudy-schedule-note-text">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                <p>{note}</p>
            </div>
        );
    }

    const Icon = link.icon;
    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ustudy-schedule-note-link"
            aria-label={`${link.label}: ${link.host}`}
        >
            <span className="ustudy-schedule-note-link-icon">
                <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">{link.label}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{link.host}</span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-[#004A98]" aria-hidden="true" />
        </a>
    );
}
