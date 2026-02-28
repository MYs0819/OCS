/* ================================================================
   【 ⚙️ GAME ENGINE - 顏色鎖定強化版 】
   ================================================================ */
const GameEngine = {
    state: {
        score: 0,
        items: ['🧤 布製護手'],
        location: '⛺ 新手村',
        status: '📦 準備領取裝備',
        achievements: []
    },

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
        if (saved) { this.state = JSON.parse(saved); }
        this.updateUI();
    },

    save() { localStorage.setItem('hero_progress', JSON.stringify(this.state)); },

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
        if (scoreGain >= 2) { alert(`🔔 發現隱藏關卡，冒險積分+${scoreGain}`); } 
        else if (scoreGain === 1) {
            const msg = newItem ? `✨ 拾獲裝備 ${newItem}，經驗值+${scoreGain}` : `✨ 發現小細節，經驗值+${scoreGain}`;
            this.showToast(msg);
        }
    },

    updateUI() {
        const rank = this.ranks.find(r => this.state.score >= r.min) || this.ranks[this.ranks.length - 1];
        
        const rankEl = document.getElementById('rank-text');
        const statusTagEl = document.getElementById('status-tag');
        const scoreLabelEl = document.getElementById('score-label'); // 新增 ID 對接
        const progLabelEl = document.getElementById('prog-label');   // 新增 ID 對接
        const scoreEl = document.getElementById('score-text');
        const scoreFill = document.getElementById('score-fill');

        // 🎨 顏色：戰力(黃) + 標題(白) + 關卡(黃)
        if (rankEl) {
            rankEl.innerHTML = `<span style="color:#fbbf24;">戰力：</span><span style="color:#FFFFFF;">${rank.title}</span>　｜　<span style="color:#fbbf24;">關卡：</span><span style="color:#FFFFFF;">${this.state.location}</span>`;
        }
        
        // 🎨 顏色：道具(藍) + 狀態(藍)
        if (statusTagEl) {
            statusTagEl.innerHTML = `<span style="color:#8ab4f8;">道具：</span><span style="color:#FFFFFF;">${this.state.items.join(' ')}</span>　｜　<span style="color:#8ab4f8;">狀態：</span><span style="color:#FFFFFF;">${this.state.status}</span>`;
        }

        // 🎨 顏色：積分(淺紅) + 攻略(淺紅)
        if (scoreLabelEl) scoreLabelEl.style.color = "#ff8a8a";
        if (progLabelEl) progLabelEl.style.color = "#ff8a8a";
        
        if (scoreEl) scoreEl.innerText = this.state.score + "分";
        if (scoreFill) {
            const displayScore = Math.min(this.state.score, 100);
            scoreFill.style.width = displayScore + "%";
            scoreFill.style.backgroundColor = "#fbbf24";
        }
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = "position:fixed; bottom:80px; right:20px; background:rgba(0,0,0,0.9); color:#ffd700; padding:12px 20px; border-radius:8px; border:1px solid #ffd700; transform:translateX(150%); transition:0.5s; z-index:10000; font-weight:bold;";
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
