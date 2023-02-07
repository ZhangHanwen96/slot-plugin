export const getStyleTag = (css: string) => {
    const styles = document.createElement("style");
    styles.appendChild(document.createTextNode(css) );
    return styles;
};