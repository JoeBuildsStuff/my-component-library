"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import AttioContact from "./contacts-form"
import { ContactWithRelations } from "../_lib/validations"
import { Button } from "@/components/ui/button"
import { X, Plus, Save } from "lucide-react"

interface ContactFormData {
  firstName: string
  lastName: string
  emails: string[]
  phones: string[]
  city: string
  state: string
  company: string
  description: string
  linkedin: string
  jobTitle: string
}

// Helper function to transform form data to database format
function transformFormDataToContact(formData: ContactFormData): Partial<ContactWithRelations> & { _emails?: string[]; _phones?: string[] } {
  const contactData: Partial<ContactWithRelations> & { _emails?: string[]; _phones?: string[] } = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    city: formData.city,
    state: formData.state,
    description: formData.description,
    linkedin: formData.linkedin,
    job_title: formData.jobTitle,
  }

  // Handle company (would need to lookup company ID or create new company)
  // For now, we'll just set company_id to null
  // In a real implementation, you'd need to find or create the company
  contactData.company_id = null

  // Handle emails and phones (these would be handled separately through related tables)
  // For the MVP, we'll store them in the onChange callback and handle them in the action
  contactData._emails = formData.emails.filter(email => email.trim() !== '')
  contactData._phones = formData.phones.filter(phone => phone.trim() !== '')

  return contactData
}

// Add Form Wrapper
export function ContactAddForm({
  onSuccess,
  onCancel,
  createAction
}: {
  onSuccess?: () => void
  onCancel?: () => void
  createAction?: (data: Partial<ContactWithRelations>) => Promise<{ success: boolean; error?: string }>
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData | null>(null)

  const handleFormDataChange = useCallback((data: ContactFormData) => {
    setFormData(data)
  }, [])

  const handleSubmit = async () => {
    if (!formData || !createAction) return

    setIsSubmitting(true)
    try {
      const contactData = transformFormDataToContact(formData)
      const result = await createAction(contactData)
      
      if (result.success) {
        router.refresh()
        onSuccess?.()
      } else {
        console.error("Failed to create contact:", result.error)
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error("Error creating contact:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <AttioContact
          onChange={handleFormDataChange}
        />
      </div>
      
      <div className="flex justify-between gap-2 p-4 border-t bg-background">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-1/2"
        >
          <X className="size-4 shrink-0" /> Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData}
          className="w-1/2"
        >
          <Plus className="size-4 shrink-0" />
          {isSubmitting ? "Adding..." : "Add Contact"}
        </Button>
      </div>
    </div>
  )
}

// Edit Form Wrapper
export function ContactEditForm({
  data,
  onSuccess,
  onCancel,
  updateAction
}: {
  data: ContactWithRelations
  onSuccess?: () => void
  onCancel?: () => void
  updateAction?: (id: string, data: Partial<ContactWithRelations>) => Promise<{ success: boolean; error?: string }>
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData | null>(null)

  // Extract initial values from the contact data
  const initialEmails = data.emails?.map(e => e.email) || []
  const initialPhones = data.phones?.map(p => p.phone) || []

  const handleFormDataChange = useCallback((formData: ContactFormData) => {
    setFormData(formData)
  }, [])

  const handleSubmit = async () => {
    if (!formData || !updateAction) return

    setIsSubmitting(true)
    try {
      const contactData = transformFormDataToContact(formData)
      const result = await updateAction(data.id, contactData)
      
      if (result.success) {
        router.refresh()
        onSuccess?.()
      } else {
        console.error("Failed to update contact:", result.error)
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error("Error updating contact:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <AttioContact
          initialFirstName={data.first_name || ""}
          initialLastName={data.last_name || ""}
          initialEmails={initialEmails}
          initialPhones={initialPhones}
          initialCity={data.city || ""}
          initialState={data.state || ""}
          initialCompany={data.company?.name || ""}
          initialDescription={data.description || ""}
          initialLinkedin={data.linkedin || ""}
          initialJobTitle={data.job_title || ""}
          onChange={handleFormDataChange}
        />
      </div>
      
      <div className="flex justify-between gap-2 p-4 border-t bg-background">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-1/2"
        >
          <X className="size-4 shrink-0" /> Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData}
          className="w-1/2"
        >
          <Save className="size-4 shrink-0" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}