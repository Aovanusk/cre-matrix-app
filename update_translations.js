const fs = require('fs');

const translations_en = {
    'footer.about.title': 'CRE Matrix',
    'footer.about.desc': 'AI-powered data extraction for Commercial Real Estate professionals. Automate underwriting and stop manual data entry.',
    'footer.support': 'Contact Support:',
    'footer.legal.title': 'Legal Information',
    'footer.legal.terms': 'Terms of Service',
    'footer.legal.privacy': 'Privacy Policy',
    'footer.legal.refund': 'Refund Policy',
    'footer.payment.title': 'Accepted Payments',
    'footer.payment.desc': 'We accept major credit cards and cryptocurrencies.',
    'footer.rights': '© {0} CRE Matrix. All rights reserved.',

    'nav.back': '← Back to Home',
    'privacy.title': 'Privacy Policy',
    'privacy.p1.title': '1. Information Collection',
    'privacy.p1.text': 'When using the CRE Matrix service, we collect the following data: email address (upon registration) and uploaded PDF files (strictly for the duration of automated machine processing).',
    'privacy.p2.title': '2. Use of Information and AI',
    'privacy.p2.text': 'The collected data is used exclusively to provide service operations (generating Excel tables). Your security is our priority. Unlike public free neural networks, CRE Matrix uses secure Enterprise APIs (Google LLC). In accordance with the provider\'s terms of service, your documents are NOT used to train public AI models. Data is transmitted via an encrypted channel exclusively for the machine processing of your request.',
    'privacy.p3.title': '3. Data Protection',
    'privacy.p3.text': 'Uploaded files (PDFs) are stored in isolated cloud storage using Row Level Security (RLS) policies and are accessible only to the account owner. We do not share your data with third parties for advertising or other purposes, except for the technology partner (Google LLC), acting exclusively as a sub-processor for AI operations.',
    'privacy.p4.title': '4. User Rights',
    'privacy.p4.text': 'The user has the right to request the deletion of their account and all associated files at any time by contacting support.',
    'legal.contact': 'Contact Information:',

    'terms.title': 'Terms of Service',
    'terms.p1.title': '1. General Provisions',
    'terms.p1.text': 'This Terms of Service agreement governs the relationship between the CRE Matrix administration and the User. By registering in the service, the User confirms that they are at least 18 years old and possess the necessary legal capacity.',
    'terms.p2.title': '2. Subject of the Agreement',
    'terms.p2.text': 'The Administration grants the User a non-exclusive license (access) to the SaaS platform for automated analysis of commercial real estate documents using artificial intelligence. Services are provided "as is".',
    'terms.p3.title': '3. Legality of Uploaded Data and NDA',
    'terms.p3.text': 'The User guarantees that they have the legal rights and necessary consents from copyright holders (including the absence of restrictions under non-disclosure agreements - NDAs) to upload and process the provided documents. The CRE Matrix service is exclusively an automation tool and is not responsible for the User\'s violation of trade secrets.',
    'terms.p4.title': '4. Limitation of Liability',
    'terms.p4.text': 'The Administration is not responsible for the accuracy and completeness of the data extracted by artificial intelligence from the documents provided by the User. The User undertakes to independently verify the data before using it in financial modeling or for commercial purposes.',
    'terms.p5.title': '5. Details',
    'terms.p5.text': 'CRE Matrix Project.',

    'refund.title': 'Refund Policy',
    'refund.p1.title': '1. General Refund Conditions',
    'refund.p1.text': 'Refunds for paid plans (credit packages) are possible only if the User has not spent a single credit from the purchased package. A refund request must be sent within 14 days of payment.',
    'refund.p2.title': '2. Digital Services and Partial Refunds',
    'refund.p2.text': 'Please note that purchasing credits constitutes receiving a non-exclusive license to access digital content and computing power of the service. Due to the nature of digital services, which require immediate AI server computing costs, partial refunds for partially used credit packages are not provided.',
    'refund.p3.title': '3. Technical Failures',
    'refund.p3.text': 'In the event of technical failures on the service side (parsing errors, server unavailability), as a result of which the service was not provided, the system automatically returns the deducted credits to the User\'s account balance.',
    'refund.p4.title': '4. Refund Procedure and Timelines',
    'refund.p4.text': 'To issue a refund, the User must contact support, providing the email address registered to the account and the payment receipt. The refund of transferred funds is made to your bank account within 5-30 working days (the period depends on the bank that issued your bank card).'
};

const translations_es = {
    'footer.about.title': 'Matriz CRE',
    'footer.about.desc': 'Extracción de datos impulsada por IA para profesionales de bienes raíces comerciales. Automatice la suscripción y detenga la entrada manual de datos.',
    'footer.support': 'Contactar Soporte:',
    'footer.legal.title': 'Información Legal',
    'footer.legal.terms': 'Términos de Servicio',
    'footer.legal.privacy': 'Política de Privacidad',
    'footer.legal.refund': 'Política de Reembolso',
    'footer.payment.title': 'Pagos Aceptados',
    'footer.payment.desc': 'Aceptamos las principales tarjetas de crédito y criptomonedas.',
    'footer.rights': '© {0} Matriz CRE. Todos los derechos reservados.',

    'nav.back': '← Volver al inicio',
    'privacy.title': 'Política de Privacidad',
    'privacy.p1.title': '1. Recopilación de Información',
    'privacy.p1.text': 'Al utilizar el servicio CRE Matrix, recopilamos los siguientes datos: dirección de correo electrónico (al registrarse) y archivos PDF cargados (estrictamente durante el procesamiento automático).',
    'privacy.p2.title': '2. Uso de la Información e Inteligencia Artificial',
    'privacy.p2.text': 'Los datos recopilados se utilizan exclusivamente para proporcionar los servicios (generación de tablas Excel). Su seguridad es nuestra prioridad. A diferencia de las redes neuronales públicas gratuitas, CRE Matrix utiliza API empresariales seguras (Google LLC). De acuerdo con los términos de servicio del proveedor, sus documentos NO se utilizan para entrenar modelos de IA públicos. Los datos se transmiten a través de un canal encriptado exclusivamente para el procesamiento de su solicitud.',
    'privacy.p3.title': '3. Protección de Datos',
    'privacy.p3.text': 'Los archivos cargados (PDF) se almacenan en un almacenamiento en la nube aislado utilizando políticas de seguridad de nivel de fila (RLS) y solo son accesibles para el propietario de la cuenta. No compartimos sus datos con terceros con fines publicitarios u otros, a excepción del socio tecnológico (Google LLC), que actúa exclusivamente como subprocesador para las operaciones de IA.',
    'privacy.p4.title': '4. Derechos del Usuario',
    'privacy.p4.text': 'El usuario tiene derecho a solicitar la eliminación de su cuenta y todos los archivos asociados en cualquier momento contactando al soporte.',
    'legal.contact': 'Información de Contacto:',

    'terms.title': 'Términos de Servicio',
    'terms.p1.title': '1. Disposiciones Generales',
    'terms.p1.text': 'Este acuerdo de Términos de Servicio rige la relación entre la administración de CRE Matrix y el Usuario. Al registrarse en el servicio, el Usuario confirma que tiene al menos 18 años y posee la capacidad legal necesaria.',
    'terms.p2.title': '2. Objeto del Acuerdo',
    'terms.p2.text': 'La Administración otorga al Usuario una licencia no exclusiva (acceso) a la plataforma SaaS para el análisis automatizado de documentos de bienes raíces comerciales utilizando inteligencia artificial. Los servicios se proporcionan "tal cual".',
    'terms.p3.title': '3. Legalidad de los Datos Cargados y NDA',
    'terms.p3.text': 'El Usuario garantiza que tiene los derechos legales y los consentimientos necesarios de los titulares de los derechos de autor (incluida la ausencia de restricciones en virtud de acuerdos de confidencialidad - NDA) para cargar y procesar los documentos proporcionados. El servicio CRE Matrix es exclusivamente una herramienta de automatización y no es responsable de la violación de secretos comerciales por parte del Usuario.',
    'terms.p4.title': '4. Limitación de Responsabilidad',
    'terms.p4.text': 'La Administración no es responsable de la exactitud e integridad de los datos extraídos por la inteligencia artificial de los documentos proporcionados por el Usuario. El Usuario se compromete a verificar independientemente los datos antes de utilizarlos en modelado financiero o con fines comerciales.',
    'terms.p5.title': '5. Detalles',
    'terms.p5.text': 'Proyecto CRE Matrix.',

    'refund.title': 'Política de Reembolso',
    'refund.p1.title': '1. Condiciones Generales de Reembolso',
    'refund.p1.text': 'Los reembolsos de planes pagos (paquetes de créditos) solo son posibles si el Usuario no ha gastado un solo crédito del paquete comprado. Se debe enviar una solicitud de reembolso dentro de los 14 días posteriores al pago.',
    'refund.p2.title': '2. Servicios Digitales y Reembolsos Parciales',
    'refund.p2.text': 'Tenga en cuenta que la compra de créditos constituye la recepción de una licencia no exclusiva para acceder al contenido digital y la potencia informática del servicio. Debido a la naturaleza de los servicios digitales, que requieren costos informáticos inmediatos del servidor de IA, no se proporcionan reembolsos parciales por paquetes de créditos utilizados parcialmente.',
    'refund.p3.title': '3. Fallos Técnicos',
    'refund.p3.text': 'En caso de fallos técnicos por parte del servicio (errores de análisis, falta de disponibilidad del servidor), como resultado de los cuales no se proporcionó el servicio, el sistema devuelve automáticamente los créditos deducidos al saldo de la cuenta del Usuario.',
    'refund.p4.title': '4. Procedimiento y Plazos de Reembolso',
    'refund.p4.text': 'Para emitir un reembolso, el Usuario debe contactar al soporte, proporcionando la dirección de correo electrónico registrada en la cuenta y el recibo de pago. El reembolso de los fondos transferidos se realiza a su cuenta bancaria dentro de 5 a 30 días hábiles (el período depende del banco que emitió su tarjeta bancaria).'
};

const translations_ar = {
    'footer.about.title': 'مصفوفة CRE',
    'footer.about.desc': 'استخراج البيانات المدعوم بالذكاء الاصطناعي لمحترفي العقارات التجارية. أتمتة الاكتتاب وإيقاف الإدخال اليدوي للبيانات.',
    'footer.support': 'اتصل بالدعم:',
    'footer.legal.title': 'المعلومات القانونية',
    'footer.legal.terms': 'شروط الخدمة',
    'footer.legal.privacy': 'سياسة الخصوصية',
    'footer.legal.refund': 'سياسة الاسترجاع',
    'footer.payment.title': 'المدفوعات المقبولة',
    'footer.payment.desc': 'نقبل بطاقات الائتمان الرئيسية والعملات المشفرة.',
    'footer.rights': '© {0} مصفوفة CRE. جميع الحقوق محفوظة.',

    'nav.back': '← العودة إلى الرئيسية',
    'privacy.title': 'سياسة الخصوصية',
    'privacy.p1.title': '1. جمع المعلومات',
    'privacy.p1.text': 'عند استخدامك لخدمة CRE Matrix، نقوم بجمع البيانات التالية: عنوان البريد الإلكتروني (عند التسجيل) وملفات PDF المحملة (حصريًا طوال فترة المعالجة الآلية).',
    'privacy.p2.title': '2. استخدام المعلومات والذكاء الاصطناعي',
    'privacy.p2.text': 'تُستخدم البيانات التي تم جمعها حصريًا لتقديم الخدمة (إنشاء جداول Excel). أمانك هو أولويتنا. على عكس الشبكات العصبية المجانية العامة، تستخدم CRE Matrix واجهات برمجة تطبيقات المؤسسات الآمنة (Google LLC). وفقًا لشروط خدمة المزود، لا يتم استخدام مستنداتك لتدريب نماذج الذكاء الاصطناعي العامة. يتم نقل البيانات عبر قناة مشفرة حصريًا للمعالجة الآلية لطلبك.',
    'privacy.p3.title': '3. حماية البيانات',
    'privacy.p3.text': 'يتم تخزين الملفات المحملة (PDF) في تخزين سحابي معزول باستخدام سياسات أمان مستوى الصف (RLS) ولا يمكن الوصول إليها إلا لمالك الحساب. نحن لا نشارك بياناتك مع أطراف ثالثة لأغراض الإعلان أو غيرها، باستثناء شريك التكنولوجيا (Google LLC)، الذي يعمل حصريًا كمعالج فرعي لعمليات الذكاء الاصطناعي.',
    'privacy.p4.title': '4. حقوق المستخدم',
    'privacy.p4.text': 'يحق للمستخدم طلب حذف حسابه وجميع الملفات المرتبطة به في أي وقت عن طريق الاتصال بالدعم.',
    'legal.contact': 'معلومات الاتصال:',

    'terms.title': 'شروط الخدمة',
    'terms.p1.title': '1. أحكام عامة',
    'terms.p1.text': 'تُنظم اتفاقية شروط الخدمة هذه العلاقة بين إدارة CRE Matrix والمستخدم. من خلال التسجيل في الخدمة، يؤكد المستخدم أنه يبلغ من العمر 18 عامًا على الأقل ويمتلك الأهلية القانونية اللازمة.',
    'terms.p2.title': '2. موضوع الاتفاقية',
    'terms.p2.text': 'تمنح الإدارة المستخدم ترخيصًا غير حصري (الوصول) إلى منصة SaaS للتحليل الآلي لمستندات العقارات التجارية باستخدام الذكاء الاصطناعي. يتم تقديم الخدمات "كما هي".',
    'terms.p3.title': '3. قانونية البيانات المحملة واتفاقية عدم الإفصاح (NDA)',
    'terms.p3.text': 'يضمن المستخدم أن لديه الحقوق القانونية والموافقات اللازمة من أصحاب حقوق الطبع والنشر (بما في ذلك عدم وجود قيود بموجب اتفاقيات عدم الإفصاح - NDAs) لتحميل ومعالجة المستندات المقدمة. خدمة CRE Matrix هي حصريًا أداة أتمتة وليست مسؤولة عن انتهاك المستخدم للأسرار التجارية.',
    'terms.p4.title': '4. تحديد المسؤولية',
    'terms.p4.text': 'الإدارة ليست مسؤولة عن دقة واكتمال البيانات المستخرجة بواسطة الذكاء الاصطناعي من المستندات المقدمة من قبل المستخدم. يتعهد المستخدم بالتحقق بشكل مستقل من البيانات قبل استخدامها في النمذجة المالية أو للأغراض التجارية.',
    'terms.p5.title': '5. التفاصيل',
    'terms.p5.text': 'مشروع CRE Matrix.',

    'refund.title': 'سياسة الاسترجاع',
    'refund.p1.title': '1. الشروط العامة للاسترجاع',
    'refund.p1.text': 'استرداد المبالغ المدفوعة للخطط المدفوعة (باقات الرصيد) ممكن فقط إذا لم ينفق المستخدم أي رصيد من الباقة المشتراة. يجب إرسال طلب استرداد في غضون 14 يومًا من الدفع.',
    'refund.p2.title': '2. الخدمات الرقمية والاسترداد الجزئي',
    'refund.p2.text': 'يرجى ملاحظة أن شراء الرصيد يشكل استلام ترخيص غير حصري للوصول إلى المحتوى الرقمي وقوة الحوسبة للخدمة. نظرًا لطبيعة الخدمات الرقمية، التي تتطلب تكاليف حوسبة فورية لخادم الذكاء الاصطناعي، لا يتم توفير استرداد جزئي لباقات الرصيد المستخدمة جزئيًا.',
    'refund.p3.title': '3. الأعطال الفنية',
    'refund.p3.text': 'في حالة حدوث أعطال فنية من جانب الخدمة (أخطاء التحليل، عدم توفر الخادم)، ونتيجة لذلك لم يتم تقديم الخدمة، يعيد النظام تلقائيًا الأرصدة المخصومة إلى رصيد حساب المستخدم.',
    'refund.p4.title': '4. إجراء الاسترجاع والجداول الزمنية',
    'refund.p4.text': 'لإصدار استرداد، يجب على المستخدم الاتصال بالدعم، وتوفير عنوان البريد الإلكتروني المسجل في الحساب وإيصال الدفع. يتم استرداد الأموال المحولة إلى حسابك المصرفي في غضون 5-30 يوم عمل (تعتمد الفترة على البنك الذي أصدر بطاقتك المصرفية).'
};

const existing_ru = {
    'footer.about.title': 'Матрица CRE',
    'footer.about.desc': 'Извлечение данных на базе искусственного интеллекта для профессионалов коммерческой недвижимости. Автоматизируйте андеррайтинг и прекращайте ручной ввод данных.',
    'footer.support': 'Свяжитесь с поддержкой:',
    'footer.legal.title': 'Юридическая информация',
    'footer.legal.terms': 'Условия использования (Договор оферты)',
    'footer.legal.privacy': 'Политика конфиденциальности',
    'footer.legal.refund': 'Политика возврата средств (Правила возврата)',
    'footer.payment.title': 'Принятые платежи',
    'footer.payment.desc': 'Мы принимаем крупные кредитные карты и криптовалюты.',
    'footer.rights': '© {0} CRE Matrix. Все права защищены.',

    'nav.back': '← Назад на главную',
    'privacy.title': 'Политика конфиденциальности',
    'privacy.p1.title': '1. Сбор информации',
    'privacy.p1.text': 'При использовании сервиса CRE Matrix мы собираем следующие данные: адрес электронной почты (при регистрации) и загруженные PDF-файлы (исключительно на время автоматизированной машинной обработки).',
    'privacy.p2.title': '2. Использование информации и Искусственный Интеллект',
    'privacy.p2.text': 'Собранные данные используются исключительно для предоставления услуг сервиса (генерация таблиц Excel). Ваша безопасность — наш приоритет. В отличие от публичных бесплатных нейросетей, CRE Matrix использует защищенные Enterprise API (Google LLC). В соответствии с условиями обслуживания провайдера, ваши документы НЕ используются для обучения публичных ИИ-моделей. Данные передаются по зашифрованному каналу исключительно для машинной обработки вашего запроса.',
    'privacy.p3.title': '3. Защита данных',
    'privacy.p3.text': 'Загруженные файлы (PDF) хранятся в изолированном облачном хранилище с применением политик безопасности Row Level Security (RLS) и доступны только владельцу аккаунта. Мы не передаем ваши данные третьим лицам для рекламных или иных целей, за исключением технологического партнера (Google LLC), выступающего исключительно в роли субпроцессора (обработчика) для работы ИИ.',
    'privacy.p4.title': '4. Права пользователя',
    'privacy.p4.text': 'Пользователь имеет право в любой момент запросить удаление своего аккаунта и всех связанных с ним файлов, обратившись в службу поддержки.',
    'legal.contact': 'Контакты для связи:',

    'terms.title': 'Пользовательское соглашение (Договор Оферты)',
    'terms.p1.title': '1. Общие положения',
    'terms.p1.text': 'Настоящее Пользовательское соглашение регулирует отношения между Администрацией сервиса CRE Matrix и Пользователем. Регистрируясь в сервисе, Пользователь подтверждает, что достиг возраста 18 лет и обладает необходимой правоспособностью.',
    'terms.p2.title': '2. Предмет соглашения',
    'terms.p2.text': 'Администрация предоставляет Пользователю неисключительную лицензию (доступ) к SaaS-платформе для автоматизированного анализа документов коммерческой недвижимости с использованием искусственного интеллекта. Услуги предоставляются «как есть».',
    'terms.p3.title': '3. Правомерность загружаемых данных и NDA',
    'terms.p3.text': 'Пользователь гарантирует, что имеет законные права и необходимые согласия правообладателей (включая отсутствие ограничений по соглашениям о неразглашении — NDA) на загрузку и обработку предоставляемых документов. Сервис CRE Matrix является исключительно инструментом автоматизации и не несет ответственности за нарушение Пользователем режима коммерческой тайны.',
    'terms.p4.title': '4. Ограничение ответственности',
    'terms.p4.text': 'Администрация не несет ответственности за точность и полноту данных, извлеченных искусственным интеллектом из предоставленных Пользователем документов. Пользователь обязуется самостоятельно проверять данные перед их использованием в финансовом моделировании или коммерческих целях.',
    'terms.p5.title': '5. Реквизиты',
    'terms.p5.text': 'Проект CRE Matrix.',

    'refund.title': 'Правила возврата средств',
    'refund.p1.title': '1. Общие условия возврата',
    'refund.p1.text': 'Возврат денежных средств за оплаченные тарифы (пакеты кредитов) возможен только в случае, если Пользователь не потратил ни одного кредита из приобретенного пакета. Запрос на возврат должен быть отправлен в течение 14 дней с момента оплаты.',
    'refund.p2.title': '2. Цифровые услуги и частичный возврат',
    'refund.p2.text': 'Обращаем внимание, что приобретение кредитов является получением неисключительной лицензии на доступ к цифровому контенту и вычислительным мощностям сервиса. В связи с природой цифровых услуг, которые требуют немедленных вычислительных затрат серверов ИИ, частичный возврат за частично использованный пакет кредитов не производится.',
    'refund.p3.title': '3. Технические сбои',
    'refund.p3.text': 'В случае возникновения технических сбоев на стороне сервиса (ошибки парсинга, недоступность сервера), в результате которых услуга не была оказана, система автоматически возвращает списанные кредиты на баланс аккаунта Пользователя.',
    'refund.p4.title': '4. Процедура и сроки возврата',
    'refund.p4.text': 'Для оформления возврата средств Пользователь должен обратиться в службу поддержки с указанием email адреса, на который зарегистрирован аккаунт, и чека об оплате. Возврат переведенных средств производится на ваш банковский счет в течение 5—30 рабочих дней (срок зависит от банка, выпустившего вашу банковскую карту).'
};


let content = fs.readFileSync('src/lib/i18n/translations.ts', 'utf-8');

function insertIntoBlock(lang, newDict) {
    const marker = "  " + lang + ": {";
    const idx = content.indexOf(marker);
    if (idx === -1) return;
    const insertIdx = idx + marker.length + 1;
    
    let lines = [];
    for (const [k, v] of Object.entries(newDict)) {
        const vEsc = v.replace(/'/g, "\\'");
        lines.push("    '" + k + "': '" + vEsc + "',");
    }
    
    const insertStr = lines.join('\\n') + '\\n';
    content = content.slice(0, insertIdx) + insertStr + content.slice(insertIdx);
}

insertIntoBlock('ru', existing_ru);
insertIntoBlock('en', translations_en);
insertIntoBlock('es', translations_es);
insertIntoBlock('ar', translations_ar);

fs.writeFileSync('src/lib/i18n/translations.ts', content, 'utf-8');
console.log("translations.ts updated successfully!");
