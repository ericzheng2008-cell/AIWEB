<template>
  <div class="ai-agents-page">
    <Header />
    
    <!-- 椤堕儴Banner - 浼樺寲鐗?-->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-particles"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge" data-aos="fade-down">
          <el-icon><MagicStick /></el-icon>
          <span>AI椹卞姩鐨勬櫤鑳藉喅绛?/span>
        </div>
          <h1 data-aos="fade-up" data-aos-delay="100">鏄庡崌浼佷笟鏅鸿兘浣撶郴缁?/h1>
        <p class="subtitle" data-aos="fade-up" data-aos-delay="200">鍩轰簬浜哄伐鏅鸿兘鐨勪笓涓氬伐涓氳В鍐虫柟妗?| 鑷富瀛︿範路涓诲姩鎬濊€兟锋寔缁繘鍖?/p>
        <p class="description" data-aos="fade-up" data-aos-delay="300">
          閫氳繃AI鎶€鏈彁鍗囧伐涓氭晥鐜囷紝鎻愪緵鏅鸿兘鍖栫殑宸ュ叿閫夊瀷銆佽澶囩洃鎺с€佹晠闅滆拷韪拰鏁版嵁鍒嗘瀽鏈嶅姟
        </p>
        <div class="hero-stats" data-aos="fade-up" data-aos-delay="400">
          <div class="stat-box">
            <div class="stat-number">10+</div>
            <div class="stat-text">鏅鸿兘浣?/div>
          </div>
          <div class="stat-box">
            <div class="stat-number">98%</div>
            <div class="stat-text">鍑嗙‘鐜?/div>
          </div>
          <div class="stat-box">
            <div class="stat-number">24/7</div>
            <div class="stat-text">鍦ㄧ嚎鏈嶅姟</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">1000+</div>
            <div class="stat-text">浼佷笟浣跨敤</div>
          </div>
        </div>
        <div class="hero-actions" data-aos="fade-up" data-aos-delay="500">
          <el-button type="primary" size="large" round @click="scrollToAgents">
            <el-icon><Pointer /></el-icon>
            鎺㈢储鏅鸿兘浣?
          </el-button>
          <el-button size="large" round @click="showTour = true">
            <el-icon><VideoPlay /></el-icon>
            瑙傜湅婕旂ず
          </el-button>
        </div>
      </div>
    </section>

    <!-- 鏅鸿兘浣撳垪琛?-->
    <section class="agents-section" ref="agentsSection">
      <div class="container">
        <!-- 鍒嗙被鏍囩 -->
        <div class="category-tabs" data-aos="fade-up">
          <el-radio-group v-model="selectedCategory" size="large">
            <el-radio-button label="all">鍏ㄩ儴鏅鸿兘浣?/el-radio-button>
            <el-radio-button label="knowledge">鐭ヨ瘑绠＄悊</el-radio-button>
            <el-radio-button label="tool">宸ュ叿閫夊瀷</el-radio-button>
            <el-radio-button label="equipment">璁惧绠＄悊</el-radio-button>
            <el-radio-button label="analysis">鏁版嵁鍒嗘瀽</el-radio-button>
            <el-radio-button label="marketing">钀ラ攢绠＄悊</el-radio-button>
            <el-radio-button label="manufacturing">鏅鸿兘鍒堕€?/el-radio-button>
          </el-radio-group>
          <el-input 
            v-model="searchKeyword" 
            placeholder="鎼滅储鏅鸿兘浣?.." 
            clearable
            style="width: 300px;">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="agents-grid">
          <!-- 馃啎 浼佷笟鐭ヨ瘑搴?-->
          <div 
            class="agent-card highlight" 
            data-path="/ai-knowledge"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="100"
            data-category="knowledge">
            <div class="badge badge-new">
              <el-icon><Star /></el-icon>
              鏂颁笂绾?
            </div>
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><FolderOpened /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('knowledge-manager')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>浼佷笟鐭ヨ瘑搴?/h2>
            <p class="agent-desc">AI浼佷笟鐭ヨ瘑绠＄悊绯荤粺 - 璁粌AI鍔╂墜锛屾櫤鑳介棶绛旓紝涓氬姟鐭ヨ瘑搴撳垎绫荤鐞嗕笌妫€绱?/p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鐭ヨ瘑绠＄悊</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鏅鸿兘闂瓟</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI璁粌</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">7+</div>
                <div class="stat-label">鐭ヨ瘑鍒嗙被</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">24/7</div>
                <div class="stat-label">鏅鸿兘闂瓟</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              杩涘叆鐭ヨ瘑搴?
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 鏁板瓧鐩戞帶椹鹃┒鑸?-->
          <div 
            class="agent-card highlight" 
            data-path="/equipment-dashboard"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="200"
            data-category="equipment">
            <div class="badge badge-new">
              <el-icon><Star /></el-icon>
              鏂板姛鑳?
            </div>
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><DataAnalysis /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('equipment-dashboard')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>鏁板瓧鐩戞帶椹鹃┒鑸?/h2>
            <p class="agent-desc">鍙鍖栨暟瀛楃洃鎺т腑蹇冿紝瀹炴椂鐩戞帶璁惧鐘舵€併€佺淮鎶ゆ祦绋嬨€侀浂閰嶄欢璁㈣揣鐘舵€佺殑涓€绔欏紡绠＄悊骞冲彴</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>瀹炴椂鐩戞帶</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鍙鍖栨暟鎹?/span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鏅鸿兘棰勮</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">3涓?/div>
                <div class="stat-label">鐢ㄦ埛瑙嗚</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">24/7</div>
                <div class="stat-label">瀹炴椂鐩戞帶</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              杩涘叆椹鹃┒鑸?
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 璁惧鐢熷懡鍛ㄦ湡绠＄悊 -->
          <div 
            class="agent-card" 
            data-path="/equipment-lifecycle"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="300"
            data-category="equipment">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><Box /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('equipment-lifecycle')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>璁惧鍏ㄧ敓鍛藉懆鏈熺鐞?/h2>
            <p class="agent-desc">鍏抽敭璁惧璧勪骇绠＄悊銆丷OI鍒嗘瀽銆佷繚鍏婚娴嬨€佹垚鏈紭鍖栫殑鍏ㄦ柟浣嶈В鍐虫柟妗?/p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>璁惧妗ｆ</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>ROI鍒嗘瀽</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI淇濆吇棰勬祴</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">6澶х被</div>
                <div class="stat-label">鍏抽敭璁惧</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">30%鈫?/div>
                <div class="stat-label">闄嶆湰绌洪棿</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              绔嬪嵆浣跨敤
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 鎷х揣鏇茬嚎鍒嗘瀽 -->
          <div 
            class="agent-card" 
            data-path="/curve-analysis"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="500"
            data-category="analysis">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><TrendCharts /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('curve-analysis')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>鎷х揣鏇茬嚎瀵规瘮鍒嗘瀽</h2>
            <p class="agent-desc">涓撲笟鐨勬嫥绱ф洸绾垮垎鏋愬伐鍏凤紝鏀寔澶氭洸绾垮姣斻€佹櫤鑳借瘖鏂拰宸ヨ壓浼樺寲寤鸿</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鏇茬嚎瀵规瘮</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI璇婃柇</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>宸ヨ壓寤鸿</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">92%</div>
                <div class="stat-label">璇婃柇鍑嗙‘鐜?/div>
              </div>
              <div class="stat-item">
                <div class="stat-value">5绉?/div>
                <div class="stat-label">鍒嗘瀽閫熷害</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              绔嬪嵆浣跨敤
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 鎷х揣鏁版嵁閲囬泦鍒嗘瀽 -->
          <div 
            class="agent-card" 
            data-path="/tightening-data"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="600"
            data-category="analysis">
            <div class="card-glow"></div>
            <div class="agent-icon agent-icon-featured">
              <el-icon :size="64"><DataAnalysis /></el-icon>
              <el-tag type="danger" size="small" class="new-badge">鏂板姛鑳?/el-tag>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('tightening-data')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>鎷х揣鏁版嵁閲囬泦鍒嗘瀽</h2>
            <p class="agent-desc">鍩轰簬Open Protocol鍗忚锛屽疄鏃堕噰闆哖F4000/PF8000鎺у埗鍣ㄦ暟鎹紝鎻愪緵Cpk鍒嗘瀽銆佸紓甯告娴嬪拰鏅鸿兘鎶ヨ</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>Open Protocol</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>Cpk鍒嗘瀽</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鏅鸿兘鎶ヨ</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">10000</div>
                <div class="stat-label">鏁版嵁瀹归噺</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">瀹炴椂</div>
                <div class="stat-label">鏁版嵁閲囬泦</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              绔嬪嵆浣跨敤
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 浜у搧鎶€鏈攢鍞皬璇惧爞 -->
          <div 
            class="agent-card" 
            data-path="/tech-classroom"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="700"
            data-category="tool">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><Reading /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('tech-classroom')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>浜у搧鎶€鏈攢鍞皬璇惧爞</h2>
            <p class="agent-desc">鎷х揣宸ュ叿浜у搧鎶€鏈煡璇嗗簱锛屾兜鐩栦骇鍝佷粙缁嶃€佹妧鏈鏍笺€佸簲鐢ㄦ渚嬪拰甯歌闂瑙ｇ瓟</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>浜у搧鐭ヨ瘑</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鎶€鏈鏍?/span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>搴旂敤妗堜緥</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">100+</div>
                <div class="stat-label">鐭ヨ瘑鏉＄洰</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">24/7</div>
                <div class="stat-label">鍦ㄧ嚎瀛︿範</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              杩涘叆璇惧爞
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 鎷х揣宸ヨ壓鏀硅繘涓庨獙璇佹櫤鑳戒綋 -->
          <div 
            class="agent-card highlight" 
            data-path="/process-verification"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="800"
            data-category="analysis">
            <div class="badge badge-new">
              <el-icon><Star /></el-icon>
              鏂板姛鑳?
            </div>
            <div class="card-glow"></div>
            <div class="agent-icon agent-icon-featured">
              <el-icon :size="64"><Setting /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('process-verification')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>鎷х揣宸ヨ壓鏀硅繘涓庨獙璇?/h2>
            <p class="agent-desc">鍩轰簬PSE鎷х揣绋嬪簭鐨勬櫤鑳藉伐鑹哄垎鏋愪笌鍙傛暟鎺ㄨ崘绯荤粺锛屾敮鎸佹壄鐭┿€佽搴︺€丏S绛夊绉嶆帶鍒剁瓥鐣?/p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>PSE鍙傛暟鎺ㄨ崘</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>澶氱瓥鐣ュ垎鏋?/span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鏁版嵁搴撶鐞?/span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">3绉?/div>
                <div class="stat-label">鎺у埗绛栫暐</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">95%</div>
                <div class="stat-label">鎺ㄨ崘鍑嗙‘鐜?/div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              绔嬪嵆浣跨敤
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 鏁呴殰宸ュ崟绠＄悊鏅鸿兘浣?-->
          <div 
            class="agent-card" 
            data-path="/fault-tracking"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="900"
            data-category="equipment">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><List /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('fault-tracking')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>鏁呴殰宸ュ崟绠＄悊</h2>
            <p class="agent-desc">鍏ㄦ祦绋嬪伐鍗曠鐞嗙郴缁燂紝浠庡垱寤哄伐鍗曞埌缁翠慨杩借釜锛屽疄鐜板畬鏁寸殑鏁呴殰澶勭悊闂幆绠＄悊</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>宸ュ崟鍒涘缓</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>杩涘害杩借釜</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鍘嗗彶璁板綍</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">2灏忔椂</div>
                <div class="stat-label">骞冲潎鍝嶅簲</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">95%</div>
                <div class="stat-label">鎸夋椂瀹屾垚鐜?/div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              杩涘叆绯荤粺
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 鏄庡崌AICRM鏅鸿兘鍔╂墜 -->
          <div 
            class="agent-card highlight" 
            data-path="/mingsheng-aicrm"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="1000"
            data-category="marketing">
            <div class="badge badge-hot">
              <el-icon><Star /></el-icon>
              AI钀ラ攢
            </div>
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><User /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('mingsheng-aicrm')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>鏄庡崌AICRM鏅鸿兘鍔╂墜</h2>
            <p class="agent-desc">杞婚噺鍖栨櫤鑳藉鎴峰叧绯荤鐞嗙郴缁燂紝AI椹卞姩鍟嗘満绠＄悊銆佸鎴?60掳鐢诲儚銆佸崐鑷姩鎵ц</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>瀹㈡埛绠＄悊</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI棰勬祴</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鍟嗘満璺熻繘</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">360掳</div>
                <div class="stat-label">瀹㈡埛鐢诲儚</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">AI椹卞姩</div>
                <div class="stat-label">鏅鸿兘棰勬祴</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              杩涘叆绯荤粺
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 鏄庡崌AIMES鍔╂墜 -->
          <div 
            class="agent-card highlight" 
            data-path="/mingsheng-aicrm?tab=aimes"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="1100"
            data-category="manufacturing">
            <div class="badge badge-new">
              <el-icon><Star /></el-icon>
              鏂板姛鑳?
            </div>
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><Setting /></el-icon>
            </div>
            <el-tooltip content="鏌ョ湅浣跨敤鏁欑▼" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('aimes')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>鏄庡崌AIMES鍔╂墜</h2>
            <p class="agent-desc">AI MES绯荤粺 - 鐢熶骇鐜板満鎰熺煡銆佹櫤鑳芥帓浜с€佽川閲忔帶鍒躲€佽澶囨櫤鑳借繍缁?/p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>鏅鸿兘鍒堕€?/span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>MES绯荤粺</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI鎺掍骇</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">瀹炴椂</div>
                <div class="stat-label">鐢熶骇鎰熺煡</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">鏅鸿兘</div>
                <div class="stat-label">璐ㄩ噺鎺у埗</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              杩涘叆绯荤粺
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 闄勫姞鍔熻兘鍗＄墖 -->
        <div class="additional-features">
          <h2 class="section-title">鏇村鍔熻兘</h2>
          <div class="features-grid">
            <router-link to="/maintenance-history" class="feature-card">
              <el-icon :size="32"><Document /></el-icon>
              <h3>缁翠慨鍘嗗彶璁板綍</h3>
              <p>鏌ヨ鍘嗗彶缁翠慨璁板綍锛屽垎鏋愮淮淇秼鍔?/p>
            </router-link>
            <router-link to="/fault-statistics" class="feature-card">
              <el-icon :size="32"><DataAnalysis /></el-icon>
              <h3>鏁呴殰鐜囩粺璁?/h3>
              <p>鍏ㄩ潰鐨勬晠闅滄暟鎹粺璁″拰鍒嗘瀽</p>
            </router-link>
            <router-link to="/cost-optimization" class="feature-card">
              <el-icon :size="32"><Money /></el-icon>
              <h3>鎴愭湰浼樺寲鍒嗘瀽</h3>
              <p>鍩轰簬鏁版嵁鐨勯檷鏈鏁堟柟妗?/p>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  DataAnalysis, MagicStick, Pointer, VideoPlay, Search, 
  QuestionFilled, Star, Reading, Tools, Box, List, TrendCharts,
  Checked, ArrowRight, Document, Money, FolderOpened
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()

// 鐘舵€佺鐞?
const selectedCategory = ref('all')
const searchKeyword = ref('')
const showTour = ref(false)
const agentsSection = ref(null)

// 鍒濆鍖栧姩鐢?
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
  })
  
  // 寤惰繜搴旂敤鍒嗙被杩囨护锛岀‘淇滵OM瀹屽叏鍔犺浇
  nextTick(() => {
    applyFilter()
  })
})

// 搴旂敤鍒嗙被鍜屾悳绱㈣繃婊?
const applyFilter = () => {
  const cards = document.querySelectorAll('.agent-card')
  cards.forEach(card => {
    const category = card.getAttribute('data-category')
    const title = card.querySelector('h2')?.textContent || ''
    const desc = card.querySelector('.agent-desc')?.textContent || ''
    
    // 鍒嗙被杩囨护
    const matchCategory = selectedCategory.value === 'all' || category === selectedCategory.value
    
    // 鍏抽敭璇嶆悳绱㈣繃婊?
    const matchSearch = !searchKeyword.value || 
                       title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                       desc.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    // 鏄剧ず鎴栭殣钘忓崱鐗?
    if (matchCategory && matchSearch) {
      card.style.display = 'block'
    } else {
      card.style.display = 'none'
    }
  })
}

// 鐩戝惉鍒嗙被鍙樺寲
watch([selectedCategory, searchKeyword], () => {
  applyFilter()
})

// 婊氬姩鍒版櫤鑳戒綋鍖哄煙
const scrollToAgents = () => {
  agentsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 鍗＄墖鎮仠鏁堟灉
const onCardHover = (event) => {
  const card = event.currentTarget
  const glow = card.querySelector('.card-glow')
  if (glow) {
    glow.style.opacity = '1'
  }
}

const onCardLeave = (event) => {
  const card = event.currentTarget
  const glow = card.querySelector('.card-glow')
  if (glow) {
    glow.style.opacity = '0'
  }
}

// 鏄剧ず甯姪
const showHelp = (agentId) => {
  const helpContent = {
    'knowledge-manager': '馃摎 浼佷笟鐭ヨ瘑搴撶鐞哱n\n鍔熻兘璇存槑锛歕n1. 鍒嗙被鐭ヨ瘑绠＄悊锛堜骇鍝併€佷簨涓氶儴銆佸簲鐢ㄦ渚嬬瓑锛塡n2. 鍏抽敭璇嶆櫤鑳藉尮閰峔n3. 澶氳瑷€鐭ヨ瘑搴擄紙涓嫳鏂囷級\n4. AI鍔╂墜璁粌涓庝紭鍖朶n5. 鐭ヨ瘑搴撳鍏ュ鍑篭n\n閫傜敤鍦烘櫙锛氬鎴烽棶绛斻€佸憳宸ュ煿璁€佺煡璇嗘矇娣€銆丄I璁粌',
    'tool-selector': '馃敡 鎷х揣宸ュ叿閫夊瀷鏅鸿兘浣揬n\n鍔熻兘璇存槑锛歕n1. 濉啓宸ヨ壓闇€姹備俊鎭痋n2. AI鏅鸿兘鍖归厤鎺ㄨ崘宸ュ叿\n3. 鏌ョ湅璇︾粏宸ュ叿鍙傛暟\n4. 鐢熸垚闇€姹傛姤鍛奬n\n閫傜敤鍦烘櫙锛氭柊宸ヤ綅寤鸿銆佸伐鍏峰崌绾с€佸伐鑹轰紭鍖?,
    'equipment-dashboard': '馃搳 鏁板瓧鐩戞帶椹鹃┒鑸盶n\n鍔熻兘璇存槑锛歕n1. 瀹炴椂鐩戞帶璁惧鐘舵€乗n2. 缁存姢娴佺▼鍙鍖朶n3. 闆堕厤浠惰璐ц拷韪猏n4. 澶氳鑹茶鍥惧垏鎹n\n閫傜敤瑙掕壊锛氳澶囩鐞嗕汉鍛樸€佽澶囦娇鐢ㄤ汉鍛樸€佷緵搴斿晢鏈嶅姟浜哄憳',
    'equipment-lifecycle': '馃攧 璁惧鍏ㄧ敓鍛藉懆鏈熺鐞哱n\n鍔熻兘璇存槑锛歕n1. 璁惧妗ｆ绠＄悊\n2. ROI鎶曡祫鍥炴姤鍒嗘瀽\n3. AI淇濆吇棰勬祴\n4. 鎴愭湰浼樺寲寤鸿\n\n閫傜敤鍦烘櫙锛氳澶囬噰璐喅绛栥€佺淮鎶よ鍒掑埗瀹氥€佹垚鏈帶鍒?,
    'fault-tracking': '馃搵 鏁呴殰宸ュ崟绠＄悊\n\n鍔熻兘璇存槑锛歕n1. 鍒涘缓缁翠慨宸ュ崟\n2. 宸ュ崟鐘舵€佽拷韪猏n3. 缁翠慨杩涘害鏌ヨ\n4. 鍘嗗彶璁板綍鍒嗘瀽\n\n閫傜敤鍦烘櫙锛氳澶囨晠闅滄姤淇€佺淮淇繘搴︾鐞嗐€佹暟鎹粺璁″垎鏋?,
    'curve-analysis': '馃搱 鎷х揣鏇茬嚎瀵规瘮鍒嗘瀽\n\n鍔熻兘璇存槑锛歕n1. 涓婁紶鏇茬嚎鏁版嵁鏂囦欢\n2. 澶氭洸绾垮姣斿垎鏋怽n3. AI鏅鸿兘璇婃柇\n4. 宸ヨ壓浼樺寲寤鸿\n\n閫傜敤鍦烘櫙锛氳川閲忛棶棰樺垎鏋愩€佸伐鑹哄弬鏁颁紭鍖栥€侀棶棰樻帓鏌?,
    'tightening-data': '馃搳 鎷х揣鏁版嵁閲囬泦鍒嗘瀽\n\n鍔熻兘璇存槑锛歕n1. Open Protocol鍗忚鏁版嵁閲囬泦\n2. 瀹炴椂鏁版嵁鐩戞帶锛圥F4000/PF8000锛塡n3. Cpk杩囩▼鑳藉姏鍒嗘瀽\n4. 寮傚父妫€娴嬩笌鏅鸿兘鎶ヨ\n5. 鎷х揣鏇茬嚎鍙鍖朶n6. 鏁版嵁瀵煎嚭涓庣粺璁″垎鏋怽n\n閫傜敤鍦烘櫙锛氱敓浜ц繃绋嬬洃鎺с€佽川閲忔暟鎹垎鏋愩€佸伐鑹哄弬鏁颁紭鍖栥€侀闃叉€х淮鎶?,
    'tech-classroom': '馃摎 浜у搧鎶€鏈攢鍞皬璇惧爞\n\n鍔熻兘璇存槑锛歕n1. 鎷х揣宸ュ叿浜у搧鐭ヨ瘑搴揬n2. 鎶€鏈鏍艰缁嗕粙缁峔n3. 搴旂敤鍦烘櫙妗堜緥鍒嗕韩\n4. 甯歌闂蹇€熻В绛擻n5. 澶氱骇鍒嗙被鏌ヨ\n\n閫傜敤鍦烘櫙锛氫骇鍝佸涔犮€佹妧鏈煿璁€侀攢鍞敮鎸併€佸鎴峰挩璇?,
    'process-verification': '鈿欙笍 鎷х揣宸ヨ壓鏀硅繘涓庨獙璇佹櫤鑳戒綋\n\n鍔熻兘璇存槑锛歕n1. 澶氱淮搴﹀伐鑹烘潯浠剁瓫閫夛紙宸ヤ綅銆佸伐鍏枫€佽灪鏍撱€佹潗鏂欙級\n2. PSE鎷х揣绋嬪簭鍙傛暟鏅鸿兘鎺ㄨ崘\n3. 涓夌鎺у埗绛栫暐鍒嗘瀽锛堟壄鐭?瑙掑害/DS鎺у埗锛塡n4. 鎷х揣鏇茬嚎鍙鍖栭瑙圽n5. 宸ヨ壓鏀硅繘寤鸿鐢熸垚\n6. 鎷х揣娴嬮噺鏁版嵁搴撶鐞哱n\n鎺у埗绛栫暐锛歕n鈥?鎵煩鎺у埗锛氶€傜敤浜庡垰鎬ц繛鎺ワ紝鎵煩绮惧害楂榎n鈥?瑙掑害鎺у埗锛氶€傜敤浜庤蒋杩炴帴銆侀暱铻烘爴\n鈥?DS鎺у埗锛氬弻閲嶆帶鍒讹紝缁煎悎鎵煩鍜岃搴︿紭鍔縗n\n閫傜敤鍦烘櫙锛歕n- 鏂板伐鑹哄紑鍙戜笌楠岃瘉\n- 鐜版湁宸ヨ壓鍙傛暟浼樺寲\n- 鎷х揣闂鍒嗘瀽涓庢敼杩沑n- PSE绋嬪簭鍙傛暟璁剧疆鎸囧\n- 鎷х揣鏁版嵁绠＄悊涓庤拷婧?
  }
  
  ElMessageBox.alert(helpContent[agentId] || '鍔熻兘浠嬬粛寮€鍙戜腑...', '浣跨敤甯姪', {
    confirmButtonText: '鐭ラ亾浜?,
    type: 'info',
    center: true
  })
}

// 璺宠浆鍒版櫤鑳戒綋椤甸潰
const goToAgent = (path) => {
  router.push(path)
  ElMessage.success('姝ｅ湪杩涘叆鏅鸿兘浣?..')
}

// 馃敟 缁戝畾鎵€鏈夊崱鐗囩殑鍘熺敓瑙︽懜浜嬩欢
const bindAgentCardEvents = () => {
  const cards = document.querySelectorAll('.agent-card[data-path]')
  console.log(`馃攳 鎵惧埌 ${cards.length} 涓櫤鑳戒綋鍗＄墖`)
  
  cards.forEach((card, index) => {
    const path = card.getAttribute('data-path')
    if (!path) return
    
    let touchStartY = 0
    let touchStartTime = 0
    
    // 瑙︽懜寮€濮?
    card.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
    }, { passive: true })
    
    // 瑙︽懜缁撴潫
    card.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchDuration = Date.now() - touchStartTime
      const moveDistance = Math.abs(touchEndY - touchStartY)
      
      // 馃幆 鍙湁绉诲姩璺濈 < 10px 涓旀椂闀?< 300ms 鎵嶇畻鐐瑰嚮
      if (moveDistance < 10 && touchDuration < 300) {
        console.log(`鉁?鏅鸿兘浣撳崱鐗?[${path}] 鐪熷疄鐐瑰嚮瑙﹀彂`)
        e.preventDefault()
        e.stopPropagation()
        goToAgent(path)
      } else {
        console.log(`鈿狅笍 鏅鸿兘浣撳崱鐗?[${path}] 婊氬姩蹇界暐 (绉诲姩${moveDistance}px)`)
      }
    }, { passive: false })
    
    // 妗岄潰绔偣鍑?
    card.addEventListener('click', (e) => {
      // 濡傛灉鏄Щ鍔ㄧ锛屼笉澶勭悊锛堜娇鐢?touchend锛?
      if ('ontouchstart' in window) {
        e.preventDefault()
        return
      }
      
      console.log(`馃柋锔?鏅鸿兘浣撳崱鐗?[${path}] 鐐瑰嚮瑙﹀彂`)
      goToAgent(path)
    }, { passive: false })
    
    console.log(`鉁?鏅鸿兘浣撳崱鐗?${index + 1} 浜嬩欢缁戝畾瀹屾垚 (path: ${path})`)
  })
}

// 缁勪欢鎸傝浇鍚庣粦瀹氫簨浠?
onMounted(() => {
  nextTick(() => {
    bindAgentCardEvents()
  })
})

</script>

<style scoped>
.ai-agents-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 椤堕儴Banner - 澧炲己鐗?*/
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 0 100px;
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px, 100px 100px;
  background-position: 0 0, 25px 25px;
  animation: particlesMove 20s linear infinite;
}

@keyframes particlesMove {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(50px);
  }
}

.hero-gradient {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: gradientRotate 15s linear infinite;
}

@keyframes gradientRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-content h1 {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -1px;
}

.hero-content .subtitle {
  font-size: 24px;
  margin-bottom: 16px;
  opacity: 0.95;
  font-weight: 500;
}

.hero-content .description {
  font-size: 16px;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.8;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-box {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.stat-text {
  font-size: 14px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-actions .el-button {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
}

/* 鏅鸿兘浣撳崱鐗囧尯鍩?*/
.agents-section {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 鍒嗙被鏍囩 */
.category-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 80px;
}

.agent-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.agent-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

.agent-card:hover .card-glow {
  opacity: 1;
}

.agent-card.highlight {
  border-color: #52c41a;
  background: linear-gradient(135deg, #fff 0%, #f6ffed 100%);
}

.badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #52c41a;
  color: #fff;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
}

.badge-new {
  display: flex;
  align-items: center;
  gap: 4px;
  animation: badgePulse 2s infinite;
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(82, 196, 26, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(82, 196, 26, 0.8);
  }
}

.help-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e8e8e8;
}

.agent-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #fff;
  transition: all 0.3s ease;
  position: relative;
}

.agent-icon-featured {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  animation: iconPulse 2s infinite;
}

@keyframes iconPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 107, 107, 0.6);
  }
}

.new-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 8px;
  animation: badgeBounce 1s infinite;
}

@keyframes badgeBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.agent-card:hover .agent-icon {
  transform: scale(1.1) rotate(5deg);
}

.agent-card.highlight .agent-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.agent-card h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
  transition: color 0.3s ease;
  line-height: 1.3;
}

.agent-card:hover h2 {
  color: #1890ff;
}

.agent-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.agent-features {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #333;
  background: #f5f7fa;
  padding: 4px 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.agent-card:hover .feature-item {
  background: #e6f7ff;
  color: #1890ff;
}

.feature-item .el-icon {
  color: #52c41a;
}

.agent-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: #999;
}

.action-btn {
  width: 100%;
  height: 38px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateX(4px);
}

/* 闄勫姞鍔熻兘 */
.additional-features {
  margin-top: 60px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #1a1a1a;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

.feature-card .el-icon {
  color: #1890ff;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.feature-card:hover .el-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.feature-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 鍝嶅簲寮忚璁?*/
@media (max-width: 1200px) {
  .hero-content h1 {
    font-size: 48px;
  }
  
  .agents-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }
  
  .hero-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .category-tabs {
    flex-direction: column;
    gap: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .agent-card {
    padding: 24px;
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
