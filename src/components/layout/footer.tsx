import Link from "next/link"
import { Shield, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">JanSeva</span>
                                <span className="text-xs block text-slate-400">Public Grievance Portal</span>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 max-w-md">
                            An initiative to bridge the gap between citizens and government authorities.
                            Register complaints, track progress, and ensure accountability for public services.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/departments" className="hover:text-indigo-400 transition-colors">
                                    All Departments
                                </Link>
                            </li>
                            <li>
                                <Link href="/file-complaint" className="hover:text-indigo-400 transition-colors">
                                    File a Complaint
                                </Link>
                            </li>
                            <li>
                                <Link href="/track" className="hover:text-indigo-400 transition-colors">
                                    Track Complaint
                                </Link>
                            </li>
                            <li>
                                <Link href="/authorities" className="hover:text-indigo-400 transition-colors">
                                    Authority Directory
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-indigo-400" />
                                <span>support@janseva.gov.in</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-indigo-400" />
                                <span>1800-XXX-XXXX (Toll Free)</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 text-indigo-400 mt-0.5" />
                                <span>Central Grievance Cell,<br />New Delhi - 110001</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} JanSeva Public Grievance Portal. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/accessibility" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                            Accessibility
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
