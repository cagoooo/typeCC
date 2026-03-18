import { db, auth } from './firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp
} from "firebase/firestore";

const LEADERBOARD_COLLECTION = "leaderboard";

/**
 * 儲存分數到 Firestore
 * @param {string} name 玩家名稱
 * @param {number} score 分數
 * @param {string} difficulty 難度
 */
export async function saveScore(name, score, difficulty) {
    if (!auth.currentUser) return;

    try {
        await addDoc(collection(db, LEADERBOARD_COLLECTION), {
            name,
            score,
            difficulty,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });
        console.log("Score saved successfully");
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

/**
 * 獲取排行榜資料
 * @param {string} difficulty 篩選難度 (可選)
 * @param {number} maxResults 最大筆數
 */
export async function getTopScores(difficulty = null, maxResults = 10) {
    try {
        let q = query(
            collection(db, LEADERBOARD_COLLECTION),
            orderBy("score", "desc"),
            limit(maxResults)
        );

        // 注意：Firestore 若要混合篩選與排序，通常需要建立索引。
        // 這裡先簡單實作全域排行，或在前端篩選。

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting scores:", error);
        return [];
    }
}
