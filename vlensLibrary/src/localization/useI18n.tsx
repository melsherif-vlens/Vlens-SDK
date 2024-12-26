// import { getLocales } from 'react-native-localize';
import { I18n } from 'i18n-js';

import en from './strings/en.json';
import ar from './strings/ar.json';
import { sdkConfig } from '../appConfig';

type UseI18nReturn = {
    t: (key: string, values?: Record<string, string | number | null | undefined>) => string;
    locale: string;
    isArabic: boolean;
    isRTL: boolean;
    direction: 'ltr' | 'rtl';
};

export function useI18n(): UseI18nReturn {
    // ----------------------------------------------------------------------------------------------------
    // MARK: States & Constants
    // ----------------------------------------------------------------------------------------------------
    // TODO: Replace this to use I18XS later
    const i18n = new I18n({
        en,
        ar,
    });

    i18n.locale = sdkConfig.i18n.defaultLocale;

    const t = (key: string) => i18n.t(key);
    const locale = sdkConfig.i18n.defaultLocale;
    i18n.locale = sdkConfig.i18n.defaultLocale;
    const isArabic = locale === 'ar';
    const isRTL = isArabic;
    const direction = isRTL ? 'rtl' : 'ltr';

    // ----------------------------------------------------------------------------------------------------
    // MARK: Functions
    // ----------------------------------------------------------------------------------------------------
    // function changeLocale(locale: string): void {
    //     i18n.locale = locale ?? getLocales()[0]?.languageCode ?? sdkConfig.i18n.defaultLocale;
    // }

    // ----------------------------------------------------------------------------------------------------
    // MARK: Return
    // ----------------------------------------------------------------------------------------------------
    return {
        t,
        locale,
        isArabic,
        isRTL,
        direction,
    };
}
