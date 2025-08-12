document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 初始化设置 (与 Python 脚本对应) ---
    const container = document.querySelector('.guidance-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); // willReadFrequently 优化 getImageData
    container.appendChild(canvas);
    canvas.id = 'guidanceCanvas';

    const text = "Guidance";
    const fontStyle = "700 200px Poppins"; // 对应 'Poppins-Bold', size=200

    // 颜色定义
    const COLOR_T2I = { r: 100, g: 180, b: 255 };
    const COLOR_T2V = { r: 200, g: 100, b: 255 };

    // --- 2. 测量文本并设置 Canvas 尺寸 ---
    // 必须等待字体加载完成
    document.fonts.load(fontStyle).then(() => {
        drawParticles();
    });

    function drawParticles() {
        ctx.font = fontStyle;
        const textMetrics = ctx.measureText(text);
        
        // 设置 Canvas 尺寸，增加一些 padding 以容纳辉光
        const padding = 40;
        canvas.width = textMetrics.width + padding * 2;
        const fontHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
        canvas.height = fontHeight + padding * 2;
        container.style.width = `${canvas.width}px`;
        container.style.height = `${canvas.height}px`;

        // --- 3. 获取文本像素坐标 ---
        ctx.font = fontStyle;
        ctx.fillStyle = "#fff";
        ctx.textBaseline = 'middle'; 
        ctx.fillText(text, padding, canvas.height / 2);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const pixelCoords = [];

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                if (data[(y * canvas.width + x) * 4 + 3] > 128) {
                    pixelCoords.push({ x, y });
                }
            }
        }

        // --- 4. 清空画布，准备绘制粒子 ---
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- 5. 绘制粒子和辉光 ---
        // 设置辉光效果 (对应 Python 的 GaussianBlur)
        ctx.shadowColor = 'rgba(200, 200, 255, 0.25)';
        ctx.shadowBlur = 15;

        // 与 Python 中 `// 4` 逻辑对应
        const numParticles = Math.floor(pixelCoords.length / 4); 

        for (let i = 0; i < numParticles; i++) {
            // 随机取样
            const pIndex = Math.floor(Math.random() * pixelCoords.length);
            const p = pixelCoords[pIndex];
            
            // 计算颜色渐变
            const ratio = (p.x - padding) / textMetrics.width;
            const r = Math.floor(COLOR_T2I.r * (1 - ratio) + COLOR_T2V.r * ratio);
            const g = Math.floor(COLOR_T2I.g * (1 - ratio) + COLOR_T2V.g * ratio);
            const b = Math.floor(COLOR_T2I.b * (1 - ratio) + COLOR_T2V.b * ratio);

            // 随机大小和亮度
            const size = [1, 2, 2, 3][Math.floor(Math.random() * 4)];
            const brightness = Math.random() * 0.4 + 0.6; // 0.6 to 1.0

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;

            // 绘制粒子
            ctx.beginPath();
            ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
});
