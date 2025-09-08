import { extendVariants, Button as HeroButton } from '@heroui/react'

const Button = extendVariants(HeroButton, {
  variants: {
    color: {
      primary:
        'rounded-[14px] py-2.5 px-5 bg-brand text-white data-[hover=true]:bg-brand-hover data-[hover=true]:opacity-100! data-[pressed=true]:bg-brand-active',
      secondary:
        'border border-black/10 rounded-[14px] py-2.5 px-5 bg-transparent text-neutral-800 data-[hover=true]:bg-black/5 data-[hover=true]:opacity-100! data-[pressed=true]:bg-black/10',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

export default Button
