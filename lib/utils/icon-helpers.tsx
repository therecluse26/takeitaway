import Image from 'next/image';

export function getIconForBrand(brand: string | null) {
  let iconPath = '/payment-icons/generic.svg';
  switch (brand) {
    case 'visa':
      iconPath = '/payment-icons/visa.svg';
      break;
    case 'mastercard':
      iconPath = '/payment-icons/mastercard.svg';
      break;
    case 'amex':
      iconPath = '/payment-icons/amex.svg';
      break;
    case 'discover':
      iconPath = '/payment-icons/discover.svg';
      break;
    case 'jcb':
      iconPath = '/payment-icons/jcb.svg';
      break;
    case 'diners':
      iconPath = '/payment-icons/diners.svg';
      break;
    case 'unionpay':
      iconPath = '/payment-icons/unionpay.svg';
      break;
    case 'maestro':
      iconPath = '/payment-icons/maestro.svg';
      break;
    case 'paypal':
      iconPath = '/payment-icons/paypal.svg';
      break;
    case 'alipay':
      iconPath = '/payment-icons/alipay.svg';
      break;
    case 'elo':
      iconPath = '/payment-icons/elo.svg';
      break;
    case 'hipercard':
      iconPath = '/payment-icons/hipercard.svg';
      break;
    case 'hiper':
      iconPath = '/payment-icons/hiper.svg';
      break;
    case 'mir':
      iconPath = '/payment-icons/mir.svg';
      break;
  }
  return <Image src={iconPath} alt="Visa" width={32} height={32} />;
}
