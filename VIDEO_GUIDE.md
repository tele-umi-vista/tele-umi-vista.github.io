# UMI-π 网站视频与素材替换指南

本文档说明各占位区域应放置的内容。素材就绪后，将文件放入 `assets/` 并更新 `index.html` 中对应路径。

## 目录建议

```
assets/
  videos/
    teaser.mp4              # Hero 全屏背景
    deploy_highlight.mp4      # Results 主视频
    phys_fail.mp4             # 对比滑块左侧
    phys_success.mp4          # 对比滑块右侧
  images/
    fig1_framework.png
    fig2_split_global.jpg
    fig2_split_fisheye.jpg
    fig3_vqa_examples.png
    fig4_validation.png
    fig5_histogram.png
  gifs/
    task_01_pick_place.gif
    ...
```

---

## 1. Hero Teaser（`#hero-video` / `data-slot="hero-teaser"`）

| 项 | 说明 |
|----|------|
| **用途** | 首屏全屏循环背景，建立「跨平台可部署」第一印象 |
| **时长** | 45–90 秒（网页可剪为 30–45 秒循环版） |
| **画幅** | 1920×1080，H.264 MP4，建议 <15MB |
| **镜头** | **仅手腕鱼眼视角**（与训练分布一致），不要混入第三人称镜头 |
| **内容结构** | 三款平台快切：**RealMan** → **AC one** → **Galaxea R1 Pro**，每平台 2–3 个不同任务成功片段（3–5 秒/段） |
| **建议任务** | 抓取放置、双臂协作、长视野移动操作、接触丰富操作（与论文 20 任务代表性一致） |
| **字幕** | 可选角标：平台名 + 任务名（英文） |
| **替换方式** | 取消 `index.html` 中 `<source src="assets/videos/teaser.mp4">` 注释；有 src 后占位层自动隐藏 |

---

## 2. 物理鸿沟对比滑块（`data-slot="phys-fail"` / `phys-success`）

| 侧 | 内容 |
|----|------|
| **左侧 Raw / Low Score** | Dataset 1 或 s_dc < 60：机器人在工作空间边界卡住、IK 无解、自碰撞、追踪抖动（参考论文 Fig. 6–7） |
| **右侧 Validated / High Score** | 同一任务语义下，验证后轨迹的**完整成功** rollout |
| **格式** | 同分辨率 MP4 或 WebP 动图，1280×720，**起始帧尽量对齐**便于对比 |
| **时长** | 5–15 秒，可循环 |

---

## 3. Results 主视频（`data-slot="results-teaser"`）

| 项 | 说明 |
|----|------|
| **与 Hero 区别** | Hero 偏「蒙太奇快切」；此处偏 **单条 uncut 自主执行**（论文级证据感） |
| **时长** | 15–30 秒 |
| **内容** | 1 条长视野任务 + 1 条接触丰富任务（或双腕画中画） |
| **要求** | 无人工干预、policy 端到端；可显示指令文字 overlay |

---

## 4. 横向滚动任务卡（`.result-card` × 9）

每个卡片替换 `.result-media` 内占位为 **GIF 或短 MP4**（建议 4:3，宽 640px，<3MB/条）：

| 卡片 | 建议素材 |
|------|----------|
| Pick & Place | 标准抓取—放置 |
| Precision Alignment | 高精度对齐/插入 |
| Long-Horizon | 多步骤长任务 |
| Contact-Rich | 接触丰富（开门、插拔等） |
| Bimanual Coordination | 双臂协作 |
| RealMan | 该平台代表任务 |
| AC one | 该平台代表任务 |
| R1 Pro | 该平台代表任务 |
| More Tasks | 其余任务拼图或轮播 |

---

## 5. 静态图（非视频）

| 占位 | 论文图 | 说明 |
|------|--------|------|
| `visual-global` | Fig. 2 左 | 全局/标准视角示意 |
| `visual-fisheye` | Fig. 2 右 | FastUMI Pro + 三平台手腕鱼眼 |
| `fig1-architecture` | Fig. 1 | 系统总览 |
| `fig3-vqa` | Fig. 3 | UMI-VQA 样例 Q&A |
| `fig4-validation` | Fig. 4 | Mink 验证流程 |
| `fig5-histogram` | Fig. 5 | 验证分数 vs 成功率 |

将 `<motion class="placeholder-box">` 换为 `<img src="assets/images/..." alt="...">` 即可。

---

## 6. 可选增强

- **Method Stage 2**：短动画演示 flow matching 去噪（非必须）
- **仿真表**：定稿后填入 `bench-table` 中 TBD 数值

---

## 上线前检查

- [ ] Paper / Code / Dataset / Models 链接替换 TODO
- [ ] 所有视频压缩并测试移动端自动播放（`muted playsinline`）
- [ ] 对比滑块两侧视频首帧对齐
