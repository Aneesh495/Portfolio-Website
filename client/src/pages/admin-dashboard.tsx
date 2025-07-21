import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { Table } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart2,
  MousePointerClick,
  Gamepad2,
  Download,
  Mail,
  Share2,
} from "lucide-react";

const fetchAnalytics = async (endpoint: string) => {
  const res = await fetch(endpoint, { credentials: "include" });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

function exportToCSV(data, filename) {
  const csv = [Object.keys(data[0]).join(",")]
    .concat(
      data.map((row) =>
        Object.values(row)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function exportToJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export default function AdminDashboard() {
  const [visits, setVisits] = useState({
    daily: [],
    weekly: [],
    yearly: [],
    lifetime: 0,
    raw: [],
    devices: [],
    ips: [],
  });
  const [tab, setTab] = useState("daily");
  const [auth, setAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  // Add state for all analytics
  const [projectClicks, setProjectClicks] = useState({
    daily: [],
    weekly: [],
    yearly: [],
    lifetime: 0,
    raw: [],
  });
  const [gamePlays, setGamePlays] = useState({
    daily: [],
    weekly: [],
    yearly: [],
    lifetime: 0,
    raw: [],
  });
  const [resumeDownloads, setResumeDownloads] = useState({
    daily: [],
    weekly: [],
    yearly: [],
    lifetime: 0,
    raw: [],
  });
  const [contactSubmissions, setContactSubmissions] = useState({
    daily: [],
    weekly: [],
    yearly: [],
    lifetime: 0,
    raw: [],
  });
  const [socialClicks, setSocialClicks] = useState({
    daily: [],
    weekly: [],
    yearly: [],
    lifetime: 0,
    raw: [],
  });
  const [sectionTab, setSectionTab] = useState({
    projectClicks: "daily",
    gamePlays: "daily",
    resumeDownloads: "daily",
    contactSubmissions: "daily",
    socialClicks: "daily",
  });

  useEffect(() => {
    fetchAnalytics("/api/admin/analytics/visits/daily")
      .then((daily) => setVisits((v) => ({ ...v, daily })))
      .catch(() => setAuth(false));
    fetchAnalytics("/api/admin/analytics/visits/weekly").then((weekly) =>
      setVisits((v) => ({ ...v, weekly }))
    );
    fetchAnalytics("/api/admin/analytics/visits/yearly").then((yearly) =>
      setVisits((v) => ({ ...v, yearly }))
    );
    fetchAnalytics("/api/admin/analytics/visits/lifetime").then((lifetime) =>
      setVisits((v) => ({ ...v, lifetime: lifetime.count }))
    );
    fetchAnalytics("/api/admin/analytics/visits/raw").then((raw) =>
      setVisits((v) => ({ ...v, raw }))
    );
    fetchAnalytics("/api/admin/analytics/visits/devices").then((devices) =>
      setVisits((v) => ({ ...v, devices }))
    );
    fetchAnalytics("/api/admin/analytics/visits/ips").then((ips) =>
      setVisits((v) => ({ ...v, ips }))
    );
    fetchAnalytics("/api/admin/analytics/project-clicks/daily").then((daily) =>
      setProjectClicks((v) => ({ ...v, daily }))
    );
    fetchAnalytics("/api/admin/analytics/project-clicks/weekly").then(
      (weekly) => setProjectClicks((v) => ({ ...v, weekly }))
    );
    fetchAnalytics("/api/admin/analytics/project-clicks/yearly").then(
      (yearly) => setProjectClicks((v) => ({ ...v, yearly }))
    );
    fetchAnalytics("/api/admin/analytics/project-clicks/lifetime").then(
      (lifetime) =>
        setProjectClicks((v) => ({ ...v, lifetime: lifetime.count }))
    );
    fetchAnalytics("/api/admin/analytics/project-clicks/raw").then((raw) =>
      setProjectClicks((v) => ({ ...v, raw }))
    );
    fetchAnalytics("/api/admin/analytics/game-plays/daily").then((daily) =>
      setGamePlays((v) => ({ ...v, daily }))
    );
    fetchAnalytics("/api/admin/analytics/game-plays/weekly").then((weekly) =>
      setGamePlays((v) => ({ ...v, weekly }))
    );
    fetchAnalytics("/api/admin/analytics/game-plays/yearly").then((yearly) =>
      setGamePlays((v) => ({ ...v, yearly }))
    );
    fetchAnalytics("/api/admin/analytics/game-plays/lifetime").then(
      (lifetime) => setGamePlays((v) => ({ ...v, lifetime: lifetime.count }))
    );
    fetchAnalytics("/api/admin/analytics/game-plays/raw").then((raw) =>
      setGamePlays((v) => ({ ...v, raw }))
    );
    fetchAnalytics("/api/admin/analytics/resume-downloads/daily").then(
      (daily) => setResumeDownloads((v) => ({ ...v, daily }))
    );
    fetchAnalytics("/api/admin/analytics/resume-downloads/weekly").then(
      (weekly) => setResumeDownloads((v) => ({ ...v, weekly }))
    );
    fetchAnalytics("/api/admin/analytics/resume-downloads/yearly").then(
      (yearly) => setResumeDownloads((v) => ({ ...v, yearly }))
    );
    fetchAnalytics("/api/admin/analytics/resume-downloads/lifetime").then(
      (lifetime) =>
        setResumeDownloads((v) => ({ ...v, lifetime: lifetime.count }))
    );
    fetchAnalytics("/api/admin/analytics/resume-downloads/raw").then((raw) =>
      setResumeDownloads((v) => ({ ...v, raw }))
    );
    fetchAnalytics("/api/admin/analytics/contact-submissions/daily").then(
      (daily) => setContactSubmissions((v) => ({ ...v, daily }))
    );
    fetchAnalytics("/api/admin/analytics/contact-submissions/weekly").then(
      (weekly) => setContactSubmissions((v) => ({ ...v, weekly }))
    );
    fetchAnalytics("/api/admin/analytics/contact-submissions/yearly").then(
      (yearly) => setContactSubmissions((v) => ({ ...v, yearly }))
    );
    fetchAnalytics("/api/admin/analytics/contact-submissions/lifetime").then(
      (lifetime) =>
        setContactSubmissions((v) => ({ ...v, lifetime: lifetime.count }))
    );
    fetchAnalytics("/api/admin/analytics/contact-submissions/raw").then((raw) =>
      setContactSubmissions((v) => ({ ...v, raw }))
    );
    fetchAnalytics("/api/admin/analytics/social-clicks/daily").then((daily) =>
      setSocialClicks((v) => ({ ...v, daily }))
    );
    fetchAnalytics("/api/admin/analytics/social-clicks/weekly").then((weekly) =>
      setSocialClicks((v) => ({ ...v, weekly }))
    );
    fetchAnalytics("/api/admin/analytics/social-clicks/yearly").then((yearly) =>
      setSocialClicks((v) => ({ ...v, yearly }))
    );
    fetchAnalytics("/api/admin/analytics/social-clicks/lifetime").then(
      (lifetime) => setSocialClicks((v) => ({ ...v, lifetime: lifetime.count }))
    );
    fetchAnalytics("/api/admin/analytics/social-clicks/raw").then((raw) =>
      setSocialClicks((v) => ({ ...v, raw }))
    );
    setLoading(false);
  }, [auth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    });
    if (res.ok) {
      setAuth(true);
      setLoading(false);
      setPassword("");
    } else {
      setError("Incorrect password");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuth(false);
    setPassword("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <form
          onSubmit={handleLogin}
          className="bg-card p-8 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-4 border border-border"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
          <input
            type="password"
            className="border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/90 transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 relative">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 mt-4 mr-4 bg-destructive text-destructive-foreground px-4 py-2 rounded font-semibold shadow hover:bg-destructive/80 transition-all z-10"
        >
          Logout
        </button>
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
          Admin Analytics Dashboard
        </h1>
        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg p-6 border border-primary/20">
            <BarChart2 className="h-8 w-8 text-primary mb-2" />
            <span className="text-lg font-semibold">Visits</span>
            <span className="text-2xl font-extrabold text-primary">
              {visits.lifetime}
            </span>
          </div>
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg p-6 border border-primary/20">
            <MousePointerClick className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-lg font-semibold">Project Clicks</span>
            <span className="text-2xl font-extrabold text-blue-500">
              {projectClicks.lifetime}
            </span>
          </div>
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg p-6 border border-primary/20">
            <Gamepad2 className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-lg font-semibold">Game Plays</span>
            <span className="text-2xl font-extrabold text-green-500">
              {gamePlays.lifetime}
            </span>
          </div>
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg p-6 border border-primary/20">
            <Download className="h-8 w-8 text-emerald-500 mb-2" />
            <span className="text-lg font-semibold">Resume</span>
            <span className="text-2xl font-extrabold text-emerald-500">
              {resumeDownloads.lifetime}
            </span>
          </div>
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg p-6 border border-primary/20">
            <Mail className="h-8 w-8 text-pink-500 mb-2" />
            <span className="text-lg font-semibold">Contact</span>
            <span className="text-2xl font-extrabold text-pink-500">
              {contactSubmissions.lifetime}
            </span>
          </div>
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg p-6 border border-primary/20">
            <Share2 className="h-8 w-8 text-yellow-500 mb-2" />
            <span className="text-lg font-semibold">Social Clicks</span>
            <span className="text-2xl font-extrabold text-yellow-500">
              {socialClicks.lifetime}
            </span>
          </div>
        </div>
        <Card className="shadow-2xl border-2 border-primary/30">
          <CardContent className="p-8">
            <Tabs value={tab} onValueChange={setTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="ips">Top IPs</TabsTrigger>
                <TabsTrigger value="raw">Raw Log</TabsTrigger>
              </TabsList>
            </Tabs>
            {tab === "daily" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">Daily Visits</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(visits.daily, "visits-daily.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(visits.daily, "visits-daily.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <ChartContainer
                  config={{ visits: { label: "Visits", color: "#6366f1" } }}
                >
                  {({
                    ResponsiveContainer,
                    LineChart,
                    Line,
                    XAxis,
                    YAxis,
                    CartesianGrid,
                  }) => (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={visits.daily}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#6366f1"
                        />
                        <ChartTooltip />
                        <ChartLegend />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </ChartContainer>
              </div>
            )}
            {tab === "weekly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">Weekly Visits</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(visits.weekly, "visits-weekly.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(visits.weekly, "visits-weekly.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <ChartContainer
                  config={{ visits: { label: "Visits", color: "#6366f1" } }}
                >
                  {({
                    ResponsiveContainer,
                    LineChart,
                    Line,
                    XAxis,
                    YAxis,
                    CartesianGrid,
                  }) => (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={visits.weekly}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis allowDecimals={false} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#6366f1"
                        />
                        <ChartTooltip />
                        <ChartLegend />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </ChartContainer>
              </div>
            )}
            {tab === "yearly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">Yearly Visits</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(visits.yearly, "visits-yearly.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(visits.yearly, "visits-yearly.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <ChartContainer
                  config={{ visits: { label: "Visits", color: "#6366f1" } }}
                >
                  {({
                    ResponsiveContainer,
                    LineChart,
                    Line,
                    XAxis,
                    YAxis,
                    CartesianGrid,
                  }) => (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={visits.yearly}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis allowDecimals={false} />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#6366f1"
                        />
                        <ChartTooltip />
                        <ChartLegend />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </ChartContainer>
              </div>
            )}
            {tab === "lifetime" && (
              <div className="flex flex-col items-center justify-center h-64">
                <h2 className="text-3xl font-bold mb-4">Lifetime Visits</h2>
                <span className="text-6xl font-extrabold text-primary drop-shadow">
                  {visits.lifetime}
                </span>
              </div>
            )}
            {tab === "devices" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">
                    Top Devices (User Agents)
                  </h2>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(visits.devices, "visits-devices.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(visits.devices, "visits-devices.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>User Agent</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.devices.map((row, i) => (
                      <tr key={i}>
                        <td className="break-all max-w-xs">{row.user_agent}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {tab === "ips" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">Top IPs</h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => exportToCSV(visits.ips, "visits-ips.csv")}
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(visits.ips, "visits-ips.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>IP Address</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.ips.map((row, i) => (
                      <tr key={i}>
                        <td>{row.ip}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {tab === "raw" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">
                    Raw Visit Log (Last 1000)
                  </h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => exportToCSV(visits.raw, "visits-raw.csv")}
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(visits.raw, "visits-raw.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>IP</th>
                      <th>User Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.raw.map((row, i) => (
                      <tr key={i}>
                        <td>{row.id}</td>
                        <td>{row.date}</td>
                        <td>{row.ip}</td>
                        <td className="break-all max-w-xs">{row.user_agent}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Project Clicks Analytics */}
        <Card className="shadow-2xl border-2 border-primary/30">
          <CardContent className="p-8">
            <h2 className="text-2xl font-extrabold mb-4 text-primary">
              Project Link Clicks
            </h2>
            <Tabs
              value={sectionTab.projectClicks}
              onValueChange={(v) =>
                setSectionTab((t) => ({ ...t, projectClicks: v }))
              }
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                <TabsTrigger value="raw">Raw Log</TabsTrigger>
              </TabsList>
            </Tabs>
            {sectionTab.projectClicks === "daily" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Daily Project Clicks</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          projectClicks.daily,
                          "project-clicks-daily.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          projectClicks.daily,
                          "project-clicks-daily.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Type</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectClicks.daily.map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.project}</td>
                        <td>{row.type}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.projectClicks === "weekly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Weekly Project Clicks</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          projectClicks.weekly,
                          "project-clicks-weekly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          projectClicks.weekly,
                          "project-clicks-weekly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Project</th>
                      <th>Type</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectClicks.weekly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.week}</td>
                        <td>{row.project}</td>
                        <td>{row.type}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.projectClicks === "yearly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Yearly Project Clicks</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          projectClicks.yearly,
                          "project-clicks-yearly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          projectClicks.yearly,
                          "project-clicks-yearly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Project</th>
                      <th>Type</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectClicks.yearly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.year}</td>
                        <td>{row.project}</td>
                        <td>{row.type}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.projectClicks === "lifetime" && (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-3xl font-bold mb-2">
                  Lifetime Project Clicks
                </span>
                <span className="text-5xl font-extrabold text-primary drop-shadow">
                  {projectClicks.lifetime}
                </span>
              </div>
            )}
            {sectionTab.projectClicks === "raw" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    Raw Project Clicks Log (Last 1000)
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(projectClicks.raw, "project-clicks-raw.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          projectClicks.raw,
                          "project-clicks-raw.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectClicks.raw.map((row, i) => (
                      <tr key={i}>
                        <td>{row.id}</td>
                        <td>{row.date}</td>
                        <td>{row.project}</td>
                        <td>{row.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Game Plays Analytics */}
        <Card className="shadow-2xl border-2 border-primary/30">
          <CardContent className="p-8">
            <h2 className="text-2xl font-extrabold mb-4 text-primary">
              Game Plays
            </h2>
            <Tabs
              value={sectionTab.gamePlays}
              onValueChange={(v) =>
                setSectionTab((t) => ({ ...t, gamePlays: v }))
              }
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                <TabsTrigger value="raw">Raw Log</TabsTrigger>
              </TabsList>
            </Tabs>
            {sectionTab.gamePlays === "daily" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Daily Game Plays</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(gamePlays.daily, "game-plays-daily.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(gamePlays.daily, "game-plays-daily.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Game</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gamePlays.daily.map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.game}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.gamePlays === "weekly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Weekly Game Plays</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(gamePlays.weekly, "game-plays-weekly.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(gamePlays.weekly, "game-plays-weekly.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Game</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gamePlays.weekly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.week}</td>
                        <td>{row.game}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.gamePlays === "yearly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Yearly Game Plays</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(gamePlays.yearly, "game-plays-yearly.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(gamePlays.yearly, "game-plays-yearly.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Game</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gamePlays.yearly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.year}</td>
                        <td>{row.game}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.gamePlays === "lifetime" && (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-3xl font-bold mb-2">
                  Lifetime Game Plays
                </span>
                <span className="text-5xl font-extrabold text-primary drop-shadow">
                  {gamePlays.lifetime}
                </span>
              </div>
            )}
            {sectionTab.gamePlays === "raw" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    Raw Game Plays Log (Last 1000)
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(gamePlays.raw, "game-plays-raw.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(gamePlays.raw, "game-plays-raw.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Game</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gamePlays.raw.map((row, i) => (
                      <tr key={i}>
                        <td>{row.id}</td>
                        <td>{row.date}</td>
                        <td>{row.game}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Resume Downloads Analytics */}
        <Card className="shadow-2xl border-2 border-primary/30">
          <CardContent className="p-8">
            <h2 className="text-2xl font-extrabold mb-4 text-primary">
              Resume
            </h2>
            <Tabs
              value={sectionTab.resumeDownloads}
              onValueChange={(v) =>
                setSectionTab((t) => ({ ...t, resumeDownloads: v }))
              }
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                <TabsTrigger value="raw">Raw Log</TabsTrigger>
              </TabsList>
            </Tabs>
            {sectionTab.resumeDownloads === "daily" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Daily Resume</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          resumeDownloads.daily,
                          "resume-downloads-daily.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          resumeDownloads.daily,
                          "resume-downloads-daily.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeDownloads.daily.map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.resumeDownloads === "weekly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Weekly Resume</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          resumeDownloads.weekly,
                          "resume-downloads-weekly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          resumeDownloads.weekly,
                          "resume-downloads-weekly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeDownloads.weekly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.week}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.resumeDownloads === "yearly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Yearly Resume</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          resumeDownloads.yearly,
                          "resume-downloads-yearly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          resumeDownloads.yearly,
                          "resume-downloads-yearly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeDownloads.yearly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.year}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.resumeDownloads === "lifetime" && (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-3xl font-bold mb-2">Lifetime Resume</span>
                <span className="text-5xl font-extrabold text-primary drop-shadow">
                  {resumeDownloads.lifetime}
                </span>
              </div>
            )}
            {sectionTab.resumeDownloads === "raw" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    Raw Resume Log (Last 1000)
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          resumeDownloads.raw,
                          "resume-downloads-raw.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          resumeDownloads.raw,
                          "resume-downloads-raw.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeDownloads.raw.map((row, i) => (
                      <tr key={i}>
                        <td>{row.id}</td>
                        <td>{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Contact Submissions Analytics */}
        <Card className="shadow-2xl border-2 border-primary/30">
          <CardContent className="p-8">
            <h2 className="text-2xl font-extrabold mb-4 text-primary">
              Contact
            </h2>
            <Tabs
              value={sectionTab.contactSubmissions}
              onValueChange={(v) =>
                setSectionTab((t) => ({ ...t, contactSubmissions: v }))
              }
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                <TabsTrigger value="raw">Raw Log</TabsTrigger>
              </TabsList>
            </Tabs>
            {sectionTab.contactSubmissions === "daily" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Daily Contact</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          contactSubmissions.daily,
                          "contact-submissions-daily.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          contactSubmissions.daily,
                          "contact-submissions-daily.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSubmissions.daily.map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.contactSubmissions === "weekly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Weekly Contact</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          contactSubmissions.weekly,
                          "contact-submissions-weekly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          contactSubmissions.weekly,
                          "contact-submissions-weekly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSubmissions.weekly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.week}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.contactSubmissions === "yearly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Yearly Contact</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          contactSubmissions.yearly,
                          "contact-submissions-yearly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          contactSubmissions.yearly,
                          "contact-submissions-yearly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSubmissions.yearly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.year}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.contactSubmissions === "lifetime" && (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-3xl font-bold mb-2">
                  Lifetime Contact
                </span>
                <span className="text-5xl font-extrabold text-primary drop-shadow">
                  {contactSubmissions.lifetime}
                </span>
              </div>
            )}
            {sectionTab.contactSubmissions === "raw" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    Raw Contact Log (Last 1000)
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          contactSubmissions.raw,
                          "contact-submissions-raw.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          contactSubmissions.raw,
                          "contact-submissions-raw.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSubmissions.raw.map((row, i) => (
                      <tr key={i}>
                        <td>{row.id}</td>
                        <td>{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Social Clicks Analytics */}
        <Card className="shadow-2xl border-2 border-primary/30">
          <CardContent className="p-8">
            <h2 className="text-2xl font-extrabold mb-4 text-primary">
              Social Link Clicks
            </h2>
            <Tabs
              value={sectionTab.socialClicks}
              onValueChange={(v) =>
                setSectionTab((t) => ({ ...t, socialClicks: v }))
              }
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                <TabsTrigger value="raw">Raw Log</TabsTrigger>
              </TabsList>
            </Tabs>
            {sectionTab.socialClicks === "daily" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Daily Social Clicks</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          socialClicks.daily,
                          "social-clicks-daily.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          socialClicks.daily,
                          "social-clicks-daily.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Platform</th>
                      <th>Source</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialClicks.daily.map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.platform}</td>
                        <td>{row.source}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.socialClicks === "weekly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Weekly Social Clicks</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          socialClicks.weekly,
                          "social-clicks-weekly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          socialClicks.weekly,
                          "social-clicks-weekly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Platform</th>
                      <th>Source</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialClicks.weekly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.week}</td>
                        <td>{row.platform}</td>
                        <td>{row.source}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.socialClicks === "yearly" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Yearly Social Clicks</span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(
                          socialClicks.yearly,
                          "social-clicks-yearly.csv"
                        )
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(
                          socialClicks.yearly,
                          "social-clicks-yearly.json"
                        )
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Platform</th>
                      <th>Source</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialClicks.yearly.map((row, i) => (
                      <tr key={i}>
                        <td>{row.year}</td>
                        <td>{row.platform}</td>
                        <td>{row.source}</td>
                        <td>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {sectionTab.socialClicks === "lifetime" && (
              <div className="flex flex-col items-center justify-center h-32">
                <span className="text-3xl font-bold mb-2">
                  Lifetime Social Clicks
                </span>
                <span className="text-5xl font-extrabold text-primary drop-shadow">
                  {socialClicks.lifetime}
                </span>
              </div>
            )}
            {sectionTab.socialClicks === "raw" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    Raw Social Clicks Log (Last 1000)
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        exportToCSV(socialClicks.raw, "social-clicks-raw.csv")
                      }
                      className="btn btn-sm"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportToJSON(socialClicks.raw, "social-clicks-raw.json")
                      }
                      className="btn btn-sm"
                    >
                      JSON
                    </button>
                  </div>
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Platform</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialClicks.raw.map((row, i) => (
                      <tr key={i}>
                        <td>{row.id}</td>
                        <td>{row.date}</td>
                        <td>{row.platform}</td>
                        <td>{row.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
