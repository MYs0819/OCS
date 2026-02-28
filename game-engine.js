/* ================================================================
   【 ⚙️ GAME ENGINE - 勇者核心引擎 】
   描述：處理跨分頁分數、等級、裝備更換邏輯。
   ================================================================ */
const GameEngine = {
    state: {
        score: 0,
        items: ['🧤 布製護手'],
        location: '⛺ 新手村',
        status: '📦 準備領取裝備',
        achievements: []
    },

    // 🏆 嚴格遵守階級設定
    ranks: [
        { min: 101, title: "💎 SS級 神話級玩家" },
        { min: 96,  title: "🌟 S級 傳說神隊友" },
        { min: 80,  title: "🟢 A級 菁英玩家" },
        { min: 60,  title: "🥇 B級 穩健玩家" },
        { min: 40,  title: "🥈 C級 潛力玩家" },
        { min: 1,   title: "🥉 實習小萌新" },
        { min: 0,   title: "🥚 報到新手村" }
    ],

    init() {
        const saved = localStorage.getItem('hero_progress');
        if (saved) {
            this.state = JSON.parse(saved);
        }
        this.updateUI();
    },

    save() {
        localStorage.setItem('hero_progress', JSON.stringify(this.state));
    },

    // 🧩 觸發成就 (id, 名稱, 分數, 道具)
    unlock(id, label, scoreGain, newItem = null) {
        if (this.state.achievements.includes(id)) return;
        
        this.state.achievements.push(id);
        this.state.score += scoreGain;

        if (newItem) {
            // 裝備進化邏輯：拿到鋼鐵護手自動更換布製護手
            if (newItem === '🛡️ 鋼鐵護手') {
                this.state.items = this.state.items.map(i => i === '🧤 布製護手' ? '🛡️ 鋼鐵護手' : i);
            } else if (!this.state.items.includes(newItem)) {
                this.state.items.push(newItem);
            }
        }
        
        this.save();
        this.updateUI();

        // 只有大標題觸發時才彈出提示，避免小項目過多干擾
        if (scoreGain >= 2) {
            alert(`🔔 發現隱藏關卡：${label}！\n(冒險積分 +${scoreGain})`);
        }
    },

    updateUI() {
        // 計算等級標題
        const rank = this.ranks.find(r => this.state.score >= r.min) || this.ranks[this.ranks.length - 1];
        
        // 抓取 HTML ID
        const rankEl = document.getElementById('rank-text');
        const statusTagEl = document.getElementById('status-tag');
        const scoreEl = document.getElementById('score-text');
        const scoreFill = document.getElementById('score-fill');

        // 更新文字
        if (rankEl) rankEl.innerText = rank.title + "　｜　關卡：" + this.state.location;
        if (statusTagEl) statusTagEl.innerText = "道具：" + this.state.items.join(' ') + "　｜　狀態：" + this.state.status;
        if (scoreEl) scoreEl.innerText = this.state.score + "分";
        
        // 更新積分進度條
        if (scoreFill) {
            const displayScore = Math.min(this.state.score, 100);
            scoreFill.style.width = displayScore + "%";
            scoreFill.style.backgroundColor = "#fbbf24"; // 金黃色
        }
    }
};

// 頁面載入後自動啟動
window.addEventListener('load', () => GameEngine.init());
