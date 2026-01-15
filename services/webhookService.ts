// Используем прокси в dev и production режимах
// В dev: прокси через Vite
// В production: прокси через nginx (нужно настроить на сервере)
// Если прокси не настроен в production, используем прямой URL (может не работать из-за CORS)
const WEBHOOK_URL = '/api/webhook';
const WEBHOOK_DIRECT_URL = 'https://cloud.1c.fitness/api/hs/lead/Webhook/86c0fd3d-e370-4499-9ed2-e032832de2dc';

interface WebhookData {
  name?: string;
  last_name?: string;
  phone: string;
  email?: string;
  comment?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ga_cid?: string;
  rs_cid?: string;
  ym_cid?: string;
  rs_vid?: string;
  ct_cid?: string;
}

// Получение UTM меток из URL
const getUtmParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });
  
  return utm;
};

// Получение ID из cookies для аналитики
const getAnalyticsIds = () => {
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const getLocalStorage = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  return {
    ga_cid: getCookie('_ga')?.split('.').slice(-2).join('.') || getLocalStorage('ga_cid') || undefined,
    rs_cid: getCookie('roistat_visit') || getLocalStorage('rs_cid') || undefined,
    ym_cid: getCookie('_ym_uid') || getLocalStorage('ym_cid') || undefined,
    rs_vid: getCookie('roistat_visit') || getLocalStorage('rs_vid') || undefined,
    ct_cid: getCookie('ct_cid') || getLocalStorage('ct_cid') || undefined,
  };
};

// Разделение имени и фамилии
const splitName = (fullName: string): { name: string; last_name: string } => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return {
      name: parts[0],
      last_name: parts.slice(1).join(' '),
    };
  }
  return {
    name: fullName || '',
    last_name: '',
  };
};

// Очистка телефона от лишних символов
const cleanPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const sendWebhookRequest = async (
  name: string,
  phone: string,
  email?: string,
  comment?: string
): Promise<boolean> => {
  try {
    const utm = getUtmParams();
    const analytics = getAnalyticsIds();
    const { name: firstName, last_name: lastName } = splitName(name);
    const cleanPhoneNumber = cleanPhone(phone);

    const data: WebhookData = {
      name: firstName,
      last_name: lastName,
      phone: cleanPhoneNumber.startsWith('7') ? cleanPhoneNumber : `7${cleanPhoneNumber}`,
      email: email || undefined,
      comment: comment || 'Новая заявка с сайта',
      ...utm,
      ...analytics,
    };

    // В dev режиме пробуем через прокси Vite
    // В production сразу используем прямой URL с no-cors (обходит CORS)
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE === 'development';
    if (isDev) {
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          return true;
        }
      } catch (proxyError) {
        // В dev режиме прокси должен работать, но на всякий случай fallback
        console.warn('Dev proxy failed, using direct URL:', proxyError);
      }
    }
    
    // Прямой запрос с no-cors (работает в production, обходит CORS)
    // В режиме no-cors мы не можем проверить response, но запрос отправится
    try {
      await fetch(WEBHOOK_DIRECT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      // В режиме no-cors нет ошибки = запрос отправился успешно
      return true;
    } catch (directError) {
      console.warn('Direct fetch failed, trying sendBeacon:', directError);
      
      // Последняя попытка через sendBeacon (работает даже при CORS)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const sent = navigator.sendBeacon(WEBHOOK_DIRECT_URL, blob);
        return sent;
      }
      
      return false;
    }
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Последняя попытка через sendBeacon как fallback
    if (navigator.sendBeacon) {
      try {
        const utm = getUtmParams();
        const analytics = getAnalyticsIds();
        const { name: firstName, last_name: lastName } = splitName(name);
        const cleanPhoneNumber = cleanPhone(phone);
        
        const data: WebhookData = {
          name: firstName,
          last_name: lastName,
          phone: cleanPhoneNumber.startsWith('7') ? cleanPhoneNumber : `7${cleanPhoneNumber}`,
          email: email || undefined,
          comment: comment || 'Новая заявка с сайта',
          ...utm,
          ...analytics,
        };
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const sent = navigator.sendBeacon(WEBHOOK_URL, blob);
        // sendBeacon возвращает true даже если запрос не был отправлен сразу
        // Поэтому считаем успешным
        return sent;
      } catch (beaconError) {
        console.error('SendBeacon fallback error:', beaconError);
      }
    }
    
    return false;
  }
};
