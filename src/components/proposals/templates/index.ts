import { TemplateRegistry } from '@/lib/template-registry'

// 1. Import all template configurations here
import { modernAgencyConfig } from './modern-agency'
import { corporateConfig } from './corporate'
import { constructionConfig } from './construction'
import { executiveConfig } from './executive'
import { consultingConfig } from './consulting'
import { onePageConfig } from './one-page'

// New Templates
import { creativeAgencyConfig } from './creative-agency'
import { saasStartupConfig } from './saas-startup'
import { marketingGrowthConfig } from './marketing-growth'
import { luxuryPremiumConfig } from './luxury-premium'
import { minimalProfessionalConfig } from './minimal-professional'
import { techEnterpriseConfig } from './tech-enterprise'
import { creativePortfolioConfig } from './creative-portfolio'
import { darkExecutiveConfig } from './dark-executive'
import { legalServicesConfig } from './legal-services'
import { financialAdvisoryConfig } from './financial-advisory'
import { constructionPremiumConfig } from './construction-premium'
import { realEstateDevelopmentConfig } from './real-estate-development'
import { startupPitchDeckConfig } from './startup-pitch-deck'
import { digitalMarketingEliteConfig } from './digital-marketing-elite'
import { enterpriseConsultingConfig } from './enterprise-consulting'

// 2. Register them with the central registry
TemplateRegistry.register(modernAgencyConfig)
TemplateRegistry.register(corporateConfig)
TemplateRegistry.register(constructionConfig)
TemplateRegistry.register(executiveConfig)
TemplateRegistry.register(consultingConfig)
TemplateRegistry.register(onePageConfig)

// Register New Templates
TemplateRegistry.register(creativeAgencyConfig)
TemplateRegistry.register(saasStartupConfig)
TemplateRegistry.register(marketingGrowthConfig)
TemplateRegistry.register(luxuryPremiumConfig)
TemplateRegistry.register(minimalProfessionalConfig)
TemplateRegistry.register(techEnterpriseConfig)
TemplateRegistry.register(creativePortfolioConfig)
TemplateRegistry.register(darkExecutiveConfig)
TemplateRegistry.register(legalServicesConfig)
TemplateRegistry.register(financialAdvisoryConfig)
TemplateRegistry.register(constructionPremiumConfig)
TemplateRegistry.register(realEstateDevelopmentConfig)
TemplateRegistry.register(startupPitchDeckConfig)
TemplateRegistry.register(digitalMarketingEliteConfig)
TemplateRegistry.register(enterpriseConsultingConfig)
