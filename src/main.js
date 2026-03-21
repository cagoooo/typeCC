import './style.css';
import { audio } from './audio.js';

import { auth, signInAnonymously } from './firebase.js';
import { saveScore, getTopScores } from './leaderboard.js';
import { publishWordset, fetchWordset } from './teacher.js';

const bopomofoKeyMap = {
    'ㄅ': '1', 'ㄆ': 'q', 'ㄇ': 'a', 'ㄈ': 'z', 'ㄉ': '2', 'ㄊ': 'w', 'ㄋ': 's', 'ㄌ': 'x',
    'ㄍ': 'e', 'ㄎ': 'd', 'ㄏ': 'c', 'ㄐ': 'r', 'ㄑ': 'f', 'ㄒ': 'v', 'ㄓ': '5', 'ㄔ': 't',
    'ㄕ': 'g', 'ㄖ': 'b', 'ㄗ': 'y', 'ㄘ': 'h', 'ㄙ': 'n', 'ㄧ': 'u', 'ㄨ': 'j', 'ㄩ': 'm',
    'ㄚ': '8', 'ㄛ': 'i', 'ㄜ': 'k', 'ㄝ': ',', 'ㄞ': '9', 'ㄟ': 'o', 'ㄠ': 'l', 'ㄡ': '.',
    'ㄢ': '0', 'ㄣ': 'p', 'ㄤ': ';', 'ㄥ': '/', 'ㄦ': '-',
    'ˊ': '6', 'ˇ': '3', 'ˋ': '4', '˙': '7'
};

const characterData = [
    { char: '的', bopomofo: 'ㄉㄜ˙' }, { char: '一', bopomofo: 'ㄧ' }, { char: '是', bopomofo: 'ㄕˋ' }, { char: '不', bopomofo: 'ㄅㄨˋ' },
    { char: '了', bopomofo: 'ㄌㄜ˙' }, { char: '有', bopomofo: 'ㄧㄡˇ' }, { char: '和', bopomofo: 'ㄏㄜˊ' }, { char: '人', bopomofo: 'ㄖㄣˊ' },
    { char: '這', bopomofo: 'ㄓㄜˋ' }, { char: '中', bopomofo: 'ㄓㄨㄥ' }, { char: '大', bopomofo: 'ㄉㄚˋ' }, { char: '為', bopomofo: 'ㄨㄟˊ' },
    { char: '上', bopomofo: 'ㄕㄤˋ' }, { char: '個', bopomofo: 'ㄍㄜˋ' }, { char: '國', bopomofo: 'ㄍㄨㄛˊ' }, { char: '我', bopomofo: 'ㄨㄛˇ' },
    { char: '以', bopomofo: 'ㄧˇ' }, { char: '要', bopomofo: 'ㄧㄠˋ' }, { char: '他', bopomofo: 'ㄊㄚ' }, { char: '時', bopomofo: 'ㄕˊ' },
    { char: '來', bopomofo: 'ㄌㄞˊ' }, { char: '用', bopomofo: 'ㄩㄥˋ' }, { char: '們', bopomofo: 'ㄇㄣ˙' }, { char: '生', bopomofo: 'ㄕㄥ' },
    { char: '到', bopomofo: 'ㄉㄠˋ' }, { char: '作', bopomofo: 'ㄗㄨㄛˋ' }, { char: '地', bopomofo: 'ㄉㄧˋ' }, { char: '於', bopomofo: 'ㄩˊ' },
    { char: '出', bopomofo: 'ㄔㄨ' }, { char: '就', bopomofo: 'ㄐㄧㄡˋ' }, { char: '分', bopomofo: 'ㄈㄣ' }, { char: '對', bopomofo: 'ㄉㄨㄟˋ' },
    { char: '成', bopomofo: 'ㄔㄥˊ' }, { char: '會', bopomofo: 'ㄏㄨㄟˋ' }, { char: '可', bopomofo: 'ㄎㄜˇ' }, { char: '主', bopomofo: 'ㄓㄨˇ' },
    { char: '發', bopomofo: 'ㄈㄚ' }, { char: '年', bopomofo: 'ㄋㄧㄢˊ' }, { char: '動', bopomofo: 'ㄉㄨㄥˋ' }, { char: '同', bopomofo: 'ㄊㄨㄥˊ' },
    { char: '工', bopomofo: 'ㄍㄨㄥ' }, { char: '也', bopomofo: 'ㄧㄝˇ' }, { char: '能', bopomofo: 'ㄋㄥˊ' }, { char: '下', bopomofo: 'ㄒㄧㄚˋ' },
    { char: '過', bopomofo: 'ㄍㄨㄛˋ' }, { char: '子', bopomofo: 'ㄗˇ' }, { char: '說', bopomofo: 'ㄕㄨㄛ' }, { char: '產', bopomofo: 'ㄔㄢˇ' },
    { char: '種', bopomofo: 'ㄓㄨㄥˇ' }, { char: '面', bopomofo: 'ㄇㄧㄢˋ' }, { char: '而', bopomofo: 'ㄦˊ' }, { char: '方', bopomofo: 'ㄈㄤ' },
    { char: '後', bopomofo: 'ㄏㄡˋ' }, { char: '多', bopomofo: 'ㄉㄨㄛ' }, { char: '定', bopomofo: 'ㄉㄧㄥˋ' }, { char: '行', bopomofo: 'ㄒㄧㄥˊ' },
    { char: '學', bopomofo: 'ㄒㄩㄝˊ' }, { char: '法', bopomofo: 'ㄈㄚˇ' }, { char: '所', bopomofo: 'ㄙㄨㄛˇ' }, { char: '民', bopomofo: 'ㄇㄧㄣˊ' },
    { char: '得', bopomofo: 'ㄉㄜˊ' }, { char: '經', bopomofo: 'ㄐㄧㄥ' }, { char: '十', bopomofo: 'ㄕˊ' }, { char: '三', bopomofo: 'ㄙㄢ' },
    { char: '之', bopomofo: 'ㄓ' }, { char: '進', bopomofo: 'ㄐㄧㄣˋ' }, { char: '著', bopomofo: 'ㄓㄜ˙' }, { char: '等', bopomofo: 'ㄉㄥˇ' },
    { char: '部', bopomofo: 'ㄅㄨˋ' }, { char: '度', bopomofo: 'ㄉㄨˋ' }, { char: '家', bopomofo: 'ㄐㄧㄚ' }, { char: '電', bopomofo: 'ㄉㄧㄢˋ' },
    { char: '力', bopomofo: 'ㄌㄧˋ' }, { char: '裡', bopomofo: 'ㄌㄧˇ' }, { char: '如', bopomofo: 'ㄖㄨˊ' }, { char: '水', bopomofo: 'ㄕㄨㄟˇ' },
    { char: '化', bopomofo: 'ㄏㄨㄚˋ' }, { char: '高', bopomofo: 'ㄍㄠ' }, { char: '自', bopomofo: 'ㄗˋ' }, { char: '二', bopomofo: 'ㄦˋ' },
    { char: '理', bopomofo: 'ㄌㄧˇ' }, { char: '起', bopomofo: 'ㄑㄧˇ' }, { char: '小', bopomofo: 'ㄒㄧㄠˇ' }, { char: '物', bopomofo: 'ㄨˋ' },
    { char: '現', bopomofo: 'ㄒㄧㄢˋ' }, { char: '實', bopomofo: 'ㄕˊ' }, { char: '加', bopomofo: 'ㄐㄧㄚ' }, { char: '量', bopomofo: 'ㄌㄧㄤˋ' },
    { char: '都', bopomofo: 'ㄉㄡ' }, { char: '兩', bopomofo: 'ㄌㄧㄤˇ' }, { char: '體', bopomofo: 'ㄊㄧˇ' }, { char: '制', bopomofo: 'ㄓˋ' },
    { char: '機', bopomofo: 'ㄐㄧ' }, { char: '當', bopomofo: 'ㄉㄤ' }, { char: '使', bopomofo: 'ㄕˇ' }, { char: '點', bopomofo: 'ㄉㄧㄢˇ' },
    { char: '從', bopomofo: 'ㄘㄨㄥˊ' }, { char: '業', bopomofo: 'ㄧㄝˋ' }, { char: '本', bopomofo: 'ㄅㄣˇ' }, { char: '去', bopomofo: 'ㄑㄩˋ' },
    { char: '把', bopomofo: 'ㄅㄚˇ' }, { char: '長', bopomofo: 'ㄓㄤˇ' }, { char: '見', bopomofo: 'ㄐㄧㄢˋ' }, { char: '己', bopomofo: 'ㄐㄧˇ' },
    { char: '重', bopomofo: 'ㄓㄨㄥˋ' }, { char: '此', bopomofo: 'ㄘˇ' }, { char: '間', bopomofo: 'ㄐㄧㄢ' }, { char: '向', bopomofo: 'ㄒㄧㄤˋ' },
    { char: '道', bopomofo: 'ㄉㄠˋ' }, { char: '命', bopomofo: 'ㄇㄧㄥˋ' }, { char: '想', bopomofo: 'ㄒㄧㄤˇ' }, { char: '情', bopomofo: 'ㄑㄧㄥˊ' },
    { char: '事', bopomofo: 'ㄕˋ' }, { char: '知', bopomofo: 'ㄓ' }, { char: '者', bopomofo: 'ㄓㄜˇ' }, { char: '給', bopomofo: 'ㄍㄟˇ' },
    { char: '次', bopomofo: 'ㄘˋ' }, { char: '你', bopomofo: 'ㄋㄧˇ' }, { char: '好', bopomofo: 'ㄏㄠˇ' }, { char: '朋', bopomofo: 'ㄆㄥˊ' },
    { char: '友', bopomofo: 'ㄧㄡˇ' }, { char: '她', bopomofo: 'ㄊㄚ' }, { char: '快', bopomofo: 'ㄎㄨㄞˋ' }, { char: '樂', bopomofo: 'ㄌㄜˋ' },
    { char: '愛', bopomofo: 'ㄞˋ' }, { char: '光', bopomofo: 'ㄍㄨㄤ' }, { char: '風', bopomofo: 'ㄈㄥ' }, { char: '花', bopomofo: 'ㄏㄨㄚ' },
    { char: '山', bopomofo: 'ㄕㄢ' }, { char: '天', bopomofo: 'ㄊㄧㄢ' }, { char: '鳥', bopomofo: 'ㄋㄧㄠˇ' },
    { char: '魚', bopomofo: 'ㄩˊ' }, { char: '書', bopomofo: 'ㄕㄨ' }, { char: '看', bopomofo: 'ㄎㄢˋ' }, { char: '聽', bopomofo: 'ㄊㄧㄥ' },
    // 擴充詞庫
    { char: '你好', bopomofo: 'ㄋㄧˇㄏㄠˇ' }, { char: '謝謝', bopomofo: 'ㄒㄧㄝˋㄒㄧㄝˋ' }, { char: '台灣', bopomofo: 'ㄊㄞˊㄨㄢ' },
    { char: '電腦', bopomofo: 'ㄉㄧㄢˋㄋㄠˇ' }, { char: '手機', bopomofo: 'ㄕㄡˇㄐㄧ' }, { char: '打字', bopomofo: 'ㄉㄚˇㄗˋ' },
    { char: '遊戲', bopomofo: 'ㄧㄡˊㄒㄧˋ' }, { char: '工程師', bopomofo: 'ㄍㄨㄥㄔㄥˊㄕ' }, { char: '人工智慧', bopomofo: 'ㄖㄣˊㄍㄨㄥㄓˋㄏㄨㄟˋ' },
    { char: '一馬當先', bopomofo: 'ㄧㄇㄚˇㄉㄤㄒㄧㄢ' }, { char: '心想事成', bopomofo: 'ㄒㄧㄣㄒㄧㄤˇㄕˋㄔㄥˊ' },
    { char: '萬事如意', bopomofo: 'ㄨㄢˋㄕˋㄖㄨˊㄧˋ' }, { char: '大吉大利', bopomofo: 'ㄉㄚˋㄐㄧˊㄉㄚˋㄌㄧˋ' }
];

let currentDifficulty = 'easy';
const difficultySettings = {
    beginner: { minDuration: 25, maxDuration: 40, spawnInterval: 7000, showKeys: true, showBopomofo: true, scoreMult: 0.5 },
    easy: { minDuration: 12, maxDuration: 18, spawnInterval: 3000, showKeys: true, showBopomofo: true, scoreMult: 1 },
    medium: { minDuration: 9, maxDuration: 14, spawnInterval: 2000, showKeys: false, showBopomofo: true, scoreMult: 1.5 },
    hard: { minDuration: 5, maxDuration: 10, spawnInterval: 1200, showKeys: false, showBopomofo: false, scoreMult: 2.5 }
};

function convertBopomofoToEnglish(bopomofo) {
    const tones = ['ˊ', 'ˇ', 'ˋ', '˙'];
    let keyString = '';
    let hasTone = false;
    for (const char of bopomofo) {
        if (bopomofoKeyMap[char]) {
            keyString += bopomofoKeyMap[char];
            if (tones.includes(char)) {
                hasTone = true;
            }
        }
    }
    if (!hasTone) {
        keyString += ' '; // 一聲以空白鍵結尾
    }
    return keyString;
}

let characterDataWithKeys = characterData.map(data => ({
    ...data,
    englishKeys: convertBopomofoToEnglish(data.bopomofo)
}));

/**
 * 注入外部詞庫
 * @param {string[]} words 
 */
function injectWordset(words) {
    if (!words || words.length === 0) return;

    // 簡單的注音預判邏輯 (暫時僅支援單字與簡單詞彙)
    // 這裡我們需要一個對應表，如果是外部輸入，我們可能需要串接 API 取得注音
    // 目前先假設詞庫包含在 characterData 中的字，或提示使用者手動對齊
    // [優化目標] 未來整合 API 自動轉換注音

    const newCharacterData = words.map(w => {
        // 嘗試在現有詞庫找對應注音
        const found = characterData.find(c => c.char === w);
        if (found) return found;
        return { char: w, bopomofo: '???' }; // 標註未知
    }).filter(item => item.bopomofo !== '???');

    if (newCharacterData.length > 0) {
        characterDataWithKeys = newCharacterData.map(data => ({
            ...data,
            englishKeys: convertBopomofoToEnglish(data.bopomofo)
        }));
        console.log("✅ 成功注入自訂詞庫:", words);
    }
}

let gameActive = false;
let fallingCharacters = [];
let completedCount = 0;
let score = 0;
let timeLeft = 180;
let timer;
let initialCharactersOnScreen = 4; // 減少初始數量
let isComposing = false; // 用於追蹤注音輸入法組字狀態

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const charactersContainer = document.getElementById('characters-container');
const inputField = document.getElementById('input-field');
const completedCountElement = document.getElementById('completed-count');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const gameOverScreen = document.getElementById('game-over');
const gameOverTitle = document.getElementById('game-over-title');
const finalCompletedElement = document.getElementById('final-completed');
const finalScoreElement = document.getElementById('final-score');
const finalTimeElement = document.getElementById('final-time');
const restartButton = document.getElementById('restart-button');

// 連擊與特效 UI
let combo = 0;
let maxCombo = 0;
const comboContainer = document.getElementById('combo-container');
const comboCountElement = document.getElementById('combo-count');
const inputContainer = document.getElementById('input-container');

// 主題與 TTS
const themeButtons = document.querySelectorAll('.theme-option');
const ttsToggleBtn = document.getElementById('tts-toggle');
let ttsEnabled = true;

// 初始化主題設定
const savedTheme = localStorage.getItem('typecc-theme') || 'dark';
document.body.className = `theme-${savedTheme}`;
themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const theme = e.target.dataset.theme;
        document.body.className = `theme-${theme}`;
        localStorage.setItem('typecc-theme', theme);
    });
});

// 初始化 TTS UI
if (ttsEnabled) {
    ttsToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    ttsToggleBtn.classList.replace('text-white', 'text-cyan-300');
}

ttsToggleBtn.addEventListener('click', () => {
    ttsEnabled = !ttsEnabled;
    if (ttsEnabled) {
        ttsToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        ttsToggleBtn.classList.replace('text-white', 'text-cyan-300');
    } else {
        ttsToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        ttsToggleBtn.classList.replace('text-cyan-300', 'text-white');
    }
});

// ==========================================
// 全螢幕沉浸模式 (Fullscreen API)
// ==========================================
const fullscreenToggle = document.getElementById('fullscreen-toggle');
if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    document.addEventListener('fullscreenchange', () => {
        const icon = fullscreenToggle.querySelector('i');
        if (document.fullscreenElement) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    });
}

// ==========================================
// 動態伴學吉祥物 (Mascot)
// ==========================================
const mascot = document.getElementById('mascot');
let mascotTimeout;

function setMascotState(state, duration = 1000) {
    if (!mascot) return;

    // reset classes
    mascot.className = `fixed bottom-4 left-4 z-[40] text-6xl drop-shadow-2xl pointer-events-none transition-transform duration-300 mascot-${state}`;

    if (state === 'happy') mascot.textContent = '😸';
    else if (state === 'shock') mascot.textContent = '🙀';
    else mascot.textContent = '🐱';

    clearTimeout(mascotTimeout);
    if (state !== 'idle') {
        mascotTimeout = setTimeout(() => {
            setMascotState('idle');
        }, duration);
    }
}

// ==========================================
// 行動裝置虛擬注音鍵盤 (Virtual Keyboard)
// ==========================================
const kbToggle = document.getElementById('keyboard-toggle');
const kbContainer = document.getElementById('virtual-keyboard-container');
const vkElement = document.getElementById('virtual-keyboard');

const bopomofoLayout = [
    [{ k: '1', v: 'ㄅ' }, { k: '2', v: 'ㄉ' }, { k: '3', v: 'ˇ' }, { k: '4', v: 'ˋ' }, { k: '5', v: 'ㄓ' }, { k: '6', v: 'ˊ' }, { k: '7', v: '˙' }, { k: '8', v: 'ㄚ' }, { k: '9', v: 'ㄞ' }, { k: '0', v: 'ㄢ' }, { k: '-', v: 'ㄦ' }],
    [{ k: 'q', v: 'ㄆ' }, { k: 'w', v: 'ㄊ' }, { k: 'e', v: 'ㄍ' }, { k: 'r', v: 'ㄐ' }, { k: 't', v: 'ㄔ' }, { k: 'y', v: 'ㄗ' }, { k: 'u', v: 'ㄧ' }, { k: 'i', v: 'ㄛ' }, { k: 'o', v: 'ㄟ' }, { k: 'p', v: 'ㄣ' }],
    [{ k: 'a', v: 'ㄇ' }, { k: 's', v: 'ㄋ' }, { k: 'd', v: 'ㄎ' }, { k: 'f', v: 'ㄑ' }, { k: 'g', v: 'ㄕ' }, { k: 'h', v: 'ㄘ' }, { k: 'j', v: 'ㄨ' }, { k: 'k', v: 'ㄜ' }, { k: 'l', v: 'ㄠ' }, { k: ';', v: 'ㄤ' }],
    [{ k: 'z', v: 'ㄈ' }, { k: 'x', v: 'ㄌ' }, { k: 'c', v: 'ㄏ' }, { k: 'v', v: 'ㄒ' }, { k: 'b', v: 'ㄖ' }, { k: 'n', v: 'ㄙ' }, { k: 'm', v: 'ㄩ' }, { k: ',', v: 'ㄝ' }, { k: '.', v: 'ㄡ' }, { k: '/', v: 'ㄥ' }]
];

function initVirtualKeyboard() {
    if (!vkElement) return;
    bopomofoLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'vk-row';
        row.forEach(keyData => {
            const btn = document.createElement('button');
            btn.className = 'vk-btn';
            btn.textContent = keyData.v;
            btn.dataset.key = keyData.k;

            const handlePress = (e) => {
                e.preventDefault();
                inputField.focus();

                inputField.value += keyData.v;

                // Dispatch input event to trigger processInput
                const inputEvent = new Event('input', { bubbles: true });
                inputField.dispatchEvent(inputEvent);

                // Trigger button animation
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 100);
            };

            btn.addEventListener('mousedown', handlePress);
            btn.addEventListener('touchstart', handlePress, { passive: false });
            rowDiv.appendChild(btn);
        });
        vkElement.appendChild(rowDiv);
    });

    // Add Backspace and Space bar row
    const bottomRow = document.createElement('div');
    bottomRow.className = 'vk-row mt-1';

    const spaceBtn = document.createElement('button');
    spaceBtn.className = 'vk-btn vk-btn-space';
    spaceBtn.textContent = '空白鍵 (一聲)';
    const handleSpace = (e) => {
        e.preventDefault();
        inputField.focus();
        inputField.value += ' ';
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        spaceBtn.classList.add('active');
        setTimeout(() => spaceBtn.classList.remove('active'), 100);
    };
    spaceBtn.addEventListener('mousedown', handleSpace);
    spaceBtn.addEventListener('touchstart', handleSpace, { passive: false });
    bottomRow.appendChild(spaceBtn);

    const backspaceBtn = document.createElement('button');
    backspaceBtn.className = 'vk-btn vk-btn-wide text-red-300 border-red-400';
    backspaceBtn.innerHTML = '<i class="fas fa-backspace"></i>';
    const handleBackspace = (e) => {
        e.preventDefault();
        inputField.focus();
        inputField.value = inputField.value.slice(0, -1);
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        backspaceBtn.classList.add('active');
        setTimeout(() => backspaceBtn.classList.remove('active'), 100);
    };
    backspaceBtn.addEventListener('mousedown', handleBackspace);
    backspaceBtn.addEventListener('touchstart', handleBackspace, { passive: false });
    bottomRow.appendChild(backspaceBtn);

    vkElement.appendChild(bottomRow);
}

if (kbToggle) {
    initVirtualKeyboard();
    kbToggle.addEventListener('click', () => {
        kbContainer.classList.toggle('translate-y-full');
    });
}

function updateComboUI() {
    comboCountElement.textContent = combo;
    if (combo > 0) {
        comboContainer.classList.remove('hidden', 'opacity-50', 'scale-90');
        comboContainer.classList.add('opacity-100', 'scale-100');
    } else {
        comboContainer.classList.add('opacity-50', 'scale-90');
        inputContainer.classList.remove('combo-glow');
        comboContainer.classList.remove('combo-glow');
    }

    if (combo >= 10) {
        inputContainer.classList.add('combo-glow');
        comboContainer.classList.add('combo-glow');
    }
}

function createExplosion(x, y) {
    const particleCount = 12;
    const colors = ['#4fd1c5', '#fb923c', '#facc15', '#60a5fa', '#f472b6', '#ffffff'];
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = 5 + Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = 40 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(particle);
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 800);
    }
}

// 教師工具 & 自訂詞庫 UI 元件
const teacherToolButton = document.getElementById('teacher-tool-button');
const teacherModal = document.getElementById('teacher-modal');
const closeTeacherModal = document.getElementById('close-teacher-modal');
const publishButton = document.getElementById('publish-button');
const newWordsetTitle = document.getElementById('new-wordset-title');
const newWordsetWords = document.getElementById('new-wordset-words');
const publishResult = document.getElementById('publish-result');
const generatedCodeDisp = document.getElementById('generated-code');

const wordsetCodeInput = document.getElementById('wordset-code-input');
const loadWordsetButton = document.getElementById('load-wordset-button');

// 難度選擇監聽器
const updateDifficultyUI = () => {
    const diffButtons = document.querySelectorAll('.difficulty-btn');
    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.level;
            console.log('Difficulty set to:', currentDifficulty);
        });
    });
};
updateDifficultyUI();

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function getRandomUniqueCharacter() {
    const onScreenChars = fallingCharacters.map(fc => fc.char);
    let availableCharsData = characterDataWithKeys.filter(data => !onScreenChars.includes(data.char));
    if (availableCharsData.length === 0) {
        availableCharsData = [...characterDataWithKeys];
    }
    const randomIndex = Math.floor(Math.random() * availableCharsData.length);
    return availableCharsData[randomIndex];
}

function spawnNewCharacter() {
    if (!gameActive) return;

    const charData = getRandomUniqueCharacter();
    if (!charData) return;

    const settings = difficultySettings[currentDifficulty];
    const charElement = document.createElement('div');
    charElement.className = 'falling-character';

    // 根據難度決定顯示內容
    let hintHTML = '';
    if (settings.showBopomofo) {
        const keyHint = settings.showKeys ? ` (${charData.englishKeys})` : '';
        hintHTML = `<span class="text-xs text-cyan-300 mt-1">${charData.bopomofo}${keyHint}</span>`;
    }

    charElement.innerHTML = `<span class="text-2xl">${charData.char}</span>${hintHTML}`;

    charElement.dataset.char = charData.char;
    charElement.dataset.bopomofo = charData.bopomofo;
    charElement.dataset.englishKeys = charData.englishKeys;

    const containerWidth = charactersContainer.clientWidth;
    let effectiveCharWidth = 80;
    if (window.innerWidth <= 768) effectiveCharWidth = 70;
    if (window.innerWidth <= 640) effectiveCharWidth = 65;

    const left = Math.random() * (containerWidth - effectiveCharWidth);
    charElement.style.left = `${Math.max(0, left)}px`;

    // 根據難度決定速度
    const minDur = settings.minDuration;
    const maxDur = settings.maxDuration;
    const duration = minDur + Math.random() * (maxDur - minDur);

    charElement.style.animationName = 'fall';
    charElement.style.animationDuration = `${duration}s`;

    charactersContainer.appendChild(charElement);

    // TTS 語音朗讀已移至 handleSuccess (打中字元後才朗讀)

    const newFcData = {
        element: charElement,
        char: charData.char,
        bopomofo: charData.bopomofo,
        englishKeys: charData.englishKeys,
        duration: duration,
        startTime: Date.now()
    };
    fallingCharacters.push(newFcData);

    charElement.addEventListener('animationend', function handleAnimationEnd() {
        this.removeEventListener('animationend', handleAnimationEnd);

        // 若動畫結束時仍沒有被擊中 (.hit)，代表觸底漏接了
        if (!this.classList.contains('hit')) {
            combo = 0;
            updateComboUI();
            setMascotState('shock', 1000); // 漏字吉祥物驚嚇
        }

        const index = fallingCharacters.findIndex(fc => fc.element === this);
        if (index > -1) {
            fallingCharacters.splice(index, 1);
        }
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    });
}

let spawnTimer = null;
function startSpawning() {
    const settings = difficultySettings[currentDifficulty];
    const baseInterval = settings.spawnInterval || 3000;

    const spawn = () => {
        if (!gameActive) return;

        // 限制畫面上字元數上限，避免三年級小學生壓力過大
        const maxOnScreen = currentDifficulty === 'beginner' ? 5 : (currentDifficulty === 'easy' ? 8 : 12);
        if (fallingCharacters.length < maxOnScreen) {
            spawnNewCharacter();
        }

        // 隨機化下一代的間隔，增加趣味性同時避免瞬間大量噴出
        const nextInterval = baseInterval * (0.8 + Math.random() * 0.4);
        spawnTimer = setTimeout(spawn, nextInterval);
    };

    spawn();
}

function startGame() {
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');

    gameActive = true;
    completedCount = 0;
    score = 0;
    combo = 0;
    maxCombo = 0;
    timeLeft = 180;
    fallingCharacters = [];
    charactersContainer.innerHTML = '';

    completedCountElement.textContent = completedCount;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    updateComboUI();

    if (timer) clearInterval(timer);
    if (spawnTimer) clearTimeout(spawnTimer);

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 10 && timeLeft > 0) {
            audio.playTick();
        }
        if (timeLeft <= 0) {
            endGame("時間到！");
        }
    }, 1000);

    startSpawning(); // 開始定時生成
    audio.playRandomBGM(); // 播放隨機背景音樂


    inputField.value = '';
    setupInputListeners();

    // 延遲 focus 確保 DOM 已經正確渲染移除 hidden 狀態
    setTimeout(() => {
        inputField.focus();
    }, 50);

    const initialCount = currentDifficulty === 'beginner' ? 2 : initialCharactersOnScreen;
    for (let i = 0; i < initialCount; i++) {
        setTimeout(() => {
            if (gameActive) spawnNewCharacter();
        }, i * (currentDifficulty === 'beginner' ? 2000 : 1000)); // 初學者模式加長開局間隔並減少數量
    }
}

let inputListenersSetup = false;
function setupInputListeners() {
    if (inputListenersSetup) return;

    const inputHandler = (e) => {
        // 對於非組字輸入(如英文鍵盤)，即時處理
        if (!isComposing) {
            processInput(e.target.value);
        }
    };

    const compositionStartHandler = () => {
        isComposing = true;
    };

    const compositionEndHandler = (e) => {
        isComposing = false;
        // 在組字結束後，處理最終的注音字串
        processInput(e.data || e.target.value);
        // 使用 setTimeout 確保瀏覽器完成渲染後再清空，避免衝突
        setTimeout(() => {
            if (inputField.value === (e.data || e.target.value)) {
                inputField.value = '';
            }
        }, 0);
    };

    const keyDownHandler = (e) => {
        if (e.key === ' ') {
            const currentInput = e.target.value;
            if (!currentInput) return;

            const potentialMatch = currentInput + ' ';
            const targetFc = findMatchingChar(potentialMatch);

            if (targetFc) {
                e.preventDefault();
                handleSuccess(targetFc);
                inputField.value = '';
            }
        }
    };

    // 確保移除舊的監聽器，避免重複綁定
    inputField.removeEventListener('input', inputHandler);
    inputField.removeEventListener('keydown', keyDownHandler);
    inputField.removeEventListener('compositionstart', compositionStartHandler);
    inputField.removeEventListener('compositionend', compositionEndHandler);

    // 重新綁定監聽器
    inputField.addEventListener('input', inputHandler);
    inputField.addEventListener('keydown', keyDownHandler);
    inputField.addEventListener('compositionstart', compositionStartHandler);
    inputField.addEventListener('compositionend', compositionEndHandler);

    inputListenersSetup = true;
}

function findMatchingChar(typedValue) {
    let targetFc = null;
    let maxProgress = -1;

    // 取得去除頭尾空白的字串，用於中文與注音的精確比對
    const exactTyped = typedValue.trim();
    // 取得去除所有空白與括號的小寫字串，用於英文鍵盤的極度寬容比對 (例：允許玩家輸入括號或中間加空白)
    const cleanedTyped = typedValue.replace(/[\s()]/g, '').toLowerCase();

    for (const fc of fallingCharacters) {
        const cleanedFcEnglish = fc.englishKeys.replace(/[\s()]/g, '').toLowerCase();

        if ((fc.bopomofo === exactTyped || fc.char === exactTyped || (cleanedTyped.length > 0 && cleanedFcEnglish === cleanedTyped)) && fc.element.parentNode) {
            const elapsedTime = (Date.now() - fc.startTime) / 1000;
            const progress = elapsedTime / fc.duration;

            if (progress > maxProgress) {
                maxProgress = progress;
                targetFc = fc;
            }
        }
    }
    return targetFc;
}

function handleSuccess(fc) {
    const fcIndex = fallingCharacters.findIndex(item => item === fc);
    if (fcIndex === -1) return;

    fc.element.classList.add('hit');
    audio.playHit();
    setMascotState('happy', 1000); // 擊中吉祥物開心跳躍

    // 成功擊中後進行 TTS 語音朗讀
    if (ttsEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fc.char);
        utterance.lang = 'zh-TW';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    // 觸發連擊與粒子動畫
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    updateComboUI();
    const rect = fc.element.getBoundingClientRect();
    createExplosion(rect.left + rect.width / 2 + window.scrollX, rect.top + rect.height / 2 + window.scrollY);

    const settings = difficultySettings[currentDifficulty];
    const elapsedTime = (Date.now() - fc.startTime) / 1000;
    const speedBonus = Math.max(1, Math.floor(10 - elapsedTime * 0.5));
    const timeBonus = Math.floor(timeLeft / 15);
    const basePoints = 50 + speedBonus * 5 + timeBonus * 2;
    const pointsEarned = Math.floor(basePoints * settings.scoreMult);

    score += pointsEarned;
    scoreElement.textContent = score;

    const pointsIndicator = document.createElement('div');
    pointsIndicator.textContent = `+${pointsEarned}`;
    pointsIndicator.className = 'absolute text-yellow-300 font-bold text-lg sm:text-xl';
    pointsIndicator.style.left = `${rect.left + window.scrollX}px`;
    pointsIndicator.style.top = `${rect.top + window.scrollY}px`;
    pointsIndicator.style.animation = 'fadeUpAndOut 1s forwards ease-out';
    document.body.appendChild(pointsIndicator);
    setTimeout(() => pointsIndicator.parentNode?.removeChild(pointsIndicator), 950);

    setTimeout(() => fc.element.parentNode?.removeChild(fc.element), 200);
    fallingCharacters.splice(fcIndex, 1);

    completedCount++;
    completedCountElement.textContent = completedCount;

    if (gameActive) {
        spawnNewCharacter();
    }
}

function processInput(inputValue) {
    if (!inputValue || !gameActive) return;

    const targetFc = findMatchingChar(inputValue);

    if (targetFc) {
        handleSuccess(targetFc);
        // 英文輸入模式下，成功後立即清空
        if (!isComposing) {
            inputField.value = '';
        }
    }
}

function endGame(reason = "遊戲結束！") {
    if (!gameActive) return;
    gameActive = false;
    audio.stopBGM(); // 停止背景音樂
    if (timer) clearInterval(timer);
    if (spawnTimer) clearTimeout(spawnTimer);
    audio.playGameOver();

    gameOverScreen.classList.remove('hidden');
    gameOverTitle.textContent = reason;

    finalCompletedElement.textContent = completedCount;
    finalScoreElement.textContent = score;
    finalTimeElement.textContent = `${Math.max(0, timeLeft)}秒`;

    // 遊戲結束後詢問姓名並儲存分數
    setTimeout(async () => {
        if (score > 0) {
            const name = prompt("恭喜！請輸入您的暱稱以列入全球排行榜：", "匿名玩家");
            if (name) {
                await saveScore(name, score, currentDifficulty);
            }
        }
    }, 1000);

    charactersContainer.innerHTML = '';
    fallingCharacters = [];
}

window.addEventListener('resize', () => {
    if (gameActive) {
        const containerWidth = charactersContainer.clientWidth;
        fallingCharacters.forEach(({ element }) => {
            if (element.parentNode) {
                let effectiveCharWidth = 80;
                if (window.innerWidth <= 768) effectiveCharWidth = 70;
                if (window.innerWidth <= 640) effectiveCharWidth = 65;

                const currentLeftPx = parseFloat(element.style.left);
                const lastContainerWidth = parseFloat(element.dataset.lastContainerWidth || containerWidth);

                let newLeft;
                if (element.dataset.lastContainerWidth && lastContainerWidth > 0) {
                    const currentLeftRatio = currentLeftPx / lastContainerWidth;
                    newLeft = currentLeftRatio * containerWidth;
                } else {
                    newLeft = Math.random() * (containerWidth - effectiveCharWidth);
                }
                newLeft = Math.max(0, Math.min(newLeft, containerWidth - effectiveCharWidth));
                element.style.left = `${newLeft}px`;
                element.dataset.lastContainerWidth = containerWidth;
            }
        });
    }
});

// PWA Service Worker 註冊與開發環境隔離
if ('serviceWorker' in navigator) {
    const isLocalhost = Boolean(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]' ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );

    if (isLocalhost) {
        // 開發環境：主動取消註冊，避免 Vite HMR 衝突
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    } else {
        // 正式環境：正常註冊
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('✅ Service Worker 註冊成功', reg))
                .catch(err => console.log('❌ Service Worker 註冊失敗', err));
        });
    }
}

// 匿名登入
signInAnonymously(auth).then(() => {
    console.log("✅ 匿名登入成功");
}).catch((error) => {
    console.error("❌ 匿名登入失敗", error);
});

// 排行榜與分享 UI 邏輯
const leaderboardModal = document.getElementById('leaderboard-modal');
const leaderboardButton = document.getElementById('leaderboard-button');
const closeLeaderboard = document.getElementById('close-leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
const shareButton = document.getElementById('share-button');

if (leaderboardButton) {
    leaderboardButton.addEventListener('click', async () => {
        leaderboardModal.classList.remove('hidden');
        renderLeaderboard();
    });
}

if (closeLeaderboard) {
    closeLeaderboard.addEventListener('click', () => {
        leaderboardModal.classList.add('hidden');
    });
}

async function renderLeaderboard() {
    leaderboardList.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i> 正在載入排名...</div>';
    const topScores = await getTopScores();
    if (topScores.length === 0) {
        leaderboardList.innerHTML = '<div class="text-center py-8 text-gray-500">暫無數據</div>';
        return;
    }
    leaderboardList.innerHTML = topScores.map((entry, index) => `
        <div class="flex items-center justify-between p-3 ${index < 3 ? 'bg-indigo-900/30' : 'bg-gray-700/20'} rounded-lg border border-gray-700">
            <div class="flex items-center">
                <span class="w-8 font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}">${index + 1}</span>
                <span class="font-medium truncate max-w-[120px]">${entry.name}</span>
                <span class="ml-2 px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-400 uppercase font-mono">${entry.difficulty || 'Easy'}</span>
            </div>
            <div class="font-bold text-cyan-400">${entry.score}</div>
        </div>
    `).join('');
}

// --- 教師工具邏輯 ---

if (teacherToolButton) {
    teacherToolButton.addEventListener('click', () => {
        teacherModal.classList.remove('hidden');
    });
}

if (closeTeacherModal) {
    closeTeacherModal.addEventListener('click', () => {
        teacherModal.classList.add('hidden');
        publishResult.classList.add('hidden');
    });
}

if (publishButton) {
    publishButton.addEventListener('click', async () => {
        const title = newWordsetTitle.value.trim();
        const wordsStr = newWordsetWords.value.trim();

        if (!title || !wordsStr) {
            alert("請填寫標題與詞彙清單");
            return;
        }

        // 解析詞彙 (支援逗號、空格、換行)
        const words = wordsStr.split(/[,\s，\n]+/).filter(w => w.length > 0);

        publishButton.disabled = true;
        publishButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 正在發佈...';

        try {
            const code = await publishWordset(title, words, "匿名老師");
            generatedCodeDisp.textContent = code;
            publishResult.classList.remove('hidden');
            newWordsetTitle.value = '';
            newWordsetWords.value = '';
        } catch (error) {
            console.error("發佈失敗", error);
            alert("發佈失敗，請稍後再試");
        } finally {
            publishButton.disabled = false;
            publishButton.innerHTML = '<i class="fas fa-cloud-upload-alt mr-2"></i> 立即發佈並取得代碼';
        }
    });
}

if (loadWordsetButton) {
    loadWordsetButton.addEventListener('click', async () => {
        const code = wordsetCodeInput.value.trim().toUpperCase();
        if (!code) return;

        loadWordsetButton.disabled = true;
        loadWordsetButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const data = await fetchWordset(code);
            if (data && data.words) {
                injectWordset(data.words);
                alert(`✅ 成功載入詞庫：${data.title}\n包含 ${data.words.length} 個詞彙`);
            } else {
                alert("❌ 找不到該代碼，請檢查是否輸入正確");
            }
        } catch (error) {
            console.error("載入失敗", error);
            alert("載入失敗，請檢查網路連線");
        } finally {
            loadWordsetButton.disabled = false;
            loadWordsetButton.innerHTML = '載入詞庫';
        }
    });
}

// 檢查 URL 參數自動載入
const urlParams = new URLSearchParams(window.location.search);
const autoCode = urlParams.get('code');
if (autoCode) {
    setTimeout(async () => {
        const data = await fetchWordset(autoCode);
        if (data) injectWordset(data.words);
    }, 1000);
}

// 分享成績功能
if (shareButton) {
    shareButton.addEventListener('click', async () => {
        const gameResultCard = document.querySelector('#game-over > div');
        if (!gameResultCard) return;

        shareButton.disabled = true;
        const originalText = shareButton.innerHTML;
        shareButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 正在生成...';

        try {
            // 確保 html2canvas 載入
            if (typeof html2canvas === 'undefined') {
                throw new Error('html2canvas not loaded');
            }
            const canvas = await html2canvas(gameResultCard, {
                backgroundColor: '#1a1a2e',
                scale: 2,
                useCORS: true
            });
            const image = canvas.toDataURL("image/png");

            // 下載圖片
            const link = document.createElement('a');
            link.download = `Zhuyin_Challenge_Score_${Date.now()}.png`;
            link.href = image;
            link.click();
        } catch (error) {
            console.error("截圖失敗", error);
            alert("抱歉，無法生成分享圖片。請確認網路連接。");
        } finally {
            shareButton.disabled = false;
            shareButton.innerHTML = originalText;
        }
    });
}
