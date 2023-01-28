import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { errorMessages } from '../data/messaging';

export function notifyError(
  code: number,
  type: 'api' | 'stripe' | 'pages' = 'api',
  message: string | null | any = null
) {
  if (!message) {
    message = Object.entries(errorMessages[type]).find((e) => {
      return e[1].code === code;
    })?.[1].message;
  }
  showNotification({
    title: 'Error',
    message: message ? message ?? 'Unknown error' : 'Unknown error',
    color: 'red',
    icon: <IconX />,
  });
}

export function notify(
  message: string,
  color: 'red' | 'green' | 'blue' = 'green'
) {
  showNotification({
    title: 'Success',
    message: message,
    color: color,
    icon: <IconCheck />,
  });
}
