import { db } from './firebase.js';
import { collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

/**
 * 生成隨機的 6 位代碼 (大寫字母與數字)
 */
function generateShortCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字元 I, O, 1, 0
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * 發佈新的自訂詞庫
 * @param {string} title 詞庫標題
 * @param {string[]} words 詞彙陣列
 * @param {string} author 老師姓名
 * @returns {Promise<string>} 返回產生的短代碼
 */
export async function publishWordset(title, words, author = "老師") {
    if (!words || words.length === 0) throw new Error("詞庫不能為空");

    const shortCode = generateShortCode();
    const wordsetRef = doc(db, "customWordsets", shortCode);

    await setDoc(wordsetRef, {
        title,
        words,
        author,
        createdAt: serverTimestamp()
    });

    return shortCode;
}

/**
 * 根據代碼抓取自訂詞庫
 * @param {string} shortCode 
 * @returns {Promise<Object|null>}
 */
export async function fetchWordset(shortCode) {
    if (!shortCode) return null;
    const wordsetRef = doc(db, "customWordsets", shortCode.toUpperCase());
    const docSnap = await getDoc(wordsetRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.error("找不到該詞庫代碼:", shortCode);
        return null;
    }
}
