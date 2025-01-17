import React, { createContext, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ActivityNotifications } from '@pages/activity/components/activity-table/activity-notifications';
import { ChatsContextProvider } from '@pages/chats/chats-context';
import {
  useNotification,
  useTheme,
  LANG,
  LangContextProvider,
  PropsWithChildrenOnly,
  NotificationContextProvider,
} from '@shared/index';
import { AppDispatch, fetchCurrentUser, store, wsConnect, wsDisconnect } from '@store/index';
import { useAxiosInterceptors } from '@store/middleware';
import { ConfigProvider, Switch, theme as antTheme } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import ruRU from 'antd/lib/locale/ru_RU';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { router } from './router/router';
import 'dayjs/locale/ru';

import './index.css';

dayjs.extend(utc); // активация плагина
dayjs.locale('ru'); // установка локали

i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: false, //вывод отладочной информации в консоль
    ns: ['translation', 'phrases'], // Добавляем namespaces
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export const AudioLevelContext = createContext<any>(null);

//TODO: вынести в отдельный файл
export const WsWrapper = ({ children }: PropsWithChildrenOnly) => {
  const dispatch = useDispatch<AppDispatch>();

  useAxiosInterceptors();

  // @ts-ignore
  useEffect(() => {
    // @ts-ignore
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchCurrentUser());

      dispatch(
        wsConnect({
          url: `${import.meta.env.VITE_BASE_WS}/ws?token=${localStorage.getItem('token')}`,
        }),
      );
    }

    return () => wsDisconnect();
  }, [dispatch]);

  return children;
};

export const App = () => {
  const { theme, toggleTheme } = useTheme();
  const themeConfig = {
    algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };


  //TODO: проверить нельзя ли отказаться от NotificationContextProvider и использвоать везде useNotification()
  const {
    showNotification,
    showInfoNotification,
    showErrorNotification,
    closeNotification,
    closeAllNotifications,
    NotificationContext: NotificationCtx,
  } = useNotification();
  const [lang, setLang] = useState(LANG.RU);

  return (
    <LangContextProvider lang={lang} setLang={setLang}>
      <StoreProvider store={store}>
        <WsWrapper />
        <ConfigProvider theme={themeConfig} locale={lang === LANG.RU ? ruRU : enUS}>
          <NotificationContextProvider
            showNotification={showNotification}
            showInfoNotification={showInfoNotification}
            showErrorNotification={showErrorNotification}
            closeNotification={closeNotification}
            closeAllNotifications={closeAllNotifications}>
            <ActivityNotifications />
            <div className="w-full h-screen overflow-hidden">
              <div className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
                <Switch
                  className="absolute right-10 bottom-10"
                  checkedChildren="Dark"
                  unCheckedChildren="Light"
                  value={theme === 'dark'}
                  onChange={toggleTheme}
                />
              </div>
              {/* <div className={lang === 'ru' ? 'bg-black' : 'bg-white'}>
                        <Switch
                          className="absolute right-4 top-12"
                          checkedChildren="RU"
                          unCheckedChildren="EN"
                          defaultChecked
                          onChange={() => setLang((prev) => (prev === LANG.EN ? LANG.RU : LANG.EN))}
                        />
                      </div> */}
              <ChatsContextProvider>
                <RouterProvider router={router} />
              </ChatsContextProvider>
            </div>
            <NotificationCtx />
          </NotificationContextProvider>
        </ConfigProvider>
      </StoreProvider>
    </LangContextProvider>
  );
};
