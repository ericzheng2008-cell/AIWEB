<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-section company-info">
        <h3>{{ footerConfig.companyInfo.name[locale] }}</h3>
        <p class="company-desc">
          {{ footerConfig.companyInfo.description[locale] }}
        </p>
        <div class="certifications-footer">
          <span v-for="(cert, index) in footerConfig.companyInfo.certifications" :key="index">{{ cert }}</span>
        </div>
      </div>

      <div class="footer-section">
        <h4>{{ t('footer.products') }}</h4>
        <ul>
          <li v-for="cat in productCategories.slice(0, 5)" :key="cat.id">
            <router-link :to="`/product-category/${cat.id}`">{{ cat.name[locale] }}</router-link>
          </li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>{{ t('footer.solutions') }}</h4>
        <ul>
          <li><router-link to="/solutions?id=1">{{ t('footer.automotive') }}</router-link></li>
          <li><router-link to="/solutions?id=2">{{ t('footer.manufacturing') }}</router-link></li>
          <li><router-link to="/solutions?id=3">{{ t('footer.aerospace') }}</router-link></li>
          <li><router-link to="/solutions?id=4">{{ t('footer.energy') }}</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>{{ t('footer.about') }}</h4>
        <ul>
          <li><router-link to="/about">{{ t('footer.aboutUs') }}</router-link></li>
          <li><router-link to="/about#history">{{ t('footer.history') }}</router-link></li>
          <li><router-link to="/about#team">{{ t('footer.team') }}</router-link></li>
          <li><router-link to="/contact">{{ t('footer.contact') }}</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>{{ t('footer.contactInfo') }}</h4>
        <ul class="contact-info">
          <li><el-icon><Phone /></el-icon> {{ footerConfig.contact.phone }}</li>
          <li><el-icon><Message /></el-icon> {{ footerConfig.contact.email }}</li>
          <li><el-icon><Location /></el-icon> {{ footerConfig.contact.address[locale] }}</li>
        </ul>
        <h4 style="margin-top: 20px;">{{ t('footer.serviceNetwork') }}</h4>
        <p class="service-cities">{{ footerConfig.serviceCities[locale] }}</p>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-container">
        <p>&copy; {{ footerConfig.copyright[locale] }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'

const { t, locale } = useI18n()
const cmsStore = useCmsAdvancedStore()

const footerConfig = computed(() => cmsStore.footerConfig)
const productCategories = computed(() => cmsStore.productCategories)
</script>

<style scoped>
.site-footer {
  background: #1a1a1a;
  color: #d0d0d0;
  padding-top: 60px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr 1.5fr;
  gap: 50px;
}

.company-info h3 {
  font-size: 26px;
  margin-bottom: 16px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 2px;
}

.company-desc {
  color: #999;
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: 14px;
}

.certifications-footer {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.certifications-footer span {
  background: #2a2a2a;
  color: #1890ff;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #333;
}

.footer-section h4 {
  font-size: 16px;
  margin-bottom: 20px;
  color: #fff;
  font-weight: 600;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: #999;
  transition: color 0.3s;
  font-size: 14px;
}

.footer-section ul li a:hover {
  color: #1890ff;
}

.contact-info li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
  font-size: 14px;
}

.service-cities {
  color: #666;
  font-size: 13px;
  line-height: 1.8;
}

.footer-bottom {
  margin-top: 50px;
  padding: 25px 0;
  border-top: 1px solid #2a2a2a;
  text-align: center;
  color: #666;
  font-size: 13px;
}
</style>
