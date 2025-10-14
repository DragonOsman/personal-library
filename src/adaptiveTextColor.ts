"use client";

function applyAdaptiveColor(selector: string = ".note") {
  function adjustTextColor(element: HTMLElement) {
    const bgColor = window.getComputedStyle(element.parentElement!).backgroundColor;
    const [r, g, b] = bgColor.match(/\d+/g)!.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim();
    const secondary = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-secondary")
      .trim();

    const adjustedColor =
      brightness < 128
        ? lightenColor(secondary, 60) // lighter on dark backgrounds
        : darkenColor(primary, 40);   // darker on light backgrounds

    element.style.color = adjustedColor;
  }

  function adjustColor(hex: string, amount: number) {
    return (
      "#" +
      hex
        .replace(/^#/, "")
        .replace(/../g, color =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
          ).slice(-2)
        )
    );
  }

  function lightenColor(hex: string, amount: number) {
    return adjustColor(hex, amount);
  }

  function darkenColor(hex: string, amount: number) {
    return adjustColor(hex, -amount);
  }

  document.querySelectorAll(selector).forEach(el => adjustTextColor(el as HTMLElement));
}

applyAdaptiveColor();