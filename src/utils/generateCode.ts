import CryptoJS from 'crypto-js';

function generateRandomNumberString(length: number) {
    return Math.random().toString().substring(2, 2 + length);
}

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
    const hash = CryptoJS.sha256.update(codeVerifier).digest();
    console.log(codeVerifier, "=>", hash, "=>", base64UrlEncode(hash));

    // 将哈希结果进行 Base64 URL 编码
    return base64UrlEncode(hash);
};

function base64URLEncode(str: any) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export function verifier() {
    return generateRandomNumberString(10)
    const random = CryptoJS.randomBytes(32);
    const verifier = base64URLEncode(random);
    console.log("verifier", random, "=>", verifier);

    return verifier
}

export function sha256(buffer: string): string {
    // return createHash('sha256').update(buffer).digest('hex');
    const asciiBuffer = Buffer.from(buffer, 'ascii');
    const sha256 = CryptoJS.sha256.update(asciiBuffer).digest();
    const base = base64URLEncode(sha256);
    console.log("sha256", sha256, "=>", base);


    return base
}

// var challenge = base64URLEncode(sha256(verifier));