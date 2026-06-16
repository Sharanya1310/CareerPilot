import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, MapPin, Calendar, FileText,
  Sparkles, Edit, Check, X, Plus, Code2, Wrench, Target
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ATSWidget from '../features/dashboard/components/ATSWidget';

/* ── Inline-add chip row ──────────────────────────────────────────── */
function ChipSection({ label, icon: Icon, color, chips, onAdd, onRemove, placeholder }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const commit = () => {
    const trimmed = val.trim();
    if (trimmed && !chips.includes(trimmed)) onAdd(trimmed);
    setVal('');
    setOpen(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setVal(''); setOpen(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
        </div>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className={`flex items-center gap-0.5 text-[10px] font-bold ${color} opacity-70 hover:opacity-100 transition`}
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {chips.map(chip => (
          <span
            key={chip}
            className="group flex items-center gap-1 bg-[#161920] border border-[#232936] hover:border-red-500/30 text-zinc-300 hover:text-red-400 text-[11px] px-2.5 py-1 rounded-lg transition cursor-default"
          >
            {chip}
            <button
              onClick={() => onRemove(chip)}
              className="opacity-0 group-hover:opacity-100 transition ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {open && (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={onKey}
              onBlur={commit}
              placeholder={placeholder || `Add ${label.toLowerCase()}…`}
              className="bg-[#1a1e28] border border-indigo-500/40 focus:border-indigo-500 text-zinc-200 text-[11px] px-2.5 py-1 rounded-lg outline-none w-36 transition"
            />
            <button onClick={commit} className="text-indigo-400 hover:text-indigo-300 transition">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setVal(''); setOpen(false); }} className="text-zinc-600 hover:text-zinc-400 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {chips.length === 0 && !open && (
          <p className="text-[10px] text-zinc-600 italic self-center">None added yet — click Add</p>
        )}
      </div>
    </div>
  );
}

/* ── Role chip (styled differently) ──────────────────────────────── */
function RoleSection({ roles, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const commit = () => {
    const trimmed = val.trim();
    if (trimmed && !roles.includes(trimmed)) onAdd(trimmed);
    setVal('');
    setOpen(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setVal(''); setOpen(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1.5">
        {roles.map(role => (
          <div key={role} className="group flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 hover:border-red-500/30 text-indigo-400 hover:text-red-400 px-3 py-2 rounded-lg text-xs font-semibold transition">
            <span>{role}</span>
            <button onClick={() => onRemove(role)} className="opacity-0 group-hover:opacity-100 transition">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {open ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={onKey}
              onBlur={commit}
              placeholder="e.g. Frontend Engineer…"
              className="flex-1 bg-[#1a1e28] border border-indigo-500/40 focus:border-indigo-500 text-zinc-200 text-[11px] px-2.5 py-1.5 rounded-lg outline-none transition"
            />
            <button onClick={commit} className="text-indigo-400 hover:text-indigo-300 transition flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setVal(''); setOpen(false); }} className="text-zinc-600 hover:text-zinc-400 transition flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 border border-dashed border-indigo-500/30 hover:border-indigo-500/60 text-indigo-400/60 hover:text-indigo-400 text-[11px] font-semibold px-3 py-2 rounded-lg transition w-full"
          >
            <Plus className="w-3.5 h-3.5" />
            Add role
          </button>
        )}

        {roles.length === 0 && !open && (
          <p className="text-[10px] text-zinc-600 italic">No roles added yet</p>
        )}
      </div>
    </div>
  );
}

/* ── Location chips ───────────────────────────────────────────────── */
function LocationSection({ locations, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const commit = () => {
    const trimmed = val.trim();
    if (trimmed && !locations.includes(trimmed)) onAdd(trimmed);
    setVal('');
    setOpen(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setVal(''); setOpen(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {locations.map(loc => (
          <span key={loc} className="group flex items-center gap-1 bg-[#161920] border border-[#232936] hover:border-red-500/30 text-zinc-300 hover:text-red-400 text-[11px] px-2.5 py-1 rounded-lg transition cursor-default">
            {loc}
            <button onClick={() => onRemove(loc)} className="opacity-0 group-hover:opacity-100 transition">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {open ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={onKey}
              onBlur={commit}
              placeholder="e.g. Bangalore…"
              className="bg-[#1a1e28] border border-indigo-500/40 focus:border-indigo-500 text-zinc-200 text-[11px] px-2.5 py-1 rounded-lg outline-none w-36 transition"
            />
            <button onClick={commit} className="text-indigo-400 hover:text-indigo-300 transition">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setVal(''); setOpen(false); }} className="text-zinc-600 hover:text-zinc-400 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-0.5 bg-[#161920] border border-dashed border-[#2a2f3e] hover:border-indigo-500/40 text-zinc-500 hover:text-indigo-400 text-[11px] px-2.5 py-1 rounded-lg transition"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}

        {locations.length === 0 && !open && (
          <p className="text-[10px] text-zinc-600 italic self-center">No locations added yet</p>
        )}
      </div>
    </div>
  );
}

/* ── Main Profile page ────────────────────────────────────────────── */
export default function Profile({ onPageChange }) {
  const { profile, updateProfile } = useData();

  const skills        = profile.skills       || [];
  const toolsSkills   = profile.toolsSkills  || [];
  const keywords      = profile.keywords     || [];
  const desiredRoles  = profile.desiredRoles || [];
  const preferredLocs = profile.preferredLocations || [];
  const workTypes     = profile.workTypes || { remote: true, hybrid: true, onsite: false };

  /* skill helpers */
  const addSkill    = val => updateProfile({ skills: [...skills, val] });
  const removeSkill = val => updateProfile({ skills: skills.filter(s => s !== val) });
  const addTool     = val => updateProfile({ toolsSkills: [...toolsSkills, val] });
  const removeTool  = val => updateProfile({ toolsSkills: toolsSkills.filter(s => s !== val) });
  const addKeyword  = val => updateProfile({ keywords: [...keywords, val] });
  const removeKeyword = val => updateProfile({ keywords: keywords.filter(k => k !== val) });

  /* role helpers */
  const addRole    = val => updateProfile({ desiredRoles: [...desiredRoles, val] });
  const removeRole = val => updateProfile({ desiredRoles: desiredRoles.filter(r => r !== val) });

  /* location helpers */
  const addLoc    = val => updateProfile({ preferredLocations: [...preferredLocs, val] });
  const removeLoc = val => updateProfile({ preferredLocations: preferredLocs.filter(l => l !== val) });

  const toggleWorkType = type => updateProfile({ workTypes: { ...workTypes, [type]: !workTypes[type] } });

  /* edit name inline */
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(profile.name || '');
  const nameRef = useRef(null);
  useEffect(() => { if (editingName) nameRef.current?.focus(); }, [editingName]);
  const commitName = () => {
    if (nameVal.trim()) updateProfile({ name: nameVal.trim() });
    setEditingName(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Profile
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your candidate identity, skills hub, resume vectors, and account preferences.
        </p>
      </div>

      {/* Profile header card */}
      <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl border border-indigo-500/30 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex-shrink-0 flex items-center justify-center">
            <span className="text-xl font-bold text-indigo-300 tracking-tight select-none">
              {(profile.name || 'CN').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
            </span>
          </div>
          <div>
            {editingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={nameRef}
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false); }}
                  onBlur={commitName}
                  className="bg-[#1a1e28] border border-indigo-500/40 focus:border-indigo-500 text-zinc-100 text-sm font-bold px-2 py-0.5 rounded-lg outline-none transition"
                />
              </div>
            ) : (
              <h2 className="text-base font-bold text-zinc-100">{profile.name || 'Candidate Name'}</h2>
            )}
            <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {profile.email || 'candidate@email.com'}
            </p>
          </div>
        </div>

        <button
          onClick={() => { setNameVal(profile.name || ''); setEditingName(true); }}
          className="bg-[#161920] border border-[#232936] hover:bg-[#1f2430] hover:text-white text-zinc-300 font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5"
        >
          <Edit className="w-3.5 h-3.5 text-zinc-400" />
          Edit Name
        </button>
      </div>

      {/* Skills Hub + ATS Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Skills Hub */}
        <div className="lg:col-span-2 bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-[#1e222b]">
            <h3 className="text-sm font-bold text-zinc-100">Skills Hub</h3>
          </div>

          <ChipSection
            label="Skills"
            icon={Code2}
            color="text-sky-400"
            chips={skills}
            onAdd={addSkill}
            onRemove={removeSkill}
            placeholder="e.g. React, Python, SQL…"
          />

          <div className="border-t border-[#1a1e28]" />

          <ChipSection
            label="Tools & Platforms"
            icon={Wrench}
            color="text-amber-400"
            chips={toolsSkills}
            onAdd={addTool}
            onRemove={removeTool}
            placeholder="e.g. Docker, AWS, Figma…"
          />

          <div className="border-t border-[#1a1e28]" />

          <ChipSection
            label="Keywords"
            icon={Target}
            color="text-indigo-400"
            chips={keywords}
            onAdd={addKeyword}
            onRemove={removeKeyword}
            placeholder="e.g. Kubernetes, Microservices, CI/CD…"
          />
        </div>

        {/* AI Resume Score */}
        <ATSWidget onPageChange={onPageChange} />
      </div>

      {/* Preferences Row */}
      <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">

        {/* Desired Roles */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-300 pb-1.5 border-b border-[#1e222b]/50">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Desired Roles</span>
          </div>
          <RoleSection roles={desiredRoles} onAdd={addRole} onRemove={removeRole} />
        </div>

        {/* Preferred Locations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-300 pb-1.5 border-b border-[#1e222b]/50">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Preferred Locations</span>
          </div>
          <LocationSection locations={preferredLocs} onAdd={addLoc} onRemove={removeLoc} />
        </div>

        {/* Work Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-300 pb-1.5 border-b border-[#1e222b]/50">
            <Calendar className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Work Type</span>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'remote', label: 'Remote' },
              { key: 'hybrid', label: 'Hybrid' },
              { key: 'onsite', label: 'On-site' },
            ].map(({ key, label }) => (
              <div
                key={key}
                onClick={() => toggleWorkType(key)}
                className="flex items-center gap-3 cursor-pointer select-none group"
              >
                <div className={`w-4 h-4 rounded border transition flex items-center justify-center flex-shrink-0 ${
                  workTypes[key]
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'border-[#232936] bg-[#161920] group-hover:border-zinc-600'
                }`}>
                  {workTypes[key] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-xs text-zinc-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
