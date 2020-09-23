import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const App: FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>DLR</h1>
      <p>{t('test-string')}</p>
    </div>
  );
};

export default App;
