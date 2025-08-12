// 等待整个 DOM 加载完成后再执行脚本
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 初始化设置 (与 Python 脚本对应) ---
    const container = document.querySelector('.guidance-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    canvas.id = 'guidanceCanvas';

    const text = "Guidance";
    const fontStyle = "700 200px Poppins"; // 对应 'Poppins-Bold', size=200

    // 颜色定义 (与 Python 脚本对应)
    const COLOR_T2I = { r: 100, g: 180, b: 255 };
    const COLOR_T2V = { r: 200, g: 100, b: 255 };

    // --- 2. 测量文本并设置 Canvas 尺寸 ---
    ctx.font = fontStyle;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 250; // 根据 CSS 字体大小估算一个高度
    
    canvas.width = textWidth;
    canvas.height = textHeight;

    // --- 3. 获取文本像素坐标 (复刻 guidance_mask) ---
    // 先绘制文本
    ctx.font = fontStyle;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = 'middle'; // 垂直居中对齐
    ctx.fillText(text, 0, textHeight / 2);
    
    // 获取像素数据
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const pixelCoords = [];

    // 遍历所有像素，找到属于文本的像素
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            // 检查 alpha 通道，如果像素不透明，则它是文本的一部分
            if (data[(y * canvas.width + x) * 4 + 3] > 128) {
                pixelCoords.push({ x, y });
            }
        }
    }

    // --- 4. 清空画布，准备绘制粒子 ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- 5. 绘制粒子效果 (复刻 particle_layer) ---

    // 核心逻辑：复刻辉光效果 (GaussianBlur)
    // 在 Canvas 中，通过设置 context 的 shadow 属性来实现
    ctx.shadowColor = 'rgba(200, 200, 255, 0.3)';
    ctx.shadowBlur = 20; // 对应 GaussianBlur(10) 的视觉效果

    const numParticles = pixelCoords.length / 4; // 与 Python 中 `// 4` 一致

    for (let i = 0; i < numParticles; i++) {
        // 随机从像素坐标中取样
        const p = pixelCoords[Math.floor(Math.random() * pixelCoords.length)];
        
        // 计算颜色渐变
        const ratio = p.x / canvas.width;
        const r = Math.floor(COLOR_T2I.r * (1 - ratio) + COLOR_T2V.r * ratio);
        const g = Math.floor(COLOR_T2I.g * (1 - ratio) + COLOR_T2V.g * ratio);
        const b = Math.floor(COLOR_T2I.b * (1 - ratio) + COLOR_T2V.b * ratio);

        // 随机大小和亮度 (alpha)
        const size = [1, 2, 2, 3][Math.floor(Math.random() * 4)];
        const brightness = Math.random() * 0.5 + 0.5; // 0.5 to 1.0

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;

        // 绘制粒子 (用圆形代替椭圆，效果更佳)
        ctx.beginPath();
        ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
});
