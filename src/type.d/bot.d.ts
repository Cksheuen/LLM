export interface SimpleBot {
    bot_id: string
    bot_name: string
    description: string
    icon_url: string
    publish_time: string
}

export interface BotObject {
    bot_id: string
    name: string
    description: string
    icon_url: string
    create_time: number
    update_time: number
    version: string
    prompt_info: PromptObject
    onboarding_info: OnboardingObject
    bot_mode: number
    plugin_info_list: PluginObject[]
    model_info: ModelObject
    knowledge: object
}

interface PromptObject {
    prompt: string
}

interface OnboardingObject {
    prologue: string
    suggested_questions: string[]
}

interface PluginObject {
    plugin_id: string
    name: string
    description: string
    icon_url: string
    api_info_list: PluginAPIObject[]
}

interface PluginAPIObject {
    api_id: string
    name: string
    description: string
}

interface ModelObject {
    model_id: string
    model_name: string
}

interface KnowledgeObject {
    knowledge_infos: KnowledgeInfoObject[]
}

interface KnowledgeInfoObject {
    id: string
    name: string
}