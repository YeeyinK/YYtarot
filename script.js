/**
 * script.js - 塔罗占卜逻辑大脑 (动画增强版)
 */

// 1. 抽牌主函数
function startDraw(count) {
    const setupArea = document.getElementById('setup-area');
    const resultPage = document.getElementById('result-page');
    const displayArea = document.getElementById('display-area');
    const meaningArea = document.getElementById('meaning-area');
    const queryInput = document.getElementById('user-query');
    const userQuestion = queryInput.value.trim(); // 如果没输入，显示默认值

    // 安全检查
    if (typeof tarotDeck === 'undefined' || tarotDeck.length === 0) {
        alert("牌池数据还没准备好，请检查 cards.js");
        return;
    }

    // --- 逻辑处理 ---
    // 1. 隐藏输入框所在的区域
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('setup-area').style.display = 'none';
    document.getElementById('result-page').style.display = 'flex';
    
    // 清空旧数据
    displayArea.innerHTML = '';
    meaningArea.innerHTML = '<h2>✨ 塔罗的启示 ✨</h2>';
    meaningArea.style.display = 'none';
    if (userQuestion !== "") {
        meaningArea.innerHTML += `<div class="display-question">“ ${userQuestion} ”</div>`;
    }

    // 随机洗牌并抽取
    let tempDeck = [...tarotDeck];
    let selectedCards = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * tempDeck.length);
        selectedCards.push(tempDeck.splice(randomIndex, 1)[0]);
    }

    // --- 渲染展示 ---
    selectedCards.forEach((card, index) => {
        const isUpright = Math.random() > 0.5;
        const positionText = isUpright ? "正位" : "逆位";
        const detailedMeaning = isUpright ? card.meaning_up : card.meaning_rev;

        // --- ✨ 新增：牌阵位置标签逻辑 ---
    let positionLabelHTML = '';
    // 只有当抽取 3 张牌（圣三角）时才显示标签
    if (count === 3) {
        let labelText = '';
        let labelClass = '';
        switch (index) {
            case 0: labelText = '原因'; labelClass = 'label-cause'; break;
            case 1: labelText = '结果'; labelClass = 'label-result'; break;
            case 2: labelText = '建议'; labelClass = 'label-advice'; break;
        }
        // 生成标签的 HTML
        positionLabelHTML = `<div class="card-position-label ${labelClass}"><span>${labelText}</span></div>`;
    }

    // --- 修改：将标签加入卡片 HTML (注意：标签在 card-img-box 上面) ---
    const cardHTML = `
    <div class="card-wrapper" style="animation-delay: ${index * 0.2}s">
        ${positionLabelHTML} 
        <div class="card-img-box">
            <img src="${card.img}" 
                 class="${isUpright ? '' : 'reversed-img'}" 
                 alt="${card.name}">
        </div>
        <div class="card-info">
            <div class="card-name">${card.name}</div>
            <div class="card-pos">${positionText}</div>
        </div>
    </div>
`;
    displayArea.innerHTML += cardHTML;

    // --- 修改：解牌文字也加上位置信息，更清晰 ---
    let meaningTitleText = `${index + 1}. ${card.name}`;
    if (count === 3) {
        const labels = ['原因', '结果', '建议'];
        meaningTitleText = `${labels[index]}：${card.name}`; // 例如：原因：愚者
    }

    const meaningHTML = `
        <div class="meaning-item">
            <h3>${meaningTitleText} (${positionText})</h3>
            <div class="meaning-text">${detailedMeaning}</div>
        </div>
    `;
    meaningArea.innerHTML += meaningHTML;
});

    // 动画结束后显示文字并滚动
    setTimeout(() => {
        meaningArea.style.display = 'block';
        meaningArea.scrollIntoView({ behavior: 'smooth' });
    }, 1000); // 1秒后弹出文字，给卡片“飞”一会儿的时间
}

// 2. 重置函数：回到最初的选择界面
function resetGame() {
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('user-query').value = ''; // 清空输入框
    const setupArea = document.getElementById('setup-area');
    const resultPage = document.getElementById('result-page');
    const displayArea = document.getElementById('display-area');
    
    resultPage.style.display = 'none';
    setupArea.style.display = 'flex';
    displayArea.innerHTML = ''; // 清空卡片，防止下次重叠
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 回到顶部
}