import React, { useState, useEffect, useCallback, useMemo } from "react";

// ---- Core scheduling logic -------------------------------------------
// Reviews compound: each interval is added to the PREVIOUS review day,
// not to the posting day directly. So the day-offsets from posting are
// the cumulative sum of the raw interval sequence.
const RAW_INTERVALS = [1, 3, 6, 10, 15, 20, 28, 36, 45, 55];
const OFFSETS = RAW_INTERVALS.reduce((acc, v, i) => {
  acc.push((acc[i - 1] || 0) + v);
  return acc;
}, []); // [1, 4, 10, 20, 35, 55, 83, 119, 164, 219]
const SPAN_DAYS = OFFSETS[OFFSETS.length - 1]; // 219

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateOnly(d) {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}
function addDays(date, days) {
  const nd = new Date(date);
  nd.setDate(nd.getDate() + days);
  return nd;
}
function daysBetween(a, b) {
  return Math.round((toDateOnly(b) - toDateOnly(a)) / MS_PER_DAY);
}
function formatDate(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function formatShort(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function todayISO() {
  return toDateOnly(new Date()).toISOString().slice(0, 10);
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Build the full checkpoint list (post + 10 reviews) for one video.
function buildCheckpoints(video) {
  const postDate = toDateOnly(new Date(video.postDate + "T00:00:00"));
  const checkpoints = [{ kind: "post", index: -1, date: postDate, offset: 0 }];
  OFFSETS.forEach((off, i) => {
    checkpoints.push({ kind: "review", index: i, date: addDays(postDate, off), offset: off });
  });
  return checkpoints;
}

function statusFor(checkpoint, completedSet, today) {
  if (checkpoint.kind === "post") return "post";
  const done = completedSet.has(checkpoint.index);
  if (done) return "done";
  const diff = daysBetween(today, checkpoint.date);
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  return "upcoming";
}

const STATUS_COLOR = {
  post: "var(--ink)",
  done: "var(--signal-done)",
  overdue: "var(--signal-overdue)",
  today: "var(--signal-due)",
  upcoming: "var(--line)",
};

const STORAGE_KEY = "video-review-tracker-v1";

export default function ReviewTracker() {
  const [videos, setVideos] = useState(null); // null = loading
  const [completed, setCompleted] = useState({}); // { videoId: [indices] }
  const [tab, setTab] = useState("today");
  const [name, setName] = useState("");
  const [postDate, setPostDate] = useState(todayISO());
  const [saveError, setSaveError] = useState(false);
  const today = useMemo(() => toDateOnly(new Date()), []);

  // load
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setVideos(parsed.videos || []);
          setCompleted(parsed.completed || {});
        } else {
          setVideos([]);
          setCompleted({});
        }
      } catch (e) {
        setVideos([]);
        setCompleted({});
      }
    })();
  }, []);

  const persist = useCallback(async (nextVideos, nextCompleted) => {
    try {
      const result = await window.storage.set(
        STORAGE_KEY,
        JSON.stringify({ videos: nextVideos, completed: nextCompleted }),
        false
      );
      if (!result) setSaveError(true);
      else setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  }, []);

  const addVideo = (e) => {
    e.preventDefault();
    if (!name.trim() || !postDate) return;
    const v = { id: uid(), name: name.trim(), postDate };
    const next = [...videos, v];
    setVideos(next);
    persist(next, completed);
    setName("");
    setPostDate(todayISO());
  };

  const removeVideo = (id) => {
    const next = videos.filter((v) => v.id !== id);
    const nextCompleted = { ...completed };
    delete nextCompleted[id];
    setVideos(next);
    setCompleted(nextCompleted);
    persist(next, nextCompleted);
  };

  const toggleReview = (videoId, index) => {
    const set = new Set(completed[videoId] || []);
    if (set.has(index)) set.delete(index);
    else set.add(index);
    const nextCompleted = { ...completed, [videoId]: Array.from(set) };
    setCompleted(nextCompleted);
    persist(videos, nextCompleted);
  };

  // Build the "due" queue across all videos
  const dueQueue = useMemo(() => {
    if (!videos) return { overdue: [], dueToday: [], upcoming: [] };
    const overdue = [], dueToday = [], upcoming = [];
    videos.forEach((v) => {
      const set = new Set(completed[v.id] || []);
      const cps = buildCheckpoints(v).filter((c) => c.kind === "review");
      cps.forEach((c) => {
        if (set.has(c.index)) return;
        const diff = daysBetween(today, c.date);
        const entry = { video: v, checkpoint: c, diff };
        if (diff < 0) overdue.push(entry);
        else if (diff === 0) dueToday.push(entry);
        else if (diff <= 7) upcoming.push(entry);
      });
    });
    overdue.sort((a, b) => a.diff - b.diff);
    upcoming.sort((a, b) => a.diff - b.diff);
    return { overdue, dueToday, upcoming };
  }, [videos, completed, today]);

  if (videos === null) {
    return (
      <div style={styles.root}>
        <style>{globalCss}</style>
        <div style={{ padding: 40, color: "var(--paper)", fontFamily: "var(--font-body)" }}>
          Loading cadence…
        </div>
      </div>
    );
  }

  const totalDue = dueQueue.overdue.length + dueQueue.dueToday.length;

  return (
    <div style={styles.root}>
      <style>{globalCss}</style>

      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>REVIEW CADENCE</div>
          <h1 style={styles.h1}>On-Air Log</h1>
          <div style={styles.sub}>
            10 checkpoints per video · day 1 through day {SPAN_DAYS} (~
            {Math.round(SPAN_DAYS / 30.4)} months) after posting
          </div>
        </div>
        {totalDue > 0 && (
          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            {totalDue} due now
          </div>
        )}
      </header>

      <nav style={styles.tabs}>
        {[
          { id: "today", label: "Today" },
          { id: "videos", label: "Videos" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...styles.tabBtn,
              ...(tab === t.id ? styles.tabBtnActive : {}),
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {saveError && (
        <div style={styles.errorBanner}>
          Couldn't save — your changes may not persist. Try again in a moment.
        </div>
      )}

      {tab === "today" && (
        <TodayView videos={videos} dueQueue={dueQueue} onToggle={toggleReview} today={today} />
      )}

      {tab === "videos" && (
        <VideosView
          videos={videos}
          completed={completed}
          onAdd={addVideo}
          onRemove={removeVideo}
          onToggle={toggleReview}
          name={name}
          setName={setName}
          postDate={postDate}
          setPostDate={setPostDate}
          today={today}
        />
      )}
    </div>
  );
}

// ---- Today tab ----------------------------------------------------------

function TodayView({ videos, dueQueue, onToggle, today }) {
  const { overdue, dueToday, upcoming } = dueQueue;
  const nothingUrgent = overdue.length === 0 && dueToday.length === 0;

  if (videos.length === 0) {
    return (
      <EmptyState
        title="No videos logged yet"
        body="Add a video in the Videos tab to start its review cadence."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {overdue.length > 0 && (
        <Section title="Overdue" count={overdue.length} accent="var(--signal-overdue)">
          {overdue.map((e) => (
            <DueRow key={e.video.id + e.checkpoint.index} entry={e} onToggle={onToggle} tone="overdue" />
          ))}
        </Section>
      )}

      <Section
        title="Due today"
        count={dueToday.length}
        accent="var(--signal-due)"
        empty={nothingUrgent && overdue.length === 0 ? "All caught up — nothing due today." : null}
      >
        {dueToday.map((e) => (
          <DueRow key={e.video.id + e.checkpoint.index} entry={e} onToggle={onToggle} tone="today" />
        ))}
      </Section>

      {upcoming.length > 0 && (
        <Section title="Next 7 days" count={upcoming.length} accent="var(--line)">
          {upcoming.map((e) => (
            <DueRow key={e.video.id + e.checkpoint.index} entry={e} onToggle={onToggle} tone="upcoming" />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, count, accent, children, empty }) {
  return (
    <div>
      <div style={styles.sectionHead}>
        <span style={{ ...styles.sectionDot, background: accent }} />
        <span style={styles.sectionTitle}>{title}</span>
        <span style={styles.sectionCount}>{count}</span>
      </div>
      {empty ? (
        <div style={styles.sectionEmpty}>{empty}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
      )}
    </div>
  );
}

function DueRow({ entry, onToggle, tone }) {
  const { video, checkpoint, diff } = entry;
  const label =
    tone === "overdue"
      ? `${Math.abs(diff)}d overdue`
      : tone === "today"
      ? "today"
      : `in ${diff}d`;
  return (
    <div style={styles.dueRow}>
      <button
        aria-label="Mark review done"
        onClick={() => onToggle(video.id, checkpoint.index)}
        style={{
          ...styles.checkCircle,
          borderColor: STATUS_COLOR[tone === "overdue" ? "overdue" : tone === "today" ? "today" : "upcoming"],
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={styles.dueRowTitle}>{video.name}</div>
        <div style={styles.dueRowMeta}>
          Review {checkpoint.index + 1} of {OFFSETS.length} · {formatShort(checkpoint.date)}
        </div>
      </div>
      <div
        style={{
          ...styles.duePill,
          color: STATUS_COLOR[tone === "overdue" ? "overdue" : tone === "today" ? "today" : "upcoming"],
          borderColor: STATUS_COLOR[tone === "overdue" ? "overdue" : tone === "today" ? "today" : "upcoming"],
        }}
      >
        {label}
      </div>
    </div>
  );
}

function EmptyState({ title, body }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyTitle}>{title}</div>
      <div style={styles.emptyBody}>{body}</div>
    </div>
  );
}

// ---- Videos tab -----------------------------------------------------------

function VideosView({ videos, completed, onAdd, onRemove, onToggle, name, setName, postDate, setPostDate, today }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <form onSubmit={onAdd} style={styles.form}>
        <div style={styles.formRow}>
          <label style={styles.label}>
            Video name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kitchen renovation walkthrough"
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Posted on
            <input
              type="date"
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              style={styles.input}
              required
            />
          </label>
        </div>
        <button type="submit" style={styles.addBtn}>
          + Add video
        </button>
      </form>

      {videos.length === 0 ? (
        <EmptyState title="Nothing logged" body="Add your first video above to generate its cadence." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {videos
            .slice()
            .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
            .map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                completedIndices={new Set(completed[v.id] || [])}
                onRemove={onRemove}
                onToggle={onToggle}
                today={today}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, completedIndices, onRemove, onToggle, today }) {
  const checkpoints = buildCheckpoints(video);
  const reviewsDone = completedIndices.size;

  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <div>
          <div style={styles.cardTitle}>{video.name}</div>
          <div style={styles.cardMeta}>
            Posted {formatDate(toDateOnly(new Date(video.postDate + "T00:00:00")))} · {reviewsDone}/{OFFSETS.length} reviewed
          </div>
        </div>
        <button onClick={() => onRemove(video.id)} style={styles.removeBtn} aria-label="Remove video">
          ×
        </button>
      </div>

      <div style={styles.timelineWrap}>
        <div style={styles.timelineLine} />
        {checkpoints.map((c) => {
          const status = statusFor(c, completedIndices, today);
          const leftPct = (c.offset / SPAN_DAYS) * 100;
          const clickable = c.kind === "review";
          return (
            <button
              key={c.kind + c.index}
              disabled={!clickable}
              onClick={() => clickable && onToggle(video.id, c.index)}
              title={
                c.kind === "post"
                  ? `Posted ${formatDate(c.date)}`
                  : `Review ${c.index + 1} · ${formatDate(c.date)} · ${status}`
              }
              style={{
                ...styles.dot,
                left: `${leftPct}%`,
                background: status === "done" || status === "today" ? STATUS_COLOR[status] : "transparent",
                borderColor: STATUS_COLOR[status],
                cursor: clickable ? "pointer" : "default",
                boxShadow: status === "today" ? `0 0 0 4px color-mix(in srgb, var(--signal-due) 25%, transparent)` : "none",
              }}
            />
          );
        })}
      </div>
      <div style={styles.timelineAxis}>
        <span>day 0</span>
        <span>day {SPAN_DAYS}</span>
      </div>
    </div>
  );
}

// ---- Styles ---------------------------------------------------------------

const globalCss = `
:root {
  --ink: #10141a;
  --panel: #171c24;
  --panel-raised: #1e2530;
  --paper: #eee9df;
  --paper-dim: #a9aeb8;
  --line: #3a4250;
  --signal-due: #e8a33d;
  --signal-done: #5f9c7a;
  --signal-overdue: #c1543c;
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-body: ui-sans-serif, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
}
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
button { font-family: inherit; }
input:focus, button:focus-visible {
  outline: 2px solid var(--signal-due);
  outline-offset: 2px;
}
`;

const styles = {
  root: {
    background: "var(--ink)",
    color: "var(--paper)",
    fontFamily: "var(--font-body)",
    minHeight: "100%",
    padding: "28px 20px 60px",
    maxWidth: 720,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 22,
  },
  eyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.14em",
    color: "var(--signal-due)",
    marginBottom: 6,
  },
  h1: {
    fontFamily: "var(--font-display)",
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.01em",
  },
  sub: {
    fontFamily: "var(--font-mono)",
    fontSize: 12.5,
    color: "var(--paper-dim)",
    marginTop: 8,
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "var(--font-mono)",
    fontSize: 12.5,
    color: "var(--signal-due)",
    border: "1px solid var(--signal-due)",
    borderRadius: 999,
    padding: "6px 12px",
    whiteSpace: "nowrap",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--signal-due)",
    display: "inline-block",
  },
  tabs: {
    display: "flex",
    gap: 4,
    borderBottom: "1px solid var(--line)",
    marginBottom: 26,
  },
  tabBtn: {
    background: "transparent",
    border: "none",
    color: "var(--paper-dim)",
    fontFamily: "var(--font-display)",
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 4px",
    marginRight: 22,
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  },
  tabBtnActive: {
    color: "var(--paper)",
    borderBottom: "2px solid var(--signal-due)",
  },
  errorBanner: {
    background: "color-mix(in srgb, var(--signal-overdue) 15%, var(--panel))",
    border: "1px solid var(--signal-overdue)",
    color: "var(--paper)",
    fontSize: 13,
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block",
  },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 15,
    fontWeight: 600,
  },
  sectionCount: {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "var(--paper-dim)",
  },
  sectionEmpty: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "var(--paper-dim)",
    padding: "10px 0",
  },
  dueRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 10,
    padding: "12px 14px",
  },
  checkCircle: {
    width: 18,
    height: 18,
    minWidth: 18,
    borderRadius: "50%",
    border: "2px solid",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
  },
  dueRowTitle: {
    fontSize: 14.5,
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dueRowMeta: {
    fontFamily: "var(--font-mono)",
    fontSize: 11.5,
    color: "var(--paper-dim)",
    marginTop: 2,
  },
  duePill: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    border: "1px solid",
    borderRadius: 999,
    padding: "3px 9px",
    whiteSpace: "nowrap",
  },
  empty: {
    border: "1px dashed var(--line)",
    borderRadius: 12,
    padding: "36px 20px",
    textAlign: "center",
  },
  emptyTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 13.5,
    color: "var(--paper-dim)",
  },
  form: {
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  formRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  label: {
    flex: "1 1 200px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontFamily: "var(--font-mono)",
    fontSize: 11.5,
    color: "var(--paper-dim)",
  },
  input: {
    background: "var(--panel-raised)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: "9px 10px",
    color: "var(--paper)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
  },
  addBtn: {
    alignSelf: "flex-start",
    background: "var(--signal-due)",
    color: "var(--ink)",
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontWeight: 700,
    fontSize: 13.5,
    cursor: "pointer",
  },
  card: {
    background: "var(--panel)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    padding: "16px 18px 14px",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
  },
  cardMeta: {
    fontFamily: "var(--font-mono)",
    fontSize: 11.5,
    color: "var(--paper-dim)",
    marginTop: 4,
  },
  removeBtn: {
    background: "transparent",
    border: "1px solid var(--line)",
    color: "var(--paper-dim)",
    borderRadius: 6,
    width: 24,
    height: 24,
    lineHeight: 1,
    cursor: "pointer",
    fontSize: 15,
  },
  timelineWrap: {
    position: "relative",
    height: 20,
    margin: "0 4px",
  },
  timelineLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    background: "var(--line)",
    transform: "translateY(-50%)",
  },
  dot: {
    position: "absolute",
    top: "50%",
    width: 12,
    height: 12,
    borderRadius: "50%",
    border: "2px solid",
    transform: "translate(-50%, -50%)",
    padding: 0,
  },
  timelineAxis: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--paper-dim)",
    marginTop: 6,
  },
};
