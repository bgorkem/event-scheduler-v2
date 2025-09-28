"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
// import { useState } from 'react'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Separator } from '@/components/ui/separator'
// import { Mail, Lock, User, Github, Chrome } from 'lucide-react'
// import { supabase } from '@/lib/supabase/client'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EventSchedule
          </span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Sign Up Temporarily Disabled
        </h1>
        <p className="text-gray-600">
          We&apos;re putting the finishing touches on the experience. Accounts
          will be available soon—thanks for your patience!
        </p>
        <div className="space-y-3">
          <Link href="/auth/signin">
            <Button className="w-full">Go to Sign In</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  /*
    Original signup implementation preserved for future use:

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [success, setSuccess] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            setLoading(false)
            return
        }

        if (!agreeToTerms) {
            setError('Please agree to the terms of service')
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { name: formData.name }
                }
            })
            if (error) {
                setError(error.message)
            } else {
                setSuccess('Account created! Please check your email for a confirmation link.')
            }
        } catch (error: any) {
            setError('Failed to create account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSocialSignUp = async (provider: 'google' | 'github') => {
        setLoading(true)
        try {
            // TODO: Implement Supabase social sign up
            console.log('Sign up with:', provider)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Redirect will be handled by Supabase
        } catch (error) {
            console.error('Social sign up error:', error)
            setError(`Failed to sign up with ${provider}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                // Header
                <div className="text-center mb-8">
                    <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            EventSchedule
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Join thousands of professionals managing their conference schedules
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Create your account to start scheduling conference sessions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        // Social Sign Up
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleSocialSignUp('google')}
                                disabled={loading}
                            >
                                <Chrome className="h-4 w-4 mr-2" />
                                Continue with Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleSocialSignUp('github')}
                                disabled={loading}
                            >
                                <Github className="h-4 w-4 mr-2" />
                                Continue with GitHub
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                            </div>
                        </div>

                        // Email Sign Up Form
                        <form onSubmit={handleEmailSignUp} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Password must be at least 6 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="agree-terms"
                                    type="checkbox"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="agree-terms" className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create account'}
                            </Button>
                        </form>

                        // Sign In Link
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
    */
}
