import CryptoJS from 'crypto-js';

export const generateCodeVerifier = (): string => {
    // 生成一个随机的 code_verifier
    const codeVerifier = generateRandomNumberString(10)
    return codeVerifier;
};

const base64UrlEncode = (str: Buffer): string => {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const generateCodeChallenge = (codeVerifier: string): string => {
    // 使用 SHA-256 对 code_verifier 进行哈希处理
    const hash = CryptoJS.SHA256(codeVerifier);
    const hashInBase64 = hash.toString(CryptoJS.enc.Base64);
    const hashBuffer = Buffer.from(hashInBase64, 'base64');
    console.log(codeVerifier, "=>", hashInBase64, "=>", base64UrlEncode(hashBuffer));

    // 将哈希结果进行 Base64 URL 编码
    return base64UrlEncode(hashBuffer);
};

function base64URLEncode(str: any) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function generateRandomNumberString(length: number): string {
    const randomArray = CryptoJS.lib.WordArray.random(length);
    return randomArray.toString(CryptoJS.enc.Hex);
}

export function verifier() {
    return generateRandomNumberString(10)
    const random = generateRandomNumberString(32);
    const verifier = base64URLEncode(random);
    console.log("verifier", random, "=>", verifier);

    return verifier
}

export function sha256(buffer: string): string {
    const asciiBuffer = Buffer.from(buffer, 'ascii');
    const wordArray = CryptoJS.lib.WordArray.create(asciiBuffer);
    const sha256 = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Base64);
    const base = base64UrlEncode(Buffer.from(sha256, 'base64'));
    console.log("sha256", sha256, "=>", base);

    return base;
}

// var challenge = base64URLEncode(sha256(verifier));