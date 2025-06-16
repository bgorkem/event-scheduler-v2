'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Plus,
    Edit,
    Trash2,
    Upload,
    Globe,
    Calendar,
    MapPin,
    Users,
    Clock,
    Zap
} from 'lucide-react'

// Mock data
const mockConferences = [
    {
        conference_id: 1,
        name: 'Databricks Data + AI Summit',
        location: 'San Francisco, CA',
        start_date: '2025-06-09',
        end_date: '2025-06-12',
        url: 'https://www.databricks.com/dataaisummit',
        description: 'A cornerstone event for the global data community',
        session_count: 156
    }
]

const mockSessions = [
    {
        session_id: 1,
        title: "A Conversation With AI influencer Josue Bogran",
        session_date: "2025-06-12",
        start_time: "14:35:00",
        end_time: "14:50:00",
        track: "Data Strategy",
        speakers: ["Josue Bogran"],
        session_type: "Presentation"
    },
    {
        session_id: 2,
        title: "10+ Reasons to Use Databricks' Delta Live Tables",
        session_date: "2025-06-10",
        start_time: "10:00:00",
        end_time: "11:00:00",
        track: "Data Engineering and Streaming",
        speakers: ["Jacek Laskowski"],
        session_type: "Presentation"
    }
]

export default function AdminPage() {
    const [conferences, setConferences] = useState(mockConferences)
    const [sessions, setSessions] = useState(mockSessions)
    const [isAddingConference, setIsAddingConference] = useState(false)
    const [isAddingSession, setIsAddingSession] = useState(false)
    const [parseUrl, setParseUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const [conferenceForm, setConferenceForm] = useState({
        name: '',
        location: '',
        start_date: '',
        end_date: '',
        url: '',
        description: ''
    })

    const [sessionForm, setSessionForm] = useState({
        title: '',
        description: '',
        session_date: '',
        start_time: '',
        end_time: '',
        track: '',
        session_type: '',
        speakers: ''
    })

    const handleAddConference = async () => {
        setLoading(true)
        try {
            // TODO: Add to Supabase
            const newConference = {
                conference_id: conferences.length + 1,
                ...conferenceForm,
                session_count: 0
            }
            setConferences([...conferences, newConference])
            setConferenceForm({
                name: '',
                location: '',
                start_date: '',
                end_date: '',
                url: '',
                description: ''
            })
            setIsAddingConference(false)
        } catch (error) {
            console.error('Error adding conference:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSession = async () => {
        setLoading(true)
        try {
            // TODO: Add to Supabase
            const newSession = {
                session_id: sessions.length + 1,
                ...sessionForm,
                speakers: sessionForm.speakers.split(',').map(s => s.trim())
            }
            setSessions([...sessions, newSession])
            setSessionForm({
                title: '',
                description: '',
                session_date: '',
                start_time: '',
                end_time: '',
                track: '',
                session_type: '',
                speakers: ''
            })
            setIsAddingSession(false)
        } catch (error) {
            console.error('Error adding session:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleParseUrl = async () => {
        setLoading(true)
        try {
            // TODO: Implement AI parsing
            console.log('Parsing URL:', parseUrl)

            // Simulate AI parsing
            await new Promise(resolve => setTimeout(resolve, 3000))

            // Mock parsed data
            const parsedSessions = [
                {
                    session_id: sessions.length + 1,
                    title: "AI-Parsed Session: Future of Data Science",
                    session_date: "2025-06-13",
                    start_time: "09:00:00",
                    end_time: "10:00:00",
                    track: "Artificial Intelligence",
                    speakers: ["AI Speaker"],
                    session_type: "Keynote"
                }
            ]

            setSessions([...sessions, ...parsedSessions])
            setParseUrl('')

            alert(`Successfully parsed ${parsedSessions.length} sessions from the URL!`)
        } catch (error) {
            console.error('Error parsing URL:', error)
            alert('Failed to parse the URL. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteConference = (id: number) => {
        setConferences(conferences.filter(c => c.conference_id !== id))
    }

    const handleDeleteSession = (id: number) => {
        setSessions(sessions.filter(s => s.session_id !== id))
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-lg text-gray-600">
                    Manage conferences, sessions, and use AI to parse conference schedules
                </p>
            </div>

            <Tabs defaultValue="conferences" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="conferences">Conferences</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="ai-parser">AI Parser</TabsTrigger>
                </TabsList>

                {/* Conferences Tab */}
                <TabsContent value="conferences" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Conferences</h2>
                        <Dialog open={isAddingConference} onOpenChange={setIsAddingConference}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Conference
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Conference</DialogTitle>
                                    <DialogDescription>
                                        Create a new conference to manage its sessions
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Conference Name</Label>
                                            <Input
                                                id="name"
                                                value={conferenceForm.name}
                                                onChange={(e) => setConferenceForm({ ...conferenceForm, name: e.target.value })}
                                                placeholder="Enter conference name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={conferenceForm.location}
                                                onChange={(e) => setConferenceForm({ ...conferenceForm, location: e.target.value })}
                                                placeholder="Conference location"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="start_date">Start Date</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={conferenceForm.start_date}
                                                onChange={(e) => setConferenceForm({ ...conferenceForm, start_date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="end_date">End Date</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={conferenceForm.end_date}
                                                onChange={(e) => setConferenceForm({ ...conferenceForm, end_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="url">Conference URL</Label>
                                        <Input
                                            id="url"
                                            value={conferenceForm.url}
                                            onChange={(e) => setConferenceForm({ ...conferenceForm, url: e.target.value })}
                                            placeholder="https://conference-website.com"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={conferenceForm.description}
                                            onChange={(e) => setConferenceForm({ ...conferenceForm, description: e.target.value })}
                                            placeholder="Conference description"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setIsAddingConference(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddConference} disabled={loading}>
                                            {loading ? 'Adding...' : 'Add Conference'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {conferences.map((conference) => (
                            <Card key={conference.conference_id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{conference.name}</CardTitle>
                                            <CardDescription className="flex items-center mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {conference.location}
                                            </CardDescription>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button size="sm" variant="ghost">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteConference(conference.conference_id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(conference.start_date).toLocaleDateString()} - {new Date(conference.end_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="h-4 w-4 mr-2" />
                                            {conference.session_count} sessions
                                        </div>
                                        {conference.url && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Globe className="h-4 w-4 mr-2" />
                                                <a href={conference.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Conference Website
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                        {conference.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Sessions Tab */}
                <TabsContent value="sessions" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Sessions</h2>
                        <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Session
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Session</DialogTitle>
                                    <DialogDescription>
                                        Create a new session for the conference
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="session-title">Session Title</Label>
                                        <Input
                                            id="session-title"
                                            value={sessionForm.title}
                                            onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                                            placeholder="Enter session title"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="session-description">Description</Label>
                                        <Textarea
                                            id="session-description"
                                            value={sessionForm.description}
                                            onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                                            placeholder="Session description"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="session-date">Date</Label>
                                            <Input
                                                id="session-date"
                                                type="date"
                                                value={sessionForm.session_date}
                                                onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="start-time">Start Time</Label>
                                            <Input
                                                id="start-time"
                                                type="time"
                                                value={sessionForm.start_time}
                                                onChange={(e) => setSessionForm({ ...sessionForm, start_time: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="end-time">End Time</Label>
                                            <Input
                                                id="end-time"
                                                type="time"
                                                value={sessionForm.end_time}
                                                onChange={(e) => setSessionForm({ ...sessionForm, end_time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="track">Track</Label>
                                            <Select value={sessionForm.track} onValueChange={(value) => setSessionForm({ ...sessionForm, track: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select track" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Data Strategy">Data Strategy</SelectItem>
                                                    <SelectItem value="Data Engineering and Streaming">Data Engineering and Streaming</SelectItem>
                                                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                                                    <SelectItem value="Data and AI Governance">Data and AI Governance</SelectItem>
                                                    <SelectItem value="Data Warehousing">Data Warehousing</SelectItem>
                                                    <SelectItem value="Data Lakehouse Architecture and Implementation">Data Lakehouse Architecture and Implementation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="session-type">Session Type</Label>
                                            <Select value={sessionForm.session_type} onValueChange={(value) => setSessionForm({ ...sessionForm, session_type: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Presentation">Presentation</SelectItem>
                                                    <SelectItem value="Demo">Demo</SelectItem>
                                                    <SelectItem value="Keynote">Keynote</SelectItem>
                                                    <SelectItem value="Panel">Panel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="speakers">Speakers</Label>
                                        <Input
                                            id="speakers"
                                            value={sessionForm.speakers}
                                            onChange={(e) => setSessionForm({ ...sessionForm, speakers: e.target.value })}
                                            placeholder="Enter speaker names (comma separated)"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setIsAddingSession(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddSession} disabled={loading}>
                                            {loading ? 'Adding...' : 'Add Session'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <Card key={session.session_id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline">{session.track}</Badge>
                                                <Badge variant="secondary">{session.session_type}</Badge>
                                            </div>
                                            <CardTitle className="text-lg">{session.title}</CardTitle>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {new Date(session.session_date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {session.start_time} - {session.end_time}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {session.speakers.join(', ')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button size="sm" variant="ghost">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteSession(session.session_id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* AI Parser Tab */}
                <TabsContent value="ai-parser" className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">AI Conference Parser</h2>
                        <p className="text-gray-600 mb-6">
                            Upload conference schedules from web URLs using intelligent AI parsing.
                            Our AI will extract sessions, speakers, and details automatically.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Zap className="h-5 w-5 mr-2 text-orange-500" />
                                Parse Conference Schedule
                            </CardTitle>
                            <CardDescription>
                                Enter a conference website URL to automatically extract session information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        placeholder="https://conference-website.com/schedule"
                                        value={parseUrl}
                                        onChange={(e) => setParseUrl(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleParseUrl} disabled={loading || !parseUrl}>
                                    {loading ? (
                                        <>
                                            <Upload className="h-4 w-4 mr-2 animate-spin" />
                                            Parsing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Parse URL
                                        </>
                                    )}
                                </Button>
                            </div>

                            {loading && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
                                    <div className="flex items-center">
                                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                                        AI is parsing the conference schedule... This may take a few moments.
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">156</div>
                                    <div className="text-sm text-gray-600">Sessions Parsed</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">98%</div>
                                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">2m 30s</div>
                                    <div className="text-sm text-gray-600">Avg. Parse Time</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Supported Formats</CardTitle>
                            <CardDescription>
                                Our AI parser supports various conference website formats
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Supported Platforms</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Event management platforms (Eventbrite, Whova)</li>
                                        <li>• Conference websites with structured data</li>
                                        <li>• Schedule pages with tables or cards</li>
                                        <li>• PDF schedule documents</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium">Extracted Information</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Session titles and descriptions</li>
                                        <li>• Speaker names and bios</li>
                                        <li>• Date, time, and duration</li>
                                        <li>• Session tracks and types</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 