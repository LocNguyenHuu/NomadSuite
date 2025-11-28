export type LandingLanguage = 'en' | 'de' | 'fr' | 'vi' | 'ja' | 'zh';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQTranslations {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export const faqTranslations: Record<LandingLanguage, FAQTranslations> = {
  en: {
    title: 'Frequently asked questions',
    subtitle: 'Everything you need to know about NomadSuite',
    items: [
      {
        question: 'Is NomadSuite legal or tax advice?',
        answer: 'No, NomadSuite provides informational tools only. We help you track and organize your data, but we are not tax advisors or legal professionals. Always consult a qualified tax professional or legal advisor for advice specific to your situation and jurisdiction.'
      },
      {
        question: 'How does the 183-day tax residency tracker work?',
        answer: 'Our residency tracker automatically counts the days you spend in each country based on your travel log entries. Many countries use the 183-day rule to determine tax residency—if you spend 183+ days in a country during a calendar year, you may become a tax resident there. NomadSuite shows you real-time counts and alerts you when approaching thresholds, but tax rules vary by country, so always verify with a tax professional.'
      },
      {
        question: 'What is the Schengen 90/180 rule and how do you track it?',
        answer: 'The Schengen 90/180 rule means you can stay in the Schengen Area for up to 90 days within any 180-day rolling period without a visa (for most nationalities). NomadSuite automatically calculates your remaining days by analyzing your travel entries and exit dates across all 27 Schengen countries. We show you exactly how many days you have left and when your counter resets.'
      },
      {
        question: 'Which countries are supported for travel and visa tracking?',
        answer: 'All countries worldwide are supported. You can log trips to any location globally, and we\'ll track your days in each country. We have specialized calculators for Schengen area, US tax residency rules (substantial presence test), and major digital nomad visa programs (Portugal D7, Spain digital nomad visa, Estonia e-Residency, etc.).'
      },
      {
        question: 'How secure is my data?',
        answer: 'Security is our top priority. We use AES-256 encryption (the same standard used by banks and government institutions) for all data at rest. All data in transit is encrypted with TLS/SSL. We\'re fully GDPR-compliant and undergo regular security audits. Your documents, passport scans, and financial data are stored in secure, encrypted databases. We never sell your data to third parties.'
      },
      {
        question: 'Can I import existing client data and invoices?',
        answer: 'Yes! Paid plan users can import data via CSV upload. We support imports from popular tools like Excel, Google Sheets, and other CRMs. You can bulk-import clients, past invoices, and travel history. Our support team can also help with custom migration from other platforms.'
      },
      {
        question: 'What are the pricing plans?',
        answer: 'We offer flexible pricing: Free plan for getting started, Nomad Pro at $20/month or $199/year (17% savings), and a special Early-Bird rate of $159/year for early adopters. During our MVP phase, all features are free to use. No credit card required to start.'
      },
      {
        question: 'Can I use NomadSuite if I work with a team or have employees?',
        answer: 'Yes! NomadSuite supports workspace collaboration. You can invite team members, assign roles (admin, user), and manage client relationships together. Each workspace member gets their own travel tracking and document vault, while sharing access to the client CRM and invoicing system.'
      },
      {
        question: 'What happens to my data if I cancel my subscription?',
        answer: 'You keep full access to your data even after canceling. You can export all your information (clients, invoices, travel logs, documents) as CSV/PDF files at any time. We retain your data for 90 days after cancellation in case you want to reactivate. After 90 days, data is permanently deleted from our servers unless you request an extension.'
      },
      {
        question: 'Can I cancel anytime? Are there long-term contracts?',
        answer: 'Yes, you can cancel anytime with a single click in your account settings. We offer monthly billing with no long-term contracts or commitments. There are no cancellation fees, and you can downgrade to Free at any time. Annual plans offer savings and can be canceled with a prorated refund.'
      },
      {
        question: 'How do visa expiry alerts work?',
        answer: 'When you upload visa documents, work permits, or residency cards, you can set expiry dates. You\'ll receive email and in-app notifications 90 days, 30 days, and 7 days before any document expires. You can also set custom reminder schedules. This ensures you never miss a renewal deadline.'
      },
      {
        question: 'Is there a mobile app?',
        answer: 'Currently, NomadSuite is a web application that works perfectly on mobile browsers (fully responsive design). Native iOS and Android apps are planned for future release. You can add the web app to your home screen on iPhone/Android for an app-like experience.'
      }
    ]
  },
  de: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Alles, was Sie über NomadSuite wissen müssen',
    items: [
      {
        question: 'Ist NomadSuite eine Rechts- oder Steuerberatung?',
        answer: 'Nein, NomadSuite bietet nur Informationswerkzeuge. Wir helfen Ihnen, Ihre Daten zu verfolgen und zu organisieren, aber wir sind keine Steuerberater oder Rechtsanwälte. Konsultieren Sie immer einen qualifizierten Steuerberater oder Rechtsanwalt für spezifische Beratung zu Ihrer Situation und Gerichtsbarkeit.'
      },
      {
        question: 'Wie funktioniert der 183-Tage-Steuerresidenz-Tracker?',
        answer: 'Unser Residenz-Tracker zählt automatisch die Tage, die Sie in jedem Land verbringen, basierend auf Ihren Reiselogeinträgen. Viele Länder verwenden die 183-Tage-Regel zur Bestimmung der Steuerresidenz—wenn Sie 183+ Tage in einem Land während eines Kalenderjahres verbringen, können Sie dort steuerpflichtig werden. NomadSuite zeigt Ihnen Echtzeit-Zählungen und warnt Sie bei Annäherung an Schwellenwerte, aber Steuerregeln variieren je nach Land, also überprüfen Sie immer mit einem Steuerberater.'
      },
      {
        question: 'Was ist die Schengen 90/180-Regel und wie verfolgen Sie sie?',
        answer: 'Die Schengen 90/180-Regel bedeutet, dass Sie bis zu 90 Tage innerhalb jeder rollierenden 180-Tage-Periode im Schengen-Raum ohne Visum bleiben können (für die meisten Nationalitäten). NomadSuite berechnet automatisch Ihre verbleibenden Tage durch Analyse Ihrer Reiseeinträge und Ausreisedaten in allen 27 Schengen-Ländern. Wir zeigen Ihnen genau, wie viele Tage Sie noch haben und wann Ihr Zähler zurückgesetzt wird.'
      },
      {
        question: 'Welche Länder werden für Reise- und Visumverfolgung unterstützt?',
        answer: 'Alle Länder weltweit werden unterstützt. Sie können Reisen an jeden Ort weltweit protokollieren, und wir verfolgen Ihre Tage in jedem Land. Wir haben spezialisierte Rechner für den Schengen-Raum, US-Steuerresidenzregeln (Substantial Presence Test) und wichtige digitale Nomaden-Visa-Programme (Portugal D7, Spanien Digital Nomad Visa, Estland e-Residency, etc.).'
      },
      {
        question: 'Wie sicher sind meine Daten?',
        answer: 'Sicherheit hat für uns höchste Priorität. Wir verwenden AES-256-Verschlüsselung (der gleiche Standard, der von Banken und Regierungsinstitutionen verwendet wird) für alle ruhenden Daten. Alle übertragenen Daten sind mit TLS/SSL verschlüsselt. Wir sind vollständig DSGVO-konform und unterziehen uns regelmäßigen Sicherheitsprüfungen. Ihre Dokumente, Passscans und Finanzdaten werden in sicheren, verschlüsselten Datenbanken gespeichert. Wir verkaufen Ihre Daten niemals an Dritte.'
      },
      {
        question: 'Kann ich bestehende Kundendaten und Rechnungen importieren?',
        answer: 'Ja! Benutzer mit kostenpflichtigem Plan können Daten per CSV-Upload importieren. Wir unterstützen Importe aus beliebten Tools wie Excel, Google Sheets und anderen CRMs. Sie können Kunden, vergangene Rechnungen und Reisehistorie in großen Mengen importieren. Unser Support-Team kann auch bei der benutzerdefinierten Migration von anderen Plattformen helfen.'
      },
      {
        question: 'Was sind die Preispläne?',
        answer: 'Wir bieten flexible Preise: Kostenloser Plan zum Einstieg, Nomad Pro für $20/Monat oder $199/Jahr (17% Ersparnis), und einen speziellen Early-Bird-Tarif von $159/Jahr für frühe Nutzer. Während unserer MVP-Phase sind alle Funktionen kostenlos nutzbar. Keine Kreditkarte zum Start erforderlich.'
      },
      {
        question: 'Kann ich NomadSuite nutzen, wenn ich mit einem Team arbeite oder Mitarbeiter habe?',
        answer: 'Ja! NomadSuite unterstützt Workspace-Zusammenarbeit. Sie können Teammitglieder einladen, Rollen zuweisen (Admin, Benutzer) und Kundenbeziehungen gemeinsam verwalten. Jedes Workspace-Mitglied erhält seine eigene Reiseverfolgung und Dokumentensafe, während der Zugriff auf das Kunden-CRM und Rechnungssystem geteilt wird.'
      },
      {
        question: 'Was passiert mit meinen Daten, wenn ich mein Abonnement kündige?',
        answer: 'Sie behalten vollen Zugriff auf Ihre Daten auch nach der Kündigung. Sie können alle Ihre Informationen (Kunden, Rechnungen, Reiselogs, Dokumente) jederzeit als CSV/PDF-Dateien exportieren. Wir bewahren Ihre Daten 90 Tage nach der Kündigung auf, falls Sie reaktivieren möchten. Nach 90 Tagen werden Daten dauerhaft von unseren Servern gelöscht, es sei denn, Sie beantragen eine Verlängerung.'
      },
      {
        question: 'Kann ich jederzeit kündigen? Gibt es langfristige Verträge?',
        answer: 'Ja, Sie können jederzeit mit einem Klick in Ihren Kontoeinstellungen kündigen. Wir bieten monatliche Abrechnung ohne langfristige Verträge oder Verpflichtungen. Es gibt keine Kündigungsgebühren, und Sie können jederzeit auf Kostenlos herabstufen. Jahrespläne bieten Ersparnisse und können mit anteiliger Rückerstattung gekündigt werden.'
      },
      {
        question: 'Wie funktionieren Visa-Ablaufbenachrichtigungen?',
        answer: 'Wenn Sie Visa-Dokumente, Arbeitserlaubnisse oder Aufenthaltskarten hochladen, können Sie Ablaufdaten festlegen. Sie erhalten E-Mail- und In-App-Benachrichtigungen 90 Tage, 30 Tage und 7 Tage vor dem Ablauf eines Dokuments. Sie können auch benutzerdefinierte Erinnerungspläne festlegen. Dies stellt sicher, dass Sie nie eine Verlängerungsfrist verpassen.'
      },
      {
        question: 'Gibt es eine mobile App?',
        answer: 'Derzeit ist NomadSuite eine Webanwendung, die perfekt auf mobilen Browsern funktioniert (vollständig responsives Design). Native iOS- und Android-Apps sind für zukünftige Veröffentlichung geplant. Sie können die Web-App zu Ihrem Startbildschirm auf iPhone/Android hinzufügen für ein App-ähnliches Erlebnis.'
      }
    ]
  },
  fr: {
    title: 'Questions fréquemment posées',
    subtitle: 'Tout ce que vous devez savoir sur NomadSuite',
    items: [
      {
        question: 'NomadSuite fournit-il des conseils juridiques ou fiscaux ?',
        answer: 'Non, NomadSuite fournit uniquement des outils informationnels. Nous vous aidons à suivre et organiser vos données, mais nous ne sommes pas des conseillers fiscaux ou des professionnels du droit. Consultez toujours un professionnel fiscal ou un conseiller juridique qualifié pour des conseils spécifiques à votre situation et juridiction.'
      },
      {
        question: 'Comment fonctionne le suivi de résidence fiscale de 183 jours ?',
        answer: 'Notre suivi de résidence compte automatiquement les jours que vous passez dans chaque pays en fonction de vos entrées de journal de voyage. De nombreux pays utilisent la règle des 183 jours pour déterminer la résidence fiscale—si vous passez plus de 183 jours dans un pays au cours d\'une année civile, vous pouvez devenir résident fiscal là-bas. NomadSuite vous montre les comptages en temps réel et vous alerte lorsque vous approchez des seuils, mais les règles fiscales varient selon les pays, donc vérifiez toujours avec un professionnel fiscal.'
      },
      {
        question: 'Qu\'est-ce que la règle Schengen 90/180 et comment la suivez-vous ?',
        answer: 'La règle Schengen 90/180 signifie que vous pouvez séjourner dans l\'espace Schengen jusqu\'à 90 jours sur toute période glissante de 180 jours sans visa (pour la plupart des nationalités). NomadSuite calcule automatiquement vos jours restants en analysant vos entrées de voyage et dates de sortie dans les 27 pays Schengen. Nous vous montrons exactement combien de jours il vous reste et quand votre compteur se réinitialise.'
      },
      {
        question: 'Quels pays sont pris en charge pour le suivi des voyages et des visas ?',
        answer: 'Tous les pays du monde sont pris en charge. Vous pouvez enregistrer des voyages vers n\'importe quel endroit dans le monde, et nous suivrons vos jours dans chaque pays. Nous avons des calculateurs spécialisés pour l\'espace Schengen, les règles de résidence fiscale américaines (test de présence substantielle), et les principaux programmes de visa pour nomades numériques (Portugal D7, visa nomade numérique Espagne, e-Residency Estonie, etc.).'
      },
      {
        question: 'Mes données sont-elles sécurisées ?',
        answer: 'La sécurité est notre priorité absolue. Nous utilisons le chiffrement AES-256 (la même norme utilisée par les banques et les institutions gouvernementales) pour toutes les données au repos. Toutes les données en transit sont chiffrées avec TLS/SSL. Nous sommes entièrement conformes au RGPD et subissons des audits de sécurité réguliers. Vos documents, scans de passeport et données financières sont stockés dans des bases de données sécurisées et chiffrées. Nous ne vendons jamais vos données à des tiers.'
      },
      {
        question: 'Puis-je importer des données clients et des factures existantes ?',
        answer: 'Oui ! Les utilisateurs des plans payants peuvent importer des données via téléchargement CSV. Nous prenons en charge les importations depuis des outils populaires comme Excel, Google Sheets et d\'autres CRM. Vous pouvez importer en masse des clients, des factures passées et l\'historique de voyage. Notre équipe de support peut également aider avec la migration personnalisée depuis d\'autres plateformes.'
      },
      {
        question: 'Quels sont les plans tarifaires ?',
        answer: 'Nous offrons des prix flexibles : Plan gratuit pour commencer, Nomad Pro à 20$/mois ou 199$/an (17% d\'économies), et un tarif Early-Bird spécial de 159$/an pour les premiers utilisateurs. Pendant notre phase MVP, toutes les fonctionnalités sont gratuites. Aucune carte de crédit requise pour commencer.'
      },
      {
        question: 'Puis-je utiliser NomadSuite si je travaille avec une équipe ou si j\'ai des employés ?',
        answer: 'Oui ! NomadSuite prend en charge la collaboration d\'espace de travail. Vous pouvez inviter des membres d\'équipe, attribuer des rôles (admin, utilisateur), et gérer les relations clients ensemble. Chaque membre de l\'espace de travail obtient son propre suivi de voyage et coffre-fort de documents, tout en partageant l\'accès au CRM client et au système de facturation.'
      },
      {
        question: 'Qu\'advient-il de mes données si j\'annule mon abonnement ?',
        answer: 'Vous conservez un accès complet à vos données même après l\'annulation. Vous pouvez exporter toutes vos informations (clients, factures, journaux de voyage, documents) sous forme de fichiers CSV/PDF à tout moment. Nous conservons vos données pendant 90 jours après l\'annulation au cas où vous souhaiteriez réactiver. Après 90 jours, les données sont définitivement supprimées de nos serveurs sauf si vous demandez une extension.'
      },
      {
        question: 'Puis-je annuler à tout moment ? Y a-t-il des contrats à long terme ?',
        answer: 'Oui, vous pouvez annuler à tout moment en un seul clic dans les paramètres de votre compte. Nous offrons une facturation mensuelle sans contrats ni engagements à long terme. Il n\'y a pas de frais d\'annulation, et vous pouvez passer au plan gratuit à tout moment. Les plans annuels offrent des économies et peuvent être annulés avec un remboursement au prorata.'
      },
      {
        question: 'Comment fonctionnent les alertes d\'expiration de visa ?',
        answer: 'Lorsque vous téléchargez des documents de visa, des permis de travail ou des cartes de résidence, vous pouvez définir des dates d\'expiration. Vous recevrez des notifications par e-mail et dans l\'application 90 jours, 30 jours et 7 jours avant l\'expiration de tout document. Vous pouvez également définir des horaires de rappel personnalisés. Cela garantit que vous ne manquerez jamais une échéance de renouvellement.'
      },
      {
        question: 'Y a-t-il une application mobile ?',
        answer: 'Actuellement, NomadSuite est une application web qui fonctionne parfaitement sur les navigateurs mobiles (design entièrement responsive). Des applications natives iOS et Android sont prévues pour une future version. Vous pouvez ajouter l\'application web à votre écran d\'accueil sur iPhone/Android pour une expérience similaire à une application.'
      }
    ]
  },
  vi: {
    title: 'Câu hỏi thường gặp',
    subtitle: 'Tất cả những gì bạn cần biết về NomadSuite',
    items: [
      {
        question: 'NomadSuite có phải là tư vấn pháp lý hoặc thuế không?',
        answer: 'Không, NomadSuite chỉ cung cấp các công cụ thông tin. Chúng tôi giúp bạn theo dõi và tổ chức dữ liệu của mình, nhưng chúng tôi không phải là cố vấn thuế hoặc chuyên gia pháp lý. Luôn tham khảo ý kiến của chuyên gia thuế hoặc cố vấn pháp lý có trình độ để được tư vấn cụ thể cho tình huống và quyền hạn pháp lý của bạn.'
      },
      {
        question: 'Bộ theo dõi cư trú thuế 183 ngày hoạt động như thế nào?',
        answer: 'Bộ theo dõi cư trú của chúng tôi tự động đếm số ngày bạn ở mỗi quốc gia dựa trên các mục nhật ký du lịch của bạn. Nhiều quốc gia sử dụng quy tắc 183 ngày để xác định cư trú thuế—nếu bạn ở hơn 183 ngày trong một quốc gia trong năm dương lịch, bạn có thể trở thành cư dân thuế ở đó. NomadSuite hiển thị số đếm thời gian thực và cảnh báo bạn khi gần đến ngưỡng, nhưng quy tắc thuế khác nhau theo quốc gia, vì vậy hãy luôn xác minh với chuyên gia thuế.'
      },
      {
        question: 'Quy tắc Schengen 90/180 là gì và bạn theo dõi nó như thế nào?',
        answer: 'Quy tắc Schengen 90/180 có nghĩa là bạn có thể ở trong Khu vực Schengen tối đa 90 ngày trong bất kỳ khoảng thời gian 180 ngày liên tục nào mà không cần visa (đối với hầu hết các quốc tịch). NomadSuite tự động tính toán số ngày còn lại của bạn bằng cách phân tích các mục nhập cảnh và ngày xuất cảnh của bạn tại tất cả 27 quốc gia Schengen. Chúng tôi cho bạn biết chính xác còn bao nhiêu ngày và khi nào bộ đếm của bạn được đặt lại.'
      },
      {
        question: 'Những quốc gia nào được hỗ trợ để theo dõi du lịch và visa?',
        answer: 'Tất cả các quốc gia trên toàn thế giới đều được hỗ trợ. Bạn có thể ghi lại các chuyến đi đến bất kỳ địa điểm nào trên toàn cầu, và chúng tôi sẽ theo dõi số ngày của bạn ở mỗi quốc gia. Chúng tôi có các máy tính chuyên dụng cho khu vực Schengen, quy tắc cư trú thuế Mỹ (bài kiểm tra hiện diện đáng kể), và các chương trình visa du mục kỹ thuật số chính (Portugal D7, visa du mục kỹ thuật số Tây Ban Nha, e-Residency Estonia, v.v.).'
      },
      {
        question: 'Dữ liệu của tôi có an toàn không?',
        answer: 'Bảo mật là ưu tiên hàng đầu của chúng tôi. Chúng tôi sử dụng mã hóa AES-256 (cùng tiêu chuẩn được sử dụng bởi các ngân hàng và tổ chức chính phủ) cho tất cả dữ liệu lưu trữ. Tất cả dữ liệu truyền tải được mã hóa bằng TLS/SSL. Chúng tôi hoàn toàn tuân thủ GDPR và thường xuyên kiểm tra bảo mật. Tài liệu, bản scan hộ chiếu và dữ liệu tài chính của bạn được lưu trữ trong cơ sở dữ liệu an toàn, được mã hóa. Chúng tôi không bao giờ bán dữ liệu của bạn cho bên thứ ba.'
      },
      {
        question: 'Tôi có thể nhập dữ liệu khách hàng và hóa đơn hiện có không?',
        answer: 'Có! Người dùng gói trả phí có thể nhập dữ liệu qua tải lên CSV. Chúng tôi hỗ trợ nhập từ các công cụ phổ biến như Excel, Google Sheets và các CRM khác. Bạn có thể nhập hàng loạt khách hàng, hóa đơn trước đây và lịch sử du lịch. Đội ngũ hỗ trợ của chúng tôi cũng có thể giúp di chuyển tùy chỉnh từ các nền tảng khác.'
      },
      {
        question: 'Các gói giá là gì?',
        answer: 'Chúng tôi cung cấp giá linh hoạt: Gói Miễn phí để bắt đầu, Nomad Pro với $20/tháng hoặc $199/năm (tiết kiệm 17%), và mức giá Early-Bird đặc biệt $159/năm cho người dùng sớm. Trong giai đoạn MVP, tất cả tính năng đều miễn phí. Không cần thẻ tín dụng để bắt đầu.'
      },
      {
        question: 'Tôi có thể sử dụng NomadSuite nếu làm việc với nhóm hoặc có nhân viên không?',
        answer: 'Có! NomadSuite hỗ trợ cộng tác không gian làm việc. Bạn có thể mời thành viên nhóm, gán vai trò (quản trị viên, người dùng), và quản lý mối quan hệ khách hàng cùng nhau. Mỗi thành viên không gian làm việc có theo dõi du lịch và kho tài liệu riêng, trong khi chia sẻ quyền truy cập vào CRM khách hàng và hệ thống hóa đơn.'
      },
      {
        question: 'Điều gì xảy ra với dữ liệu của tôi nếu tôi hủy đăng ký?',
        answer: 'Bạn vẫn có quyền truy cập đầy đủ vào dữ liệu của mình ngay cả sau khi hủy. Bạn có thể xuất tất cả thông tin (khách hàng, hóa đơn, nhật ký du lịch, tài liệu) dưới dạng tệp CSV/PDF bất cứ lúc nào. Chúng tôi giữ lại dữ liệu của bạn trong 90 ngày sau khi hủy trong trường hợp bạn muốn kích hoạt lại. Sau 90 ngày, dữ liệu sẽ bị xóa vĩnh viễn khỏi máy chủ của chúng tôi trừ khi bạn yêu cầu gia hạn.'
      },
      {
        question: 'Tôi có thể hủy bất cứ lúc nào không? Có hợp đồng dài hạn không?',
        answer: 'Có, bạn có thể hủy bất cứ lúc nào chỉ với một cú nhấp trong cài đặt tài khoản. Chúng tôi cung cấp thanh toán hàng tháng không có hợp đồng hoặc cam kết dài hạn. Không có phí hủy, và bạn có thể hạ cấp xuống Miễn phí bất cứ lúc nào. Các gói hàng năm cung cấp tiết kiệm và có thể được hủy với hoàn tiền theo tỷ lệ.'
      },
      {
        question: 'Cảnh báo hết hạn visa hoạt động như thế nào?',
        answer: 'Khi bạn tải lên tài liệu visa, giấy phép lao động hoặc thẻ cư trú, bạn có thể đặt ngày hết hạn. Bạn sẽ nhận được thông báo qua email và trong ứng dụng 90 ngày, 30 ngày và 7 ngày trước khi bất kỳ tài liệu nào hết hạn. Bạn cũng có thể đặt lịch nhắc nhở tùy chỉnh. Điều này đảm bảo bạn không bao giờ bỏ lỡ hạn gia hạn.'
      },
      {
        question: 'Có ứng dụng di động không?',
        answer: 'Hiện tại, NomadSuite là một ứng dụng web hoạt động hoàn hảo trên trình duyệt di động (thiết kế hoàn toàn responsive). Các ứng dụng iOS và Android gốc được lên kế hoạch cho phiên bản tương lai. Bạn có thể thêm ứng dụng web vào màn hình chính trên iPhone/Android để có trải nghiệm giống ứng dụng.'
      }
    ]
  },
  ja: {
    title: 'よくある質問',
    subtitle: 'NomadSuiteについて知っておくべきすべてのこと',
    items: [
      {
        question: 'NomadSuiteは法的または税務アドバイスですか？',
        answer: 'いいえ、NomadSuiteは情報ツールのみを提供します。データの追跡と整理をお手伝いしますが、税務アドバイザーや法律の専門家ではありません。あなたの状況と管轄区域に固有のアドバイスについては、常に資格のある税務専門家または法律アドバイザーに相談してください。'
      },
      {
        question: '183日税務居住トラッカーはどのように機能しますか？',
        answer: '当社の居住トラッカーは、旅行ログのエントリに基づいて、各国で過ごす日数を自動的にカウントします。多くの国では、税務居住を決定するために183日ルールを使用しています—暦年中に国で183日以上過ごすと、その国の税務居住者になる可能性があります。NomadSuiteはリアルタイムのカウントを表示し、しきい値に近づくと警告しますが、税務規則は国によって異なるため、常に税務専門家に確認してください。'
      },
      {
        question: 'シェンゲン90/180ルールとは何ですか？どのように追跡しますか？',
        answer: 'シェンゲン90/180ルールは、ビザなしで180日間のローリング期間内に最大90日間シェンゲン圏に滞在できることを意味します（ほとんどの国籍の場合）。NomadSuiteは、27のシェンゲン諸国すべてでの入国エントリと出国日を分析して、残りの日数を自動的に計算します。残りの日数とカウンターがリセットされる時期を正確に表示します。'
      },
      {
        question: '旅行とビザの追跡でサポートされている国は？',
        answer: '世界中のすべての国がサポートされています。世界中のどこへの旅行でも記録でき、各国での日数を追跡します。シェンゲン圏、米国税務居住規則（実質的存在テスト）、および主要なデジタルノマドビザプログラム（ポルトガルD7、スペインデジタルノマドビザ、エストニアe-Residencyなど）のための専門的な計算機があります。'
      },
      {
        question: 'データは安全ですか？',
        answer: 'セキュリティは最優先事項です。すべての保存データにAES-256暗号化（銀行や政府機関で使用されているのと同じ標準）を使用しています。転送中のすべてのデータはTLS/SSLで暗号化されています。完全にGDPR準拠であり、定期的なセキュリティ監査を受けています。ドキュメント、パスポートスキャン、財務データは安全な暗号化されたデータベースに保存されています。データを第三者に販売することは決してありません。'
      },
      {
        question: '既存のクライアントデータと請求書をインポートできますか？',
        answer: 'はい！有料プランユーザーはCSVアップロードでデータをインポートできます。Excel、Google Sheets、その他のCRMなどの人気ツールからのインポートをサポートしています。クライアント、過去の請求書、旅行履歴を一括インポートできます。サポートチームは他のプラットフォームからのカスタム移行もお手伝いできます。'
      },
      {
        question: '料金プランは何ですか？',
        answer: '柔軟な価格設定を提供しています：開始用の無料プラン、Nomad Proは$20/月または$199/年（17%節約）、早期導入者向けの特別Early-Bird料金$159/年。MVP段階では、すべての機能が無料で使用できます。開始にクレジットカードは不要です。'
      },
      {
        question: 'チームで働いている場合や従業員がいる場合、NomadSuiteを使用できますか？',
        answer: 'はい！NomadSuiteはワークスペースコラボレーションをサポートしています。チームメンバーを招待し、役割（管理者、ユーザー）を割り当て、一緒にクライアント関係を管理できます。各ワークスペースメンバーは独自の旅行追跡とドキュメントボールトを持ち、クライアントCRMと請求システムへのアクセスを共有します。'
      },
      {
        question: 'サブスクリプションをキャンセルした場合、データはどうなりますか？',
        answer: 'キャンセル後もデータへの完全なアクセスを保持できます。いつでもすべての情報（クライアント、請求書、旅行ログ、ドキュメント）をCSV/PDFファイルとしてエクスポートできます。再アクティブ化を希望する場合に備えて、キャンセル後90日間データを保持します。90日後、延長をリクエストしない限り、サーバーからデータは完全に削除されます。'
      },
      {
        question: 'いつでもキャンセルできますか？長期契約はありますか？',
        answer: 'はい、アカウント設定でワンクリックでいつでもキャンセルできます。長期契約やコミットメントなしの月額課金を提供しています。キャンセル料はなく、いつでも無料にダウングレードできます。年間プランは節約を提供し、日割り返金でキャンセルできます。'
      },
      {
        question: 'ビザ有効期限アラートはどのように機能しますか？',
        answer: 'ビザドキュメント、労働許可証、または居住カードをアップロードするとき、有効期限を設定できます。ドキュメントの有効期限の90日前、30日前、7日前にメールとアプリ内通知を受け取ります。カスタムリマインダースケジュールを設定することもできます。これにより、更新期限を逃すことはありません。'
      },
      {
        question: 'モバイルアプリはありますか？',
        answer: '現在、NomadSuiteはモバイルブラウザで完璧に動作するWebアプリケーションです（完全にレスポンシブなデザイン）。ネイティブiOSおよびAndroidアプリは将来のリリースに向けて計画されています。iPhone/Androidのホーム画面にWebアプリを追加して、アプリのような体験をすることができます。'
      }
    ]
  },
  zh: {
    title: '常见问题',
    subtitle: '关于NomadSuite您需要知道的一切',
    items: [
      {
        question: 'NomadSuite是法律或税务建议吗？',
        answer: '不是，NomadSuite仅提供信息工具。我们帮助您跟踪和组织数据，但我们不是税务顾问或法律专业人士。请务必咨询合格的税务专业人士或法律顾问，以获得针对您的情况和管辖区域的具体建议。'
      },
      {
        question: '183天税务居民追踪器如何工作？',
        answer: '我们的居民追踪器根据您的旅行日志条目自动计算您在每个国家/地区停留的天数。许多国家/地区使用183天规则来确定税务居民身份——如果您在日历年内在一个国家/地区停留超过183天，您可能会成为那里的税务居民。NomadSuite向您显示实时计数，并在接近阈值时提醒您，但税务规则因国家/地区而异，因此请务必与税务专业人士核实。'
      },
      {
        question: '申根90/180规则是什么？您如何追踪它？',
        answer: '申根90/180规则意味着您可以在任何180天滚动期内在申根区停留最多90天而无需签证（对于大多数国籍）。NomadSuite通过分析您在所有27个申根国家的入境记录和出境日期自动计算您剩余的天数。我们向您准确显示您还剩多少天以及您的计数器何时重置。'
      },
      {
        question: '旅行和签证追踪支持哪些国家？',
        answer: '支持全球所有国家/地区。您可以记录到全球任何地点的旅行，我们将追踪您在每个国家/地区的天数。我们有针对申根区、美国税务居民规则（实质性存在测试）和主要数字游民签证项目（葡萄牙D7、西班牙数字游民签证、爱沙尼亚e-Residency等）的专业计算器。'
      },
      {
        question: '我的数据安全吗？',
        answer: '安全是我们的首要任务。我们对所有静态数据使用AES-256加密（与银行和政府机构使用的标准相同）。所有传输中的数据都使用TLS/SSL加密。我们完全符合GDPR并定期接受安全审计。您的文件、护照扫描件和财务数据存储在安全、加密的数据库中。我们永远不会将您的数据出售给第三方。'
      },
      {
        question: '我可以导入现有的客户数据和发票吗？',
        answer: '可以！付费计划用户可以通过CSV上传导入数据。我们支持从Excel、Google Sheets和其他CRM等流行工具导入。您可以批量导入客户、过去的发票和旅行历史。我们的支持团队还可以帮助从其他平台进行自定义迁移。'
      },
      {
        question: '定价计划是什么？',
        answer: '我们提供灵活的定价：入门免费计划、Nomad Pro每月$20或每年$199（节省17%），以及早期用户专属Early-Bird价格每年$159。在MVP阶段，所有功能均可免费使用。无需信用卡即可开始。'
      },
      {
        question: '如果我与团队合作或有员工，可以使用NomadSuite吗？',
        answer: '可以！NomadSuite支持工作空间协作。您可以邀请团队成员、分配角色（管理员、用户），并一起管理客户关系。每个工作空间成员都有自己的旅行追踪和文档保险库，同时共享访问客户CRM和发票系统。'
      },
      {
        question: '如果我取消订阅，我的数据会怎样？',
        answer: '即使取消后，您仍可完全访问您的数据。您可以随时将所有信息（客户、发票、旅行日志、文档）导出为CSV/PDF文件。我们在取消后保留您的数据90天，以防您想重新激活。90天后，除非您请求延期，否则数据将从我们的服务器永久删除。'
      },
      {
        question: '我可以随时取消吗？有长期合同吗？',
        answer: '是的，您可以在账户设置中一键随时取消。我们提供月度计费，没有长期合同或承诺。没有取消费用，您可以随时降级到免费版。年度计划提供节省，可以按比例退款取消。'
      },
      {
        question: '签证到期提醒如何工作？',
        answer: '当您上传签证文件、工作许可证或居留卡时，您可以设置到期日期。您将在任何文件到期前90天、30天和7天收到电子邮件和应用内通知。您还可以设置自定义提醒计划。这确保您永远不会错过续签截止日期。'
      },
      {
        question: '有移动应用程序吗？',
        answer: '目前，NomadSuite是一个在移动浏览器上完美运行的Web应用程序（完全响应式设计）。原生iOS和Android应用程序计划在未来发布。您可以将Web应用添加到iPhone/Android的主屏幕，以获得类似应用的体验。'
      }
    ]
  }
};
