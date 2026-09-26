// SVG icon components — minimal, consistent, no emoji
import type { SVGProps } from 'react';

// Codicon font-based icon (uses @vscode/codicons)
interface CodiconProps {
  name: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}
export const Codicon = ({ name, size = 16, style, className }: CodiconProps) => (
  <i
    className={`codicon codicon-${name}${className ? ` ${className}` : ''}`}
    style={{ fontSize: size, lineHeight: 1, display: 'inline-block', ...style }}
    aria-hidden="true"
  />
);

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const Icon = ({ size = 16, children, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);

export const IconFolder = (p: IconProps) => (
  <Icon {...p}>
    <path d="M1.5 3.5A1 1 0 0 1 2.5 2.5h4l1 1.5h6a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V3.5z" fill="currentColor" opacity=".8"/>
  </Icon>
);

export const IconFolderOpen = (p: IconProps) => (
  <Icon {...p}>
    <path d="M1.5 4.5A1 1 0 0 1 2.5 3.5h4l1 1.5h5.5a1 1 0 0 1 1 1H1.5V4.5z" fill="currentColor" opacity=".6"/>
    <path d="M1 7h13l-1.5 5a1 1 0 0 1-1 .75H2.5a1 1 0 0 1-1-.75L1 7z" fill="currentColor" opacity=".9"/>
  </Icon>
);

export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 3.5l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 5.5l4.5 5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconChevronLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.5 3.5l-5 4.5 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconFile = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 2h7l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconSettings = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconGitBranch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="5" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="11" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 5.5v5M5 5.5q0-3 6-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M11 5.5v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconExtensions = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="1.5" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="1.5" y="9" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="9" width="5.5" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
  </Icon>
);

export const IconTerminal = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M4 6l3 2.5-3 2.5M8.5 11h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconProblems = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconOutput = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M4.5 6.5h7M4.5 8.5h5M4.5 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconPreview = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1.5 5.5h13" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="3.5" cy="4" r=".7" fill="currentColor"/>
    <circle cx="5.5" cy="4" r=".7" fill="currentColor"/>
    <circle cx="7.5" cy="4" r=".7" fill="currentColor"/>
  </Icon>
);

export const IconApi = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 8h3M11 8h3M5.5 4l-3 4 3 4M10.5 4l3 4-3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
  </Icon>
);

export const IconDatabase = (p: IconProps) => (
  <Icon {...p}>
    <ellipse cx="8" cy="4.5" rx="5.5" ry="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2.5 4.5v7c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2v-7" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2.5 8c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2" stroke="currentColor" strokeWidth="1.3"/>
  </Icon>
);

export const IconEnv = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 3h10M3 6h7M3 9h5M3 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M12 8v1.3M12 11.7V13M10.1 9.1l.9.9M13.1 12.1l-.9-.9M9.5 10.5h1.3M14.5 10.5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </Icon>
);

export const IconPackage = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 1.5L14 4.5v7L8 14.5 2 11.5v-7L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M8 1.5v13M2 4.5l6 3 6-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5 3l6 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconPlay = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 3l10 5-10 5V3z" fill="currentColor"/>
  </Icon>
);

export const IconStop = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="10" height="10" rx="1" fill="currentColor"/>
  </Icon>
);

export const IconRefresh = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 8A5 5 0 1 1 8 3h3l-2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 1v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconMinus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconTrash = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 4h11M5 4V2.5h6V4M6 7v4.5M10 7v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M3.5 4l.8 9a.5.5 0 0 0 .5.5h6.4a.5.5 0 0 0 .5-.5l.8-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconPencil = (p: IconProps) => (
  <Icon {...p}>
    <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M9.5 3.5l3 3" stroke="currentColor" strokeWidth="1.3"/>
  </Icon>
);

export const IconCopy = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="5" width="8.5" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M4 11H2.5A1 1 0 0 1 1.5 10V2.5A1 1 0 0 1 2.5 1.5H10a1 1 0 0 1 1 1V4" stroke="currentColor" strokeWidth="1.3"/>
  </Icon>
);

export const IconPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.5 1.5l5 5-3 3-1-1L7 12l-1-1 1-1-4-4 1-1 4 4 1-1L7.5 8l3-3-1-1z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    <path d="M3 13l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconSplitHorizontal = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1.5v13" stroke="currentColor" strokeWidth="1.3"/>
  </Icon>
);

export const IconTypeScript = (p: IconProps) => (
  <Icon size={p.size} {...p}>
    <rect width="16" height="16" rx="2" fill="#3178C6"/>
    <path d="M3 9h3.5a1.5 1.5 0 1 1 0 3H5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M9 8h4M11 8v5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
  </Icon>
);

export const IconJavaScript = (p: IconProps) => (
  <Icon {...p}>
    <rect width="16" height="16" rx="2" fill="#F7DF1E"/>
    <path d="M5.5 8v4a1.5 1.5 0 0 0 3 0M10.5 8c0 0 0 0 1.5 0a1.5 1.5 0 0 1 0 3c-1.5 0-1.5 1-1.5 1.5" stroke="#000" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconReact = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="1.5" fill="#61DAFB"/>
    <ellipse cx="8" cy="8" rx="6.5" ry="2.5" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
    <ellipse cx="8" cy="8" rx="6.5" ry="2.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 8 8)"/>
    <ellipse cx="8" cy="8" rx="6.5" ry="2.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 8 8)"/>
  </Icon>
);

export const IconJson = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 3.5C3 3.5 2 4 2 5.5V7a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1.5C2 12 3 12.5 4 12.5M12 3.5c1 0 2 .5 2 2V7a1 1 0 0 0 1 1 1 1 0 0 0-1 1v1.5c0 1.5-1 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="6.5" cy="8" r=".7" fill="currentColor"/>
    <circle cx="8" cy="8" r=".7" fill="currentColor"/>
    <circle cx="9.5" cy="8" r=".7" fill="currentColor"/>
  </Icon>
);

export const IconHtml = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 2l1 11 5 2 5-2 1-11H2z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    <path d="M5 6h6l-.5 3.5-2.5.75-2.5-.75" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconCss = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 2l1 12 5 1.5L13 14l1-12H2z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    <path d="M5 5.5h5.5l-.5 3-2 .5-2-.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconMarkdown = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.5" y="3" width="13" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4 9.5V6.5l2 2 2-2v3M11.5 8.5L10 10M11.5 8.5L13 10M11.5 6.5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconExternalLink = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M10 2h4v4M14 2L8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconInfo = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 7.5v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconWarning = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2L15 13H1L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M8 6.5v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconError = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </Icon>
);

export const IconSuccess = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 8l2.5 2.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconMenuHorizontal = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="4" cy="8" r="1.3" fill="currentColor"/>
    <circle cx="8" cy="8" r="1.3" fill="currentColor"/>
    <circle cx="12" cy="8" r="1.3" fill="currentColor"/>
  </Icon>
);

export const IconUndo = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8A5 5 0 1 1 8 13H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M3 5v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </Icon>
);

export const IconSave = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 1.5h8.5L13.5 3.5v11a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V2a.5.5 0 0 1 .5-.5z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <path d="M6 1.5v4.5h5V1.5M6.5 11a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
  </Icon>
);

export const IconTypescript2 = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 10V6M2 8h4M8 6v4M8 6c0 0 4 0 4 0M12 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </Icon>
);

export const IconCommand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 5a2 2 0 1 0-2 2h2V5zM5 11a2 2 0 1 0 2 2v-2H5zM11 5a2 2 0 1 0 2-2v2h-2zM11 11a2 2 0 1 0-2-2v2h2z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <path d="M5 5h6v6H5z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
  </Icon>
);

export const IconVSWeb = (p: IconProps) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 18 18" fill="none" {...p}>
    <rect width="18" height="18" rx="3" fill="var(--accent)"/>
    <path d="M3 5l4 8 2-4 2 4 4-8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// File icon mapping
export function getFileIcon(filename: string, isOpen = false): React.ReactNode {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const base = filename.toLowerCase();

  if (base === 'package.json' || base === 'package-lock.json') return <IconPackage size={14} style={{ color: '#e2a94b' }}/>;
  if (base === 'tsconfig.json' || base.startsWith('tsconfig')) return <IconTypeScript size={14}/>;
  if (base === 'vite.config.ts' || base === 'vite.config.js') return <IconFile size={14} style={{ color: '#bd34fe' }}/>;
  if (base === '.gitignore' || base === '.gitattributes') return <IconGitBranch size={14} style={{ color: '#f14e32' }}/>;
  if (base === '.env' || base.startsWith('.env.')) return <IconEnv size={14} style={{ color: '#eab308' }}/>;
  if (base === 'readme.md') return <IconMarkdown size={14} style={{ color: '#42a5f5' }}/>;

  switch (ext) {
    case 'ts': return <IconTypeScript size={14}/>;
    case 'tsx': return <IconReact size={14}/>;
    case 'js': case 'mjs': case 'cjs': return <IconJavaScript size={14}/>;
    case 'jsx': return <IconReact size={14}/>;
    case 'json': case 'jsonc': return <IconJson size={14}/>;
    case 'html': case 'htm': return <IconHtml size={14} style={{ color: '#e34c26' }}/>;
    case 'css': return <IconCss size={14} style={{ color: '#563d7c' }}/>;
    case 'scss': case 'sass': return <IconCss size={14} style={{ color: '#c6538c' }}/>;
    case 'md': case 'mdx': return <IconMarkdown size={14} style={{ color: '#42a5f5' }}/>;
    default: return isOpen ? <IconFolderOpen size={14} style={{ color: '#e8c07d' }}/> : <IconFolder size={14} style={{ color: '#e8c07d' }}/>;
  }
}
