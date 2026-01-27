export interface Bank {
  name: string
  color: string
  imageUrl: string
}

export const defaultBanks: Bank[] = [
  {
    name: 'Nubank',
    color: '#820AD1',
    imageUrl: '/banks/nubank.png',
  },
  {
    name: 'Itaú',
    color: '#EC7000',
    imageUrl: '/banks/itau.jpeg',
  },
  {
    name: 'Bradesco',
    color: '#CC092F',
    imageUrl: '/banks/bradesco.jpeg',
  },
  {
    name: 'Banco do Brasil',
    color: '#FFD400',
    imageUrl: '/banks/bb.png',
  },
  {
    name: 'Caixa',
    color: '#0066B3',
    imageUrl: '/banks/caixa.jpeg',
  },
  {
    name: 'Santander',
    color: '#EA1D25',
    imageUrl: '/banks/santander.jpeg',
  },
  {
    name: 'Inter',
    color: '#FF7A00',
    imageUrl: '/banks/inter.jpeg',
  },
  {
    name: 'C6 Bank',
    color: '#000000',
    imageUrl: '/banks/c6.png',
  },
  {
    name: 'PicPay',
    color: '#21C25E',
    imageUrl: '/banks/picpay.jpeg',
  },
  {
    name: 'Mercado Pago',
    color: '#009EE3',
    imageUrl: '/banks/mercadopago.jpeg',
  },
]
