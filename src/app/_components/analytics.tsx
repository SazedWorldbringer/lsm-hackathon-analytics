'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts'
import { api } from "~/trpc/react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

const PostTypeDistribution = ({ analytics }: { analytics: any }) => {
  const pieData = Object.entries(analytics.postTypeBreakdown || {}).map(([name, value]) => ({ name, value }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

const EngagementMetrics = ({ analytics }: { analytics: any }) => {
  if (!analytics.engagement) {
    return <p>No engagement data available</p>;
  }

  const barData = [
    { name: 'Likes', value: analytics.engagement.avgLikesPerPost },
    { name: 'Shares', value: analytics.engagement.avgSharesPerPost },
    { name: 'Comments', value: analytics.engagement.avgCommentsPerPost },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={barData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

const PerformanceByType = ({ analytics }: { analytics: any }) => {
  const performanceData = Object.entries(analytics.performanceByType).map(([type, metrics]) => ({
    type,
    ...metrics!,
  }))

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={performanceData}>
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgLikes" fill="#8884d8" />
        <Bar dataKey="avgShares" fill="#82ca9d" />
        <Bar dataKey="avgComments" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function AnalyticsDashboard() {
  const mutation = api.analytics.getAnalytics.useQuery()
  if (!mutation.data) {
    return (
      <div className="container mx-auto p-4 flex justify-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    )
  }

  const { allPosts, analytics } = mutation.data

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Social Media Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-2 h-[30">
          <CardHeader>
            <CardTitle>Performance by Post Type</CardTitle>
            <CardDescription>Average engagement metrics for each post type</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceByType analytics={analytics} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Post Type Distribution</CardTitle>
            <CardDescription>Breakdown of post types</CardDescription>
          </CardHeader>
          <CardContent>
            <PostTypeDistribution analytics={analytics} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Engagement Metrics</CardTitle>
            <CardDescription>Likes, shares, and comments per post</CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementMetrics analytics={analytics} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

