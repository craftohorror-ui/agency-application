import { TemplateData } from './templates'

export interface TemplateConfig {
  id: string
  name: string
  description: string
  component: React.ComponentType<{ data: TemplateData }>
  primaryColor: string
  secondaryColor: string
  supportsPdf: boolean
  supportsDocx: boolean
  version: string
}

class TemplateRegistryClass {
  private templates: Map<string, TemplateConfig> = new Map()

  register(config: TemplateConfig) {
    if (this.templates.has(config.id)) {
      console.warn(`Template with id ${config.id} is already registered. Overwriting.`)
    }
    this.templates.set(config.id, config)
  }

  getById(id: string): TemplateConfig | undefined {
    return this.templates.get(id)
  }

  getAll(): TemplateConfig[] {
    return Array.from(this.templates.values())
  }
}

export const TemplateRegistry = new TemplateRegistryClass()
