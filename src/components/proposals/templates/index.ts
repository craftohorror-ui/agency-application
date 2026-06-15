import { TemplateRegistry } from '@/lib/template-registry'

// 1. Import all template configurations here
import { modernAgencyConfig } from './modern-agency'
import { corporateConfig } from './corporate'
import { constructionConfig } from './construction'
import { executiveConfig } from './executive'
import { consultingConfig } from './consulting'
import { onePageConfig } from './one-page'

// 2. Register them with the central registry
TemplateRegistry.register(modernAgencyConfig)
TemplateRegistry.register(corporateConfig)
TemplateRegistry.register(constructionConfig)
TemplateRegistry.register(executiveConfig)
TemplateRegistry.register(consultingConfig)
TemplateRegistry.register(onePageConfig)

// To add a new template in the future:
// import { newTemplateConfig } from './new-template'
// TemplateRegistry.register(newTemplateConfig)
