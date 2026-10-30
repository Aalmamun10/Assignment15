import { useEffect, useMemo, useState } from 'react'
import { BriefcaseBusiness, LayoutDashboard, LogOut, Plus, Search, CalendarDays, TrendingUp, Award, X, Pencil, Trash2, ExternalLink, FileText } from 'lucide-react'
import { deleteApplication, getApplications, getSummary, login, logout, register, saveApplication } from './api'

const STATUSES = [
  ['saved', 'Saved'], ['applied', 'Applied'], ['screening', 'Screening'],
  ['interview', 'Interview'], ['offer', 'Offer'], ['rejected', 'Rejected'], ['withdrawn', 'Withdrawn'],
]
const emptyForm = { company: '', job_title: '', job_url: '', location: '', status: 'applied', applied_date: new Date().toISOString().slice(0,10), interview_date: '', follow_up_date: '', notes: '' }
const niceDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      if (mode === 'register') {
        await register(username, email, password)
      }
      await login(username, password)
      onAuth()
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join(' ') : 'Could not connect to the API. Is the backend running?')
    } finally { setBusy(false) }
  }
  return <main className="auth-wrap">
    <section className="auth-art">
      <div className="brand brand-light"><span className="brand-mark"><BriefcaseBusiness size={19}/></span> HireTrack</div>
      <div className="art-copy"><span className="eyebrow">YOUR CAREER, ORGANIZED</span><h1>Make your next move<br/>your best move.</h1><p>One calm workspace for every application, interview, and opportunity.</p>
        <div className="mini-board"><div><i className="dot dot-blue"/> Applied <b>08</b></div><div><i className="dot dot-purple"/> Interview <b>03</b></div><div><i className="dot dot-green"/> Offers <b>01</b></div></div>
      </div><p className="art-foot">A little more clarity. A lot more momentum.</p>
    </section>
    <section className="auth-panel"><div className="auth-card">
      <span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span>
      <h2>{mode === 'login' ? 'Sign in to HireTrack' : 'Create your account'}</h2>
      <p className="muted">{mode === 'login' ? 'Pick up right where your job search left off.' : 'Build a private home for your job search.'}</p>
      <form onSubmit={submit} className="form-stack">
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required autoComplete="username" /></label>
        {mode === 'register' && <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" /></label>}
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={mode==='register'?8:1} required autoComplete={mode==='login'?'current-password':'new-password'} /></label>
        {error && <div className="error-box">{error}</div>}
        <button className="primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <p className="switch-auth">{mode === 'login' ? 'New to HireTrack?' : 'Already have an account?'} <button className="text-button" onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>{mode==='login'?'Create an account':'Sign in'}</button></p>
      <p className="tiny-note">Your applications are private to your account.</p>
    </div></section>
  </main>
}

function ApplicationModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const update = (key, value) => setForm(prev=>({...prev, [key]:value}))
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    const payload = new FormData()
    Object.entries(form).forEach(([key,value])=>{ if(value !== null && value !== undefined) payload.append(key, value) })
    if(file) payload.append('resume',file)
    try { await onSave(payload, initial?.id); onClose() }
    catch(err) { setError(err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Unable to save application.') }
    finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="modal">
    <div className="modal-head"><div><span className="eyebrow">{initial?'UPDATE RECORD':'NEW OPPORTUNITY'}</span><h2>{initial?'Edit application':'Add an application'}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X/></button></div>
    <form onSubmit={submit}>
      <div className="form-grid">
        <label>Company *<input required maxLength="120" value={form.company||''} onChange={e=>update('company',e.target.value)}/></label>
        <label>Job title *<input required maxLength="120" value={form.job_title||''} onChange={e=>update('job_title',e.target.value)}/></label>
        <label>Status<select value={form.status||'saved'} onChange={e=>update('status',e.target.value)}>{STATUSES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
        <label>Location<input value={form.location||''} onChange={e=>update('location',e.target.value)} placeholder="Remote / Dhaka"/></label>
        <label>Job posting URL<input type="url" value={form.job_url||''} onChange={e=>update('job_url',e.target.value)} placeholder="https://…"/></label>
        <label>Applied date<input type="date" value={form.applied_date||''} onChange={e=>update('applied_date',e.target.value)}/></label>
        <label>Interview date<input type="date" value={form.interview_date||''} onChange={e=>update('interview_date',e.target.value)}/></label>
        <label>Follow-up date<input type="date" value={form.follow_up_date||''} onChange={e=>update('follow_up_date',e.target.value)}/></label>
        <label className="span-two">Resume attachment <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setFile(e.target.files?.[0]||null)}/><small>PDF, DOC or DOCX · up to 5 MB</small></label>
        <label className="span-two">Notes<textarea rows="3" value={form.notes||''} onChange={e=>update('notes',e.target.value)} placeholder="Recruiter name, interview notes, next step…"/></label>
      </div>
      {error && <div className="error-box">{error}</div>}
      <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={busy}>{busy?'Saving…':'Save application'}</button></div>
    </form>
  </section></div>
}

function App() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('hiretrack_access'))
  const [apps, setApps] = useState([])
  const [summary, setSummary] = useState({total:0,interviews:0,offers:0,follow_ups_due:0,by_status:{}})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const params = {}
      if(search.trim()) params.search = search.trim()
      if(status !== 'all') params.status = status
      const [appData, summaryData] = await Promise.all([getApplications(params), getSummary()])
      setApps(Array.isArray(appData) ? appData : appData.results || [])
      setSummary(summaryData)
    } catch(err) {
      if(err.response?.status === 401) { logout(); setAuthenticated(false) }
      else setError('Could not load data. Check that the Django API is running and try again.')
    } finally { setLoading(false) }
  }
  useEffect(()=>{ if(authenticated) load() }, [authenticated, search, status])
  const upcoming = useMemo(()=>apps.filter(a=>a.follow_up_date).sort((a,b)=>a.follow_up_date.localeCompare(b.follow_up_date)).slice(0,3),[apps])

  async function save(payload,id) {
    await saveApplication(payload,id); await load(); setToast(id?'Application updated':'Application added'); setTimeout(()=>setToast(''),3000)
  }
  async function remove(item) {
    if(!window.confirm(`Delete the ${item.job_title} application at ${item.company}?`)) return
    try { await deleteApplication(item.id); await load(); setToast('Application deleted'); setTimeout(()=>setToast(''),3000) }
    catch { setError('Could not delete this application. Please try again.') }
  }
  if(!authenticated) return <AuthScreen onAuth={()=>setAuthenticated(true)}/>

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark"><BriefcaseBusiness size={19}/></span> HireTrack</div>
      <div className="workspace-label">WORKSPACE</div><button className="nav-item active"><LayoutDashboard size={18}/> Overview</button>
      <div className="side-tip"><div className="tip-icon"><TrendingUp size={18}/></div><b>Keep the momentum</b><p>Small steps every day add up to your next big opportunity.</p></div>
      <div className="sidebar-bottom"><div className="avatar">{(localStorage.getItem('hiretrack_access')?'HT':'U')}</div><div className="user-label"><b>My workspace</b><span>Personal account</span></div><button className="icon-btn" title="Sign out" onClick={()=>{logout();setAuthenticated(false)}}><LogOut size={17}/></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><span className="eyebrow">CAREER CRM</span><h1>Application overview</h1></div><button className="primary" onClick={()=>setModal({})}><Plus size={18}/> Add application</button></header>
      <div className="page-content">
        <section className="welcome-row"><div><h2>Your next chapter starts here.</h2><p>Stay on top of every opportunity, one step at a time.</p></div><div className="date-pill"><CalendarDays size={16}/>{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</div></section>
        <section className="stats-grid">
          <StatCard icon={<BriefcaseBusiness/>} label="Total applications" value={summary.total} sub="Opportunities tracked" tone="blue"/>
          <StatCard icon={<CalendarDays/>} label="Interviews" value={summary.interviews} sub="Keep preparing" tone="purple"/>
          <StatCard icon={<Award/>} label="Offers received" value={summary.offers} sub="Your hard work counts" tone="green"/>
          <StatCard icon={<TrendingUp/>} label="Follow-up dates" value={summary.follow_ups_due} sub="Scheduled reminders" tone="orange"/>
        </section>
        <section className="content-grid">
          <div className="panel applications-panel"><div className="panel-head"><div><h3>Job applications</h3><p>Every opportunity, organized in one place.</p></div><span className="count-pill">{apps.length} shown</span></div>
            <div className="toolbar"><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company or role…"/></div><select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Filter by status"><option value="all">All statuses</option>{STATUSES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
            {error && <div className="error-box page-error">{error}<button className="text-button" onClick={load}>Retry</button></div>}
            {loading ? <div className="loading-list"><div/><div/><div/></div> : apps.length===0 ? <div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={25}/></div><h3>No applications yet</h3><p>Add your first opportunity to start building your pipeline.</p><button className="primary" onClick={()=>setModal({})}><Plus size={17}/> Add first application</button></div> :
              <div className="application-list">{apps.map(item=><article className="application-row" key={item.id}><div className="company-logo">{(item.company||'?').slice(0,1).toUpperCase()}</div><div className="application-main"><div className="job-title-line"><h4>{item.job_title}</h4><StatusBadge status={item.status}/></div><p className="company-name">{item.company}{item.location?` · ${item.location}`:''}</p><div className="application-meta"><span>Applied {niceDate(item.applied_date)}</span>{item.follow_up_date&&<span className="follow-up"><CalendarDays size={13}/> Follow up {niceDate(item.follow_up_date)}</span>}{item.resume_url&&<a href={item.resume_url} target="_blank" rel="noreferrer"><FileText size={13}/> Resume</a>}</div></div><div className="row-actions">{item.job_url&&<a className="icon-btn" href={item.job_url} target="_blank" rel="noreferrer" title="Open job post"><ExternalLink size={16}/></a>}<button className="icon-btn" title="Edit" onClick={()=>setModal({...item})}><Pencil size={16}/></button><button className="icon-btn danger-hover" title="Delete" onClick={()=>remove(item)}><Trash2 size={16}/></button></div></article>)}</div>}
          </div>
          <aside className="right-column"><div className="panel pipeline-panel"><div className="panel-head"><div><h3>Pipeline</h3><p>Where things stand</p></div></div>{STATUSES.map(([key,label])=><div className="pipeline-line" key={key}><span className={`pipeline-dot ${key}`}/><span>{label}</span><b>{summary.by_status?.[key]||0}</b></div>)}</div>
            <div className="panel follow-panel"><div className="panel-head"><div><h3>Follow-up planner</h3><p>Your next scheduled touchpoints</p></div></div>{upcoming.length===0?<p className="muted small-copy">No follow-ups scheduled. Add a date to an application to see it here.</p>:upcoming.map(item=><div className="follow-item" key={item.id}><div className="follow-date"><b>{new Date(`${item.follow_up_date}T00:00:00`).getDate()}</b><span>{new Date(`${item.follow_up_date}T00:00:00`).toLocaleDateString(undefined,{month:'short'})}</span></div><div><b>{item.company}</b><p>{item.job_title}</p></div></div>)}</div>
          </aside>
        </section>
        <footer className="footer-note">Built for your next opportunity <span>•</span> Keep showing up.</footer>
      </div>
    </main>
    {modal && <ApplicationModal initial={modal.id?modal:null} onClose={()=>setModal(null)} onSave={save}/>}
    {toast&&<div className="toast">{toast}</div>}
  </div>
}

function StatCard({icon,label,value,sub,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value??0}</div><div className="stat-sub">{sub}</div></div> }
function StatusBadge({status}) { const label=STATUSES.find(([v])=>v===status)?.[1]||status; return <span className={`status-badge ${status}`}>{label}</span> }
export default App
