import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryStylesService {
  private renderer: Renderer2;
  private styleElements: Map<string, HTMLStyleElement> = new Map();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setGradientStyles(key: string, gradients: { [key: string]: string }): void {
    this.removeStyles(key);

    const styles = this.generateGradientStyles(gradients);

    const styleElement = this.renderer.createElement('style');
    this.renderer.setAttribute(styleElement, 'id', `dynamic-styles-${key}`);
    const textNode = this.renderer.createText(styles);
    this.renderer.appendChild(styleElement, textNode);

    this.renderer.appendChild(document.head, styleElement);

    this.styleElements.set(key, styleElement);
  }

  cleanup(key: string): void {
    this.removeStyles(key);
  }

  private generateGradientStyles(gradients: { [key: string]: string }): string {
    return Object.entries(gradients)
      .map(([category, color]) => {
        const className = this.getSafeClassName(category);
        const textColor = this.getContrastingTextColor(color);

        return `
          .category-${className} {
            background-color: ${color};
            border: 2px solid #ffffff;
            border-radius: 20px;
            box-shadow: 0px 0px 2px 1px #e6e6e5;
            padding: 6px 12px;
            color: ${textColor} !important;
            font-weight: 700;
          }
          .category-${className}.clickable-cell {
            cursor: pointer;
          }
          .category-${className}.clickable-cell:hover {
            box-shadow: 0px 1px 12px 0px #9c9a96;
            cursor: pointer;
          }
        `;
      })
      .join('\n');
  }

  private getContrastingTextColor(backgroundColor: string): string {
    const hex = backgroundColor.replace('#', '');

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq < 128 ? '#ffffff' : '#000000';
  }

  private removeStyles(key: string): void {
    const existingElement = this.styleElements.get(key);

    if (existingElement && existingElement.parentNode) {
      this.renderer.removeChild(document.head, existingElement);
      this.styleElements.delete(key);
    }
  }

  private getSafeClassName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
