"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  Building2,
  Briefcase,
  Users,
  BadgeCheck,
  Globe,
  MapPin,
  Loader2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const steps = [
  { id: 1, name: "Account", description: "Basic info" },
  { id: 2, name: "Profile", description: "Work details" },
  { id: 3, name: "Location", description: "Region info" },
]

const departments = ["Sales", "Marketing", "Engineering", "Product", "Support", "Operations", "HR", "Finance"]
const regions = ["APAC", "EMEA", "Americas", "Malaysia", "Singapore", "Indonesia", "Thailand", "Vietnam", "Philippines"]

export default function SignUpPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone_number: "",
    full_name: "",
    organization: "",
    position: "",
    department: "Sales",
    employee_id: "",
    region: "",
    territory: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      return
    }
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Handle sign up logic here
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.password && formData.phone_number && formData.full_name
      case 2:
        return formData.organization && formData.position
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Back button */}
      <div className="relative z-10 p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back())}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {currentStep > 1 ? "Previous step" : "Back"}
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full min-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl brand-gradient mb-4 shadow-lg shadow-primary/25 animate-in zoom-in duration-500">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-1">Join us and boost your sales performance</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                        transition-all duration-500 ease-out
                        ${
                          currentStep > step.id
                            ? "brand-gradient text-white shadow-lg shadow-primary/25"
                            : currentStep === step.id
                              ? "brand-gradient text-white shadow-lg shadow-primary/25 scale-110"
                              : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                    </div>
                    <span
                      className={`
                        text-xs mt-2 font-medium transition-colors duration-300
                        ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}
                      `}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        h-0.5 w-16 sm:w-24 mx-2 transition-all duration-500 rounded-full
                        ${currentStep > step.id ? "brand-gradient" : "bg-muted"}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-border/50 shadow-xl shadow-primary/5 backdrop-blur-sm overflow-hidden">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">
                {currentStep === 1 && "Account Information"}
                {currentStep === 2 && "Work Profile"}
                {currentStep === 3 && "Location Details"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Enter your basic account details"}
                {currentStep === 2 && "Tell us about your work"}
                {currentStep === 3 && "Where are you based? (Optional)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Account Information */}
                <div
                  className={`space-y-4 transition-all duration-500 ${
                    currentStep === 1 ? "opacity-100 translate-x-0" : "hidden"
                  }`}
                >
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.full_name}
                        onChange={(e) => updateField("full_name", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="+60 12-345 6789"
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.phone_number}
                        onChange={(e) => updateField("phone_number", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters with a number and symbol
                    </p>
                  </div>
                </div>

                {/* Step 2: Work Profile */}
                <div
                  className={`space-y-4 transition-all duration-500 ${
                    currentStep === 2 ? "opacity-100 translate-x-0" : "hidden"
                  }`}
                >
                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="organization"
                        type="text"
                        placeholder="Acme Corporation"
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.organization}
                        onChange={(e) => updateField("organization", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <div className="relative group">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="position"
                        type="text"
                        placeholder="Sales Manager"
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.position}
                        onChange={(e) => updateField("position", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                      <Select value={formData.department} onValueChange={(value) => updateField("department", value)}>
                        <SelectTrigger className="pl-10 transition-all focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Employee ID */}
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">
                      Employee ID <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="relative group">
                      <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="employee_id"
                        type="text"
                        placeholder="EMP-12345"
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.employee_id}
                        onChange={(e) => updateField("employee_id", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Location Details */}
                <div
                  className={`space-y-4 transition-all duration-500 ${
                    currentStep === 3 ? "opacity-100 translate-x-0" : "hidden"
                  }`}
                >
                  {/* Region */}
                  <div className="space-y-2">
                    <Label htmlFor="region">
                      Region <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                      <Select value={formData.region} onValueChange={(value) => updateField("region", value)}>
                        <SelectTrigger className="pl-10 transition-all focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Territory */}
                  <div className="space-y-2">
                    <Label htmlFor="territory">
                      Territory <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input
                        id="territory"
                        type="text"
                        placeholder="Kuala Lumpur Metro"
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                        value={formData.territory}
                        onChange={(e) => updateField("territory", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Summary card */}
                  <div className="mt-6 p-4 rounded-xl surface-rose">
                    <h4 className="font-medium text-sm text-foreground mb-2">Account Summary</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">{formData.full_name}</span> at{" "}
                        {formData.organization}
                      </p>
                      <p>
                        {formData.position} • {formData.department}
                      </p>
                      <p>{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full brand-gradient text-white font-medium hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] mt-6"
                  disabled={isLoading || !canProceed()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : currentStep < 3 ? (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Terms */}
                {currentStep === 3 && (
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground mt-6 animate-in fade-in duration-1000 delay-300">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
