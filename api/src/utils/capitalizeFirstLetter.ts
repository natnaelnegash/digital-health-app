// capitalizeNames
export const capitalizeName = (name: string): string => {
    return name.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Capitalize first letter of a string
export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};