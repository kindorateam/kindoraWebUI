import { extendVariants, Button as HeroButton } from '@heroui/react'

const Button = extendVariants(HeroButton, {
  variants: {
    color: {
      primary: 'text-[#000] bg-[#84cc16]',
    },
    isDisabled: {
      true: 'bg-[#eaeaea] text-[#000] opacity-50 cursor-not-allowed',
    },
    size: {
      xs: 'px-2 min-w-12 h-6 text-tiny gap-1 rounded-small',
      md: 'px-4 min-w-20 h-10 text-small gap-2 rounded-small',
      xl: 'px-8 min-w-28 h-14 text-large gap-4 rounded-medium',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'xl',
  },
  compoundVariants: [
    {
      isDisabled: true,
      class: 'bg-[#84cc16]/80 opacity-100',
    },
  ],
})

export default Button
