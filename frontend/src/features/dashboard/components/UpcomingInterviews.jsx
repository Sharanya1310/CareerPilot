import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useData } from '../../../context/DataContext';
import { useConfirm } from '../../../context/ConfirmContext';
import { Video, Plus, X, Check } from 'lucide-react';

const FIELD_INPUT = 'w-full bg-[#161920] border border-[#232936] focus:border-indigo-500/50 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-600 outline-none transition';

export default function UpcomingInterviews() {
  const confirm = useConfirm();
  const { upcomingInterviews, scheduleInterview, deleteInterview } = useData();

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', date: '', time: '' });
  const [saving, setSaving] = useState(false);

  const resetForm = () => { setForm({ company: '', role: '', date: '', time: '' }); setIsAdding(false); };

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.role.trim() || !form.date.trim() || !form.time.trim()) return;
    setSaving(true);
    await scheduleInterview({ ...form });
    setSaving(false);
    resetForm();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Card className="bg-[#121214] border border-[#1e222b] h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Upcoming Interviews</CardTitle>
        <button
          onClick={() => setIsAdding(v => !v)}
          className={`p-1 rounded transition ${isAdding ? 'bg-[#1b1f29] text-indigo-400' : 'hover:bg-[#161920] text-indigo-400'}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">

        {/* Inline add form */}
        {isAdding && (
          <div className="bg-[#13161c] border border-[#1e222b] rounded-xl p-3 space-y-2 animate-slide-down">
            <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company name" className={FIELD_INPUT} />
            <input value={form.role}    onChange={e => set('role',    e.target.value)} placeholder="Role (e.g. L3 Backend)" className={FIELD_INPUT} />
            <div className="flex gap-2">
              <input value={form.date} onChange={e => set('date', e.target.value)} placeholder="Date (e.g. Oct 27)" className={FIELD_INPUT} />
              <input value={form.time} onChange={e => set('time', e.target.value)} placeholder="Time (e.g. 2:00 PM)" className={FIELD_INPUT} />
            </div>
            <div className="flex gap-2 pt-0.5">
              <button
                onClick={handleSubmit}
                disabled={saving || !form.company || !form.role || !form.date || !form.time}
                className="flex-1 h-7 rounded-lg text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition flex items-center justify-center gap-1"
              >
                <Check className="w-3 h-3" /> Save
              </button>
              <button
                onClick={resetForm}
                className="flex-grow flex-shrink-0 w-20 h-7 rounded-lg text-[11px] font-semibold bg-[#161920] hover:bg-[#232936] text-zinc-500 dark:text-zinc-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {upcomingInterviews.map((int) => {
          const dateParts = int.date.split(' ');
          const month = dateParts[0] ? dateParts[0].substring(0, 3) : 'Oct';
          const day = dateParts[1] ? dateParts[1].replace(',', '') : '27';

          return (
            <div key={int.id} className="p-3 bg-[#0f1115] rounded-xl border border-[#1e222b] flex items-center justify-between hover:border-zinc-700 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#161a23] border border-[#1e222b] rounded-lg flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">{month}</span>
                  <span className="text-sm font-extrabold text-indigo-400 -mt-1">{day}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{int.company}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{int.role} • {int.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 text-zinc-500 hover:text-indigo-400 transition">
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => confirm({
                    title: 'Remove interview?',
                    message: `Remove the scheduled interview with ${int.company}.`,
                    confirmLabel: 'Remove',
                    onConfirm: () => deleteInterview(int.id),
                  })}
                  className="p-1 text-zinc-500 hover:text-red-400 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {upcomingInterviews.length === 0 && !isAdding && (
          <p className="text-[10px] text-zinc-500 italic text-center py-4">No upcoming interviews scheduled</p>
        )}
      </CardContent>
    </Card>
  );
}
