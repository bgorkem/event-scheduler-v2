'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Search,
    Calendar,
    Share2,
    Clock,
    MapPin,
    User,
    Grid3X3,
    List,
    SlidersHorizontal
} from 'lucide-react'

// Mock data - in real app this would come from Supabase
const mockSessions = [
    {
        session_id: 1,
        title: "A Conversation With AI influencer Josue Bogran",
        description: "Join us for an engaging discussion about the future of AI and its impact on business transformation.",
        session_date: "2025-06-12",
        start_time: "14:35:00",
        end_time: "14:50:00",
        track: "Data Strategy",
        speakers: ["Josue Bogran"],
        organization: "JosueBogran.com & zeb.co",
        session_type: "Presentation"
    },
    {
        session_id: 2,
        title: "10+ Reasons to Use Databricks' Delta Live Tables for Your Next Data Processing Project",
        description: "Discover the power of Delta Live Tables and how they can revolutionize your data processing pipelines.",
        session_date: "2025-06-10",
        start_time: "10:00:00",
        end_time: "11:00:00",
        track: "Data Engineering and Streaming",
        speakers: ["Jacek Laskowski"],
        organization: "japila.pl",
        session_type: "Presentation"
    },
    {
        session_id: 3,
        title: "A No-Code ML Forecasting Platform for Retail and CPG Companies",
        description: "Learn how to build ML forecasting solutions without writing code, specifically designed for retail and CPG industries.",
        session_date: "2025-06-11",
        start_time: "13:00:00",
        end_time: "14:00:00",
        track: "Artificial Intelligence",
        speakers: ["Moez Ali"],
        organization: "Antuit - A Zebra Technologies company",
        session_type: "Presentation"
    },
    {
        session_id: 4,
        title: "Accelerate End-to-End Multi-Agents on Databricks and DSPy",
        description: "Explore the latest developments in multi-agent systems and how to implement them using Databricks and DSPy.",
        session_date: "2025-06-12",
        start_time: "15:00:00",
        end_time: "16:00:00",
        track: "Artificial Intelligence",
        speakers: ["Austin Choi"],
        organization: "Databricks",
        session_type: "Demo"
    }
]

const tracks = [
    "All Tracks",
    "Data Strategy",
    "Data Engineering and Streaming",
    "Artificial Intelligence",
    "Data and AI Governance",
    "Data Warehousing",
    "Data Lakehouse Architecture and Implementation"
]

const sessionTypes = ["All Types", "Presentation", "Demo", "Keynote", "Panel"]

export default function SessionsPage() {
    const [sessions] = useState(mockSessions)
    const [loading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTrack, setSelectedTrack] = useState('all')
    const [selectedDate, setSelectedDate] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)

    // Filter sessions based on search and filters
    const filteredSessions = sessions.filter((session: typeof mockSessions[0]) => {
        const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.speakers.some((speaker: string) => speaker.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesTrack = selectedTrack === 'all' || session.track === selectedTrack
        const matchesDate = selectedDate === 'all' || session.session_date === selectedDate

        return matchesSearch && matchesTrack && matchesDate
    })

    const handleAddToSchedule = (sessionId: number) => {
        // TODO: Implement add to schedule functionality
        console.log('Adding session to schedule:', sessionId)
    }

    const handleShareSession = (session: typeof mockSessions[0]) => {
        // TODO: Implement share functionality
        console.log('Sharing session:', session.title)
    }

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Sessions</h1>
                <p className="text-lg text-gray-600">
                    Discover and schedule conference sessions that match your interests
                </p>
            </div>

            {/* Search and Controls */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Search sessions, speakers, or topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden lg:flex gap-2">
                        <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select track" />
                            </SelectTrigger>
                            <SelectContent>
                                {tracks.map(track => (
                                    <SelectItem key={track} value={track}>{track}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-[150px]"
                        />
                    </div>

                    {/* Mobile Filter Button */}
                    <Sheet open={showFilters} onOpenChange={setShowFilters}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="outline">
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="space-y-4 mt-8">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Track</label>
                                    <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select track" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tracks.map(track => (
                                                <SelectItem key={track} value={track}>{track}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Date</label>
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* View Toggle */}
                    <div className="flex border rounded-lg">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="rounded-r-none"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="rounded-l-none"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Search: {searchTerm}
                            <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                                ×
                            </button>
                        </Badge>
                    )}
                    {selectedTrack !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Track: {selectedTrack}
                            <button onClick={() => setSelectedTrack('all')} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                                ×
                            </button>
                        </Badge>
                    )}
                    {selectedDate !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Date: {formatDate(selectedDate)}
                            <button onClick={() => setSelectedDate('all')} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                                ×
                            </button>
                        </Badge>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
                <p className="text-gray-600">
                    Showing {filteredSessions.length} of {sessions.length} sessions
                </p>
            </div>

            {/* Sessions Grid/List */}
            {loading ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                </div>
            ) : (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {filteredSessions.map((session) => (
                        <Card key={session.session_id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline">{session.track}</Badge>
                                    <Badge variant="secondary">{session.session_type}</Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight">
                                    {session.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {session.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        {formatDate(session.session_date)} • {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User className="h-4 w-4 mr-2" />
                                        {session.speakers.join(', ')}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        {session.organization}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleAddToSchedule(session.session_id)}
                                        className="flex-1"
                                    >
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Add to Schedule
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleShareSession(session)}
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
} 