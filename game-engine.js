/* ================================================================
   【 ⚙️ GAME ENGINE - 勇者核心引擎 】
   描述：處理加減分、等級判定、裝備更換及 localStorage 記憶。
   ================================================================ */

const GameEngine = {
    // 初始狀態：0 分起跳
    state: {
        score: 0,
        stage: 1,
        items: ['🧤 布製護手'],
        achievements: [],
        statusText: '⛺ 新手村聽訓',
        itemStatus: '📦 準備領取裝備'
    },

    // 戰力等級表
    ranks: [
        { min: 101, title: "💎 SS級 神話級玩家" },
        { min: 96,  title: "🌟 S級 傳說神隊友" },
        { min: 80,  title: "🟢 A級 菁英玩家" },
        { min: 60,  title: "🥇 B級 穩健玩家" },
        { min: 40,  title: "🥈 C級 潛力玩家" },
        { min: 1,   title: "🥉 實習小萌新" },
        { min: 0,   title: "🥚 報到新手村" }
    ],

    // 初始化
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

    // 觸發成就與加分
    unlockAchievement(id, type, label, scoreGain, newItem = null) {
        if (this.state.achievements.includes(id)) return; // 防洗分

        this.state.achievements.push(id);
        this.state.score += scoreGain;

        // 裝備汰換邏輯
        if (newItem) {
            if (newItem === '🛡️ 鋼鐵護手') {
                // 汰換布製護手
                this.state.items = this.state.items.map(i => i === '🧤 布製護手' ? '🛡️ 鋼鐵護手' : i);
            } else if (!this.state.items.includes(newItem)) {
                // 新增裝備 (如指環)
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

    // 更新界面
    updateUI() {
        // 1. 判定稱號
        const rank = this.ranks.find(r => this.state.score >= r.min);
        
        // 2. 更新文字顯示
        if(document.getElementById('rank-text')) 
            document.getElementById('rank-text').innerText = `戰力：${rank.title}`;
        
        if(document.getElementById('status-text')) 
            document.getElementById('status-text').innerText = `關卡：${this.state.statusText}`;
        
        if(document.getElementById('item-text')) 
            document.getElementById('item-text').innerText = `道具：${this.state.items.join(' ')}　｜　狀態：${this.state.itemStatus}`;
        
        if(document.getElementById('score-text')) 
            document.getElementById('score-text').innerText = `${this.state.score}分`;

        // 3. 更新積分進度條
        const scoreFill = document.getElementById('score-fill');
        if (scoreFill) {
            scoreFill.style.width = Math.min(this.state.score, 100) + '%';
            scoreFill.style.backgroundColor = '#fbbf24';
        }
    },

    // 滑出式提示
    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.innerText = msg;
        document.body.appendChild(toast);
        
        // 動畫啟動
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        
        // 3秒後消失
        setTimeout(() => {
            toast.style.transform = 'translateX(150%)';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};

// 監聽載入
window.addEventListener('DOMContentLoaded', () => GameEngine.init());
