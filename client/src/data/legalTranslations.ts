export type LandingLanguage = 'en' | 'de' | 'fr' | 'vi' | 'ja' | 'zh';

export interface LegalPageTranslations {
  privacy: {
    title: string;
    lastUpdated: string;
    backToHome: string;
    acknowledgment: string;
  };
  terms: {
    title: string;
    lastUpdated: string;
    backToHome: string;
    acknowledgment: string;
  };
  common: {
    backToHome: string;
  };
}

export const legalTranslations: Record<LandingLanguage, LegalPageTranslations> = {
  en: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: November 20, 2025',
      backToHome: 'Back to Home',
      acknowledgment: 'By using NomadSuite, you acknowledge that you have read and understood this Privacy Policy.'
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: November 20, 2025',
      backToHome: 'Back to Home',
      acknowledgment: 'By using NomadSuite, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.'
    },
    common: {
      backToHome: 'Back to Home'
    }
  },
  de: {
    privacy: {
      title: 'Datenschutzrichtlinie',
      lastUpdated: 'Zuletzt aktualisiert: 20. November 2025',
      backToHome: 'Zurück zur Startseite',
      acknowledgment: 'Durch die Nutzung von NomadSuite bestätigen Sie, dass Sie diese Datenschutzrichtlinie gelesen und verstanden haben.'
    },
    terms: {
      title: 'Nutzungsbedingungen',
      lastUpdated: 'Zuletzt aktualisiert: 20. November 2025',
      backToHome: 'Zurück zur Startseite',
      acknowledgment: 'Durch die Nutzung von NomadSuite bestätigen Sie, dass Sie diese Nutzungsbedingungen gelesen, verstanden und akzeptiert haben.'
    },
    common: {
      backToHome: 'Zurück zur Startseite'
    }
  },
  fr: {
    privacy: {
      title: 'Politique de confidentialité',
      lastUpdated: 'Dernière mise à jour : 20 novembre 2025',
      backToHome: 'Retour à l\'accueil',
      acknowledgment: 'En utilisant NomadSuite, vous reconnaissez avoir lu et compris cette politique de confidentialité.'
    },
    terms: {
      title: 'Conditions d\'utilisation',
      lastUpdated: 'Dernière mise à jour : 20 novembre 2025',
      backToHome: 'Retour à l\'accueil',
      acknowledgment: 'En utilisant NomadSuite, vous reconnaissez avoir lu, compris et accepté ces conditions d\'utilisation.'
    },
    common: {
      backToHome: 'Retour à l\'accueil'
    }
  },
  vi: {
    privacy: {
      title: 'Chính sách bảo mật',
      lastUpdated: 'Cập nhật lần cuối: 20 tháng 11, 2025',
      backToHome: 'Quay lại trang chủ',
      acknowledgment: 'Bằng cách sử dụng NomadSuite, bạn xác nhận rằng bạn đã đọc và hiểu Chính sách bảo mật này.'
    },
    terms: {
      title: 'Điều khoản dịch vụ',
      lastUpdated: 'Cập nhật lần cuối: 20 tháng 11, 2025',
      backToHome: 'Quay lại trang chủ',
      acknowledgment: 'Bằng cách sử dụng NomadSuite, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân theo các Điều khoản dịch vụ này.'
    },
    common: {
      backToHome: 'Quay lại trang chủ'
    }
  },
  ja: {
    privacy: {
      title: 'プライバシーポリシー',
      lastUpdated: '最終更新日：2025年11月20日',
      backToHome: 'ホームに戻る',
      acknowledgment: 'NomadSuiteを使用することにより、このプライバシーポリシーを読み、理解したことを認めます。'
    },
    terms: {
      title: '利用規約',
      lastUpdated: '最終更新日：2025年11月20日',
      backToHome: 'ホームに戻る',
      acknowledgment: 'NomadSuiteを使用することにより、これらの利用規約を読み、理解し、同意したことを認めます。'
    },
    common: {
      backToHome: 'ホームに戻る'
    }
  },
  zh: {
    privacy: {
      title: '隐私政策',
      lastUpdated: '最后更新：2025年11月20日',
      backToHome: '返回首页',
      acknowledgment: '使用NomadSuite即表示您确认已阅读并理解本隐私政策。'
    },
    terms: {
      title: '服务条款',
      lastUpdated: '最后更新：2025年11月20日',
      backToHome: '返回首页',
      acknowledgment: '使用NomadSuite即表示您确认已阅读、理解并同意遵守这些服务条款。'
    },
    common: {
      backToHome: '返回首页'
    }
  }
};
