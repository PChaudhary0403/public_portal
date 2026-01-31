"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface RatingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    complaintId: string
    complaintTitle: string
    authorityName?: string
    onRatingSubmitted?: () => void
}

export function RatingDialog({
    open,
    onOpenChange,
    complaintId,
    complaintTitle,
    authorityName,
    onRatingSubmitted
}: RatingDialogProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a rating")
            return
        }

        try {
            setLoading(true)
            const response = await fetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    complaintId,
                    rating,
                    feedback: feedback.trim() || null
                })
            })

            if (response.ok) {
                setSubmitted(true)
                onRatingSubmitted?.()
                setTimeout(() => {
                    onOpenChange(false)
                    // Reset state
                    setRating(0)
                    setFeedback("")
                    setSubmitted(false)
                }, 2000)
            } else {
                const err = await response.json()
                alert(err.error || "Failed to submit rating")
            }
        } catch (error) {
            console.error("Rating error:", error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const getRatingLabel = (r: number) => {
        switch (r) {
            case 1: return "Poor"
            case 2: return "Fair"
            case 3: return "Good"
            case 4: return "Very Good"
            case 5: return "Excellent"
            default: return "Select rating"
        }
    }

    if (submitted) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                            <Star className="h-8 w-8 fill-green-500 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Thank You!</h3>
                        <p className="text-slate-500">Your feedback helps improve public services.</p>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Rate Your Experience</DialogTitle>
                    <DialogDescription>
                        How was your experience with the resolution of your complaint?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {/* Complaint Info */}
                    <div className="bg-slate-50 rounded-lg p-3 mb-6">
                        <p className="text-sm text-slate-500">Complaint</p>
                        <p className="font-medium text-slate-900">{complaintTitle}</p>
                        {authorityName && (
                            <p className="text-sm text-slate-600 mt-1">
                                Resolved by: <span className="font-medium">{authorityName}</span>
                            </p>
                        )}
                    </div>

                    {/* Star Rating */}
                    <div className="text-center mb-6">
                        <div className="flex justify-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`h-10 w-10 transition-colors ${star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-slate-300 hover:text-yellow-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className={`text-sm font-medium ${rating > 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                            {getRatingLabel(hoveredRating || rating)}
                        </p>
                    </div>

                    {/* Feedback */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Additional feedback (optional)
                        </label>
                        <Textarea
                            placeholder="Share your experience..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-xs text-slate-400 text-right mt-1">
                            {feedback.length}/500
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || rating === 0}>
                        {loading ? "Submitting..." : "Submit Rating"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// Inline star display component
interface StarRatingProps {
    rating: number
    size?: "sm" | "md" | "lg"
    showValue?: boolean
}

export function StarRating({ rating, size = "md", showValue = false }: StarRatingProps) {
    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    }

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${sizeClasses[size]} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                        }`}
                />
            ))}
            {showValue && (
                <span className="ml-1 text-sm text-slate-600">{rating.toFixed(1)}</span>
            )}
        </div>
    )
}
