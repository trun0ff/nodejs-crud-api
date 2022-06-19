const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;

const isValidUuid = (str) => {
    if(!str.length) {
        return false;
    }
    return regexExp.test(str);
};

export {isValidUuid};