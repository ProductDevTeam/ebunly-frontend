"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

const NotificationContext = createContext(null);

let _id = 0;
const genId = () => ++_id;

// ── Device detection ───────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const icons = {
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8.5L7 10.5L11 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5L14.5 13.5H1.5L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 6v3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7v4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  ),
};

// ── Config ─────────────────────────────────────────────────────────────────
const CONFIG = {
  error: {
    icon: icons.error,
    accent: "#EF4444",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
  },
  success: {
    icon: icons.success,
    accent: "#22C55E",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  warning: {
    icon: icons.warning,
    accent: "#F59E0B",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  info: {
    icon: icons.info,
    accent: "#3B82F6",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
};

// ── Single Toast ───────────────────────────────────────────────────────────
function Toast({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onDismiss,
  isMobile,
}) {
  const cfg = CONFIG[type] || CONFIG.info;
  const timerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef(Date.now());

  // Drag motion values for swipe-to-dismiss on mobile
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(
    dragX,
    [-80, -20, 0, 20, 80],
    [0, 0.6, 1, 0.6, 0],
  );
  const dragScale = useTransform(dragX, [-80, 0, 80], [0.92, 1, 0.92]);

  const remaining = duration - elapsed;

  const startTimer = useCallback(() => {
    startedAt.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(id), remaining);
  }, [id, remaining, onDismiss]);

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    setElapsed((e) => e + (Date.now() - startedAt.current));
    setPaused(true);
  };

  const resumeTimer = () => {
    setPaused(false);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, []);

  // ── Screen-adaptive motion props ──────────────────────────────────────
  const motionProps = isMobile
    ? {
        // Mobile: fall from top like a native iOS/Android notification
        initial: { opacity: 0, y: -52, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: {
          opacity: 0,
          y: -36,
          scale: 0.94,
          transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
        },
        transition: { type: "spring", stiffness: 460, damping: 34, mass: 0.75 },
        // Swipe-to-dismiss
        drag: "x",
        dragConstraints: { left: 0, right: 0 },
        dragElastic: 0.2,
        whileDrag: { cursor: "grabbing" },
        onDragEnd: (_, info) => {
          if (Math.abs(info.offset.x) > 55 || Math.abs(info.velocity.x) > 450) {
            onDismiss(id);
          }
        },
        style: { x: dragX, opacity: dragOpacity, scale: dragScale },
      }
    : {
        // Desktop: glide in from the right with a subtle blur reveal
        initial: { opacity: 0, x: 52, scale: 0.93, filter: "blur(6px)" },
        animate: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
        exit: {
          opacity: 0,
          x: 36,
          scale: 0.96,
          filter: "blur(3px)",
          transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
        },
        transition: { type: "spring", stiffness: 360, damping: 30, mass: 0.85 },
      };

  return (
    <motion.div
      layout
      {...motionProps}
      onMouseEnter={!isMobile ? pauseTimer : undefined}
      onMouseLeave={!isMobile ? resumeTimer : undefined}
      className={`
        relative overflow-hidden select-none
        bg-white/96 backdrop-blur-2xl
        shadow-[0_2px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.05)]
        border border-white/60
        ${isMobile ? "w-full rounded-[18px]" : "w-[320px] rounded-2xl"}
      `}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        WebkitBackdropFilter: "blur(24px)",
        ...(motionProps.style || {}),
      }}
    >
      {/* Top centre pill indicator */}
      <div className="flex justify-center pt-2.5 pb-0">
        <motion.div
          className="rounded-full"
          style={{ background: cfg.accent, height: 3 }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 28, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Content row */}
      <div className="flex items-center gap-3 px-3 pt-2 pb-3">
        {/* Icon badge */}
        <motion.div
          className="shrink-0 w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
          style={{ background: cfg.iconBg, color: cfg.iconColor }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.05,
            type: "spring",
            stiffness: 400,
            damping: 22,
          }}
        >
          {cfg.icon}
        </motion.div>

        {/* Text */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.22 }}
        >
          {title && (
            <p className="font-semibold text-[13px] leading-tight text-gray-900 truncate">
              {title}
            </p>
          )}
          {message && (
            <p
              className={`text-[12px] leading-snug text-gray-500 line-clamp-2 ${title ? "mt-0.5" : ""}`}
            >
              {message}
            </p>
          )}
        </motion.div>

        {/* Close button */}
        <button
          onClick={() => onDismiss(id)}
          className="shrink-0 w-[26px] h-[26px] rounded-[8px] flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 active:scale-95 transition-all"
          aria-label="Dismiss"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path
              d="M1 1L8 8M8 1L1 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar — bottom edge, 1.5px */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black/[0.04]">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: cfg.accent, opacity: 0.7 }}
          initial={{ width: "100%" }}
          animate={paused ? {} : { width: "0%" }}
          transition={
            paused
              ? { duration: 0 }
              : { duration: remaining / 1000, ease: "linear" }
          }
        />
      </div>

      {/* Swipe dismiss hint overlay (mobile only) */}
      {isMobile && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-[18px]"
          style={{
            opacity: useTransform(dragX, [-30, -8, 8, 30], [1, 0, 0, 1]),
            background: "rgba(239,68,68,0.06)",
          }}
        >
          <p className="text-[10px] font-bold text-red-400 tracking-widest uppercase">
            Swipe to dismiss
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Toast Container ────────────────────────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`
        fixed z-[9999] flex flex-col pointer-events-none
        ${
          isMobile
            ? "top-[env(safe-area-inset-top,16px)] left-0 right-0 items-center gap-2 px-4 pt-4"
            : "top-5 right-5 items-end gap-2"
        }
      `}
      aria-live="polite"
      aria-atomic="false"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout="position"
            className={`pointer-events-auto ${isMobile ? "w-full" : ""}`}
          >
            <Toast {...t} onDismiss={onDismiss} isMobile={isMobile} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────────────
export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    ({ type = "info", title, message, duration = 5000 }) => {
      const id = genId();
      setToasts((prev) => [
        ...prev.slice(-4),
        { id, type, title, message, duration },
      ]);
      return id;
    },
    [],
  );

  const error = useCallback(
    (message, title = "Something went wrong") =>
      notify({ type: "error", title, message }),
    [notify],
  );
  const success = useCallback(
    (message, title = "Success") => notify({ type: "success", title, message }),
    [notify],
  );
  const warning = useCallback(
    (message, title = "Heads up") =>
      notify({ type: "warning", title, message }),
    [notify],
  );
  const info = useCallback(
    (message, title) => notify({ type: "info", title, message }),
    [notify],
  );

  return (
    <NotificationContext.Provider
      value={{ notify, error, success, warning, info, dismiss }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotification must be used within <NotificationProvider>",
    );
  return ctx;
}
