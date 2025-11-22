import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LandingLanguage = 'en' | 'de' | 'fr' | 'vi' | 'ja' | 'zh';

interface LandingI18nContextType {
  language: LandingLanguage;
  setLanguage: (lang: LandingLanguage) => void;
  t: (key: string) => string;
}

const LandingI18nContext = createContext<LandingI18nContextType | undefined>(undefined);

const LANDING_STORAGE_KEY = 'nomadsuite_landing_language';

export function LandingI18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LandingLanguage>(() => {
    const stored = localStorage.getItem(LANDING_STORAGE_KEY);
    if (stored && ['en', 'de', 'fr', 'vi', 'ja', 'zh'].includes(stored)) {
      return stored as LandingLanguage;
    }
    return 'en';
  });

  const setLanguage = (lang: LandingLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANDING_STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    const translations = landingTranslations[language];
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LandingI18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LandingI18nContext.Provider>
  );
}

export function useLandingI18n() {
  const context = useContext(LandingI18nContext);
  if (!context) {
    throw new Error('useLandingI18n must be used within LandingI18nProvider');
  }
  return context;
}

const landingTranslations: Record<LandingLanguage, any> = {
  en: {
    nav: {
      login: 'Log In',
      signup: 'Start Free'
    },
    banner: {
      badge: '🎉 MVP is LIVE!',
      text: 'Full-featured app available now • 100% free during testing • All features unlocked',
      cta: 'Try It Free →'
    },
    hero: {
      badgeAvailable: 'Available Now • Sign Up & Start Free',
      badgeWaitlist: 'Join waitlist for exclusive founding member perks',
      title1: 'Run your freelance business and global lifestyle—',
      title2: 'effortlessly',
      subtitle: 'Client CRM, invoices, travel & visa tracking, and tax-residency alerts—all from one powerful web-app.',
      subtitleBold: 'Use it free today.',
      ctaPrimary: 'Start Using It Free',
      ctaWaitlist: 'Join Waitlist for Perks',
      trust1: '40+ countries',
      trust2: 'Bank-level encryption',
      trust3: 'No credit card'
    },
    pricing: {
      title: 'Simple, transparent pricing',
      freeBadge: '🎉 All plans are FREE during MVP testing',
      freeText: 'Full features unlocked',
      waitlistHint: 'Join the waitlist for founding member perks when we launch paid tiers',
      monthly: 'Monthly',
      annually: 'Annually',
      save: 'Save 20%',
      ctaStart: 'Start Free Now',
      ctaWaitlist: 'Join Waitlist for Perks'
    },
    waitlist: {
      badge: 'Optional - Founding Member Perks',
      intro: 'Already using NomadSuite for free? Great! Join our founding member waitlist to lock in special perks, priority support, and exclusive discounts when we launch paid tiers.',
      title: 'Founding Member Waitlist',
      subtitle: 'Get exclusive perks and discounts when we transition from free MVP to paid plans',
      successTitle: "You're on the founding member list!",
      successText: "We'll notify you with exclusive founding member perks when we launch paid tiers. Keep enjoying all features free in the meantime!",
      successButton: 'Join another person',
      name: 'Name',
      email: 'Email Address',
      country: 'Country',
      role: 'I am a...',
      useCase: 'What would you use NomadSuite for? (Optional)',
      referral: 'How did you hear about us? (Optional)',
      emailConsent: 'I want to receive product updates and tips via email',
      contactConsent: 'I agree to be contacted for user research and feedback',
      submit: 'Join Waitlist',
      submitting: 'Submitting...',
      required: '*',
      placeholders: {
        name: 'Your full name',
        email: 'you@example.com',
        country: 'e.g., Portugal, Thailand, etc.',
        role: 'Select your role',
        useCase: 'Tell us about your business and travel needs...',
        referral: 'Enter code if you have one'
      },
      validation: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        roleRequired: 'Please select a role',
        emailConsentRequired: 'You must agree to receive updates'
      },
      toast: {
        successTitle: "Thank you! You're on the waitlist 🎉",
        successDesc: "We'll notify you when we launch with exclusive founding member pricing.",
        errorTitle: 'Error',
        errorDefault: 'Something went wrong, please try again.'
      }
    }
  },
  de: {
    nav: {
      login: 'Anmelden',
      signup: 'Kostenlos starten'
    },
    banner: {
      badge: '🎉 MVP ist LIVE!',
      text: 'Voll funktionsfähige App jetzt verfügbar • 100% kostenlos während der Testphase • Alle Funktionen freigeschaltet',
      cta: 'Kostenlos testen →'
    },
    hero: {
      badgeAvailable: 'Jetzt verfügbar • Kostenlos registrieren & starten',
      badgeWaitlist: 'Zur Warteliste für exklusive Gründungsmitglieder-Vorteile',
      title1: 'Führen Sie Ihr Freelance-Geschäft und globalen Lebensstil—',
      title2: 'mühelos',
      subtitle: 'Kunden-CRM, Rechnungen, Reise- & Visa-Tracking und Steuerresidenz-Warnungen—alles in einer leistungsstarken Web-App.',
      subtitleBold: 'Nutzen Sie es heute kostenlos.',
      ctaPrimary: 'Kostenlos nutzen',
      ctaWaitlist: 'Warteliste für Vorteile',
      trust1: '40+ Länder',
      trust2: 'Bank-Level-Verschlüsselung',
      trust3: 'Keine Kreditkarte'
    },
    pricing: {
      title: 'Einfache, transparente Preise',
      freeBadge: '🎉 Alle Pläne sind KOSTENLOS während der MVP-Testphase',
      freeText: 'Alle Funktionen freigeschaltet',
      waitlistHint: 'Treten Sie der Warteliste bei für Gründungsmitglieder-Vorteile bei Start der kostenpflichtigen Tarife',
      monthly: 'Monatlich',
      annually: 'Jährlich',
      save: '20% sparen',
      ctaStart: 'Jetzt kostenlos starten',
      ctaWaitlist: 'Warteliste für Vorteile'
    },
    waitlist: {
      badge: 'Optional - Gründungsmitglieder-Vorteile',
      intro: 'Nutzen Sie NomadSuite bereits kostenlos? Großartig! Treten Sie unserer Gründungsmitglieder-Warteliste bei, um besondere Vorteile, Priority Support und exklusive Rabatte zu sichern, wenn wir kostenpflichtige Tarife einführen.',
      title: 'Gründungsmitglieder-Warteliste',
      subtitle: 'Erhalten Sie exklusive Vorteile und Rabatte beim Übergang von kostenlosem MVP zu kostenpflichtigen Plänen',
      successTitle: 'Sie stehen auf der Gründungsmitglieder-Liste!',
      successText: 'Wir benachrichtigen Sie mit exklusiven Gründungsmitglieder-Vorteilen, wenn wir kostenpflichtige Tarife starten. Genießen Sie in der Zwischenzeit alle Funktionen kostenlos!',
      successButton: 'Weitere Person hinzufügen',
      name: 'Name',
      email: 'E-Mail-Adresse',
      country: 'Land',
      role: 'Ich bin ein...',
      useCase: 'Wofür würden Sie NomadSuite nutzen? (Optional)',
      referral: 'Wie haben Sie von uns erfahren? (Optional)',
      emailConsent: 'Ich möchte Produktupdates und Tipps per E-Mail erhalten',
      contactConsent: 'Ich stimme zu, für Nutzerforschung und Feedback kontaktiert zu werden',
      submit: 'Zur Warteliste',
      submitting: 'Wird übermittelt...',
      required: '*',
      placeholders: {
        name: 'Ihr vollständiger Name',
        email: 'sie@beispiel.de',
        country: 'z.B. Portugal, Thailand, usw.',
        role: 'Wählen Sie Ihre Rolle',
        useCase: 'Erzählen Sie uns von Ihren Geschäfts- und Reisebedürfnissen...',
        referral: 'Code eingeben, falls vorhanden'
      },
      validation: {
        nameRequired: 'Name ist erforderlich',
        emailRequired: 'E-Mail ist erforderlich',
        emailInvalid: 'Ungültige E-Mail-Adresse',
        roleRequired: 'Bitte wählen Sie eine Rolle',
        emailConsentRequired: 'Sie müssen zustimmen, Updates zu erhalten'
      },
      toast: {
        successTitle: 'Vielen Dank! Sie stehen auf der Warteliste 🎉',
        successDesc: 'Wir benachrichtigen Sie beim Start mit exklusiven Gründungsmitglieder-Preisen.',
        errorTitle: 'Fehler',
        errorDefault: 'Etwas ist schiefgelaufen, bitte versuchen Sie es erneut.'
      }
    }
  },
  fr: {
    nav: {
      login: 'Se connecter',
      signup: 'Commencer gratuitement'
    },
    banner: {
      badge: '🎉 MVP est EN LIGNE !',
      text: 'Application complète disponible maintenant • 100% gratuit pendant les tests • Toutes les fonctionnalités débloquées',
      cta: 'Essayez gratuitement →'
    },
    hero: {
      badgeAvailable: 'Disponible maintenant • Inscrivez-vous et commencez gratuitement',
      badgeWaitlist: "Rejoignez la liste d'attente pour des avantages exclusifs de membre fondateur",
      title1: 'Gérez votre entreprise freelance et votre style de vie mondial—',
      title2: 'sans effort',
      subtitle: 'CRM client, factures, suivi des voyages et visas, et alertes de résidence fiscale—tout depuis une application web puissante.',
      subtitleBold: "Utilisez-le gratuitement aujourd'hui.",
      ctaPrimary: 'Commencer à l\'utiliser gratuitement',
      ctaWaitlist: "Liste d'attente pour avantages",
      trust1: '40+ pays',
      trust2: 'Chiffrement de niveau bancaire',
      trust3: 'Pas de carte de crédit'
    },
    pricing: {
      title: 'Prix simples et transparents',
      freeBadge: '🎉 Tous les plans sont GRATUITS pendant les tests MVP',
      freeText: 'Toutes les fonctionnalités débloquées',
      waitlistHint: "Rejoignez la liste d'attente pour des avantages de membre fondateur lors du lancement des tarifs payants",
      monthly: 'Mensuel',
      annually: 'Annuel',
      save: 'Économisez 20%',
      ctaStart: 'Commencer gratuitement',
      ctaWaitlist: "Liste d'attente pour avantages"
    },
    waitlist: {
      badge: 'Optionnel - Avantages de membre fondateur',
      intro: "Vous utilisez déjà NomadSuite gratuitement ? Génial ! Rejoignez notre liste d'attente de membres fondateurs pour bénéficier d'avantages spéciaux, d'un support prioritaire et de réductions exclusives lors du lancement des tarifs payants.",
      title: "Liste d'attente des membres fondateurs",
      subtitle: 'Obtenez des avantages et réductions exclusifs lors de la transition du MVP gratuit aux plans payants',
      successTitle: 'Vous êtes sur la liste des membres fondateurs !',
      successText: "Nous vous informerons des avantages exclusifs de membre fondateur lors du lancement des tarifs payants. Continuez à profiter de toutes les fonctionnalités gratuitement en attendant !",
      successButton: 'Inscrire une autre personne',
      name: 'Nom',
      email: 'Adresse e-mail',
      country: 'Pays',
      role: 'Je suis un...',
      useCase: 'Pour quoi utiliseriez-vous NomadSuite ? (Optionnel)',
      referral: 'Comment avez-vous entendu parler de nous ? (Optionnel)',
      emailConsent: 'Je souhaite recevoir des mises à jour produit et des conseils par e-mail',
      contactConsent: 'J\'accepte d\'être contacté pour des recherches utilisateur et des retours',
      submit: "Rejoindre la liste d'attente",
      submitting: 'Envoi en cours...',
      required: '*',
      placeholders: {
        name: 'Votre nom complet',
        email: 'vous@exemple.fr',
        country: 'par ex. Portugal, Thaïlande, etc.',
        role: 'Sélectionnez votre rôle',
        useCase: 'Parlez-nous de vos besoins professionnels et de voyage...',
        referral: 'Entrez le code si vous en avez un'
      },
      validation: {
        nameRequired: 'Le nom est requis',
        emailRequired: 'L\'email est requis',
        emailInvalid: 'Adresse e-mail invalide',
        roleRequired: 'Veuillez sélectionner un rôle',
        emailConsentRequired: 'Vous devez accepter de recevoir des mises à jour'
      },
      toast: {
        successTitle: "Merci ! Vous êtes sur la liste d'attente 🎉",
        successDesc: 'Nous vous informerons lors du lancement avec des tarifs exclusifs de membre fondateur.',
        errorTitle: 'Erreur',
        errorDefault: 'Une erreur s\'est produite, veuillez réessayer.'
      }
    }
  },
  vi: {
    nav: {
      login: 'Đăng nhập',
      signup: 'Bắt đầu miễn phí'
    },
    banner: {
      badge: '🎉 MVP đã RA MẮT!',
      text: 'Ứng dụng đầy đủ tính năng hiện đã có sẵn • 100% miễn phí trong thời gian thử nghiệm • Tất cả tính năng đã mở khóa',
      cta: 'Dùng thử miễn phí →'
    },
    hero: {
      badgeAvailable: 'Đã có sẵn • Đăng ký và bắt đầu miễn phí',
      badgeWaitlist: 'Tham gia danh sách chờ để nhận đặc quyền thành viên sáng lập độc quyền',
      title1: 'Quản lý doanh nghiệp freelance và lối sống toàn cầu của bạn—',
      title2: 'dễ dàng',
      subtitle: 'CRM khách hàng, hóa đơn, theo dõi du lịch & visa, và cảnh báo cư trú thuế—tất cả từ một ứng dụng web mạnh mẽ.',
      subtitleBold: 'Sử dụng miễn phí ngay hôm nay.',
      ctaPrimary: 'Bắt đầu sử dụng miễn phí',
      ctaWaitlist: 'Tham gia danh sách chờ để nhận đặc quyền',
      trust1: '40+ quốc gia',
      trust2: 'Mã hóa cấp ngân hàng',
      trust3: 'Không cần thẻ tín dụng'
    },
    pricing: {
      title: 'Giá cả đơn giản, minh bạch',
      freeBadge: '🎉 Tất cả gói MIỄN PHÍ trong thời gian thử nghiệm MVP',
      freeText: 'Tất cả tính năng đã mở khóa',
      waitlistHint: 'Tham gia danh sách chờ để nhận đặc quyền thành viên sáng lập khi chúng tôi ra mắt gói trả phí',
      monthly: 'Hàng tháng',
      annually: 'Hàng năm',
      save: 'Tiết kiệm 20%',
      ctaStart: 'Bắt đầu miễn phí ngay',
      ctaWaitlist: 'Tham gia danh sách chờ để nhận đặc quyền'
    },
    waitlist: {
      badge: 'Tùy chọn - Đặc quyền thành viên sáng lập',
      intro: 'Đã sử dụng NomadSuite miễn phí? Tuyệt vời! Tham gia danh sách chờ thành viên sáng lập để khóa các đặc quyền đặc biệt, hỗ trợ ưu tiên và giảm giá độc quyền khi chúng tôi ra mắt gói trả phí.',
      title: 'Danh sách chờ thành viên sáng lập',
      subtitle: 'Nhận đặc quyền và giảm giá độc quyền khi chuyển từ MVP miễn phí sang gói trả phí',
      successTitle: 'Bạn đã có trong danh sách thành viên sáng lập!',
      successText: 'Chúng tôi sẽ thông báo cho bạn về các đặc quyền thành viên sáng lập độc quyền khi ra mắt gói trả phí. Hãy tiếp tục tận hưởng tất cả tính năng miễn phí trong thời gian chờ đợi!',
      successButton: 'Thêm người khác',
      name: 'Tên',
      email: 'Địa chỉ email',
      country: 'Quốc gia',
      role: 'Tôi là...',
      useCase: 'Bạn sẽ sử dụng NomadSuite để làm gì? (Tùy chọn)',
      referral: 'Bạn biết về chúng tôi qua đâu? (Tùy chọn)',
      emailConsent: 'Tôi muốn nhận cập nhật sản phẩm và mẹo qua email',
      contactConsent: 'Tôi đồng ý được liên hệ để nghiên cứu người dùng và phản hồi',
      submit: 'Tham gia danh sách chờ',
      submitting: 'Đang gửi...',
      required: '*',
      placeholders: {
        name: 'Họ và tên đầy đủ của bạn',
        email: 'ban@vidu.vn',
        country: 'ví dụ: Bồ Đào Nha, Thái Lan, v.v.',
        role: 'Chọn vai trò của bạn',
        useCase: 'Cho chúng tôi biết về nhu cầu kinh doanh và du lịch của bạn...',
        referral: 'Nhập mã nếu bạn có'
      },
      validation: {
        nameRequired: 'Tên là bắt buộc',
        emailRequired: 'Email là bắt buộc',
        emailInvalid: 'Địa chỉ email không hợp lệ',
        roleRequired: 'Vui lòng chọn vai trò',
        emailConsentRequired: 'Bạn phải đồng ý nhận cập nhật'
      },
      toast: {
        successTitle: "Cảm ơn! Bạn đã có trong danh sách chờ 🎉",
        successDesc: 'Chúng tôi sẽ thông báo cho bạn khi ra mắt với giá ưu đãi thành viên sáng lập.',
        errorTitle: 'Lỗi',
        errorDefault: 'Đã xảy ra lỗi, vui lòng thử lại.'
      }
    }
  },
  ja: {
    nav: {
      login: 'ログイン',
      signup: '無料で始める'
    },
    banner: {
      badge: '🎉 MVPがリリースされました！',
      text: 'フル機能アプリが現在利用可能 • テスト中は100%無料 • すべての機能がアンロック',
      cta: '無料で試す →'
    },
    hero: {
      badgeAvailable: '現在利用可能 • 無料でサインアップして開始',
      badgeWaitlist: '創設メンバー限定特典のウェイトリストに参加',
      title1: 'フリーランスビジネスとグローバルライフスタイルを—',
      title2: '簡単に',
      subtitle: 'クライアントCRM、請求書、旅行＆ビザ追跡、税務居住地アラート—すべて1つの強力なWebアプリから。',
      subtitleBold: '今日から無料で使用できます。',
      ctaPrimary: '無料で使い始める',
      ctaWaitlist: '特典のウェイトリストに参加',
      trust1: '40+カ国',
      trust2: '銀行レベルの暗号化',
      trust3: 'クレジットカード不要'
    },
    pricing: {
      title: 'シンプルで透明な料金体系',
      freeBadge: '🎉 MVPテスト中はすべてのプランが無料',
      freeText: 'すべての機能がアンロック',
      waitlistHint: '有料プランのローンチ時に創設メンバー特典を得るためにウェイトリストに参加',
      monthly: '月額',
      annually: '年額',
      save: '20%節約',
      ctaStart: '今すぐ無料で始める',
      ctaWaitlist: '特典のウェイトリストに参加'
    },
    waitlist: {
      badge: 'オプション - 創設メンバー特典',
      intro: 'すでにNomadSuiteを無料で使用していますか？素晴らしい！有料プランのローンチ時に特別特典、優先サポート、限定割引を確保するために、創設メンバーウェイトリストに参加してください。',
      title: '創設メンバーウェイトリスト',
      subtitle: '無料MVPから有料プランへの移行時に限定特典と割引を取得',
      successTitle: '創設メンバーリストに登録されました！',
      successText: '有料プランのローンチ時に限定創設メンバー特典をお知らせします。その間、すべての機能を無料でお楽しみください！',
      successButton: '別の人を追加',
      name: '名前',
      email: 'メールアドレス',
      country: '国',
      role: '私は...',
      useCase: 'NomadSuiteを何に使用しますか？（任意）',
      referral: 'どこで私たちを知りましたか？（任意）',
      emailConsent: '製品アップデートとヒントをメールで受け取りたい',
      contactConsent: 'ユーザー調査とフィードバックのために連絡されることに同意します',
      submit: 'ウェイトリストに参加',
      submitting: '送信中...',
      required: '*',
      placeholders: {
        name: 'フルネーム',
        email: 'you@example.jp',
        country: '例：ポルトガル、タイなど',
        role: '役割を選択',
        useCase: 'ビジネスと旅行のニーズについてお聞かせください...',
        referral: 'コードがあれば入力してください'
      },
      validation: {
        nameRequired: '名前は必須です',
        emailRequired: 'メールアドレスは必須です',
        emailInvalid: 'メールアドレスが無効です',
        roleRequired: '役割を選択してください',
        emailConsentRequired: '更新情報の受信に同意する必要があります'
      },
      toast: {
        successTitle: "ありがとうございます！ウェイトリストに登録されました 🎉",
        successDesc: '創設メンバー限定価格でローンチ時にお知らせします。',
        errorTitle: 'エラー',
        errorDefault: '問題が発生しました。もう一度お試しください。'
      }
    }
  },
  zh: {
    nav: {
      login: '登录',
      signup: '免费开始'
    },
    banner: {
      badge: '🎉 MVP已上线！',
      text: '全功能应用现已可用 • 测试期间100%免费 • 所有功能已解锁',
      cta: '免费试用 →'
    },
    hero: {
      badgeAvailable: '现已可用 • 注册并免费开始',
      badgeWaitlist: '加入候补名单获取专属创始会员福利',
      title1: '轻松管理您的自由职业业务和全球生活方式—',
      title2: '轻松自如',
      subtitle: '客户CRM、发票、旅行和签证跟踪、税务居住警报—全部来自一个强大的Web应用。',
      subtitleBold: '今天免费使用。',
      ctaPrimary: '开始免费使用',
      ctaWaitlist: '加入候补名单获取福利',
      trust1: '40+国家',
      trust2: '银行级加密',
      trust3: '无需信用卡'
    },
    pricing: {
      title: '简单透明的定价',
      freeBadge: '🎉 MVP测试期间所有计划免费',
      freeText: '所有功能已解锁',
      waitlistHint: '加入候补名单，在我们推出付费套餐时获得创始会员福利',
      monthly: '按月',
      annually: '按年',
      save: '节省20%',
      ctaStart: '立即免费开始',
      ctaWaitlist: '加入候补名单获取福利'
    },
    waitlist: {
      badge: '可选 - 创始会员福利',
      intro: '已经在免费使用NomadSuite了？太好了！加入我们的创始会员候补名单，在我们推出付费套餐时锁定特殊福利、优先支持和专属折扣。',
      title: '创始会员候补名单',
      subtitle: '在从免费MVP过渡到付费计划时获得专属福利和折扣',
      successTitle: '您已加入创始会员名单！',
      successText: '我们将在推出付费套餐时通知您专属创始会员福利。同时请继续免费享受所有功能！',
      successButton: '添加其他人',
      name: '姓名',
      email: '电子邮件地址',
      country: '国家',
      role: '我是...',
      useCase: '您会用NomadSuite做什么？（可选）',
      referral: '您是如何了解我们的？（可选）',
      emailConsent: '我想通过电子邮件接收产品更新和提示',
      contactConsent: '我同意被联系以进行用户研究和反馈',
      submit: '加入候补名单',
      submitting: '提交中...',
      required: '*',
      placeholders: {
        name: '您的全名',
        email: 'you@example.cn',
        country: '例如：葡萄牙、泰国等',
        role: '选择您的角色',
        useCase: '告诉我们您的业务和旅行需求...',
        referral: '如有推荐码请输入'
      },
      validation: {
        nameRequired: '姓名为必填项',
        emailRequired: '电子邮件为必填项',
        emailInvalid: '电子邮件地址无效',
        roleRequired: '请选择角色',
        emailConsentRequired: '您必须同意接收更新'
      },
      toast: {
        successTitle: "谢谢！您已加入候补名单 🎉",
        successDesc: '我们将在推出时通知您专属创始会员定价。',
        errorTitle: '错误',
        errorDefault: '出现问题，请重试。'
      }
    }
  }
};
