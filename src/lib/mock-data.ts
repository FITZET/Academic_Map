import type { AppData } from "./types";

export const initialData: AppData = {
  directions: [
    { id: "medical-imaging", name: "医学图像分割", description: "面向临床影像的分割、诊断与多模态表征", keywords: ["medical image segmentation", "radiology AI", "foundation model"], color: "#315e82", teacherCount: 4 },
    { id: "multimodal", name: "多模态学习", description: "视觉、语言与医疗数据的统一表征学习", keywords: ["multimodal learning", "vision language"], color: "#6b5d91", teacherCount: 4 },
    { id: "robotics", name: "机器人", description: "具身智能、机器人感知与操作", keywords: ["robotics", "embodied AI"], color: "#397b73", teacherCount: 2 },
    { id: "computer-vision", name: "计算机视觉", description: "视觉理解、生成与三维感知", keywords: ["computer vision", "generative vision"], color: "#986340", teacherCount: 5 },
    { id: "llm", name: "大语言模型", description: "基础模型、推理与可信 AI", keywords: ["large language model", "reasoning"], color: "#875b68", teacherCount: 3 },
  ],
  tags: [
    { id: "focus", name: "重点关注", color: "#9c3537", background: "#f9e7e7" },
    { id: "collab", name: "可能合作", color: "#315e82", background: "#e7f0f6" },
    { id: "met", name: "见过面", color: "#397b73", background: "#e5f2ef" },
    { id: "rising", name: "青年学者", color: "#876626", background: "#f7f0dc" },
    { id: "contact", name: "待联系", color: "#765687", background: "#f1eaf5" },
  ],
  teachers: [
    {
      id: "maya-chen", name: "陈玫雅", englishName: "Maya Chen", initials: "MC", title: "Associate Professor", institution: "Stanford University", department: "Biomedical Data Science", city: "Stanford", country: "美国", continent: "北美洲", latitude: 37.4275, longitude: -122.1697, email: "maya.chen@example.edu", homepage: "https://example.edu/maya-chen", scholarUrl: "https://scholar.google.com/", bio: "研究聚焦于可信医学影像基础模型、跨模态临床推理，以及面向真实医疗场景的小样本学习。", bioSource: "机构主页 · 已人工确认", bioApproved: true, directionIds: ["medical-imaging", "multimodal", "computer-vision"], tagIds: ["focus", "collab"], relevance: 96, lastUpdated: "今天 09:42", lastSynced: "2026-10-14 03:10", lockedFields: ["bio", "institution"], identities: [{ source: "OpenAlex", value: "A50218491", url: "https://openalex.org" }, { source: "ORCID", value: "0000-0002-1825-0097", url: "https://orcid.org" }, { source: "Google Scholar", value: "个人主页", url: "https://scholar.google.com" }], publications: [
        { id: "p1", title: "Reliable Multimodal Foundation Models for Longitudinal Clinical Imaging", authors: "M. Chen, A. Rao, J. Klein", year: 2026, venue: "MICCAI", doi: "10.1000/miccai.2026.101", citations: 18, source: "OpenAlex", discoveredAt: "2026-10-14", isNew: true, directionIds: ["medical-imaging", "multimodal"] },
        { id: "p2", title: "Uncertainty-aware Segmentation under Domain Shift", authors: "L. Park, M. Chen", year: 2025, venue: "IEEE TMI", doi: "10.1000/tmi.2025.231", citations: 74, source: "Semantic Scholar", discoveredAt: "2025-11-02", isImportant: true, directionIds: ["medical-imaging"] },
      ]
    },
    {
      id: "elena-rossi", name: "Elena Rossi", englishName: "Elena Rossi", initials: "ER", title: "Professor", institution: "ETH Zürich", department: "Computer Science", city: "Zürich", country: "瑞士", continent: "欧洲", latitude: 47.3769, longitude: 8.5417, homepage: "https://example.edu/elena-rossi", bio: "研究方向包括三维视觉、机器人感知与可解释的视觉语言模型。", bioSource: "ORCID · 待确认", bioApproved: false, directionIds: ["robotics", "computer-vision", "multimodal"], tagIds: ["collab", "met"], relevance: 92, lastUpdated: "昨天", lastSynced: "2026-10-14 03:12", lockedFields: ["tagIds"], identities: [{ source: "OpenAlex", value: "A11087324", url: "https://openalex.org" }, { source: "Semantic Scholar", value: "1842901", url: "https://www.semanticscholar.org" }], publications: [
        { id: "p3", title: "Language-guided 3D Scene Understanding for Generalist Robots", authors: "E. Rossi, T. Müller", year: 2026, venue: "CVPR", citations: 31, source: "OpenAlex", discoveredAt: "2026-10-13", isNew: true, directionIds: ["robotics", "computer-vision", "multimodal"] },
      ]
    },
    {
      id: "akira-sato", name: "佐藤 明", englishName: "Akira Sato", initials: "AS", title: "Professor", institution: "The University of Tokyo", department: "Information Science", city: "Tokyo", country: "日本", continent: "亚洲", latitude: 35.7128, longitude: 139.7619, bio: "致力于高效视觉基础模型、长上下文建模与科学智能。", bioSource: "机构主页 · 已人工确认", bioApproved: true, directionIds: ["computer-vision", "llm"], tagIds: ["focus"], relevance: 89, lastUpdated: "3 天前", lastSynced: "2026-10-14 03:15", lockedFields: ["name", "bio"], identities: [{ source: "ORCID", value: "0000-0001-5109-3700", url: "https://orcid.org" }], publications: [
        { id: "p4", title: "Long-context Visual Reasoning with Sparse Memory", authors: "A. Sato, Y. Mori", year: 2026, venue: "NeurIPS", citations: 9, source: "OpenAlex", discoveredAt: "2026-10-12", isNew: true, directionIds: ["computer-vision", "llm"] },
      ]
    },
    {
      id: "lin-yuxin", name: "林雨欣", englishName: "Yuxin Lin", initials: "YL", title: "研究员", institution: "清华大学", department: "自动化系", city: "北京", country: "中国", continent: "亚洲", latitude: 40.0003, longitude: 116.3269, bio: "研究医学视觉语言模型、弱监督分割与临床数据智能。", bioSource: "手动录入", bioApproved: true, directionIds: ["medical-imaging", "multimodal", "llm"], tagIds: ["rising", "contact"], relevance: 94, lastUpdated: "5 天前", lastSynced: "2026-10-14 03:17", lockedFields: ["bio", "title"], identities: [{ source: "OpenAlex", value: "A99230117", url: "https://openalex.org" }], publications: [
        { id: "p5", title: "Clinical Vision-Language Pretraining from Noisy Reports", authors: "Y. Lin, H. Zhao", year: 2026, venue: "Nature Machine Intelligence", citations: 22, source: "Crossref", discoveredAt: "2026-10-08", directionIds: ["medical-imaging", "multimodal"] },
      ]
    },
    {
      id: "jonas-berg", name: "Jonas Berg", englishName: "Jonas Berg", initials: "JB", title: "Assistant Professor", institution: "KTH Royal Institute of Technology", department: "Robotics, Perception and Learning", city: "Stockholm", country: "瑞典", continent: "欧洲", latitude: 59.3498, longitude: 18.0686, bio: "关注具身智能、触觉感知与可迁移机器人策略。", bioSource: "OpenAlex · 待确认", bioApproved: false, directionIds: ["robotics"], tagIds: ["rising"], relevance: 84, lastUpdated: "1 周前", lastSynced: "2026-10-14 03:20", lockedFields: [], identities: [{ source: "Semantic Scholar", value: "6820019", url: "https://www.semanticscholar.org" }], publications: [
        { id: "p6", title: "Tactile Policies that Transfer Across Robot Hands", authors: "J. Berg, S. Ali", year: 2025, venue: "CoRL", citations: 47, source: "Semantic Scholar", discoveredAt: "2025-09-22", directionIds: ["robotics"] },
      ]
    },
    {
      id: "sarah-williams", name: "Sarah Williams", englishName: "Sarah Williams", initials: "SW", title: "Professor", institution: "University of Toronto", department: "Computer Science", city: "Toronto", country: "加拿大", continent: "北美洲", latitude: 43.6629, longitude: -79.3957, bio: "研究生成式视觉模型、开放世界识别与负责任的人工智能。", bioSource: "机构主页 · 已人工确认", bioApproved: true, directionIds: ["computer-vision", "llm"], tagIds: ["focus"], relevance: 91, lastUpdated: "2 周前", lastSynced: "2026-10-14 03:22", lockedFields: ["bio"], identities: [{ source: "OpenAlex", value: "A44291810", url: "https://openalex.org" }, { source: "DBLP", value: "w/SarahWilliams", url: "https://dblp.org" }], publications: [
        { id: "p7", title: "Evaluating Open-world Safety in Generative Vision Systems", authors: "S. Williams, D. King", year: 2026, venue: "ICCV", citations: 12, source: "DBLP", discoveredAt: "2026-10-02", directionIds: ["computer-vision"] },
      ]
    },
  ],
  candidates: [
    { id: "c1", name: "Nora Haddad", initials: "NH", title: "Assistant Professor", institution: "University College London", city: "London", country: "英国", representativePaper: "Promptable Segmentation for Rare Pathologies", relevantPaperCount: 12, relevance: 94, reason: "近三年 12 篇相关论文，其中 5 篇发表于 MICCAI", inferredRole: "教师 · 高置信度", source: "OpenAlex + ORCID", ambiguity: "低", completeness: 91, status: "pending", directionId: "medical-imaging" },
    { id: "c2", name: "Carlos Mendes", initials: "CM", title: "Senior Researcher", institution: "University of São Paulo", city: "São Paulo", country: "巴西", representativePaper: "Self-supervised Volumetric Representation Learning", relevantPaperCount: 8, relevance: 88, reason: "与种子论文共享高频引用网络", inferredRole: "研究员 · 中置信度", source: "Semantic Scholar", ambiguity: "中", completeness: 76, status: "pending", directionId: "medical-imaging" },
    { id: "c3", name: "Priya Nair", initials: "PN", title: "Associate Professor", institution: "Indian Institute of Science", city: "Bengaluru", country: "印度", representativePaper: "Multimodal Reasoning for Low-resource Clinics", relevantPaperCount: 15, relevance: 91, reason: "主题高度匹配且持续发表，机构信息已交叉验证", inferredRole: "教师 · 高置信度", source: "OpenAlex + Semantic Scholar", ambiguity: "低", completeness: 94, status: "pending", directionId: "multimodal" },
  ],
  interactions: [
    { id: "i1", teacherId: "elena-rossi", date: "2026-07-18", location: "Vienna", eventName: "ECCV Workshop", type: "线下交流", content: "讨论了跨实验室共享机器人数据集的可能性。她对小规模但高质量的触觉数据很感兴趣。", hobbies: ["徒步", "胶片摄影"], impression: "表达直接、重视可复现实验。", followUp: "11 月发送数据协议草案。" },
  ],
};
