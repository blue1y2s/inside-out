export type Language = 'en' | 'zh';

export type TranslationKeys =
    | 'caged.status'
    | 'caged.instruction'
    | 'input.title'
    | 'input.subtitle'
    | 'input.preset.title'
    | 'input.custom.title'
    | 'input.placeholder'
    | 'input.button.materialize'
    | 'input.button.analyzing'
    | 'input.footer'
    | 'app.revise'
    | 'app.end_session'
    | 'tabs.target'
    | 'tabs.gap'
    | 'tabs.insights'
    | 'tabs.simulation';

export const translations: Record<Language, Record<TranslationKeys, string>> = {
    en: {
        'caged.status': 'Status: Dormant',
        'caged.instruction': 'Touch sphere to begin',
        'input.title': 'Mind Gallery',
        'input.subtitle': 'Curate Your Consciousness',
        'input.preset.title': 'Select an Exhibit',
        'input.custom.title': 'Or scatter your thoughts here:',
        'input.placeholder': 'What is blooming in your mind?',
        'input.button.materialize': 'Materialize',
        'input.button.analyzing': 'Analyzing...',
        'input.footer': 'Private Sanctuary • Local Storage',
        'app.revise': 'Revise',
        'app.end_session': 'End Session',
        'tabs.target': 'Target',
        'tabs.gap': 'Gap',
        'tabs.insights': 'Insights',
        'tabs.simulation': 'Simulation',
    },
    zh: {
        'caged.status': '状态:以此静默',
        'caged.instruction': '点击球体开始',
        'input.title': '思维画廊',
        'input.subtitle': '策展你的意识',
        'input.preset.title': '选择一个展品',
        'input.custom.title': '或在此挥洒思绪:',
        'input.placeholder': '你的脑海中正在绽放什么?',
        'input.button.materialize': '具象化',
        'input.button.analyzing': '分析中...',
        'input.footer': '私人圣所 • 本地存储',
        'app.revise': '修改',
        'app.end_session': '结束会话',
        'tabs.target': '目标',
        'tabs.gap': '差距',
        'tabs.insights': '洞察',
        'tabs.simulation': '模拟',
    }
};
