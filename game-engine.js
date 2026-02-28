/* ================================================================
   【 ⚙️ GAME ENGINE - 勇者核心引擎 】
   ================================================================ */
const GameEngine = {
    state: {
        score: 0,
        stage: 1,
        items: ['🧤 布製護手'],
        achievements: [],
        statusText: '⛺ 新手村聽訓',
        itemStatus: '📦 準備領取裝備'
    },

    ranks: [
        { min: 101, title: "💎 SS級神話級玩家" },
        { min: 96,  title: "🌟 S級傳說神隊友" },
        { min: 80,  title: "🟢 A級菁英玩家" },
        { min: 60,  title: "🥇 B級穩健玩家" },
        { min: 40,  title: "🥈 C級潛力玩家" },
        { min: 1,   title: "🥉 實習小萌新" },
        { min: 0,   title: "🥚 報到新手村" }
    ],

    init() {
        const saved = localStorage.getItem('hero_progress');
        if (saved) { this.state = JSON.parse(saved); }
        this.updateUI();
    },

    save() { localStorage.setItem('hero_progress', JSON.stringify(this.state)); },

    unlockAchievement(id, type, label, scoreGain, newItem = null) {
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

        if (type === 'alert') {
            alert(`🔔 發現隱藏關卡：${label}！\n(冒險積分 +${scoreGain})`);
        } else if (type === 'toast') {
            this.showToast(`✨ 拾取裝備：${newItem} (經驗值 +${scoreGain})`);
        }
    },

    updateUI() {
        const rank = this.ranks.find(r => this.state.score >= r.min);
        const rankEl = document.getElementById('rank-text');
        const statusTagEl = document.getElementById('status-tag');
        const scoreEl = document.getElementById('score-text');
        const scoreFill = document.getElementById('score-fill');

        if (rankEl) rankEl.innerText = rank.title;
        if (statusTagEl) statusTagEl.innerText = `道具：${this.state.items.join(' ')}　｜　狀態：${this.state.itemStatus}`;
        if (scoreEl) scoreEl.innerText = this.state.score + "分";
        if (scoreFill) {
            scoreFill.style.width = Math.min(this.state.score, 100) + "%";
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
        }, 3000);
    }
};
window.addEventListener('load', () => GameEngine.init());
