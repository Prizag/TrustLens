"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    {...props}
    className={`relative inline-flex h-[30px] w-[60px] flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-300 transition-colors data-[state=checked]:bg-blue-500 ${className}`}
  >
    <SwitchPrimitive.Thumb
      className="pointer-events-none absolute left-[2px] top-[2px] h-[26px] w-[26px] rounded-full bg-white shadow transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-[30px] data-[state=unchecked]:translate-x-0"
    />
  </SwitchPrimitive.Root>
))

Switch.displayName = "Switch"
