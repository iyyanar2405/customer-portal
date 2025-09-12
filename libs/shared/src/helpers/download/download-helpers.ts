enum HttpHeaders {
  // Text files
  TXT = 'text/plain',
  HTML = 'text/html',
  CSS = 'text/css',
  CSV = 'text/csv',

  // Image files
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
  BMP = 'image/bmp',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',

  // Audio files
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',

  // Video files
  MP4 = 'video/mp4',
  AVI = 'video/x-msvideo',
  MKV = 'video/x-matroska',
  MOV = 'video/quicktime',
  WEBM = 'video/webm',

  // Application files
  JSON = 'application/json',
  XML = 'application/xml',
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ZIP = 'application/zip',
  GZIP = 'application/gzip',
  TAR = 'application/x-tar',
  RAR = 'application/vnd.rar',
  RTF = 'application/rtf',
}

const extensionToContentType: Record<string, HttpHeaders> = {
  TXT: HttpHeaders.TXT,
  HTML: HttpHeaders.HTML,
  CSS: HttpHeaders.CSS,
  CSV: HttpHeaders.CSV,
  JPEG: HttpHeaders.JPEG,
  JPG: HttpHeaders.JPEG,
  PNG: HttpHeaders.PNG,
  GIF: HttpHeaders.GIF,
  BMP: HttpHeaders.BMP,
  SVG: HttpHeaders.SVG,
  WEBP: HttpHeaders.WEBP,
  MP3: HttpHeaders.MP3,
  WAV: HttpHeaders.WAV,
  OGG: HttpHeaders.OGG,
  MP4: HttpHeaders.MP4,
  AVI: HttpHeaders.AVI,
  MKV: HttpHeaders.MKV,
  MOV: HttpHeaders.MOV,
  WEBM: HttpHeaders.WEBM,
  JSON: HttpHeaders.JSON,
  XML: HttpHeaders.XML,
  PDF: HttpHeaders.PDF,
  DOC: HttpHeaders.DOC,
  DOCX: HttpHeaders.DOCX,
  XLS: HttpHeaders.XLS,
  XLSX: HttpHeaders.XLSX,
  PPT: HttpHeaders.PPT,
  PPTX: HttpHeaders.PPTX,
  ZIP: HttpHeaders.ZIP,
  GZIP: HttpHeaders.GZIP,
  TAR: HttpHeaders.TAR,
  RAR: HttpHeaders.RAR,
  RTF: HttpHeaders.RTF,
};

export const getContentType = (
  filename: string,
  hasExtension = false,
): string => {
  const extension = filename.split('.').pop();
  const transformedExtension = extension ? extension.toUpperCase() : undefined;

  if (
    !transformedExtension ||
    !(transformedExtension in extensionToContentType)
  ) {
    throw new Error('Invalid or unsupported file extension');
  }

  if (hasExtension && extension) {
    return extension;
  }

  return extensionToContentType[transformedExtension];
};

export const decodeDownloadFileName = (fileName: string): string => {
  let decodedFileName = fileName;

  if (decodedFileName.startsWith("UTF-8''")) {
    decodedFileName = decodedFileName.substring(7);
  }

  try {
    return decodeURIComponent(decodedFileName);
  } catch {
    return decodedFileName;
  }
};

export const downloadFromByteArray = (inputArray: any, fileName: string) => {
  const file = new Blob([inputArray.body], {
    type: getContentType(fileName),
  });

  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const animateFlyToDownload = (sourceEl: HTMLElement) => {
  let targetIcon = document.querySelector(
    '.download-nav-icon.pi-spin',
  ) as HTMLElement;
  let targetRect: DOMRect | null = null;
  let iconFontSize = 15;
  let iconColor = '#0f204b';

  if (targetIcon) {
    targetRect = targetIcon.getBoundingClientRect();
    const computed = window.getComputedStyle(targetIcon);
    iconFontSize = parseInt(computed.fontSize, 10) || 15;
    iconColor = computed.color || '#0f204b';
  } else {
    targetIcon = document.querySelector('.download-nav-icon') as HTMLElement;

    if (targetIcon) {
      targetRect = targetIcon.getBoundingClientRect();
      const computed = window.getComputedStyle(targetIcon);
      iconFontSize = parseInt(computed.fontSize, 10) || 15;
      iconColor = computed.color || '#0f204b';
    } else {
      const settingsBtn = document.querySelector(
        'customer-portal-navbar-settings',
      ) as HTMLElement;

      if (settingsBtn) {
        const settingsRect = settingsBtn.getBoundingClientRect();
        targetRect = {
          left: settingsRect.left - 80,
          top: settingsRect.top,
          width: 24,
          height: 24,
          right: settingsRect.left - 36,
          bottom: settingsRect.top + 24,
          x: settingsRect.left - 60,
          y: settingsRect.top,
          toJSON: () => {},
        } as DOMRect;
      } else {
        targetRect = {
          left: window.innerWidth - 120,
          top: 20,
          width: 24,
          height: 24,
          right: window.innerWidth - 96,
          bottom: 44,
          x: window.innerWidth - 120,
          y: 20,
          toJSON: () => {},
        } as DOMRect;
      }
    }
  }

  if (!targetRect) {
    return;
  }

  const sourceRect = sourceEl.getBoundingClientRect();

  const startX = sourceRect.left + sourceRect.width / 2 - iconFontSize / 2 + 20;
  const startY = sourceRect.top + sourceRect.height / 2 - iconFontSize / 2;
  const endX = targetRect.left + targetRect.width / 2 - iconFontSize / 2 + 38;
  const endY = targetRect.top + targetRect.height / 2 - iconFontSize / 2;

  const flyIcon = document.createElement('i');
  flyIcon.className = 'pi pi-download fly-download-anim';

  flyIcon.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    font-size: ${iconFontSize}px;
    color: ${iconColor};
    z-index: 9999;
    pointer-events: none;
    opacity: 1;
    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.18);
    border-radius: 50%;
    background: #e0e0e0;
    transform: scale(1) translate(0, 0);
    transition: transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.9s cubic-bezier(0.4,0,0.2,1);
  `;

  document.body.appendChild(flyIcon);

  setTimeout(() => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    flyIcon.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.2)`;
    flyIcon.style.opacity = '1';
  }, 50);

  const cleanup = () => {
    setTimeout(() => {
      flyIcon.style.transition =
        'transform 0.35s cubic-bezier(0.4,2,0.2,1), opacity 0.35s';
      flyIcon.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.2)`;
      flyIcon.style.opacity = '0';

      setTimeout(() => {
        if (flyIcon.parentNode) {
          flyIcon.parentNode.removeChild(flyIcon);
        }
      }, 350);
    }, 50);
  };

  flyIcon.addEventListener('transitionend', cleanup, { once: true });

  setTimeout(cleanup, 1200);
};
