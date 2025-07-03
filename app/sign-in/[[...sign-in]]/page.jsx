"use client"

import { SignIn } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-2xl shadow-lg">
              TL
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to your TrustLens account</p>
        </div>

        {/* Clerk Sign In Component */}
   
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white hover:bg-gray-50 border-gray-200 text-gray-700",
                  socialButtonsBlockButtonText: "font-medium",
                  formButtonPrimary:
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white",
                  formFieldInput: "border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                  footerActionLink: "text-blue-600 hover:text-blue-800",
                  identityPreviewText: "text-gray-700",
                  formFieldLabel: "text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500",
                  formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
                  alertText: "text-red-600",
                  formFieldErrorText: "text-red-600",
                  formFieldSuccessText: "text-green-600",
                  formFieldWarningText: "text-amber-600",
                  formFieldHintText: "text-gray-500",
                  formFieldAction: "text-blue-600 hover:text-blue-800",
                  formResendCodeLink: "text-blue-600 hover:text-blue-800",
                  otpCodeFieldInput: "border-gray-200 focus:border-blue-500",
                  formFieldRadioInput: "text-blue-600 focus:ring-blue-500",
                  formFieldCheckboxInput: "text-blue-600 focus:ring-blue-500",
                },
              }}
              redirectUrl="/"
              signUpUrl="/sign-up"
              routing="hash"
            />
         

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  )
}
