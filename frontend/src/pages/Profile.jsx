import React from 'react';
import { 
  User, Mail, Briefcase, MapPin, Calendar, FileText, CheckCircle2, 
  Sparkles, PenSquare, Bell, X, Edit, Check
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

export default function Profile() {
  const { profile, updateProfile } = useData();

  const frontendSkills = profile.frontendSkills || [];
  const backendSkills = profile.backendSkills || [];
  const toolsSkills = profile.toolsSkills || [];
  const workTypes = profile.workTypes || { remote: true, hybrid: true, onsite: false };

  const deleteSkill = (category, skillName) => {
    if (category === 'frontend') {
      const filtered = frontendSkills.filter(s => s !== skillName);
      updateProfile({ frontendSkills: filtered });
    } else if (category === 'backend') {
      const filtered = backendSkills.filter(s => s !== skillName);
      updateProfile({ backendSkills: filtered });
    } else if (category === 'tools') {
      const filtered = toolsSkills.filter(s => s !== skillName);
      updateProfile({ toolsSkills: filtered });
    }
  };

  const addSkillPrompt = (category) => {
    const name = prompt(`Enter new ${category} skill:`);
    if (!name) return;
    
    if (category === 'frontend') {
      updateProfile({ frontendSkills: [...frontendSkills, name] });
    } else if (category === 'backend') {
      updateProfile({ backendSkills: [...backendSkills, name] });
    } else if (category === 'tools') {
      updateProfile({ toolsSkills: [...toolsSkills, name] });
    }
  };

  const toggleWorkType = (type) => {
    const updatedWorkTypes = {
      ...workTypes,
      [type]: !workTypes[type]
    };
    updateProfile({ workTypes: updatedWorkTypes });
  };

  const handleModifyRoles = () => {
    const input = prompt("Enter desired roles (comma separated):", (profile.desiredRoles || []).join(', '));
    if (input === null) return;
    const roles = input.split(',').map(r => r.trim()).filter(Boolean);
    updateProfile({ desiredRoles: roles });
  };

  const handleModifyLocations = () => {
    const input = prompt("Enter preferred locations (comma separated):", (profile.preferredLocations || []).join(', '));
    if (input === null) return;
    const locs = input.split(',').map(l => l.trim()).filter(Boolean);
    updateProfile({ preferredLocations: locs });
  };

  const handleEditName = () => {
    const name = prompt("Enter your name:", profile.name);
    if (name) {
      updateProfile({ name });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Profile
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your candidate identity, skills hub, resume vectors, and account preferences.
        </p>
      </div>

      {/* Profile Header Card (Top) */}
      <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Avatar representation matching the mockup */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#232936] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 p-0.5 flex-shrink-0 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80" 
              alt="Sharanya Singh Profile"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">{profile.name || 'Candidate Name'}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{profile.email || 'candidate@email.com'}</p>
          </div>
        </div>

        <button 
          onClick={handleEditName}
          className="bg-[#161920] border border-[#232936] hover:bg-[#1f2430] hover:text-white text-zinc-300 font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5"
        >
          <Edit className="w-3.5 h-3.5 text-zinc-400" />
          Edit Profile
        </button>
      </div>

      {/* Middle Row (Skills Hub & AI Resume Score) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Skills Hub Card */}
        <div className="lg:col-span-2 bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-5 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-[#1e222b]">
            <h3 className="text-sm font-bold text-zinc-100">Skills Hub</h3>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase">Click tag to delete</span>
          </div>

          <div className="space-y-4">
            
            {/* FRONTEND */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Frontend</span>
                <button 
                  onClick={() => addSkillPrompt('frontend')}
                  className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  + Add Frontend Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {frontendSkills.map((skill) => (
                  <div 
                    key={skill}
                    onClick={() => deleteSkill('frontend', skill)}
                    className="bg-[#161920] border border-[#232936] hover:border-red-500/40 hover:text-red-400 text-zinc-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{skill}</span>
                    <X className="w-3 h-3 text-zinc-500 group-hover:text-red-400" />
                  </div>
                ))}
                {frontendSkills.length === 0 && (
                  <p className="text-[10px] text-zinc-550 italic">No frontend skills added. Click + Add to include.</p>
                )}
              </div>
            </div>

            {/* BACKEND */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Backend</span>
                <button 
                  onClick={() => addSkillPrompt('backend')}
                  className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  + Add Backend Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {backendSkills.map((skill) => (
                  <div 
                    key={skill}
                    onClick={() => deleteSkill('backend', skill)}
                    className="bg-[#161920] border border-[#232936] hover:border-red-500/40 hover:text-red-400 text-zinc-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{skill}</span>
                    <X className="w-3 h-3 text-zinc-500" />
                  </div>
                ))}
                {backendSkills.length === 0 && (
                  <p className="text-[10px] text-zinc-550 italic">No backend skills added.</p>
                )}
              </div>
            </div>

            {/* TOOLS */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Tools</span>
                <button 
                  onClick={() => addSkillPrompt('tools')}
                  className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  + Add Tool Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {toolsSkills.map((skill) => (
                  <div 
                    key={skill}
                    onClick={() => deleteSkill('tools', skill)}
                    className="bg-[#161920] border border-[#232936] hover:border-red-500/40 hover:text-red-400 text-zinc-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{skill}</span>
                    <X className="w-3 h-3 text-zinc-500" />
                  </div>
                ))}
                {toolsSkills.length === 0 && (
                  <p className="text-[10px] text-zinc-550 italic">No tools added.</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* AI Resume Score Card */}
        <div className="lg:col-span-1 bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">AI Resume Score</h3>
            </div>

            {/* Gauge Display styled with premium rings */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-28 h-28 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center shadow-inner">
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 border-b-indigo-500/30 border-l-indigo-500/30 rotate-45" />
                <span className="text-2xl font-bold text-white">{profile.resumeScore || 0}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">/ 100</span>
              </div>
            </div>

            {/* Resume File details */}
            <div className="bg-[#161920]/60 border border-[#232936] rounded-xl p-3.5 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-bold text-zinc-200 truncate">{profile.resumeFilename || 'No resume file'}</h4>
                <p className="text-[9px] text-zinc-500 mt-0.5">Updated {profile.resumeUpdated || 'never'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-[10px] text-zinc-500 text-center italic">Go to 'Resume Optimization' tab to update score</p>
          </div>
        </div>

      </div>

      {/* Preferences Row (Desired Roles, Locations, Work Type) */}
      <div className="bg-[#0f1115] border border-[#1e222b] rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        
        {/* Column 1: Desired Roles */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-zinc-300 pb-1.5 border-b border-[#1e222b]/50 justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Desired Roles</span>
            </div>
            <button 
              onClick={handleModifyRoles}
              className="text-[9px] font-bold text-indigo-455 hover:text-indigo-305 transition"
            >
              Modify
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            {(profile.desiredRoles || []).map(role => (
              <div key={role} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-2 rounded-lg text-xs font-semibold">
                {role}
              </div>
            ))}
            {(profile.desiredRoles || []).length === 0 && (
              <p className="text-[10px] text-zinc-550 italic">No roles selected</p>
            )}
          </div>
        </div>

        {/* Column 2: Preferred Locations */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-zinc-300 pb-1.5 border-b border-[#1e222b]/50 justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Preferred Locations</span>
            </div>
            <button 
              onClick={handleModifyLocations}
              className="text-[9px] font-bold text-indigo-455 hover:text-indigo-305 transition"
            >
              Modify
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(profile.preferredLocations || []).map((loc) => (
              <span key={loc} className="bg-[#161920] border border-[#232936] text-zinc-300 px-2.5 py-1.5 rounded-lg text-xs">
                {loc}
              </span>
            ))}
            {(profile.preferredLocations || []).length === 0 && (
              <p className="text-[10px] text-zinc-550 italic">No locations selected</p>
            )}
          </div>
        </div>

        {/* Column 3: Work Type Checklist */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-zinc-300 pb-1.5 border-b border-[#1e222b]/50">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Work Type</span>
          </div>

          <div className="space-y-2.5">
            {/* Remote */}
            <div 
              onClick={() => toggleWorkType('remote')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className={`w-4 h-4 rounded border transition flex items-center justify-center flex-shrink-0 ${
                workTypes.remote 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'border-[#232936] bg-[#161920] group-hover:border-zinc-650'
              }`}>
                {workTypes.remote && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs text-zinc-300">Remote</span>
            </div>

            {/* Hybrid */}
            <div 
              onClick={() => toggleWorkType('hybrid')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className={`w-4 h-4 rounded border transition flex items-center justify-center flex-shrink-0 ${
                workTypes.hybrid 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'border-[#232936] bg-[#161920] group-hover:border-zinc-650'
              }`}>
                {workTypes.hybrid && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs text-zinc-300">Hybrid</span>
            </div>

            {/* On-site */}
            <div 
              onClick={() => toggleWorkType('onsite')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className={`w-4 h-4 rounded border transition flex items-center justify-center flex-shrink-0 ${
                workTypes.onsite 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'border-[#232936] bg-[#161920] group-hover:border-zinc-650'
              }`}>
                {workTypes.onsite && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs text-zinc-300">On-site</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
