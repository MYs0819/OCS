/* ================================================================
   【 ⚙️ GAME ENGINE - 勇者核心引擎 】
   ================================================================ */
const GameEngine = {
    state: {
        score: 0,
        items: ['🧤 布製護手'],
        location: '⛺ 新手村',
        status: '📦 準備領取裝備',
        achievements: []
    },

    // 🏆 嚴格階級設定
    ranks: [
        { min: 101, title: "💎 SS級 神話級玩家" },
        { min: 96,  title: "🌟 S級 傳說級玩家" },
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

    // 🧩 觸發成就
    unlock(id, label, scoreGain, newItem = null) {
        if (this.state.achievements.includes(id)) return;
        
        this.state.achievements.push(id);
        this.state.score += scoreGain;

        if (newItem) {
            if (newItem === '🛡️ 鋼鐵護手') {
                this.state.items = this.state.items.map(i => i === '🧤 布製護手' ? '🛡️ 鋼鐵護手' : i);
            } else if (!this.state.items.includes(newItem)) {
                this.state.items.push(newItem);
            }
        }
        
        this.save();
        this.updateUI();

        // 大項目點擊彈窗 (如：大摺疊)
        if (scoreGain >= 2) {
            alert(`🔔 發現隱藏關卡：${label}！\n(冒險積分 +${scoreGain})`);
        } else if (scoreGain === 1 && newItem) {
            // 小項目顯示 Toast 提示
            this.showToast(`✨ 拾取裝備：${newItem} (經驗值 +${scoreGain})`);
        }
    },

    updateUI() {
        const rank = this.ranks.find(r => this.state.score >= r.min) || this.ranks[this.ranks.length - 1];
        
        const rankEl = document.getElementById('rank-text');
        const statusTagEl = document.getElementById('status-tag');
        const scoreEl = document.getElementById('score-text');
        const scoreFill = document.getElementById('score-fill');

        if (rankEl) rankEl.innerText = rank.title + "　｜　關卡：" + this.state.location;
        if (statusTagEl) statusTagEl.innerText = "道具：" + this.state.items.join(' ') + "　｜　狀態：" + this.state.status;
        if (scoreEl) scoreEl.innerText = this.state.score + "分";
        
        if (scoreFill) {
            const displayScore = Math.min(this.state.score, 100);
            scoreFill.style.width = displayScore + "%";
            scoreFill.style.backgroundColor = "#fbbf24";
        }
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.style.cssText = "position:fixed; bottom:80px; right:20px; background:rgba(0,0,0,0.85); color:#ffd700; padding:12px 20px; border-radius:8px; border:1px solid #ffd700; transform:translateX(150%); transition:0.5s; z-index:9999;";
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(150%)';
            setTimeout(() => toast.remove(), 500);
        }, 5000); // 顯示5秒
    }
};
window.addEventListener('load', () => GameEngine.init());
