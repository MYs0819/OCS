// 【勇者核心引擎 - 邏輯統整】
const GameEngine = {
    // 初始狀態
    state: {
        score: 0,
        stage: 1, // 1: 閱讀, 2: 上傳, 3: 審核, 4: 準備報到, 5: 轉職
        items: ['🧤 布製護手'],
        achievements: [], // 紀錄已獲得的 ID
        statusText: '⛺ 新手村聽訓 (閱讀中)',
        itemStatus: '📦 準備領取裝備'
    },

    // 戰力等級表
    ranks: [
        { min: 101, title: "💎 SS級 神話級玩家", class: "rank-ss" },
        { min: 96,  title: "🌟 S級 傳說神隊友", class: "rank-s" },
        { min: 80,  title: "🟢 A級 菁英玩家", class: "rank-a" },
        { min: 60,  title: "🥇 B級 穩健玩家", class: "rank-b" },
        { min: 40,  title: "🥈 C級 潛力玩家", class: "rank-c" },
        { min: 1,   title: "🥉 實習小萌新", class: "rank-d" },
        { min: 0,   title: "🥚 報到新手村", class: "rank-zero" }
    ],

    // 初始化：讀取進度或建立新進度
    init() {
        const saved = localStorage.getItem('hero_progress');
        if (saved) {
            this.state = JSON.parse(saved);
        }
        this.updateUI();
    },

    // 保存進度
    save() {
        localStorage.setItem('hero_progress', JSON.stringify(this.state));
    },

    // 觸發成就 (加分與裝備連動)
    unlockAchievement(id, type, label, scoreGain, newItem = null) {
        if (this.state.achievements.includes(id)) return; // 防洗分機制

        this.state.achievements.push(id);
        this.state.score += scoreGain;

        // 裝備汰換邏輯
        if (newItem) {
            if (newItem === '🛡️ 鋼鐵護手') {
                this.state.items = this.state.items.map(i => i === '🧤 布製護手' ? '🛡️ 鋼鐵護手' : i);
            } else if (!this.state.items.includes(newItem)) {
                this.state.items.push(newItem);
            }
        }

        this.save();
        this.updateUI();

        // 彈窗與提示
        if (type === 'alert') {
            alert(`🔔 發現隱藏關卡：${label}！\n(冒險積分 +${scoreGain})`);
        } else if (type === 'toast') {
            this.showToast(`✨ 拾取裝備：${newItem} (經驗值 +${scoreGain})`);
        }
    },

    // 更新畫面 UI
    updateUI() {
        // 更新分數與等級文字
        const rank = this.ranks.find(r => this.state.score >= r.min);
        document.getElementById('rank-text').innerText = `戰力：${rank.title} (積分：${this.state.score})`;
        document.getElementById('status-text').innerText = `關卡：${this.state.statusText}`;
        document.getElementById('item-text').innerText = `道具：${this.state.items.join(' ')} | 狀態：${this.state.itemStatus}`;

        // 更新進度條 (積分條以 100 為基準，SS級會爆表)
        const scoreBar = document.getElementById('score-bar');
        const progressPercent = Math.min(this.state.score, 100);
        scoreBar.style.width = progressPercent + '%';
        
        // 這裡可以加入更多 UI 連動邏輯
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};

// 頁面載入後啟動
window.onload = () => GameEngine.init();
