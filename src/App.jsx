import React, { useState, useMemo, useRef } from 'react';
import { User, Trophy, Play, ChevronRight, Flame, Filter, Search } from 'lucide-react';
import {
  saveScore,
  saveScoreLocal,
  getLeaderboard,
  getLeaderboardLocal,
  isSupabaseConfigured,
} from './lib/supabase';

// --- THE COMPLETE 43 PERSON ROSTER ---
const staffData = [
  { "id": 1, "firstName": "Annie", "lastName": "Milewski", "title": "Director of Curriculum Services", "dept": ["Curriculum"], "image": "Milewski_Annie.jpeg" },
  { "id": 2, "firstName": "Greg", "lastName": "Macer", "title": "Supervisor of STEM", "dept": ["Curriculum"], "image": "Macer_Greg.jpeg" },
  { "id": 3, "firstName": "Amy", "lastName": "Marrongelle", "title": "Supervisor of Mathematics & District Support", "dept": ["Curriculum"], "image": "Marrongelle_Amy.jpg" },
  { "id": 4, "firstName": "R-E", "lastName": "Miller", "title": "Technology Specialist II", "dept": ["Technology Services"], "image": "Miller_R-E.jpeg" },
  { "id": 5, "firstName": "Doreen", "lastName": "Milot", "title": "TAC Educational Consultant, Project SEARCH Coordinator", "dept": ["Special Education", "TAC"], "image": "Milot_Doreen.jpeg" },
  { "id": 6, "firstName": "Mark", "lastName": "Barnett", "title": "Director of Technology Services", "dept": ["Technology Services"], "image": "Barnett_Mark.jpeg" },
  { "id": 7, "firstName": "Christine", "lastName": "Benshoff", "title": "Program Coordinator, Schuylkill Achieve", "dept": ["Curriculum"], "image": "Benshoff_Christine.jpg" },
  { "id": 8, "firstName": "Kristal", "lastName": "Benshoff", "title": "Administrative Assistant", "dept": ["Curriculum"], "image": "Benshoff_Christine.jpg" },
  { "id": 9, "firstName": "Craig", "lastName": "Buffington", "title": "Technology Specialist, Networks & Servers", "dept": ["Technology Services"], "image": "Buffington_Craig.jpeg" },
  { "id": 10, "firstName": "Melissa", "lastName": "Decusky", "title": "Supervisor of Special Education", "dept": ["MAC", "Early Intervention"], "image": "Decusky_Melissa.png" },
  { "id": 11, "firstName": "Dr. Rene", "lastName": "Evans", "title": "Director of Special Education", "dept": ["Special Education"], "image": "Evans_Dr_Rene.jpeg" },
  { "id": 12, "firstName": "Anne", "lastName": "Grabowski", "title": "TAC Educational Consultant", "dept": ["Special Education", "TAC"], "image": "Grabowski_Anne.jpeg" },
  { "id": 13, "firstName": "Amanda", "lastName": "Leshko", "title": "TAC Educational Consultant", "dept": ["Curriculum"], "image": "Leshko_Amanda.jpeg" },
  { "id": 14, "firstName": "Lorie", "lastName": "Ossman", "title": "Staff Accountant", "dept": ["Business Office"], "image": "Ossman_Lorie.jpg" },
  { "id": 15, "firstName": "Michelle", "lastName": "Rose", "title": "Transportation Coordinator", "dept": ["Transportation"], "image": "Rose_Michelle.jpeg" },
  { "id": 16, "firstName": "Marie", "lastName": "Ryan-Huda", "title": "Business Office/Human Resource Assistant", "dept": ["Business Office"], "image": "Ryan-Huda_Marie.jpeg" },
  { "id": 17, "firstName": "John", "lastName": "Sacco", "title": "Technology Specialist I", "dept": ["Technology Services"], "image": "Sacco_John.jpeg" },
  { "id": 18, "firstName": "Abra", "lastName": "Schultz", "title": "Data Quality Specialist Coordinator", "dept": ["Special Education"], "image": "Schultz_Abra.jpeg" },
  { "id": 19, "firstName": "Dr. Tony", "lastName": "Serafini", "title": "Executive Director", "dept": ["Administration"], "image": "Serafini_Dr_Anthony.jpeg" },
  { "id": 20, "firstName": "Deb", "lastName": "Stivers", "title": "Supervisor of English Language Arts", "dept": ["Curriculum"], "image": "Stivers_Deb.jpeg" },
  { "id": 21, "firstName": "Michelle", "lastName": "Stone", "title": "Special Programs Assistant", "dept": ["Curriculum"], "image": "Stone_Michelle.jpeg" },
  { "id": 22, "firstName": "Cindy", "lastName": "Studlack", "title": "TAC Educational Consultant, Assistive Technology Specialist", "dept": ["Special Education", "TAC"], "image": "Studlack_Cindy.jpeg" },
  { "id": 23, "firstName": "Tracy", "lastName": "Tobin", "title": "Administrative Assistant, ACCESS", "dept": ["Special Education"], "image": "Tobin_Tracy.jpeg" },
  { "id": 24, "firstName": "Kristen", "lastName": "White", "title": "Lead Program Coordinator", "dept": ["Curriculum"], "image": "White_Kristen.jpeg" },
  { "id": 25, "firstName": "Dr. Barb", "lastName": "Wilkinson", "title": "Supervisor of School Improvement and District Support Consultant", "dept": ["Curriculum"], "image": "Wilkinson_Dr_Barbara.jpg" },
  { "id": 26, "firstName": "Jackie", "lastName": "Wolff", "title": "Administrative Assistant", "dept": ["Special Education"], "image": "Wolff_Jackie.png" },
  { "id": 27, "firstName": "Jaime", "lastName": "Zimerofsky", "title": "Executive/Board Secretary", "dept": ["Administration"], "image": "Zimerofsky_Jaime.jpeg" },
  { "id": 28, "firstName": "Melissa", "lastName": "Zula", "title": "Administrative Assistant", "dept": ["Transportation"], "image": "Zula_Melissa.jpg" },
  { "id": 29, "firstName": "Krystal", "lastName": "Brown", "title": "Itinerant Hearing", "dept": ["Special Education"], "image": "Brown_Krystal.jpeg" },
  { "id": 30, "firstName": "Karin", "lastName": "Caporuscio", "title": "Outreach Specialist", "dept": ["Special Education"], "image": "Caporuscio_Karin.jpeg" },
  { "id": 31, "firstName": "Kayla", "lastName": "Drasdis", "title": "Itinerant Teacher", "dept": ["Special Education"], "image": "Drasdis_Kayla.jpeg" },
  { "id": 32, "firstName": "Kristy", "lastName": "Gruber", "title": "School Psychologist", "dept": ["Special Education"], "image": "Gruber_Kristy.jpg" },
  { "id": 33, "firstName": "Shannon", "lastName": "LaSalle", "title": "Administrative Assistant", "dept": ["Administration"], "image": "LaSalle_Shannon.jpeg" },
  { "id": 34, "firstName": "Randy", "lastName": "Lattis", "title": "Board Certified Behavior Analyst (BCBA)", "dept": ["Special Education"], "image": "Lattis_Randy.jpeg" },
  { "id": 35, "firstName": "Kathryn", "lastName": "Clews", "title": "Administrative Assistant", "dept": ["Business Office"], "image": "Clews_Kathryn.jpeg" },
  { "id": 36, "firstName": "Kristy", "lastName": "Frantz", "title": "Business Manager", "dept": ["Business Office"], "image": "Frantz_Kristy.jpeg" },
  { "id": 37, "firstName": "Rob", "lastName": "Houseknecht", "title": "Assistant Business Manager, Human Resources", "dept": ["Business Office"], "image": "Houseknecht_Rob.jpeg" },
  { "id": 38, "firstName": "Linette", "lastName": "Hunyara", "title": "Accounting Specialist", "dept": ["Administration"], "image": "Hunyara_Linette.jpeg" },
  { "id": 39, "firstName": "Joe", "lastName": "Conville", "title": "Custodian", "dept": ["Maintenance"], "image": "Conville_Joe.jpeg" },
  { "id": 40, "firstName": "Donna", "lastName": "Corby", "title": "Custodian", "dept": ["Maintenance"], "image": "Corby_Donnarae.jpg" },
  { "id": 41, "firstName": "Larissa", "lastName": "Russell", "title": "Interagency Coordinator", "dept": ["Special Education"], "image": "Russell_Larissa.jpeg" },
  { "id": 42, "firstName": "Gail", "lastName": "Stehr", "title": "Staff Accountant", "dept": ["Business Office"], "image": "Stehr_Gail.jpeg" },
  { "id": 43, "firstName": "Rachel", "lastName": "Sterner", "title": "Maintenance Supervisor", "dept": ["Maintenance"], "image": "Sterner_Rachel.jpeg" }
];

const App = () => {
  const [gameState, setGameState] = useState('MENU');
  const [difficulty, setDifficulty] = useState('EASY');
  const [selectedDept, setSelectedDept] = useState('All');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledStaff, setShuffledStaff] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [options, setOptions] = useState([]);
  const [userInput, setUserInput] = useState('');

  // leaderboard state
  const [playerName, setPlayerName] = useState('');
  const [maxStreak, setMaxStreak] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToBoard, setSavedToBoard] = useState(false);
  const streakRef = useRef(0);

  const departments = useMemo(() => {
    const depts = new Set();
    staffData.forEach(staff => {
      if (Array.isArray(staff.dept)) staff.dept.forEach(d => depts.add(d));
      else depts.add(staff.dept);
    });
    return ['All', ...Array.from(depts).sort()];
  }, []);

  const startGame = () => {
    let filtered = staffData.filter(s =>
      selectedDept === 'All' ||
      (Array.isArray(s.dept) ? s.dept.includes(selectedDept) : s.dept === selectedDept)
    );
    if (filtered.length === 0) return;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledStaff(shuffled);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    streakRef.current = 0;
    setMaxStreak(0);
    setCorrectCount(0);
    setStartTime(Date.now());
    setSavedToBoard(false);
    setPlayerName('');
    setGameState('PLAYING');
    generateRoundData(shuffled, 0);
  };

  const generateRoundData = (list, idx) => {
    const current = list[idx];
    if (difficulty === 'EASY') {
      const others = staffData.filter(s => s.id !== current.id).sort(() => Math.random() - 0.5).slice(0, 2);
      setOptions([...others, current].sort(() => Math.random() - 0.5));
    }
    setUserInput('');
    setFeedback(null);
  };

  const processResult = (isCorrect) => {
    setFeedback({
      type: isCorrect ? 'correct' : 'wrong',
      message: isCorrect ? 'Spot On!' : `Nope, it's ${shuffledStaff[currentIndex].firstName}`
    });
    if (isCorrect) {
      setScore(s => s + (difficulty === 'EASY' ? 10 : 50));
      streakRef.current += 1;
      setStreak(streakRef.current);
      setMaxStreak(m => Math.max(m, streakRef.current));
      setCorrectCount(c => c + 1);
    } else {
      streakRef.current = 0;
      setStreak(0);
    }
    setTimeout(() => {
      if (currentIndex + 1 < shuffledStaff.length) {
        setCurrentIndex(c => c + 1);
        generateRoundData(shuffledStaff, currentIndex + 1);
      } else {
        setGameState('RESULTS');
      }
    }, 1200);
  };

  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await getLeaderboard();
        setLeaderboard(!error && data ? data : getLeaderboardLocal());
      } else {
        setLeaderboard(getLeaderboardLocal());
      }
    } catch {
      setLeaderboard(getLeaderboardLocal());
    }
    setLeaderboardLoading(false);
  };

  const handleSaveScore = async () => {
    const name = playerName.trim();
    if (!name) return;
    setSaving(true);
    const timeSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    const accuracy = shuffledStaff.length > 0
      ? Math.round((correctCount / shuffledStaff.length) * 100)
      : 0;
    const entry = { player_name: name, score, time_seconds: timeSeconds, accuracy, crowns: maxStreak };
    try {
      if (isSupabaseConfigured) {
        const { error } = await saveScore(entry);
        if (error) saveScoreLocal(entry);
      } else {
        saveScoreLocal(entry);
      }
    } catch {
      saveScoreLocal(entry);
    }
    setSaving(false);
    setSavedToBoard(true);
    await loadLeaderboard();
    setGameState('LEADERBOARD');
  };

  const formatTime = (secs) => {
    if (!secs) return '—';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center overflow-hidden font-sans select-none">
      {/* HEADER */}
      <header className="w-full max-w-lg flex justify-between items-center px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
            <User size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-black italic tracking-tighter uppercase">IU29 Staff</h1>
        </div>
        {gameState === 'PLAYING' && (
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 items-center">
            <div>Points: <span className="text-white">{score}</span></div>
            <div className="flex items-center gap-1">
              <Flame size={12} className={streak > 0 ? "text-orange-500" : "text-slate-700"} />
              <span className={streak > 0 ? "text-orange-400" : "text-slate-700"}>{streak}</span>
            </div>
          </div>
        )}
        {(gameState === 'LEADERBOARD' || gameState === 'RESULTS') && (
          <button
            onClick={() => setGameState('MENU')}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
          >
            Menu
          </button>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full max-w-sm flex flex-col justify-center px-4 py-6 overflow-y-auto">

        {/* ── MENU ── */}
        {gameState === 'MENU' && (
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Department</label>
                <Filter size={12} className="text-slate-700" />
              </div>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="w-full bg-slate-800/80 p-4 rounded-2xl outline-none ring-1 ring-white/10 focus:ring-indigo-500 appearance-none text-xs font-bold transition-all"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-1 block">Challenge Level</label>
              <div className="grid grid-cols-2 gap-2">
                {['EASY', 'HARD'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`py-4 rounded-2xl font-black text-xs transition-all tracking-[0.1em] ${difficulty === lvl ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 ring-2 ring-indigo-400' : 'bg-slate-800/40 text-slate-500 hover:bg-slate-800'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase italic shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 tracking-[0.15em] text-xs"
            >
              <Play size={18} fill="black" />
              Launch Session
            </button>

            <button
              onClick={() => { loadLeaderboard(); setGameState('LEADERBOARD'); }}
              className="w-full bg-slate-800/40 text-slate-400 py-4 rounded-2xl font-black uppercase italic tracking-[0.15em] text-xs hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Trophy size={14} />
              View Leaderboard
            </button>
          </div>
        )}

        {/* ── PLAYING ── */}
        {gameState === 'PLAYING' && shuffledStaff[currentIndex] && (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${(currentIndex / shuffledStaff.length) * 100}%` }}
              />
            </div>

            <div className="relative w-full aspect-[4/5] max-h-[48vh] bg-slate-900 border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
              <img
                src={`/data/${shuffledStaff[currentIndex].image}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=No+Photo"; }}
              />
              {feedback && (
                <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-300 ${feedback.type === 'correct' ? 'bg-green-500/60' : 'bg-red-500/60'}`}>
                  <p className="text-2xl font-black italic uppercase text-white drop-shadow-2xl scale-110">{feedback.message}</p>
                </div>
              )}
            </div>

            <div className="w-full space-y-2.5">
              {difficulty === 'EASY' ? (
                options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => processResult(opt.id === shuffledStaff[currentIndex].id)}
                    disabled={!!feedback}
                    className={`w-full p-4 rounded-2xl font-bold border transition-all text-left flex justify-between items-center text-xs group ${
                      feedback && opt.id === shuffledStaff[currentIndex].id
                        ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/20'
                        : feedback && feedback.type === 'wrong'
                          ? 'bg-slate-900/50 border-white/5 text-slate-600'
                          : 'bg-slate-800/80 border-white/5 hover:bg-slate-700 hover:translate-x-1 active:scale-[0.98]'
                    }`}
                  >
                    <span className="uppercase tracking-wider">{opt.firstName} {opt.lastName}</span>
                    <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const current = shuffledStaff[currentIndex];
                    const guess = userInput.trim().toLowerCase();
                    const isCorrect =
                      guess === current.firstName.toLowerCase() ||
                      guess === (current.firstName + " " + current.lastName).toLowerCase();
                    processResult(isCorrect);
                  }}
                  className="space-y-3 w-full"
                >
                  <div className="relative">
                    <Search className="absolute left-5 top-4.5 text-slate-600" size={18} />
                    <input
                      autoFocus
                      type="text"
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      disabled={!!feedback}
                      className="w-full bg-slate-800/80 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-sm font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase tracking-widest placeholder:text-slate-700"
                      placeholder="IDENTIFY STAFF"
                    />
                  </div>
                  <button className="w-full bg-white text-black font-black py-4.5 rounded-2xl uppercase italic tracking-[0.2em] text-xs active:scale-95 transition-all shadow-xl">
                    Submit Guess
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {gameState === 'RESULTS' && (
          <div className="text-center bg-slate-900/30 p-10 rounded-[3rem] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-700 space-y-6">
            <div className="bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <Trophy size={32} className="text-yellow-500" />
            </div>
            <h2 className="text-3xl font-black italic uppercase leading-tight tracking-tighter">Round Complete</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/40 p-4 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black uppercase text-slate-600 mb-2 tracking-[0.2em]">Score</p>
                <p className="text-2xl font-black text-indigo-400">{score}</p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black uppercase text-slate-600 mb-2 tracking-[0.2em]">Best Streak</p>
                <p className="text-2xl font-black text-orange-400">{maxStreak}</p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black uppercase text-slate-600 mb-2 tracking-[0.2em]">Accuracy</p>
                <p className="text-2xl font-black text-green-400">
                  {shuffledStaff.length > 0 ? Math.round((correctCount / shuffledStaff.length) * 100) : 0}%
                </p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black uppercase text-slate-600 mb-2 tracking-[0.2em]">Time</p>
                <p className="text-2xl font-black text-slate-300">
                  {startTime ? formatTime(Math.round((Date.now() - startTime) / 1000)) : '—'}
                </p>
              </div>
            </div>

            {!savedToBoard && (
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Save to Leaderboard</p>
                <input
                  type="text"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveScore()}
                  maxLength={30}
                  placeholder="YOUR NAME"
                  className="w-full bg-slate-800/80 border border-white/10 rounded-2xl py-4 px-5 text-sm font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase tracking-widest placeholder:text-slate-700 text-center"
                />
                <button
                  onClick={handleSaveScore}
                  disabled={!playerName.trim() || saving}
                  className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase italic tracking-[0.15em] text-xs hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-600/20"
                >
                  {saving ? 'Saving…' : 'Save Score'}
                </button>
              </div>
            )}

            <button
              onClick={() => setGameState('MENU')}
              className="w-full bg-slate-800/40 text-slate-400 py-4 rounded-2xl font-black uppercase italic tracking-[0.15em] text-xs hover:bg-slate-800 hover:text-white transition-all"
            >
              New Session
            </button>
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {gameState === 'LEADERBOARD' && (
          <div className="bg-slate-900/30 rounded-[2.5rem] border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" />
              <h2 className="text-sm font-black italic uppercase tracking-[0.15em]">All-Time Leaderboard</h2>
              {!isSupabaseConfigured && (
                <span className="ml-auto text-[8px] font-black uppercase tracking-[0.15em] text-slate-600 bg-slate-800 px-2 py-1 rounded-full">Local</span>
              )}
            </div>

            {leaderboardLoading ? (
              <div className="py-16 text-center text-slate-600 text-xs font-black uppercase tracking-[0.2em]">Loading…</div>
            ) : leaderboard.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">No scores yet</p>
                <p className="text-slate-700 text-[10px]">Be the first to play!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry, i) => (
                  <div key={entry.id || i} className="flex items-center gap-3 px-5 py-3.5">
                    <span className={`text-[10px] font-black w-5 text-center ${
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-700'
                    }`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase tracking-wide truncate">{entry.player_name}</p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                        {entry.accuracy}% acc · {formatTime(entry.time_seconds)}
                        {entry.crowns > 0 && ` · ${entry.crowns} streak`}
                      </p>
                    </div>
                    <span className="text-sm font-black text-indigo-400 shrink-0">{entry.score}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-5 border-t border-white/5">
              <button
                onClick={() => setGameState('MENU')}
                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic tracking-[0.15em] text-xs active:scale-95 transition-all shadow-xl"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-6 text-[8px] font-black text-slate-800 uppercase tracking-[0.8em] opacity-50">
        STEM Division // IU29 Schuylkill
      </footer>
    </div>
  );
};

export default App;
