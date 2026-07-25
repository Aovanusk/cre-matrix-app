import json

existing_ru = {
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
}

import os
from google import genai
from google.genai import types

def generate():
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY_1"))
    
    prompt = f"""
    Translate the following Russian JSON dictionary into English, Spanish, and Arabic.
    Maintain the exact keys. Do not change the `{{0}}` variable.
    Return ONLY valid JSON with three root keys: "en", "es", "ar".
    Inside each, put the translated keys.
    
    JSON to translate:
    {json.dumps(existing_ru, ensure_ascii=False, indent=2)}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    
    res = json.loads(response.text)
    
    # Read the existing translations.ts
    with open('src/lib/i18n/translations.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will just append these into the respective blocks using a quick regex/string manipulation
    # This is a bit dirty but works since we know the format
    
    def insert_into_block(lang, new_dict):
        nonlocal content
        # Find the block start: `lang: {`
        marker = f"  {lang}: {{"
        idx = content.find(marker)
        if idx == -1: return
        insert_idx = idx + len(marker) + 1
        
        # Build string to insert
        lines = []
        for k, v in new_dict.items():
            # escape single quotes
            v_esc = v.replace("'", "\\'")
            lines.append(f"    '{k}': '{v_esc}',")
        
        insert_str = "\n".join(lines) + "\n"
        content = content[:insert_idx] + insert_str + content[insert_idx:]
        
    insert_into_block('ru', existing_ru)
    insert_into_block('en', res['en'])
    insert_into_block('es', res['es'])
    insert_into_block('ar', res['ar'])
    
    with open('src/lib/i18n/translations.ts', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("translations.ts updated successfully!")

if __name__ == "__main__":
    generate()
