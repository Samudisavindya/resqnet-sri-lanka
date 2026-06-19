import { useMemo, useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  Tag,
  Gauge,
  Loader2,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { useApp } from '../store';
import { useToast } from '../toast';
import { parseSituation } from '../nlp';
import { DISTRICTS } from '../mockData';
import { generateIncidentId } from '../store';
import { PRIORITY_STYLES, CATEGORY_STYLES } from '../ui';
import type { IncidentCategory, Priority } from '../types';

const EXAMPLES = [
  'Water rising fast near our home, families trapped on the roof. Need urgent rescue!',
  'නායයෑමක් වෙලා ගිලිලා, rescue team එකක් ඕනේ.',
  'Children are hungry, no food or milk powder for 2 days.',
  'Elderly man with fever, needs doctor and medicine urgently.',
];

export default function ReportEmergency() {
  const { addIncident } = useApp();
  const { notify } = useToast();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [district, setDistrict] = useState<string>('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const parse = useMemo(() => parseSituation(details), [details]);
  const hasText = details.trim().length > 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district || !hasText) {
      notify('error', 'Missing information', 'Select a district and describe the situation.');
      return;
    }
    setSubmitting(true);
    const id = generateIncidentId();
    const incident = {
      id,
      location: location.trim() || district,
      district,
      category: parse.category as IncidentCategory,
      priority: parse.priority as Priority,
      reportedAt: new Date().toISOString(),
      status: 'Open' as const,
      summary: details.trim(),
      reporterName: name.trim() || undefined,
      reporterContact: contact.trim() || undefined,
    };
    try {
      await addIncident(incident);
      notify(
        'success',
        'Emergency reported',
        `${id} classified as ${parse.category} / ${parse.priority}. Saved and visible on Dashboard & Incidents Feed.`
      );
      setName('');
      setContact('');
      setDistrict('');
      setLocation('');
      setDetails('');
    } catch (err) {
      console.error(err);
      notify(
        'error',
        'Failed to save report',
        'The emergency could not be stored. Please retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Report an Emergency</h1>
        <p className="text-sm text-slate-400 mt-1">
          හදිසි තත්වයක් වාර්තා කරන්න · Describe the situation in plain English or Sinhala
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 rounded-2xl border border-slate-800 bg-[#0b0f1a] p-6 space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sender Name" icon={User}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kasun Perera"
                className="input"
              />
            </Field>
            <Field label="Contact Number" icon={Phone}>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="07X XXX XXXX"
                className="input font-mono"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="District" icon={MapPin} required>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`input ${district ? 'text-slate-200' : 'text-slate-500'}`}
              >
                <option value="">Select affected district...</option>
                {[...DISTRICTS].map((d) => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-200">
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Specific Location" icon={MapPin}>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Neighborhood / landmark"
                className="input"
              />
            </Field>
          </div>

          <Field label="Situation Details" icon={MessageSquare} required>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              placeholder="Describe what is happening. e.g. 'Water is rising fast, families trapped on the roof, urgent rescue needed...'"
              className="input resize-none leading-relaxed"
            />
          </Field>

          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-slate-500 mr-1 self-center">Quick examples:</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDetails(ex)}
                className="rounded-md border border-slate-800 bg-slate-900/40 px-2 py-1 text-[10px] text-slate-400 hover:border-slate-700 hover:text-slate-200 transition"
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || !hasText || !district}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-900/30 transition-all hover:shadow-rose-900/50 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing & Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Submit Emergency Report
              </>
            )}
          </button>
        </form>

        <aside className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0c1320] to-[#0b0f1a] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-300">
                <Brain className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">AI Classification Engine</h2>
                <p className="text-[11px] text-slate-500">Live NLP analysis of your input</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Category</span>
                </div>
                <span
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
                    hasText
                      ? CATEGORY_STYLES[parse.category as IncidentCategory]
                      : 'border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  {hasText ? parse.category : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">Priority</span>
                </div>
                <span
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold ${
                    hasText
                      ? PRIORITY_STYLES[parse.priority as Priority]
                      : 'border-slate-800 bg-slate-900/40 text-slate-600'
                  }`}
                >
                  {hasText ? parse.priority : '—'}
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-medium text-slate-400">Detected Keywords</span>
                </div>
                {hasText && parse.matchedKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {parse.matchedKeywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-600">
                    {hasText
                      ? 'No specific keywords detected — will default to Logistics / Medium.'
                      : 'Start typing to see live analysis...'}
                  </p>
                )}
              </div>

              {hasText && parse.matchedRule && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  <p className="text-[11px] leading-relaxed text-emerald-200">
                    Classified as <strong>{parse.category}</strong> with{' '}
                    <strong>{parse.priority}</strong> priority. Will auto-route to the correct
                    response team on submission.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0b0f1a] p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              How classification works
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="flex gap-2">
                <span className="h-1.5 w-1.5 mt-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                <span><strong className="text-rose-300">Rescue / Critical</strong> — trapped, flood, landslide, roof, rescue</span>
              </li>
              <li className="flex gap-2">
                <span className="h-1.5 w-1.5 mt-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span><strong className="text-amber-300">Food & Rations / High</strong> — hungry, food, rice, milk powder</span>
              </li>
              <li className="flex gap-2">
                <span className="h-1.5 w-1.5 mt-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                <span><strong className="text-sky-300">Medical / High</strong> — injury, medicine, hospital, fever</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(30 41 59);
          background: rgb(2 6 23 / 0.6);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: rgb(226 232 240);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input::placeholder { color: rgb(71 85 105); }
        .input:focus {
          outline: none;
          border-color: rgb(71 85 105);
          box-shadow: 0 0 0 3px rgb(51 65 85 / 0.25);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 mb-1.5 text-xs font-medium text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}
