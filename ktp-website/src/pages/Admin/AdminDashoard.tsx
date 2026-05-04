import { useState, useRef, useEffect, useContext } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { storage, firestore, auth } from "../../firebase/firebase";
import { DataBaseDataContext } from '../../contexts/DataBaseDataContext';
import fallbackImage from "../../img/KTPLogo.jpeg";
import axios from 'axios';
import Modal from 'react-modal';
import "./main.css";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SideMenu from '../../components/Admin/SideMenu';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const POSITION_MAP: Record<string, number> = {
    "Rushee":      0,
    "Pledge":      1,
    "Brother":     2,
    "Eboard":      3,
    "Alumni":      4,
    "Super Admin": 5,
};

const POSITION_LABEL: Record<number, string> = {
    0: "Rushee", 1: "Pledge", 2: "Brother",
    3: "Eboard", 4: "Alumni", 5: "Super Admin",
};

const POSITION_BADGE: Record<number, string> = {
    0: "bg-gray-100 text-gray-600",
    1: "bg-amber-100 text-amber-700",
    2: "bg-[#eef3ff] text-[#134b91]",
    3: "bg-purple-100 text-purple-700",
    4: "bg-emerald-100 text-emerald-700",
    5: "bg-red-100 text-red-700",
};

const GREEK_CLASSES = [
    "Alpha","Beta","Gamma","Delta","Epsilon","Zeta",
    "Eta","Theta","Iota","Kappa","Lambda","Mu",
    "Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon",
];

const FILTER_CONFIG = [
    { key: "Position",  options: Object.keys(POSITION_MAP) },
    { key: "Grad Year", options: ["2023","2024","2025","2026","2027","2028","2029","2030"] },
    { key: "Class",     options: GREEK_CLASSES },
];

const SHOW_LIMIT = 5;

interface User {
    WebsitePhotoURL: string;
    id: string;
    Position?: number;
    Eboard_Position?: string;
    websitePic?: string;
    LinkedIn?: string;
    FirstName?: string;
    LastName?: string;
    Class?: string;
    pictureUrl?: string | null;
    Clout?: string;
    BUEmail?: string;
    Major?: string;
    Minor?: string;
    GradYear?: string;
    Colleges?: string[];
}

interface DataBaseDataContextType {
    userData?: User[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthHeader() {
    const token = await auth.currentUser?.getIdToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getUserByEmail(email: string) {
    const headers = await getAuthHeader();
    const res = await axios.get(`${backendUrl}/users/email/${email}`, { headers });
    return res.data;
}

async function updateUser(id: string, updatedObject: object) {
    try {
        const headers = await getAuthHeader();
        await axios.put(`${backendUrl}/users/${id}`, updatedObject, { headers });
        alert("User successfully updated!");
    } catch (e: any) {
        console.error("Error updating user:", e.message);
        alert("Failed to update user.");
    }
}

function getUserByName(name: string, userData: User[]): User[] {
    const lower = name.toLowerCase();
    const parts = name.split(" ");
    if (parts.length > 1) {
        const first = parts[0].toLowerCase();
        const last  = parts[1].toLowerCase();
        return userData.filter(u =>
            u.FirstName?.toLowerCase().includes(first) &&
            u.LastName?.toLowerCase().includes(last)
        );
    }
    return userData.filter(u =>
        u.FirstName?.toLowerCase().includes(lower) ||
        u.LastName?.toLowerCase().includes(lower)
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm text-gray-800">
                {value ?? <span className="text-gray-300 italic">—</span>}
            </p>
        </div>
    );
}

function EditField({ label, value, onChange, type = "text" }: {
    label: string; value?: string | number; onChange: (v: string) => void; type?: string;
}) {
    return (
        <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
            <input
                type={type}
                value={value ?? ''}
                onChange={e => onChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#458eff] focus:border-transparent transition"
            />
        </div>
    );
}

// Shows up to SHOW_LIMIT options, then a "Show N more / Show fewer" toggle
// so users aren't confronted with a hidden scroll.
function FilterSection({ label, options, selected, onToggle }: {
    label: string;
    options: string[];
    selected: string[];
    onToggle: (opt: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const hasMore    = options.length > SHOW_LIMIT;
    const visible    = expanded ? options : options.slice(0, SHOW_LIMIT);
    const hiddenCount = options.length - SHOW_LIMIT;

    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{label}</h3>
            <div className="flex flex-col gap-0.5">
                {visible.map(opt => {
                    const active = selected.includes(opt);
                    return (
                        <label
                            key={opt}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-sm select-none transition-colors ${
                                active ? 'bg-[#eef3ff] text-[#134b91] font-medium' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="accent-[#134b91] h-3.5 w-3.5 flex-shrink-0"
                                checked={active}
                                onChange={() => onToggle(opt)}
                            />
                            {opt}
                        </label>
                    );
                })}
            </div>
            {hasMore && (
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="mt-2 flex items-center gap-1 text-xs text-[#458eff] hover:text-[#134b91] font-medium transition-colors"
                >
                    {expanded ? (
                        <><ChevronUp className="h-3 w-3" /> Show fewer</>
                    ) : (
                        <><ChevronDown className="h-3 w-3" /> Show {hiddenCount} more</>
                    )}
                </button>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
    const dataContext = useContext(DataBaseDataContext) as DataBaseDataContextType | null;
    const userData = dataContext?.userData;

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        Position: [], "Grad Year": [], Class: [],
    });

    const activeFilterCount = Object.values(selectedFilters).reduce((n, arr) => n + arr.length, 0);

    const toggleFilter = (category: string, value: string) => {
        setSelectedFilters(prev => {
            const cur  = prev[category] ?? [];
            const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
            return { ...prev, [category]: next };
        });
    };

    const clearAllFilters = () =>
        setSelectedFilters({ Position: [], "Grad Year": [], Class: [] });

    const applyFilters = (data: User[]): User[] =>
        data.filter(user => {
            const posOk = selectedFilters.Position.length === 0 ||
                // Use Number() so the comparison is robust whether Firestore stored the
                // position as a number or as a numeric string.
                selectedFilters.Position.some(p => POSITION_MAP[p] === Number(user.Position));
            const yearOk = selectedFilters["Grad Year"].length === 0 ||
                selectedFilters["Grad Year"].some(y => y === String(user.GradYear));
            const classOk = selectedFilters.Class.length === 0 ||
                selectedFilters.Class.includes(user.Class ?? '');
            return posOk && yearOk && classOk;
        });

    const [queryResults, setQueryResults] = useState<User[]>([]);
    const [searchQuery, setSearchQuery]   = useState("");
    const [modalOpen, setModalOpen]       = useState(false);
    const [userClicked, setUserClicked]   = useState<User | null>(null);
    const [editMode, setEditMode]         = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function closeModal() { setModalOpen(false); setEditMode(false); }

    function update(field: keyof User, value: string | number | string[]) {
        setUserClicked(prev => prev ? { ...prev, [field]: value } : prev);
    }

    function handleInputSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (searchQuery.includes("@")) {
            getUserByEmail(searchQuery).then(setQueryResults).catch(() => setQueryResults([]));
        } else {
            setQueryResults(getUserByName(searchQuery, userData ?? []));
        }
    }

    const handleImageUpload = async (brotherId: string, file: File) => {
        const storageRef = ref(storage, `brothers/${brotherId}-${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            await updateDoc(doc(firestore, "users", brotherId), { WebsitePhotoURL: url });
            setUserClicked(prev => prev ? { ...prev, WebsitePhotoURL: url } : prev);
            alert("Photo updated!");
        } catch { alert("Upload failed."); }
    };

    useEffect(() => { Modal.setAppElement('#root'); }, []);

    const displayedData = applyFilters(
        queryResults.length > 0 ? queryResults : (userData ?? [])
    );

    // Active filter chips — one removable pill per selected value
    const activeChips = Object.entries(selectedFilters).flatMap(([cat, vals]) =>
        vals.map(v => ({ cat, v }))
    );

    return (
        <div className="min-h-screen bg-gray-50" id="SideMenuContainer">
            <SideMenu />

            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="bg-[#134b91] text-white px-8 py-5 shadow-md flex items-end justify-between">
                <div>
                    <p className="text-[#8bb9ff] text-xs font-semibold uppercase tracking-widest mb-0.5">KTP Lambda Chapter</p>
                    <h1 className="text-2xl font-bold tracking-tight">Member Directory</h1>
                </div>
                <p className="text-[#8bb9ff] text-sm pb-0.5">{userData?.length ?? 0} members total</p>
            </div>

            <div className="flex">
                {/* ── Sidebar ───────────────────────────────────────────── */}
                <aside className="w-72 bg-white border-r border-gray-100 min-h-screen p-5 flex flex-col gap-5 flex-shrink-0">

                    {/* Search */}
                    <form onSubmit={handleInputSubmit}>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search name or email…"
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#458eff] focus:border-transparent transition"
                            />
                        </div>
                        {queryResults.length > 0 && (
                            <button
                                type="button"
                                onClick={() => { setQueryResults([]); setSearchQuery(''); }}
                                className="mt-2 text-xs text-[#458eff] hover:text-[#134b91] transition-colors"
                            >
                                Clear search results
                            </button>
                        )}
                    </form>

                    {/* Filter sections */}
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters</h2>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-[#458eff] hover:text-[#134b91] transition-colors"
                                >
                                    Clear all ({activeFilterCount})
                                </button>
                            )}
                        </div>

                        {FILTER_CONFIG.map(({ key, options }) => (
                            <FilterSection
                                key={key}
                                label={key}
                                options={options}
                                selected={selectedFilters[key] ?? []}
                                onToggle={v => toggleFilter(key, v)}
                            />
                        ))}
                    </div>
                </aside>

                {/* ── Main content ──────────────────────────────────────── */}
                <main className="flex-1 p-6">

                    {/* Active filter chips */}
                    {activeChips.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {activeChips.map(({ cat, v }) => (
                                <button
                                    key={`${cat}-${v}`}
                                    onClick={() => toggleFilter(cat, v)}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-[#eef3ff] text-[#134b91] text-xs font-semibold rounded-full border border-[#8bb9ff]/50 hover:bg-[#dce8ff] transition-colors"
                                >
                                    {v}
                                    <span className="text-[#458eff] text-sm leading-none">×</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Result count */}
                    <p className="text-sm text-gray-400 mb-4">
                        Showing{' '}
                        <span className="font-semibold text-gray-700">{displayedData.length}</span>
                        {' '}member{displayedData.length !== 1 ? 's' : ''}
                        {activeFilterCount > 0 && (
                            <span className="text-[#458eff]"> · {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>
                        )}
                    </p>

                    {/* Member cards */}
                    <div className="flex flex-col gap-2">
                        {displayedData.map((user, idx) => {
                            const posLabel = user.Position !== undefined ? (POSITION_LABEL[user.Position] ?? '—') : null;
                            const badge    = user.Position !== undefined ? (POSITION_BADGE[user.Position]  ?? 'bg-gray-100 text-gray-600') : 'bg-gray-100 text-gray-600';
                            return (
                                <div
                                    key={user.id || idx}
                                    onClick={() => { setModalOpen(true); setUserClicked(user); }}
                                    className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-[#8bb9ff] transition-all duration-150"
                                >
                                    {/* object-top keeps the face near the top of the frame */}
                                    <img
                                        src={user.WebsitePhotoURL ?? fallbackImage}
                                        className="h-9 w-9 rounded-full object-cover object-top border-2 border-gray-100 flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                                            {user.FirstName} {user.LastName}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.BUEmail ?? '—'}</p>
                                    </div>
                                    {posLabel && (
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${badge}`}>
                                            {posLabel}
                                        </span>
                                    )}
                                    <span className="text-gray-300 text-xl flex-shrink-0 leading-none">›</span>
                                </div>
                            );
                        })}

                        {displayedData.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-5xl mb-3">🔍</p>
                                <p className="text-base font-medium text-gray-400">No members found</p>
                                <p className="text-sm text-gray-300 mt-1">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ── Member detail modal ───────────────────────────────────── */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="Member Detail"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(10,20,40,0.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(2px)',
                    },
                    content: {
                        position: 'relative', inset: 'auto', border: 'none',
                        borderRadius: 16, padding: 0,
                        width: 720, maxWidth: '95vw', maxHeight: '90vh',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                    }
                }}
            >
                {/* Header */}
                <div className="bg-[#134b91] text-white px-7 py-6 flex items-center gap-5 flex-shrink-0">
                    <div
                        className="relative group cursor-pointer flex-shrink-0"
                        onClick={editMode ? () => fileInputRef.current?.click() : undefined}
                    >
                        {/* object-top so faces aren't cropped out of the circle */}
                        <img
                            src={userClicked?.WebsitePhotoURL ?? fallbackImage}
                            className="h-16 w-16 rounded-full object-cover object-top border-2 border-white/25"
                        />
                        {editMode && (
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Change</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file" accept="image/*" ref={fileInputRef} className="hidden"
                        onChange={e => {
                            if (e.target.files?.[0] && userClicked?.id)
                                handleImageUpload(userClicked.id, e.target.files[0]);
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold leading-tight truncate">
                            {userClicked?.FirstName ?? ''} {userClicked?.LastName ?? ''}
                        </h2>
                        <p className="text-[#8bb9ff] text-sm mt-0.5">
                            {userClicked?.Position !== undefined
                                ? (POSITION_LABEL[userClicked.Position] ?? 'Member')
                                : 'No position set'}
                            {userClicked?.Eboard_Position ? ` · ${userClicked.Eboard_Position}` : ''}
                        </p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="ml-auto text-white/50 hover:text-white text-xl leading-none transition-colors flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                    >✕</button>
                </div>

                {/* Body */}
                <div className="p-7 overflow-y-auto flex-1 bg-white">
                    {!editMode ? (
                        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                            <InfoRow label="BU Email"  value={userClicked?.BUEmail} />
                            <InfoRow label="Major"     value={userClicked?.Major} />
                            <InfoRow label="Minor"     value={userClicked?.Minor} />
                            <InfoRow label="Grad Year" value={userClicked?.GradYear} />
                            <InfoRow label="Class"     value={userClicked?.Class} />
                            <InfoRow label="Clout"     value={userClicked?.Clout} />
                            <InfoRow label="Colleges"  value={userClicked?.Colleges?.join(', ')} />
                            {userClicked?.LinkedIn && <InfoRow label="LinkedIn" value={userClicked.LinkedIn} />}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <EditField label="First Name" value={userClicked?.FirstName}  onChange={v => update("FirstName", v)} />
                            <EditField label="Last Name"  value={userClicked?.LastName}   onChange={v => update("LastName", v)} />
                            <EditField label="BU Email"   value={userClicked?.BUEmail}    onChange={v => update("BUEmail", v)} />
                            <EditField label="Major"      value={userClicked?.Major}      onChange={v => update("Major", v)} />
                            <EditField label="Minor"      value={userClicked?.Minor}      onChange={v => update("Minor", v)} />
                            <EditField label="Grad Year"  value={userClicked?.GradYear}   onChange={v => update("GradYear", v)} />
                            <EditField label="Class"      value={userClicked?.Class}      onChange={v => update("Class", v)} />
                            <EditField label="Clout"      value={userClicked?.Clout}      onChange={v => update("Clout", v)} />
                            <div className="col-span-2">
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                    Position — 0 Rushee · 1 Pledge · 2 Brother · 3 Eboard · 4 Alumni · 5 Super Admin
                                </label>
                                <input
                                    type="number" min={0} max={5}
                                    value={userClicked?.Position ?? ''}
                                    onChange={e => update("Position", Number(e.target.value))}
                                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#458eff] focus:border-transparent transition"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Colleges</label>
                                <div className="flex flex-wrap gap-2">
                                    {userClicked?.Colleges?.map((college, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            defaultValue={college}
                                            onChange={e => {
                                                const updated = [...(userClicked.Colleges ?? [])];
                                                updated[idx] = e.target.value;
                                                update("Colleges", updated);
                                            }}
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-[#458eff] focus:border-transparent transition"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-7 py-4 flex justify-end gap-3 bg-gray-50 flex-shrink-0">
                    {!editMode ? (
                        <>
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-5 py-2 bg-[#134b91] text-white rounded-lg text-sm font-semibold hover:bg-[#234c8b] transition-colors"
                            >Edit</button>
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                            >Close</button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={async () => {
                                    if (userClicked) { await updateUser(userClicked.id, userClicked); setEditMode(false); }
                                }}
                                className="px-5 py-2 bg-[#134b91] text-white rounded-lg text-sm font-semibold hover:bg-[#234c8b] transition-colors"
                            >Save changes</button>
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                            >Discard</button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
