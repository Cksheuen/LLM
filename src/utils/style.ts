export const getRemValue = () => {
    const rootFontSize = window.getComputedStyle(document.documentElement).fontSize;
    return parseFloat(rootFontSize);
};
