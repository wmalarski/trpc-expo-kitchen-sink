import { Button, Text, VStack } from 'native-base';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  message: string;
  onReloadPress: () => void;
};

export const ErrorMessage = ({
  message,
  onReloadPress,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'ErrorMessage' });

  return (
    <VStack>
      <Text>{message}</Text>
      <Button onPress={onReloadPress}>{t('reload')}</Button>
    </VStack>
  );
};
