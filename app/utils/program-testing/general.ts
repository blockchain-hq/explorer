export const toCamelCase = (str: string) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
